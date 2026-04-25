import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PackagesTab() {
  const [packages, setPackages] = useState([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '', description: '', price: '', is_popular: false, image_file: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = () => {
    axios.get('http://localhost:8000/api/admin/packages')
      .then(res => setPackages(res.data))
      .catch(err => console.error(err));
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      is_popular: pkg.is_popular,
      image_file: null
    });
    setShowPackageForm(true);
  };

  const handlePackageSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingPackage 
      ? `http://localhost:8000/api/admin/packages/${editingPackage.id}` 
      : 'http://localhost:8000/api/admin/packages';

    const formData = new FormData();
    formData.append('name', packageForm.name);
    formData.append('description', packageForm.description);
    formData.append('price', packageForm.price);
    formData.append('is_popular', packageForm.is_popular ? '1' : '0');
    if (packageForm.image_file) {
      formData.append('image_file', packageForm.image_file);
    }
    
    axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert(editingPackage ? "Package updated!" : "Package created!");
      setShowPackageForm(false);
      setEditingPackage(null);
      setPackageForm({ name: '', description: '', price: '', is_popular: false, image_file: null });
      fetchPackages();
    })
    .catch(err => alert("Error: " + (err.response?.data?.message || err.message)))
    .finally(() => setLoading(false));
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure?')) {
      axios.delete(`http://localhost:8000/api/admin/packages/${id}`)
        .then(() => fetchPackages())
        .catch(err => alert(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">Package Management</h1>
        <p className="text-on-surface-variant">Manage river tubing packages and pricing.</p>
      </header>

      {!showPackageForm ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Daftar Paket Tubing</h3>
            <button onClick={() => { setEditingPackage(null); setPackageForm({ name: '', description: '', price: '', is_popular: false, image_file: null }); setShowPackageForm(true); }} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 shrink-0 shadow-sm">
              <span className="material-symbols-outlined">add</span> Buat Paket Baru
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <div key={pkg.id} className="border border-surface-variant rounded-xl p-6 bg-surface/30 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">kayaking</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditPackage(pkg)} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-error hover:bg-error/10 p-2 rounded-full transition-colors">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-on-surface mb-2 flex items-center gap-2">
                  {pkg.name}
                  {pkg.is_popular && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border border-primary/20">Populer</span>}
                </h4>
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-4 flex-1">{pkg.description}</p>
                <div className="pt-4 border-t border-surface-variant flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Harga per Pax</span>
                  <span className="text-lg font-bold text-primary">Rp{Number(pkg.price).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-variant max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingPackage ? 'Edit Paket' : 'Buat Paket Baru'}</h2>
            <button onClick={() => setShowPackageForm(false)} className="text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg font-bold">
              Batal
            </button>
          </div>
          <form onSubmit={handlePackageSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Nama Paket *</label>
              <input required type="text" value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Cth: Paket Adventure" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Deskripsi Paket *</label>
              <textarea required rows="4" value={packageForm.description} onChange={e => setPackageForm({...packageForm, description: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-y" placeholder="Gunakan baris baru untuk membuat poin-poin..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Harga per Pax (Rp) *</label>
              <input required type="number" value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: e.target.value})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary" placeholder="Cth: 50000" />
            </div>

            <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-surface-variant">
              <input type="checkbox" id="is_popular" checked={packageForm.is_popular} onChange={e => setPackageForm({...packageForm, is_popular: e.target.checked})} className="w-5 h-5 accent-primary cursor-pointer" />
              <label htmlFor="is_popular" className="font-bold text-on-surface cursor-pointer">Tandai sebagai Paket Terpopuler</label>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Pilih Foto Paket</label>
              <input type="file" accept="image/*" onChange={e => setPackageForm({...packageForm, image_file: e.target.files[0]})} className="w-full border border-surface-variant rounded-lg px-4 py-3 focus:outline-none bg-surface" />
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-variant">
              <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
                {loading ? 'Menyimpan...' : 'Simpan Paket'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
