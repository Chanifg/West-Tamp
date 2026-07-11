import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";

export default function BookingDetailPage() {
  const { booking_ref } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
const navigate = useNavigate();
  const waitPaymentSuccess = () => {
  const interval = setInterval(async () => {
    try {
      const res = await client.get(`/api/bookings/${booking_ref}`);

      if (res.data.payment_status === "success") {
        clearInterval(interval);
        navigate(`/booking-success?booking_ref=${booking_ref}`);
      }

      if (
        res.data.payment_status === "failed" ||
        res.data.payment_status === "expired"
      ) {
        clearInterval(interval);
        loadBooking();
      }
    } catch (error) {
      clearInterval(interval);
      console.error(error);
    }
  }, 3000);
};

  useEffect(() => {
    if (booking_ref) {
      loadBooking();
    }
  }, [booking_ref]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const res = await client.get(`/api/bookings/${booking_ref}`);

      setBooking(res.data);
    } catch (err) {
      toast.error("Booking tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!window.snap) {
      toast.error("Midtrans belum dimuat");
      return;
    }

    window.snap.pay(booking.snap_token, {
  onSuccess: () => {
    toast.success("Pembayaran berhasil");
    waitPaymentSuccess();
  },

  onPending: () => {
    toast.info("Memverifikasi pembayaran...");
    waitPaymentSuccess();
  },

  onError: () => {
    toast.error("Pembayaran gagal");
  },

  onClose: () => {
  toast.success("Popup ditutup");
},
});
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          Booking tidak ditemukan
        </div>
        <Footer />
      </>
    );
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    success: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    expired: "bg-gray-200 text-gray-700",
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-12 py-12">



        <div className="bg-white rounded-xl p-8 shadow-md border border-surface-variant relative overflow-hidden">

          {/* Ribbon Status */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
            <div
              className={`absolute top-4 right-[-36px] w-36 py-1 text-center text-[10px] font-black uppercase tracking-widest text-white rotate-45
          ${booking.payment_status === "success"
                  ? "bg-emerald-600"
                  : booking.payment_status === "pending"
                    ? "bg-amber-500"
                    : booking.payment_status === "expired"
                      ? "bg-gray-600"
                      : "bg-red-600"
                }
        `}
            >
              {booking.payment_status}
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {booking.package?.name}
            </span>

            <h1 className="text-3xl font-bold mt-3">
              Detail Booking
            </h1>

            <p className="text-sm text-on-surface-variant mt-2">
              Ref:
              <span className="font-mono font-bold ml-2">
                {booking.booking_ref}
              </span>
            </p>
          </div>

          {/* Informasi Booking */}
          <div className="grid md:grid-cols-2 gap-5 border-y border-surface-variant/30 py-6">

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Nama
              </p>
              <p className="font-semibold mt-1">
                {booking.customer_name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Email
              </p>
              <p className="font-semibold mt-1">
                {booking.customer_email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                WhatsApp
              </p>
              <p className="font-semibold mt-1">
                {booking.customer_phone}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Paket
              </p>
              <p className="font-semibold mt-1">
                {booking.package?.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Tanggal
              </p>
              <p className="font-semibold mt-1">
                {booking.session?.session_date}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Sesi
              </p>
              <p className="font-semibold mt-1 uppercase">
                {booking.session?.shift}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Jumlah Tiket
              </p>
              <p className="font-semibold mt-1">
                {booking.ticket_qty} Pax
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant">
                Total Pembayaran
              </p>
              <p className="font-bold text-primary mt-1">
                Rp{" "}
                {Number(booking.total_price).toLocaleString("id-ID")}
              </p>
            </div>

          </div>

          {/* Payment Action */}
          {booking.payment_status === "pending" && (
            <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-lg">

              <h3 className="font-bold text-amber-900 mb-2">
                Menunggu Pembayaran
              </h3>

              <p className="text-sm text-amber-800 mb-5">
                Booking Anda berhasil dibuat namun pembayaran belum selesai.
              </p>

              <button
                onClick={handlePay}
                className="bg-amber-600 hover:bg-amber-700 transition text-white font-bold px-6 py-3 rounded-lg"
              >
                Bayar Sekarang
              </button>

            </div>
          )}

          {booking.payment_status === "success" && (
            <div className="mt-8 p-5 bg-emerald-50 border border-emerald-200 rounded-lg">

              <h3 className="font-bold text-emerald-800 mb-2">
                Pembayaran Berhasil
              </h3>

              <p className="text-sm text-emerald-700 mb-5">
                Tiket Anda sudah aktif dan siap digunakan.
              </p>



            </div>
          )}

          {booking.payment_status === "expired" && (
            <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg">

              <h3 className="font-bold text-red-700 mb-2">
                Pembayaran Kedaluwarsa
              </h3>

              <p className="text-sm text-red-600">
                Waktu pembayaran telah habis. Silakan lakukan pemesanan ulang.
              </p>

            </div>
          )}

        </div>

      </main>

      <Footer />
    </>
  );
}