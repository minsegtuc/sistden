/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        '0': '0',
        'full': '100%',
        'screen': '100vh',
      },
      minWidth: {
        '5/6': '83.333333%',
      },
      maxWidth: {
        '0': '0',
        'full': '100%',
      },
      transitionProperty: {
        'max-height': 'max-height',
        'max-width': 'max-width',
      },
      fontFamily: {
        'myriad-pro': ['Myriad Pro', 'sans-serif'],
      },
      fontSize: {
        'md': '14px',
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

