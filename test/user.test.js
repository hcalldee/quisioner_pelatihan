const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
const getTestToken = require("./helpers/token");

describe("API User", () => {
  let username;
  const token = getTestToken({ sub: "1", username: "admin", approved: 1 });

  beforeAll(() => {
    username = `jest_user_${Date.now()}`;
  });

  it("POST /api/user - create user", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username,
        password: "secret123",
        email: "jest@example.com"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.username).toBe(username);
  });

  it("POST /api/user - reject duplicate username", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username,
        password: "secret123",
        email: "jest2@example.com"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

afterAll(async () => {
  // cleanup
  try {
    await db.query("DELETE FROM `user` WHERE username LIKE 'jest_user_%'");
  } finally {
    await db.end();
  }
});
