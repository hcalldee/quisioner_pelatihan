const Kategori = require('../models/kategori.model');

// GET all
exports.getAll = async (req, res) => {
  try {
    const data = await Kategori.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by id
exports.getById = async (req, res) => {
  try {
    const data = await Kategori.getById(req.params.id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan'
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET VwKategori by id
exports.getVwKategori = async (req, res) => {
  try {
    const data = await Kategori.getVwKategori();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const { name, tipe } = req.body;

    if (!name || tipe === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name dan tipe wajib diisi'
      });
    }

    if (!['0', '1'].includes(tipe)) {
      return res.status(400).json({
        success: false,
        message: 'Tipe harus 0 atau 1'
      });
    }

    const id = await Kategori.create({ name, tipe });

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const affected = await Kategori.update(req.params.id, req.body);

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Kategori berhasil diperbarui'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const affected = await Kategori.remove(req.params.id);

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Kategori berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
