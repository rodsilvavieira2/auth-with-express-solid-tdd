import config from "./jest.config";

export default {
  ...config,
  testMatch: ["**/*.test.ts"],
  testEnvironment: "./prisma/prisma-test-environment.ts",
};
