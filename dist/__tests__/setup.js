"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_mock_1 = require("./mocks/prisma.mock");
jest.mock("../infrastructure/prisma/client", () => ({
    __esModule: true,
    default: prisma_mock_1.prismaMock,
}));
beforeEach(() => {
    jest.clearAllMocks();
});
