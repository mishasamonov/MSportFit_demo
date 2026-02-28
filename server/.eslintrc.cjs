module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  plugins: ['n', 'security', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:security/recommended-legacy',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'security/detect-object-injection': 'off',
    'n/no-missing-require': 'off',
    'n/no-unpublished-require': 'off',
  },
  ignorePatterns: ['node_modules', 'prisma', 'coverage'],
  overrides: [
    {
      files: ['scripts/**/*.js'],
      rules: {
        'n/no-process-exit': 'off',
        'n/no-unsupported-features/node-builtins': 'off',
        'security/detect-non-literal-fs-filename': 'off',
      },
    },
  ],
};
