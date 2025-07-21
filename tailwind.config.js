/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  // Activate the DaisyUI plugin
  plugins: [
    require('daisyui'),
  ],
  // Configure DaisyUI themes
  daisyui: {
    themes: ["light", "dark", "night"],
  },
};