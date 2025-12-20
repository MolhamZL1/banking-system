import { prismaMock } from "./mocks/prisma.mock";

jest.mock("../infrastructure/prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

beforeEach(() => {
  jest.clearAllMocks();
});
