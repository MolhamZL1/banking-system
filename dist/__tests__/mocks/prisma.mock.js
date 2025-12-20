"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
exports.prismaMock = {};
exports.prismaMock.account = {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    groupBy: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
};
exports.prismaMock.accountFeature = {
    upsert: jest.fn(),
    delete: jest.fn(),
};
exports.prismaMock.transaction = {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
    aggregate: jest.fn(),
};
exports.prismaMock.scheduledTransaction = {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
};
exports.prismaMock.eventLog = {
    create: jest.fn(),
    findMany: jest.fn(),
};
exports.prismaMock.ticket = {
    groupBy: jest.fn(),
};
exports.prismaMock.user = {
    groupBy: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
};
exports.prismaMock.notification = {
    create: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
};
// transaction helper: ينفذ callback ويمرر prismaMock كـ tx
exports.prismaMock.$transaction = jest.fn(async (cb) => cb(exports.prismaMock));
