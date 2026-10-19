# Rencana Pengujian – Student Task Manager

Status: **Lulus (otomatis)** = sudah dijalankan dengan `node tests/test.js` dan lulus (12/12). **Belum diverifikasi** = harus Anda lakukan sendiri di browser; jangan diubah menjadi "Lulus" sebelum benar-benar dilakukan.

## A. Pengujian Otomatis (logika data)
| ID | Skenario | Kriteria lulus | Status |
|----|----------|----------------|--------|
| TC-01 | Tambah tugas valid | Validasi lolos; tugas tersimpan dengan status belum selesai | Lulus (otomatis) |
| TC-02 | Nama kosong / hanya spasi | Validasi gagal dengan pesan kesalahan nama | Lulus (otomatis) |
| TC-03 | Edit tugas | Data berubah; id dan status tetap | Lulus (otomatis) |
| TC-04 | Hapus tugas | Hanya tugas terpilih yang hilang | Lulus (otomatis) |
| TC-05 | Ubah status | Status bergantian selesai/belum selesai | Lulus (otomatis) |
| TC-06 | Filter status | Semua/aktif/selesai menghasilkan himpunan yang benar | Lulus (otomatis) |
| TC-07 | Simpan lalu muat ulang | Data yang dimuat identik dengan yang disimpan | Lulus (otomatis) |
| TC-08 | Tenggat tidak valid | `2026-02-30`, `2026-13-01`, format salah, kosong ditolak; `2028-02-29` diterima | Lulus (otomatis) |
| TC-09 | Data rusak di storage | Aplikasi memuat daftar kosong / entri valid saja, tanpa error | Lulus (otomatis) |
| TC-10 | Penyimpanan gagal | `saveTasks` mengembalikan `false`, tidak melempar error | Lulus (otomatis) |
| TC-11 | Batas panjang & trim | Nama >100 / mapel >60 ditolak; spasi tepi dipangkas | Lulus (otomatis) |
| TC-12 | Penanda terlambat | Hanya tugas belum selesai dengan tenggat lampau | Lulus (otomatis) |

## B. Pengujian Manual di Browser
Buka `index.html`. Sebelum mulai, buka DevTools → Application → Local Storage → hapus data situs agar kondisi awal bersih.

| ID | Langkah | Hasil diharapkan (kriteria lulus) | Hasil aktual | Status |
|----|---------|-----------------------------------|--------------|--------|
| MT-01 | Isi nama, mapel, tenggat valid → **Tambah Tugas** | Tugas muncul di daftar; pesan "Tugas ditambahkan."; form kosong kembali | _(isi)_ | Belum diverifikasi |
| MT-02 | Kosongkan nama (atau isi spasi) → **Tambah Tugas** | Pesan merah "Nama tugas wajib diisi."; tugas tidak bertambah | _(isi)_ | Belum diverifikasi |
| MT-03 | Klik **Edit**, ubah nama → **Simpan Perubahan** | Daftar menampilkan nama baru; judul form kembali "Tambah Tugas" | _(isi)_ | Belum diverifikasi |
| MT-04 | Klik **Hapus** → OK pada konfirmasi | Tugas hilang; pilih Batal → tugas tetap | _(isi)_ | Belum diverifikasi |
| MT-05 | Centang kotak tugas | Nama tercoret, lencana "Selesai"; ringkasan jumlah selesai bertambah | _(isi)_ | Belum diverifikasi |
| MT-06 | Klik filter **Belum selesai** lalu **Selesai** | Daftar hanya berisi tugas sesuai status; pesan kosong bila tidak ada | _(isi)_ | Belum diverifikasi |
| MT-07 | Tambah beberapa tugas, tandai satu selesai, tekan F5 | Semua data dan status tetap ada | _(isi)_ | Belum diverifikasi |
| MT-08 | Kosongkan tenggat → **Tambah Tugas** | Pesan "Tenggat waktu wajib diisi." | _(isi)_ | Belum diverifikasi |
| MT-09 | Di Console: `localStorage.setItem('studentTaskManager.tasks','{rusak')` lalu F5 | Halaman tetap tampil dengan daftar kosong, tanpa error | _(isi)_ | Belum diverifikasi |
| MT-10 | Perkecil jendela ke lebar ±375 px (mode perangkat seluler DevTools) | Tata letak satu kolom, tidak ada scroll horizontal, tombol dapat diklik | _(isi)_ | Belum diverifikasi |
