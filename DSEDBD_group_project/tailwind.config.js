/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        destructive: "var(--destructive)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        'primary-foreground': "var(--primary-foreground)",
        'secondary-foreground': "var(--secondary-foreground)",
        'muted-foreground': "var(--muted-foreground)",
        'accent-foreground': "var(--accent-foreground)",
        card: "var(--card)",
        'card-foreground': "var(--card-foreground)",
        success: "var(--success)",
      }
    },
  },
  plugins: [],
}
