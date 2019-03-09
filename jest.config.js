module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        ".*.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleNameMapper: {
        ".(css|jpg|png)$": "<rootDir>/empty-module.js"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/index.tsx"]
};
