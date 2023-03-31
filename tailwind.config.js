/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        1: "1",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
