import { TransactionController } from "../../api/controllers/transaction.controller";

function mkRes() {
  return {
    status: jest.fn(function (this: any) { return this; }),
    json: jest.fn(),
  } as any;
}

describe("TransactionController", () => {
  test("create => 201", async () => {
    const service: any = { create: jest.fn().mockResolvedValue({ tx: { id: 1 } }) };
    const c = new TransactionController(service);

    const req: any = { body: { type: "DEPOSIT", amount: 10 }, auth: { userId: 1, role: "CUSTOMER" } };
    const res = mkRes();
    const next = jest.fn();

    await c.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("pending => ok", async () => {
    const service: any = { pending: jest.fn().mockResolvedValue([{ id: 9 }]) };
    const c = new TransactionController(service);

    const req: any = { auth: { userId: 1, role: "ADMIN" } };
    const res = mkRes();
    const next = jest.fn();

    await c.pending(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 9 }] });
  });
});
