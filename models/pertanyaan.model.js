const db = require("../config/db");

/**
 * CREATE
 */
exports.create = async (data) => {
  const sql = `
    INSERT INTO tb_pertanyaan (question, id_sub_kategori)
    VALUES (?, ?)
  `;

  const [result] = await db.query(sql, [
    data.question,
    data.id_sub_kategori,
  ]);

  return result;
};

/**
 * READ ALL
 */
exports.findAll = async () => {
  const [rows] = await db.query(
    "SELECT * FROM tb_pertanyaan ORDER BY id DESC"
  );
  return rows;
};

/**
 * READ BY ID
 */
exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM tb_pertanyaan WHERE id = ?",
    [id]
  );
  return rows[0];
};

/**
 * UPDATE
 */
exports.update = async (id, data) => {
  const sql = `
    UPDATE tb_pertanyaan
    SET question = ?, id_sub_kategori = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [
    data.question,
    data.id_sub_kategori,
    id,
  ]);

  return result;
};

/**
 * DELETE
 */
exports.remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM tb_pertanyaan WHERE id = ?",
    [id]
  );
  return result;
};

/**
 * SEARCH
 */
exports.search = async (keyword) => {
  const [rows] = await db.query(
    `
    SELECT * FROM tb_pertanyaan
    WHERE question LIKE ?
    ORDER BY id DESC
    `,
    [`%${keyword}%`]
  );

  return rows;
};

