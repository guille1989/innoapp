/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Outfit Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#8cf4ee',
          secondary: '#59b2b0',
          accent: '#448481',
          dark: '#1f293d',
          dark2: '#353d54',
          light: '#c5efec',
        },
      },
    },
  },
  plugins: [],
}
