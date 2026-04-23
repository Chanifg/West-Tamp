import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PackagesPage() {
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Paket Fun */}
          <div className="bg-surface rounded-xl shadow-[0_8px_30px_rgba(27,67,50,0.08)] overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300 border border-surface-variant">
            <div className="relative h-64 w-full">
              <img alt="Petualangan river tubing" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAZMbT0X2e5ifXO-TjUZ0qx3Wfp7UOoFcL3VfhKwomiU_PH1nfhpmv_b3th5nbOfKV-DT4FAXtMgCAqp9ICbbIR9X3yqnTjgFwaNBAbGMHRqhMx7sgZst6x41FIiain5190U4tp3beVjV6Lu7OI08Ycr6nhJAYMXu_SAdeQbwS5ZBmnTz2oq03J2L7jgGlUjCQPqXBJLsRJy0dkpKRQjPpE3l1UlAaVAn_Z4KJXmd0K9TVRO4lXGYDA5Mb-2WWm1pWZeMHdMLS_fTc" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="inline-block bg-secondary/80 backdrop-blur-sm text-on-secondary px-3 py-1 rounded-full font-label-sm text-sm mb-2">Pemula</span>
                <h2 className="font-headline-md text-2xl font-semibold">Paket Fun</h2>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-baseline mb-6 border-b border-outline-variant pb-4">
                <span className="font-headline-lg text-3xl font-bold text-primary">Rp150.000</span>
                <span className="font-body-md text-on-surface-variant">/ orang</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface">Peralatan Keamanan & Briefing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface">Pemandu Sungai Profesional</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface">Minuman Selamat Datang Tradisional</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface">Skrining Kesehatan Dasar</span>
                </li>
              </ul>
              <button className="w-full bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary py-3 rounded-lg font-label-md transition-colors border border-outline-variant hover:border-transparent font-bold">Pilih Paket</button>
            </div>
          </div>

          {/* Paket Adventure */}
          <div className="bg-surface rounded-xl shadow-[0_8px_30px_rgba(27,67,50,0.12)] border-2 border-primary-fixed overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative">
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-sm shadow-md">Paling Populer</span>
            </div>
            <div className="relative h-64 w-full">
              <img alt="Keseruan river tubing" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZzNAHaspw5KEHfyCuCilX7ffLuDZUK-P42PxO7A3gR0ijF2e-ElJWCuk7Z5eUgA86Xt4OC7de4566-iY4EOuKVV82elxCV8V0oX-gzlM_rKmzXRs2GpskvaOBA_0ozeW593eBZ2SMgqF6ztZaOtQFgjP7lDPujQ67bQUhjWmTxLFmhnzFsuwSseI1Bid3ipGBCZjtJ9d6JbsHPlli9iP-vdjNGlEnCvnD909Yl2D3aqUOxIC0Y2rXsPeFa_O0eWugc_Uyz77PoY1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="inline-block bg-tertiary/80 backdrop-blur-sm text-on-tertiary px-3 py-1 rounded-full font-label-sm text-sm mb-2">Pengalaman Mendalam</span>
                <h2 className="font-headline-md text-2xl font-semibold">Paket Adventure</h2>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col bg-primary-fixed/10">
              <div className="flex justify-between items-baseline mb-6 border-b border-primary-fixed-dim pb-4">
                <span className="font-headline-lg text-3xl font-bold text-primary">Rp275.000</span>
                <span className="font-body-md text-on-surface-variant">/ orang</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface font-medium">Alat Keamanan Premium & Pemandu Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface font-medium">Makan Siang Lokal Sehat</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface">Paket Dokumentasi Digital</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface">Loker & Ruang Ganti Premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="font-body-md text-on-surface font-medium">Skrining Kesehatan Holistik Lengkap</span>
                </li>
              </ul>
              <button className="w-full bg-primary text-on-primary hover:bg-primary-container py-3 rounded-lg font-label-md transition-colors shadow-md font-bold">Pesan Sekarang</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
