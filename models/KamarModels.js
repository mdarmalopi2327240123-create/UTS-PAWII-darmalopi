const mongoose = require('mongoose');

const fasilitasSchema = new mongoose.Schema({
  kasur: { type: String, trim: true },
  pemandangan: { type: String, trim: true }
}, { _id: false });

const kamarSchema = new mongoose.Schema({
  nomorKamar: {
    type: String,
    required: [true, 'Nomor kamar wajib diisi'],
    unique: true,
    trim: true
  },
  namaKamar: {
    type: String,
    required: [true, 'Nama kamar wajib diisi'],
    trim: true
  },
  hargaPerMalam: {
    type: Number,
    required: [true, 'Harga per malam wajib diisi'],
    min: [0, 'Harga per malam minimal 0']
  },
  status: {
    type: String,
    required: [true, 'Status kamar wajib diisi'],
    trim: true
  },
  fasilitas: { type: fasilitasSchema },
  gedungId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gedung',
    required: [true, 'Gedung wajib dipilih']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kamar', kamarSchema);
