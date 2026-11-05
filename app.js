require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const kamarRoutes = require('./routes/KamarRoutes');
const gedungRoutes = require('./routes/GedungRoutes');

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
    topik: 'Manajemen Kamar dan Gedung',
    daftar_endpoint: [
      'GET /kamar (mendukung ?status=tersedia)',
      'GET /kamar/:id',
      'POST /kamar (Perlu Header x-api-key)',
      'PUT /kamar/:id (Perlu Header x-api-key)',
      'DELETE /kamar/:id (Perlu Header x-api-key)',
      'GET /gedung',
      'GET /gedung/:id',
      'POST /gedung (Perlu Header x-api-key)',
      'PUT /gedung/:id (Perlu Header x-api-key)',
      'DELETE /gedung/:id (Perlu Header x-api-key)'
    ]
  });
});

// ---------- Route per modul ----------
app.use('/kamar', kamarRoutes);
app.use('/gedung', gedungRoutes);

// Route untuk mensimulasikan error tak terduga
app.get('/error-uji', () => {
  throw new Error('Kesalahan tak terduga untuk pengujian');
});


app.use(notFoundHandler);
app.use(errorHandler);

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
