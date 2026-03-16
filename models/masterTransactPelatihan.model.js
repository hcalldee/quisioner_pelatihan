const db = require("../config/db");



const MasterTransactPelatihan = {
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO tb_master_transact_pelatihan
       (nama_pelatihan, start_date, end_date, komentar, id_tenaga, id_si)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.nama_pelatihan,
        data.start_date,
        data.end_date,
        data.komentar || null,
        data.id_tenaga,
        data.id_si,
      ]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await db.query(
      `SELECT * 
       FROM tb_master_transact_pelatihan
       ORDER BY id ASC`
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT * 
       FROM tb_master_transact_pelatihan
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  update: async (id, data) => {
    const [result] = await db.query(
      `UPDATE tb_master_transact_pelatihan
       SET nama_pelatihan = ?,
           start_date = ?,
           end_date = ?,
           komentar = ?,
           id_tenaga = ?,
           id_si = ?
       WHERE id = ?`,
      [
        data.nama_pelatihan,
        data.start_date,
        data.end_date,
        data.komentar || null,
        data.id_tenaga,
        data.id_si,
        id,
      ]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query(
      "DELETE FROM tb_master_transact_pelatihan WHERE id = ?",
      [id]
    );
    return result;
  },

  search: async (keyword) => {
    const [rows] = await db.query(
      `SELECT * FROM tb_master_transact_pelatihan
       WHERE nama_pelatihan LIKE ?
       ORDER BY id DESC`,
      [`%${keyword}%`]
    );
    return rows;
  },
};

module.exports = MasterTransactPelatihan;
