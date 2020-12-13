module.exports = {
  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    eqeqeq: 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-destructuring': 'off',
    'no-prototype-builtins': 'off',
    'import/no-dynamic-require': 'off',
    'no-restricted-globals': 'off',
    'global-require': 'off',
    'import/prefer-default-export': 'off',
    'new-cap': 'off',
    'class-methods-use-this': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
};
