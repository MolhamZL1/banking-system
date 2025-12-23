import request from "supertest";
import app from "../../app";

describe("Integration: health", () => {
  test("GET /api/health => ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
