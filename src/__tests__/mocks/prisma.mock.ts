/* eslint-disable @typescript-eslint/no-explicit-any */

// مهم: لازم يكون jest متاح (ببيئة Jest هو global)
type AnyFn = (...args: any[]) => any;

export const prismaMock: any = {};

prismaMock.account = {
  findUnique: jest.fn(),
  update: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  groupBy: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
};

prismaMock.accountFeature = {
  upsert: jest.fn(),
  delete: jest.fn(),
};

prismaMock.transaction = {
  create: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
  groupBy: jest.fn(),
  aggregate: jest.fn(),
};

prismaMock.scheduledTransaction = {
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  count: jest.fn(),
};

prismaMock.eventLog = {
  create: jest.fn(),
  findMany: jest.fn(),
};

prismaMock.ticket = {
  groupBy: jest.fn(),
};

prismaMock.user = {
  groupBy: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
};

prismaMock.notification = {
  create: jest.fn(),
  findMany: jest.fn(),
  updateMany: jest.fn(),
};

// transaction helper: ينفذ callback ويمرر prismaMock كـ tx
prismaMock.$transaction = jest.fn(async (cb: AnyFn) => cb(prismaMock));

