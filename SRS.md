# Software Requirements Specification (SRS)
## Westtamp Tubing — Platform Digitalisasi Wisata River Tubing Desa Tampirkulon

---

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Status** | Approved |
| **Tanggal** | Juni 2026 |
| **Penyusun** | System Analyst |
| **Dokumen Acuan** | PRD v1.1 |

---

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen Software Requirements Specification (SRS) ini merinci spesifikasi teknis dan fungsional sistem **Westtamp Tubing**. Dokumen ini dirancang sebagai acuan teknis bagi tim pengembang (backend & frontend), arsitek sistem, serta tim penjamin mutu (QA) untuk mengimplementasikan dan menguji sistem.

### 1.2 Ruang Lingkup Sistem
Sistem mencakup:
* Portal landing page informasi Desa Wisata Tampirkulon, Halaman Hubungi Kami, Kebijakan Privasi, Syarat & Ketentuan, serta promosi produk UMKM lokal.
* Katalog paket wisata *river tubing*.
* Mesin transaksi tiket online dengan penguncian kuota sementara dan integrasi Payment Gateway Midtrans.
* Alur penjadwalan ulang mandiri oleh pelanggan (reschedule).
* Dasbor administrasi POKDARWIS untuk memantau kapasitas sesi secara real-time, laporan keuangan terperinci (ekspor Excel/PDF), dan panel kendali darurat cuaca (Weather Emergency) yang memproses pembatalan/penundaan massal secara asinkron.

### 1.3 Definisi dan Singkatan
* **POKDARWIS**: Kelompok Sadar Wisata Desa Tampirkulon.
* **SRS**: *Software Requirements Specification*.
* **PRD**: *Product Requirements Document*.
* **Open Ticket**: Status tiket wisatawan yang ditangguhkan jadwalnya (belum ditentukan tanggal/sesinya) akibat kondisi darurat cuaca, sehingga wisatawan dapat menentukan tanggal pengganti secara mandiri tanpa batasan H-1.
* **Midtrans Snap**: Integrasi pembayaran di frontend dalam bentuk modal *pop-up* tanpa meninggalkan halaman aplikasi.
* **Laravel Sanctum**: Sistem autentikasi token ringan untuk API SPA.

---

## 2. Arsitektur Sistem & Lingkungan Operasional

### 2.1 Arsitektur Aplikasi
Sistem menggunakan pola arsitektur **Decoupled SPA-API**:
* **Backend (API)**: Dibangun menggunakan PHP 8.2 dengan Laravel 11. Menggunakan Eloquent ORM untuk pemodelan data dan Laravel Sanctum untuk manajemen sesi API Admin.
* **Frontend (SPA)**: Dibangun menggunakan React 18 dengan Vite sebagai bundler dan Tailwind CSS/Vanilla CSS untuk antarmuka.
* **Reverse Proxy**: Nginx sebagai penyeimbang beban (*load balancer*), penanganan SSL/TLS, dan *reverse proxy* rute frontend dan backend.

### 2.2 Lingkungan Deployment (Docker Compose)
Aplikasi dikemas ke dalam 4 container utama yang berjalan di jaringan virtual internal:

```mermaid
graph TD
    Client[Browser Pengunjung / Admin] -->|HTTP/HTTPS Ports 80/443| Nginx[Container Nginx: westtamp_nginx]
    Nginx -->|Proxy /| Frontend[Container React: westtamp_frontend - Port 5173]
    Nginx -->|Proxy /api| Backend[Container Laravel: westtamp_backend - Port 8000]
    Backend -->|Internal Conn - Port 3306| Database[(Container MySQL: westtamp_mysql)]
    Database -.->|Port 127.0.0.1:3306| HostHost[Host Localhost / MCP Server Host]
```

1. **`westtamp_mysql`**: MySQL 8.0. Port 3306 dipetakan secara terbatas ke `127.0.0.1:3306` pada host untuk keperluan perkakas internal (seperti MCP Server).
2. **`westtamp_backend`**: PHP 8.2-FPM. Menjalankan Laravel server di port 8000, composer dependencies, dan PHP CLI queue listener.
3. **`westtamp_frontend`**: Node 20-alpine. Menjalankan dev server React/Vite di port 5173.
4. **`westtamp_nginx`**: Nginx Alpine. Mengikat port fisik 80 dan 443 pada host.

---

## 3. Spesifikasi Data (Desain Database)

### 3.1 Skema Tabel Hubungan Entitas (ERD)

