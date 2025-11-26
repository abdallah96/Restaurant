/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Senegalese-inspired color palette
        // These colors are inspired by the flag and culture of Senegal
        primary: {
          50: '#fef3e2',
          100: '#fde8c5',
          200: '#fbd18b',
          300: '#f9ba51',
          400: '#f7a317',
          500: '#e88c00', // Main orange-gold
          600: '#c97700',
          700: '#a06000',
          800: '#774800',
          900: '#4e3000',
        },
        secondary: {
          50: '#e6f5e6',
          100: '#c7ebc7',
          200: '#8fd68f',
          300: '#57c157',
          400: '#1fac1f',
          500: '#0f9d0f', // Main green
          600: '#0c7d0c',
          700: '#095e09',
          800: '#063f06',
          900: '#032003',
        },
        accent: {
          50: '#ffe6e6',
          100: '#ffc7c7',
          200: '#ff8f8f',
          300: '#ff5757',
          400: '#ff1f1f',
          500: '#e60000', // Main red
          600: '#b80000',
          700: '#8a0000',
          800: '#5c0000',
          900: '#2e0000',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
