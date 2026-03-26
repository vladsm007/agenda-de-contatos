/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Ajuste os caminhos conforme seu projeto
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F0FF",
          100: "#B0D0FF",
          200: "#8AB5F0",
          300: "#5E8AD9",
          400: "#3A66B8",
          500: "#1E3A8A",
          600: "#17306D",
          700: "#102450",
          800: "#0A1A3A",
          900: "#050F24",
        },
        surface: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
    },
  },
  plugins: [],
};
