import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RatingPage() {
    const { bookingRef } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [booking, setBooking] = useState(null);

    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    const [review, setReview] = useState('');

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchBooking();
    }, [bookingRef]);

    const fetchBooking = async () => {
        try {
            const response = await client.get(
                `/api/ratings/form/${bookingRef}`
            );

            console.log('RATING RESPONSE', response.data);

            setBooking(response.data.data);
        } catch (error) {
            console.error('FETCH RATING ERROR', error);

            setBooking(null);
        } finally {
            setLoading(false);
        }
    };

    const submitRating = async () => {
        if (rating === 0) {
            alert('Silakan pilih rating terlebih dahulu');
            return;
        }

        try {
            setSubmitting(true);

            await client.post('/api/ratings', {
                booking_ref: bookingRef,
                rating,
                review,
            });

            setSuccess(true);
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                'Gagal mengirim rating'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-4xl">
                    progress_activity
                </span>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-3">
                        Booking Tidak Ditemukan
                    </h1>

                    <p className="text-on-surface-variant">
                        Link rating tidak valid atau sudah tidak tersedia.
                    </p>
                </div>
            </div>
        );
    }

    if (booking.already_rated) {
        return (
            <>

                <Navbar />

                <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">

                    <div className="max-w-2xl text-center">

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black text-primary-container mb-4">
                            Terima Kasih
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl mx-auto">
                            Ulasan Anda telah berhasil kami terima dan akan membantu
                            kami meningkatkan kualitas layanan serta pengalaman wisata
                            yang lebih baik di WestTamp Wellness.
                        </p>

                        {/* Booking Info */}
                        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6 max-w-lg mx-auto shadow-xs">

                            <div className="space-y-4">

                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">
                                        Booking Ref
                                    </span>

                                    <span className="font-semibold">
                                        {booking.booking_ref}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">
                                        Paket
                                    </span>

                                    <span className="font-semibold text-right">
                                        {booking.package_name}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">
                                        Tanggal Kunjungan
                                    </span>

                                    <span className="font-semibold">
                                        {booking.session_date}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Info Box */}
                        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 max-w-lg mx-auto">

                            <div className="flex items-start gap-3 text-left">

                                <span className="material-symbols-outlined text-emerald-600">
                                    lightbulb
                                </span>

                                <p className="text-sm text-emerald-800">
                                    Masukan Anda sangat berharga bagi kami dan akan menjadi
                                    bahan evaluasi untuk meningkatkan pelayanan WestTamp
                                    Wellness di masa mendatang.
                                </p>

                            </div>

                        </div>

                        {/* CTA */}
                        <div className="mt-10">

                            <a
                                href="/"
                                className="inline-flex items-center gap-2 bg-primary-container text-white px-8 py-4 rounded-2xl font-semibold shadow-md hover:opacity-90 transition-all"
                            >
                                <span className="material-symbols-outlined">
                                    home
                                </span>

                                Kembali ke Beranda
                            </a>

                        </div>

                    </div>

                </div>

                <Footer />
            </>

        );
    }

    if (success) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">

                    <div className="w-full max-w-2xl text-center">

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl font-black text-primary-container mb-4">
                            Terima Kasih
                        </h1>

                        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Ulasan Anda telah berhasil kami terima dan akan menjadi
                            bahan evaluasi untuk meningkatkan kualitas layanan
                            serta pengalaman wisata di WestTamp Wellness.
                        </p>

                        {/* Appreciation Card */}
                        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">

                            <div className="flex justify-center mb-5">

                                <div className="flex gap-1">

                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <span
                                            key={item}
                                            className="material-symbols-outlined text-amber-400 !text-[32px]"
                                        >
                                            star
                                        </span>
                                    ))}

                                </div>

                            </div>

                            <h2 className="text-2xl font-bold mb-3">
                                Feedback Anda Sangat Berarti
                            </h2>

                            <p className="text-slate-500 leading-relaxed">
                                Terima kasih telah meluangkan waktu untuk berbagi
                                pengalaman Anda. Setiap masukan dari pengunjung
                                membantu kami menghadirkan pengalaman wisata yang
                                lebih nyaman, aman, dan berkesan.
                            </p>

                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

                            <a
                                href="/"
                                className="
                        bg-primary-container
                        text-white
                        px-8
                        py-4
                        rounded-2xl
                        font-semibold
                        hover:opacity-90
                        transition-all
                    "
                            >
                                Kembali ke Beranda
                            </a>

                            <a
                                href="/packages"
                                className="
                        bg-white
                        border
                        border-slate-200
                        px-8
                        py-4
                        rounded-2xl
                        font-semibold
                        hover:bg-slate-50
                        transition-all
                    "
                            >
                                Lihat Paket Wisata
                            </a>

                        </div>

                    </div>

                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50 py-12 px-4">

                <div className="max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">

                        <div className="w-20 h-20 rounded-full bg-primary-container/10 mx-auto flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-primary-container text-[42px]">
                                kayaking
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-primary-container">
                            Bagaimana Pengalaman Anda?
                        </h1>

                        <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
                            Pendapat Anda sangat berarti untuk membantu kami
                            memberikan pengalaman tubing yang lebih baik.
                        </p>

                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">

                        {/* Booking Info */}
                        <div className="border-b border-slate-100 p-8">

                            <h2 className="text-2xl font-bold mb-2">
                                Halo, {booking.customer_name} 👋
                            </h2>

                            <p className="text-slate-500">
                                Terima kasih telah berkunjung ke WestTamp Wellness.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mt-8">

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-sm text-slate-500 mb-1">
                                        Booking Ref
                                    </p>

                                    <p className="font-semibold">
                                        {booking.booking_ref}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-sm text-slate-500 mb-1">
                                        Paket
                                    </p>

                                    <p className="font-semibold">
                                        {booking.package_name}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-sm text-slate-500 mb-1">
                                        Tanggal
                                    </p>

                                    <p className="font-semibold">
                                        {booking.session_date}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Rating Section */}
                        <div className="p-8">

                            <h3 className="text-xl font-bold text-center mb-2">
                                Berikan Penilaian Anda
                            </h3>

                            <p className="text-center text-slate-500 mb-8">
                                Seberapa puas Anda dengan pengalaman tubing hari ini?
                            </p>

                            <div className="flex justify-center gap-3 mb-6">

                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHovered(star)}
                                        onMouseLeave={() => setHovered(0)}
                                        className="transition-all duration-200 hover:scale-110 active:scale-95"
                                    >
                                        <span
                                            className={`material-symbols-outlined !text-[56px] ${star <= (hovered || rating)
                                                ? 'text-amber-400'
                                                : 'text-slate-300'
                                                }`}
                                        >
                                            star
                                        </span>
                                    </button>
                                ))}

                            </div>

                            <div className="text-center mb-10">

                                {rating === 0 && (
                                    <p className="text-slate-500">
                                        Pilih rating terlebih dahulu
                                    </p>
                                )}

                                {rating === 1 && (
                                    <p className="font-medium text-red-500">
                                        Kurang Memuaskan
                                    </p>
                                )}

                                {rating === 2 && (
                                    <p className="font-medium text-orange-500">
                                        Cukup
                                    </p>
                                )}

                                {rating === 3 && (
                                    <p className="font-medium text-blue-500">
                                        Baik
                                    </p>
                                )}

                                {rating === 4 && (
                                    <p className="font-medium text-green-600">
                                        Sangat Baik
                                    </p>
                                )}

                                {rating === 5 && (
                                    <p className="font-medium text-emerald-600">
                                        Luar Biasa ✨
                                    </p>
                                )}

                            </div>

                            {/* Review */}
                            <div className="mb-8">

                                <label className="block font-semibold mb-3">
                                    Ceritakan pengalaman Anda
                                </label>

                                <textarea
                                    rows={6}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Apa yang paling Anda sukai? Apakah ada saran untuk kami?"
                                    className="
                            w-full
                            border border-slate-200
                            rounded-2xl
                            p-5
                            resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary-container
                            focus:border-transparent
                        "
                                />

                            </div>

                            {/* Submit */}
                            <button
                                onClick={submitRating}
                                disabled={submitting}
                                className="
                        w-full
                        bg-primary-container
                        text-white
                        py-4
                        rounded-2xl
                        font-semibold
                        text-lg
                        hover:opacity-90
                        transition-all
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                            >
                                {submitting
                                    ? 'Mengirim Ulasan...'
                                    : 'Kirim Ulasan'}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}