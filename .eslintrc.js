module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "globals": {},
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-unused-vars": [
          1
        ],
        "no-console": [
          1
        ],
        "react/prop-types": [
          0
        ],
        "react/no-danger": [
          1
        ],
        "indent": [
            1,
            2,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "quotes": [
            1,
            "single"
        ],
        "semi": [
            2,
            "always"
        ]
    }
};
