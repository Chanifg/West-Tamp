import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GalleriesTab() {
  const [galleries, setGalleries] = useState([]);
  const [galleryAdminSearch, setGalleryAdminSearch] = useState("");
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '', category: '', location: '', image_file: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

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
    if (window.confirm('Are you sure you want to delete this photo?')) {
      axios.delete(`http://localhost:8000/api/admin/galleries/${id}`)
        .then(() => fetchGalleries())
        .catch(err => alert("Error deleting: " + err.message));
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">Gallery Management</h1>
        <p className="text-on-surface-variant">Manage photos for the public gallery page.</p>
      </header>

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
            <button onClick={() => { setGalleryForm({ title: '', category: '', location: '', image_file: null }); setShowGalleryForm(true); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 shrink-0 shadow-sm">
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
                  <h4 className="text-sm font-bold truncate">{gallery.title}</h4>
                  {gallery.location && <p className="text-[10px] text-on-surface-variant truncate mt-1">@ {gallery.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant max-w-2xl mx-auto">
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
                <input required type="text" list="gallery-categories" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Pilih kategori..." />
                <datalist id="gallery-categories">
                  <option value="River Tubing" />
                  <option value="Wellness & Kesehatan" />
                  <option value="UMKM & Kuliner" />
                  <option value="Suasana Desa" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Lokasi</label>
                <input type="text" value={galleryForm.location} onChange={e => setGalleryForm({...galleryForm, location: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Lokasi foto" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">File Foto *</label>
              <input required type="file" accept="image/*" onChange={e => setGalleryForm({...galleryForm, image_file: e.target.files[0]})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none bg-surface" />
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-variant">
              <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                 {loading ? 'Mengunggah...' : 'Unggah Foto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
