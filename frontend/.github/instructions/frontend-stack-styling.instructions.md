---
description: "Use when building Next.js + React frontend with Tailwind CSS, DaisyUI, theme modes, SVG diagrams, or integrating with Django REST Framework backend. Covers styling hierarchy, CSS Modules usage, theme switching, and diagram rendering."
applyTo: "app/**/*.{ts,tsx},src/**/*.{ts,tsx,js,jsx}"
---
# Grammify Frontend Stack & Styling Guidelines

## Tech Stack
- **Frontend**: Next.js + React (App Router), TypeScript
- **Styling**: Tailwind CSS (utilities first) + DaisyUI (components)
- **Diagrams**: SVG with React, styled conditionally per complexity
- **Backend**: Django REST Framework on localhost (API integration)
- **Database**: PostgreSQL (via Django backend)

## Styling Hierarchy

### 1. Tailwind Utilities (Default)
Use Tailwind utility classes for 90% of styling. Compose components from utilities.
```tsx
<button className="btn btn-primary btn-sm rounded-lg">Click me</button>
<div className="flex items-center justify-between gap-4 p-6 bg-base-100">
```

### 2. DaisyUI Components
Use DaisyUI component classes (`btn`, `card`, `navbar`, `dropdown`, `select`, etc.) as the primary semantic layer. They compose Tailwind utilities.
```tsx
<div className="navbar bg-neutral text-neutral-content">
  <div className="flex-1"><a className="btn btn-ghost">Logo</a></div>
</div>
```

### 3. Global CSS (tokens, theme, resets only)
`app/globals.css` or `src/styles/globals.css` should contain:
- CSS custom properties (tokens) for design system values
- Theme configuration and color palettes
- Base resets and typography rules
- App-wide layout rules (e.g., `html { scroll-behavior: smooth; }`)

**Never put component-specific styles here.** Keep it minimal.

### 4. CSS Modules (complex one-off components)
Use CSS Modules **only** for components that are hard to express cleanly with Tailwind utilities.
- File: `src/components/MyComplexComponent.module.css`
- Import: `import styles from './MyComplexComponent.module.css'`
- Use when: animations, complex pseudo-selectors, responsive grid layouts, SVG mask definitions

**Avoid**: Plain CSS for basic layouts; use Tailwind first.

## Theme Modes: Light, Dark, High Contrast

### Theme Provider Setup
- Use **React Context API** + `localStorage` for theme state
- Store theme preference in `localStorage` with key `theme`
- Apply theme to `<html>` root or via DaisyUI's `data-theme` attribute
- Fallback to system preference on first load

**Example provider:**
```tsx
// src/context/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setTheme(stored as any || 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Theme-Aware Components
For components that need conditional styling based on theme:
```tsx
const { theme } = useContext(ThemeContext);
const isDark = theme === 'dark';
const strokeColor = isDark ? '#fff' : '#000';
```

### DaisyUI Theme Extension
Extend DaisyUI themes in `tailwind.config.mjs`:
```js
daisyui: {
  themes: [
    'light',
    'dark',
    {
      'high-contrast': {
        primary: '#000',
        'primary-content': '#fff',
        secondary: '#fff',
        'secondary-content': '#000',
        // ... high-contrast overrides
      }
    }
  ]
}
```

## SVG Diagrams (Reed-Kellogg, Dependency Graphs)

### Styling Approach
- **Simple diagrams**: Inline styles + Tailwind classes on SVG container
- **Complex diagrams**: CSS Modules for mask definitions, animations, reusable patterns

**Example: Simple SVG with React**
```tsx
export function ReedKelloggDiagram({ data, isDarkMode }: Props) {
  const strokeColor = isDarkMode ? '#fff' : '#000';
  const fillColor = isDarkMode ? '#e5e7eb' : '#f3f4f6';

  return (
    <svg className="w-full h-auto bg-base-100 rounded-lg p-4">
      <line x1="0" y1="50" x2="100" y2="50" stroke={strokeColor} />
      {/* diagram nodes */}
    </svg>
  );
}
```

**Example: Complex SVG with CSS Modules**
```css
/* DiagramRenderer.module.css */
.mask {
  mask-image: radial-gradient(circle, transparent 30%, black 70%);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Django REST Framework Integration

### API Endpoints
Call DRF endpoints from frontend:
```tsx
const response = await fetch('http://localhost:8000/api/sentences/', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});
const data = await response.json();
```

### Environment Variables
Store backend URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Use in components:
```tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

## File Structure (Recommended)

```
frontend/
├── app/
│   ├── layout.tsx         (Root layout, ThemeProvider)
│   ├── page.tsx
│   └── sentence-lookup/
│       └── page.tsx
├── src/
│   ├── components/        (Reusable React components)
│   │   ├── SentenceLookup.jsx
│   │   ├── DiagramRenderer.tsx
│   │   ├── DiagramRenderer.module.css
│   │   └── ...
│   ├── context/           (React Context providers)
│   │   └── ThemeContext.tsx
│   ├── hooks/             (Custom React hooks)
│   ├── styles/            (Global CSS, tokens)
│   │   ├── globals.css
│   │   └── tokens.css
│   └── utils/             (API calls, helpers)
│       ├── api.ts
│       └── ...
├── tailwind.config.mjs    (DaisyUI + theme config)
└── tsconfig.json
```

## Common Patterns

### Toggle Theme Button
```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className="btn btn-sm"
      onClick={() => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### Fetch Sentences from Django API
```tsx
async function fetchSentences(mood: string, structure: string) {
  const query = new URLSearchParams({ sentence_type: mood, sentence_structure: structure });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sentences/?${query}`);
  return res.json();
}
```

### SVG with Theme Context
```tsx
export function DependencyGraph({ sentenceId }: Props) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark' || theme === 'high-contrast';

  return (
    <svg className={`w-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* render nodes with theme-aware colors */}
    </svg>
  );
}
```

## Do's and Don'ts

✅ **Do:**
- Use Tailwind utilities for layout, spacing, responsive design
- Use DaisyUI components (`btn`, `card`, `navbar`, `dropdown`) for semantic UI
- Apply theme via `data-theme` attribute and Context API
- Store theme preference in localStorage
- Create CSS Modules only for complex animations or SVG patterns
- Keep global CSS minimal (tokens + base + typography)
- Render SVG diagrams conditionally based on theme and data

❌ **Don't:**
- Write plain CSS for layout or styling (use Tailwind first)
- Put component-specific styles in global CSS
- Override DaisyUI without extending theme in config
- Use CSS-in-JS libraries (stick with Tailwind + optional CSS Modules)
- Hardcode colors; use CSS variables and theme tokens
- Forget to apply theme to SVG diagrams (check isDark/isDarkMode)
