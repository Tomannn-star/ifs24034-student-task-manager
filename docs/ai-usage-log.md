# Dokumentasi Penggunaan AI

Catatan ini mendokumentasikan penggunaan AI secara kritis. Entri 1–6 berasal dari sesi pengerjaan bersama Claude (Anthropic). **Catatan kejujuran:** draf awal "V0" pada entri 3 disusun sebagai representasi draf pertama yang sederhana agar kesalahannya dapat direproduksi lewat `tests/demo-initial-bugs.js`. Jika Anda memakai sesi AI Anda sendiri, ganti isi kolom prompt dan keluaran dengan percakapan asli Anda, dan lampirkan screenshot-nya.

## Entri 1 – Merancang struktur aplikasi
- **Instruksi:** meminta rancangan aplikasi Student Task Manager (HTML, CSS, JavaScript, localStorage) dengan fitur CRUD, status, filter, validasi, dan struktur folder.
- **Keluaran AI:** struktur `index.html`, `css/style.css`, `js/script.js`, daftar fitur, dan alur data.
- **Pemeriksaan:** membandingkan fitur dengan ketentuan tugas dan daftar fitur minimal.
- **Temuan:** tidak ada kekurangan fitur; AI menambahkan penanda "Terlambat".
- **Keputusan:** *diterima*; penanda "Terlambat" dipertahankan karena ringan dan relevan, lalu dicatat sebagai asumsi.

## Entri 2 – Memisahkan logika dan antarmuka
- **Instruksi:** meminta agar logika data (validasi, CRUD, filter, penyimpanan) dipisah dari kode DOM agar dapat diuji tanpa browser.
- **Keluaran AI:** modul fungsi murni di `script.js` yang diekspor untuk Node dan dipakai oleh bagian UI.
- **Pemeriksaan:** `node tests/test.js` dan pembacaan kode.
- **Temuan:** fungsi murni mudah diuji; UI tetap perlu uji manual.
- **Keputusan:** *diterima*.

## Entri 3 – Menganalisis kesalahan draf awal
- **Instruksi:** meninjau draf awal V0 dan mencari kesalahan.
- **Kesalahan ditemukan dan direproduksi** (`node tests/demo-initial-bugs.js`):
  1. `name == ''` menerima nama berisi spasi saja (V0 menerima `"   "`: `true`).
  2. `id = tasks.length + 1` menghasilkan id duplikat setelah penghapusan (`A#1, C#3, D#3`); menghapus D ikut menghapus C.
- **Perbaikan:** `validateTask` memakai `trim()`; id dibuat dengan `generateId()` (waktu + angka acak) dan operasi bersifat immutable.
- **Keputusan:** *diubah*; id bukan lagi bergantung pada jumlah item. Alternatif counter tersimpan ditolak karena menambah state yang harus disinkronkan.

## Entri 4 – Keamanan tampilan (XSS)
- **Instruksi:** meninjau cara menampilkan data pengguna di DOM.
- **Temuan (analisis kode, belum direproduksi di browser):** menyusun daftar dengan `innerHTML` dan teks pengguna berpotensi menjalankan HTML/skrip yang disisipkan.
- **Perbaikan:** UI memakai `createElement` dan `textContent`, tanpa `innerHTML`.
- **Keputusan:** *diterima* dan diterapkan; perlu verifikasi manual (isi nama tugas dengan `<b>uji</b>`: harus tampil sebagai teks apa adanya).

## Entri 5 – Penyimpanan dan data rusak
- **Instruksi:** memperbaiki penanganan `localStorage`.
- **Perbaikan:** `loadTasks` memakai `try/catch`, memeriksa bentuk setiap entri, dan mengabaikan data rusak; `saveTasks` mengembalikan `false` saat gagal; UI menampilkan pesan.
- **Pemeriksaan:** TC-07, TC-09, TC-10 lulus (otomatis). Perilaku di browser (MT-09) belum diverifikasi.
- **Keputusan:** *diterima*.

## Entri 6 – Tinjauan kualitas kode
- **Instruksi:** meninjau konsistensi nama, validasi tanggal, dan keterbacaan.
- **Temuan:** tanggal seperti `2026-02-30` lolos pola `YYYY-MM-DD` biasa.
- **Perbaikan:** `isValidDateString` memeriksa ulang tanggal lewat objek `Date` (TC-08).
- **Keputusan:** *diterima*. Saran memakai library tanggal *ditolak* karena menambah dependensi yang tidak diperlukan.

## Entri 7 – Milik Anda (isi sendiri)
Tambahkan minimal satu percakapan asli: prompt, ringkasan keluaran, pemeriksaan, kesalahan, perbaikan, alasan keputusan, dan nama file screenshot.
