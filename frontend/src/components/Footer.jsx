import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 md:px-12 bg-primary-container z-10 relative">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-1 lg:col-span-2">
          <div className="text-xl font-extrabold text-white mb-4">Westtamp Wellness</div>
          <p className="text-white/80 max-w-md font-body-md">
            Grounded Vitality in Tampirkulon. Dari sebuah desa yang tenang menjadi destinasi di mana alam menyembuhkan dan petualangan membangkitkan semangat.
          </p>
        </div>

        <div>
          <h4 className="font-label-md font-bold text-white mb-4">Eksplorasi</h4>
          <div className="flex flex-col gap-3 font-body-md text-sm">
            <Link to="/" className="text-white/70 hover:text-white transition-colors">Destinations</Link>
            <Link to="/packages" className="text-white/70 hover:text-white transition-colors">Wellness Packages</Link>
            <Link to="/blog" className="text-white/70 hover:text-white transition-colors">Blog & Kabar Lokal</Link>
            <Link to="/gallery" className="text-white/70 hover:text-white transition-colors">Galeri</Link>
            <Link to="/facilities" className="text-white/70 hover:text-white transition-colors">Facilities</Link>
          </div>
        </div>

        <div>
          <h4 className="font-label-md font-bold text-white mb-4">Informasi</h4>
          <div className="flex flex-col gap-3 font-body-md text-sm">
            <Link to="/about" className="text-white/70 hover:text-white transition-colors">Tentang Kami</Link>
            <Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact Us</Link>
            <Link to="/privacy-policy" className="text-white/70 hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms-conditions" className="text-white/70 hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/10 text-center md:text-left">
        <p className="font-label-sm text-xs text-white/60">© {new Date().getFullYear()} Desa Tampirkulon Tourism. All rights reserved.</p>
      </div>
    </footer>
  );
}
