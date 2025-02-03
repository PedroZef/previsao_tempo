import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    rules: {
      "prettier/prettier": "error",
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
    },
  },
];
