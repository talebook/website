/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { 50: '#e3f2fd', 100: '#bbdefb', 200: '#90caf9', 500: '#2196F3', 600: '#1E88E5', 700: '#1565C0' },
      },
    },
  },
  plugins: [],
}
