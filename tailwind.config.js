/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./blog.html",
    "./blog-posts/**/*.html",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d1b2a',
        panel: '#1b263b',
        text: '#e0e1dd',
        muted: 'rgba(224,225,221,0.78)',
        line: 'rgba(224,225,221,0.35)',
      },
      spacing: {
        'header-h': '75px',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 0 15px rgba(0,0,0,.10)',
        'card-hover': '0 10px 26px rgba(0,0,0,.22)',
      },
    },
  },
  plugins: [],
}
