const KelasModel = require('../models/kelas.model');

const KelasController = {
  getAll: async (req, res) => {
    try {
      const { search } = req.query;
      const data = await KelasModel.getAll(search || '');

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
      const data = await KelasModel.getById(id);

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
      const id = await KelasModel.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Data kelas berhasil ditambahkan',
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
      const affected = await KelasModel.update(id, req.body);

      if (!affected) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data kelas berhasil diperbarui'
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
      const affected = await KelasModel.remove(id);

      if (!affected) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data kelas berhasil dihapus'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};

module.exports = KelasController;
