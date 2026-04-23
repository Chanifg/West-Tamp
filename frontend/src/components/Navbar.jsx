import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "transition-colors duration-200 active:scale-95 transition-transform ";
    const isActive = location.pathname === path;
    if (isActive) {
      return baseClass + "text-primary-container font-bold border-b-2 border-primary-container pb-1";
    }
    return baseClass + "text-on-surface-variant hover:text-primary-container font-medium";
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-surface-variant shadow-sm">
      <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1280px] mx-auto">
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
        </div>
        <div className="flex gap-4 items-center">
            <Link to="/booking">
              <button className="hidden sm:block bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-label-md font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer shadow-sm">
                  Book Your Escape
              </button>
            </Link>
        </div>
      </div>
    </nav>
  );
}
