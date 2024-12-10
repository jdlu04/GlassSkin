/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#c0c78c',
        'dark_green': '#6f7a4b',
        'cream': '#FEFAE0'
      },
      
    },
  },
  plugins: [],
}
