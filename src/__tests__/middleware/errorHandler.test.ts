import { errorHandler } from "../../api/middleware/errorHandler";

describe("errorHandler", () => {
  test("returns status/message from error", () => {
    const req: any = {};
    const json = jest.fn();
    const res: any = { status: jest.fn(() => res), json };
    const next = jest.fn();

    errorHandler({ status: 401, message: "Nope" }, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ success: false, message: "Nope" });
  });

  test("defaults to 500 if status missing", () => {
    const req: any = {};
    const json = jest.fn();
    const res: any = { status: jest.fn(() => res), json };
    const next = jest.fn();

    errorHandler({ message: "Boom" }, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ success: false, message: "Boom" });
  });
});
