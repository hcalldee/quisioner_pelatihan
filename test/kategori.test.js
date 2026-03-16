const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

let createdId;

afterAll(async () => {
  // optional: hapus data test
  if (createdId) {
    await db.query('DELETE FROM tb_kategori_1 WHERE id = ?', [createdId]);
  }
  await db.end();
});

describe('CRUD API KATEGORI', () => {

  test('GET /api/kategori - ambil semua kategori', async () => {
    const res = await request(app).get('/api/kategori');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/kategori - tambah kategori', async () => {
    const res = await request(app)
      .post('/api/kategori')
      .send({
        name: 'Kategori Test Jest',
        tipe: '0'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBeDefined();

    createdId = res.body.id;
  });

  test('GET /api/kategori/:id - ambil kategori by id', async () => {
    const res = await request(app)
      .get(`/api/kategori/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdId);
  });

  test('PUT /api/kategori/:id - update kategori', async () => {
    const res = await request(app)
      .put(`/api/kategori/${createdId}`)
      .send({
        name: 'Kategori Test Updated',
        tipe: '1'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('DELETE /api/kategori/:id - hapus kategori', async () => {
    const res = await request(app)
      .delete(`/api/kategori/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/kategori/:id - data tidak ditemukan', async () => {
    const res = await request(app)
      .get(`/api/kategori/${createdId}`);

    expect(res.statusCode).toBe(404);
  });

});
