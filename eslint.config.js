import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginMocha from "eslint-plugin-mocha";

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}", "tests/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      mocha: pluginMocha,
    },
    rules: {
      "mocha/no-exclusive-tests": "error",
    },
  }
];