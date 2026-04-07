const db = require("../config/db");

/**
 * CREATE
 */
exports.create = (data) => {
  const sql = `
    INSERT INTO tb_transact_jawaban
    (id_transact, id_pertanyaan, jawaban)
    VALUES (?, ?, ?)
  `;

  return db.execute(sql, [
    data.id_transact,
    data.id_pertanyaan,
    data.jawaban
  ]);
};

exports.createKomentar = async (data) => {
  const sql = `INSERT INTO tb_komentar (id_si, id_transact, komentar) VALUES (?, ?, ?)`;
  const [result] = await db.execute(sql, [data.id_si, data.id_transact, data.komentar]);
  return result.insertId;
};

exports.bulkCreateJawaban = (data) => {
  const sql = `
    INSERT INTO tb_transact_jawaban
    (id_komentar, id_pertanyaan, jawaban, tng_spec)
    VALUES ?
  `;

  const values = data.map((item) => [
    item.id_komentar,
    item.id_pertanyaan,
    item.jawaban,
    item.tng_spec ?? ""
  ]);

  return db.query(sql, [values]);
};

/**
 * READ ALL (by transaksi)
 * biasanya jawaban ditarik berdasarkan id_transact
 */
exports.findByTransactId = (id_transact) => {
  const sql = `
    SELECT *
    FROM tb_transact_jawaban
    WHERE id_transact = ?
  `;

  return db.execute(sql, [id_transact]);
};

/**
 * READ BY ID
 */
exports.findById = (id) => {
  const sql = `
    SELECT *
    FROM tb_transact_jawaban
    WHERE id = ?
  `;

  return db.execute(sql, [id]);
};

/**
 * UPDATE
 */
exports.update = (id, data) => {
  const sql = `
    UPDATE tb_transact_jawaban
    SET jawaban = ?
    WHERE id = ?
  `;

  return db.execute(sql, [
    data.jawaban,
    id
  ]);
};

/**
 * DELETE
 */
exports.remove = (id) => {
  const sql = `
    DELETE FROM tb_transact_jawaban
    WHERE id = ?
  `;

  return db.execute(sql, [id]);
};

/**
 * DELETE BY TRANSACT
 * berguna kalau transaksi pelatihan dihapus
 */
exports.removeByTransactId = (id_transact) => {
  const sql = `
    DELETE FROM tb_transact_jawaban
    WHERE id_transact = ?
  `;

  return db.execute(sql, [id_transact]);
};

/**
 * BULK CREATE
 * data = [{ id_transact, id_pertanyaan, jawaban }]
 */
exports.bulkCreateTx = (conn, data) => {
  const sql = `
    INSERT INTO tb_transact_jawaban
    (id_transact, id_pertanyaan, jawaban)
    VALUES ?
  `;

  const values = data.map(item => [
    item.id_transact,
    item.id_pertanyaan,
    item.jawaban
  ]);

  return conn.query(sql, [values]);
};


