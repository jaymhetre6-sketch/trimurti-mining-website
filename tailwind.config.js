/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111318',
          surface: '#171A20',
          elevated: '#1E232B',
          orange: '#FF6B18',
          orangeHover: '#E55807',
          steel: '#B9C0C9',
          ivory: '#F5F5F2',
          muted: '#7A838E',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 107, 24, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
      },
      boxShadow: {
        'glow-orange': '0 0 35px -5px rgba(255, 107, 24, 0.35)',
        'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(255, 107, 24, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
