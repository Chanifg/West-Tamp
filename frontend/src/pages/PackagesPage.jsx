import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/packages')
      .then(res => setPackages(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-10 pb-20 px-6 max-w-[1280px] mx-auto w-full">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
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
                <div key={pkg.id} className={`w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.33%-1rem)] bg-surface rounded-xl shadow-[0_8px_30px_rgba(27,67,50,0.12)] border overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative ${isPopular ? 'border-primary-fixed border-2' : 'border-surface-variant'}`}>
                  {isPopular && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-sm shadow-md">Paling Populer</span>
                    </div>
                  )}
                  
                  <div className="relative h-64 w-full bg-surface-container">
                    <img 
                      alt={pkg.name} 
                      className="w-full h-full object-cover" 
                      src={hasImage 
                        ? getImageUrl(pkg.image_url)
                        : (isPopular 
                            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZzNAHaspw5KEHfyCuCilX7ffLuDZUK-P42PxO7A3gR0ijF2e-ElJWCuk7Z5eUgA86Xt4OC7de4566-iY4EOuKVV82elxCV8V0oX-gzlM_rKmzXRs2GpskvaOBA_0ozeW593eBZ2SMgqF6ztZaOtQFgjP7lDPujQ67bQUhjWmTxLFmhnzFsuwSseI1Bid3ipGBCZjtJ9d6JbsHPlli9iP-vdjNGlEnCvnD909Yl2D3aqUOxIC0Y2rXsPeFa_O0eWugc_Uyz77PoY1"
                            : "https://lh3.googleusercontent.com/aida-public/AB6AXuBAZMbT0X2e5ifXO-TjUZ0qx3Wfp7UOoFcL3VfhKwomiU_PH1nfhpmv_b3th5nbOfKV-DT4FAXtMgCAqp9ICbbIR9X3yqnTjgFwaNBAbGMHRqhMx7sgZst6x41FIiain5190U4tp3beVjV6Lu7OI08Ycr6nhJAYMXu_SAdeQbwS5ZBmnTz2oq03J2L7jgGlUjCQPqXBJLsRJy0dkpKRQjPpE3l1UlAaVAn_Z4KJXmd0K9TVRO4lXGYDA5Mb-2WWm1pWZeMHdMLS_fTc")
                      } 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white pr-6">
                      <h2 className="font-headline-md text-2xl font-bold leading-tight drop-shadow-md">{pkg.name}</h2>
                    </div>
                  </div>

                  <div className={`p-6 flex-grow flex flex-col ${isPopular ? 'bg-primary-fixed/5' : ''}`}>
                    <div className="flex flex-col mb-6 border-b border-outline-variant pb-4 gap-1">
                      <span className="font-headline-lg text-3xl font-bold text-primary">Rp{Number(pkg.price).toLocaleString('id-ID')}</span>
                      <span className="font-body-sm tracking-wide text-on-surface-variant uppercase font-bold">per orang</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {(pkg.description || '').split(/\r?\n/).filter(line => line.trim() !== '').map((line, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="material-symbols-outlined notranslate text-primary text-[18px] mt-1 shrink-0">check_circle</span>
                          <p className={`font-body-md text-sm leading-relaxed ${isPopular ? 'text-on-surface' : 'text-on-surface-variant'}`}>{line.trim()}</p>
                        </div>
                      ))}
                    </div>

                    <Link to="/booking">
                      <button className={`w-full py-4 rounded-xl font-label-md transition-all border font-bold shadow-sm ${isPopular ? 'bg-primary text-on-primary hover:bg-primary-container border-transparent' : 'bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary border-outline-variant hover:border-transparent'}`}>
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
          <div className="text-center py-20 bg-surface-container rounded-xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-5xl mb-4 text-on-surface-variant opacity-50">inventory_2</span>
            <p className="font-body-lg text-on-surface-variant italic">Belum ada paket produk yang tersedia saat ini.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
