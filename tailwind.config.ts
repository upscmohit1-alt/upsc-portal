import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blackish: "var(--black)",
        dark: "var(--dark)",
        mid: "var(--mid)",
        muted: "var(--muted)",
        borderTone: "var(--border)",
        bgSoft: "var(--bg)",
        bg2: "var(--bg2)",
        red: "var(--red)",
        redLight: "var(--red-light)",
        saffron: "var(--saffron)",
        saffronLight: "var(--saffron-light)",
        green: "var(--green)",
        greenLight: "var(--green-light)",
        blue: "var(--blue)",
        blueLight: "var(--blue-light)",
        purple: "var(--purple)",
        purpleLight: "var(--purple-light)",
        teal: "var(--teal)",
        tealLight: "var(--teal-light)"
      },
      fontFamily: {
        serif: ["var(--font-lora)"],
        sans: ["var(--font-source-sans-3)"]
      }
    },
  },
  plugins: [],
};

export default config;
