/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        1: "1",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
