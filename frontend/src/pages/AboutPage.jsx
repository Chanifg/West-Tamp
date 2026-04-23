import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative w-full h-[716px] min-h-[500px] flex items-end pb-12 px-6 max-w-[1280px] mx-auto mt-6 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 z-0">
            <img alt="Hero Background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBreaFy36AzbV9Yys5c3QRjtQbZaJoA7Pt0EP7a94j1sZW5rFLyEiR41-V6ogmOdCvR_EUMlFWoasvW-cwV9SU_bzZmXdSG8C8JDbB3nDtR--Yrq60OaM-q9kYJX872bhsur277iy9V1_TD-5CW-WeSAg_N42OUZqIbMgZmhGwYp7xAedQsLeScNh7cDTTdfajEfsz45zLlLLahvkD3shQ6Ktbpj08CyVMuAB-kayQ82N_vojtI4EWO03O3yyM4NbXh08dYSKygtrb8" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-3xl text-white">
            <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-on-primary mb-3 drop-shadow-md">
              Grounded Vitality: Kisah di Balik Westtamp Wellness
            </h1>
            <p className="font-body-lg text-lg text-inverse-on-surface opacity-90 drop-shadow-sm max-w-2xl">
              Dari sebuah desa yang tenang menjadi destinasi di mana alam menyembuhkan dan petualangan membangkitkan semangat. Ini adalah cerita masyarakat Desa Tampirkulon.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-6 max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-3xl font-semibold text-primary mb-2">Jejak Langkah Kami</h2>
            <div className="w-16 h-1 bg-surface-tint mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface rounded-xl p-8 shadow-[0_4px_24px_rgba(27,67,50,0.08)] border border-surface-variant flex flex-col justify-center">
              <h3 className="font-headline-md text-2xl font-semibold text-primary-container mb-3">Transformasi Menuju Harmoni</h3>
              <p className="font-body-md text-on-surface-variant mb-3">
                Berawal dari inisiatif POKDARWIS setempat, visi sederhana untuk menjaga kebersihan sungai bermetamorfosis menjadi gerakan wellness komunitas. Kami menyadari bahwa aliran air yang jernih di desa kami bukan sekadar pemandangan, melainkan sumber vitalitas.
              </p>
              <p className="font-body-md text-on-surface-variant">
                Melalui semangat "Petualangan Seru & Karya Lokal", kami menata ulang bantaran sungai menjadi ruang di mana adrenalin bertumbuh dan pikiran menemukan ketenangannya kembali.
              </p>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(27,67,50,0.08)] min-h-[300px] relative">
              <img alt="Local Community" className="w-full h-full object-cover absolute inset-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAU3ByM8C5o62kEixKDkOz-nE_WkltUJmma_uvsC2DxGHBK_mQ99aainYQWjXgUmu-xRw5jWP3D6F7uKIfncMCVSVzSoWCPV20G1kjF4LzcIIdmVJ4rviwJmnGtKj3cqSDYEKejUu5Lhk_DZGi-oWJF6xPpD97tE4C-5V-VzS7Wn4VWd7pzOtaFn72QWgJoSApNS614nBFpoIqaa9sHEXsDr9F6i-Or1zhKQU3EgN_QkkTZEIJD_9HP0fQEu381ClObV4akueLwkEP" />
            </div>

            <div className="bg-primary-container text-on-primary rounded-xl p-6 shadow-[0_4px_24px_rgba(27,67,50,0.08)]">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-90" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
              <h4 className="font-headline-md text-xl font-semibold text-on-primary mb-2">Keberlanjutan Alam</h4>
              <p className="font-body-md text-inverse-on-surface opacity-80 text-sm">Menjaga ekosistem sungai tetap murni sebagai warisan generasi mendatang.</p>
            </div>

            <div className="md:col-span-2 relative rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(27,67,50,0.08)] flex items-end p-6 min-h-[250px]">
              <div className="absolute inset-0 z-0">
                <img alt="River Tubing" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWtbu_xSXs4e9MH1xjGCH2sCsuVPYm4n6dhwnwwZiYR4hujR3ZwD1AYWIQw5mzdt1KKgg7nOz8Ymap-OKj5Ej1G8buueAziQ5LhjRJlvKRqkfT4LND1pYDD9YjznmHChsmj7yC4AgUckJHsmAXSPJCB3U0ZzXznY1PC1fkWHR57e8fBSbnoOBDXpmeTj1uOgX32FrMUhxWnpht6o0S141fqPW44b7QpV41DLoDqu3UzDUpRrD1_qxKKLoiDxAaKr1YpFS_OMMOCbRf" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
              </div>
              <div className="relative z-10 w-full text-white">
                <h4 className="font-headline-md text-2xl font-semibold mb-2 drop-shadow-md">Petualangan Seru</h4>
                <p className="font-body-md opacity-90 drop-shadow-md max-w-lg text-sm">River tubing yang aman dan menyenangkan, dirancang untuk menyegarkan kembali tubuh dan pikiran Anda.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Stats */}
        <section className="py-20 px-6 max-w-[1280px] mx-auto">
          <div className="bg-primary text-on-primary rounded-2xl p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-tint rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-container rounded-full opacity-30 blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="font-headline-lg text-3xl font-semibold text-on-primary mb-2">Dampak Nyata</h2>
              <p className="font-body-md text-inverse-primary opacity-90">Bagaimana dukungan Anda membangun Desa Tampirkulon.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div className="text-center">
                <div className="font-headline-xl text-4xl md:text-5xl font-bold text-primary-fixed mb-1">45+</div>
                <div className="font-label-sm text-on-primary opacity-80 uppercase tracking-widest">Pekerjaan Lokal</div>
              </div>
              <div className="text-center">
                <div className="font-headline-xl text-4xl md:text-5xl font-bold text-secondary-fixed mb-1">12</div>
                <div className="font-label-sm text-on-primary opacity-80 uppercase tracking-widest">UMKM Didukung</div>
              </div>
              <div className="text-center">
                <div className="font-headline-xl text-4xl md:text-5xl font-bold text-tertiary-fixed mb-1">2km</div>
                <div className="font-label-sm text-on-primary opacity-80 uppercase tracking-widest">Sungai Direstorasi</div>
              </div>
              <div className="text-center">
                <div className="font-headline-xl text-4xl md:text-5xl font-bold text-primary-fixed-dim mb-1">10k+</div>
                <div className="font-label-sm text-on-primary opacity-80 uppercase tracking-widest">Pengunjung</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
