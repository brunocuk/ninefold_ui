/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Simple: Pure black + Electric green
        accent: {
          DEFAULT: '#00FF94',
          dark: '#00CC75',
          light: '#33FFAA',
        },
      },
      fontFamily: {
        sans: ['Nohemi', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 148, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 148, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}