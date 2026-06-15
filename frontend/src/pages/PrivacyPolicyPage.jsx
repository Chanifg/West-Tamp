import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Kebijakan Privasi | Westtamp Wellness";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full py-16 px-6 max-w-[800px] mx-auto mt-6">
        <h1 className="font-headline-lg text-4xl font-extrabold text-primary mb-3">
          Kebijakan Privasi
        </h1>
        <p className="text-sm text-on-surface-variant mb-8 font-body-sm">
          Terakhir Diperbarui: Juni 2026
        </p>
        <div className="w-16 h-1 bg-primary mb-12 rounded-full"></div>

        <div className="space-y-8 text-on-surface-variant font-body-md leading-relaxed text-sm">
          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">1. Informasi yang Kami Kumpulkan</h3>
            <p className="mb-3">
              Kami mengumpulkan informasi pribadi yang Anda berikan secara sukarela saat melakukan pemesanan tiket river tubing di Westtamp Wellness. Informasi ini meliputi:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nama lengkap pemesan.</li>
              <li>Alamat email (untuk mengirimkan e-ticket, kwitansi, dan pemberitahuan darurat).</li>
              <li>Nomor telepon / WhatsApp (untuk alternatif komunikasi darurat).</li>
              <li>Tanggal kunjungan dan jumlah peserta.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">2. Penggunaan Informasi Anda</h3>
            <p className="mb-3">
              Informasi yang kami kumpulkan digunakan secara eksklusif untuk tujuan operasional dan penyediaan layanan, termasuk:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Memproses transaksi pemesanan tiket online.</li>
              <li>Mengirimkan e-ticket berisi QR Code unik yang akan dipindai saat kedatangan di lokasi.</li>
              <li>Mengirimkan notifikasi darurat massal (seperti pembatalan sesi akibat cuaca buruk atau banjir bandang sungai Elo) beserta tautan penjadwalan ulang mandiri.</li>
              <li>Memproses verifikasi identitas di pos check-in Desa Tampirkulon.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">3. Keamanan Data & Integrasi Pihak Ketiga</h3>
            <p className="mb-3">
              Kami menjaga kerahasiaan data Anda dan tidak menjual atau membagikannya kepada pihak ketiga di luar kebutuhan pemrosesan transaksi. Layanan kami terintegrasi dengan:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Midtrans Payment Gateway</strong>: Semua data pembayaran (transfer bank, kartu kredit, e-wallet) diproses langsung secara aman di server Midtrans yang bersertifikasi standar PCI-DSS. Westtamp Wellness tidak menyimpan informasi kartu kredit atau detail perbankan Anda.</li>
              <li><strong>Layanan SMTP Email</strong>: Alamat email Anda digunakan oleh sistem mail server transaksional kami untuk mengirimkan notifikasi penting terkait transaksi Anda.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">4. Hak Anda</h3>
            <p>
              Anda memiliki hak untuk meminta akses, perbaikan, atau penghapusan data pribadi Anda yang tersimpan di sistem kami dengan menghubungi pengelola POKDARWIS Tampirkulon melalui informasi kontak resmi yang tertera di halaman hubungi kami.
            </p>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">5. Perubahan Kebijakan Privasi</h3>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu demi menyesuaikan dengan regulasi hukum yang berlaku atau perubahan operasional desa wisata. Anda disarankan untuk meninjau halaman ini secara berkala.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
