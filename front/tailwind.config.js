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
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
      boxShadow: {
        soft: '0 16px 34px rgba(6, 16, 32, 0.35)',
        glow: '0 0 0 1px rgba(140, 244, 238, 0.26), 0 20px 44px rgba(89, 178, 176, 0.28)',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(900px 500px at 80% -20%, rgba(89, 178, 176, 0.35), transparent 60%), radial-gradient(650px 420px at 15% 0%, rgba(68, 132, 129, 0.45), transparent 58%), linear-gradient(160deg, #1f293d 0%, #192033 45%, #20293f 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
