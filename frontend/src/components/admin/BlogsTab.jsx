import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [adminBlogSearch, setAdminBlogSearch] = useState("");
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null
  });
  const [loading, setLoading] = useState(false);
  const [contentImageLoading, setContentImageLoading] = useState(false);
  const [lastUploadedMarkdown, setLastUploadedMarkdown] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    axios.get('http://localhost:8000/api/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
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
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">Kabar & Blog Management</h1>
        <p className="text-on-surface-variant">Manage articles, news, and wellness tips for visitors.</p>
      </header>

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
            <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', category: '', author: '', excerpt: '', content: '', is_featured: false, image_file: null }); setShowBlogForm(true); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 shrink-0 shadow-sm">
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
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingBlog ? 'Edit Artikel' : 'Buat Artikel Baru'}</h2>
            <button onClick={() => { setShowBlogForm(false); setEditingBlog(null); }} className="text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg font-bold">
              Batal
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
                  {[...new Set(blogs.map(b => b.category))].map(cat => (
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
                  <span className="text-sm font-medium text-on-surface-variant">Tampilkan utama</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Ringkasan (Excerpt)</label>
              <textarea value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} rows="2" className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-y" placeholder="Singkat, padat, dan menarik..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Aset Gambar (WebP)</label>
              <input type="file" accept="image/*" onChange={e => setBlogForm({...blogForm, image_file: e.target.files[0]})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none bg-surface" />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-on-surface">Isi Artikel (Markdown) *</label>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <textarea 
                    required rows="15" 
                    value={blogForm.content} 
                    onChange={e => setBlogForm({...blogForm, content: e.target.value})} 
                    className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary font-mono text-sm resize-y" 
                    placeholder="Markdown content..."
                  ></textarea>
                </div>
                
                <div className="lg:col-span-1 space-y-4">
                  <div className="p-4 bg-surface-container rounded-xl border border-surface-variant">
                    <h4 className="text-sm font-bold mb-3">Sisipkan Gambar</h4>
                    <label className="block w-full cursor-pointer">
                        <div className="border-2 border-dashed border-outline-variant rounded-lg p-4 text-center hover:bg-white transition-colors">
                            {contentImageLoading ? <span className="material-symbols-outlined animate-spin">autorenew</span> : <span className="material-symbols-outlined text-primary">add_a_photo</span>}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleContentImageUpload} disabled={contentImageLoading} />
                    </label>
                    {lastUploadedMarkdown && <code className="text-[10px] mt-2 block break-all bg-white p-1 rounded border">{lastUploadedMarkdown}</code>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-variant">
              <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 shadow-md">
                {loading ? 'Menyimpan...' : (editingBlog ? 'Simpan Perubahan' : 'Simpan & Publikasikan')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
