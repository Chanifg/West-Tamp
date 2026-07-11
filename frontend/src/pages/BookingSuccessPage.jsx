import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingRef = searchParams.get("booking_ref");

  useEffect(() => {
    document.title = "Booking Berhasil | Westtamp Wellness";

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Pembayaran berhasil. Terima kasih telah melakukan booking di Westtamp Wellness."
      );
    }
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-24 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-surface-variant p-10 text-center">

          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-green-100 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-green-600">
                check_circle
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-primary mb-4">
            Pembayaran Berhasil 🎉
          </h1>

          <p className="text-on-surface-variant leading-relaxed text-lg mb-8">
            Terima kasih telah melakukan pemesanan di
            <span className="font-semibold text-primary">
              {" "}Westtamp Wellness.
            </span>
            <br />
            Booking Anda telah berhasil dibuat dan sedang diproses.
          </p>

          {/* Booking Reference */}
          <div className="bg-surface rounded-2xl border border-outline-variant p-6 mb-10">
            <p className="text-sm uppercase tracking-widest text-on-surface-variant mb-2">
              Booking Reference
            </p>

            <p className="text-2xl md:text-3xl font-black tracking-wider text-primary break-all">
              {bookingRef || "-"}
            </p>

            <p className="text-sm text-on-surface-variant mt-4">
              Simpan kode booking ini untuk melakukan pengecekan status booking
              atau saat menghubungi customer service.
            </p>
          </div>

          {/* Information */}
          <div className="bg-primary-container/10 border border-primary-container/20 rounded-2xl p-5 mb-10 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">
                info
              </span>

              <div className="space-y-2 text-sm text-on-surface">
                <p>
                  ✅ Invoice dan konfirmasi booking akan dikirim ke email Anda.
                </p>

                <p>
                  ✅ Status booking dapat dilihat kapan saja menggunakan kode booking di atas.
                </p>

                <p>
                  ✅ Silakan datang sesuai jadwal yang telah dipilih.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">

            <Link
              to={`/check-booking?booking_ref=${bookingRef}`}
              className="flex-1"
            >
              <button className="w-full bg-primary-container text-white py-4 rounded-xl font-bold hover:opacity-90 transition active:scale-95 shadow-md">
                Cek Status Booking
              </button>
            </Link>

            <Link
              to="/"
              className="flex-1"
            >
              <button className="w-full border-2 border-primary text-primary py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition active:scale-95">
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