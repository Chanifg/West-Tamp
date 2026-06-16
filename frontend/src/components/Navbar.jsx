import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] =
    useState(false);

  const getLinkClass = (path) => {
    const isActive =
      location.pathname === path;

    return `
      transition-all duration-200
      ${
        isActive
          ? 'text-primary-container font-semibold'
          : 'text-on-surface-variant hover:text-primary-container'
      }
    `;
  };

  const getMobileLinkClass = (
    path,
  ) => {
    const isActive =
      location.pathname === path;

    return `
      block px-4 py-3 rounded-xl transition-all
      ${
        isActive
          ? 'bg-primary-container/10 text-primary-container font-semibold'
          : 'text-on-surface-variant hover:bg-surface-container'
      }
    `;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
           
   

            <h1 className="font-black text-xl tracking-tight text-primary-container">
                Westtamp
              </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            

            <Link
              className={getLinkClass(
                '/packages',
              )}
              to="/packages"
            >
              Packages
            </Link>

            <Link
              className={getLinkClass(
                '/blog',
              )}
              to="/blog"
            >
              Blog
            </Link>

            <Link
              className={getLinkClass(
                '/about',
              )}
              to="/about"
            >
              About Us
            </Link>

            {/* Explore Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setExploreOpen(
                    !exploreOpen,
                  )
                }
                className="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors"
              >
                Explore

                <span className="material-symbols-outlined text-[18px]">
                  expand_more
                </span>
              </button>

              {exploreOpen && (
                <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 w-56 overflow-hidden">
                  <Link
                    to="/"
                    className="block px-5 py-3 hover:bg-slate-50"
                  >
                    Destinations
                  </Link>

                  <Link
                    to="/gallery"
                    className="block px-5 py-3 hover:bg-slate-50"
                  >
                    Gallery
                  </Link>

                  <Link
                    to="/facilities"
                    className="block px-5 py-3 hover:bg-slate-50"
                  >
                    Facilities
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            

            <Link to="/booking">
              <button className="bg-primary-container text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer">
                Book your escape
              </button>
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() =>
              setIsOpen(!isOpen)
            }
            className="lg:hidden p-2"
          >
            <span className="material-symbols-outlined">
              {isOpen
                ? 'close'
                : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() =>
            setIsOpen(false)
          }
          className="fixed inset-0 bg-black/40 lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white z-50 shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="mb-8">
            <h2 className="font-black text-xl text-primary-container">
              Westtamp
            </h2>

            <p className="text-sm text-on-surface-variant">
              Wellness Village
            </p>
          </div>

          <div className="space-y-2">
            <Link
              className={getMobileLinkClass(
                '/',
              )}
              to="/"
              onClick={() =>
                setIsOpen(false)
              }
            >
              Destinations
            </Link>

            <Link
              className={getMobileLinkClass(
                '/packages',
              )}
              to="/packages"
              onClick={() =>
                setIsOpen(false)
              }
            >
              Packages
            </Link>

            <Link
              className={getMobileLinkClass(
                '/gallery',
              )}
              to="/gallery"
              onClick={() =>
                setIsOpen(false)
              }
            >
              Gallery
            </Link>

            <Link
              className={getMobileLinkClass(
                '/facilities',
              )}
              to="/facilities"
              onClick={() =>
                setIsOpen(false)
              }
            >
              Facilities
            </Link>

            <Link
              className={getMobileLinkClass(
                '/blog',
              )}
              to="/blog"
              onClick={() =>
                setIsOpen(false)
              }
            >
              Blog
            </Link>

            <Link
              className={getMobileLinkClass(
                '/about',
              )}
              to="/about"
              onClick={() =>
                setIsOpen(false)
              }
            >
              About Us
            </Link>
          </div>

          <div className="mt-10 space-y-3">
            <Link
              to="/booking"
              onClick={() =>
                setIsOpen(false)
              }
            >
              <button className="w-full bg-primary-container text-white py-3 rounded-xl font-semibold">
                Book your escape
              </button>
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-on-surface-variant">
            Desa Wisata Tampirkulon
          </div>
        </div>
      </div>
    </nav>
  );
}