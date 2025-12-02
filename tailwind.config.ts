// tailwind.config.ts  ← FINAL VERSION (copy-paste this)
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  presets: [require('@medusajs/ui-preset')], // ← DO NOT TOUCH — this is sacred

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
    './node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // YOUR FULL OLD COLOR PALETTE — safe to add
      colors: {
        red: '#A41E22',
        redOrange: '#CB5722',
        orange: '#F09120',
        orangeYellow: '#EAA121',
        yellow: '#E1B324',
        yellowOlive: '#B4AA45',
        olive: '#869F66',
        oliveGreen: '#6BA155',
        green: '#4DA446',
        greenAqua: '#419279',
        aqua: '#1D9F97',
        aquaColbolt: '#3482AD',
        colbalt: '#3482AD',
        colbaltBlue: '#3770AA',
        blue: '#3B5BA9',
        bluePurple: '#50559A',
        purple: '#674D8C',
        dark: '#393A3A',

        nav: '#ECECEC',
        background: '#EDEDED',
        'light-dark': '#aaaaaa',
        'dark-fill': '#666666',
        'filter-dark': '#777777',
        'art-list': '#F8F8F8',
        menu: '#717171',
        error: '#BE4352',
        'less-dark': '#5E5E5E',
        pin: '#9E5D5D',
        text: '#333333',
        'text-light': '#666666',
        accent: '#E1B324',
        'accent-light': '#EAA121',
      },

      // YOUR CUSTOM TRANSITIONS (safe to add)
      transitionDuration: {
        fast: '500ms',
        slow: '1000ms',
      },

      // YOUR BREAKPOINT
      screens: {
        desktop: '769px',
      },

      // OPTIONAL: nicer font setup
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },

  plugins: [
    require('tailwindcss-radix')(),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config