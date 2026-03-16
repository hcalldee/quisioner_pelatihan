const MasterTransactPelatihan = require("../models/masterTransactPelatihan.model");
const TenagaModel = require('../models/tenaga.model');
const {
  formatDateWithDayID,
  parseGTenaga
} = require('../utilities/function');

exports.create = async (req, res) => {
  try {
    const {
      nama_pelatihan,
      start_date,
      end_date,
      komentar,
      id_tenaga,
      id_si,
    } = req.body;

    if (!nama_pelatihan) {
      return res.status(400).json({
        success: false,
        message: "nama_pelatihan wajib diisi",
      });
    }

    const result = await MasterTransactPelatihan.create({
      nama_pelatihan,
      start_date,
      end_date,
      komentar,
      id_tenaga,
      id_si,
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nama_pelatihan,
        start_date,
        end_date,
        komentar,
        id_tenaga,
        id_si,
      },
    });
  } catch (error) {
    console.error("CREATE MASTER TRANSACT ERROR:", error); 
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    // ambil data utama
    const data = await MasterTransactPelatihan.findAll();

    // kumpulkan semua NI
    const allNI = [
      ...new Set(
        data.flatMap(d => parseGTenaga(d.g_tenaga))
      )
    ];

    // 👇 INI DIA TEMPATNYA
    const tenagaRows = await TenagaModel.findByNIList(allNI);

    // mapping NI → Nama
    const tenagaMap = {};
    tenagaRows.forEach(t => {
      tenagaMap[t.NI] = t.Nama;
    });

    // inject ke response
    const parsedData = data.map(item => {
     // ubah g_tenaga jadi array objek dengan status & nama
      const gTenagaObj = parseGTenaga(item.g_tenaga).map((ni, idx) => ({
        // status: idx === 0 ? "1" : "0", // contoh: first index = 1, sisanya 0
        status: idx.toString(),
        nama: tenagaMap[ni] || ni,
        ni:ni
      }));

      return {
        ...item,
        start_date: formatDateWithDayID(item.start_date),
        end_date: formatDateWithDayID(item.end_date),
        g_tenaga: gTenagaObj
      };
    });

    res.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.findById = async (req, res) => {
  try {
    const data = await MasterTransactPelatihan.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data pelatihan tidak ditemukan",
      });
    }

 // ambil NI list dari g_tenaga
    const niList = parseGTenaga(data.g_tenaga);

    // ambil data tenaga
    const tenagaRows = await TenagaModel.findByNIList(niList);

    // bikin map NI -> Nama
    const tenagaMap = {};
    tenagaRows.forEach(t => {
      tenagaMap[t.NI] = t.Nama;
    });

    // inject ke response (TANPA map)
    const parsedData = {
      ...data,
      start_date: formatDateWithDayID(data.start_date),
      end_date: formatDateWithDayID(data.end_date),
      g_tenaga: parseGTenaga(data.g_tenaga).map((ni, idx) => ({
        status: idx.toString(),
        nama: tenagaMap[ni] || ni,
        ni: ni
      }))
    };

    res.json({
      success: true,
      data: parsedData
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
    const {
      nama_pelatihan,
      start_date,
      end_date,
      komentar,
      id_tenaga,
      id_si,
    } = req.body;

    const result = await MasterTransactPelatihan.update(req.params.id, {
      nama_pelatihan,
      start_date,
      end_date,
      komentar,
      id_tenaga,
      id_si,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pelatihan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data pelatihan berhasil diupdate",
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
    const result = await MasterTransactPelatihan.remove(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pelatihan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data pelatihan berhasil dihapus",
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

    const data = await MasterTransactPelatihan.search(keyword);

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
