const TransactJawaban = require("../models/transactJawaban.model");

/**
 * CREATE
 */
exports.create = async (req, res) => {
  try {
    const [result] = await TransactJawaban.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        ...req.body
      }
    });
  } catch (error) {
    console.error("CREATE TRANSACT JAWABAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyimpan jawaban",
      error: error.message
    });
  }
};

/**
 * READ ALL BY TRANSACT ID
 */
exports.findByTransactId = async (req, res) => {
  try {
    const { id_transact } = req.params;
    const [rows] = await TransactJawaban.findByTransactId(id_transact);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("GET JAWABAN BY TRANSACT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data jawaban",
      error: error.message
    });
  }
};

/**
 * READ BY ID
 */
exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await TransactJawaban.findById(id);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data jawaban tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error("GET JAWABAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data jawaban",
      error: error.message
    });
  }
};

/**
 * UPDATE
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await TransactJawaban.update(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data jawaban tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Jawaban berhasil diupdate"
    });
  } catch (error) {
    console.error("UPDATE JAWABAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate jawaban",
      error: error.message
    });
  }
};

/**
 * DELETE
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await TransactJawaban.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data jawaban tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Jawaban berhasil dihapus"
    });
  } catch (error) {
    console.error("DELETE JAWABAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus jawaban",
      error: error.message
    });
  }
};

/**
 * DELETE BY TRANSACT ID
 */
exports.removeByTransactId = async (req, res) => {
  try {
    const { id_transact } = req.params;
    await TransactJawaban.removeByTransactId(id_transact);

    res.status(200).json({
      success: true,
      message: "Semua jawaban transaksi berhasil dihapus"
    });
  } catch (error) {
    console.error("DELETE JAWABAN BY TRANSACT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus jawaban transaksi",
      error: error.message
    });
  }
};

exports.bulkCreate = async (req, res) => {
  try {
    const body = req.body || {};

    const payloadKomentar = {
      id_si: body.id_si ? Number(body.id_si) : null,
      id_transact: body.id_transact ? Number(body.id_transact) : null,
      komentar: typeof body.komentar === "string" ? body.komentar : null
    };

    if (!payloadKomentar.id_si || !payloadKomentar.id_transact) {
      return res.status(400).json({
        success: false,
        message: "id_si dan id_transact wajib diisi"
      });
    }

    // tahap 1 only: model insert ke tb_komentar
    const id_komentar = await TransactJawaban.createKomentar(payloadKomentar);

    const jawabanRaw = Array.isArray(req.body.jawaban) ? req.body.jawaban : [];

    const payloadJawaban = jawabanRaw
      .map((item) => ({
        id_komentar : id_komentar, // dari insert komentar
        id_pertanyaan: Number(item.id_pertanyaan),
        jawaban: String(item.jawaban),
        tng_spec: item.tng_spec != null ? String(item.tng_spec) : ""
      }))
      .filter((item) => Number.isFinite(item.id_pertanyaan) && item.jawaban !== "null");

    // kirim ke model
    await TransactJawaban.bulkCreateJawaban(payloadJawaban);

    return res.status(201).json({
      success: true,
      message: "Berhasil disimpan",
    });
  } catch (error) {
    console.error("BULK CREATE (KOMENTAR) ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan komentar",
      error: error.message
    });
  }
};
