const request = require("supertest");
const app = require("../app");

let createdId;

describe("SUB KATEGORI API", () => {
  it("POST /api/sub-kategori - create data", async () => {
    const res = await request(app)
      .post("/api/sub-kategori")
      .send({
        nama: "Sub Kategori Testing",
        master_kategori: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");

    createdId = res.body.data.id;
  });

  it("GET /api/sub-kategori - get all data", async () => {
    const res = await request(app).get("/api/sub-kategori");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/sub-kategori/search - search by keyword", async () => {
    const res = await request(app)
      .post("/api/sub-kategori/search")
      .send({
        keyword: "Testing",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/sub-kategori/:id - get by id", async () => {
    const res = await request(app).get(`/api/sub-kategori/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", createdId);
  });

  it("PUT /api/sub-kategori/:id - update data", async () => {
    const res = await request(app)
      .put(`/api/sub-kategori/${createdId}`)
      .send({
        nama: "Sub Kategori Updated",
        master_kategori: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/sub-kategori/:id - delete data", async () => {
    const res = await request(app).delete(
      `/api/sub-kategori/${createdId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

afterAll(async () => {
  const db = require("../config/db");
  await db.end();
});