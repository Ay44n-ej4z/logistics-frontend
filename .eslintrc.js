const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: ['next/core-web-vitals'],
  ignorePatterns: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    // Disable TS-specific rules entirely:
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
