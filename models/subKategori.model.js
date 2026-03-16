const db = require("../config/db");

const SubKategori = {
  create: async (data) => {
    const [result] = await db.query(
      "INSERT INTO tb_sub_kategori_1 (nama, master_kategori) VALUES (?, ?)",
      [data.nama, data.master_kategori]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM tb_sub_kategori_1 ORDER BY id DESC"
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM tb_sub_kategori_1 WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  update: async (id, data) => {
    const [result] = await db.query(
      "UPDATE tb_sub_kategori_1 SET nama = ?, master_kategori = ? WHERE id = ?",
      [data.nama, data.master_kategori, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query(
      "DELETE FROM tb_sub_kategori_1 WHERE id = ?",
      [id]
    );
    return result;
  },

  search: async (keyword) => {
    const [rows] = await db.query(
      "SELECT * FROM tb_sub_kategori_1 WHERE nama LIKE ? ORDER BY id DESC",
      [`%${keyword}%`]
    );
    return rows;
  },
};

module.exports = SubKategori;
