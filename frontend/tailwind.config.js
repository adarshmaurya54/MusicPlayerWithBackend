/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'], // Add Roboto font
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(99%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
        'spin-slow': 'spin 4s linear infinite'
      },
    },
  },
  plugins: [],
}
