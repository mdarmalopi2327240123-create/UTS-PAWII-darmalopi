const Gedung = require('../models/GedungModels');
const { errorHttp } = require('../middleware/errorHandler');

exports.create = async (req, res, next) => {
  try {
    const { kode, nama } = req.body;
    if (!kode || !nama) return next(errorHttp(400, 'Field kode dan nama wajib diisi'));
    const gedung = await Gedung.create({ kode, nama });
    res.status(201).json({
      status: 'success',
      message: 'Gedung berhasil ditambahkan',
      data: gedung
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await Gedung.find().sort({ kode: 1 });
    res.json({
      status: 'success',
      total: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Gedung.findById(req.params.id);
    if (!data) return next(errorHttp(404, `Gedung dengan id ${req.params.id} tidak ditemukan`));
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.kode !== undefined) updates.kode = req.body.kode;
    if (req.body.nama !== undefined) updates.nama = req.body.nama;
    const data = await Gedung.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: 'after', runValidators: true }
    );
    if (!data) return next(errorHttp(404, `Gedung dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      message: 'Gedung berhasil diperbarui',
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await Gedung.findByIdAndDelete(req.params.id);
    if (!data) return next(errorHttp(404, `Gedung dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      message: `Gedung dengan id ${req.params.id} berhasil dihapus`,
      data: null
    });
  } catch (err) {
    next(err);
  }
};
