const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.disable('x-powered-by');

const corsOptions = {
  // Reflect origin, including `null` (file://, Cordova).
  origin: function (origin, cb) {
    // If opened from file:// (Chrome/Cordova), Origin header is the literal string "null".
    // Echo it back so the browser accepts the response.
    if (!origin) return cb(null, "*");
    return cb(null, origin);
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-app-key"],
  exposedHeaders: ["x-access-token"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Express v5 + path-to-regexp v8: "*" is not a valid path pattern here.
// Use a regex to match all paths for preflight requests.
app.options(/.*/, cors(corsOptions));

app.use(
  helmet({
    // API-only: avoid strict CSP/CORP headers that may interfere with cross-origin clients.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  })
);

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
app.use('/api/komentar', require('./routes/komentar.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/public', require('./routes/public.routes'));

module.exports = app;
