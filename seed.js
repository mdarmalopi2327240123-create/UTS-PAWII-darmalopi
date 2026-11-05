require('dotenv').config();
const mongoose = require('mongoose');
const Instruktur = require('./models/instrukturModel');
const KelasBahasa = require('./models/kelasBahasaModel');

const dataInstruktur = [
  { nama: 'Kenji Sato, S.Hum.', email: 'kenji@bahasa.id', keahlianBahasa: 'Jepang' },
  { nama: 'Sarah Jenkins, M.Ed.', email: 'sarah@bahasa.id', keahlianBahasa: 'Inggris' },
  { nama: 'Park Min Soo, B.A.', email: 'park@bahasa.id', keahlianBahasa: 'Korea' },
  { nama: 'Li Wei, M.A.', email: 'liwei@bahasa.id', keahlianBahasa: 'Mandarin' }
];

const daftarBahasa = ['Jepang', 'Inggris', 'Korea', 'Mandarin'];
const levels = ['dasar', 'menengah', 'lanjut'];
const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

async function main() {
  const dbUri = process.env.DB_URI;
  if (!dbUri) {
    console.error('DB_URI tidak ditemukan di .env! Silakan isi DB_URI terlebih dahulu.');
    process.exit(1);
  }

  await mongoose.connect(dbUri);
  console.log('Terhubung ke MongoDB untuk proses seeding...');

  // Bersihkan koleksi lama
  await KelasBahasa.deleteMany({});
  await Instruktur.deleteMany({});

  // Masukkan instruktur
  const instrukturSaved = await Instruktur.insertMany(dataInstruktur);
  console.log(`Berhasil menambahkan ${instrukturSaved.length} instruktur.`);

  // Generate 20 data kelas bahasa
  const kelasList = [];
  for (let i = 1; i <= 20; i++) {
    const bahasa = daftarBahasa[i % daftarBahasa.length];
    const instruktur = instrukturSaved[i % instrukturSaved.length];
    const level = levels[i % levels.length];
    const hari = hariList[i % hariList.length];

    kelasList.push({
      namaKelas: `Kelas ${bahasa} Intensif ${i}`,
      bahasa,
      level,
      jumlahPertemuan: 10 + (i % 10),
      biaya: 1000000 + (i * 100000),
      jadwal: {
        hari,
        jamMulai: '09:00',
        jamSelesai: '11:00',
        ruangan: i % 2 === 0 ? `Ruang Lab Bahasa ${i % 3 + 1}` : 'Online (Zoom Meeting)'
      },
      instrukturId: instruktur._id
    });
  }

  await KelasBahasa.insertMany(kelasList);
  console.log(`Berhasil menambahkan ${kelasList.length} data kelas bahasa.`);

  console.log('Seeding selesai!');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Terjadi error saat seed:', err.message);
  process.exit(1);
});
