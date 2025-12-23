jest.mock("../../infrastructure/auth/jwt", () => ({
  verifyToken: jest.fn((t: string) => {
    if (t === "bad") throw new Error("bad");
    return { userId: 1, role: "ADMIN" };
  }),
}));

import { requireAuth, requireRoles } from "../../api/middleware/auth.middleware";

describe("auth.middleware", () => {
  test("requireAuth: missing bearer => 401", () => {
    const req: any = { headers: {} };
    const next = jest.fn();
    requireAuth(req, {} as any, next);
    expect(next.mock.calls[0][0].status).toBe(401);
  });

  test("requireAuth: invalid token => 401", () => {
    const req: any = { headers: { authorization: "Bearer bad" } };
    const next = jest.fn();
    requireAuth(req, {} as any, next);
    expect(next.mock.calls[0][0].status).toBe(401);
  });

  test("requireAuth: ok => sets req.auth", () => {
    const req: any = { headers: { authorization: "Bearer ok" } };
    const next = jest.fn();
    requireAuth(req, {} as any, next);
    expect(req.auth).toEqual({ userId: 1, role: "ADMIN" });
    expect(next).toHaveBeenCalledWith();
  });

  test("requireRoles: forbidden when role not allowed", () => {
    const req: any = { auth: { userId: 1, role: "CUSTOMER" } };
    const next = jest.fn();
    requireRoles("ADMIN")(req, {} as any, next);
    expect(next.mock.calls[0][0].status).toBe(403);
  });

  test("requireRoles: ok when allowed", () => {
    const req: any = { auth: { userId: 1, role: "ADMIN" } };
    const next = jest.fn();
    requireRoles("ADMIN")(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });
});
