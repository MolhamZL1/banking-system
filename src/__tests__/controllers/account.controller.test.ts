import { AccountController } from "../../api/controllers/account.controller";

function mkRes() {
  return {
    status: jest.fn(function (this: any) { return this; }),
    json: jest.fn(),
  } as any;
}

describe("AccountController", () => {
  test("create => 201", async () => {
    const service: any = { createAccount: jest.fn().mockResolvedValue({ id: 1 }) };
    const c = new AccountController(service);
    const req: any = { body: { x: 1 } };
    const res = mkRes();
    const next = jest.fn();

    await c.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
  });

  test("create => calls next on error", async () => {
    const err = new Error("fail");
    const service: any = { createAccount: jest.fn().mockRejectedValue(err) };
    const c = new AccountController(service);

    const req: any = { body: {} };
    const res = mkRes();
    const next = jest.fn();

    await c.create(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
