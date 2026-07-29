import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";

export default function BookingSuccessPage() {
  const { booking_ref } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    document.title = "Booking Success | Westtamp Tubing";

    client
      .get(`/api/bookings/${booking_ref}`)
      .then((res) => {
        setBooking(res.data);
      })
      .catch(() => {
        toast.error("Gagal memuat detail booking.");
      })
      .finally(() => setLoading(false));
  }, [booking_ref]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 text-slate-500">
              Memuat detail booking...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Booking tidak ditemukan
            </h1>

            <Link
              to="/"
              className="mt-6 inline-block bg-primary-container text-white px-6 py-3 rounded-lg"
            >
              Kembali ke Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const whatsappNumber = "6285727163035"; // Ganti nomor admin

  const message = `Halo Admin Westtamp Tubing.

Saya telah berhasil melakukan pembayaran.

========================

Kode Booking : ${booking.booking_ref}

Nama : ${booking.customer_name}

Paket : ${booking.package?.name}

Tanggal : ${booking.session.session_date}

Sesi : ${booking.session?.shift}

Jumlah Peserta : ${booking.ticket_qty} Orang

Total Pembayaran :
Rp${Number(booking.total_price).toLocaleString("id-ID")}

========================

Mohon dilakukan konfirmasi booking saya.

Terima kasih.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-16 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="bg-white rounded-3xl shadow-lg p-10">

            <div className="flex justify-center">

              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">

                <span className="material-symbols-outlined text-green-600 text-6xl">
                  check_circle
                </span>

              </div>

            </div>

            <h1 className="text-4xl font-bold text-center mt-6 text-primary">
              Pembuatan Booking Berhasil
            </h1>

            <p className="text-center text-slate-500 mt-3">
              Terima kasih telah melakukan pemesanan.
              Booking Anda telah berhasil dibuat.
            </p>

            <div className="mt-10 border rounded-xl overflow-hidden">

              <div className="grid grid-cols-2 border-b p-4">

                <span className="text-slate-500">
                  Kode Booking
                </span>

                <span className="font-semibold text-right">
                  {booking.booking_ref}
                </span>

              </div>

              <div className="grid grid-cols-2 border-b p-4">

                <span className="text-slate-500">
                  Nama
                </span>

                <span className="text-right">
                  {booking.customer_name}
                </span>

              </div>

              <div className="grid grid-cols-2 border-b p-4">

                <span className="text-slate-500">
                  Paket
                </span>

                <span className="text-right">
                  {booking.package?.name}
                </span>

              </div>

              <div className="grid grid-cols-2 border-b p-4">

                <span className="text-slate-500">
                  Tanggal
                </span>

                <span className="text-right">
                  {booking.session.session_date}
                </span>

              </div>

              <div className="grid grid-cols-2 border-b p-4">

                <span className="text-slate-500">
                  Sesi
                </span>

                <span className="text-right">
                  {booking.session?.shift}
                </span>

              </div>

              <div className="grid grid-cols-2 border-b p-4">

                <span className="text-slate-500">
                  Jumlah Peserta
                </span>

                <span className="text-right">
                  {booking.ticket_qty} Orang
                </span>

              </div>

              <div className="grid grid-cols-2 p-4">

                <span className="text-slate-500">
                  Total Pembayaran
                </span>

                <span className="text-right font-bold text-xl text-primary">
                  Rp
                  {Number(booking.total_price).toLocaleString(
                    "id-ID"
                  )}
                </span>

              </div>

            </div>

            <div className="mt-10 rounded-xl bg-blue-50 border border-blue-200 p-5">

              <div className="flex gap-3">

                <span className="material-symbols-outlined text-blue-600">
                  info
                </span>

                <p className="text-sm leading-7 text-slate-700">
                  Silakan klik tombol di bawah untuk mengirim
                  konfirmasi dan pembayaran kepada Admin melalui WhatsApp.
                </p>

              </div>

            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold"
            >

              <span className="material-symbols-outlined">
                chat
              </span>

              Konfirmasi via WhatsApp

            </a>

            <Link
              to="/"
              className="mt-4 block w-full border border-slate-300 py-4 rounded-xl text-center hover:bg-slate-100 transition"
            >
              Kembali ke Beranda
            </Link>

          </div>

        </div>
      </main>
    </>
  );
}