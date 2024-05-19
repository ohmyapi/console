/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      }
    },
  },
  daisyui: {
    themes: ['light', 'dark'],
  },
  plugins: [
    require('./tailwind.radial-gradient'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}

