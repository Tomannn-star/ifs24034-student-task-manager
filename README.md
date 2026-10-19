# Student Task Manager

Aplikasi web sederhana untuk mencatat, mengelola, dan memantau tugas perkuliahan. Dibuat sebagai **Tugas I – 11S3133 Pengembangan Aplikasi Berbasis Web (PABWE)** dengan memanfaatkan Generative AI sebagai asisten pemrograman.

## Permasalahan yang Diselesaikan
Mahasiswa sering menerima banyak tugas dari berbagai mata kuliah dengan tenggat berbeda. Pencatatan yang tersebar membuat tugas terlewat. Aplikasi ini menyediakan satu tempat untuk mencatat tugas, melihat tenggat, dan menandai progres tanpa instalasi atau server.

## Fitur
- Menambahkan tugas baru (nama tugas, mata kuliah, tenggat waktu).
- Menampilkan daftar tugas, diurutkan berdasarkan tenggat terdekat.
- Mengedit dan menghapus tugas (hapus meminta konfirmasi).
- Menandai tugas selesai / belum selesai.
- Validasi input: semua kolom wajib diisi, spasi saja ditolak, batas panjang, tanggal harus valid.
- Penyaringan: Semua / Belum selesai / Selesai.
- Penanda "Terlambat" untuk tugas belum selesai yang melewati tenggat.
- Penyimpanan otomatis di `localStorage` (data tetap ada setelah halaman dimuat ulang).
- Tampilan responsif untuk desktop dan seluler.

## Teknologi
HTML5, CSS3, JavaScript (ES5/ES6 tanpa library atau framework), `localStorage`. Pengujian otomatis memakai Node.js (modul bawaan `assert`, tanpa dependensi tambahan).

## Struktur Folder
```
student-task-manager/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
├── tests/
│   ├── test.js                  # pengujian otomatis logika data
│   └── demo-initial-bugs.js     # reproduksi kesalahan pada draf awal
├── docs/
│   ├── proposal.docx
│   ├── proposal.pdf
│   ├── ai-usage-log.md
│   ├── test-plan.md
│   ├── diagrams/
│   └── screenshots/
└── README.md
```

## Cara Menjalankan
1. Unduh atau clone repository ini.
2. Buka `index.html` langsung di browser (Chrome, Edge, Firefox). Tidak perlu server atau instalasi.

## Contoh Penggunaan
1. Isi **Nama tugas** = `Tugas I PABWE`, **Mata kuliah** = `PABWE`, pilih **Tenggat waktu**, klik **Tambah Tugas**.
2. Centang kotak di kiri tugas untuk menandainya selesai.
3. Klik **Edit** untuk mengubah data, lalu **Simpan Perubahan** (atau **Batal**).
4. Gunakan tombol **Belum selesai** / **Selesai** untuk menyaring daftar.
5. Muat ulang halaman: data tetap tersimpan.

## Cara Melakukan Pengujian
- **Otomatis** (membutuhkan Node.js ≥ 14): `node tests/test.js` — menguji logika validasi, CRUD, status, filter, dan penyimpanan memakai penyimpanan tiruan.
- **Reproduksi kesalahan draf awal**: `node tests/demo-initial-bugs.js`.
- **Manual di browser**: ikuti skenario MT-01 s.d. MT-10 pada `docs/test-plan.md`.

Pengujian otomatis tidak menguji tampilan (DOM); bagian itu harus diverifikasi manual.

## Pemanfaatan AI
AI generatif digunakan untuk merancang struktur aplikasi, menyusun kode awal, memperbaiki validasi dan penyimpanan, serta meninjau kode. Seluruh keluaran AI diperiksa dan diuji sebelum diterima. Catatan instruksi, kesalahan yang ditemukan, perbaikan, dan alasan keputusan ada di [`docs/ai-usage-log.md`](docs/ai-usage-log.md).

## Batasan
- Data hanya tersimpan di browser dan perangkat yang sama (tidak ada sinkronisasi antarperangkat).
- Membersihkan data situs di browser akan menghapus data tugas.
- Tidak ada notifikasi pengingat, autentikasi pengguna, atau kategori/prioritas tugas.
- Penanda "Terlambat" membandingkan tanggal dengan tanggal lokal perangkat.

## Informasi Penulis
- Nama: Manto
- NIM: `[ISI NIM]`
- Program Studi: `[ISI PROGRAM STUDI]`
- Institusi: `[ISI NAMA INSTITUSI]`
