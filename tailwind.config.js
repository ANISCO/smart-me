/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#03060f',
          900: '#060b1a',
          850: '#0a1228',
          800: '#0e1832',
          750: '#122038',
          700: '#16263f',
        },
        electric: {
          50: '#eaf4ff',
          100: '#d4e8ff',
          200: '#a8d1ff',
          300: '#7cb8ff',
          400: '#4d9cff',
          500: '#1f7fff',
          600: '#0a63e6',
          700: '#084bb3',
          800: '#063680',
          900: '#04214d',
        },
        aura: {
          300: '#b79dff',
          400: '#9a7dff',
          500: '#7c5cf0',
          600: '#6340d6',
          700: '#4a2fa0',
        },
        success: {
          400: '#3fe0a0',
          500: '#18c98a',
          600: '#0aa86e',
        },
        warning: {
          400: '#ffcd5c',
          500: '#f5b423',
          600: '#d4940c',
        },
        danger: {
          400: '#ff6b81',
          500: '#f23b56',
          600: '#cc1f3a',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -2px rgba(31,127,255,0.45)',
        'glow-sm': '0 0 14px -2px rgba(31,127,255,0.35)',
        'glow-aura': '0 0 24px -2px rgba(124,92,240,0.45)',
        'glow-success': '0 0 18px -2px rgba(24,201,138,0.4)',
        'glow-danger': '0 0 18px -2px rgba(242,59,86,0.4)',
        'inner-glow': 'inset 0 0 24px -6px rgba(31,127,255,0.3)',
      },
      backgroundImage: {
        'grid-navy': 'linear-gradient(rgba(31,127,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,127,255,0.06) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(31,127,255,0.18), transparent 60%)',
        'radial-aura': 'radial-gradient(circle at 80% 10%, rgba(124,92,240,0.16), transparent 55%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(31,127,255,0.35)' },
          '50%': { boxShadow: '0 0 28px 6px rgba(31,127,255,0.45)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.2s ease-out both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'slide-up': 'slide-up 0.45s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 2.5s linear infinite',
        'scale-in': 'scale-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
