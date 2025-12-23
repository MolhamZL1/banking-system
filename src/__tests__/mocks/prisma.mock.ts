/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFn = (...args: any[]) => any;

export const prismaMock: any = {};

// --- Account ---
prismaMock.account = {
  findUnique: jest.fn(),
  update: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  groupBy: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
};

// --- AccountFeature ---
prismaMock.accountFeature = {
  upsert: jest.fn(),
  delete: jest.fn(),
};

// --- Transaction ---
prismaMock.transaction = {
  create: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
  groupBy: jest.fn(),
  aggregate: jest.fn(),
};

// --- ScheduledTransaction ---
prismaMock.scheduledTransaction = {
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  count: jest.fn(),
};

// --- EventLog ---
prismaMock.eventLog = {
  create: jest.fn(),
  findMany: jest.fn(),
};

// --- Ticket (كان ناقص create/findMany/update) ---
prismaMock.ticket = {
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  groupBy: jest.fn(),
};

// --- User (كان ناقص create/update) ---
prismaMock.user = {
  create: jest.fn(),
  update: jest.fn(),
  groupBy: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
};

// --- Notification ---
prismaMock.notification = {
  create: jest.fn(),
  findMany: jest.fn(),
  updateMany: jest.fn(),
};

// --- RefreshToken + EmailVerification (كانوا ناقصين بالكامل) ---
prismaMock.refreshToken = {
  create: jest.fn(),
  findFirst: jest.fn(),
  updateMany: jest.fn(),
};

prismaMock.emailVerification = {
  create: jest.fn(),
  findFirst: jest.fn(),
  update: jest.fn(),
};

// transaction helper: ينفذ callback ويمرر prismaMock كـ tx
prismaMock.$transaction = jest.fn(async (cb: AnyFn) => cb(prismaMock));
