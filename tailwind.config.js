/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        vega: {
          navy: '#1a365d',
          gold: '#d4a574',
          light: '#f7f3ef',
          dark: '#2d2d2d',
        },
      },
    },
  },
  plugins: [],
};
