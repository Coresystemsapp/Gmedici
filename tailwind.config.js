/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta GMEDICI — luxo, dourado, atemporal
        gold: {
          DEFAULT: '#B08D3C',   // ouro metálico principal
          light: '#C9A94E',
          soft: '#D9C48A',
          pale: '#EFE6CC',      // toque de bege/marfim
          dark: '#8A6D2A',
        },
        cream: {
          DEFAULT: '#F7F3E9',   // fundo off-white linho
          card: '#FBF8F0',      // marfim para cartões
          deep: '#F0EADA',
        },
        ink: '#33322D',          // cinza-ardósia suave
        muted: '#8A857A',        // texto secundário
        line: '#E7DFC9',         // divisórias suaves
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgba(120, 100, 50, 0.18)',
        lift: '0 10px 40px -12px rgba(120, 100, 50, 0.28)',
        inset: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 8px -3px rgba(120,100,50,0.2)',
      },
      backgroundImage: {
        'gold-grad': 'linear-gradient(135deg, #C9A94E 0%, #B08D3C 45%, #8A6D2A 100%)',
        'gold-shine': 'linear-gradient(135deg, #E4D19A 0%, #C9A94E 40%, #B08D3C 60%, #D9C48A 100%)',
        'champagne': 'linear-gradient(135deg, #FBF8F0 0%, #F3ECD9 100%)',
      },
    },
  },
  plugins: [],
}
