import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
    setExploreOpen(false);
  }, [location.pathname]);

  // Disable scroll ketika sidebar terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Klik luar dropdown
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setExploreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const getLinkClass = (path) => {
    const active = location.pathname === path;

    return `transition-colors duration-200 ${active
        ? "text-primary-container font-semibold"
        : "text-gray-700 hover:text-primary-container"
      }`;
  };

  const getMobileLinkClass = (path) => {
    const active = location.pathname === path;

    return `block rounded-xl px-4 py-3 transition ${active
        ? "bg-primary-container/10 text-primary-container font-semibold"
        : "hover:bg-slate-100 text-gray-700"
      }`;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="h-16 md:h-20 flex justify-between items-center">
            {/* Logo */}

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <h1 className="font-black text-xl md:text-2xl text-primary-container">
                Westtamp
              </h1>
            </Link>

            {/* Desktop Menu */}

            <div className="hidden lg:flex items-center gap-8">
              <Link
                to="/packages"
                className={getLinkClass("/packages")}
              >
                Packages
              </Link>

              <Link
                to="/blog"
                className={getLinkClass("/blog")}
              >
                Blog
              </Link>

              <Link
                to="/about"
                className={getLinkClass("/about")}
              >
                About Us
              </Link>

              {/* Dropdown */}

              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() =>
                    setExploreOpen(!exploreOpen)
                  }
                  className="flex items-center gap-1 hover:text-primary-container transition"
                >
                  Explore

                  <span className="material-symbols-outlined text-lg">
                    expand_more
                  </span>
                </button>

                <div
                  className={`absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 ${exploreOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                    }`}
                >
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
              </div>
            </div>

            {/* Desktop Button */}

            <div className="hidden lg:block">
              <Link to="/check-booking">
              <button className="px-5 py-3 mr-2 rounded-full border border-primary-container text-primary-container font-semibold hover:bg-primary-container hover:text-white transition">
                Check Booking
              </button>
            </Link>
              <Link to="/booking">
                <button className="bg-primary-container text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition cursor-pointer">
                  Book your escape
                </button>
              </Link>
            </div>

            {/* Burger */}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden rounded-lg p-2 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-3xl">
                {isOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 lg:hidden ${isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }`}
      />

      {/* Sidebar */}

      <aside
        className={`fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 lg:hidden ${isOpen
            ? "translate-x-0"
            : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}

          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-black text-2xl text-primary-container">
                Westtamp
              </h2>

              <p className="text-sm text-gray-500">
                Wellness Village
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-3xl">
                close
              </span>
            </button>
          </div>

          {/* Menu */}

          <div className="mt-10 flex flex-col gap-2">
            <Link
              to="/"
              className={getMobileLinkClass("/")}
            >
              Destinations
            </Link>

            <Link
              to="/packages"
              className={getMobileLinkClass(
                "/packages"
              )}
            >
              Packages
            </Link>

            <Link
              to="/gallery"
              className={getMobileLinkClass(
                "/gallery"
              )}
            >
              Gallery
            </Link>

            <Link
              to="/facilities"
              className={getMobileLinkClass(
                "/facilities"
              )}
            >
              Facilities
            </Link>

            <Link
              to="/blog"
              className={getMobileLinkClass("/blog")}
            >
              Blog
            </Link>

            <Link
              to="/about"
              className={getMobileLinkClass(
                "/about"
              )}
            >
              About Us
            </Link>
          </div>

          {/* Bottom */}

          <div className="mt-auto flex gap-4 flex-col">
            <Link to="/check-booking">
              <button className="px-5 py-3 rounded-full border border-primary-container text-primary-container font-semibold hover:bg-primary-container hover:text-white transition">
                Check Booking
              </button>
            </Link>
            <Link to="/booking">
              <button className="w-full bg-primary-container text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
                Book your escape
              </button>
            </Link>

            <p className="text-center text-xs text-gray-500 mt-6">
              Desa Wisata Tampirkulon
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}