/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 1.5s infinite ease-in-out',
      },
    },  
    fontFamily: {
      sans: ['Roboto', 'Merriweather'],
    }
  },
  plugins: [],
}
