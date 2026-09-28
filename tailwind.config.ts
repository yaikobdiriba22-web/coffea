import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7f2',
          100: '#f5ede3',
          200: '#e8dcc8',
          300: '#d9c5a8',
          400: '#c9a87e',
          500: '#b8916f',
          600: '#a07756',
          700: '#805e46',
          800: '#6b4c39',
          900: '#5a4032',
          950: '#3d2817',
        },
        coffee: {
          50: '#fef8f4',
          100: '#fde9de',
          200: '#f9d4ba',
          300: '#f4b894',
          400: '#ee9a6f',
          500: '#e67e50',
          600: '#d66838',
          700: '#b8512e',
          800: '#944429',
          900: '#763a25',
          950: '#471f14',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
