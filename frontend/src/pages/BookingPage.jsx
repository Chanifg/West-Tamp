import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';

export default function BookingPage() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [session, setSession] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.title = "Booking Tiket & Wellness Packages | Westtamp Wellness";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Pesan tiket petualangan tubing Sungai Elo dan paket wellness Desa Wisata Tampirkulon secara langsung dan instan.");
    }
  }, []);

  const getMaxGuests = () => {
    if (session && availability && availability[session]) {
      return availability[session].available;
    }
    return 100;
  };

  useEffect(() => {
    if (session && availability) {
      const maxGuests = availability[session]?.available || 100;
      if (guests > maxGuests) {
        setGuests(Math.max(1, maxGuests));
        toast.error(`Jumlah peserta disesuaikan ke ${Math.max(1, maxGuests)} pax sesuai kuota yang tersedia.`);
      }
    }
  }, [session, availability]);

  useEffect(() => {
    // Fetch packages from backend
    client.get('/api/packages')
      .then(res => {
        setPackages(res.data);
        if (res.data.length > 0) setSelectedPackage(res.data[0]);
      })
      .catch(err => {

        toast.error("Gagal memuat paket wisata.");
      });
  }, []);

  useEffect(() => {
    if (date) {
      client.post('/api/sessions/availability', { date })
        .then(res => setAvailability(res.data))
        .catch(err => {

          toast.error("Gagal memuat ketersediaan sesi.");
        });
    }
  }, [date]);

  const handleCheckout = () => {
    if (!selectedPackage || !session || !date || !customerName || !customerPhone || !customerEmail) {
      toast.error("Silakan lengkapi semua data (Tanggal, Sesi, Nama, Nomor HP, Email).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error("Format alamat email tidak valid.");
      return;
    }

    setLoading(true);
    client.post('/api/bookings/checkout', {
      package_id: selectedPackage.id,
      session_id: availability[session].id,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      ticket_qty: guests
    })
      .then(res => {
        const booking_ref = res.data.data.booking_ref;

        toast.success("Pemesanan berhasil dibuat.");

        navigate(`/booking-success/${booking_ref}`);
      })
      .catch(err => {

        toast.error(err.response?.data?.message || "Terjadi kesalahan saat checkout.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const totalPrice = selectedPackage ? selectedPackage.price * guests : 0;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-6 md:px-12 py-12">
        <h1 className="font-headline-xl text-[48px] text-primary mb-2 text-center md:text-left">Book Your Adventure</h1>
        <p className="font-body-lg text-lg text-on-surface-variant mb-12 text-center md:text-left">Choose your package, date, and input customer details to secure your spot.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* Packages */}
            <section className="bg-white rounded-xl p-6 shadow-md border border-surface-variant">
              <h2 className="font-headline-md text-2xl text-primary mb-6">Select Wellness Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map(pkg => (
                  <div key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`border rounded-xl p-6 cursor-pointer transition-all flex flex-col justify-between ${selectedPackage?.id === pkg.id ? 'border-primary-container bg-primary-container/5 ring-1 ring-primary-container' : 'border-outline-variant hover:border-primary-container'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface">{pkg.name}</h3>
                        {pkg.is_popular && <span className="bg-primary-container text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Popular</span>}
                      </div>
                      <p className="text-sm text-on-surface-variant mb-6">{pkg.description}</p>
                    </div>

                    <div>
                      <p className="text-xl font-bold text-primary mb-4">Rp{parseInt(pkg.price).toLocaleString('id-ID')} <span className="text-xs font-normal text-on-surface-variant">/ pax</span></p>
                      <div className="border-t border-outline-variant pt-4 flex flex-col gap-2">
                        {(pkg.features ?? []).map((item, index) => (
                          <div
                            key={item.id ?? index}
                            className="flex items-start gap-2 text-sm text-on-surface-variant"
                          >
                            <span className="material-symbols-outlined notranslate text-[16px] mt-1 shrink-0 text-primary">
                              check_circle
                            </span>

                            <p>{item.feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section className="bg-white rounded-xl p-6 shadow-md border border-surface-variant">
              <h2 className="font-headline-md text-2xl text-primary mb-6 flex items-center gap-2">Select Date & Session</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="adventure_date" className="font-label-md text-on-surface block mb-2">Adventure Date</label>
                  <input id="adventure_date" type="date" className="w-full border border-outline-variant rounded-lg p-4 bg-surface"
                    value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>

                <div>
                  <label className="font-label-md text-on-surface block mb-2">Session</label>
                  <div className="flex gap-4">
                    <button onClick={() => setSession('pagi')} disabled={!availability?.pagi}
                      className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${session === 'pagi' ? 'border-primary-container bg-primary-container/10 text-primary-container font-bold' : 'border-outline-variant bg-surface opacity-80'}`}
                      aria-label="Pilih sesi pagi"
                    >
                      Pagi (08:00 - 11:00)
                      {availability && <div className="text-xs font-normal mt-1">{availability.pagi.available} left</div>}
                    </button>
                    <button onClick={() => setSession('siang')} disabled={!availability?.siang}
                      className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${session === 'siang' ? 'border-primary-container bg-primary-container/10 text-primary-container font-bold' : 'border-outline-variant bg-surface opacity-80'}`}
                      aria-label="Pilih sesi siang"
                    >
                      Siang (13:00 - 16:00)
                      {availability && <div className="text-xs font-normal mt-1">{availability.siang.available} left</div>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant">
                <h3 className="font-label-md mb-2">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input id="customer_name" aria-label="Nama Lengkap" type="text" placeholder="Full Name" className="border border-outline-variant p-3 rounded" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  <input id="customer_phone" aria-label="Nomor WhatsApp" type="tel" placeholder="WhatsApp Number" className="border border-outline-variant p-3 rounded" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  <input id="customer_email" aria-label="Alamat Email" type="email" placeholder="Email Address" className="border border-outline-variant p-3 rounded" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-6 shadow-md border border-surface-variant sticky top-24">
              <h2 className="font-headline-md text-2xl text-primary mb-6 border-b border-outline-variant pb-4">Booking Summary</h2>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Package</p>
                  <p className="font-body-lg font-medium">{selectedPackage ? selectedPackage.name : 'None selected'}</p>
                </div>

                <div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Date & Time</p>
                  <p className="font-body-md">{date || '-'}</p>
                  <p className="font-body-md capitalize">{session ? `${session} Session` : '-'}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <label className="font-label-md">Guests</label>
                  <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="px-4 py-2 bg-surface hover:bg-surface-variant">-</button>
                    <span className="px-4 font-body-md">{guests}</span>
                    <button
                      onClick={() => {
                        const maxGuests = getMaxGuests();
                        if (guests >= maxGuests) {
                          toast.error(`Kapasitas maksimum sesi ini hanya tersisa ${maxGuests} ban.`);
                        } else {
                          setGuests(guests + 1);
                        }
                      }}
                      className="px-4 py-2 bg-surface hover:bg-surface-variant"
                    >+</button>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold text-primary">
                  <p>Total</p>
                  <p>Rp{totalPrice.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary-container text-white py-4 rounded-lg font-bold shadow-md hover:opacity-90 transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


