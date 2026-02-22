/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./test/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // Added components dir since structure is flat-ish
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
