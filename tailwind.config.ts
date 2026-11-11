import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm-neutral light surfaces
        canvas: "#F7F5F1",
        surface: "#FFFFFF",
        sunken: "#EFECE6",
        line: { DEFAULT: "#E2DDD4", strong: "#C9C2B6" },
        // Charcoal text
        ink: { DEFAULT: "#1E2226", 2: "#454B53", 3: "#646A73" },
        // Deep emergency red
        alert: { DEFAULT: "#A3171C", strong: "#86121A", soft: "#FBEDEC", line: "#EBC4C1" },
        // Safe status
        safe: { DEFAULT: "#1E7A4C", fill: "#2F8F5B", soft: "#EAF4EE", line: "#BBDCC8" },
        // Caution
        caution: { DEFAULT: "#9A5A06", fill: "#D88A12", soft: "#FCF3E3", line: "#EED3A3" },
        // Team identity (kept away from status colours)
        teamA: { DEFAULT: "#1F4E8C", soft: "#EAF0F8", line: "#BFD0E8" },
        teamB: { DEFAULT: "#5A3C8E", soft: "#F1ECF8", line: "#D3C6EA" },
        gold: { DEFAULT: "#A87B1F", fill: "#C9A13B", soft: "#F8F0DC", line: "#E6D3A1" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30, 34, 38, 0.06)",
        raised: "0 1px 2px rgba(30, 34, 38, 0.06), 0 4px 12px rgba(30, 34, 38, 0.06)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-6px)" },
          "30%": { transform: "translateX(5px)" },
          "45%": { transform: "translateX(-4px)" },
          "60%": { transform: "translateX(3px)" },
          "75%": { transform: "translateX(-2px)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(163, 23, 28, 0.45)" },
          "100%": { boxShadow: "0 0 0 12px rgba(163, 23, 28, 0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "tick-pop": {
          "0%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
        "reveal-in": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        shake: "shake 0.45s ease-in-out 1",
        "pulse-ring": "pulse-ring 0.8s ease-out 3",
        "fade-up": "fade-up 0.32s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "tick-pop": "tick-pop 0.3s ease-out 1",
        "reveal-in": "reveal-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
