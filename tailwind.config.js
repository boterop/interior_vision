/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#C2D9FA',
        'dark-base': '#768DAD',
        'light-base': '#E0EDFF',
      },
    },
  },
  plugins: [],
};
