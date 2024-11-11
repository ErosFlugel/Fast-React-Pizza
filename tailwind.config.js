/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Theme is used to override the tailwind specs (now all the fonts are just the ones specified in the object)
  theme: {
    fontFamily: {
      sans: "Roboto Mono, monospace",
    },

    // Extends is used to add different specs to the tailwind options
    extend: {
      height: {
        //This one is actually a good adjustment due to the dvh being more responsive for mobile screens aswell as for the desktop screens
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
