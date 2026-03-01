/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      node: { extensions: ['.js', '.jsx'] },
    },
  },
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y', 'prettier', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
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
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    // Сторінки, компоненти та точки входу — JSDoc не вимагається
    {
      files: [
        'src/pages/**/*.{js,jsx}',
        'src/components/**/*.{js,jsx}',
        'src/App.jsx',
        'src/AppRouter.jsx',
        'src/components/Layout.jsx',
      ],
      rules: {
        'jsdoc/require-jsdoc': 'off',
      },
    },
    // Публічний API: утиліти та контексти — JSDoc обов'язковий для export
    {
      files: ['src/lib/**/*.{js,jsx}', 'src/context/**/*.{js,jsx}'],
      rules: {
        'jsdoc/require-jsdoc': [
          'error',
          { publicOnly: { ancestorsOnly: true, esm: true } },
        ],
        'jsdoc/require-param': 'warn',
        'jsdoc/require-returns': 'warn',
      },
    },
  ],
};
