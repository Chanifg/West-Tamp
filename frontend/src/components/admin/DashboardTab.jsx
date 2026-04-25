import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    axios.get('http://localhost:8000/api/admin/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if(!qrCode) return;
    setLoading(true);
    
    axios.post('http://localhost:8000/api/admin/verify-qr', { qr_code: qrCode })
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

  const handleEmergency = () => {
    const sessionId = prompt("Enter Session ID to cancel (e.g. 1):");
    if (sessionId) {
      if (window.confirm(`Are you sure you want to CANCEL Session ID ${sessionId} and notify all visitors?`)) {
        axios.post('http://localhost:8000/api/admin/weather-emergency', { session_id: sessionId })
          .then(res => alert(res.data.message))
          .catch(err => alert("Error: " + err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">Operational Dashboard</h1>
          <p className="text-on-surface-variant">Real-time overview of river activities and bookings.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-label-md text-sm text-on-surface-variant mb-1">Total Revenue Today</p>
          <p className="font-headline-md text-2xl text-primary font-bold">
            Rp{(stats?.total_revenue || 0).toLocaleString('id-ID')}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-1 md:col-span-12 lg:col-span-12 bg-error-container rounded-xl p-6 shadow-sm border border-error/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-error text-on-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-error-container mb-1">Tombol Darurat Cuaca</h2>
              <p className="text-on-surface-variant text-sm text-on-error-container/80">Cancel active sessions and immediately notify scheduled customers via WhatsApp.</p>
            </div>
          </div>
          <button onClick={handleEmergency} className="shrink-0 bg-error text-white px-6 py-4 rounded-lg font-bold tracking-wide hover:opacity-90 transition-colors shadow-md flex items-center gap-2">
            <span className="material-symbols-outlined">notifications_active</span>
            Initiate Protocol
          </button>
        </div>

        {/* QR Scanner */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-surface-variant flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Ticket Scanner</h3>
            <span className="material-symbols-outlined text-outline">qr_code_scanner</span>
          </div>
          
          <form onSubmit={handleVerify} className="w-full flex mb-4 gap-2">
              <input 
                type="text" 
                value={qrCode}
                onChange={e => setQrCode(e.target.value)}
                placeholder="Enter QR String"
                className="flex-1 border border-outline-variant p-2 rounded text-sm"
              />
              <button type="submit" disabled={loading} className="bg-primary-container text-white px-3 py-2 rounded text-sm font-bold shadow-sm">
                {loading ? '...' : 'Verify'}
              </button>
          </form>

          <div className="bg-surface-container flex-1 rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-6 text-center min-h-[200px]">
            {scanResult ? (
               <div className={`w-full h-full p-4 flex flex-col items-center justify-center rounded ${scanResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  <span className={`material-symbols-outlined text-4xl mb-2 ${scanResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {scanResult.success ? 'check_circle' : 'error'}
                  </span>
                  <p className={`font-bold text-center ${scanResult.success ? 'text-green-800' : 'text-red-800'} mb-2`}>
                    {scanResult.message}
                  </p>
                  {scanResult.success && scanResult.data && (
                    <div className="text-sm text-green-900 text-left w-full mt-2 bg-white/50 p-3 rounded">
                      <p><strong>Name:</strong> {scanResult.data.customer_name}</p>
                      <p><strong>Package:</strong> {scanResult.data.package}</p>
                      <p><strong>Qty:</strong> {scanResult.data.qty} pax</p>
                    </div>
                  )}
               </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-5xl text-primary mb-4 opacity-50">photo_camera</span>
                <p className="font-label-md text-sm text-on-surface-variant font-medium">Camera simulator</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant flex flex-col justify-center relative overflow-hidden">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Tickets Sold</p>
            <div className="flex items-end gap-3">
              <span className="font-headline-xl text-5xl font-bold text-primary">{stats?.total_tickets || 0}</span>
            </div>
          </div>
          <div className="bg-primary text-white rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <p className="text-sm font-bold text-primary-fixed-dim uppercase tracking-wider mb-2 relative z-10">Today's Visitors Arrived</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-headline-xl text-5xl font-bold">{stats?.today_visitors?.arrived || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
