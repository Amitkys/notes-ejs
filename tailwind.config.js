/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,html,css,js}",
  ],
  darkMode: ['selector', '[data-mode="dark"]'],
  daisyui: {
    themes: ["dark"],
  },

  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

