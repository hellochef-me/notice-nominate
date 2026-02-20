/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#fdf4ec',
        foreground: '#454142',
        primary: {
          DEFAULT: '#e42a12',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#ec6e58',
          foreground: '#454142',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: '#f6f7f7',
          foreground: '#92959c',
        },
        accent: {
          DEFAULT: '#ec9877',
          foreground: '#454142',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#454142',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#454142',
        },
        charcoal: '#454142',
        offWhite: '#fdf4ec',
        separator: '#dddddd',
        /* Sticky note core value colors */
        'people-first': '#FEF4D7',
        'positive-spirit': '#FDF699',
        'simplify': '#EEF5F9',
        'whatever-it-takes': '#FCEBEB',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
