const Instruktur = require('../models/HotelModel');
const { errorHttp } = require('../middleware/errorHandler');

exports.create = async (req, res, next) => {
  try {
    const instruktur = await Instruktur.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Instruktur berhasil ditambahkan',
      data: instruktur
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.keahlianBahasa) {
      filter.keahlianBahasa = new RegExp(String(req.query.keahlianBahasa), 'i');
    }
    const data = await Instruktur.find(filter);
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
    const data = await Instruktur.findById(req.params.id);
    if (!data) return next(errorHttp(404, `Instruktur dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Instruktur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!data) return next(errorHttp(404, `Instruktur dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      message: 'Data instruktur berhasil diperbarui',
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await Instruktur.findByIdAndDelete(req.params.id);
    if (!data) return next(errorHttp(404, `Instruktur dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      message: `Instruktur dengan id ${req.params.id} berhasil dihapus`,
      data: null
    });
  } catch (err) {
    next(err);
  }
};
