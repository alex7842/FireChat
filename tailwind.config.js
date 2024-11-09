/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFA500',
        'secondary': '#FFFFFF',
        'background': '#1a1a1a',
        'text': '#FFFFFF',
        'border': '#444444',
      },
    },
  },
  plugins: [],
}

