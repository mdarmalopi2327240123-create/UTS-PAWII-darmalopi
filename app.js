require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const Hotel = require('./routes/GedungRoutes');
const instrukturRoutes = require('./routes/GedungRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.json({
    nama_pelaggan: "Jessica",
    id: "105",
    nomor_topik: 5,
    topik: "Kelas Bahasa (dengan MongoDB, Embedding & Referencing)",
    daftar_endpoint: [
      "GET /kelas-bahasa (Mendukung ?bahasa=..&level=..&hari=..&instruktur=..&page=..&limit=..&sort=..&fields=..)",
      "GET /kelas-bahasa/:id",
      "POST /kelas-bahasa (Perlu Header x-api-key)",
      "PUT /kelas-bahasa/:id (Perlu Header x-api-key)",
      "DELETE /kelas-bahasa/:id (Perlu Header x-api-key)",
      "GET /instruktur",
      "GET /instruktur/:id",
      "POST /instruktur (Perlu Header x-api-key)",
      "PUT /instruktur/:id (Perlu Header x-api-key)",
      "DELETE /instruktur/:id (Perlu Header x-api-key)"
    ]
  });
});

// ---------- Route per modul ----------
app.use('/kelas-bahasa', kelasBahasaRoutes);
app.use('/instruktur', instrukturRoutes);

// Route untuk mensimulasikan error tak terduga
app.get('/error-uji', () => {
  throw new Error('Kesalahan tak terduga untuk pengujian');
});

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

// Koneksi ke MongoDB Atlas / Lokal
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.warn('PERINGATAN: DB_URI belum diatur di file .env. Menggunakan mode server tanpa MongoDB atau silakan isi DB_URI Anda.');
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT} (tanpa koneksi MongoDB)`);
  });
} else {
  mongoose.connect(DB_URI)
    .then(() => {
      console.log('Terhubung ke MongoDB');
      app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('Gagal terhubung ke MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
