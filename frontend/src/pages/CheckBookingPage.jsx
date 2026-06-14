import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CheckBookingPage() {
  const [bookingRef, setBookingRef] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    document.title = "Cek Status Booking Tiket | Westtamp Wellness";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Cek status pembayaran tiket tubing Sungai Elo Anda, unduh QR Code e-ticket, atau lakukan reschedule mandiri.");
    }
  }, []);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!bookingRef.trim()) return;

    setLoading(true);
    setError(null);
    setBooking(null);

    client.get(`/api/bookings/lookup?booking_ref=${bookingRef.trim()}&phone=${phone.trim()}`)
      .then(res => {
        setBooking(res.data);
        toast.success("Data pemesanan ditemukan!");
      })
      .catch(err => {
        
        const errMsg = err.response?.data?.message || 'Kode booking tidak ditemukan.';
        setError(errMsg);
        toast.error(errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRetryPayment = (snapToken) => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          window.location.reload();
        },
        onPending: function (result) {
          window.location.reload();
        },
        onError: function (result) {
          toast.error("Pembayaran gagal!");
        },
        onClose: function () {
          toast.error("Jendela pembayaran ditutup.");
        }
      });
    } else {
      toast.error("Midtrans SDK gagal dimuat.");
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 text-center">
          <h1 className="font-headline-xl text-[48px] text-primary mb-2">Cek Status Booking</h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto">
            Masukkan kode referensi booking Anda untuk melihat status pembayaran, detail sesi, atau mengunduh tiket QR Code Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Left Column: Lookup Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-6 shadow-md border border-surface-variant">
              <h2 className="font-headline-md text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">search</span>
                Cari Tiket Anda
              </h2>

              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label htmlFor="search_booking_ref" className="block text-sm font-bold text-on-surface mb-2">Kode Booking *</label>
                  <input 
                    id="search_booking_ref"
                    aria-label="Kode Booking"
                    type="text" 
                    placeholder="Contoh: WT-XXXXXX atau XXXXXX" 
                    value={bookingRef}
                    onChange={e => setBookingRef(e.target.value)}
                    className="w-full border border-surface-variant p-4 rounded-lg bg-surface uppercase font-mono tracking-wider focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="search_phone" className="block text-sm font-bold text-on-surface mb-2">Nomor WhatsApp (Opsional)</label>
                  <input 
                    id="search_phone"
                    aria-label="Nomor WhatsApp"
                    type="tel" 
                    placeholder="Contoh: 081234567890" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border border-surface-variant p-4 rounded-lg bg-surface focus:outline-none focus:border-primary"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1">Verifikasi tambahan menggunakan nomor HP saat checkout.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary-container text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? 'Mencari...' : 'Cek Status Booking'}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600">error</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {booking ? (
              <div className="bg-white rounded-xl p-8 shadow-md border border-surface-variant flex flex-col md:flex-row gap-8 relative overflow-hidden">
                {/* Visual Status Indicator */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                  <div className={`absolute top-4 right-[-36px] w-36 py-1 text-center text-[10px] font-black uppercase tracking-widest text-white rotate-45 
                    ${booking.payment_status === 'success' ? 'bg-emerald-600' : (booking.payment_status === 'pending' ? 'bg-amber-500' : 'bg-red-600')}
                  `}>
                    {booking.payment_status}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {booking.package?.name}
                    </span>
                    <h2 className="font-headline-lg text-2xl font-bold text-on-surface mt-2">{booking.customer_name}</h2>
                    <p className="text-sm text-on-surface-variant mt-1">Ref: <span className="font-mono font-bold">{booking.booking_ref}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm border-t border-b border-surface-variant/30 py-4">
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Tanggal Kegiatan</p>
                      <p className="font-semibold mt-1">{booking.session?.session_date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Sesi & Jam</p>
                      <p className="font-semibold mt-1 capitalize">{booking.session?.shift} Session</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Jumlah Peserta</p>
                      <p className="font-semibold mt-1">{booking.ticket_qty} Pax</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Total Harga</p>
                      <p className="font-semibold mt-1 text-primary">Rp{Number(booking.total_price).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {booking.payment_status === 'pending' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg space-y-3">
                      <p className="text-sm font-medium">Pembayaran Anda masih berstatus <strong>Pending (Belum Dibayar)</strong>.</p>
                      <button 
                        onClick={() => handleRetryPayment(booking.midtrans_snap_token)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition-all active:scale-[0.98]"
                      >
                        Bayar Sekarang
                      </button>
                    </div>
                  )}

                  {booking.payment_status === 'expired' && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-lg">
                      <p className="text-sm font-medium">Sesi pembayaran ini telah <strong>Kedaluwarsa (Expired)</strong> karena tidak dibayar melebihi 30 menit. Silakan lakukan pemesanan ulang.</p>
                    </div>
                  )}
                </div>

                {/* QR Code Block for Success Payments */}
                {booking.payment_status === 'success' && (
                  <div className="w-full md:w-52 shrink-0 flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline-variant bg-surface rounded-xl">
                    <div className="w-36 h-36 bg-white border border-surface-variant flex items-center justify-center relative p-2 shadow-sm rounded-lg">
                      {/* Styled Simulated QR Code */}
                      <div className="w-full h-full flex flex-col justify-between border-2 border-primary/20 p-1">
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-4 border-primary"></div>
                          <div className="w-6 h-6 border-4 border-primary"></div>
                        </div>
                        <div className="flex justify-center text-[8px] font-mono tracking-widest text-primary font-bold">
                          WESTTAMP
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="w-6 h-6 border-4 border-primary"></div>
                          <div className="w-6 h-6 border-[3px] border-primary border-dashed"></div>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary mt-3 tracking-wider">{booking.qr_code || `WT-QR-${booking.booking_ref}`}</span>
                    <p className="text-[10px] text-on-surface-variant text-center mt-1">Tunjukkan QR Code ini ke petugas saat tiba di lokasi untuk diverifikasi.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-surface-container/30 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">confirmation_number</span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">Belum Ada Pencarian</h3>
                <p className="text-on-surface-variant max-w-sm">Silakan masukkan kode booking Anda di formulir pencarian sebelah kiri untuk memuat detail tiket.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
