module.exports ={
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
      "extends": [
          "airbnb-base",
          "eslint:recommended"
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": "off",
        "no-plusplus": "off",
        "no-param-reassign": "off",
        "max-len": "off",
        "no-underscore-dangle": "off"
    }
};
