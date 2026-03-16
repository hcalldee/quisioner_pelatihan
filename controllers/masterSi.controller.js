const MasterSi = require("../models/masterSi.model");

/**
 * CREATE
 */
exports.create = async (req, res) => {
  try {
    const { nama_media } = req.body;

    if (!nama_media) {
      return res.status(400).json({
        success: false,
        message: "nama_media wajib diisi",
      });
    }

    const result = await MasterSi.create({ nama_media });

    res.status(201).json({
      success: true,
      message: "Master SI berhasil ditambahkan",
      data: {
        id: result.insertId,
        nama_media,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * READ ALL (Pagination only)
 */
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const data = await MasterSi.findAll(limit, offset);
    const total = await MasterSi.countAll();

    res.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total_data: total,
        total_page: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * SEARCH (POST, keyword di body)
 */
exports.search = async (req, res) => {
  try {
    const { keyword } = req.body;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "keyword wajib diisi",
      });
    }

    const data = await MasterSi.findAllWithSearch(
      keyword,
      limit,
      offset
    );
    const total = await MasterSi.countAllWithSearch(keyword);

    res.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total_data: total,
        total_page: Math.ceil(total / limit),
        keyword,
      },
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
    const { id } = req.params;

    const data = await MasterSi.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
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
    const { id } = req.params;
    const { nama_media } = req.body;

    if (!nama_media) {
      return res.status(400).json({
        success: false,
        message: "nama_media wajib diisi",
      });
    }

    const result = await MasterSi.update(id, { nama_media });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Master SI berhasil diperbarui",
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
    const { id } = req.params;

    const result = await MasterSi.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Master SI berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
