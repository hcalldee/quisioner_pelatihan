const db = require("../config/db");

const MasterTransactPelatihan = {
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO tb_master_transact_pelatihan
       (nama_pelatihan, start_date, end_date, g_tenaga)
       VALUES (?, ?, ?, ?)`,
      [
        data.nama_pelatihan,
        data.start_date,
        data.end_date,
        data.g_tenaga || null
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
           g_tenaga = ?
       WHERE id = ?`,
      [
        data.nama_pelatihan,
        data.start_date,
        data.end_date,
        data.g_tenaga || null,
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

  // Return JSON payload for charting/graphing evaluation results by id_transact.
  // Output shape:
  // {
  //   global_1_5: [...],
  //   tenaga_6_23: [...],
  //   global_24_42: [...]
  // }
  grafikPenilaian: async (id_transact) => {
    const [rows] = await db.query(
      `WITH kx AS (
        SELECT id
        FROM tb_komentar
        WHERE id_transact = ?
      )
      SELECT JSON_OBJECT(
        'global_1_5',
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id_pertanyaan', t.id_pertanyaan,
            'pertanyaan', t.pertanyaan,
            'id_kategori', t.id_kategori,
            'kategori', t.kategori,
            'id_sub_kategori', t.id_sub_kategori,
            'sub_kategori', t.sub_kategori,
            'nilai_rata', t.nilai_rata,
            'deskripsi', t.deskripsi
          ))
          FROM (
            SELECT
              x.id_pertanyaan,
              p.question AS pertanyaan,
              kt.id AS id_kategori,
              kt.nama AS kategori,
              sk.id AS id_sub_kategori,
              sk.nama AS sub_kategori,
              ROUND(AVG(x.nilai_per_orang), 2) AS nilai_rata,
              CASE
                WHEN AVG(x.nilai_per_orang) >= 4.3 THEN 'Baik Sekali'
                WHEN AVG(x.nilai_per_orang) >= 3.5 THEN 'Baik'
                WHEN AVG(x.nilai_per_orang) >= 2.7 THEN 'Cukup'
                WHEN AVG(x.nilai_per_orang) >= 1.9 THEN 'Kurang Baik'
                ELSE 'Tidak Baik'
              END AS deskripsi
            FROM (
              SELECT
                tj.id_pertanyaan,
                tj.id_komentar,
                AVG(tj.jawaban + 0) AS nilai_per_orang
              FROM tb_transact_jawaban tj
              JOIN kx ON kx.id = tj.id_komentar
              WHERE tj.id_pertanyaan BETWEEN 1 AND 5
                AND (tj.tng_spec IS NULL OR tj.tng_spec = '')
              GROUP BY tj.id_pertanyaan, tj.id_komentar
            ) x
            JOIN tb_pertanyaan p ON p.id = x.id_pertanyaan
            LEFT JOIN tb_sub_kategori_1 sk ON sk.id = p.id_sub_kategori
            LEFT JOIN tb_kategori_1 kt ON kt.id = sk.master_kategori
            GROUP BY x.id_pertanyaan, p.question, kt.id, kt.nama, sk.id, sk.nama
            ORDER BY x.id_pertanyaan
          ) t
        ), JSON_ARRAY()),

        'tenaga_6_23',
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id_tenaga', t.id_tenaga,
            'nama_tenaga', t.nama_tenaga,
            'id_pertanyaan', t.id_pertanyaan,
            'pertanyaan', t.pertanyaan,
            'id_kategori', t.id_kategori,
            'kategori', t.kategori,
            'id_sub_kategori', t.id_sub_kategori,
            'sub_kategori', t.sub_kategori,
            'nilai_rata', t.nilai_rata,
            'deskripsi', t.deskripsi
          ))
          FROM (
            SELECT
              x.tng_spec AS id_tenaga,
              COALESCE(tt.Nama, x.tng_spec) AS nama_tenaga,
              x.id_pertanyaan,
              p.question AS pertanyaan,
              kt.id AS id_kategori,
              kt.nama AS kategori,
              sk.id AS id_sub_kategori,
              sk.nama AS sub_kategori,
              ROUND(AVG(x.nilai_per_orang), 2) AS nilai_rata,
              CASE
                WHEN AVG(x.nilai_per_orang) >= 4.3 THEN 'Baik Sekali'
                WHEN AVG(x.nilai_per_orang) >= 3.5 THEN 'Baik'
                WHEN AVG(x.nilai_per_orang) >= 2.7 THEN 'Cukup'
                WHEN AVG(x.nilai_per_orang) >= 1.9 THEN 'Kurang Baik'
                ELSE 'Tidak Baik'
              END AS deskripsi
            FROM (
              SELECT
                tj.tng_spec,
                tj.id_pertanyaan,
                tj.id_komentar,
                AVG(tj.jawaban + 0) AS nilai_per_orang
              FROM tb_transact_jawaban tj
              JOIN kx ON kx.id = tj.id_komentar
              WHERE tj.id_pertanyaan BETWEEN 6 AND 23
                AND tj.tng_spec IS NOT NULL
                AND tj.tng_spec <> ''
              GROUP BY tj.tng_spec, tj.id_pertanyaan, tj.id_komentar
            ) x
            LEFT JOIN tb_tenaga tt ON tt.NI = x.tng_spec
            JOIN tb_pertanyaan p ON p.id = x.id_pertanyaan
            LEFT JOIN tb_sub_kategori_1 sk ON sk.id = p.id_sub_kategori
            LEFT JOIN tb_kategori_1 kt ON kt.id = sk.master_kategori
            GROUP BY x.tng_spec, tt.Nama, x.id_pertanyaan, p.question, kt.id, kt.nama, sk.id, sk.nama
            ORDER BY nama_tenaga, sk.id, x.id_pertanyaan
          ) t
        ), JSON_ARRAY()),

        'global_24_42',
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id_pertanyaan', t.id_pertanyaan,
            'pertanyaan', t.pertanyaan,
            'id_kategori', t.id_kategori,
            'kategori', t.kategori,
            'id_sub_kategori', t.id_sub_kategori,
            'sub_kategori', t.sub_kategori,
            'nilai_rata', t.nilai_rata,
            'deskripsi', t.deskripsi
          ))
          FROM (
            SELECT
              x.id_pertanyaan,
              p.question AS pertanyaan,
              kt.id AS id_kategori,
              kt.nama AS kategori,
              sk.id AS id_sub_kategori,
              sk.nama AS sub_kategori,
              ROUND(AVG(x.nilai_per_orang), 2) AS nilai_rata,
              CASE
                WHEN AVG(x.nilai_per_orang) >= 4.3 THEN 'Baik Sekali'
                WHEN AVG(x.nilai_per_orang) >= 3.5 THEN 'Baik'
                WHEN AVG(x.nilai_per_orang) >= 2.7 THEN 'Cukup'
                WHEN AVG(x.nilai_per_orang) >= 1.9 THEN 'Kurang Baik'
                ELSE 'Tidak Baik'
              END AS deskripsi
            FROM (
              SELECT
                tj.id_pertanyaan,
                tj.id_komentar,
                AVG(tj.jawaban + 0) AS nilai_per_orang
              FROM tb_transact_jawaban tj
              JOIN kx ON kx.id = tj.id_komentar
              WHERE tj.id_pertanyaan BETWEEN 24 AND 42
                AND (tj.tng_spec IS NULL OR tj.tng_spec = '')
              GROUP BY tj.id_pertanyaan, tj.id_komentar
            ) x
            JOIN tb_pertanyaan p ON p.id = x.id_pertanyaan
            LEFT JOIN tb_sub_kategori_1 sk ON sk.id = p.id_sub_kategori
            LEFT JOIN tb_kategori_1 kt ON kt.id = sk.master_kategori
            GROUP BY x.id_pertanyaan, p.question, kt.id, kt.nama, sk.id, sk.nama
            ORDER BY x.id_pertanyaan
          ) t
        ), JSON_ARRAY())
      ) AS review_json`,
      [id_transact]
    );

    return rows && rows.length ? rows[0] : null;
  },
};

module.exports = MasterTransactPelatihan;
