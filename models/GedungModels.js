const mongoose = require('mongoose');

const gedungSchema = new mongoose.Schema({
  kode: {
    type: String,
    required: [true, 'Kode gedung wajib diisi'],
    unique: true,
    trim: true
  },
  nama: {
    type: String,
    required: [true, 'Nama gedung wajib diisi'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Gedung', gedungSchema);
