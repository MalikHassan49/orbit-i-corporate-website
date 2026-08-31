// Minimal flat ESLint config for the ORBIT-I server.
// Extend with @typescript-eslint plugin rules as the team's conventions solidify.
export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    rules: {},
  },
]
