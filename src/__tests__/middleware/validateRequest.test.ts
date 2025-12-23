import { validateBody } from "../../api/middleware/validateRequest";
import { z } from "zod";

function mkRes() { return {} as any; }

describe("validateBody middleware", () => {
  test("passes and replaces req.body with parsed data", () => {
    const schema = z.object({ n: z.coerce.number().int() });
    const mw = validateBody(schema);

    const req: any = { body: { n: "5" } };
    const next = jest.fn();

    mw(req, mkRes(), next);
    expect(req.body.n).toBe(5);
    expect(next).toHaveBeenCalledWith(); // no error
  });

  test("fails with HttpError(400) when schema invalid", () => {
    const schema = z.object({ email: z.string().email() });
    const mw = validateBody(schema);

    const req: any = { body: { email: "not-an-email" } };
    const next = jest.fn();

    mw(req, mkRes(), next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(400);
  });
});
