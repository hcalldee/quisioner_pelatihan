const Tenaga = require("../models/tenaga.model");

exports.create = async (req, res) => {
  try {
    const { NI, Nama, Kelas, Kejuruan, Status } = req.body;

    if (!NI) {
      return res.status(400).json({
        success: false,
        message: "NI wajib diisi",
      });
    }

    const existing = await Tenaga.findByNI(NI);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "NI sudah terdaftar",
      });
    }

    await Tenaga.create({
      NI,
      Nama,
      Kelas,
      Kejuruan,
      Status,
    });

    res.status(201).json({
      success: true,
      data: {
        NI,
        Nama,
        Kelas,
        Kejuruan,
        Status,
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
    const data = await Tenaga.findAll();
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

exports.findByNI = async (req, res) => {
  try {
    const data = await Tenaga.findByNI(req.params.ni);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data tenaga tidak ditemukan",
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
    const { Nama, Kelas, Kejuruan, Status } = req.body;

    const result = await Tenaga.update(req.params.ni, {
      Nama,
      Kelas,
      Kejuruan,
      Status,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tenaga tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data tenaga berhasil diupdate",
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
    const result = await Tenaga.remove(req.params.ni);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tenaga tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data tenaga berhasil dihapus",
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

    const data = await Tenaga.search(keyword);

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
