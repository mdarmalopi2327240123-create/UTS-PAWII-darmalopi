const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama instruktur wajib diisi'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email instruktur wajib diisi'],
    unique: true,
    trim: true,
    lowercase: true
  },
  keahlianBahasa: {
    type: String,
    required: [true, 'Keahlian bahasa wajib diisi'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Instruktur', instrukturSchema);