```mermaid
erDiagram
    bookings ||--|| payments : "memiliki"
    bookings ||--o| tubing_sessions : "dijadwalkan pada"
    bookings }o--|| packages : "memilih"
    
    bookings {
        bigint id PK
        varchar booking_ref UK "Kode Referensi (8 Karakter)"
        varchar customer_name
        varchar customer_email
        varchar customer_phone
        bigint package_id FK
        bigint tubing_session_id FK
        decimal total_price
        int qty "Jumlah ban"
        enum status "'pending', 'settlement', 'expired', 'cancelled', 'pending_reschedule'"
        varchar qr_code_path
        timestamp created_at
        timestamp updated_at
    }

    tubing_sessions {
        bigint id PK
        date session_date
        enum session_type "'pagi', 'siang'"
        int capacity "Kuota ban tersisa (default 100)"
        timestamp created_at
        timestamp updated_at
    }

    payments {
        bigint id PK
        bigint booking_id FK
        varchar transaction_id UK "ID Transaksi Midtrans"
        varchar payment_type
        decimal gross_amount
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    packages {
        bigint id PK
        varchar name
        decimal price
        text description
        varchar image_path
        boolean is_popular
        timestamp created_at
        timestamp updated_at
    }
```

### 3.2 Kebutuhan Indeks Database (Performance Tuning)
Guna menjamin skalabilitas query, indeks harus dipasang pada kolom-kolom berikut:
* **Tabel `bookings`**:
  * Indeks Unik: `booking_ref`
  * Indeks Komposit: `(tubing_session_id, status)` (Untuk perhitungan kuota real-time cepat)
  * Indeks Tunggal: `customer_email`, `status`, `created_at` (Untuk pencarian pemesanan dan filter laporan keuangan)
* **Tabel `tubing_sessions`**:
  * Indeks Komposit: `(session_date, session_type)` (Untuk pencarian ketersediaan sesi saat memilih tanggal kunjungan)

---

## 4. Spesifikasi API (Endpoint & Alur Kerja Logika)

### 4.1 Modul Pemesanan & Pembayaran (Wisatawan)
* **API Checkout**: `POST /api/bookings`
  * **Payload**: `customer_name`, `customer_email`, `customer_phone`, `package_id`, `session_date`, `session_type`, `qty`.
  * **Alur Logika**:
    1. Jalankan `DB::transaction`.
    2. Kunci baris kuota sesi terpilih menggunakan query `SELECT ... FOR UPDATE` (Pencegahan *Race Condition*).
    3. Jika kuota tersisa < `qty`, gagalkan transaksi dengan respons kode HTTP 422 (Kuota Penuh).
    4. Kurangi kuota sesi sebanyak `qty`.
    5. Buat entri pemesanan di tabel `bookings` dengan status `pending` dan buat kode `booking_ref` acak sepanjang 8 karakter alfanumerik.
    6. Panggil Snap API Midtrans untuk membuat *token pembayaran*.
    7. Commit transaksi.
    8. Jadwalkan pembatalan otomatis setelah **15 menit** jika pembayaran tidak selesai (menggunakan cron Laravel Scheduler yang mengeksekusi Artisan Command `app:release-pending-bookings` setiap menit).
  * **Respons**: Kode HTTP 201 dengan `snap_token` dan detail pemesanan.

* **Webhook Midtrans**: `POST /api/payments/webhook`
  * **Alur Logika**:
    1. Hitung ulang signature SHA512 menggunakan `order_id`, `status_code`, `gross_amount`, dan Server Key Midtrans untuk validasi keaslian payload.
    2. Cari data booking berdasarkan `booking_ref` (dipetakan ke `order_id` Midtrans).
    3. Jika status notifikasi adalah `settlement`:
       * Ubah status booking ke `settlement`.
       * Hasilkan QR Code check-in yang merujuk pada endpoint `/api/admin/bookings/verify/{booking_ref}`.
       * Masukkan proses pengiriman email notifikasi e-ticket ke dalam antrean (Laravel Queue) untuk dikirimkan secara asinkron ke `customer_email`.
    4. Jika status notifikasi adalah `expire`, `cancel`, atau `deny`:
       * Kembalikan kapasitas ban (`qty`) dari pemesanan tersebut ke kapasitas sesi (`tubing_sessions`).
       * Ubah status booking ke `expired` atau `cancelled`.
  * **Respons**: HTTP 200 OK.

