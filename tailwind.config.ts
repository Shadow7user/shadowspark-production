// Tailwind config (no type import)
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          300: "#00FFD5",
          400: "#00E5BE",
          500: "#00FFD5",
          600: "#00CCAA",
          700: "#009688",
        },
        purple: {
          500: "#BD00FF",
          600: "#9900CC",
          700: "#7700AA",
        },
        background: "#050508",
        card: "#0d0d12",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      backgroundImage: {
        "gradient-cyberpunk":
          "linear-gradient(135deg, #050508 0%, #0d0d12 50%, #1a1a2e 100%)",
        "gradient-cyan-purple":
          "linear-gradient(90deg, #00FFD5 0%, #BD00FF 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
