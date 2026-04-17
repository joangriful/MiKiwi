import React, { useState } from 'react';

// Iconos SVG inline
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export default function Collections() {
  const [darkMode, setDarkMode] = useState(false);

  const categories = [
    {
      id: 1,
      title: 'Dildos',
      subtitle: 'Realistas y únicos',
      description: 'Descubre nuestra colección premium',
      featured: true
    },
    {
      id: 2,
      title: 'Vibradores',
      subtitle: 'Placer intenso',
      description: 'Explora nuevas sensaciones',
      featured: false
    },
    {
      id: 3,
      title: 'Consoladores',
      subtitle: 'Diseño ergonómico',
      description: 'Comodidad y placer garantizado',
      featured: false
    },
    {
      id: 4,
      title: 'Succionadores',
      subtitle: 'Tecnología avanzada',
      description: 'Experiencias que activan tu mente',
      featured: true
    },
    {
      id: 5,
      title: 'Lubricantes',
      subtitle: 'Fórmulas premium',
      description: 'Suavidad y confort',
      featured: false
    },
    {
      id: 6,
      title: 'Aceites & Cosmética',
      subtitle: 'Cuidado íntimo',
      description: 'Productos naturales de calidad',
      featured: false
    }
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <style>{`
        :root {
          --color-primary: #99b849;
          --color-primary-dark: #7a943a;
          --color-secondary: #f8b7ea;
          --color-secondary-dark: #d697c8;
          --bg-main: #f8f5f0;
          --bg-surface: #ffffff;
          --text-main: #222b24;
          --text-muted: #66672a;
          --border: #e2e0db;
          --shadow-sm: 0 2px 4px rgba(34, 43, 36, 0.05);
          --shadow-md: 0 4px 12px rgba(34, 43, 36, 0.08);
          --shadow-lg: 0 10px 25px rgba(34, 43, 36, 0.12);
        }

        .dark {
          --bg-main: #222b24;
          --bg-surface: #2d3830;
          --text-main: #f8f5f0;
          --text-muted: #99b849;
          --border: #424d44;
          --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
          --shadow-md: 0 8px 20px rgba(0, 0, 0, 0.4);
          --shadow-lg: 0 15px 35px rgba(0, 0, 0, 0.5);
        }

        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>

      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }} className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
              MIKIWI
            </div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#" style={{ color: 'var(--text-main)' }} className="hover:opacity-70 transition-opacity">INICIO</a>
              <a href="#" style={{ color: 'var(--text-main)' }} className="hover:opacity-70 transition-opacity">CATEGORÍAS</a>
              <a href="#" style={{ color: 'var(--text-main)' }} className="hover:opacity-70 transition-opacity">NOVEDADES</a>
              <a href="#" style={{ color: 'var(--text-main)' }} className="hover:opacity-70 transition-opacity">CONTACTO</a>
            </nav>
            <div className="flex items-center space-x-5">
              <button
                onClick={toggleTheme}
                className="hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-main)' }}
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <div className="hover:opacity-70 cursor-pointer transition-opacity" style={{ color: 'var(--text-main)' }}>
                <UserIcon />
              </div>
              <div className="hover:opacity-70 cursor-pointer transition-opacity" style={{ color: 'var(--text-main)' }}>
                <ShoppingCartIcon />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-light mb-4 tracking-wide" style={{ color: 'var(--text-main)' }}>
              Nuestras Categorías
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Explora nuestra selección curada de productos
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  minHeight: '320px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Accent Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-2"
                  style={{ backgroundColor: index % 3 === 0 ? 'var(--color-primary)' : index % 3 === 1 ? 'var(--color-secondary)' : 'var(--text-muted)' }}
                ></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-8">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {category.subtitle}
                    </p>
                    <h3 className="text-2xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>
                      {category.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {category.description}
                    </p>
                    <button
                      className="inline-flex items-center text-sm font-medium mt-4 group-hover:gap-2 transition-all duration-300"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Ver más
                      <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 mt-12" style={{ backgroundColor: 'var(--bg-surface)', borderTop: `1px solid var(--border)`, borderBottom: `1px solid var(--border)` }}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-light mb-4" style={{ color: 'var(--text-main)' }}>
              ¿Necesitas ayuda?
            </h3>
            <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              Contáctanos para asesoramiento personalizado
            </p>
            <button
              className="px-8 py-3 rounded-lg font-medium text-sm transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none'
              }}
            >
              Contactar
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 mt-16" style={{ backgroundColor: 'var(--bg-surface)', borderTop: `1px solid var(--border)` }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                  MIKIWI
                </h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  Tu tienda de confianza para el bienestar íntimo
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Enlaces</h5>
                <ul className="space-y-2" style={{ color: 'var(--text-muted)' }}>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Sobre Nosotros</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Envíos</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Devoluciones</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Legal</h5>
                <ul className="space-y-2" style={{ color: 'var(--text-muted)' }}>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Política de Privacidad</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Términos de Uso</a></li>
                  <li><a href="#" className="hover:opacity-70 transition-opacity">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 text-center text-sm" style={{ borderTop: `1px solid var(--border)`, color: 'var(--text-muted)' }}>
              <p>© 2024 MIKIWI STORE. Solo para mayores de 18 años.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
