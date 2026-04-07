const Joi = require("joi");
const { safeString, safeTextWithBr } = require("./schemas");

const idInt = () => Joi.number().integer().positive();

const keywordSchema = Joi.object({
  keyword: safeString().trim().min(1).max(128).required(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

const tenagaSchemas = {
  create: Joi.object({
    NI: safeString().trim().min(1).max(64).required(),
    Nama: safeString().trim().min(1).max(255).required(),
    Kelas: safeString().trim().max(255).allow(null, "").optional(),
    Kejuruan: safeString().trim().max(255).allow(null, "").optional(),
    Status: Joi.alternatives().try(
      Joi.string().valid("0", "1", "2"),
      Joi.number().integer().valid(0, 1, 2)
    ).required()
  }),
  update: Joi.object({
    Nama: safeString().trim().min(1).max(255).required(),
    Kelas: safeString().trim().max(255).allow(null, "").required(),
    Kejuruan: safeString().trim().max(255).allow(null, "").required(),
    Status: Joi.alternatives().try(
      Joi.string().valid("0", "1", "2"),
      Joi.number().integer().valid(0, 1, 2)
    ).required()
  }),
  search: keywordSchema
};

const masterTransactPelatihanSchemas = {
  create: Joi.object({
    nama_pelatihan: safeString().trim().min(1).max(256).required(),
    start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    g_tenaga: safeString().trim().min(3).max(4000).required()
  }),
  update: Joi.object({
    nama_pelatihan: safeString().trim().min(1).max(256).optional(),
    start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
    g_tenaga: safeString().trim().min(3).max(4000).optional()
  }).min(1),
  search: keywordSchema,
  grafik: Joi.object({
    id_transact: idInt().required()
  })
};

const masterSiSchemas = {
  create: Joi.object({
    nama_media: safeString().trim().min(1).max(255).required()
  }),
  update: Joi.object({
    nama_media: safeString().trim().min(1).max(255).required()
  }),
  search: keywordSchema
};

const kategoriSchemas = {
  create: Joi.object({
    name: safeString().trim().min(1).max(255).required(),
    tipe: Joi.alternatives().try(
      Joi.string().valid("0", "1"),
      Joi.number().integer().valid(0, 1)
    ).required()
  }),
  update: Joi.object({
    name: safeString().trim().min(1).max(255).required(),
    tipe: Joi.alternatives().try(
      Joi.string().valid("0", "1"),
      Joi.number().integer().valid(0, 1)
    ).required()
  })
};

const subKategoriSchemas = {
  create: Joi.object({
    nama: safeString().trim().min(1).max(255).required(),
    master_kategori: Joi.alternatives().try(idInt(), safeString().trim().max(64)).required()
  }),
  update: Joi.object({
    nama: safeString().trim().min(1).max(255).required(),
    master_kategori: Joi.alternatives().try(idInt(), safeString().trim().max(64)).required()
  }),
  search: keywordSchema
};

const pertanyaanSchemas = {
  create: Joi.object({
    question: safeString().trim().min(1).max(2000).required(),
    id_sub_kategori: idInt().required()
  }),
  update: Joi.object({
    question: safeString().trim().min(1).max(2000).required(),
    id_sub_kategori: idInt().required()
  }),
  search: keywordSchema
};

const kelasSchemas = {
  create: Joi.object({
    nama_kelas: safeString().trim().min(1).max(255).required()
  }),
  update: Joi.object({
    nama_kelas: safeString().trim().min(1).max(255).required()
  })
};

const kejuruanSchemas = {
  create: Joi.object({
    nama: safeString().trim().min(1).max(255).required()
  }),
  update: Joi.object({
    nama: safeString().trim().min(1).max(255).required()
  })
};

const komentarSchemas = {
  create: Joi.object({
    id_transact: idInt().required(),
    id_si: Joi.alternatives().try(idInt(), Joi.allow(null)).default(null),
    id_peserta: Joi.alternatives().try(idInt(), Joi.allow(null)).default(null),
    komentar: safeTextWithBr().allow(null, "").max(8000).default(null)
  }),
  update: Joi.object({
    id_transact: idInt().optional(),
    id_si: Joi.alternatives().try(idInt(), Joi.allow(null)).optional(),
    id_peserta: Joi.alternatives().try(idInt(), Joi.allow(null)).optional(),
    komentar: safeTextWithBr().allow(null, "").max(8000).optional()
  }).min(1),
  detail: Joi.object({
    id_komentar: idInt().required()
  })
};

const transactJawabanSchemas = {
  create: Joi.object({
    id_transact: idInt().required(),
    id_pertanyaan: idInt().required(),
    jawaban: safeString().trim().min(1).max(20).required()
  }),
  update: Joi.object({
    jawaban: safeString().trim().min(1).max(20).required()
  }),
  bulk: Joi.object({
    id_si: idInt().required(),
    id_transact: idInt().required(),
    jawaban: Joi.array().items(
      Joi.object({
        id_pertanyaan: idInt().required(),
        jawaban: safeString().trim().min(1).max(20).required(),
        tng_spec: safeString().trim().max(64).allow(null, "").default("")
      })
    ).default([]),
    komentar: safeTextWithBr().allow(null, "").max(8000).default(null)
  })
};

module.exports = {
  tenagaSchemas,
  masterTransactPelatihanSchemas,
  masterSiSchemas,
  kategoriSchemas,
  subKategoriSchemas,
  pertanyaanSchemas,
  kelasSchemas,
  kejuruanSchemas,
  komentarSchemas,
  transactJawabanSchemas,
  keywordSchema
};