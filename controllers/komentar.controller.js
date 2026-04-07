const KomentarModel = require('../models/komentar.model');

const KomentarController = {
  getAll: async (req, res) => {
    try {
      const { search } = req.query;
      const data = await KomentarModel.getAll(search || '');

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
      const data = await KomentarModel.getById(id);

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

  detail: async (req, res) => {
    try {
      const { id_komentar } = req.body || {};
      const id = Number(id_komentar);

      if (!id || Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'id_komentar wajib diisi'
        });
      }

      const data = await KomentarModel.getDetailByKomentarId(id);

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
      const id = await KomentarModel.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Data Komentar berhasil ditambahkan',
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
      const affected = await KomentarModel.update(id, req.body);

      if (!affected) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data Komentar berhasil diperbarui'
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
      const affected = await KomentarModel.remove(id);

      if (!affected) {
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Data Komentar berhasil dihapus'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};

module.exports = KomentarController;
