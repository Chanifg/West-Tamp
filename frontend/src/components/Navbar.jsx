import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path) => {
    const baseClass = "transition-colors duration-200 active:scale-95 transition-transform ";
    const isActive = location.pathname === path;
    if (isActive) {
      return baseClass + "text-primary-container font-bold border-b-2 border-primary-container pb-1";
    }
    return baseClass + "text-on-surface-variant hover:text-primary-container font-medium";
  };

  const getMobileLinkClass = (path) => {
    const baseClass = "block py-3 px-4 rounded-xl text-lg transition-all active:scale-98 ";
    const isActive = location.pathname === path;
    if (isActive) {
      return baseClass + "bg-primary-container/10 text-primary-container font-bold border-l-4 border-primary-container";
    }
    return baseClass + "text-on-surface-variant hover:bg-surface-container font-medium";
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-surface-variant shadow-sm">
      <div className="flex justify-between items-center h-20 px-12 md:px-12  mx-auto">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary-container hover:opacity-80 transition-opacity">
          Westtamp Wellness
        </Link>
        <div className="hidden lg:flex gap-8 items-center">
          <Link className={getLinkClass('/')} to="/">Destinations</Link>
          <Link className={getLinkClass('/packages')} to="/packages">Wellness Packages</Link>
          <Link className={getLinkClass('/gallery')} to="/gallery">Gallery</Link>
          <Link className={getLinkClass('/facilities')} to="/facilities">Facilities</Link>
          <Link className={getLinkClass('/blog')} to="/blog">Blog</Link>
          <Link className={getLinkClass('/about')} to="/about">About Us</Link>
          <Link className={getLinkClass('/cek-tiket')} to="/cek-tiket">Cek Tiket</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/booking" className="hidden sm:block">
            <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-label-md font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer shadow-sm">
              Book Your Escape
            </button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-on-surface p-2 rounded-xl hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[28px] notranslate select-none">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-20 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-20 right-0 w-80 h-[calc(100vh-80px)] bg-white border-l border-surface-variant z-50 shadow-xl lg:hidden transform transition-transform duration-300 flex flex-col justify-between p-6 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="space-y-2">
          <Link className={getMobileLinkClass('/')} to="/" onClick={() => setIsOpen(false)}>Destinations</Link>
          <Link className={getMobileLinkClass('/packages')} to="/packages" onClick={() => setIsOpen(false)}>Wellness Packages</Link>
          <Link className={getMobileLinkClass('/gallery')} to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link className={getMobileLinkClass('/facilities')} to="/facilities" onClick={() => setIsOpen(false)}>Facilities</Link>
          <Link className={getMobileLinkClass('/blog')} to="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link className={getMobileLinkClass('/about')} to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link className={getMobileLinkClass('/cek-tiket')} to="/cek-tiket" onClick={() => setIsOpen(false)}>Cek Tiket</Link>
        </div>

        <div className="border-t border-surface-variant pt-6 space-y-4">
          <Link to="/booking" onClick={() => setIsOpen(false)} className="block w-full">
            <button className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer text-center shadow-md">
              Book Your Escape
            </button>
          </Link>
          <p className="text-center text-xs text-on-surface-variant font-medium">Desa Wisata Tampirkulon</p>
        </div>
      </div>
    </nav>
  );
}
