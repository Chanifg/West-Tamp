import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';

export default function ReschedulePage() {
  const [bookingRef, setBookingRef] = useState(() => {
    return new URLSearchParams(window.location.search).get('booking_ref') || '';
  });
  const [booking, setBooking] = useState(null);
  const [searchRef, setSearchRef] = useState(bookingRef);
  const [date, setDate] = useState('');
  const [session, setSession] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingBooking, setFetchingBooking] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.title = "Atur Ulang Jadwal (Reschedule) | Westtamp Wellness";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Layanan darurat cuaca untuk mengatur ulang tanggal dan sesi kegiatan river tubing Anda di Sungai Elo secara mandiri.");
    }
  }, []);

  useEffect(() => {
    if (bookingRef) {
      fetchBookingDetails();
    }
  }, [bookingRef]);

  useEffect(() => {
    if (date) {
      client.post('/api/sessions/availability', { date })
        .then(res => setAvailability(res.data))
        .catch(err => {});
    }
  }, [date]);

  const fetchBookingDetails = () => {
    setFetchingBooking(true);
    setMessage(null);
    setBooking(null);
    
    // We will query booking by reference. In Laravel backend, we can create a simple check route
    // Or reuse verifyQr/lookup if we implement it.
    // Wait, let's look up using check availability or we can add a lookup route.
    // Let's implement /api/bookings/lookup on the backend as part of Issue 13,
    // but we can query it or we can build a simple endpoint. Let's make sure backend has:
    // GET /api/bookings/lookup?booking_ref=...
    // Let's call GET /api/bookings/lookup
    client.get(`/api/bookings/verify-reschedule?booking_ref=${bookingRef}`)
      .then(res => {
        setBooking(res.data);
        toast.success("Kode booking terverifikasi untuk reschedule!");
      })
      .catch(err => {
        
        const errMsg = err.response?.data?.message || 'Kode booking tidak ditemukan.';
        setMessage({ type: 'error', text: errMsg });
        toast.error(errMsg);
      })
      .finally(() => setFetchingBooking(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchRef.trim()) {
      setBookingRef(searchRef.trim());
    }
  };

  const handleReschedule = () => {
    if (!booking || !date || !session || !availability) {
      toast.error("Silakan pilih tanggal dan sesi tujuan.");
      return;
    }

    setLoading(true);
    client.post('/api/bookings/reschedule', {
      booking_ref: booking.booking_ref,
      session_id: availability[session].id
    })
    .then(res => {
      setMessage({ type: 'success', text: 'Reschedule berhasil dilakukan! Jadwal petualangan Anda telah diperbarui.' });
      toast.success("Jadwal Anda berhasil diatur ulang!");
      // Clear scheduling state
      setBooking(null);
      setDate('');
      setSession('');
      setAvailability(null);
    })
    .catch(err => {
      toast.error("Gagal melakukan reschedule: " + (err.response?.data?.message || err.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-headline-xl text-[48px] text-primary mb-2">Atur Ulang Jadwal (Reschedule)</h1>
          <p className="font-body-lg text-lg text-on-surface-variant">Layanan darurat cuaca untuk memindahkan kuota tiket Anda ke sesi lain yang aman.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Booking Lookup Form if not loaded */}
          {!booking && !fetchingBooking && (
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-variant mb-8">
              <h2 className="font-headline-md text-2xl text-primary mb-4">Cari Kode Booking</h2>
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
                <input 
                  id="booking_ref_search"
                  aria-label="Cari Kode Booking"
                  type="text" 
                  placeholder="Masukkan 8 Karakter Kode Booking (Cth: ABCD1234)" 
                  value={searchRef}
                  onChange={e => setSearchRef(e.target.value)}
                  className="flex-grow border border-surface-variant p-4 rounded-lg bg-surface uppercase font-mono tracking-wider focus:outline-none focus:border-primary"
                  required
                />
                <button type="submit" className="bg-primary text-white px-8 py-4 rounded-lg font-bold shadow-sm hover:opacity-90 transition-all">
                  Cari Tiket
                </button>
              </form>
              
              {message && message.type === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              {message && message.type === 'success' && (
                <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-4xl mb-2 text-emerald-600">check_circle</span>
                  <p className="font-bold mb-2">{message.text}</p>
                  <Link to="/" className="text-primary font-bold hover:underline">Kembali ke Beranda</Link>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {fetchingBooking && (
            <div className="bg-white rounded-xl p-8 shadow-md border border-surface-variant mb-8 text-center">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-4">settings</span>
              <p className="text-on-surface-variant">Sedang memuat data booking Anda...</p>
            </div>
          )}

          {/* Booking Found & Form */}
          {booking && (
            <div className="space-y-8">
              {/* Booking Info Card */}
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <h2 className="font-headline-md text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">receipt_long</span>
                  Detail Tiket Aktif
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><strong>Kode Booking:</strong> <span className="font-mono bg-white px-2 py-0.5 rounded border">{booking.booking_ref}</span></p>
                  <p><strong>Nama Pemesan:</strong> {booking.customer_name}</p>
                  <p><strong>Jumlah Tiket:</strong> {booking.ticket_qty} Pax</p>
                  <p><strong>Paket Wisata:</strong> {booking.package?.name}</p>
                  <p><strong>Jadwal Lama:</strong> {booking.session?.session_date} ({booking.session?.shift === 'pagi' ? 'Pagi 08:00' : 'Siang 13:00'})</p>
                  <p><strong>Status Pembayaran:</strong> <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-xs">LUNAS</span></p>
                </div>
              </div>

              {/* Selector Card */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-surface-variant">
                <h2 className="font-headline-md text-2xl text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">calendar_today</span>
                  Pilih Jadwal & Sesi Baru
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="reschedule_date" className="font-label-md text-on-surface block mb-2 font-bold">Tanggal Baru</label>
                    <input 
                      id="reschedule_date"
                      type="date" 
                      className="w-full border border-surface-variant rounded-lg p-4 bg-surface" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]} 
                    />
                  </div>

                  <div>
                    <label className="font-label-md text-on-surface block mb-2 font-bold">Sesi Baru</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSession('pagi')} 
                        disabled={!availability?.pagi || availability.pagi.status !== 'active'}
                        className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${session === 'pagi' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-surface-variant bg-surface opacity-80'}`}
                      >
                        Pagi (08:00 - 11:00)
                        {availability && <div className="text-xs font-normal mt-1">{availability.pagi.available} left</div>}
                      </button>
                      <button 
                        onClick={() => setSession('siang')} 
                        disabled={!availability?.siang || availability.siang.status !== 'active'}
                        className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${session === 'siang' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-surface-variant bg-surface opacity-80'}`}
                      >
                        Siang (13:00 - 16:00)
                        {availability && <div className="text-xs font-normal mt-1">{availability.siang.available} left</div>}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-surface-variant pt-6">
                  <button 
                    onClick={() => { setBooking(null); setBookingRef(''); }} 
                    className="flex-1 py-4 border border-surface-variant rounded-xl font-bold text-on-surface-variant hover:bg-surface transition-colors"
                  >
                    Kembali
                  </button>
                  <button 
                    onClick={handleReschedule} 
                    disabled={loading || !date || !session}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-md hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Memproses...' : 'Konfirmasi Reschedule'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
