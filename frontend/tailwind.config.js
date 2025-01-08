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
      animation: {
        wave: 'wave 0.6s ease-in-out infinite',
        heartFilled: 'heartFilled 1s',
        celebrate: 'celebrate 0.5s forwards',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        heartFilled: {
          '0%': { transform: 'scale(0)' },
          '25%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(1)', filter: 'brightness(1.5)' },
        },
        celebrate: {
          '0%': { transform: 'scale(0)' },
          '50%': { opacity: '1', filter: 'brightness(1.5)' },
          '100%': { transform: 'scale(1.4)', opacity: '0', display: 'none' },
        },
      },
    },
  },
  plugins: [],
}
