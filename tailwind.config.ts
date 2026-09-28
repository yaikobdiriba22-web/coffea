import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f8f4f0',
          100: '#f1e3d7',
          200: '#e4c6b0',
          300: '#d4a684',
          400: '#c88653',
          500: '#b96a3a',
          600: '#9f5630',
          700: '#82442d',
          800: '#693925',
          900: '#522d1d',
        },
        cream: '#f9f3ee',
        creamDark: '#f0e7df',
        oak: '#2e1f1a',
      },
      boxShadow: {
        soft: '0 20px 45px rgba(55, 33, 22, 0.12)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
