import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        roboto: ["var(--font-roboto)"],
      },

      screens: {
        mobile: "480px",
        // => @media (min-width: 480px) { ... }

        tablet: "640px",
        // => @media (min-width: 640px) { ... }

        "tablet-lg": "768px",
        // => @media (min-width: 768px) { ... }

        laptop: "1024px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1280px",
        // => @media (min-width: 1280px) { ... }

        "desktop-lg": "1536px",
        // => @media (min-width: 1536px) { ... }

        "desktop-xl": "1920px",
        // => @media (min-width: 1920px) { ... }

        "desktop-2xl": "2560px",

        // => @media (min-width: 2560px) { ... }

        "max-tablet-lg": { max: "767px" },
        "max-tablet": { max: "640px" },
        "max-laptop": { max: "1117px" },
      },
      colors: {
        primary: {
          DEFAULT: "#1170B2",
        },
        divider: {
          DEFAULT: "#C6C6C9",
          100: "#F2F2F2",
          200: "#808080",
          300: "#404040",
          back: "#00000",
        },
        secondary: {
          DEFAULT: "#E88026",
        },
        negative: {
          DEFAULT: "#FF3B3B",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
