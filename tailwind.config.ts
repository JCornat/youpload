import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: [
    './file/interface/fresh/{routes,islands,components}/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        'account': 'minmax(0, 32fr) minmax(0, 68fr)',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Roboto Serif', 'serif'],
      },
      colors: {
        primary: colors.blue,
      },
    },
  },
} satisfies Config;
