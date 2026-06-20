/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#C0392B',
          hover:   '#9B2D22',
          fg:      '#ffffff',
          muted:   'rgba(192,57,43,0.12)',
          fg_soft: '#E8887E',
        },
        sidebar: {
          bg:       '#1C1C1E',
          fg:       'rgba(255,255,255,0.88)',
          muted:    'rgba(255,255,255,0.55)',
          icon:     '#8E8E93',
          hover:    'rgba(255,255,255,0.07)',
          selected: 'rgba(192,57,43,0.22)',
          border:   'rgba(196,201,209,0.18)',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        title: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '12px',
      },
    },
  },
  plugins: [],
}
