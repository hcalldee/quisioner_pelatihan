const SubKategori = require("../models/subKategori.model");

exports.create = async (req, res) => {
  try {
    const { nama, master_kategori } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        message: "nama wajib diisi",
      });
    }

    const result = await SubKategori.create({
      nama,
      master_kategori,
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nama,
        master_kategori,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await SubKategori.findAll();
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

exports.findById = async (req, res) => {
  try {
    const data = await SubKategori.findById(req.params.id);

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

exports.update = async (req, res) => {
  try {
    const { nama, master_kategori } = req.body;

    const result = await SubKategori.update(req.params.id, {
      nama,
      master_kategori,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await SubKategori.remove(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.search = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "keyword wajib diisi",
      });
    }

    const data = await SubKategori.search(keyword);

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
