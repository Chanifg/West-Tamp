import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 md:px-12 bg-white border-t border-surface-variant z-10 relative">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-1 lg:col-span-2">
            <div className="text-xl font-extrabold text-primary-container mb-4">Westtamp Wellness</div>
            <p className="text-on-surface-variant opacity-90 max-w-md font-body-md">
                Grounded Vitality in Tampirkulon. Dari sebuah desa yang tenang menjadi destinasi di mana alam menyembuhkan dan petualangan membangkitkan semangat.
            </p>
        </div>
        
        <div>
            <h4 className="font-label-md font-bold text-on-surface mb-4">Eksplorasi</h4>
            <div className="flex flex-col gap-3 font-body-md text-sm">
                <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">Destinations</Link>
                <Link to="/packages" className="text-on-surface-variant hover:text-primary transition-colors">Wellness Packages</Link>
                <Link to="/blog" className="text-on-surface-variant hover:text-primary transition-colors">Blog & Kabar Lokal</Link>
                <Link to="/gallery" className="text-on-surface-variant hover:text-primary transition-colors">Galeri</Link>
                <Link to="/facilities" className="text-on-surface-variant hover:text-primary transition-colors">Facilities</Link>
            </div>
        </div>

        <div>
            <h4 className="font-label-md font-bold text-on-surface mb-4">Informasi</h4>
            <div className="flex flex-col gap-3 font-body-md text-sm">
                <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors">Tentang Kami</Link>
                <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Contact Us</a>
                <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Kebijakan Privasi</a>
                <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Syarat & Ketentuan</a>
            </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-surface-variant text-center md:text-left">
          <p className="font-label-sm text-xs text-on-surface-variant">© {new Date().getFullYear()} Desa Tampirkulon Tourism. All rights reserved.</p>
      </div>
    </footer>
  );
}
