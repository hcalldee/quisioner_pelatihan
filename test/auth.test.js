const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
const crypto = require("crypto");

function decodePayload(token) {
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return JSON.parse(Buffer.from(b64 + pad, "base64").toString("utf8"));
}

describe("API Auth (JWT Sliding Exp)", () => {
  let username;
  let password;
  let token;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "jest_secret";
    process.env.JWT_TTL_SECONDS = process.env.JWT_TTL_SECONDS || "60";
    username = `jest_auth_${Date.now()}`;
    password = "secret123";

    // Seed user directly in DB (route /api/user is protected).
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const stored = `${salt}:${hash}`;
    // Insert with approved=1 if the column exists.
    const [cols] = await db.query(
      "SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'approved'"
    );
    const hasApproved = Number(cols && cols[0] && cols[0].c) === 1;

    if (hasApproved) {
      await db.query(
        "INSERT INTO `user` (username, password, email, approved) VALUES (?, ?, ?, 1)",
        [username, stored, "auth@example.com"]
      );
    } else {
      await db.query(
        "INSERT INTO `user` (username, password, email) VALUES (?, ?, ?)",
        [username, stored, "auth@example.com"]
      );
    }
  });

  it("POST /api/auth/login - returns token", async () => {
    const res = await request(app).post("/api/auth/login").send({ username, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    token = res.body.data.token;
  });

  it("GET /api/auth/me - returns user + refresh header", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers).toHaveProperty("x-access-token");
  });

  it("GET /api/auth/me - sliding expiration increases exp", async () => {
    const res1 = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    const t1 = res1.headers["x-access-token"];

    const res2 = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${t1}`);
    const t2 = res2.headers["x-access-token"];

    const p1 = decodePayload(t1);
    const p2 = decodePayload(t2);
    expect(p2.exp).toBeGreaterThanOrEqual(p1.exp);
  });
});

afterAll(async () => {
  try {
    await db.query("DELETE FROM `user` WHERE username LIKE 'jest_auth_%'");
  } finally {
    await db.end();
  }
});
