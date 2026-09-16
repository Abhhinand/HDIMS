/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          bg: "#080E1A",
          card: "#0F1A2E",
          cardLight: "#162238",
          border: "#1E2F4D",
          borderSubtle: "#16233B",
          cyan: "#22D3EE",
          teal: "#14B8A6",
          blue: "#38BDF8",
          red: "#EF4444",
          amber: "#F59E0B",
          emerald: "#10B981",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
