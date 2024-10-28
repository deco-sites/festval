import daisyui from "daisyui";

export default {
  plugins: [
    daisyui,
    function ({
      addVariant,
    }: {
      addVariant: (name: string, css: string) => void;
    }) {
      addVariant("group-1-hover", ".group-1:hover &");
    },
  ],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   theme: {
//     extend: {
//       screens: {
//         "3xl": "1700px",
//       },
//     },
//   },
//   plugins: [],
// };
