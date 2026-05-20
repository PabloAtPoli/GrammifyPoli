'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', overflow: 'hidden' }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '-100px',
          right: '-100px',
          animation: 'float 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          bottom: '-50px',
          left: '-50px',
          animation: 'float 25s ease-in-out infinite reverse',
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-title {
          animation: slideInUp 0.8s ease-out;
        }
        .hero-subtitle {
          animation: slideInUp 0.8s ease-out 0.2s both;
        }
        .hero-button {
          animation: slideInUp 0.8s ease-out 0.4s both;
        }
        .feature-card {
          animation: slideInUp 0.8s ease-out both;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 20px' }}>
        
        {/* Hero Section */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '20px',
            letterSpacing: '-2px',
            lineHeight: 1.1,
          }}>
            Master Grammar with <span style={{ background: 'linear-gradient(120deg, #ffd700, #ffed4e)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Precision</span>
          </h1>
          
          <p className="hero-subtitle" style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            Analyze, edit, and perfect your sentences. Grammify helps you understand sentence structure and improve your writing with ease.
          </p>

          <div className="hero-button" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sentences" style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            }}>
              Start Analyzing
            </Link>
            <a href="#features" style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '50px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}>
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '60px' }}>
            Powerful Features
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '80px',
          }}>
            {[
              {
                icon: '📝',
                title: 'Create & Edit',
                description: 'Easily create and edit sentences with instant feedback on structure and type.',
                delay: '0s',
              },
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'Search through your sentence database quickly with powerful filters.',
                delay: '0.2s',
              },
              {
                icon: '📊',
                title: 'Analyze Structure',
                description: 'Understand sentence composition and grammatical patterns at a glance.',
                delay: '0.4s',
              },
            ].map((feature, idx) => (
              <div key={idx} className="feature-card" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '40px',
                backdropFilter: 'blur(10px)',
                animationDelay: feature.delay,
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#333', marginBottom: '15px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '60px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
            }}>
              {[
                { number: '100%', label: 'Accuracy' },
                { number: '24/7', label: 'Available' },
                { number: '∞', label: 'Sentences' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffd700', marginBottom: '10px' }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '30px' }}>
              Ready to improve your writing?
            </h2>
            <Link href="/sentences" style={{
              padding: '18px 50px',
              fontSize: '1.2rem',
              fontWeight: 700,
              background: '#ffd700',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.25)';
            }}>
              Start Now →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

