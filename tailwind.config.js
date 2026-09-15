/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', '"IBM Plex Sans"', 'Inter', 'serif', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: {
          950: '#F7F3EA', // Main background — warm ivory/parchment
          900: '#FFFCF5', // Cards — slightly lighter cream
          850: '#F5F0E4',
          800: '#EFE9DC',
          700: '#DDD8CC', // Borders — soft beige
          600: '#C8C2B3',
          500: '#8E8D85',
          400: '#6B6B63', // Secondary text — muted gray/olive
          300: '#4E4E48',
          200: '#333330',
          100: '#252525', // Primary text — charcoal
          50: '#141414',
        },
        parchment: '#F7F3EA',
        charcoal: '#252525',
        olive: '#6B6B63',
        saffron: '#C58A2B',
        beige: '#DDD8CC',
        cream: '#FFFCF5',
        gold: {
          50: '#FDFBF7',
          100: '#FBF5E8',
          200: '#F5E7CC',
          300: '#E8CA8B',
          400: '#D49B45', // warm ochre
          500: '#C58A2B', // Accent / timeline — antique gold/saffron
          600: '#AC741F',
          700: '#8A5B14',
          800: '#6B450C',
          900: '#4D3006',
          950: '#2C1A02',
        },
        historical: {
          terracotta: '#C26743',
          saffron: '#C58A2B',
          sage: '#5B7B5A',
          slate: '#3A5668',
          ochre: '#D49B45',
          rust: '#A64B2A',
          sandstone: '#E8DFCE',
          copper: '#B86A41',
          crimson: '#9E3839',
        },
        signal: {
          amber: '#C58A2B',
          gold: '#D49B45',
          teal: '#4D7C6F',
          emerald: '#5B7B5A', // sage/moss
          rose: '#C26743', // terracotta
          ruby: '#A64B2A', // rust
          indigo: '#3A5668', // deep slate
          cyan: '#4A7C8C',
          violet: '#6F597A',
        },
      },
      boxShadow: {
        panel: '0 1px 3px rgba(37,37,37,0.04), 0 8px 24px -4px rgba(37,37,37,0.06)',
        gold: '0 4px 20px -2px rgba(197,138,43,0.25)',
        goldGlow: '0 0 30px rgba(197,138,43,0.18)',
        luxury: '0 10px 30px -5px rgba(37,37,37,0.07), 0 0 0 1px #DDD8CC',
        glowEmerald: '0 4px 20px -2px rgba(91,123,90,0.25)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 3s infinite linear',
        pulseSlow: 'pulseSlow 4s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
