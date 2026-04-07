const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
const getTestToken = require("./helpers/token");

describe("API Komentar", () => {
  let createdId;
  let testIdTransact;
  let testIdSi;
  const token = getTestToken();

  beforeAll(async () => {
    const [transactRows] = await db.query(
      "SELECT id FROM tb_master_transact_pelatihan ORDER BY id ASC LIMIT 1"
    );
    const [siRows] = await db.query(
      "SELECT id FROM tb_master_si ORDER BY id ASC LIMIT 1"
    );

    if (!transactRows.length) {
      throw new Error("Data tb_master_transact_pelatihan kosong untuk test komentar");
    }

    if (!siRows.length) {
      throw new Error("Data tb_master_si kosong untuk test komentar");
    }

    testIdTransact = transactRows[0].id;
    testIdSi = siRows[0].id;
  });

  it("POST /api/komentar - create komentar", async () => {
    const res = await request(app)
      .post("/api/komentar")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_transact: testIdTransact,
        id_si: testIdSi,
        id_peserta: null,
        komentar: "Komentar testing jest"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("id");

    createdId = res.body.id;
  });

  it("GET /api/komentar - get semua komentar", async () => {
    const res = await request(app)
      .get("/api/komentar")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/komentar?search=testing - search komentar", async () => {
    const res = await request(app)
      .get("/api/komentar?search=testing")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/komentar/:id - get komentar by id", async () => {
    const res = await request(app)
      .get(`/api/komentar/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  it("POST /api/komentar/detail - get detail komentar by id_komentar", async () => {
    const res = await request(app)
      .post("/api/komentar/detail")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_komentar: createdId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
    expect(res.body.data).toHaveProperty("jawaban");
    expect(Array.isArray(res.body.data.jawaban)).toBe(true);
  });

  it("POST /api/komentar/detail - return 400 if id_komentar missing", async () => {
    const res = await request(app)
      .post("/api/komentar/detail")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("PUT /api/komentar/:id - update komentar", async () => {
    const res = await request(app)
      .put(`/api/komentar/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        komentar: "Komentar testing diupdate"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/komentar/:id - delete komentar", async () => {
    const res = await request(app)
      .delete(`/api/komentar/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

afterAll(async () => {
  await db.end();
});
