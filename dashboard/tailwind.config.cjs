/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      '2xl': { 'max': '1535px' },
      // => @media (max-width: 1535px) { ... }

      'xl': { 'max': '1279px' },
      // => @media (max-width: 1279px) { ... }

      'lg': { 'max': '1023px' },
      // => @media (max-width: 1023px) { ... }

      'md': { 'max': '767px' },
      // => @media (max-width: 767px) { ... }

      'sm': { 'max': '639px' },
      // => @media (max-width: 639px) { ... }
    },
    extend: {},
    colors: {
      white: "#f0f0f0",
      "white-hover": "#c2c7cc",
      "placeholder-dark": "#636362",
      "dark-background2": "#222222",
      "dark-background": "#1b1b1b",
      "light-background2": "#f0f0f0",
      "light-background": "#e3e3e3",
      primary: "#00acd6",
      plight: "#00c7cb",
      pdark: "#338dc9",
      secondary: "#9fef88",
      slight: "#f9f871",
      sdark: "#32dead",
      "pdark-hover": "#00acd639",
      "p2dark-hover": "#00acd670",
      "dark-drawer-background": "#222222ce",
      "light-drawer-background": "#e3e3e3ce",
      error: "#ff3b3b",
      warning: "#FF8800",
      success: "#007733",
      info: "#0099CC",
    },
  },
  plugins: [require("flowbite/plugin")({ chart: true })],
};
