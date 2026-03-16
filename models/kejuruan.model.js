const db = require('../config/db');

const KejuruanModel = {
  // Ambil semua + search (optional)
  getAll: async (search = '') => {
    let sql = 'SELECT id, nama FROM tb_kejuruan';
    let params = [];

    if (search) {
      sql += ' WHERE nama LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, nama FROM tb_kejuruan WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { nama } = data;
    const [result] = await db.query(
      'INSERT INTO tb_kejuruan (nama) VALUES (?)',
      [nama]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nama } = data;
    const [result] = await db.query(
      'UPDATE tb_kejuruan SET nama = ? WHERE id = ?',
      [nama, id]
    );
    return result.affectedRows;
  },

  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM tb_kejuruan WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = KejuruanModel;
