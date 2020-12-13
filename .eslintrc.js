module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    eqeqeq: 'off',
    'import/prefer-default-export': 'off',
    'new-cap': 'off',
    'class-methods-use-this': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
};