### 4.2 Modul Penjadwalan Ulang (Reschedule)
* **Verifikasi Kelayakan**: `GET /api/bookings/verify-reschedule`
  * **Query Parameter**: `booking_ref`
  * **Logika Validasi Kelayakan**:
    1. Dapatkan record `booking` berdasarkan `booking_ref`. Jika tidak ditemukan, gagalkan dengan HTTP 404.
    2. Cek status pembayaran tiket. Status wajib bernilai `settlement` ATAU `pending_reschedule` (Open Ticket).
    3. Jika status tiket adalah `settlement` (Reschedule Reguler):
       * Bandingkan tanggal sesi asli (`session_date`) dengan tanggal hari ini.
       * Sesi asli minimal harus berada di hari esok (H-1 sebelum tanggal kunjungan). Jika tanggal sesi asli adalah hari ini (H-0) atau sudah lewat, gagalkan dengan respons error HTTP 400 (Batas waktu reschedule terlampaui).
    4. Jika status tiket adalah `pending_reschedule` (Reschedule Darurat Cuaca / Open Ticket):
       * Bypass (abaikan) seluruh pemeriksaan batas waktu H-1. Wisatawan diizinkan melakukan reschedule kapan saja terhitung sejak status diubah menjadi `pending_reschedule` hingga batas maksimal 30 hari.
    5. Periksa ketersediaan kuota sesi baru yang dipilih.
  * **Respons**: HTTP 200 OK dengan status kelayakan `true`/`false` beserta sisa kuota sesi yang dapat dipilih.

* **Proses Reschedule**: `POST /api/bookings/reschedule`
  * **Payload**: `booking_ref`, `new_session_date`, `new_session_type`.
  * **Alur Logika**:
    1. Jalankan `DB::transaction`.
    2. Jalankan logika validasi kelayakan seperti pada endpoint verifikasi kelayakan (cek status dan batas waktu H-1 atau bypass jika statusnya `pending_reschedule`).
    3. Tarik dan kunci baris kuota sesi baru (`SELECT ... FOR UPDATE`).
    4. Jika kapasitas kuota baru kurang dari jumlah ban pemesan (`qty`), kembalikan error HTTP 422 (Kuota sesi penuh).
    5. Kurangi kapasitas sesi baru sebesar `qty` pemesanan.
    6. Tambahkan kapasitas sesi lama sebesar `qty` pemesanan.
    7. Perbarui rujukan `tubing_session_id` pada entri booking ke sesi baru.
    8. Jika status booking sebelumnya adalah `pending_reschedule`, ubah status kembali menjadi `settlement`.
    9. Kirim email konfirmasi perubahan jadwal sukses ke email wisatawan (`customer_email`) secara asinkron.
    10. Commit transaksi.
  * **Respons**: HTTP 200 OK.

### 4.3 Modul Darurat Cuaca (Weather Emergency)
* **Pemicuan Status Darurat**: `POST /api/admin/weather-emergency`
  * **Payload**: `target_date`, `session_type`.
  * **Alur Logika (Asinkron via Queue)**:
    1. Ambil seluruh data pemesanan (`bookings`) dengan status `settlement` pada sesi dan tanggal terdampak.
    2. Untuk setiap pemesanan:
       * Ubah statusnya menjadi `pending_reschedule` (Open Ticket).
       * Kembalikan kuota ban pemesanan ke sesi tersebut (untuk pencatatan audit, meskipun sesi ini dibatalkan).
       * Kirim email broadcast penangguhan jadwal berisi tautan reschedule instan gratis tanpa batasan H-1.
    3. Catat log Weather Emergency di audit trail.
  * **Respons**: HTTP 202 Accepted (Tindakan diterima dan sedang diproses di latar belakang).

