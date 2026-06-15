import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsConditionsPage() {
  useEffect(() => {
    document.title = "Syarat & Ketentuan | Westtamp Wellness";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full py-16 px-6 max-w-[800px] mx-auto mt-6">
        <h1 className="font-headline-lg text-4xl font-extrabold text-primary mb-3">
          Syarat & Ketentuan
        </h1>
        <p className="text-sm text-on-surface-variant mb-8 font-body-sm">
          Terakhir Diperbarui: Juni 2026
        </p>
        <div className="w-16 h-1 bg-primary mb-12 rounded-full"></div>

        <div className="space-y-8 text-on-surface-variant font-body-md leading-relaxed text-sm">
          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">1. Ketentuan Pemesanan Tiket</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Setiap wisatawan wajib mengisi formulir reservasi online dengan data yang valid dan dapat dipertanggungjawabkan.</li>
              <li>Satu tiket berlaku untuk satu orang peserta tubing dan mencakup fasilitas peralatan keselamatan (helm, pelampung, pemandu/guide) serta layanan *free health checkup* di basecamp.</li>
              <li>Pemesanan dianggap sah apabila pembayaran telah berhasil diverifikasi oleh payment gateway Midtrans dan status pesanan berubah menjadi sukses (*settlement*).</li>
              <li>Kuota maksimal per sesi (Pagi / Siang) adalah **100 ban**. Sistem akan menolak pemesanan jika batas kuota telah terpenuhi.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">2. Aturan Penjadwalan Ulang (Reschedule) Mandiri</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wisatawan dapat mengajukan reschedule tanggal/sesi kunjungan secara mandiri melalui halaman "Cek Tiket" di website Westtamp Tubing.</li>
              <li>Reschedule reguler hanya diperbolehkan **maksimal H-1 sebelum tanggal kunjungan awal** yang tertera pada tiket asli.</li>
              <li>Reschedule pada hari H kunjungan untuk tiket aktif reguler akan ditolak secara otomatis oleh sistem.</li>
              <li>Reschedule hanya dapat diproses apabila kuota pada tanggal dan sesi baru yang dipilih masih tersedia.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">3. Kebijakan Keadaan Darurat Cuaca (Weather Emergency)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Aktivitas river tubing sangat dipengaruhi oleh debit air Sungai Elo dan faktor cuaca. POKDARWIS berhak membatalkan sesi demi keselamatan jiwa peserta jika kondisi sungai dinilai berbahaya.</li>
              <li>Apabila terjadi pembatalan sesi oleh POKDARWIS akibat darurat cuaca, seluruh tiket yang terdampak akan diubah statusnya menjadi **Open Ticket (Pending Reschedule)** secara otomatis.</li>
              <li>Tiket berstatus *Open Ticket* mendapatkan **kebijakan bypass aturan H-1**, yang artinya wisatawan dapat melakukan reschedule secara gratis kapan saja (tanpa batas waktu H-1) hingga masa berlaku maksimal 30 hari berakhir.</li>
              <li>Proses pengembalian dana (*refund*) atas pembatalan akibat cuaca darurat bergantung pada kebijakan manajemen POKDARWIS dan diproses secara manual melalui dashboard Midtrans; sistem tidak melakukan refund otomatis.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">4. Keselamatan & Perilaku Pengunjung</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Setiap peserta river tubing wajib mematuhi seluruh instruksi keselamatan yang diberikan oleh pemandu wisata di basecamp maupun di sungai.</li>
              <li>Peserta diwajibkan menggunakan alat pelindung diri lengkap (pelampung dan helm) yang disediakan selama berada di jalur air.</li>
              <li>Pengelola tidak bertanggung jawab atas cedera, kehilangan barang pribadi, atau kecelakaan yang diakibatkan oleh kelalaian peserta atau ketidakpatuhan terhadap protokol keselamatan.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
