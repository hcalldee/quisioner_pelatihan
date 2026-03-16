const db = require('../config/db');

const KelasModel = {
  // Get all + search
  getAll: async (search = '') => {
    let sql = 'SELECT id, nama_kelas FROM tb_kelas';
    let params = [];

    if (search) {
      sql += ' WHERE nama_kelas LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, nama_kelas FROM tb_kelas WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { nama_kelas } = data;
    const [result] = await db.query(
      'INSERT INTO tb_kelas (nama_kelas) VALUES (?)',
      [nama_kelas]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nama_kelas } = data;
    const [result] = await db.query(
      'UPDATE tb_kelas SET nama_kelas = ? WHERE id = ?',
      [nama_kelas, id]
    );
    return result.affectedRows;
  },

  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM tb_kelas WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = KelasModel;
