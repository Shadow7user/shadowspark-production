import type { Config } from 'jest'
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.test.tsx'],
  testPathIgnorePatterns: [
    '<rootDir>/tests/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/lib/observability/observability.test.ts',
  ],
}
export default config
