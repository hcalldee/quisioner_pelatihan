const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/kejuruan', require('./routes/kejuruan.routes'));
app.use('/api/kategori', require('./routes/kategori.routes'));
app.use('/api/master-si', require('./routes/masterSi.routes'));
app.use("/api/sub-kategori", require("./routes/subKategori.routes"));
app.use("/api/tenaga", require("./routes/tenaga.routes"));
app.use("/api/master-transact-pelatihan", require("./routes/masterTransactPelatihan.routes"));
app.use("/api/transact-jawaban", require("./routes/transactJawaban.routes"));
app.use("/api/pertanyaan", require("./routes/pertanyaan.routes"));
app.use('/api/kelas', require('./routes/kelas.routes'));

module.exports = app;
