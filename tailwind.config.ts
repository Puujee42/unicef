import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <--- ADD THIS LINE
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ... your existing colors
    },
  },
  plugins: [],
};
export default config;