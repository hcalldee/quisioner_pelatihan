const db = require('../config/db');

const KategoriModel = {
  getAll: async () => {
    const [rows] = await db.query(
      'SELECT id, name, tipe FROM tb_kategori_1 ORDER BY id DESC'
    );
    return rows;
  },
  
  getVwKategori: async () => {
    const [rows] = await db.query(
      'SELECT * FROM vw_kategori_pertanyaan ORDER BY kategori_id ASC'
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, name, tipe FROM tb_kategori_1 WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { name, tipe } = data;
    const [result] = await db.query(
      'INSERT INTO tb_kategori_1 (name, tipe) VALUES (?, ?)',
      [name, tipe]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { name, tipe } = data;
    const [result] = await db.query(
      'UPDATE tb_kategori_1 SET name = ?, tipe = ? WHERE id = ?',
      [name, tipe, id]
    );
    return result.affectedRows;
  },

  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM tb_kategori_1 WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = KategoriModel;