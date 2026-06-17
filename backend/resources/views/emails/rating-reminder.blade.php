<!DOCTYPE html>
<html>
<body style="background:#f5f5f5;padding:30px;font-family:Arial,sans-serif;">

<div
    style="
        max-width:700px;
        margin:auto;
        background:white;
        border-radius:12px;
        overflow:hidden;
        border:1px solid #e5e7eb;
    "
>

    <div
        style="
            background:#065f46;
            color:white;
            text-align:center;
            padding:30px;
        "
    >
        <h1>
            ⭐ Bagikan Pengalaman Anda
        </h1>

        <p>
            WestTamp Wellness
        </p>
    </div>

    <div style="padding:35px;">

        <p>
            Halo,
            <strong>{{ $booking->customer_name }}</strong> 👋
        </p>

        <p>
            Terima kasih telah menikmati pengalaman River Tubing bersama kami.
        </p>

        <div
            style="
                background:#f8fafc;
                padding:18px;
                border-radius:8px;
                margin:20px 0;
            "
        >
            <strong>Kode Booking:</strong>
            {{ $booking->booking_ref }}
        </div>

        <div style="text-align:center;margin:30px 0;">

            <div style="font-size:34px;">
                ⭐⭐⭐⭐⭐
            </div>

            <p>
                Bagaimana pengalaman Anda bersama kami?
            </p>

            <a
                href="{{ $ratingUrl }}"
                style="
                    background:#065f46;
                    color:white;
                    padding:14px 24px;
                    border-radius:8px;
                    text-decoration:none;
                    display:inline-block;
                    font-weight:bold;
                "
            >
                Beri Rating Sekarang
            </a>

        </div>

        <p>
            Pengisian hanya membutuhkan kurang dari 1 menit.
        </p>

        <hr style="margin:30px 0;">

        <p>
            Salam hangat,<br>
            <strong>Tim WestTamp Wellness</strong>
        </p>

    </div>

</div>

</body>
</html>