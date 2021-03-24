module.exports = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    modulePathIgnorePatterns: ['dist', '__mocks__'],
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/generated/'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        '.*': 'babel-jest',
    },
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: "jest-environment-node"
};
