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
  const [adminBlogSearch, setAdminBlogSearch] = useState("");
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null
  });
  const [contentImageLoading, setContentImageLoading] = useState(false);
  const [lastUploadedMarkdown, setLastUploadedMarkdown] = useState("");

  // Gallery State
  const [galleries, setGalleries] = useState([]);
  const [galleryAdminSearch, setGalleryAdminSearch] = useState("");
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '', category: '', location: '', image_file: null
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'galleries') {
      fetchGalleries();
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

  const fetchGalleries = () => {
    axios.get('http://localhost:8000/api/galleries')
      .then(res => setGalleries(res.data))
      .catch(err => console.error(err));
  };

  const handleGallerySubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('category', galleryForm.category);
    if (galleryForm.location) formData.append('location', galleryForm.location);
    if (galleryForm.image_file) {
      formData.append('image_file', galleryForm.image_file);
    }

    axios.post('http://localhost:8000/api/admin/galleries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert("Gallery photo uploaded successfully!");
      setShowGalleryForm(false);
      setGalleryForm({ title: '', category: '', location: '', image_file: null });
      fetchGalleries();
    })
    .catch(err => alert("Error: " + (err.response?.data?.message || err.message)))
    .finally(() => setLoading(false));
  };

  const handleDeleteGallery = (id) => {
    if (window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      axios.delete(`http://localhost:8000/api/admin/galleries/${id}`)
        .then(() => fetchGalleries())
        .catch(err => alert("Error deleting: " + err.message));
    }
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

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      category: blog.category,
      author: blog.author || '',
      excerpt: blog.excerpt || '',
      content: blog.content,
      is_featured: blog.is_featured,
      image_file: null
    });
    setShowBlogForm(true);
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

    const url = editingBlog 
      ? `http://localhost:8000/api/admin/blogs/${editingBlog.id}` 
      : 'http://localhost:8000/api/admin/blogs';
    
    // For multipart/form-data update, we use POST with _method=PUT header or param
    if (editingBlog) {
      formData.append('_method', 'POST'); 
    }

    axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert(editingBlog ? "Blog updated!" : "Blog created!");
      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogForm({ title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null });
      setLastUploadedMarkdown("");
      fetchBlogs();
    })
    .catch(err => alert("Error: " + (err.response?.data?.message || err.message)))
    .finally(() => setLoading(false));
  };

  const handleContentImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setContentImageLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://localhost:8000/api/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      setLastUploadedMarkdown(res.data.markdown);
      // Optional: auto-append to content
      setBlogForm(prev => ({
        ...prev,
        content: prev.content + "\n\n" + res.data.markdown + "\n"
      }));
    })
    .catch(err => alert("Upload failed: " + err.message))
    .finally(() => setContentImageLoading(false));
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      axios.delete(`http://localhost:8000/api/admin/blogs/${id}`)
        .then(() => fetchBlogs())
        .catch(err => alert("Error deleting: " + err.message));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
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

          <button 
            onClick={() => setActiveTab('galleries')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'galleries' ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface-variant hover:bg-surface'}`}
          >
            <span className="material-symbols-outlined">collections</span>
            Gallery Management
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
              {activeTab === 'dashboard' ? 'Operational Dashboard' : activeTab === 'blogs' ? 'Kabar & Blog Management' : 'Gallery Management'}
            </h1>
            <p className="text-on-surface-variant">
              {activeTab === 'dashboard' ? 'Real-time overview of river activities and bookings.' : activeTab === 'blogs' ? 'Manage articles, news, and wellness tips for visitors.' : 'Manage photos for the public gallery page.'}
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

        {activeTab === 'dashboard' && (
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
        )}

        {activeTab === 'blogs' && (
          /* Blogs Content */
          <div className="w-full">
            {!showBlogForm ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder="Cari artikel..." 
                      value={adminBlogSearch}
                      onChange={(e) => setAdminBlogSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg border border-surface-variant focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null }); setShowBlogForm(true); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 shrink-0">
                    <span className="material-symbols-outlined">add</span> Buat Baru
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-variant text-on-surface-variant uppercase text-sm">
                        <th className="py-3 px-4">Info Artikel</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4 text-center">Featured?</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.filter(b => 
                        b.title.toLowerCase().includes(adminBlogSearch.toLowerCase()) || 
                        (b.author && b.author.toLowerCase().includes(adminBlogSearch.toLowerCase())) ||
                        b.category.toLowerCase().includes(adminBlogSearch.toLowerCase())
                      ).map(blog => (
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
                          <td className="py-3 px-4 text-sm text-on-surface-variant">
                            {formatDate(blog.created_at)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {blog.is_featured ? (
                              <span className="material-symbols-outlined text-green-600">check_circle</span>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditBlog(blog)} className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors">
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button onClick={() => handleDeleteBlog(blog.id)} className="text-error hover:bg-error-container p-2 rounded-full transition-colors">
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
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
                  <h2 className="text-xl font-bold">{editingBlog ? 'Edit Artikel' : 'Buat Artikel Baru'}</h2>
                  <button onClick={() => { setShowBlogForm(false); setEditingBlog(null); }} className="text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg font-bold">
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
                      <label className="block text-sm font-bold text-on-surface mb-2">Kategori Artikel *</label>
                      <input 
                        required 
                        type="text" 
                        list="category-suggestions"
                        value={blogForm.category} 
                        onChange={e => setBlogForm({...blogForm, category: e.target.value})} 
                        className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                        placeholder="Pilih atau ketik kategori baru..." 
                      />
                      <datalist id="category-suggestions">
                        <option value="Tips Wellness" />
                        <option value="Cerita Petualangan" />
                        <option value="Warta Desa" />
                        <option value="UMKM Lokal" />
                        {[...new Set(blogs.map(b => b.category))].filter(c => !["Tips Wellness", "Cerita Petualangan", "Warta Desa", "UMKM Lokal"].includes(c)).map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
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

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-on-surface">Isi Artikel (Markdown Support) *</label>
                      <div className="bg-primary-container/10 px-3 py-1 rounded border border-primary/20 flex items-center gap-2">
                          <span className="text-xs font-medium text-primary">TIPS: Gunakan ## untuk Judul, **tebal** untuk Bold</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-3">
                        <textarea 
                          required 
                          rows="15" 
                          value={blogForm.content} 
                          onChange={e => setBlogForm({...blogForm, content: e.target.value})} 
                          className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary font-mono text-sm resize-y" 
                          placeholder="Tulis artikel Anda di sini... Gunakan Markdown untuk format yang lebih cantik."
                        ></textarea>
                      </div>
                      
                      <div className="lg:col-span-1 space-y-4">
                        <div className="p-4 bg-surface-container rounded-xl border border-surface-variant">
                          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">image</span> Sisipkan Gambar
                          </h4>
                          <p className="text-xs text-on-surface-variant mb-4 font-normal leading-relaxed">Ingin tambah gambar di tengah teks? Unggah di sini dan kodenya akan otomatis muncul.</p>
                          
                          <label className="block w-full cursor-pointer">
                              <div className="border-2 border-dashed border-outline-variant rounded-lg p-4 text-center hover:bg-white transition-colors">
                                  {contentImageLoading ? (
                                      <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                                  ) : (
                                      <>
                                          <span className="material-symbols-outlined text-primary mb-1">add_a_photo</span>
                                          <span className="block text-[10px] font-bold text-on-surface-variant">Klik untuk Unggah</span>
                                      </>
                                  )}
                              </div>
                              <input type="file" className="hidden" accept="image/*" onChange={handleContentImageUpload} disabled={contentImageLoading} />
                          </label>

                          {lastUploadedMarkdown && (
                              <div className="mt-4">
                                  <p className="text-[10px] font-bold text-green-600 mb-1">Berhasil Diunggah!</p>
                                  <div className="bg-white p-2 rounded border border-outline-variant flex items-center justify-between">
                                      <code className="text-[10px] truncate max-w-[120px]">{lastUploadedMarkdown}</code>
                                      <button 
                                          type="button"
                                          onClick={() => {navigator.clipboard.writeText(lastUploadedMarkdown); alert("Copied!");}}
                                          className="text-primary hover:bg-primary/10 p-1 rounded"
                                      >
                                          <span className="material-symbols-outlined text-sm">content_copy</span>
                                      </button>
                                  </div>
                              </div>
                          )}
                        </div>

                        <div className="p-4 bg-primary-container/10 rounded-xl border border-primary/20">
                           <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Bantuan Format</h4>
                           <ul className="text-[11px] space-y-2 text-on-surface-variant font-medium">
                              <li><code className="bg-white px-1 border border-primary/10 rounded">## Judul</code> → Header</li>
                              <li><code className="bg-white px-1 border border-primary/10 rounded">**Tebal**</code> → Bold</li>
                              <li><code className="bg-white px-1 border border-primary/10 rounded">*Miring*</code> → Italic</li>
                              <li><code className="bg-white px-1 border border-primary/10 rounded">- List</code> → Bullet point</li>
                              <li><code className="bg-white px-1 border border-primary/10 rounded">[Teks](Link)</code> → Link</li>
                           </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-surface-variant">
                    <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
                      {loading ? 'Menyimpan...' : (editingBlog ? 'Simpan Perubahan' : 'Simpan & Publikasikan')}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'galleries' && (
          <div className="w-full">
            {/* Gallery Content */}
            {!showGalleryForm ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder="Cari foto..." 
                      value={galleryAdminSearch}
                      onChange={(e) => setGalleryAdminSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg border border-surface-variant focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <button onClick={() => { setGalleryForm({ title: '', category: '', location: '', image_file: null }); setShowGalleryForm(true); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 shrink-0">
                    <span className="material-symbols-outlined">add_a_photo</span> Unggah Foto
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleries.filter(g => 
                    g.title.toLowerCase().includes(galleryAdminSearch.toLowerCase()) || 
                    g.category.toLowerCase().includes(galleryAdminSearch.toLowerCase())
                  ).map(gallery => (
                    <div key={gallery.id} className="bg-surface-container rounded-lg overflow-hidden border border-surface-variant shadow-sm relative group">
                      <img src={`http://localhost:8000${gallery.image_url}`} alt={gallery.title} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button onClick={() => handleDeleteGallery(gallery.id)} className="bg-error text-white p-2 rounded-full hover:bg-error/80">
                           <span className="material-symbols-outlined text-sm">delete</span>
                         </button>
                      </div>
                      <div className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-primary-container text-on-primary-container rounded text-[10px] font-bold mb-1">{gallery.category}</span>
                        <h4 className="text-sm font-bold truncate" title={gallery.title}>{gallery.title}</h4>
                        {gallery.location && <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-1 truncate"><span className="material-symbols-outlined text-[12px]">location_on</span>{gallery.location}</p>}
                      </div>
                    </div>
                  ))}
                  {galleries.length === 0 && (
                     <div className="col-span-full py-8 text-center text-on-surface-variant bg-surface rounded-lg border border-dashed border-outline-variant">
                         <span className="material-symbols-outlined text-4xl mb-2 opacity-50">collections</span>
                         <p>Belum ada foto galeri.</p>
                     </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Unggah Foto Galeri</h2>
                  <button onClick={() => setShowGalleryForm(false)} className="text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg font-bold">
                    Batal
                  </button>
                </div>
                <form onSubmit={handleGallerySubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Judul Foto *</label>
                    <input required type="text" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Cth: Arus Deras Penuh Tawa" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Kategori *</label>
                      <input 
                        required 
                        type="text" 
                        list="gallery-categories"
                        value={galleryForm.category} 
                        onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} 
                        className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                        placeholder="Pilih kategori..." 
                      />
                      <datalist id="gallery-categories">
                        <option value="River Tubing" />
                        <option value="Wellness & Kesehatan" />
                        <option value="UMKM & Kuliner" />
                        <option value="Suasana Desa" />
                        {[...new Set(galleries.map(g => g.category))].filter(c => !["River Tubing", "Wellness & Kesehatan", "UMKM & Kuliner", "Suasana Desa"].includes(c)).map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Lokasi <span className="font-normal text-xs text-on-surface-variant">(Opsional)</span></label>
                      <input type="text" value={galleryForm.location} onChange={e => setGalleryForm({...galleryForm, location: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Cth: Sungai Tampirkulon" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">File Foto *</label>
                    <input required type="file" accept="image/*" onChange={e => setGalleryForm({...galleryForm, image_file: e.target.files[0]})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none bg-surface" />
                    <p className="text-xs text-on-surface-variant mt-1">Sistem otomatis resize & ubah format ke WebP.</p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-surface-variant">
                    <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                       {loading && <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>}
                       {loading ? 'Mengunggah...' : 'Unggah Foto'}
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
