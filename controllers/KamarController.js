const KelasBahasa = require('../models/Model');
const Instruktur = require('../models/GedungModels');
const { errorHttp } = require('../middleware/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['typeKamar', 'WaktuBooking', 'Bedtype', 'biaya', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['typekamar', 'WaktuBooking', 'Bedtype', 'biaya', 'createdAt', 'updatedAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};

    
    if (req.query.hotel) {
      filter.typeKamar = new RegExp(`^${req.query.typeKamar}$`, 'i');
    }

    if (req.query.Bedtype) {
      filter.Bedtype = String(req.query.Bedtype).toLowerCase();
    }

    // Filter berdasarkan hari jadwal (nested embedded filter)
    if (req.query.WaktuBooking) {
      filter['WaktuBooking'] = new RegExp(`^${req.query.WaktuBooking}$`, 'i');
    }

    // Filter berdasarkan nama atau email instruktur (referencing filter)
    if (req.query.instruktur) {
      const regexInstruktur = new RegExp(String(req.query.instruktur), 'i');
      const instrukturList = await Instruktur.find({
        $or: [
          { nama: regexInstruktur },
          { email: regexInstruktur }
        ]
      }).select('_id');
      
      const instrukturIds = instrukturList.map((i) => i._id);
      filter.instrukturId = { $in: instrukturIds };
    }

    // 2. PAGINATION
    const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

    // 3. SORTING: ?sort=biaya (naik) atau ?sort=-biaya (turun)
    const sortParam = String(req.query.sort || '-createdAt');
    const arah = sortParam.startsWith('-') ? -1 : 1;
    const sortField = sortParam.replace(/^-/, '');

    if (!FIELD_SORT.includes(sortField)) {
      return next(errorHttp(400, `Parameter sort hanya boleh salah satu dari: ${FIELD_SORT.join(', ')}`));
    }

    // 4. PROJECTION: ?fields=namaKelas,biaya,bahasa
    let select = '';
    if (req.query.fields) {
      const fields = String(req.query.fields).split(',').map((f) => f.trim()).filter(Boolean);
      if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
        return next(errorHttp(400, `Parameter fields hanya boleh berisi: ${FIELD_BOLEH_DIPILIH.join(', ')}`));
      }
      select = fields.join(' ');
    }

    // Eksekusi query dengan Mongoose
    const query = KelasBahasa.find(filter)
      .select(select)
      .sort({ [sortField]: arah, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Populate instruktur bila instrukturId terpilih atau projection tidak dibatasi
    if (!select || select.split(' ').includes('instrukturId')) {
      query.populate('instrukturId', 'nama email keahlianBahasa');
    }

    const [data, total] = await Promise.all([
      query,
      KelasBahasa.countDocuments(filter)
    ]);

    res.json({
      status: 'success',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await KelasBahasa.findById(req.params.id).populate('instrukturId', 'nama email keahlianBahasa');
    if (!data) return next(errorHttp(404, `Data kelas dengan id ${req.params.id} tidak ditemukan`));
    res.json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { namaKelas, bahasa, level, jumlahPertemuan, biaya, jadwal, instrukturId } = req.body;

    if (!namaKelas || !bahasa || !level || jumlahPertemuan === undefined || biaya === undefined) {
      return next(errorHttp(400, 'Field namaKelas, bahasa, level, jumlahPertemuan, dan biaya wajib diisi'));
    }

    // Validasi instruktur jika dikirim
    if (instrukturId) {
      const instrukturAda = await Instruktur.findById(instrukturId);
      if (!instrukturAda) {
        return next(errorHttp(400, `Instruktur dengan id ${instrukturId} tidak ditemukan`));
      }
    }

    const baru = await KelasBahasa.create({
      namaKelas,
      bahasa,
      level,
      jumlahPertemuan: Number(jumlahPertemuan),
      biaya: Number(biaya),
      jadwal,
      instrukturId: instrukturId || null
    });

    const populated = await baru.populate('instrukturId', 'nama email keahlianBahasa');

    res.status(201).json({
      status: 'success',
      message: 'Data kelas berhasil ditambahkan',
      data: populated
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { instrukturId } = req.body;
    if (instrukturId) {
      const instrukturAda = await Instruktur.findById(instrukturId);
      if (!instrukturAda) {
        return next(errorHttp(400, `Instruktur dengan id ${instrukturId} tidak ditemukan`));
      }
    }

    const hasil = await KelasBahasa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    ).populate('instrukturId', 'nama email keahlianBahasa');

    if (!hasil) return next(errorHttp(404, `Data kelas dengan id ${req.params.id} tidak ditemukan`));

    res.status(200).json({
      status: 'success',
      message: 'Data kelas berhasil diubah',
      data: hasil
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await KelasBahasa.findByIdAndDelete(req.params.id);
    if (!data) return next(errorHttp(404, `Data kelas dengan id ${req.params.id} tidak ditemukan`));

    res.status(200).json({
      status: 'success',
      message: `Data kelas dengan id ${req.params.id} berhasil dihapus`,
      data: null
    });
  } catch (err) {
    next(err);
  }
};
