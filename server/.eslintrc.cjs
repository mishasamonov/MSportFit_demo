module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  plugins: ['n', 'security', 'prettier', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:security/recommended-legacy',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'security/detect-object-injection': 'off',
    'n/no-missing-require': 'off',
    'n/no-unpublished-require': 'off',
    // JSDoc: вимкнено глобально, вмикається точково в overrides
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/no-defaults': 'off',
    'jsdoc/tag-lines': 'off',
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/check-types': 'off',
  },
  ignorePatterns: ['node_modules', 'prisma', 'coverage'],
  overrides: [
    // Скрипти — послаблені правила Node
    {
      files: ['scripts/**/*.js'],
      rules: {
        'n/no-process-exit': 'off',
        'n/no-unsupported-features/node-builtins': 'off',
        'security/detect-non-literal-fs-filename': 'off',
      },
    },
    // Весь src — JSDoc не вимагається за замовчуванням
    {
      files: ['src/**/*.{js,jsx}'],
      rules: {
        'jsdoc/require-jsdoc': 'off',
      },
    },
    // Публічний API: роутери та middleware — JSDoc обов'язковий для export
    {
      files: ['src/routes/**/*.{js,jsx}', 'src/middleware/**/*.{js,jsx}'],
      rules: {
        'jsdoc/require-jsdoc': [
          'error',
          { publicOnly: { ancestorsOnly: true, cjs: true } },
        ],
        'jsdoc/require-param': 'warn',
        'jsdoc/require-returns': 'warn',
      },
    },
  ],
};
