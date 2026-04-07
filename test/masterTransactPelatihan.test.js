const request = require("supertest");
const app = require("../app");
const getTestToken = require("./helpers/token");

describe("MASTER TRANSACT PELATIHAN API", () => {
  let createdId;
  const token = getTestToken();

  const payload = {
    nama_pelatihan: "Pelatihan Backend NodeJS",
    start_date: "2025-01-01",
    end_date: "2025-01-10",
    // format g_tenaga mengikuti parseGTenaga(): "{NI1,NI2,...}"
    g_tenaga: "{199909282025041002}"
  };

  test("POST /api/master-transact-pelatihan - create data", async () => {
    const res = await request(app)
      .post("/api/master-transact-pelatihan")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data.id");
    createdId = res.body.data.id;
  });

  test("GET /api/master-transact-pelatihan - get all data", async () => {
    const res = await request(app)
      .get("/api/master-transact-pelatihan")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/master-transact-pelatihan/search - search by nama_pelatihan", async () => {
    const res = await request(app)
      .post("/api/master-transact-pelatihan/search")
      .set("Authorization", `Bearer ${token}`)
      .send({ keyword: "NodeJS" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/master-transact-pelatihan/grafik - grafik penilaian by id_transact", async () => {
    const res = await request(app)
      .post("/api/master-transact-pelatihan/grafik")
      .set("Authorization", `Bearer ${token}`)
      .send({ id_transact: createdId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("global_1_5");
    expect(res.body.data).toHaveProperty("tenaga_6_23");
    expect(res.body.data).toHaveProperty("global_24_42");
    expect(Array.isArray(res.body.data.global_1_5)).toBe(true);
    expect(Array.isArray(res.body.data.tenaga_6_23)).toBe(true);
    expect(Array.isArray(res.body.data.global_24_42)).toBe(true);
  });

  test("GET /api/master-transact-pelatihan/:id - get by id", async () => {
    const res = await request(app)
      .get(`/api/master-transact-pelatihan/${createdId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data.id", createdId);
  });

  test("PUT /api/master-transact-pelatihan/:id - update data", async () => {
    const res = await request(app)
      .put(`/api/master-transact-pelatihan/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama_pelatihan: "Pelatihan Backend ExpressJS"
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
    .delete(`/api/master-transact-pelatihan/${createdId}`)
    .set("Authorization", `Bearer ${token}`);
    
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
