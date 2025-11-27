const path = require('path')
const nextJest = require('next/jest')

// Абсолютный путь к корню Next.js приложения
const createJestConfig = nextJest({
  dir: path.resolve(__dirname), // <-- просто текущая папка
})

const customJestConfig = {
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  testMatch: ['<rootDir>/src/tests/**/*.(test|spec).(ts|js)'],


  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest'],
  },

  transformIgnorePatterns: ['<rootDir>/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)