### 4.4 Modul Laporan Keuangan & Ekspor
* **Ekspor Laporan Keuangan**: `GET /api/admin/reports/export`
  * **Query Parameter**:
    * `start_date` (Required, DATE format `YYYY-MM-DD`): Batas awal rentang laporan pendapatan.
    * `end_date` (Required, DATE format `YYYY-MM-DD`): Batas akhir rentang laporan pendapatan.
    * `format` (Required, ENUM `pdf` atau `xlsx`): Format file keluaran ekspor.
  * **Alur Logika**:
    1. Validasi parameter input. Pastikan format tanggal valid dan `start_date` tidak lebih besar dari `end_date`.
    2. Tarik seluruh transaksi pemesanan (`bookings`) yang memiliki status `settlement` (sukses) di mana waktu transaksi (`created_at`) berada dalam rentang `start_date` dan `end_date`.
    3. Hitung ringkasan akumulatif laporan:
       * Total pendapatan kotor dalam periode.
       * Jumlah transaksi sukses, pending, dan gagal/dibatalkan.
       * Pendapatan per paket tubing.
       * Pendapatan dan jumlah pengunjung per sesi (Pagi vs Siang).
    4. Jika `format` bernilai `xlsx`:
       * Buat spreadsheet data menggunakan pustaka pengolah spreadsheet (seperti `maatwebsite/excel` atau ekspor file CSV standar yang kompatibel dengan Excel).
       * Kembalikan file stream sebagai unduhan langsung dengan header `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
    5. Jika `format` bernilai `pdf`:
       * Render template HTML laporan keuangan ke bentuk PDF menggunakan engine render PDF (seperti `barryvdh/laravel-dompdf`).
       * Kembalikan file stream dengan header `Content-Type: application/pdf`.
  * **Respons**: HTTP 200 OK dengan file stream download.

### 4.5 Modul Halaman Informasi Publik
* **Formulir Hubungi Kami**: `POST /api/contact` (Opsional V1.0, disimulasikan di frontend atau direkam ke log backend)
  * **Payload**: `name` (Required), `email` (Required, email), `phone` (Optional), `subject` (Required), `message` (Required).
  * **Alur Logika**:
    1. Validasi input payload sesuai dengan tipe data yang ditentukan.
    2. Kirim email pemberitahuan ke `info@westtamp.desa.id` dan simpan pesan di database untuk audit. (Pada V1.0, disimulasikan dengan pencatatan log backend atau respons sukses statis).
  * **Respons**: HTTP 200 OK dengan pesan sukses.

* **Halaman Kebijakan Privasi (`/privacy-policy`)**:
  * Halaman informasi statis terstruktur mengenai pengumpulan data pribadi pengunjung (Nama, Email, HP), penggunaan data untuk e-ticket dan pemberitahuan darurat cuaca, serta pemrosesan pembayaran terenkripsi pihak ketiga (Midtrans).

* **Halaman Syarat & Ketentuan (`/terms-conditions`)**:
  * Halaman informasi ketentuan pemesanan tiket, kebijakan batas kuota ban (100 per sesi), batasan reschedule reguler (H-1 sebelum kunjungan), serta hak reschedule gratis tanpa batas H-1 (masa aktif 30 hari) ketika status *Open Ticket* (Weather Emergency) diaktifkan.

---

## 5. Persyaratan Antarmuka Eksternal (Integration Specification)

### 5.1 Integrasi Payment Gateway (Midtrans)
* **Frontend**: Mengimpor berkas Javascript Snap SDK resmi dari CDN Midtrans di halaman checkout.
  * Sandbox: `https://app.sandbox.midtrans.com/snap/snap.js`
  * Produksi: `https://app.midtrans.com/snap/snap.js`
* **Metode Pemanggilan**: Menggunakan objek `window.snap.pay(token, { onSuccess, onPending, onError, onClose })`.

### 5.2 Sistem Notifikasi Email (SMTP)
* **Kebutuhan Teknis**: Pengiriman email transaksional transparan dari server menggunakan protokol SMTP.
* **Driver & Paket**: Menggunakan *Laravel Mailables* dengan dukungan template Markdown.
* **Konfigurasi Lingkungan (Env)**:
  * Pengembangan: Driver diatur ke `log` (tercatat di `laravel.log`) atau Mailpit (port 1025).
  * Produksi: Menggunakan gateway email transaksional eksternal (Mailgun / SMTP relay AWS SES / Brevo) dengan antrean `queue` diaktifkan di konfigurasi Laravel `queue.php` (`QUEUE_CONNECTION=database`).

---

## 6. Persyaratan Non-Fungsional (Non-Functional Requirements)

### 6.1 Keamanan & Penanganan Ancaman
* **Rate Limiting**:
  * Jalankan batasan kecepatan request pada endpoint checkout (`/api/bookings`) maksimal 5 request per menit per IP address untuk mencegah spam bot transaksi pending yang mengunci kuota ban.
  * Endpoint publik lainnya dibatasi maksimal 60 request per menit.
* **Autentikasi API Admin**:
  * Menggunakan token berbasis bearer melalui Laravel Sanctum yang disimpan dengan aman di memori aplikasi frontend (bukan di LocalStorage yang rentan XSS).
* **Proteksi SQL Injection & XSS**:
  * Seluruh input database harus melalui binding parameter SQL otomatis via Eloquent Query Builder Laravel.
  * Gunakan escaping HTML di frontend saat merender konten dinamis untuk mencegah eksekusi skrip berbahaya.

### 6.2 Konkurensi & Integritas Kuota
* **Mekanisme Lock**: Sistem wajib menggunakan *Pessimistic Locking* (`SELECT ... FOR UPDATE`) pada query pemeriksaan kuota di database MySQL. Mekanisme optimistik (seperti versioning) dihindari karena tingkat kompetisi transaksi kuota ban tinggi di jam-jam sibuk liburan.

### 6.3 Kinerja & Waktu Respons
* **Waktu Pemuatan Halaman**: Halaman statis landing page publik harus terkompilasi optimal (Vite code splitting) dengan target waktu muat penuh kurang dari 3 detik di jaringan seluler 4G.
* **API Latency**: Endpoint verifikasi kuota harus merespons dalam waktu kurang dari 800ms.
