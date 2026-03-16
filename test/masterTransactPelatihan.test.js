const request = require("supertest");
const app = require("../app");

describe("MASTER TRANSACT PELATIHAN API", () => {
  let createdId;

  const payload = {
    nama_pelatihan: "Pelatihan Backend NodeJS",
    start_date: "2025-01-01",
    end_date: "2025-01-10",
    komentar: null,
    id_tenaga: "199909282025041002",
    id_si: 1
  };

  test("POST /api/master-transact-pelatihan - create data", async () => {
    const res = await request(app)
      .post("/api/master-transact-pelatihan")
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data.id");
    createdId = res.body.data.id;
  });

  test("GET /api/master-transact-pelatihan - get all data", async () => {
    const res = await request(app)
      .get("/api/master-transact-pelatihan");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/master-transact-pelatihan/search - search by nama_pelatihan", async () => {
    const res = await request(app)
      .post("/api/master-transact-pelatihan/search")
      .send({ keyword: "NodeJS" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/master-transact-pelatihan/:id - get by id", async () => {
    const res = await request(app)
      .get(`/api/master-transact-pelatihan/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data.id", createdId);
  });

  test("PUT /api/master-transact-pelatihan/:id - update data", async () => {
    const res = await request(app)
      .put(`/api/master-transact-pelatihan/${createdId}`)
      .send({
        nama_pelatihan: "Pelatihan Backend ExpressJS",
        komentar: "Update komentar"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
        "message",
        "Data pelatihan berhasil diupdate"
    );
});

test("DELETE /api/master-transact-pelatihan/:id - delete data", async () => {
    const res = await request(app)
    .delete(`/api/master-transact-pelatihan/${createdId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
    "message",
    "Data pelatihan berhasil dihapus"
    );
  });
});

afterAll(async () => {
  const db = require("../config/db");
  await db.end();
});