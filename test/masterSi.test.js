const request = require("supertest");
const app = require("../app"); // pastikan export app, BUKAN app.listen
const db = require("../config/db");

let createdId;

afterAll(async () => {
  await db.end(); // tutup koneksi DB setelah test
});

describe("MASTER SI API", () => {

  /**
   * CREATE
   */
  it("POST /api/master-si - create data", async () => {
    const res = await request(app)
      .post("/api/master-si")
      .send({
        nama_media: "Testing Media Jest"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();

    createdId = res.body.data.id;
  });

  /**
   * GET ALL
   */
  it("GET /api/master-si - get list", async () => {
    const res = await request(app)
      .get("/api/master-si?page=1&limit=10");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /**
   * SEARCH
   */
  it("POST /api/master-si/search - search by keyword", async () => {
    const res = await request(app)
      .post("/api/master-si/search")
      .send({
        keyword: "Testing",
        page: 1,
        limit: 10
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /**
   * GET BY ID
   */
  it("GET /api/master-si/:id - get detail", async () => {
    const res = await request(app)
      .get(`/api/master-si/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  /**
   * UPDATE
   */
  it("PUT /api/master-si/:id - update data", async () => {
    const res = await request(app)
      .put(`/api/master-si/${createdId}`)
      .send({
        nama_media: "Updated Media Jest"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /**
   * DELETE
   */
  it("DELETE /api/master-si/:id - delete data", async () => {
    const res = await request(app)
      .delete(`/api/master-si/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
