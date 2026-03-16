const Pertanyaan = require("../models/pertanyaan.model");

/**
 * CREATE
 */
exports.create = async (req, res) => {
  try {
    const { question, id_sub_kategori } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question wajib diisi",
      });
    }

    const result = await Pertanyaan.create({
      question,
      id_sub_kategori,
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        question,
        id_sub_kategori,
      },
    });
  } catch (error) {
    console.error("CREATE PERTANYAAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * READ ALL
 */
exports.findAll = async (req, res) => {
  try {
    const data = await Pertanyaan.findAll();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * READ BY ID
 */
exports.findById = async (req, res) => {
  try {
    const data = await Pertanyaan.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data pertanyaan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE
 */
exports.update = async (req, res) => {
  try {
    const { question, id_sub_kategori } = req.body;

    const result = await Pertanyaan.update(req.params.id, {
      question,
      id_sub_kategori,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pertanyaan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data pertanyaan berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE
 */
exports.remove = async (req, res) => {
  try {
    const result = await Pertanyaan.remove(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pertanyaan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data pertanyaan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * SEARCH (by question)
 */
exports.search = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "keyword wajib diisi",
      });
    }

    const data = await Pertanyaan.search(keyword);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
