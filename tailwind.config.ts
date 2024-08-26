import { type Config } from 'tailwindcss';

export default {
  content: [
    './file/interface/fresh/{routes,islands,components}/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'account': 'minmax(0, 32fr) minmax(0, 68fr)',
      },
    },
  },
} satisfies Config;