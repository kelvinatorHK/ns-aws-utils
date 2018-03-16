module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "extends": "google",
    "rules": {
        "indent": ["error", 4, {"SwitchCase": 1}],
        "space-in-parens": ["warn", "never"],
        "max-len": ["warn", 120],
        "no-var": "warn",
        "no-console": "off",
        "no-invalid-this": "warn",
        "comma-dangle": ["error", "never"]
    }
};
