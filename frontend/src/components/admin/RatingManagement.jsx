import React, { useEffect, useMemo, useState } from 'react';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function RatingManagement() {

    const toast = useToast();

    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchRatings();
    }, []);

    const fetchRatings = async () => {

        try {

            const response =
                await client.get('/api/admin/ratings');

            setRatings(response.data);

        } catch (err) {

            console.error(err);

            toast.error(
                'Gagal memuat data rating'
            );

        } finally {

            setLoading(false);

        }

    };

    const publishRating = async (id) => {

        try {

            await client.put(
                `/api/admin/ratings/${id}/publish`
            );

            toast.success(
                'Testimoni berhasil dipublish'
            );

            fetchRatings();

            if (
                selectedReview &&
                selectedReview.id === id
            ) {
                setSelectedReview({
                    ...selectedReview,
                    is_published: true
                });
            }

        } catch (err) {

            console.error(err);

            toast.error(
                'Gagal publish testimonial'
            );

        }

    };

    const unpublishRating = async (id) => {

        try {

            await client.put(
                `/api/admin/ratings/${id}/unpublish`
            );

            toast.success(
                'Testimoni berhasil di-unpublish'
            );

            fetchRatings();

            if (
                selectedReview &&
                selectedReview.id === id
            ) {
                setSelectedReview({
                    ...selectedReview,
                    is_published: false
                });
            }

        } catch (err) {

            console.error(err);

            toast.error(
                'Gagal unpublish testimonial'
            );

        }

    };

    const filteredRatings = useMemo(() => {

        return ratings.filter((rating) => {

            const customer =
                rating.booking?.customer_name?.toLowerCase() || '';

            const bookingRef =
                rating.booking?.booking_ref?.toLowerCase() || '';

            const keyword =
                search.toLowerCase();

            const matchesSearch =
                customer.includes(keyword) ||
                bookingRef.includes(keyword);

            const matchesFilter =
                filter === 'all'
                    ? true
                    : filter === 'published'
                        ? rating.is_published
                        : !rating.is_published;

            return matchesSearch && matchesFilter;

        });

    }, [ratings, search, filter]);

    const totalReviews = ratings.length;

    const totalPublished =
        ratings.filter(
            item => item.is_published
        ).length;

    const totalPending =
        ratings.filter(
            item => !item.is_published
        ).length;

    const averageRating =
        ratings.length > 0
            ? (
                ratings.reduce(
                    (sum, item) =>
                        sum + item.rating,
                    0
                ) / ratings.length
            ).toFixed(1)
            : 0;

    if (loading) {

        return (

            <div className="
                bg-white
                rounded-xl
                p-8
                shadow-sm
                border
                border-surface-variant
            ">
                <div className="flex items-center gap-3">

                    <span className="material-symbols-outlined animate-spin">
                        progress_activity
                    </span>

                    <span>
                        Memuat data rating...
                    </span>

                </div>
            </div>

        );

    }

    return (

        <div className="w-full">

            {/* Header */}
            <header className="mb-8">

                <h1 className="
                    font-headline-lg
                    text-3xl
                    font-bold
                    text-on-surface
                    mb-2
                ">
                    Ratings & Reviews
                </h1>

                <p className="text-on-surface-variant">
                    Kelola rating dan testimoni pelanggan
                    WestTamp Wellness.
                </p>

            </header>

            {/* Summary */}
            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
                gap-6
                mb-8
            ">

                <div className="
                    bg-white
                    rounded-xl
                    p-6
                    border
                    border-surface-variant
                    shadow-sm
                ">
                    <p className="text-sm text-on-surface-variant">
                        Total Reviews
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {totalReviews}
                    </h2>
                </div>

                <div className="
                    bg-white
                    rounded-xl
                    p-6
                    border
                    border-surface-variant
                    shadow-sm
                ">
                    <p className="text-sm text-on-surface-variant">
                        Average Rating
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-amber-500
                    ">
                        {averageRating}
                    </h2>
                </div>

                <div className="
                    bg-white
                    rounded-xl
                    p-6
                    border
                    border-surface-variant
                    shadow-sm
                ">
                    <p className="text-sm text-on-surface-variant">
                        Published
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-green-600
                    ">
                        {totalPublished}
                    </h2>
                </div>

                <div className="
                    bg-white
                    rounded-xl
                    p-6
                    border
                    border-surface-variant
                    shadow-sm
                ">
                    <p className="text-sm text-on-surface-variant">
                        Pending
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-amber-500
                    ">
                        {totalPending}
                    </h2>
                </div>

            </div>

            {/* Search & Filter */}
            <div className="
                bg-white
                rounded-xl
                p-4
                border
                border-surface-variant
                shadow-sm
                mb-6
            ">

                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    gap-4
                ">

                    <div className="relative flex-1">

                        <span className="
                            material-symbols-outlined
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-on-surface-variant
                        ">
                            search
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Cari customer atau booking reference..."
                            className="
                                w-full
                                pl-12
                                pr-4
                                py-3
                                rounded-xl
                                border
                                border-surface-variant
                                bg-surface
                                focus:outline-none
                            "
                        />

                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={() =>
                                setFilter('all')
                            }
                            className={`
                                px-4 py-3 rounded-xl font-medium
                                ${filter === 'all'
                                    ? 'bg-primary-container text-white'
                                    : 'bg-surface'
                                }
                            `}
                        >
                            All
                        </button>

                        <button
                            onClick={() =>
                                setFilter('pending')
                            }
                            className={`
                                px-4 py-3 rounded-xl font-medium
                                ${filter === 'pending'
                                    ? 'bg-primary-container text-white'
                                    : 'bg-surface'
                                }
                            `}
                        >
                            Pending
                        </button>

                        <button
                            onClick={() =>
                                setFilter('published')
                            }
                            className={`
                                px-4 py-3 rounded-xl font-medium
                                ${filter === 'published'
                                    ? 'bg-primary-container text-white'
                                    : 'bg-surface'
                                }
                            `}
                        >
                            Published
                        </button>

                    </div>

                </div>

            </div>

            {/* Empty */}
            {filteredRatings.length === 0 && (

                <div className="
                    bg-white
                    rounded-xl
                    p-12
                    border
                    border-surface-variant
                    shadow-sm
                    text-center
                ">

                    <div className="
                        w-16 h-16
                        rounded-full
                        bg-surface
                        mx-auto
                        flex
                        items-center
                        justify-center
                        mb-4
                    ">
                        <span className="
                            material-symbols-outlined
                            text-3xl
                            text-on-surface-variant
                        ">
                            reviews
                        </span>
                    </div>

                    <h3 className="
                        text-xl
                        font-bold
                        mb-2
                    ">
                        Tidak ada data rating
                    </h3>

                    <p className="text-on-surface-variant">
                        Belum ada data yang sesuai
                        dengan pencarian.
                    </p>

                </div>

            )}

            {/* Table */}
            {filteredRatings.length > 0 && (

                <div className="
                    bg-white
                    rounded-xl
                    border
                    border-surface-variant
                    shadow-sm
                    overflow-hidden
                ">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="
                                    bg-surface
                                    border-b
                                    border-surface-variant
                                ">

                                    <th className="px-6 py-4 text-left">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Rating
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Tanggal
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredRatings.map((rating) => (

                                    <tr
                                        key={rating.id}
                                        className="
                                            border-b
                                            border-surface-variant/50
                                            hover:bg-surface/40
                                        "
                                    >

                                        <td className="px-6 py-4">

                                            <p className="font-semibold">
                                                {
                                                    rating.booking
                                                        ?.customer_name
                                                }
                                            </p>

                                            <p className="
                                                text-xs
                                                text-on-surface-variant
                                            ">
                                                {
                                                    rating.booking
                                                        ?.booking_ref
                                                }
                                            </p>

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="flex">

                                                {[1, 2, 3, 4, 5].map((star) => (

                                                    <span
                                                        key={star}
                                                        className={`material-symbols-outlined ${star <= rating.rating
                                                                ? 'text-amber-400'
                                                                : 'text-slate-300'
                                                            }`}
                                                    >
                                                        star
                                                    </span>

                                                ))}

                                            </div>

                                        </td>

                                        <td className="px-6 py-4">

                                            {rating.is_published ? (

                                                <span className="
                                                    bg-green-100
                                                    text-green-700
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-medium
                                                ">
                                                    Published
                                                </span>

                                            ) : (

                                                <span className="
                                                    bg-amber-100
                                                    text-amber-700
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-medium
                                                ">
                                                    Pending
                                                </span>

                                            )}

                                        </td>

                                        <td className="
                                            px-6
                                            py-4
                                            text-sm
                                            text-on-surface-variant
                                        ">

                                            {new Date(
                                                rating.created_at
                                            ).toLocaleDateString(
                                                'id-ID'
                                            )}

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="
                                                flex
                                                justify-end
                                                gap-2
                                            ">

                                                <button
                                                    onClick={() =>
                                                        setSelectedReview(
                                                            rating
                                                        )
                                                    }
                                                    className="
                                                        w-9
                                                        h-9
                                                        rounded-lg
                                                        hover:bg-surface
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    <span className="material-symbols-outlined">
                                                        visibility
                                                    </span>
                                                </button>

                                                {rating.is_published ? (<button onClick={() => unpublishRating(rating.id)} className=" w-9 h-9 rounded-lg hover:bg-red-100 text-red-600 flex items-center justify-center " title="Unpublish" > <span className="material-symbols-outlined"> unpublished </span> </button>) : (<button onClick={() => publishRating(rating.id)} className=" w-9 h-9 rounded-lg hover:bg-green-100 text-green-600 flex items-center justify-center " title="Publish" > <span className="material-symbols-outlined"> publish </span> </button>)}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

            {/* Modal */}
            {selectedReview && (

                <div className="
                    fixed
                    inset-0
                    bg-black/50
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                ">

                    <div className="
                        bg-white
                        rounded-2xl
                        w-full
                        max-w-lg
                        p-6
                    ">

                        <div className="
                            flex
                            justify-between
                            items-start
                            mb-6
                        ">

                            <div>

                                <h3 className="
                                    text-xl
                                    font-bold
                                ">
                                    {
                                        selectedReview.booking
                                            ?.customer_name
                                    }
                                </h3>

                                <p className="
                                    text-on-surface-variant
                                ">
                                    {
                                        selectedReview.booking
                                            ?.booking_ref
                                    }
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedReview(
                                        null
                                    )
                                }
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>

                        </div>

                        <div className="
                            flex
                            mb-5
                        ">

                            {[1, 2, 3, 4, 5].map((star) => (

                                <span
                                    key={star}
                                    className={`material-symbols-outlined ${star <= selectedReview.rating
                                            ? 'text-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                >
                                    star
                                </span>

                            ))}

                        </div>

                        <div className="
                            bg-surface
                            rounded-xl
                            p-4
                        ">

                            <p className="leading-relaxed">
                                {
                                    selectedReview.review ||
                                    'Tidak ada komentar.'
                                }
                            </p>

                        </div>

                        {selectedReview.is_published ? ( <button onClick={() => unpublishRating( selectedReview.id ) } className=" w-full mt-5 bg-red-600 text-white py-3 rounded-xl font-semibold " > Unpublish Testimonial </button> ) : ( <button onClick={() => publishRating( selectedReview.id ) } className=" w-full mt-5 bg-primary-container text-white py-3 rounded-xl font-semibold " > Publish Testimonial </button> )}

                    </div>

                </div>

            )}

        </div>

    );

}