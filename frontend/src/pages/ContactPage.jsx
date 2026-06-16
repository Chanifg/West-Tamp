import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import client from '../api/client';

export default function ContactPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Hubungi Kami | Westtamp Wellness";
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    client.post('/api/contact', formData)
      .then(() => {
        toast.success("Pesan Anda berhasil terkirim! POKDARWIS akan segera menghubungi Anda.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      })
      .catch(err => {
        const errMsg = err.response?.data?.message || err.message || "Gagal mengirim pesan. Silakan coba lagi.";
        toast.error("Gagal mengirim pesan: " + errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full py-16 px-6 max-w-[1280px] mx-auto mt-6">
        <div className="text-center mb-16">
          <h1 className="font-headline-lg text-4xl font-extrabold text-primary mb-3">
            Hubungi Kami
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto font-body-md">
            Miliki pertanyaan seputar paket tubing, reservasi kelompok besar, atau kemitraan UMKM? Kami siap membantu Anda.
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information & Map (Left Column) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest border border-surface-variant p-8 rounded-2xl shadow-[0_4px_20px_rgba(27,67,50,0.04)]">
              <h3 className="font-headline-md text-xl font-bold text-primary mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-label-md font-bold text-on-surface">Alamat Basecamp</h4>
                    <p className="text-sm text-on-surface-variant font-body-md mt-1">
                      Jl. Elo-Tampir, Dusun Tampir Kulon, Kec. Candimulyo, Kabupaten Magelang, Jawa Tengah 56191
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-label-md font-bold text-on-surface">Telepon / WhatsApp</h4>
                    <p className="text-sm text-on-surface-variant font-body-md mt-1">
                      +62 812-3456-7890 (POKDARWIS Tampirkulon)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-label-md font-bold text-on-surface">Email Resmi</h4>
                    <p className="text-sm text-on-surface-variant font-body-md mt-1">
                      info@westtamp.desa.id
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-surface rounded-2xl overflow-hidden border border-surface-variant h-[280px] relative shadow-[0_4px_20px_rgba(27,67,50,0.04)]">
              <div className="absolute inset-0 bg-[#E5E4E2] flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-2">map</span>
                <h4 className="font-bold text-on-surface text-sm">Basecamp Tampirkulon River Tubing</h4>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  Magelang, Jawa Tengah. Jalur petualangan Elo River Tubing.
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-variant p-8 md:p-10 rounded-2xl shadow-[0_4px_24px_rgba(27,67,50,0.05)]">
            <h3 className="font-headline-md text-xl font-bold text-primary mb-2">Kirim Pesan</h3>
            <p className="text-sm text-on-surface-variant font-body-md mb-8">
              Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam waktu 1x24 jam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-surface-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary text-sm font-semibold text-on-surface"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Alamat Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-surface-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary text-sm font-semibold text-on-surface"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">No. Telepon / WA</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-surface-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary text-sm font-semibold text-on-surface"
                    placeholder="081234567xxx"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Subjek</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-surface-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary text-sm font-semibold text-on-surface"
                    placeholder="Pertanyaan umum / Reservasi group"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Pesan Anda</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full border border-surface-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary text-sm font-semibold text-on-surface resize-none"
                  placeholder="Tuliskan detail pertanyaan atau kebutuhan Anda di sini..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 px-6 rounded-xl font-bold transition-all disabled:opacity-50 text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                {loading ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
