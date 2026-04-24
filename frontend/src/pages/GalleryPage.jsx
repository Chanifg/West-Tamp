import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/galleries')
      .then(res => {
        setGalleries(res.data);
      })
      .catch(err => console.error("Error fetching galleries:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Semua", "River Tubing", "Wellness & Kesehatan", "UMKM & Kuliner", "Suasana Desa"];
  // Add any dynamically fetched categories that are not in the default list
  const dynamicCategories = [...new Set(galleries.map(g => g.category))];
  const allCategories = [...new Set([...categories, ...dynamicCategories])];

  const filteredGalleries = activeCategory === "Semua" 
    ? galleries 
    : galleries.filter(g => g.category === activeCategory);

  const getGridClasses = (index) => {
    const pattern = index % 5;
    switch(pattern) {
      case 0: return "md:col-span-8 row-span-2";
      case 1: return "md:col-span-4 row-span-1";
      case 2: return "md:col-span-4 row-span-1";
      case 3: return "md:col-span-6 row-span-1";
      case 4: return "md:col-span-6 row-span-1";
      default: return "md:col-span-6 row-span-1";
    }
  };

  const getGradient = (index) => {
    const isUMKM = filteredGalleries[index]?.category === 'UMKM & Kuliner';
    if (isUMKM) return "from-[#3f1d00]/80 to-transparent opacity-70 group-hover:opacity-90";
    
    if (index % 5 === 0) return "from-[#012d1d]/80 via-[#012d1d]/20 to-transparent opacity-60 group-hover:opacity-80";
    return "from-[#012d1d]/80 to-transparent opacity-60 group-hover:opacity-80";
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:pb-20">
        <section className="mb-12 text-center md:text-left">
          <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-on-surface mb-4">Galeri Petualangan & Wellness</h1>
          <p className="font-body-md text-lg text-on-surface-variant max-w-2xl">Jelajahi momen-momen penuh energi di sungai dan ketenangan otentik di desa kami. Temukan inspirasi untuk kunjungan Anda berikutnya.</p>
        </section>

        <section className="mb-12 flex flex-wrap gap-2 justify-center md:justify-start">
          {allCategories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-label-md shadow-sm transition-all ${activeCategory === cat ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              {cat}
            </button>
          ))}
        </section>

        {loading ? (
           <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
           </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-12 auto-rows-[280px] gap-6">
            {filteredGalleries.map((gallery, index) => {
              const isLarge = index % 5 === 0;
              return (
                <div key={gallery.id} className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer bg-surface-container ${getGridClasses(index)}`}>
                  <img alt={gallery.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={`http://localhost:8000${gallery.image_url}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${getGradient(index)}`}></div>
                  
                  <div className={`absolute bottom-0 left-0 w-full transition-transform duration-300 ${isLarge ? 'p-6 -translate-y-2 group-hover:-translate-y-4' : 'p-4'}`}>
                    <span className={`inline-block bg-white/20 backdrop-blur-md rounded-full text-white font-label-sm border border-white/30 ${isLarge ? 'px-3 py-1 mb-2' : 'px-2 py-0.5 text-[10px] mb-1'}`}>
                      {gallery.category}
                    </span>
                    
                    <h3 className={`font-semibold text-white leading-tight ${isLarge ? 'font-headline-lg text-3xl mb-1' : 'font-headline-md text-xl mb-1'}`}>
                      {gallery.title}
                    </h3>
                    
                    {isLarge && gallery.location && (
                      <p className="font-body-md text-emerald-50/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span> {gallery.location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredGalleries.length === 0 && (
              <div className="col-span-full py-20 text-center text-on-surface-variant bg-surface rounded-xl border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-5xl mb-4 opacity-50">imagesmode</span>
                  <h3 className="font-headline-md text-xl font-bold mb-2 text-on-surface">Belum ada foto</h3>
                  <p>Galeri masih kosong untuk kategori yang dipilih.</p>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
