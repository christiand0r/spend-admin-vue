/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'linear-app': 'linear-gradient(180deg, rgba(59 130 246) 60%, rgba(249,250,251,1) 60%);'
      },
      transitionProperty: {
        'spacing': 'margin, width, transform',
      }
    },
  },
  plugins: [],
}