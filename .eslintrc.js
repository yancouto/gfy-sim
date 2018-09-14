module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "plugins": ["prettier"],
    "extends": "prettier",
    "parserOptions": {
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
