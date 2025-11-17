// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define Inter font
      },
      colors: {
        // Custom colors for your application, inspired by Bybit
        'bybit-primary': '#1A202C', // Dark background for main sections
        'bybit-secondary': '#2D3748', // Slightly lighter dark for cards/elements
        'bybit-accent': '#F6B33F', // A golden/orange accent color
        'bybit-text-light': '#E2E8F0', // Light text for dark backgrounds
        'bybit-text-dark': '#A0AEC0', // Slightly darker light text
        'bybit-green': '#48BB78', // Green for positive indicators
        'bybit-red': '#F56565', // Red for negative indicators
        'bybit-border': '#4A5568', // Border color for elements
      },
    },
  },
  plugins: [],
}
