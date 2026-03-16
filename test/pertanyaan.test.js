const request = require("supertest");
const app = require("../app");

describe("API Pertanyaan", () => {
  let createdId;

  /**
   * CREATE
   */
  it("POST /api/pertanyaan - create pertanyaan", async () => {
    const res = await request(app)
      .post("/api/pertanyaan")
      .send({
        question: "Apa itu Node.js?",
        id_sub_kategori: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");

    createdId = res.body.data.id;
  });

  /**
   * GET ALL
   */
  it("GET /api/pertanyaan - get semua pertanyaan", async () => {
    const res = await request(app).get("/api/pertanyaan");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /**
   * SEARCH
   */
  it("POST /api/pertanyaan/search - search pertanyaan", async () => {
    const res = await request(app)
      .post("/api/pertanyaan/search")
      .send({ keyword: "Node" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /**
   * GET BY ID
   */
  it("GET /api/pertanyaan/:id - get pertanyaan by id", async () => {
    const res = await request(app).get(`/api/pertanyaan/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  /**
   * UPDATE
   */
  it("PUT /api/pertanyaan/:id - update pertanyaan", async () => {
    const res = await request(app)
      .put(`/api/pertanyaan/${createdId}`)
      .send({
        question: "Apa itu Node.js dan kegunaannya?",
        id_sub_kategori: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /**
   * DELETE
   */
  it("DELETE /api/pertanyaan/:id - delete pertanyaan", async () => {
    const res = await request(app).delete(
      `/api/pertanyaan/${createdId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

afterAll(async () => {
  const db = require("../config/db");
  await db.end();
});