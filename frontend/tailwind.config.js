/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // OPTIONAL: add semantic colors that match your Legend
      // Copy the actual hex values from Legend/colorForValue.
      colors: {
        // Example names only – replace with your real hex codes:
        // 'tax-low': '#e0f2f1',       // your existing low-tax color (NOT white)
        // 'tax-medium': '#80cbc4',
        // 'tax-high': '#004d40',
      },
    },
  },
  plugins: [],
};