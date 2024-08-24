import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { prettier },
    rules: {
      "no-debugger": 0,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          printWidth: 120,
          trailingComma: "none",
          endOfLine: "auto",
          spaceWidth: 2,
          parser: "typescript"
        }
      ]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];
