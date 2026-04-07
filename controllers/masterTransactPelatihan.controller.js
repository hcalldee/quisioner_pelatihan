const MasterTransactPelatihan = require("../models/masterTransactPelatihan.model");
const TenagaModel = require('../models/tenaga.model');
const {
  formatDateWithDayID,
  parseGTenaga
} = require('../utilities/function');

function toISODateOnly(d) {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString().slice(0, 10);
}

exports.create = async (req, res) => {
  try {
    const {
      nama_pelatihan,
      start_date,
      end_date,
      g_tenaga
    } = req.body;

    if (!nama_pelatihan) {
      return res.status(400).json({
        success: false,
        message: "nama_pelatihan wajib diisi",
      });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "start_date dan end_date wajib diisi",
      });
    }

    const sd = new Date(start_date);
    const ed = new Date(end_date);
    if (Number.isNaN(sd.getTime()) || Number.isNaN(ed.getTime())) {
      return res.status(400).json({
        success: false,
        message: "format start_date/end_date tidak valid",
      });
    }
    if (ed < sd) {
      return res.status(400).json({
        success: false,
        message: "end_date tidak boleh lebih kecil dari start_date",
      });
    }

    if (!g_tenaga || !parseGTenaga(g_tenaga).length) {
      return res.status(400).json({
        success: false,
        message: "g_tenaga wajib diisi (minimal 1 instruktur)",
      });
    }

    const result = await MasterTransactPelatihan.create({
      nama_pelatihan,
      start_date,
      end_date,
      g_tenaga
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nama_pelatihan,
        start_date,
        end_date,
        g_tenaga
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

    // ðŸ‘‡ INI DIA TEMPATNYA
    const tenagaRows = await TenagaModel.findByNIList(allNI);

    // mapping NI -> { nama, status } dari tb_tenaga
    const tenagaMap = {};
    tenagaRows.forEach((t) => {
      tenagaMap[t.NI] = {
        nama: t.Nama,
        status: t.Status != null ? String(t.Status) : "0",
      };
    });
    
    // inject ke response
    const parsedData = data.map(item => {
     // ubah g_tenaga jadi array objek dengan status & nama (status dari tb_tenaga.Status)
      const gTenagaObj = parseGTenaga(item.g_tenaga).map((ni) => {
        const meta = tenagaMap[ni] || {};
        return {
          status: meta.status != null ? String(meta.status) : "0",
          nama: meta.nama || ni,
          ni: ni
        };
      });

      return {
        ...item,
        start_date_raw: toISODateOnly(item.start_date),
        end_date_raw: toISODateOnly(item.end_date),
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

    // bikin map NI -> { nama, status }
    const tenagaMap = {};
    tenagaRows.forEach((t) => {
      tenagaMap[t.NI] = {
        nama: t.Nama,
        status: t.Status != null ? String(t.Status) : "0",
      };
    });

    // inject ke response (TANPA map)
    const parsedData = {
      ...data,
      start_date_raw: toISODateOnly(data.start_date),
      end_date_raw: toISODateOnly(data.end_date),
      start_date: formatDateWithDayID(data.start_date),
      end_date: formatDateWithDayID(data.end_date),
      g_tenaga: parseGTenaga(data.g_tenaga).map((ni) => {
        const meta = tenagaMap[ni] || {};
        return {
          status: meta.status != null ? String(meta.status) : "0",
          nama: meta.nama || ni,
          ni: ni
        };
      })
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
      g_tenaga
    } = req.body;

    if (start_date && end_date) {
      const sd = new Date(start_date);
      const ed = new Date(end_date);
      if (!Number.isNaN(sd.getTime()) && !Number.isNaN(ed.getTime()) && ed < sd) {
        return res.status(400).json({
          success: false,
          message: "end_date tidak boleh lebih kecil dari start_date",
        });
      }
    }

    if (g_tenaga && !parseGTenaga(g_tenaga).length) {
      return res.status(400).json({
        success: false,
        message: "g_tenaga tidak valid",
      });
    }

    const result = await MasterTransactPelatihan.update(req.params.id, {
      nama_pelatihan,
      start_date,
      end_date,
      g_tenaga
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
    const parsedData = (data || []).map((item) => ({
      ...item,
      start_date: formatDateWithDayID(item.start_date),
      end_date: formatDateWithDayID(item.end_date),
      g_tenaga: parseGTenaga(item.g_tenaga)
    }));

    res.json({ success: true, data: parsedData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
