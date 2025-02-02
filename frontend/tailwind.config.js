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
        // Add the new wave animation
        waveUpDown: {
          '0%': { height: '6px' },   // Start with minimal height
          '50%': { height: '30px' },  // Increase to maximum height
          '100%': { height: '6px' }, // Return to minimal height
        },
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
        'spin-slow': 'spin 4s linear infinite',
        // Add the custom wave animation with delay
        wave1: 'waveUpDown 1s ease-in-out infinite alternate',
        wave2: 'waveUpDown 1s ease-in-out infinite  alternate 0.2s', // Delay added
        wave3: 'waveUpDown 1s ease-in-out infinite alternate 0.4s', // Delay added
        wave4: 'waveUpDown 1s ease-in-out infinite alternate 0.6s', // Delay added
      },
    },
  },
  plugins: [],
}
