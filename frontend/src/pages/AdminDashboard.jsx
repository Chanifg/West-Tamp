import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard Stats State
  const [stats, setStats] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Blog State
  const [blogs, setBlogs] = useState([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    }
  }, [activeTab]);

  const fetchStats = () => {
    axios.get('http://localhost:8000/api/admin/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  };

  const fetchBlogs = () => {
    axios.get('http://localhost:8000/api/blogs')
      .then(res => setBlogs(res.data))
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

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', blogForm.title);
    formData.append('category', blogForm.category);
    formData.append('author', blogForm.author);
    formData.append('excerpt', blogForm.excerpt);
    formData.append('content', blogForm.content);
    formData.append('is_featured', blogForm.is_featured);
    if (blogForm.image_file) {
      formData.append('image_file', blogForm.image_file);
    }

    axios.post('http://localhost:8000/api/admin/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert("Blog created!");
      setShowBlogForm(false);
      setBlogForm({ title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null });
      fetchBlogs();
    })
    .catch(err => alert("Error: " + (err.response?.data?.message || err.message)))
    .finally(() => setLoading(false));
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      axios.delete(`http://localhost:8000/api/admin/blogs/${id}`)
        .then(() => fetchBlogs())
        .catch(err => alert("Error deleting: " + err.message));
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
        <nav className="flex flex-col p-6 gap-y-2 flex-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'dashboard' ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface-variant hover:bg-surface'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('blogs')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'blogs' ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface-variant hover:bg-surface'}`}
          >
            <span className="material-symbols-outlined">article</span>
            Blog Management
          </button>

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
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
              {activeTab === 'dashboard' ? 'Operational Dashboard' : 'Kabar & Blog Management'}
            </h1>
            <p className="text-on-surface-variant">
              {activeTab === 'dashboard' ? 'Real-time overview of river activities and bookings.' : 'Manage articles, news, and wellness tips for visitors.'}
            </p>
          </div>
          {activeTab === 'dashboard' && (
            <div className="text-right hidden sm:block">
              <p className="font-label-md text-sm text-on-surface-variant mb-1">Total Revenue Today</p>
              <p className="font-headline-md text-2xl text-primary font-bold">
                Rp{(stats?.total_revenue || 0).toLocaleString('id-ID')}
              </p>
            </div>
          )}
        </header>

        {activeTab === 'dashboard' ? (
          /* Dashboard Content */
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
        ) : (
          /* Blogs Content */
          <div className="w-full">
            {!showBlogForm ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Daftar Artikel</h2>
                  <button onClick={() => setShowBlogForm(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90">
                    <span className="material-symbols-outlined">add</span> Buat Baru
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-variant text-on-surface-variant uppercase text-sm">
                        <th className="py-3 px-4">Info Artikel</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4 text-center">Featured?</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(blog => (
                        <tr key={blog.id} className="border-b border-surface-variant/50 hover:bg-surface/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {blog.image_url ? (
                                <img src={`http://localhost:8000${blog.image_url}`} className="w-12 h-12 rounded object-cover" alt="" />
                              ) : (
                                <div className="w-12 h-12 bg-surface-variant rounded flex items-center justify-center">
                                  <span className="material-symbols-outlined text-outline">image</span>
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-on-surface line-clamp-1">{blog.title}</p>
                                <p className="text-xs text-on-surface-variant">Oleh {blog.author}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            <span className="bg-surface-container px-2 py-1 rounded text-primary border border-surface-variant">{blog.category}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {blog.is_featured ? (
                              <span className="material-symbols-outlined text-green-600">check_circle</span>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => handleDeleteBlog(blog.id)} className="text-error hover:bg-error-container p-2 rounded-full transition-colors">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {blogs.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-on-surface-variant">Belum ada artikel. Klik "Buat Baru" untuk memulai.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Buat Artikel Baru</h2>
                  <button onClick={() => setShowBlogForm(false)} className="text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg font-bold">
                    Kembali
                  </button>
                </div>
                <form onSubmit={handleBlogSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Judul Artikel *</label>
                      <input required type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Masukkan judul..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Kategori (Bebas) *</label>
                      <input required type="text" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Contoh: Tips Wellness, Warta Desa" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Penulis</label>
                      <input type="text" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Nama penulis" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Jadikan Sorotan Utama?</label>
                      <label className="flex items-center gap-3 cursor-pointer mt-3">
                        <input type="checkbox" checked={blogForm.is_featured} onChange={e => setBlogForm({...blogForm, is_featured: e.target.checked})} className="w-5 h-5 accent-primary" />
                        <span className="text-sm font-medium text-on-surface-variant">Tampilkan artikel ini paling atas pada halaman blog</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Ringkasan (Excerpt)</label>
                    <textarea value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} rows="2" className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-y" placeholder="Singkat, padat, dan menarik..."></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Aset Gambar (Akan otomatis di-convert ke WebP)</label>
                    <input type="file" accept="image/*" onChange={e => setBlogForm({...blogForm, image_file: e.target.files[0]})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none bg-surface" />
                    <p className="text-xs text-on-surface-variant mt-1">Format didukung: JPG, PNG, GIF. Ukuran maksimum: 5MB.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Isi Konten *</label>
                    <textarea required value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} rows="10" className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-y" placeholder="Tuliskan isi blog lengkap di sini..."></textarea>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-surface-variant">
                    <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
                      {loading ? 'Menyimpan...' : 'Simpan & Publikasikan'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
