module.exports ={
    "root": true,
    "env": {
        "node": true
    },
      "extends": [
        "plugin:vue/essential",
        "plugin:vue/recommended",
        "airbnb-base",
        "eslint:recommended"
    ],
    "parser": "vue-eslint-parser",
    "ignorePatterns": ["**/assets/*"],
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
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "no-underscore-dangle": "off",
        "vue/component-tags-order": ["error", {
            "order": ["template", "style","script"]
        }],
    }
};
