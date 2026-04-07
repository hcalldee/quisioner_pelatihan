const request = require("supertest");
const app = require("../app");
const getTestToken = require("./helpers/token");

const testNI = "NI-TEST-001";
const token = getTestToken();

describe("TENAGA API", () => {
  it("POST /api/tenaga - create data", async () => {
    const res = await request(app)
      .post("/api/tenaga")
      .set("Authorization", `Bearer ${token}`)
      .send({
        NI: testNI,
        Nama: "Tenaga Testing",
        Kelas: "XII",
        Kejuruan: "Teknik Informatika",
        Status: "1",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("NI", testNI);
  });

  it("GET /api/tenaga - get all data", async () => {
    const res = await request(app)
      .get("/api/tenaga")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/tenaga/search - search by keyword", async () => {
    const res = await request(app)
      .post("/api/tenaga/search")
      .set("Authorization", `Bearer ${token}`)
      .send({
        keyword: "Testing",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/tenaga/:ni - get by NI", async () => {
    const res = await request(app)
      .get(`/api/tenaga/${testNI}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("NI", testNI);
  });

  it("PUT /api/tenaga/:ni - update data", async () => {
    const res = await request(app)
      .put(`/api/tenaga/${testNI}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        Nama: "Tenaga Updated",
        Kelas: "XI",
        Kejuruan: "Multimedia",
        Status: "2",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/tenaga/:ni - delete data", async () => {
    const res = await request(app)
      .delete(`/api/tenaga/${testNI}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

afterAll(async () => {
  const db = require("../config/db");
  await db.end();
});
