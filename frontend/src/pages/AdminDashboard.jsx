import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
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
          .then(res => {
            alert(res.data.message);
          })
          .catch(err => alert("Error: " + err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* SideNavBar */}
      <aside className="bg-white border-r border-surface-variant w-72 fixed left-0 top-0 h-screen hidden lg:flex flex-col z-40">
        <div className="p-6 border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Westtamp Admin</h2>
              <p className="text-xs text-on-surface-variant truncate w-32">{user?.email || 'admin@westtamp.com'}</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col p-6 gap-y-4 flex-1 overflow-y-auto">
          <a className="flex items-center gap-3 px-4 py-3 bg-primary-container/10 text-primary-container font-semibold rounded-lg" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface rounded-lg transition-colors cursor-pointer" href="#">
            <span className="material-symbols-outlined">confirmation_number</span>
            Bookings
          </a>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 mt-auto text-error hover:bg-error-container/50 rounded-lg transition-colors w-full text-left font-bold">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-8 lg:p-12 w-full">
        <header className="mb-8 flex justify-between items-end">
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Weather Emergency Button */}
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
                  autoFocus
                />
                <button type="submit" disabled={loading} className="bg-primary-container text-white px-3 py-2 rounded text-sm font-bold">
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
                        <p><strong>Session:</strong> {scanResult.data.session}</p>
                      </div>
                    )}
                 </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-5xl text-primary mb-4 opacity-50">photo_camera</span>
                  <p className="font-label-md text-sm text-on-surface-variant font-medium">Camera simulator</p>
                  <p className="text-xs text-outline mt-1">Use text input above</p>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 grid grid-rows-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <span className="material-symbols-outlined text-9xl">groups</span>
              </div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Tickets Sold</p>
              <div className="flex items-end gap-3">
                <span className="font-headline-xl text-5xl font-bold text-primary">{stats?.total_tickets || 0}</span>
              </div>
            </div>
            
            <div className="bg-primary text-white rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-container to-transparent"></div>
              <p className="text-sm font-bold text-primary-fixed-dim uppercase tracking-wider mb-2 relative z-10">Today's Visitors Arrived</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="font-headline-xl text-5xl font-bold">{stats?.today_visitors?.arrived || 0}</span>
                <span className="text-sm opacity-80">/ {stats?.today_visitors?.expected || 0} Expected</span>
              </div>
            </div>
          </div>
          
          {/* Packages Chart Placeholder */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-surface-variant flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">Revenue By Package</h3>
              {stats?.revenue_by_package && stats.revenue_by_package.length > 0 ? (
                 stats.revenue_by_package.map((pkg, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-surface-variant pb-3">
                       <span className="font-medium">{pkg.package}</span>
                       <span className="font-bold text-primary">Rp{parseInt(pkg.revenue).toLocaleString('id-ID')}</span>
                    </div>
                 ))
              ) : (
                <p className="text-on-surface-variant italic">No revenue today</p>
              )}
            </div>
            <button className="mt-6 text-primary-container font-bold text-sm hover:underline w-full text-left">
              View Full Report &rarr;
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
