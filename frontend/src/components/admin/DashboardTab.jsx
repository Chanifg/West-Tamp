import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      // Initialize html5-qrcode scanner
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
      scanner.render((decodedText) => {
        setIsScanning(false);
        scanner.clear().catch(err => console.error("Error clearing scanner on success", err));
        verifyCode(decodedText);
      }, (error) => {
        // scan errors can be ignored
      });
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error("Error clearing scanner on unmount", err));
      }
    };
  }, [isScanning]);

  const fetchStats = () => {
    client.get('/api/admin/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  };

  const verifyCode = (code) => {
    setLoading(true);
    setScanResult(null);
    
    client.post('/api/admin/verify-qr', { qr_code: code })
      .then(res => {
        setScanResult({ success: true, ...res.data });
        setQrCode('');
        fetchStats();
      })
      .catch(err => {
        setScanResult({ success: false, message: err.response?.data?.message || err.message });
      })
      .finally(() => setLoading(false));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if(!qrCode) return;
    verifyCode(qrCode);
  };

  const handleEmergency = (sessionId, date, shift) => {
    if (window.confirm(`Apakah Anda yakin ingin MEMBATALKAN Sesi ${shift.toUpperCase()} tanggal ${date} (ID: ${sessionId}) dan mengirimkan WhatsApp notifikasi ke semua pengunjung?`)) {
      client.post('/api/admin/weather-emergency', { session_id: sessionId })
        .then(res => {
          alert(res.data.message);
          fetchStats();
        })
        .catch(err => alert("Error: " + (err.response?.data?.message || err.message)));
    }
  };

  const currentIndoDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-surface-variant pb-6 gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-primary mb-1">Operational Dashboard & Wellness Hub</h1>
          <p className="text-on-surface-variant font-label-sm text-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {currentIndoDate}
          </p>
        </div>
      </header>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.05)] flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-3xl">payments</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Pendapatan</p>
            <p className="text-2xl font-bold text-primary">
              Rp{(stats?.total_revenue || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.05)] flex items-center gap-4">
          <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-3xl">confirmation_number</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tiket Terjual</p>
            <p className="text-2xl font-bold text-primary">
              {stats?.total_tickets || 0} <span className="text-sm font-medium text-on-surface-variant">pax</span>
            </p>
          </div>
        </div>

        {/* Visitor Flow */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.05)] flex items-center gap-4">
          <div className="w-14 h-14 bg-tertiary-container/20 rounded-xl flex items-center justify-center text-tertiary-container shrink-0">
            <span className="material-symbols-outlined text-3xl">group</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pengunjung Hari Ini</p>
            <p className="text-2xl font-bold text-primary">
              {stats?.today_visitors?.arrived || 0} 
              <span className="text-sm font-medium text-on-surface-variant mx-1">/</span>
              <span className="text-lg font-bold text-on-surface-variant">{stats?.today_visitors?.expected || 0} pax</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Alerts and Check-in */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Weather Emergency & River Status */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-3xl">water_drop</span>
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-bold text-primary mb-1 flex items-center gap-2">
                  Status Sungai Elo: 
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-300">AMAN (NORMAL)</span>
                </h3>
                <p className="text-on-surface-variant text-sm">Debit air terpantau stabil dan kondusif untuk aktivitas tubing.</p>
              </div>
            </div>
          </div>

          {/* Active Sessions List & Control Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.05)]">
            <h3 className="font-headline-md text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">thunderstorm</span>
              Kontrol Darurat Cuaca Sesi Aktif (Hari Ini & Besok)
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Gunakan tombol di bawah untuk membatalkan sesi tertentu secara massal jika debit air Elo membahayakan. Ini akan mengirim notifikasi WhatsApp otomatis dengan link reschedule.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats?.active_sessions && stats.active_sessions.length > 0 ? (
                stats.active_sessions.map((session) => (
                  <div key={session.id} className="border border-surface-variant rounded-xl p-4 flex flex-col justify-between bg-surface/30">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                          Sesi {session.shift}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${session.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                          {session.status === 'active' ? 'Aktif' : 'Dibatalkan'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">Tanggal: {session.session_date}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Kuota: {session.booked_capacity} / {session.max_capacity} terisi
                      </p>
                    </div>
                    {session.status === 'active' && (
                      <button 
                        onClick={() => handleEmergency(session.id, session.session_date, session.shift)}
                        className="mt-4 bg-error text-white py-2.5 px-4 rounded-lg text-xs font-bold hover:bg-error/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Batalkan Sesi & Kirim WA
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-sm text-on-surface-variant italic">
                  Tidak ada sesi aktif terdaftar untuk hari ini dan besok.
                </div>
              )}
            </div>
          </div>

          {/* Ticket Verification Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
                Scan QR Code / Masukkan Kode Booking
              </h3>
            </div>

            <form onSubmit={handleVerify} className="flex gap-3 mb-6">
              <input 
                type="text" 
                value={qrCode}
                onChange={e => setQrCode(e.target.value)}
                placeholder="Masukkan kode e-ticket (cth: WT-QR-XXXX)"
                className="flex-grow border border-surface-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary transition-all text-sm"
              />
              <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/95 transition-all disabled:opacity-50 text-sm shadow-sm active:scale-[0.98] cursor-pointer">
                {loading ? 'Memproses...' : 'Konfirmasi Kehadiran'}
              </button>
            </form>

            {/* QR Scanner Camera Interface */}
            {isScanning && (
              <div className="mb-6 bg-surface p-4 rounded-xl border border-surface-variant">
                <div id="qr-reader" className="mx-auto max-w-sm overflow-hidden rounded-xl border border-outline-variant shadow-sm"></div>
                <button 
                  onClick={() => setIsScanning(false)}
                  className="mt-4 mx-auto block bg-outline-variant hover:bg-outline text-on-surface px-6 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup Kamera Scanner
                </button>
              </div>
            )}

            {/* Scan Results */}
            <div className="bg-surface-container/50 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-6 text-center min-h-[160px]">
              {scanResult ? (
                <div className={`w-full p-4 flex flex-col items-center justify-center rounded-xl ${scanResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <span className={`material-symbols-outlined text-4xl mb-2 ${scanResult.success ? 'text-emerald-600' : 'text-red-600'}`}>
                    {scanResult.success ? 'check_circle' : 'error'}
                  </span>
                  <p className={`font-bold text-center ${scanResult.success ? 'text-emerald-800' : 'text-red-800'} mb-2`}>
                    {scanResult.message}
                  </p>
                  {scanResult.success && scanResult.data && (
                    <div className="text-sm text-emerald-950 text-left w-full mt-3 bg-white/70 p-4 rounded-lg border border-emerald-100/50 space-y-1">
                      <p><strong>Nama Pengunjung:</strong> {scanResult.data.customer_name}</p>
                      <p><strong>Paket Wisata:</strong> {scanResult.data.package}</p>
                      <p><strong>Jumlah Tiket:</strong> {scanResult.data.qty} pax</p>
                      <p><strong>Sesi Kunjungan:</strong> {scanResult.data.session}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <span className="material-symbols-outlined text-5xl text-primary/30 mb-3">photo_camera</span>
                  <p className="font-label-md text-sm text-on-surface-variant font-medium mb-4">Arahkan QR Code tiket ke kamera atau input kode di atas untuk verifikasi cepat.</p>
                  
                  {!isScanning && (
                    <button 
                      onClick={() => setIsScanning(true)}
                      className="bg-primary-container text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      Aktifkan Scanner Kamera
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Culinary & Package Sales */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Package Sales Split */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.05)]">
            <h3 className="font-headline-md text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">analytics</span>
              Pendapatan Per Paket Wisata
            </h3>
            
            <div className="space-y-3">
              {stats?.revenue_by_package && stats.revenue_by_package.length > 0 ? (
                stats.revenue_by_package.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-surface-variant last:border-0">
                    <span className="text-sm font-semibold text-on-surface-variant">{item.package}</span>
                    <span className="text-sm font-bold text-primary">Rp{Number(item.revenue).toLocaleString('id-ID')}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-on-surface-variant italic">Belum ada rincian data penjualan.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
