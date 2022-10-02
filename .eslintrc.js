module.exports = {
    env: {
        node: true
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "semi": ["error", "never"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/ban-ts-comment": "off",
        "no-useless-escape": "warn",
        "brace-style": ["error", "stroustrup"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "prefer-spread": "off",
    }
}
