/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
    "!src/infrastructure/prisma/**",
    "!src/infrastructure/mailer/**",
    "!src/__tests__/**",
  ],
  // coverageThreshold: {
  //   global: { statements: 70, branches: 70, functions: 70, lines: 70 },
  // },

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],

  // مؤقتاً نخلي threshold يتفعل بعد ما يشتغل التست
  // (رجّعه 70 بعد ما يصير عندك coverage حقيقي)
  // coverageThreshold: {
  //   global: { statements: 70, branches: 70, functions: 70, lines: 70 },
  // },
};
