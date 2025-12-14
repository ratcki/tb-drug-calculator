import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0f0f23',
          card: 'rgba(255, 255, 255, 0.08)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        '20': '20px',
      },
    },
  },
  plugins: [],
} satisfies Config
