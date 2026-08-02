import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu(
  {
    vue: true,
    typescript: true,
  },
  {
    files: ['**/*.vue', '**/*.{ts,tsx,js,jsx,mjs}'],
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'playground/src/style.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
    },
  },
)
