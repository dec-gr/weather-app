module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
  overrides: [
    {
      files: ['webpack.*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
      },
    },
  ],
};
