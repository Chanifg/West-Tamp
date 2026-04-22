import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-surface-variant shadow-sm">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1280px] mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary-container">
            Westtamp Wellness
          </div>
          <div className="hidden md:flex gap-8">
            <a className="text-primary-container font-bold border-b-2 border-primary-container pb-1 hover:text-primary-container transition-colors duration-200 active:scale-95 transition-transform" href="#">Destinations</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors duration-200 active:scale-95 transition-transform" href="#">Wellness Packages</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors duration-200 active:scale-95 transition-transform" href="#">River Tubing</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors duration-200 active:scale-95 transition-transform" href="#">Facilities</a>
          </div>
          <Link to="/booking">
            <button className="hidden md:block bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-label-md font-bold hover:bg-primary transition-colors active:scale-95 cursor-pointer">
              Book Your Escape
            </button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="River tubing scenery" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOV8Fkil5gWn5WomVc0jKUkQHDc8RObXooZsrAws6uo_eHX0YyP3JeaLcQ1IkJbNUys7DUp-QhUW80UyOFzM0GkoH4QwaDK4Ez8k7fB1WMxnzO46WfgkDLhHz0o__H0hYRpcg3RSrvDntGoHkL4Z-wZh7sgvg0L8dje628nV-qlqkGv0b-TJwyItSFHUE993Wg31-Jn6i1lZ0s0a71VRNjznmn6QHkjQDZd31p7JoGc4AVTRxzpbGjTGqDXg15KeCd530DS7_7KXnr"/>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20"></div>
          </div>
          
          <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full text-center mt-20">
            <span className="inline-block px-4 py-2 bg-primary-container text-on-primary-container rounded-full font-label-sm font-bold tracking-wider uppercase mb-6 shadow-lg backdrop-blur-sm bg-opacity-90">
              Wellness-tourism di Desa Tampirkulon
            </span>
            <h1 className="font-headline-xl text-[48px] font-bold text-on-primary drop-shadow-xl mb-6 max-w-4xl mx-auto leading-tight">
              Westtamp Wellness: <br/> Petualangan Seru & Karya Lokal
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/booking">
                <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-md font-bold shadow-xl hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer">
                  Book Your Escape
                </button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-surface-variant shadow-[0_8px_30px_rgb(27,67,50,0.12)]">
                <div className="font-headline-lg text-[32px] font-semibold text-primary mb-1">1000+</div>
                <div className="font-label-sm text-on-surface-variant">Happy Visitors</div>
              </div>
              <div className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-surface-variant shadow-[0_8px_30px_rgb(27,67,50,0.12)]">
                <div className="font-headline-lg text-[32px] font-semibold text-primary mb-1">4.9</div>
                <div className="font-label-sm text-on-surface-variant">Average Rating</div>
              </div>
              <div className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-surface-variant shadow-[0_8px_30px_rgb(27,67,50,0.12)]">
                <div className="font-headline-lg text-[32px] font-semibold text-primary mb-1">100%</div>
                <div className="font-label-sm text-on-surface-variant">Safety Record</div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-xl text-[32px] font-semibold text-primary mb-4">Pilar Fasilitas Kami</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">Kami mengutamakan keselamatan, kesehatan, dan kenyamanan Anda selama menikmati wisata alam di Desa Tampirkulon.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container mb-6">Tubing</div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Keamanan Tubing</h3>
              <p className="font-body-md text-on-surface-variant">Perlengkapan safety gear standar internasional dan pemandu tersertifikasi.</p>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-error-container rounded-xl flex items-center justify-center text-on-error-container mb-6">Medis</div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Fasilitas Kesehatan</h3>
              <p className="font-body-md text-on-surface-variant">Layanan free checkup tekanan darah tinggi, bb, dan tinggi badan di lokasi.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center text-on-tertiary-fixed mb-6">Makan</div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Konsumsi Sehat</h3>
              <p className="font-body-md text-on-surface-variant">Sajian hidangan bakso ikan lele bergizi dan minuman jahe telang hangat.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center text-on-primary-fixed mb-6">Fasilitas</div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Kenyamanan Publik</h3>
              <p className="font-body-md text-on-surface-variant">Area parkir luas, loker penyimpanan barang, dan musala.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-16 px-6 md:px-12 bg-white border-t border-surface-variant">
        <div className="text-center">
            <div className="text-xl font-extrabold text-primary-container mb-4">Westtamp Wellness</div>
            <p className="text-xs text-on-surface-variant">© 2024 Desa Tampirkulon Tourism. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
