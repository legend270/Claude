/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ttu: {
          blue: '#003580',
          'blue-dark': '#002560',
          'blue-light': '#0044A8',
          red: '#C0392B',
          'red-light': '#E74C3C',
          gold: '#F1C40F',
          'gold-dark': '#D4AC0D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
