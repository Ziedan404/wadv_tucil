// index.js
// Tugas Kecil 1 — Student API
// Web Advanced Development
//
// Instruksi:
//   1. Baca setiap komentar TODO dengan seksama.
//   2. Ganti baris "// TODO: ..." dengan kode yang benar.
//   3. Jangan ubah nama variabel, nama endpoint, atau struktur yang sudah ada.
//   4. Test setiap endpoint di Postman sebelum submit.
//
// Run: node index.js  →  http://localhost:3000

// Sebelum itu, tuliskan nama, NIM, di bawah ini, dan apabila sudah selesai, isi refleksi di bawah ini (dalam bentuk comment)
// Nama: ...
// NIM: ...
// Refleksi:
// blablabla
// blablabla
// blablabla
// blablabla
// blablabla

const express = require("express");
const app = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────
// TODO: tambahkan middleware agar Express bisa baca JSON dari request body
// Petunjuk: satu baris, pakai express.json()
app.use(express.json());


// ── In-memory "database" ─────────────────────────────────────
// Data awal — jangan diubah, dipakai untuk pengujian
let students = [
  { id: 1, name: "Andi Saputra",    nim: "231001", major: "Informatika",          gpa: 3.75 },
  { id: 2, name: "Bella Kurnia",    nim: "231002", major: "Sistem Informasi",      gpa: 3.50 },
  { id: 3, name: "Candra Wijaya",   nim: "231003", major: "Informatika",          gpa: 3.20 },
];

// nextId dipakai untuk generate id otomatis saat POST
let nextId = 4;

// ════════════════════════════════════════════════════════════
//  ENDPOINT 1 — GET /students
//  Kembalikan semua data mahasiswa dalam bentuk array JSON
// ════════════════════════════════════════════════════════════
app.get("/students", (req, res) => {
  // TODO: kirim response berisi seluruh array students dengan status 200
  res.status(200).json(students);
});

// ════════════════════════════════════════════════════════════
//  BONUS — GET /students/search?major=...
//  Filter mahasiswa berdasarkan query param major
//  Contoh: GET /students/search?major=Informatika
//  Jika tidak ada yang cocok → kembalikan array kosong []
// ════════════════════════════════════════════════════════════
app.get("/students/search", (req, res) => {
  const { major } = req.query;

  if (!major) {
    return res.status(200).json(students);
  }

  const filteredStudents = students.filter(student => 
    student.major.toLowerCase() === major.toLowerCase()
  );

  return res.status(200).json(filteredStudents);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 2 — GET /students/:id
//  Kembalikan satu mahasiswa berdasarkan id
//  Jika tidak ditemukan → status 404 + { error: "Student tidak ditemukan" }
// ════════════════════════════════════════════════════════════
app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id); 

  const student = students.find(
  (s) => s.id === id
);
  if (!student) {
  return res.status(404).json({
    error: "Student tidak ditemukan"
  });
}

 res.status(200).json(student);

});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 3 — POST /students
//  Tambahkan mahasiswa baru dari request body
//  Body yang dikirim: { name, nim, major, gpa }
//  Validasi: name, nim, major wajib ada — kalau tidak → 400
//  Sukses → status 201 + data mahasiswa baru
// ════════════════════════════════════════════════════════════
app.post("/students", (req, res) => {
  const { name, nim, major, gpa } = req.body;

  if (!name || !nim || !major) {
    return res.status(400).json({
      error: "name, nim, dan major wajib diisi"
    });
  }

  const newStudent = {
    id: nextId,
    name,
    nim,
    major,
    gpa: gpa ?? 0
  };

  nextId++;

  students.push(newStudent);

  res.status(201).json(newStudent);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 4 — PUT /students/:id
//  Update data mahasiswa berdasarkan id
//  Field yang bisa diupdate: name, nim, major, gpa (semua opsional)
//  Minimal satu field harus dikirim → kalau tidak ada → 400
//  Jika id tidak ditemukan → 404
// ════════════════════════════════════════════════════════════
app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, nim, major, gpa } = req.body;

    // 1. Validasi: minimal satu field harus dikirim
    if (
        name === undefined &&
        nim === undefined &&
        major === undefined &&
        gpa === undefined
    ) {
        return res.status(400).json({
            error: "Kirim minimal satu field"
        });
    }

    // 2. Cari index mahasiswa berdasarkan ID
    const index = students.findIndex(student => student.id === id);

    // 3. Jika index === -1 (tidak ditemukan), kirim 404
    if (index === -1) {
        return res.status(404).json({
            error: "Student tidak ditemukan"
        });
    }

    // 4. Update data secara partial (hanya yang dikirim di request body)
    if (name !== undefined) students[index].name = name;
    if (nim !== undefined) students[index].nim = nim;
    if (major !== undefined) students[index].major = major;
    if (gpa !== undefined) students[index].gpa = parseFloat(gpa);

    // 5. Kirim response data yang sudah di-update dengan status 200
    return res.status(200).json(students[index]);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 5 — DELETE /students/:id
//  Hapus mahasiswa berdasarkan id
//  Jika tidak ditemukan → 404
//  Sukses → status 204 (no content)
// ════════════════════════════════════════════════════════════
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // TODO: cari index mahasiswa dengan .findIndex()
  const index = students.findIndex(student => student.id === id);

  // TODO: jika tidak ditemukan (index === -1), kirim 404
  if (index === -1) {
    return res.status(404).json({
      error: "Student tidak ditemukan"
    });
  }

  // TODO: hapus mahasiswa dari array menggunakan .splice(index, 1)
  students.splice(index, 1);

  // TODO: kirim response status 204 tanpa body (gunakan .send())
  return res.status(204).send();
});

// ════════════════════════════════════════════════════════════
//  BONUS — GET /students/search?major=...
//  (Telah diimplementasikan di atas GET /students/:id)
// ════════════════════════════════════════════════════════════


// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET    /students`);
  console.log(`  GET    /students/:id`);
  console.log(`  POST   /students`);
  console.log(`  PUT    /students/:id`);
  console.log(`  DELETE /students/:id`);
  console.log(`  GET    /students/search?major=... (bonus)`);
});
