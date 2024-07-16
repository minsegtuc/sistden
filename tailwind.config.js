/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'myriad-pro': ['Myriad Pro', 'sans-serif'],
      },
      height:{
        heightfull: 'calc(100vh - 5rem)',
      },
      border:{
        one: '1px',
      },
    },
  },
  plugins: [],
}

