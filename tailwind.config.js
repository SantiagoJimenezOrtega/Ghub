// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e7ff',
          100: '#e0c3ee',
          200: '#c9a7e8',
          300: '#b68fcf',
          400: '#a376c6',
          500: '#905fb1',
          600: '#7a4e9e',
          700: '#66408c',
          800: '#52337a',
          900: '#3e2668'
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
};