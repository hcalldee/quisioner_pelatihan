const db = require("../config/db");

const Tenaga = {
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO tb_tenaga 
       (NI, Nama, Kelas, Kejuruan, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.NI,
        data.Nama,
        data.Kelas,
        data.Kejuruan,
        data.Status,
      ]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM tb_tenaga ORDER BY Nama ASC"
    );
    return rows;
  },

  findByNI: async (NI) => {
    const [rows] = await db.query(
      "SELECT * FROM tb_tenaga WHERE NI = ?",
      [NI]
    );
    return rows[0];
  },
  findByNIList: async (niList) => {
    if (!Array.isArray(niList) || niList.length === 0) return [];

    const placeholders = niList.map(() => '?').join(',');

    const [rows] = await db.query(
      `SELECT NI, Nama 
      FROM tb_tenaga 
      WHERE NI IN (${placeholders})`,
      niList
    );

    return rows;
  },

  update: async (NI, data) => {
    const [result] = await db.query(
      `UPDATE tb_tenaga 
       SET Nama = ?, Kelas = ?, Kejuruan = ?, Status = ?
       WHERE NI = ?`,
      [
        data.Nama,
        data.Kelas,
        data.Kejuruan,
        data.Status,
        NI,
      ]
    );
    return result;
  },

  remove: async (NI) => {
    const [result] = await db.query(
      "DELETE FROM tb_tenaga WHERE NI = ?",
      [NI]
    );
    return result;
  },

  search: async (keyword) => {
    const [rows] = await db.query(
      `SELECT * FROM tb_tenaga 
       WHERE NI LIKE ?
          OR Nama LIKE ?
          OR Kelas LIKE ?
          OR Kejuruan LIKE ?
       ORDER BY Nama ASC`,
      [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    );
    return rows;
  },
};

module.exports = Tenaga;
