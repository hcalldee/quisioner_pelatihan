const db = require('../config/db');

const KomentarModel = {
  // Get all + search
  getAll: async (search = '') => {
    let sql = `
      SELECT
        k.id,
        k.id_transact,
        mtp.nama_pelatihan,
        k.id_si,
        ms.nama_media,
        k.id_peserta,
        k.komentar
      FROM tb_komentar k
      LEFT JOIN tb_master_transact_pelatihan mtp ON mtp.id = k.id_transact
      LEFT JOIN tb_master_si ms ON ms.id = k.id_si
    `;
    let params = [];

    if (search) {
      sql += `
        WHERE k.komentar LIKE ?
          OR mtp.nama_pelatihan LIKE ?
          OR ms.nama_media LIKE ?
          OR CAST(k.id_transact AS CHAR) LIKE ?
          OR CAST(k.id_si AS CHAR) LIKE ?
          OR CAST(k.id_peserta AS CHAR) LIKE ?
      `;

      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword, keyword, keyword);
    }

    sql += ' ORDER BY k.id DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT
        k.id,
        k.id_transact,
        mtp.nama_pelatihan,
        k.id_si,
        ms.nama_media,
        k.id_peserta,
        k.komentar
      FROM tb_komentar k
      LEFT JOIN tb_master_transact_pelatihan mtp ON mtp.id = k.id_transact
      LEFT JOIN tb_master_si ms ON ms.id = k.id_si
      WHERE k.id = ?
      `,
      [id]
    );
    return rows[0];
  },

  getDetailByKomentarId: async (id_komentar) => {
    const [rows] = await db.query(
      `
      SELECT
        JSON_OBJECT(
          'id', k.id,
          'id_transact', k.id_transact,
          'nama_pelatihan', mtp.nama_pelatihan,
          'id_si', k.id_si,
          'nama_media', ms.nama_media,
          'id_peserta', k.id_peserta,
          'komentar', k.komentar,
          'jawaban', COALESCE(
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', j.id,
                  'id_komentar', j.id_komentar,
                  'id_pertanyaan', j.id_pertanyaan,
                  'jawaban', j.jawaban,
                  'tng_spec', COALESCE(j.tng_spec, '')
                )
              )
              FROM (
                SELECT *
                FROM tb_transact_jawaban j
                WHERE j.id_komentar = k.id
                ORDER BY j.id_pertanyaan, j.id
              ) j
            ),
            JSON_ARRAY()
          )
        ) AS result_json
      FROM tb_komentar k
      LEFT JOIN tb_master_transact_pelatihan mtp ON mtp.id = k.id_transact
      LEFT JOIN tb_master_si ms ON ms.id = k.id_si
      WHERE k.id = ?
      LIMIT 1
      `,
      [id_komentar]
    );

    if (!rows.length || !rows[0].result_json) {
      return null;
    }

    return typeof rows[0].result_json === 'string'
      ? JSON.parse(rows[0].result_json)
      : rows[0].result_json;
  },

  create: async (data) => {
    const { id_transact, id_si = null, id_peserta = null, komentar = null } = data;
    const [result] = await db.query(
      'INSERT INTO tb_komentar (id_transact, id_si, id_peserta, komentar) VALUES (?, ?, ?, ?)',
      [id_transact, id_si, id_peserta, komentar]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];

    if (data.id_transact !== undefined) {
      fields.push('id_transact = ?');
      params.push(data.id_transact);
    }

    if (data.id_si !== undefined) {
      fields.push('id_si = ?');
      params.push(data.id_si);
    }

    if (data.id_peserta !== undefined) {
      fields.push('id_peserta = ?');
      params.push(data.id_peserta);
    }

    if (data.komentar !== undefined) {
      fields.push('komentar = ?');
      params.push(data.komentar);
    }

    if (!fields.length) {
      return 0;
    }

    params.push(id);
    const [result] = await db.query(
      `UPDATE tb_komentar SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows;
  },

  remove: async (id) => {
    const [result] = await db.query(
      'DELETE FROM tb_komentar WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = KomentarModel;
