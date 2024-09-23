/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/***/**/*.{ejs,html,css,js}",
    'node_modules/preline/dist/*.js',
  ],
  darkMode: ['selector', '[data-mode="dark"]'],

  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin'),
  ],
}

