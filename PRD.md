# Product Requirements Document (PRD)
## Westtamp Tubing — Platform Digitalisasi Wisata River Tubing Desa Tampirkulon

---

| | |
|---|---|
| **Versi Dokumen** | 1.1 |
| **Status** | Draft |
| **Tanggal** | Juni 2026 |
| **Audiens** | Tim Developer Internal |

---

## Daftar Isi

1. [Latar Belakang](#1-latar-belakang)
2. [Tujuan Produk](#2-tujuan-produk)
3. [Ruang Lingkup (Scope)](#3-ruang-lingkup-scope)
4. [User Persona](#4-user-persona)
5. [User Flow](#5-user-flow)
6. [Fitur & Persyaratan Fungsional](#6-fitur--persyaratan-fungsional)
7. [Persyaratan Non-Fungsional](#7-persyaratan-non-fungsional)
8. [Batasan Sistem (Constraints)](#8-batasan-sistem-constraints)
9. [Integrasi Pihak Ketiga](#9-integrasi-pihak-ketiga)
10. [Future Features](#10-future-features)

---

## 1. Latar Belakang

Desa Wisata Tampirkulon merupakan destinasi wellness-tourism yang mengandalkan aktivitas *river tubing* di Sungai Elo sebagai daya tarik utamanya. Selain wisata air, desa ini juga mempromosikan produk UMKM lokal berupa olahan lele dan jahe telang sebagai bagian dari ekosistem wisata yang terintegrasi.

Sebelum sistem ini ada, proses pemesanan tiket dilakukan secara manual — baik melalui kunjungan langsung maupun komunikasi via pesan pribadi — yang berpotensi menimbulkan masalah seperti overbooking, pencatatan yang tidak akurat, dan minimnya data untuk pengambilan keputusan operasional.

**Westtamp Tubing** hadir sebagai solusi digital yang menyeluruh: memudahkan wisatawan dalam memesan tiket, membantu admin POKDARWIS dalam mengelola operasional harian, serta menyediakan mekanisme keamanan darurat yang terotomasi ketika kondisi sungai tidak aman.

---

## 2. Tujuan Produk

| # | Tujuan | Indikator Keberhasilan |
|---|---|---|
| 1 | Digitalisasi proses pemesanan tiket *river tubing* | Tidak ada lagi pemesanan manual; seluruh transaksi tercatat di sistem |
| 2 | Memaksimalkan pendapatan desa wisata melalui otomasi pembayaran | Seluruh pembayaran terproses via Midtrans; zero kehilangan data transaksi |
| 3 | Menjamin keamanan operasional melalui fitur darurat cuaca | Admin dapat membatalkan/reschedule semua booking aktif dalam < 2 menit |
| 4 | Meningkatkan visibilitas desa wisata & produk UMKM lokal | Konten blog dan galeri dapat diperbarui mandiri oleh admin |

---

## 3. Ruang Lingkup (Scope)

### 3.1 In-Scope (Versi Saat Ini)

- Sistem pemesanan tiket *river tubing* secara online
- Integrasi pembayaran via Midtrans (e-wallet, bank transfer, dll.)
- Manajemen sesi (Pagi / Siang) dengan batas kuota per sesi yang dapat dikonfigurasi admin
- Reschedule mandiri oleh pelanggan
- Verifikasi tiket via QR Code di lokasi
- Fitur Weather Emergency (pembatalan massal + notifikasi email otomatis)
- Portal konten publik: Blog, Galeri, informasi fasilitas, dan promosi UMKM
- Dashboard admin: monitoring pendapatan, statistik booking, manajemen konten
- Laporan keuangan dengan fitur ekspor (Excel/PDF)

### 3.2 Out-of-Scope (Versi Ini)

- Aplikasi mobile native (Android/iOS)
- Sistem loyalty/poin pelanggan
- Integrasi peta/navigasi ke lokasi wisata
- Sistem manajemen pemandu/guide lapangan
- Multi-bahasa (saat ini hanya Bahasa Indonesia)

---

## 4. User Persona

### Persona 1 — Wisatawan (Pengunjung)

| | |
|---|---|
| **Nama Representatif** | Reza, 27 tahun |
| **Profil** | Milenial/keluarga muda, tinggal di kota, melek teknologi |
| **Tujuan** | Memesan tiket tubing dengan mudah tanpa harus datang langsung ke lokasi |
| **Pain Point** | Takut kehabisan slot, tidak tahu cara reschedule jika ada perubahan rencana, tidak yakin tiket valid saat tiba di lokasi |
| **Kebutuhan Utama** | Booking online yang cepat, konfirmasi yang jelas, dan proses check-in di lokasi yang tidak ribet |

### Persona 2 — Admin POKDARWIS

| | |
|---|---|
| **Nama Representatif** | Pak Heru, 45 tahun |
| **Profil** | Pengelola operasional desa wisata, tidak harus sangat tech-savvy |
| **Tujuan** | Memantau dan mengelola seluruh operasional wisata dari satu dashboard |
| **Pain Point** | Kesulitan memantau jumlah pengunjung per sesi, membutuhkan waktu lama untuk memberi tahu pelanggan saat kondisi darurat |
| **Kebutuhan Utama** | Dashboard yang ringkas, proses verifikasi tiket yang cepat, dan tombol darurat yang mudah diakses |

---

## 5. User Flow

### 5.1 Flow Pemesanan Tiket (Wisatawan)

```
Landing Page
    → Halaman Paket (pilih paket tubing)
        → Halaman Booking (isi data, pilih tanggal & sesi)
            → Pengecekan ketersediaan kuota (real-time)
                → [Tersedia] → Checkout & Pembayaran via Midtrans
                    → Konfirmasi Pembayaran (Midtrans Webhook)
                        → Tiket diterbitkan (QR Code dikirim via Email)
                → [Penuh] → Notifikasi kuota penuh, pilih sesi lain
```

### 5.2 Flow Check-in di Lokasi (Admin)

```
Admin Login → Dashboard Admin
    → Fitur Scan QR Code
        → Scan tiket pengunjung
            → [Valid & Belum Digunakan] → Tiket divalidasi, pengunjung masuk
            → [Tidak Valid / Sudah Digunakan] → Tampil pesan error
```

### 5.3 Flow Reschedule Mandiri (Wisatawan)

```
Halaman Cek Booking (masukkan kode booking / email)
    → Detail Booking ditampilkan
        → Pilih opsi Reschedule
            → Pilih tanggal & sesi baru
                → Pengecekan ketersediaan kuota
                    → [Tersedia] → Konfirmasi reschedule, tiket baru diterbitkan
                    → [Penuh] → Pilih opsi lain
```

### 5.4 Flow Weather Emergency (Admin)

```
Admin Dashboard
    → Tombol "Weather Emergency" ditekan
        → Konfirmasi tindakan (modal konfirmasi)
            → Semua booking aktif pada sesi terdampak diubah statusnya menjadi "Open Ticket" (Pending Reschedule)
                → Notifikasi email broadcast berisi link reschedule gratis (tanpa batas H-1) dikirim ke seluruh pelanggan terdampak
                    → Status darurat tercatat di log sistem
```

---

## 6. Fitur & Persyaratan Fungsional

### 6.1 Fitur Publik (Pengunjung)

#### F-01: Landing Page & Informasi Wisata

- Menampilkan informasi umum tentang Desa Wisata Tampirkulon
- Menampilkan informasi fasilitas unggulan termasuk layanan *free health checkup*
- Menyebutkan produk UMKM lokal (olahan lele & jahe telang) sebagai bagian dari ekosistem wisata
- Navigasi jelas menuju halaman paket dan pemesanan

#### F-02: Katalog Paket Tubing

- Menampilkan daftar paket *river tubing* yang tersedia
- Setiap paket menampilkan: nama, harga, deskripsi, gambar, dan label "populer" (jika ada)
- Tombol CTA (Call to Action) langsung menuju halaman booking

#### F-03: Sistem Pemesanan Tiket (Booking)

- Formulir pemesanan dengan input: nama pemesan, email, nomor HP, tanggal kunjungan, sesi (Pagi/Siang), dan jumlah peserta
- Pengecekan ketersediaan kuota secara *real-time* sebelum proses pembayaran
- Jika kuota penuh, sistem menampilkan notifikasi dan menyarankan sesi/tanggal lain
- Integrasi dengan Midtrans untuk proses pembayaran (mendukung berbagai metode: e-wallet, bank transfer, kartu kredit, dll.)
- Tiket digital (berisi QR Code unik) dikirimkan ke email pelanggan setelah pembayaran berhasil dikonfirmasi

#### F-04: Pengecekan & Reschedule Mandiri

- Halaman cek booking: pelanggan dapat melihat status booking menggunakan kode booking atau email
- Fitur reschedule: pelanggan dapat mengubah tanggal/sesi selama kuota masih tersedia
- Batas waktu reschedule: dapat dilakukan maksimal H-1 sebelum tanggal kunjungan

#### F-05: Portal Konten Publik

- **Blog/Artikel**: Menampilkan daftar artikel dan halaman detail artikel
- **Galeri**: Menampilkan koleksi foto kegiatan wisata
- Konten dapat difilter atau dinavigasi dengan mudah

---

### 6.2 Fitur Admin (POKDARWIS)

#### F-06: Autentikasi Admin

- Halaman login khusus admin dengan email dan password
- Session management menggunakan Laravel Sanctum
- Proteksi seluruh rute admin dari akses tidak terotorisasi

#### F-07: Dashboard & Monitoring

- Menampilkan ringkasan statistik harian: total pendapatan, jumlah booking, jumlah pengunjung per sesi
- Grafik/tabel booking terkini
- Indikator kapasitas sesi (kuota terpakai vs. tersisa) untuk hari ini dan hari mendatang

#### F-08: Verifikasi QR Code

- Admin dapat menggunakan kamera perangkat untuk memindai QR Code tiket pengunjung
- Sistem memvalidasi tiket: memeriksa keaslian, status pembayaran, dan apakah tiket sudah pernah digunakan
- Hasil validasi ditampilkan secara instan (valid / tidak valid / sudah digunakan)
- Tiket yang berhasil divalidasi ditandai sebagai "sudah digunakan" untuk mencegah duplikasi

#### F-09: Fitur Weather Emergency

- Tombol darurat yang hanya dapat diakses oleh admin terautentikasi
- Admin memilih sesi/tanggal yang terdampak kondisi darurat
- Setelah konfirmasi, sistem secara otomatis:
  - Mengubah status seluruh booking aktif pada sesi terdampak menjadi "Open Ticket" (Pending Reschedule) untuk membebaskan kuota ban pada tanggal/sesi tersebut.
  - Mengirimkan notifikasi email broadcast kepada seluruh pelanggan yang terdampak, berisi informasi keadaan darurat dan menyertakan tautan khusus untuk melakukan reschedule mandiri secara gratis tanpa batasan H-1.
- Seluruh tindakan darurat tercatat dalam log sistem (audit trail)

#### F-10: Manajemen Paket (CRUD)

- Admin dapat membuat, melihat, memperbarui, dan menghapus data paket tubing
- Field yang dapat dikelola: nama paket, harga, deskripsi, gambar, dan status populer

#### F-11: Manajemen Blog (CRUD)

- Admin dapat membuat, melihat, memperbarui, dan menghapus artikel blog
- Field: judul, konten (rich text), gambar thumbnail, tanggal publikasi

#### F-12: Manajemen Galeri (CRUD)

- Admin dapat mengunggah, melihat, dan menghapus foto galeri
- Setiap foto memiliki keterangan (caption)

#### F-13: Laporan Keuangan

- Admin dapat melihat laporan pendapatan dalam rentang waktu yang dapat ditentukan (harian, mingguan, bulanan, atau kustom)
- Laporan menampilkan informasi berikut:
  - Total pendapatan dalam periode yang dipilih
  - Jumlah transaksi berhasil, pending, dan gagal/dibatalkan
  - Rincian pendapatan per paket tubing
  - Rincian pendapatan per sesi (Pagi/Siang)
- Admin dapat mengekspor laporan ke format **Excel (.xlsx)** atau **PDF**
- Data laporan bersumber dari transaksi yang telah dikonfirmasi oleh Midtrans (status: `settlement`)

---

## 7. Persyaratan Non-Fungsional

### 7.1 Kinerja (Performance)

- Halaman publik (landing page, katalog paket) harus dapat dimuat dalam < 3 detik pada koneksi 4G standar
- Pengecekan ketersediaan kuota saat booking harus merespons dalam < 1 detik
- API publik dilindungi dengan *rate limiting* untuk mencegah penyalahgunaan (`throttle:public-api`)
- Endpoint checkout memiliki *rate limiting* tersendiri (`throttle:checkout`) untuk mencegah spam transaksi

### 7.2 Keamanan (Security)

- Seluruh rute API admin diproteksi dengan token autentikasi Laravel Sanctum
- Webhook dari Midtrans divalidasi menggunakan *signature key* untuk memastikan keaslian notifikasi
- Data pelanggan (email, nomor HP) tidak diekspos di respons API publik
- Password admin di-hash menggunakan algoritma yang aman (bcrypt)

### 7.3 Ketersediaan (Availability)

- Sistem di-deploy menggunakan Docker & Docker Compose dengan konfigurasi *auto-restart* untuk memastikan uptime yang konsisten
- Nginx berfungsi sebagai *reverse proxy* untuk mengelola traffic dan meningkatkan stabilitas
- Lingkungan produksi dan development identik berkat Docker, meminimalkan risiko *environment mismatch*

### 7.4 Kemudahan Penggunaan (Usability)

- Antarmuka publik harus responsif dan dapat diakses dengan baik di perangkat mobile
- Proses booking dari halaman paket hingga konfirmasi pembayaran diselesaikan dalam < 5 langkah
- Pesan error harus informatif dan memandu pengguna untuk mengambil tindakan yang tepat

---

## 8. Batasan Sistem (Constraints)

| # | Batasan | Keterangan |
|---|---|---|
| C-01 | **Kuota ban per sesi dapat dikonfigurasi oleh admin** | Nilai default adalah **100 ban per sesi**, berlaku untuk sesi Pagi dan Siang secara terpisah. Admin dapat mengubah batas kuota ini melalui pengaturan sesi di dashboard. Sistem mengunci kuota tiket/ban selama 15 menit setelah checkout untuk memberi kesempatan pembayaran via Midtrans. Jika tidak terbayar dalam 15 menit, kuota dilepaskan secara otomatis. |
| C-02 | Dua sesi per hari | Hanya tersedia dua sesi: **Pagi** dan **Siang**. Tidak ada sesi tambahan. |
| C-03 | Reschedule maksimal H-2 | Pelanggan tidak dapat melakukan reschedule mandiri pada hari H kunjungan. |
| C-04 | Refund bergantung kebijakan bisnis | Proses refund atas pembatalan akibat Weather Emergency ditentukan oleh kebijakan POKDARWIS dan dieksekusi secara manual melalui dashboard Midtrans. Sistem hanya mencatat pembatalan; tidak memproses refund otomatis. |
| C-05 | Satu akun admin | Pada versi ini, sistem hanya mendukung satu level akses admin (superadmin). Tidak ada role granular per divisi. |

---

## 9. Integrasi Pihak Ketiga

### 9.1 Midtrans (Payment Gateway)

- **Tujuan**: Memproses seluruh transaksi pembayaran tiket
- **Metode yang Didukung**: E-wallet (GoPay, OVO, dll.), bank transfer, kartu kredit/debit, QRIS
- **Mekanisme**: Frontend menginisiasi pembayaran → Backend memanggil Midtrans API untuk membuat transaksi → Midtrans mengirimkan notifikasi status via Webhook → Backend memperbarui status booking
- **Validasi Webhook**: Setiap notifikasi dari Midtrans divalidasi menggunakan *signature key* sebelum diproses

### 9.2 Email (Notifikasi Sistem)

- **Tujuan**: Mengirimkan konfirmasi booking beserta tiket QR Code, dan notifikasi darurat cuaca (Weather Emergency) kepada pelanggan terdampak
- **Trigger Email**:
  - Pembayaran berhasil → Email tiket + QR Code dikirim ke pelanggan
  - Reschedule berhasil → Email konfirmasi jadwal baru dikirim ke pelanggan
  - Weather Emergency diaktifkan → Email broadcast pembatalan/reschedule dikirim ke semua pelanggan terdampak
- **Catatan**: Integrasi WhatsApp API tidak digunakan pada versi ini; seluruh notifikasi disampaikan melalui email.

---

## 10. Future Features

Fitur-fitur berikut **tidak termasuk** dalam scope versi saat ini, namun diidentifikasi sebagai pengembangan potensial di masa mendatang.

| # | Fitur | Deskripsi Singkat |
|---|---|---|
| FF-01 | **Notifikasi Email Transaksional Lanjutan** | Template email yang lebih kaya (HTML), pengiriman terjadwal, dan manajemen daftar penerima |
| FF-02 | **Manajemen Role Admin** | Penambahan role seperti *operator lapangan* (hanya akses scan QR) dan *pengelola konten* (hanya akses blog/galeri) |
| FF-03 | **Aplikasi Mobile** | Aplikasi native Android/iOS untuk wisatawan dan/atau operator lapangan |
| FF-04 | **Sistem Review & Rating** | Wisatawan dapat memberikan ulasan dan penilaian setelah kunjungan |
| FF-05 | **Halaman Produk UMKM** | Halaman khusus untuk menampilkan dan mempromosikan produk UMKM lokal (olahan lele & jahe telang) secara lebih detail |
| FF-06 | **Integrasi WhatsApp Resmi** | Migrasi dari solusi email ke WhatsApp Business API resmi untuk notifikasi yang lebih personal dan tingkat baca yang lebih tinggi |

---
