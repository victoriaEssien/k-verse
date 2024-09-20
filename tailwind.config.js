/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        'os': ['Open Sans', 'sans-serif']
      },
      backgroundImage: {
        'hero-bg': "url('/src/assets/images/waitlist-hero-img.png')"
      },
    },
  },
  plugins: [],
}

