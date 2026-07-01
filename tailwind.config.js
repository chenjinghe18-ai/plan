/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFE4',
          300: '#EDE4D3',
        },
        amber: {
          400: '#E8923C',
          500: '#D97F2A',
          600: '#C26B1E',
        },
        sage: {
          400: '#7BA05B',
          500: '#688A4C',
          600: '#56733D',
        },
        rose: {
          400: '#D4A5A5',
          500: '#C08E8E',
        },
        slateblue: {
          400: '#8FA8B8',
          500: '#7A95A8',
        },
        brown: {
          700: '#5C554D',
          800: '#3D3832',
          900: '#2D2A26',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(45, 42, 38, 0.06)',
        'soft-lg': '0 8px 24px rgba(45, 42, 38, 0.08)',
        'paper': '0 1px 3px rgba(45, 42, 38, 0.04), 0 4px 12px rgba(45, 42, 38, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
