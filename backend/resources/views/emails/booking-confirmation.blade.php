
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Konfirmasi Booking Westtamp Wellness</title>

    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
        }

        .button-container {
    margin-top: 30px;
    text-align: center;
}

.btn-payment {
    display: inline-block;
    background: #0d9488;
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 15px;
}

.btn-payment:hover {
    background: #0f766e;
}

.small-text {
    margin-top: 12px;
    font-size: 13px;
    color: #64748b;
}

        .header {
            background: #0d9488;
            color: white;
            text-align: center;
            padding: 24px;
        }

        .header h2 {
            margin: 0;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .content {
            padding: 24px;
        }

        .alert {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            color: #92400e;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }

        .booking-info {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            padding: 16px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        tr:last-child td {
            border-bottom: none;
        }

        td.label {
            width: 40%;
            font-weight: bold;
            color: #475569;
        }

        .payment-box {
            margin-top: 24px;
            padding: 20px;
            border-radius: 8px;
            background: #ecfeff;
            border: 1px solid #99f6e4;
            text-align: center;
        }

        .status {
            display: inline-block;
            background: #f59e0b;
            color: white;
            padding: 8px 18px;
            border-radius: 999px;
            font-weight: bold;
            margin-bottom: 12px;
        }

        .footer {
            text-align: center;
            font-size: .85rem;
            color: #64748b;
            padding: 20px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="header">
        <h2>KONFIRMASI BOOKING</h2>
    </div>

    <div class="content">

        <p>Halo <strong>{{ $booking->customer_name }}</strong>,</p>

        <p>
            Terima kasih telah melakukan pemesanan di <strong>Westtamp Wellness</strong>.
            Booking Anda telah berhasil dibuat dan saat ini sedang menunggu pembayaran.
        </p>

        <div class="alert">
            <strong>Booking berhasil dibuat.</strong><br>
            Silakan selesaikan pembayaran maksimal sebelum
            <strong>{{ \Carbon\Carbon::parse($booking->expired_at)->format('d F Y H:i') }}</strong>.
            Apabila melewati batas waktu tersebut, booking akan otomatis dibatalkan.
        </div>

        <div class="booking-info">

            <table>

                <tr>
                    <td class="label">Kode Booking</td>
                    <td><strong>{{ $booking->booking_ref }}</strong></td>
                </tr>

                <tr>
                    <td class="label">Paket Tubing</td>
                    <td>{{ $booking->package->name }}</td>
                </tr>

                <tr>
                    <td class="label">Tanggal Sesi</td>
                    <td>{{ \Carbon\Carbon::parse($booking->session->session_date)->format('d F Y') }}</td>
                </tr>

                <tr>
                    <td class="label">Shift</td>
                    <td>Sesi {{ ucfirst($booking->session->shift) }}</td>
                </tr>

                <tr>
                    <td class="label">Jumlah Tiket</td>
                    <td>{{ $booking->ticket_qty }} Wisatawan</td>
                </tr>

                <tr>
                    <td class="label">Total Pembayaran</td>
                    <td>Rp {{ number_format($booking->total_price,0,',','.') }}</td>
                </tr>

            </table>

        </div>

        @php
    $paymentUrl = config('app.frontend_url') . '/booking-detail/' . $booking->booking_ref;
@endphp

        

        <p>
            Terima kasih telah memilih <strong>Westtamp Wellness</strong>.
            Kami tunggu kedatangan Anda.
        </p>

    </div>

    <div class="button-container">

    <a href="{{ $paymentUrl }}" class="btn-payment">
        Continue to Payment
    </a>

    <div class="small-text">
        Atau salin tautan berikut jika tombol tidak dapat diklik:
        <br>
        <a href="{{ $paymentUrl }}">
            {{ $paymentUrl }}
        </a>
    </div>

</div>

    <div class="footer">
        © {{ date('Y') }} Westtamp Wellness. All rights reserved.
    </div>

</div>

</body>

</html>
