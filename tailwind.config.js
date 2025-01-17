/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = require("tailwindcss/defaultTheme");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: '#076163', // Color primario
        secondary: '#DDBE86',
        tertiary: '#9B3A4D',
        background: '#EFEFEF'
      },
    },
  },
  plugins: [],
}