const mongoose = require('mongoose');

// 1. EMBEDDED SCHEMA: Jadwal Pertemuan (Embedding Subdocument)
const jadwalSchema = new mongoose.Schema({
  hari: {
    type: String,
    required: [true, 'Hari pertemuan wajib diisi'],
    enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  },
  jamMulai: {
    type: String,
    required: [true, 'Jam mulai wajib diisi']
  },
  jamSelesai: {
    type: String,
    required: [true, 'Jam selesai wajib diisi']
  },
  ruangan: {
    type: String,
    default: 'Online / Zoom'
  }
}, { _id: false });

// 2. MAIN SCHEMA: Kelas Bahasa
const kelasBahasaSchema = new mongoose.Schema({
  namaKelas: {
    type: String,
    required: [true, 'Nama kelas wajib diisi'],
    trim: true
  },
  bahasa: {
    type: String,
    required: [true, 'Bahasa wajib diisi'],
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Level wajib diisi'],
    enum: {
      values: ['dasar', 'menengah', 'lanjut'],
      message: 'Level harus dasar, menengah, atau lanjut'
    },
    lowercase: true,
    trim: true
  },
  jumlahPertemuan: {
    type: Number,
    required: [true, 'Jumlah pertemuan wajib diisi'],
    min: [1, 'Jumlah pertemuan minimal 1']
  },
  biaya: {
    type: Number,
    required: [true, 'Biaya wajib diisi'],
    min: [0, 'Biaya tidak boleh bernilai negatif']
  },
  // EMBEDDING: Jadwal Pertemuan
  jadwal: jadwalSchema,
  // REFERENCING: Relasi ke Schema Instruktur (ObjectId)
  instrukturId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instruktur'
  }
}, { timestamps: true });

module.exports = mongoose.model('KelasBahasa', kelasBahasaSchema);
