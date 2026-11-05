const Kamar = require('../models/KamarModels');
const Gedung = require('../models/GedungModels');
const { errorHttp } = require('../middleware/errorHandler');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = String(req.query.status).trim();
    }

    const data = await Kamar.find(filter).populate('gedungId', 'kode nama').sort({ createdAt: -1 });
    res.json({
      status: 'success',
      total: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Kamar.findById(req.params.id).populate('gedungId', 'kode nama');
    if (!data) return next(errorHttp(404, `Kamar dengan id ${req.params.id} tidak ditemukan`));
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nomorKamar, namaKamar, hargaPerMalam, status, fasilitas, gedungId } = req.body;
    if (!nomorKamar || !namaKamar || hargaPerMalam === undefined || !status || !gedungId) {
      return next(errorHttp(400, 'Field nomorKamar, namaKamar, hargaPerMalam, status, dan gedungId wajib diisi'));
    }

    const gedungAda = await Gedung.findById(gedungId);
    if (!gedungAda) {
      return next(errorHttp(400, `Gedung dengan id ${gedungId} tidak ditemukan`));
    }

    const baru = await Kamar.create({
      nomorKamar,
      namaKamar,
      hargaPerMalam,
      status,
      fasilitas,
      gedungId
    });
    const populated = await baru.populate('gedungId', 'kode nama');
    res.status(201).json({
      status: 'success',
      message: 'Kamar berhasil ditambahkan',
      data: populated
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const allowedFields = ['nomorKamar', 'namaKamar', 'hargaPerMalam', 'status', 'fasilitas', 'gedungId'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => allowedFields.includes(field))
    );

    if (updates.gedungId) {
      const gedungAda = await Gedung.findById(updates.gedungId);
      if (!gedungAda) return next(errorHttp(400, `Gedung dengan id ${updates.gedungId} tidak ditemukan`));
    }

    const hasil = await Kamar.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: 'after', runValidators: true }
    ).populate('gedungId', 'kode nama');

    if (!hasil) return next(errorHttp(404, `Kamar dengan id ${req.params.id} tidak ditemukan`));

    res.status(200).json({
      status: 'success',
      message: 'Kamar berhasil diperbarui',
      data: hasil
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await Kamar.findByIdAndDelete(req.params.id);
    if (!data) return next(errorHttp(404, `Kamar dengan id ${req.params.id} tidak ditemukan`));
    res.status(200).json({
      status: 'success',
      message: `Kamar dengan id ${req.params.id} berhasil dihapus`,
      data: null
    });
  } catch (err) {
    next(err);
  }
};
