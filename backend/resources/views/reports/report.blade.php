<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Keuangan Westtamp Tubing</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 11px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            color: #0d9488;
        }
        .header p {
            margin: 4px 0 0 0;
            font-size: 10px;
            color: #666;
        }
        .title-section {
            margin-bottom: 20px;
        }
        .title-section h2 {
            margin: 0 0 8px 0;
            font-size: 16px;
            text-transform: uppercase;
        }
        .metadata {
            margin-bottom: 20px;
            font-size: 11px;
        }
        .metadata table {
            width: 100%;
        }
        .metadata td {
            padding: 3px 0;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .data-table th, .data-table td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        .data-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .summary-box {
            background-color: #f0fdfa;
            border: 1px solid #99f6e4;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 25px;
        }
        .summary-box h3 {
            margin: 0 0 8px 0;
            font-size: 13px;
            color: #0f766e;
        }
        .summary-box table {
            width: 100%;
        }
        .summary-box td {
            padding: 4px 0;
            font-size: 11px;
        }
        .summary-box .highlight {
            font-size: 14px;
            font-weight: bold;
            color: #0d9488;
        }
        .grid {
            width: 100%;
            margin-bottom: 20px;
        }
        .grid td {
            vertical-align: top;
            width: 50%;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>WESTTAMP WELLNESS & RIVER TUBING</h1>
        <p>Desa Wisata Tampirkulon, Kec. Candimulyo, Kabupaten Magelang, Jawa Tengah</p>
        <p>Email: pokdarwis@westtamp.com | Telp: +62 812-3456-7890</p>
    </div>

    <div class="title-section">
        <h2>Laporan Pendapatan Keuangan</h2>
        <div class="metadata">
            <table>
                <tr>
                    <td style="width: 120px;"><strong>Periode Laporan:</strong></td>
                    <td>{{ $start_date ?? 'Semua' }} s/d {{ $end_date ?? 'Semua' }}</td>
                    <td style="width: 120px; text-align: right;"><strong>Tanggal Unduh:</strong></td>
                    <td style="width: 120px; text-align: right;">{{ date('Y-m-d H:i:s') }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="summary-box">
        <h3>Ringkasan Eksekutif</h3>
        <table>
            <tr>
                <td>Total Transaksi Sukses:</td>
                <td><strong>{{ count($bookings) }}</strong></td>
                <td>Total Tiket Terjual:</td>
                <td><strong>{{ $total_tickets }} tiket</strong></td>
                <td style="text-align: right;">Total Pendapatan:</td>
                <td style="text-align: right;" class="highlight">Rp {{ number_format($total_revenue, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    <table class="grid">
        <tr>
            <td style="padding-right: 10px;">
                <div class="summary-box" style="margin-bottom: 0;">
                    <h3>Pendapatan per Paket</h3>
                    <table class="data-table" style="margin-bottom: 0; width: 100%;">
                        <thead>
                            <tr>
                                <th>Paket Wisata</th>
                                <th class="text-right">Qty</th>
                                <th class="text-right">Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($revenue_by_package as $item)
                            <tr>
                                <td>{{ $item['package'] }}</td>
                                <td class="text-right">{{ $item['qty'] }}</td>
                                <td class="text-right">Rp {{ number_format($item['revenue'], 0, ',', '.') }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </td>
            <td style="padding-left: 10px;">
                <div class="summary-box" style="margin-bottom: 0;">
                    <h3>Pendapatan per Sesi</h3>
                    <table class="data-table" style="margin-bottom: 0; width: 100%;">
                        <thead>
                            <tr>
                                <th>Sesi/Shift</th>
                                <th class="text-right">Qty</th>
                                <th class="text-right">Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($revenue_by_shift as $item)
                            <tr>
                                <td style="text-transform: capitalize;">{{ $item['shift'] }}</td>
                                <td class="text-right">{{ $item['qty'] }}</td>
                                <td class="text-right">Rp {{ number_format($item['revenue'], 0, ',', '.') }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    </table>

    <h3>Rincian Transaksi</h3>
    <table class="data-table">
        <thead>
            <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Paket</th>
                <th>Sesi</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Total (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bookings as $b)
            <tr>
                <td><code>{{ $b->booking_ref }}</code></td>
                <td>{{ $b->created_at->format('Y-m-d') }}</td>
                <td>{{ $b->customer_name }}</td>
                <td>{{ $b->package->name ?? '-' }}</td>
                <td>{{ $b->session->session_date ?? '-' }} ({{ $b->session->shift ?? '-' }})</td>
                <td class="text-right">{{ $b->ticket_qty }}</td>
                <td class="text-right">{{ number_format($b->total_price, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Laporan Keuangan Westtamp Wellness - Di-generate secara otomatis oleh Sistem Manajemen POKDARWIS Tampirkulon
    </div>
</body>
</html>
