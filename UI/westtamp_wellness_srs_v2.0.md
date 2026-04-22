SOFTWARE REQUIREMENTS SPECIFICATION (SRS) V2.0

Proyek: Westtamp Wellness: Petualangan Seru & Karya Lokal Target: Digitalisasi Desa Wisata Tampirkulon (Wellness-Tourism)

1. Pendahuluan
1.1 Tujuan
Membangun platform digital terintegrasi untuk pemesanan tiket river tubing, promosi produk UMKM lokal, dan manajemen operasional wisata berbasis kesehatan (wellness-tourism) di Desa Tampirkulon.

1.2 Ruang Lingkup
Sistem ini mencakup landing page interaktif, modul pemesanan tiket otomatis, integrasi pembayaran digital, manajemen kuota per sesi, dan sistem peringatan darurat cuaca.

2. Deskripsi Umum (Environment & Tech Stack)
Frontend: React.js dengan Tailwind CSS
Backend: Laravel
Database: MySQL
Integrasi: Midtrans (Payment Gateway) dan API WhatsApp
Deployment: Docker & Docker Compose pada Ubuntu 24.04.

3. Kebutuhan Fungsional (Functional Requirements)
3.1 Modul Pemesanan (Frontend)
- Pilihan Paket: Paket Fun (Rp150.000) & Paket Adventure (Rp275.000).
- Pilihan Jadwal: Tanggal kunjungan dan sesi (Pagi/Siang).
- Cek Slot Otomatis: Maksimal 100 ban per sesi.
- Checkout & Bayar: Integrasi Midtrans.
- Tiket Digital: QR Code via WhatsApp.

3.2 Modul Layanan Kesehatan & Eduwisata
- Health Screening: Info cek kesehatan gratis.
- Menu Konsumsi Sehat: Info bakso ikan lele dan jahe telang.

3.3 Modul Admin (Dashboard POKDARWIS)
- Verifikasi QR Code: Scanner berbasis browser.
- Tombol Darurat Cuaca: One-click cancellation & auto-reschedule link via WhatsApp.
- Laporan Pendapatan: Visualisasi data.

4. Kebutuhan Antarmuka Pengguna (UI Requirements)
- Hero Section: Judul, slogan, statistik (1000+ visitors, 4.9 rating).
- Section Fasilitas: Keamanan Tubing, Fasilitas Kesehatan, Konsumsi Sehat, Kenyamanan Publik.
- Testimoni & Dokumentasi.

5. Kebutuhan Non-Fungsional
- Jam Operasional: 08.00 - 17.00.
- Keamanan: Enkripsi & validasi Midtrans.
- Kecepatan: Scanner ringan.