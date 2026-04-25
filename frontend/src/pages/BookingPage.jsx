import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch packages from backend
    axios.get('http://localhost:8000/api/packages')
      .then(res => {
        setPackages(res.data);
        if(res.data.length > 0) setSelectedPackage(res.data[0]);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (date) {
      axios.post('http://localhost:8000/api/sessions/availability', { date })
        .then(res => setAvailability(res.data))
        .catch(err => console.error(err));
    }
  }, [date]);

  const handleCheckout = () => {
    if (!selectedPackage || !session || !date || !customerName || !customerPhone) {
      alert("Please fill in all details (Date, Session, Name, Phone).");
      return;
    }

    setLoading(true);
    axios.post('http://localhost:8000/api/bookings/checkout', {
      package_id: selectedPackage.id,
      session_id: availability[session].id,
      customer_name: customerName,
      customer_phone: customerPhone,
      ticket_qty: guests
    })
    .then(res => {
      // Simulate Snap behavior or redirect to generic success page
      alert(`Booking Success! Midtrans Order ID: ${res.data.order_id}\n\nNormally midtrans SNAP window would appear here using SnapToken: ${res.data.snap_token}`);
      navigate('/');
    })
    .catch(err => {
      alert("Error: " + (err.response?.data?.message || err.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const totalPrice = selectedPackage ? selectedPackage.price * guests : 0;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 w-full z-50 border-b border-surface-variant shadow-sm font-label-md text-sm">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1280px] mx-auto">
          <Link to="/">
            <div className="text-2xl font-black tracking-tighter text-primary-container">
              Westtamp Wellness
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
          <h1 className="font-headline-xl text-[48px] text-primary mb-2">Booking & Schedule</h1>
          <p className="font-body-lg text-lg text-on-surface-variant">Select your ideal package and lock in your adventure.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Packages */}
            <section className="bg-white rounded-xl p-6 shadow-md border border-surface-variant">
              <h2 className="font-headline-md text-2xl text-primary mb-6 flex items-center gap-2">Choose Your Package</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map(pkg => (
                  <div key={pkg.id} 
                    onClick={() => setSelectedPackage(pkg)}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative ${selectedPackage?.id === pkg.id ? 'border-primary-container bg-primary-fixed/20' : 'border-outline-variant bg-surface'}`}>
                    <h3 className="font-headline-lg text-[24px] text-primary mb-1">{pkg.name}</h3>
                    <div className="font-headline-md text-xl text-primary-container mb-4">
                      Rp{parseInt(pkg.price).toLocaleString('id-ID')} <span className="font-body-md text-base text-on-surface-variant font-normal">/pax</span>
                    </div>
                    <div className="space-y-1">
                      {(pkg.description || '').split(/\r?\n/).filter(l => l.trim() !== '').map((line, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined notranslate text-[16px] mt-1 shrink-0 text-primary">check_circle</span>
                          <p>{line.trim()}</p>
                        </div>
                      ))}
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
                  <label className="font-label-md text-on-surface block mb-2">Adventure Date</label>
                  <input type="date" className="w-full border border-outline-variant rounded-lg p-4 bg-surface" 
                    value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>

                <div>
                  <label className="font-label-md text-on-surface block mb-2">Session</label>
                  <div className="flex gap-4">
                    <button onClick={() => setSession('pagi')} disabled={!availability?.pagi}
                      className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${session === 'pagi' ? 'border-primary-container bg-primary-container/10 text-primary-container font-bold' : 'border-outline-variant bg-surface opacity-80'}`}>
                      Pagi (08:00 - 11:00)
                      {availability && <div className="text-xs font-normal mt-1">{availability.pagi.available} left</div>}
                    </button>
                    <button onClick={() => setSession('siang')} disabled={!availability?.siang}
                      className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${session === 'siang' ? 'border-primary-container bg-primary-container/10 text-primary-container font-bold' : 'border-outline-variant bg-surface opacity-80'}`}>
                      Siang (13:00 - 16:00)
                      {availability && <div className="text-xs font-normal mt-1">{availability.siang.available} left</div>}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-outline-variant">
                <h3 className="font-label-md mb-2">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="border border-outline-variant p-3 rounded" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  <input type="tel" placeholder="WhatsApp Number" className="border border-outline-variant p-3 rounded" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
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
                    <button onClick={() => setGuests(guests + 1)} className="px-4 py-2 bg-surface hover:bg-surface-variant">+</button>
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
