import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        powder: {
          blue: "#BFE3F5",
          pink: "#F7C6D9",
        },
        baby: {
          pink: "#FADCE8",
        },
        vanilla: {
          cream: "#FFF8ED",
        },
        soft: {
          lavender: "#E7DDF7",
        },
        butter: {
          yellow: "#FFF0B8",
        },
        cocoa: {
          DEFAULT: "#59434A",
          light: "#7D616A",
          dark: "#3F2E34",
        },
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "cursive", "sans-serif"],
        sans: ["var(--font-quicksand)", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        candy: "0 12px 32px -8px rgba(89, 67, 74, 0.12), 0 4px 12px -4px rgba(247, 198, 217, 0.45)",
        "candy-lg": "0 20px 45px -12px rgba(89, 67, 74, 0.16), 0 8px 20px -6px rgba(191, 227, 245, 0.55)",
        stitch: "inset 0 0 0 2px rgba(255, 255, 255, 0.7)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(4deg)" },
        },
        yarnBounce: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.04)" },
        },
      },
      animation: {
        "float-slow": "floatSlow 5s ease-in-out infinite",
        "yarn-bounce": "yarnBounce 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
