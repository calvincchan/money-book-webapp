module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    }
  },
  rules: {
    semi: ["warn", "always"],
    indent: "off",
    "@typescript-eslint/indent": ["error", 2],
    "no-multiple-empty-lines": ["error", { max: 1 }],
  }
};
