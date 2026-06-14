// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        l: '769px',
      },
      colors: {
        // Surfaces
        'surface-page': '#EDEDED',
        'surface-nav': '#ECECEC',
        'surface-list': '#F8F8F8',
        'surface-dark': '#5E5E5E',
        'surface-loader': '#AAAAAA',
        'surface-warm-white': '#F4F2EE',
        // Text
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'text-muted': '#777777',
        'text-menu': '#717171',
        'text-dark': '#3A3F4A',
        // UI chrome
        'ui-line': '#777777',
        'ui-icon': '#333333',
        'ui-fault-heavy': '#3A3F4A',
        'ui-fault-light': '#F0E8C0',
        // Status
        'status-error': '#BE4352',
        // Painting palette — field
        'paint-sky-warm': '#A8D6E8',
        'paint-sky-vivid': '#4AAED4',
        'paint-warm-white': '#F4F2EE',
        'paint-mid-grey': '#B8B8BC',
        'paint-charcoal': '#3A3F4A',
        // Painting palette — accent
        'paint-cream': '#F0E8C0',
        'paint-deep-gold': '#E8C15A',
        'paint-burnt-amber': '#B8742A',
        'paint-terracotta': '#D4785A',
        'paint-dusty-salmon': '#C4907A',
        'paint-burgundy': '#8C3A42',
        'paint-mid-green': '#8BAF62',
        'paint-forest-green': '#2A4A28',
        'paint-gate': '#2A1545',
        // Ornament (future city mapping)
        'ornament-berlin': '#6B420F',
        'ornament-sf': '#1F6A85',
        'ornament-munich': '#8A6A18',
        'ornament-amsterdam': '#4A1520',
        'ornament-ny': '#0F2B0E',
        'ornament-default': '#6B420F',
        // Legacy aliases — remove when all usages migrated
        background: '#EDEDED',
        'nav-background': '#ECECEC',
        'art-list-background': '#F8F8F8',
        'menu-color': '#717171',
        'dark-fill': '#333333',
        'filter-dark': '#777777',
        'light-dark': '#AAAAAA',
        text: '#333333',
        'text-light': '#666666',
        dark: '#3A3F4A',
        'error-red': '#BE4352',
        'less-dark': '#5E5E5E',
      },
      fontFamily: {
        sans: ['var(--font-barlow)', 'sans-serif'],
        display: ['var(--font-limelight)', 'cursive'],
      },
      fontSize: {
        'logo-tag': ['0.75rem', { lineHeight: '1', fontWeight: '400' }],
        'logo-by': ['0.5625rem', { lineHeight: '1', fontWeight: '500' }],
        'small-caps': [
          '0.5625rem',
          { lineHeight: '1', fontWeight: '700', letterSpacing: '0.18em' },
        ],
        'map-caption': ['0.625rem', { lineHeight: '1', fontWeight: '500' }],
        'filter-label': ['0.6875rem', { lineHeight: '1', fontWeight: '700' }],
        'switch-label': ['0.6875rem', { lineHeight: '1', fontWeight: '800' }],
        'filter-city': ['0.875rem', { lineHeight: '1', fontWeight: '500' }],
        body: ['0.875rem', { lineHeight: '1.75', fontWeight: '400' }],
        'artwork-meta': ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'artwork-dim': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],
        'nav-link': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'ar-body': ['1.0625rem', { lineHeight: '1.6', fontWeight: '400' }],
        'artwork-title': ['2.5rem', { lineHeight: '1', fontWeight: '400' }],
        'display-hero': ['3.5rem', { lineHeight: '0.95', fontWeight: '400' }],
        'display-lg': ['2rem', { lineHeight: '1', fontWeight: '400' }],
        'display-md': ['1.75rem', { lineHeight: '1', fontWeight: '400' }],
        'display-sm': ['1.375rem', { lineHeight: '1', fontWeight: '400' }],
      },
      zIndex: {
        map: '1',
        'nav-menu': '100',
        'nav-chrome': '200',
        filter: '300',
        'popup-overlay': '301',
        'map-nav': '2100',
        animation: '10000',
      },
      height: {
        'map-nav': '110px',
        'nav-panel': '470px',
      },
      width: {
        'nav-panel': '300px',
        logo: '200px',
        'arrow-btn': '30px',
      },
      transitionTimingFunction: {
        artwork: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast: '500ms',
        artwork: '600ms',
      },
    },
  },
  plugins: [],
}
