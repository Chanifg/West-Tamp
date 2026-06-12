<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>E-Ticket Westtamp Wellness</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; }
        .header { background-color: #0d9488; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .header h2 { margin: 0; font-weight: 600; letter-spacing: 1px; }
        .content { padding: 20px; }
        .ticket-info { background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 15px; margin-bottom: 20px; }
        .ticket-info table { width: 100%; border-collapse: collapse; }
        .ticket-info td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .ticket-info tr:last-child td { border-bottom: none; }
        .ticket-info td.label { font-weight: bold; width: 40%; color: #475569; }
        .qr-section { text-align: center; margin-top: 20px; padding: 20px; background: #f1f5f9; border-radius: 6px; }
        .qr-code { font-family: monospace; font-size: 1.25rem; font-weight: bold; background: white; padding: 12px 24px; border: 2px solid #cbd5e1; display: inline-block; letter-spacing: 2px; border-radius: 4px; color: #0f172a; }
        .footer { text-align: center; margin-top: 25px; font-size: 0.85rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>E-TICKET TUBING</h2>
        </div>
        <div class="content">
            <p>Halo, <strong>{{ $booking->customer_name }}</strong>,</p>
            <p>Terima kasih telah melakukan pemesanan di Westtamp Wellness. Pembayaran Anda telah kami terima dan berikut adalah e-ticket resmi Anda:</p>
            
            <div class="ticket-info">
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
                        <td class="label">Shift / Sesi</td>
                        <td>Sesi {{ ucfirst($booking->session->shift) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Jumlah Tiket</td>
                        <td>{{ $booking->ticket_qty }} Wisatawan</td>
                    </tr>
                    <tr>
                        <td class="label">Total Pembayaran</td>
                        <td>Rp {{ number_format($booking->total_price, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </div>

            <div class="qr-section">
                <p style="margin-top: 0; font-weight: bold; color: #1e293b;">QR Code Verifikasi Tiket:</p>
                <div class="qr-code">{{ $booking->qr_code }}</div>
                <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0; margin-top: 10px;">Tunjukkan kode ini kepada petugas saat tiba di lokasi tubing.</p>
            </div>
            
            <p style="margin-top: 20px;">Harap tiba di lokasi 30 menit sebelum sesi dimulai. Jangan ragu menghubungi CS kami jika ada pertanyaan.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Westtamp Wellness. All rights reserved.
        </div>
    </div>
</body>
</html>
