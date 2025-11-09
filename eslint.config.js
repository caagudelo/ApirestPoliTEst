// eslint.config.js para ESLint v9+

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        browser: false,
        node: true
      }
    },
    plugins: {},
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "off"
    }
  }
];
