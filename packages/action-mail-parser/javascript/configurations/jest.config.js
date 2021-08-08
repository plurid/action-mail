module.exports = {
    rootDir: '../',
    transform: {
        '.(ts|tsx)': 'ts-jest',
    },
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    testPathIgnorePatterns: [
        'data',
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
    ],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/build/',
    ],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
            // branches: 90,
            // functions: 95,
            // lines: 95,
            // statements: 95,
        },
    },
    collectCoverageFrom: [
        'source/*.{js,ts}'
    ],
    testTimeout: 30000,
    moduleNameMapper: {
        "data/(.*)": "<rootDir>/source/data/$1",
        "functions/parser": "<rootDir>/source/functions/parser",
        "objects/(.*)": "<rootDir>/source/objects/$1",
        "services/(.*)": "<rootDir>/source/services/$1",
    },
};
