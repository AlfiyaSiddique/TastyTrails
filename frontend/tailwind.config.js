/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '15vh': '15vh', // Add custom height
      },
    },
    fontFamily: {
      sans: ['Roboto', 'Merriweather'],
    }
  },
  plugins: [],
}
