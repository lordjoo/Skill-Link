/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        // SkillLink brand palette
        primary: {
          DEFAULT: '#0C9892',
          dark: '#0A827D',
          light: '#E6F5F4'
        },
        ink: '#1F2937',
        muted: '#6B7280'
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive']
      },
      borderRadius: {
        card: '1.5rem'
      },
      boxShadow: {
        card: '0 15px 50px rgba(0, 0, 0, 0.10)',
        soft: '0 4px 15px rgba(12, 152, 146, 0.30)'
      }
    }
  },
  plugins: []
}
