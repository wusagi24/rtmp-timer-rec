module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "mocha": true,
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": "warn",
    "no-unused-vars": "warn",
    "indent": ["error", 2, { "SwitchCase": 1 }]
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2017,
  }
};
