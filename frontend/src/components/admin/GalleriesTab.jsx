import React, { useState, useEffect } from 'react';
import client, { getImageUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function GalleriesTab() {
  const [galleries, setGalleries] = useState([]);
  const [galleryAdminSearch, setGalleryAdminSearch] = useState("");
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '', category: '', location: '', image_file: null
  });
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const toast = useToast();

  useEffect(() => {
    setCurrentPage(1);
  }, [galleryAdminSearch]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = () => {
    client.get('/api/galleries')
      .then(res => setGalleries(res.data))
      .catch(err => {
        
        toast.error("Gagal memuat galeri foto.");
      });
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

    client.post('/api/admin/galleries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      toast.success("Foto galeri berhasil diunggah!");
      setShowGalleryForm(false);
      setGalleryForm({ title: '', category: '', location: '', image_file: null });
      fetchGalleries();
    })
    .catch(err => toast.error("Error: " + (err.response?.data?.message || err.message)))
    .finally(() => setLoading(false));
  };

  const handleDeleteGallery = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      client.delete(`/api/admin/galleries/${id}`)
        .then(() => {
          toast.success("Foto galeri berhasil dihapus!");
          fetchGalleries();
        })
        .catch(err => toast.error("Error deleting: " + err.message));
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
            {(() => {
              const filtered = galleries.filter(g => 
                g.title.toLowerCase().includes(galleryAdminSearch.toLowerCase()) || 
                g.category.toLowerCase().includes(galleryAdminSearch.toLowerCase())
              );
              const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
              
              return paginated.map(gallery => (
                <div key={gallery.id} className="bg-surface-container rounded-lg overflow-hidden border border-surface-variant shadow-sm relative group">
                  <img src={getImageUrl(gallery.image_url)} alt={gallery.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button onClick={() => handleDeleteGallery(gallery.id)} className="bg-error text-white p-2 rounded-full hover:bg-error/80 cursor-pointer">
                       <span className="material-symbols-outlined text-sm">delete</span>
                     </button>
                  </div>
                  <div className="p-3">
                    <span className="inline-block px-2 py-0.5 bg-primary-container text-on-primary-container rounded text-[10px] font-bold mb-1">{gallery.category}</span>
                    <h4 className="text-sm font-bold truncate">{gallery.title}</h4>
                    {gallery.location && <p className="text-[10px] text-on-surface-variant truncate mt-1">@ {gallery.location}</p>}
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Client-side Pagination (M-20) */}
          {(() => {
            const filtered = galleries.filter(g => 
              g.title.toLowerCase().includes(galleryAdminSearch.toLowerCase()) || 
              g.category.toLowerCase().includes(galleryAdminSearch.toLowerCase())
            );
            const total = Math.ceil(filtered.length / itemsPerPage);
            if (total <= 1) return null;
            
            return (
              <div className="flex items-center justify-between border-t border-surface-variant/30 pt-6 mt-6 text-sm">
                <p className="text-on-surface-variant">
                  Menampilkan {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filtered.length, currentPage * itemsPerPage)} dari {filtered.length} foto
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-surface-variant hover:bg-surface disabled:opacity-40 transition-colors cursor-pointer font-bold"
                  >
                    Previous
                  </button>
                  {[...Array(total)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-primary-container text-white border-primary-container' : 'border-surface-variant hover:bg-surface'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(total, prev + 1))}
                    disabled={currentPage === total}
                    className="px-3 py-1.5 rounded-lg border border-surface-variant hover:bg-surface disabled:opacity-40 transition-colors cursor-pointer font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            );
          })()}
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
              <label htmlFor="gallery_title" className="block text-sm font-bold text-on-surface mb-2">Judul Foto *</label>
              <input id="gallery_title" required type="text" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Cth: Arus Deras Penuh Tawa" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gallery_category" className="block text-sm font-bold text-on-surface mb-2">Kategori *</label>
                <input id="gallery_category" required type="text" list="gallery-categories" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Pilih kategori..." />
                <datalist id="gallery-categories">
                  <option value="River Tubing" />
                  <option value="Wellness & Kesehatan" />
                  <option value="UMKM & Kuliner" />
                  <option value="Suasana Desa" />
                </datalist>
              </div>
              <div>
                <label htmlFor="gallery_location" className="block text-sm font-bold text-on-surface mb-2">Lokasi</label>
                <input id="gallery_location" type="text" value={galleryForm.location} onChange={e => setGalleryForm({...galleryForm, location: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Lokasi foto" />
              </div>
            </div>

            <div>
              <label htmlFor="gallery_image" className="block text-sm font-bold text-on-surface mb-2">File Foto *</label>
              <input id="gallery_image" required type="file" accept="image/*" onChange={e => setGalleryForm({...galleryForm, image_file: e.target.files[0]})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none bg-surface" />
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
