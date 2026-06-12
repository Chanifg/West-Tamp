<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pemberitahuan Darurat Sesi Tubing</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 8px; background-color: #ffffff; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .header h2 { margin: 0; font-weight: 600; letter-spacing: 1px; }
        .content { padding: 20px; }
        .alert-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .session-info { background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin-bottom: 20px; }
        .session-info table { width: 100%; border-collapse: collapse; }
        .session-info td { padding: 6px 0; }
        .session-info td.label { font-weight: bold; width: 40%; color: #475569; }
        .btn-reschedule { display: inline-block; background-color: #2563eb; color: white !important; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; margin: 15px 0; text-align: center; }
        .footer { text-align: center; margin-top: 25px; font-size: 0.85rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>PEMBERITAHUAN DARURAT</h2>
        </div>
        <div class="content">
            <p>Halo, <strong>{{ $booking->customer_name }}</strong>,</p>
            
            <div class="alert-box">
                <p style="margin: 0; font-weight: bold; color: #991b1b;">INFO DARURAT: Pembatalan Sesi Tubing</p>
                <p style="margin: 5px 0 0 0; color: #7f1d1d;">Mohon maaf, akibat kondisi cuaca buruk (arus Sungai Elo membahayakan), sesi Tubing Anda hari ini DIBATALKAN demi keselamatan.</p>
            </div>

            <p>Berikut adalah detail pesanan Anda yang dibatalkan:</p>
            <div class="session-info">
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
                        <td class="label">Tanggal Sesi Asli</td>
                        <td>{{ \Carbon\Carbon::parse($booking->session->session_date)->format('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Shift / Sesi Asli</td>
                        <td>Sesi {{ ucfirst($booking->session->shift) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Jumlah Tiket</td>
                        <td>{{ $booking->ticket_qty }} Wisatawan</td>
                    </tr>
                </table>
            </div>

            <p>Anda dapat menjadwalkan ulang (reschedule) kedatangan Anda secara mandiri yang berlaku selama <strong>30 hari</strong> terhitung sejak hari ini.</p>
            
            <p style="text-align: center;">
                <a href="{{ $rescheduleUrl }}" class="btn-reschedule" target="_blank">Jadwalkan Ulang Sekarang</a>
            </p>

            <p style="font-size: 0.9rem; color: #475569; word-break: break-all;">
                Jika tombol di atas tidak berfungsi, silakan salin dan buka tautan berikut di peramban Anda:<br>
                <a href="{{ $rescheduleUrl }}">{{ $rescheduleUrl }}</a>
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Westtamp Wellness. All rights reserved.
        </div>
    </div>
</body>
</html>
