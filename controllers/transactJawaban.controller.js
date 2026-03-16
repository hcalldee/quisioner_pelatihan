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
    const { id_transact, jawaban } = req.body;

    if (!id_transact || !Array.isArray(jawaban)) {
      return res.status(400).json({
        success: false,
        message: "Payload tidak valid"
      });
    }

    const payload = jawaban.map(item => ({
      id_transact,
      id_pertanyaan: item.id_pertanyaan,
      jawaban: item.jawaban
    }));

    await TransactJawaban.bulkCreate(payload);

    res.status(201).json({
      success: true,
      message: "Semua jawaban berhasil disimpan"
    });
  } catch (error) {
    console.error("BULK CREATE JAWABAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyimpan jawaban",
      error: error.message
    });
  }
};
