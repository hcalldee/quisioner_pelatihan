const request = require("supertest");
const app = require("../app");

describe("TRANSACT JAWABAN API", () => {
  let createdId;
  const idTransact = 13;       // pastikan ADA di tb_master_transact_pelatihan
  const idPertanyaan = 1;     // pastikan ADA di tb_pertanyaan

  const payload = {
    id_transact: idTransact,
    id_pertanyaan: idPertanyaan,
    jawaban: "4"
  };

  test("POST /api/transact-jawaban - create jawaban", async () => {
    const res = await request(app)
      .post("/api/transact-jawaban")
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.id");

    createdId = res.body.data.id;
  });

  test("GET /api/transact-jawaban/:id - get by id", async () => {
    const res = await request(app)
      .get(`/api/transact-jawaban/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.id", createdId);
  });

  test("GET /api/transact-jawaban/transact/:id_transact - get by transact", async () => {
    const res = await request(app)
      .get(`/api/transact-jawaban/transact/${idTransact}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("PUT /api/transact-jawaban/:id - update jawaban", async () => {
    const res = await request(app)
      .put(`/api/transact-jawaban/${createdId}`)
      .send({ jawaban: "5" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Jawaban berhasil diupdate"
    );
  });

  test("DELETE /api/transact-jawaban/:id - delete jawaban", async () => {
    const res = await request(app)
      .delete(`/api/transact-jawaban/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Jawaban berhasil dihapus"
    );
  });
});

afterAll(async () => {
  const db = require("../config/db");
  await db.end();
});