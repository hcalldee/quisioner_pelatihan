const KejuruanModel = require('../models/kejuruan.model');

const KejuruanController = {
  getAll: async (req, res) => {
    try {
      const { search } = req.query; // ?search=...
      const data = await KejuruanModel.getAll(search || '');

      res.json({
        success: true,
        data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await KejuruanModel.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  create: async (req, res) => {
    try {
      const id = await KejuruanModel.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Data kejuruan berhasil ditambahkan',
        id
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const affected = await KejuruanModel.update(id, req.body);

      if (!affected) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data kejuruan berhasil diperbarui'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const affected = await KejuruanModel.remove(id);

      if (!affected) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data kejuruan berhasil dihapus'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};

module.exports = KejuruanController;
