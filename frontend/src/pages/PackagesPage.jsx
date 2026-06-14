import React, { useState, useEffect } from 'react';
import client, { getImageUrl as apiGetImageUrl } from '../api/client';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    document.title = "Wellness Packages & Pilihan Kegiatan | Westtamp Wellness";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Jelajahi berbagai paket wisata wellness dan tubing menarik di Sungai Elo. Pilih petualangan yang menyegarkan jiwa dan raga.");
    }

    client.get('/api/packages')
      .then(res => setPackages(res.data))
      .catch(err => {
        
        toast.error("Gagal memuat paket wisata.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    return apiGetImageUrl(path);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Large Background SVG Accents */}
      <div className="absolute -top-20 -right-40 w-[600px] h-[600px] text-primary/10 pointer-events-none z-0 animate-float opacity-50">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-[150deg]">
          <path fill="currentColor" d="M100 20C120 50 180 70 180 130C180 190 120 200 100 200C80 200 20 190 20 130C20 70 80 50 100 20Z" />
          <path fill="white" fillOpacity="0.1" d="M100 20V200M100 60L140 90M100 90L160 130M100 130L150 170M100 60L60 90M100 90L40 130M100 130L50 170" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute -bottom-40 -left-20 w-[800px] h-[800px] text-primary/10 pointer-events-none z-0 animate-float-delayed opacity-40">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-45">
          <path fill="currentColor" d="M100 0C100 0 100 20 100 40C120 40 140 20 140 0C140 0 160 20 180 40C160 40 140 60 140 80C160 80 180 60 200 40C200 40 180 100 100 200C20 100 0 40 0 40C20 60 40 80 60 80C60 60 40 40 20 40C40 20 60 0 60 0C60 20 80 40 100 40C100 20 100 0 100 0Z" />
        </svg>
      </div>

      {/* Floating Detail Accents */}
      <div className="absolute top-[20%] left-20 opacity-[0.08] animate-float pointer-events-none z-0">
        <span className="material-symbols-outlined text-[8rem] text-primary select-none">eco</span>
      </div>
      <div className="absolute top-[45%] right-40 opacity-[0.06] animate-float-delayed pointer-events-none z-0">
        <span className="material-symbols-outlined text-[15rem] text-secondary select-none">potted_plant</span>
      </div>
      <div className="absolute bottom-[15%] right-1/4 opacity-[0.06] pointer-events-none z-0">
        <span className="material-symbols-outlined text-[25rem] text-primary select-none">spa</span>
      </div>

      <main className="flex-grow pt-10 pb-20 px-6 max-w-[1280px] mx-auto w-full relative z-10">
        <section className="mb-16 relative">
          <div className="text-center max-w-3xl mx-auto mb-12 relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl animate-pulse">eco</span>
              <span className="h-[1px] w-12 bg-primary/20"></span>
              <span className="material-symbols-outlined text-primary text-2xl animate-pulse">eco</span>
            </div>
            <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-primary mb-4">Wellness Packages</h1>
            <p className="font-body-lg text-lg text-on-surface-variant">Temukan keseimbangan sempurna antara petualangan sungai dan kesehatan holistik. Pilih perjalanan yang menghubungkan Anda dengan alam dan menyegarkan tubuh Anda.</p>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">autorenew</span>
          </div>
        ) : (
          <section className={`flex flex-wrap gap-6 mb-16 ${packages.length < 3 ? 'justify-center' : 'justify-start'}`}>
            {packages.map((pkg, idx) => {
              const isPopular = pkg.is_popular;
              const hasImage = !!pkg.image_url;

              return (
                <div key={pkg.id} className={`w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.33%-1rem)] bg-surface rounded-2xl shadow-[0_8px_30px_rgba(27,67,50,0.08)] border overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500 relative ${isPopular ? 'border-primary-fixed border-2 ring-4 ring-primary/5' : 'border-surface-variant hover:border-primary/20'}`}>
                  {/* Decorative Leaf Accent for Card */}
                  <div className="absolute -bottom-6 -right-6 opacity-[0.1] group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none">
                    <span className="material-symbols-outlined text-[8rem] text-primary rotate-45">eco</span>
                  </div>

                  {isPopular && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-sm shadow-lg flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        Paling Populer
                      </span>
                    </div>
                  )}

                  <div className="relative h-72 w-full bg-surface-container overflow-hidden">
                    <img
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={hasImage
                        ? getImageUrl(pkg.image_url)
                        : (isPopular
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZzNAHaspw5KEHfyCuCilX7ffLuDZUK-P42PxO7A3gR0ijF2e-ElJWCuk7Z5eUgA86Xt4OC7de4566-iY4EOuKVV82elxCV8V0oX-gzlM_rKmzXRs2GpskvaOBA_0ozeW593eBZ2SMgqF6ztZaOtQFgjP7lDPujQ67bQUhjWmTxLFmhnzFsuwSseI1Bid3ipGBCZjtJ9d6JbsHPlli9iP-vdjNGlEnCvnD909Yl2D3aqUOxIC0Y2rXsPeFa_O0eWugc_Uyz77PoY1"
                          : "https://lh3.googleusercontent.com/aida-public/AB6AXuBAZMbT0X2e5ifXO-TjUZ0qx3Wfp7UOoFcL3VfhKwomiU_PH1nfhpmv_b3th5nbOfKV-DT4FAXtMgCAqp9ICbbIR9X3yqnTjgFwaNBAbGMHRqhMx7sgZst6x41FIiain5190U4tp3beVjV6Lu7OI08Ycr6nhJAYMXu_SAdeQbwS5ZBmnTz2oq03J2L7jgGlUjCQPqXBJLsRJy0dkpKRQjPpE3l1UlAaVAn_Z4KJXmd0K9TVRO4lXGYDA5Mb-2WWm1pWZeMHdMLS_fTc")
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23edeeef'/><text x='50%' y='50%' font-family='sans-serif' font-size='24' fill='%23717973' text-anchor='middle' dominant-baseline='middle'>Image Not Found</text></svg>";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white pr-6">
                      <h2 className="font-headline-md text-2xl font-bold leading-tight drop-shadow-md group-hover:text-primary-fixed transition-colors">{pkg.name}</h2>
                    </div>
                  </div>

                  <div className={`p-8 flex-grow flex flex-col relative z-10 ${isPopular ? 'bg-primary/5' : ''}`}>
                    <div className="flex flex-col mb-6 border-b border-outline-variant/30 pb-4 gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-lg text-3xl font-bold text-primary">Rp{Number(pkg.price).toLocaleString('id-ID')}</span>
                        <span className="font-body-sm tracking-wide text-on-surface-variant uppercase font-bold text-xs">/ pax</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {(pkg.description || '').split(/\r?\n/).filter(line => line.trim() !== '').map((line, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="material-symbols-outlined notranslate text-primary text-[18px] mt-0.5 shrink-0">check_circle</span>
                          <p className={`font-body-md text-sm leading-relaxed ${isPopular ? 'text-on-surface' : 'text-on-surface-variant'}`}>{line.trim()}</p>
                        </div>
                      ))}
                    </div>

                    <Link to="/booking" className="mt-auto">
                      <button className={`w-full py-4 rounded-xl font-label-md transition-all border font-bold shadow-sm active:scale-95 cursor-pointer ${isPopular ? 'bg-primary text-on-primary hover:bg-primary/90 border-transparent' : 'bg-surface-container-high text-primary hover:bg-primary hover:text-white border-outline-variant hover:border-transparent'}`}>
                        Pesan Sekarang
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {!loading && packages.length === 0 && (
          <div className="text-center py-20 bg-surface-container/50 backdrop-blur-sm rounded-3xl border border-dashed border-outline-variant relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[15rem]">potted_plant</span>
            </div>
            <span className="material-symbols-outlined text-6xl mb-4 text-on-surface-variant opacity-30">inventory_2</span>
            <p className="font-body-lg text-on-surface-variant italic relative z-10">Belum ada paket produk yang tersedia saat ini.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
