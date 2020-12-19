module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "plugins": ["prettier"],
    "extends": "prettier",
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 0,
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-mixed-spaces-and-tabs": [
            "error",
            "smart-tabs"
        ],
        "strict": [
            "error",
            "global"
        ],
        "prefer-const": "error",
        "prettier/prettier": "error"
    }
};
