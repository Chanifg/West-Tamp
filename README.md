# Westtamp Wellness: Petualangan Seru & Karya Lokal 🌿🚣

Digitalisasi Desa Wisata Tampirkulon (Wellness-Tourism) untuk pengelolaan pemesanan tiket river tubing, promosi produk UMKM lokal, dan manajemen operasional berbasis kesehatan.

## 🚀 Fitur Utama
- **Landing Page Interaktif**: Informasi paket wisata, fasilitas kesehatan (free checkup), dan UMKM lokal (olahan lele & jahe telang).
- **Sistem Pemesanan Tiket Otomatis**: Integrasi jadwal (pagi/siang) dengan kuota ban real-time (maksimal 100 ban per sesi).
- **Pembayaran Digital**: Integrasi mandiri dengan Midtrans Payment Gateway (gopay, shopeepay, bank transfer, dll).
- **Dashboard Admin POKDARWIS**: 
  - Monitoring pendapatan dan status tiket.
  - Scanner QR Code untuk verifikasi kedatangan pengunjung.
  - **Tombol Darurat Cuaca**: Notifikasi massal via WhatsApp untuk pembatalan dan reschedule otomatis jika debit air Elo membahayakan.

## 🛠️ Tech Stack
- **Frontend**: React.js 19 + Tailwind CSS v4 + React Router 7
- **Backend**: Laravel 11 (PHP 8.4)
- **Database**: MySQL 8.0
- **Container**: Docker & Docker Compose
- **Integrasi**: Midtrans (Payment) & Mock WhatsApp API Trigger

## 📦 Instalasi & Pengoperasian

### Prasyarat
- Docker & Docker Compose sudah terpasang di sistem.

### Langkah-langkah
1. **Clone Repository**
   ```bash
   git clone git@github.com:Chanifg/West-Tamp.git
   cd West-Tamp
   ```

2. **Jalankan Project dengan Docker**
   ```bash
   docker compose up -d
   ```

3. **Inisialisasi Database**
   ```bash
   docker exec westtamp_backend php artisan migrate --seed
   ```

4. **Akses Aplikasi**
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

5. **Kredensial Admin Default**
   - **Email**: `admin@westtamp.com`
   - **Password**: `password`

## 📁 Struktur Direktori
- `backend/`: Source code Laravel API.
- `frontend/`: Source code React SPA.
- `UI/`: Aset desain asli (mockup).
- `docker-compose.yml`: Konfigurasi orchestrasi container.

## ⚖️ Lisensi
Proyek ini dibuat untuk pengembangan Desa Wisata Tampirkulon. Hak cipta milik POKDARWIS Desa Tampirkulon.
