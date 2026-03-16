const db = require("../config/db");

const MasterSi = {
  create: async (data) => {
    const sql = `
      INSERT INTO tb_master_si (nama_media)
      VALUES (?)
    `;
    const [result] = await db.execute(sql, [data.nama_media]);
    return result;
  },

  findAll: async (limit, offset) => {
    const sql = `
      SELECT * FROM tb_master_si
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(sql, [limit, offset]);
    return rows;
  },

  findAllWithSearch: async (keyword, limit, offset) => {
    const sql = `
      SELECT * FROM tb_master_si
      WHERE nama_media LIKE ?
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(sql, [
      `%${keyword}%`,
      limit,
      offset,
    ]);
    return rows;
  },

  countAll: async () => {
    const sql = `SELECT COUNT(*) AS total FROM tb_master_si`;
    const [[result]] = await db.execute(sql);
    return result.total;
  },

  countAllWithSearch: async (keyword) => {
    const sql = `
      SELECT COUNT(*) AS total
      FROM tb_master_si
      WHERE nama_media LIKE ?
    `;
    const [[result]] = await db.execute(sql, [`%${keyword}%`]);
    return result.total;
  },

  findById: async (id) => {
    const sql = `
      SELECT * FROM tb_master_si
      WHERE id = ?
    `;
    const [[row]] = await db.execute(sql, [id]);
    return row;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE tb_master_si
      SET nama_media = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [
      data.nama_media,
      id,
    ]);
    return result;
  },

  remove: async (id) => {
    const sql = `
      DELETE FROM tb_master_si
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [id]);
    return result;
  },
};

module.exports = MasterSi;
