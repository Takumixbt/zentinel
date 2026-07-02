import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Figtree', 'ui-sans-serif', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // White canvas, matching Ztocks' light-first structure
        canvas: '#FFFFFF',
        surface: {
          DEFAULT: '#FAFAF7',
          raised: '#F4F3EE',
          inset: '#EFEEE7',
        },
        hairline: {
          DEFAULT: '#E6E3D8',
          strong: '#D6D2C2',
        },
        content: {
          DEFAULT: '#171308',
          muted: '#6B6455',
          dim: '#9B9484',
        },
        // Ink section — the one dark contrast band, echoing Ztocks' dark process section
        ink: {
          DEFAULT: '#0B0A06',
          raised: '#151209',
          hairline: 'rgba(255,255,255,0.09)',
          content: '#F5F3EA',
          muted: '#A39C87',
        },
        // The only accent color: yellow
        brand: {
          DEFAULT: '#EAB308',
          soft: '#FDE047',
          deep: '#A16207',
          glow: 'rgba(234,179,8,0.18)',
        },
        // "Safe" reuses the accent (the good outcome glows yellow);
        // "danger" is ink/outline, not a second hue — keeps the palette to white+yellow.
        safe: {
          DEFAULT: '#EAB308',
          soft: '#FDE047',
          deep: '#A16207',
        },
        danger: {
          DEFAULT: '#171308',
          soft: '#6B6455',
          deep: '#0B0A06',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(234,179,8,0.4), 0 0 34px -6px rgba(234,179,8,0.55)',
        'glow-safe': '0 0 0 1px rgba(234,179,8,0.4), 0 0 40px -8px rgba(234,179,8,0.55)',
        'glow-danger': '0 0 0 1px rgba(23,19,8,0.25), 0 0 30px -10px rgba(23,19,8,0.3)',
        panel: '0 24px 60px -30px rgba(23,19,8,0.18)',
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
          '0%': { boxShadow: '0 0 0 0 rgba(234,179,8,0.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(234,179,8,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(234,179,8,0)' },
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
