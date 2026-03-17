/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#111118',
        'bg-card': '#1a1a24',
        'border-dark': '#2a2a35',
        'gold': '#f5c842',
        'win': '#22c55e',
        'loss': '#ef4444',
        'pending': '#eab308',
        'info': '#3b82f6',
      }
    }
  },
  plugins: []
}
