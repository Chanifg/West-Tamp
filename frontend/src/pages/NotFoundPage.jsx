import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 - Halaman Tidak Ditemukan | Westtamp Wellness";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Halaman yang Anda cari tidak dapat ditemukan di platform Westtamp Wellness.");
    }
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-24 flex flex-col items-center justify-center text-center">
        <div className="space-y-6 max-w-lg">
          <div className="relative">
            {/* Visual 404 and Tubing Icon */}
            <h1 className="text-[120px] font-black leading-none text-primary/10 select-none tracking-tighter">404</h1>
            <span className="material-symbols-outlined text-7xl text-primary absolute inset-0 m-auto h-fit w-fit animate-bounce">
              sailing
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline-lg text-3xl font-bold text-primary">Wah, Jalur Tubing Terputus!</h2>
            <p className="text-on-surface-variant font-body-md text-base leading-relaxed">
              Halaman yang Anda cari tidak dapat ditemukan. Mungkin Anda salah mengetik URL, atau jalur petualangan ini sudah dipindahkan ke rute yang lebih aman.
            </p>
          </div>

          <div className="pt-4">
            <Link to="/">
              <button className="bg-primary-container text-white px-8 py-4 rounded-xl font-bold hover:bg-primary transition-all active:scale-95 cursor-pointer shadow-md">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
