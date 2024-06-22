/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        'h-xs': {'raw': '(min-height: 460px)'},
        'h-sm': {'raw': '(min-height: 640px)'},
        'h-md': {'raw': '(min-height: 768px)'},
        'h-lg': {'raw': '(min-height: 1024px)'},
        'h-xl': {'raw': '(min-height: 1280px)'},
      },
      minHeight: {
        'fit': 'fit-content'
      },
      height: {
        'fit': 'fit-content'
      },
      colors: {
        slate: {
          default: '#0d1427',
          100: '#e0e4eb',
          200: '#b3bccd',
          300: '#8090aa',
          400: '#4d6486',
          500: '#1b395d',
          600: '#172f4d',
          700: '#12243e',
          800: '#0d192e',
          900: '#090f1f',
        },
      }
    },
  },
  plugins: [],
}

