---
description: "Use when writing Next.js pages, layouts, components, or hooks in the frontend app. Enforces SOLID design, App Router conventions, and client/server boundary rules."
applyTo: "app/**/*.{ts,tsx,js,jsx},src/**/*.{ts,tsx,js,jsx}"
---
# Next.js SOLID Principles

- Keep each component focused on a single responsibility.
- Prefer small, composable components over large monoliths.
- Keep pages and layouts thin; move feature logic into reusable modules under `src/`.
- Default to Server Components in the App Router.
- Add `"use client"` only when a component needs state, effects, event handlers, browser APIs, or other client-only behavior.
- Do not pass event handlers from Server Components into Client Components.
- Avoid `next/dynamic` with `ssr: false` inside Server Components; move that logic into a Client Component if needed.
- Separate data fetching, state management, and presentation into different units when a component starts to do more than one job.
- Prefer explicit props and typed interfaces or types for reusable components.
- Avoid prop drilling when composition, context, or a server component boundary keeps the design simpler.
- Keep feature code easy to test by isolating pure logic from UI and side effects.
- Follow the current Next.js App Router conventions for the project, and verify new APIs against the local Next.js docs before using them.
