import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Near-black desaturated slate canvas
        canvas: '#07090D',
        surface: {
          DEFAULT: '#0C0F16',
          raised: '#11151E',
          inset: '#090B11',
        },
        hairline: {
          DEFAULT: '#1B212E',
          strong: '#28313F',
        },
        content: {
          DEFAULT: '#E9EDF5',
          muted: '#98A2B6',
          dim: '#5E6879',
        },
        // Brand accent — cold cryptographic cyan
        brand: {
          DEFAULT: '#22D3EE',
          soft: '#67E8F9',
          deep: '#0E7490',
          glow: 'rgba(34,211,238,0.16)',
        },
        safe: {
          DEFAULT: '#34D399',
          soft: '#6EE7B7',
          deep: '#065F46',
        },
        danger: {
          DEFAULT: '#FB5B78',
          soft: '#FDA4B4',
          deep: '#7F1D2E',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.35), 0 0 34px -6px rgba(34,211,238,0.5)',
        'glow-safe': '0 0 0 1px rgba(52,211,153,0.4), 0 0 40px -8px rgba(52,211,153,0.55)',
        'glow-danger': '0 0 0 1px rgba(251,91,120,0.4), 0 0 40px -8px rgba(251,91,120,0.55)',
        panel: '0 24px 60px -30px rgba(0,0,0,0.9)',
      },
      keyframes: {
        'unlock-blur': {
          '0%': { filter: 'blur(7px)', opacity: '0.35' },
          '100%': { filter: 'blur(0px)', opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.86)', opacity: '0' },
          '60%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(34,211,238,0.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(34,211,238,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34,211,238,0)' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        drift: {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'unlock-blur': 'unlock-blur 0.7s cubic-bezier(0.2,0.8,0.2,1) forwards',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.2,0.9,0.3,1.2) forwards',
        sheen: 'sheen 1.1s ease-in-out',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
        'fade-up': 'fade-up 0.5s ease forwards',
        drift: 'drift 3.5s ease-in-out infinite',
        spin: 'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
