/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@smartass/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
}
