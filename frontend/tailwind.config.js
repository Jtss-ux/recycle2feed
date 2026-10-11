/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#06090E',
          surface: '#0B111A',
          card: '#101A26',
          border: '#1A2A3A',
          borderGlow: '#00FF8833',
          text: '#E2EAF2',
          muted: '#7A95AA',
        },
        neon: {
          green: '#00FF88',
          emerald: '#10B981',
          cyan: '#00D4FF',
          amber: '#FFB800',
          red: '#FF334B',
          purple: '#C084FC',
          pink: '#F43F5E',
        },
        forest: {
          50: '#00FF8815',
          100: '#00FF8825',
          200: '#00FF8840',
          300: '#00FF8880',
          400: '#00FF88',
          500: '#00CC6A',
          600: '#009950',
          700: '#007A40',
          800: '#005C30',
          900: '#003D20',
          950: '#001F10',
          deep: '#00FF88',
          card: '#0A1A14'
        },
        paper: {
          50: '#080D14',
          100: '#0C131D',
          200: '#111B28',
          300: '#182637',
          DEFAULT: '#06090E'
        },
        charcoal: {
          DEFAULT: '#E2EAF2',
          muted: '#7A95AA',
          border: '#1A2A3A'
        }
      },
      fontFamily: {
        sans: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.35)',
        'neon-cyan': '0 0 20px rgba(0, 212, 255, 0.35)',
        'neon-amber': '0 0 20px rgba(255, 184, 0, 0.35)',
        'neon-red': '0 0 20px rgba(255, 51, 75, 0.35)',
        'hud-panel': '0 8px 32px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
