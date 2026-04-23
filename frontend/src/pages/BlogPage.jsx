import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kabar");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // How many to show in the grid initially
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://lh3.googleusercontent.com/aida-public/AB6AXuAeodPvk7ZVRaCZ8Dzxa2CaNkefcVlz_6v_sCkCS4GCcoBWuz3FtQOi2WSzW_JeKkQLVCj8H3-7RTCZfvpnhvZYVybTkfa9A4ZZIYy7Su9PW721JgF98MDNRDstC-jAim0TMjEtdfwUw2uW5q7LL4UJIIYj7FkWS-A03cK7Rdvs6QzZtNFXWNmbxPO3Kxswmkn5eczCw1G2O6TjFMRBZIri4crxrFFpV7vQSB6kIhTOmtHTFlM2We42VjZs6xepk14IttpeyC4R4Jsd";
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Predefined categories from reference + any new ones from DB
  const defaultCategories = ["Semua Kabar", "Tips Wellness", "Cerita Petualangan", "Warta Desa", "UMKM Lokal"];
  const dbCategories = blogs.map(b => b.category);
  const categories = [...new Set([...defaultCategories, ...dbCategories])];
  
  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === "Semua Kabar" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = b.title.toLowerCase().includes(query) || 
                          (b.excerpt && b.excerpt.toLowerCase().includes(query)) ||
                          b.content.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  
  const featuredBlog = filteredBlogs.find(b => b.is_featured) || (filteredBlogs.length > 0 ? filteredBlogs[0] : null);
  const allGridBlogs = filteredBlogs.filter(b => b.id !== featuredBlog?.id);
  const gridBlogs = allGridBlogs.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin py-stack-xl flex-1 w-full">
        <section className="text-center max-w-3xl mx-auto mb-stack-xl">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-stack-sm tracking-tight">Kabar dari Aliran Sungai & Desa</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Temukan inspirasi kesejahteraan, cerita petualangan seru, dan perkembangan terbaru dari komunitas lokal Tampirkulon. Merawat bumi, merawat diri.</p>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
             <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">Belum ada artikel yang dipublikasikan.</div>
        ) : (
          <>
            {featuredBlog && (
              <section className="mb-stack-xl">
                <article className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(27,67,50,0.08)] border border-surface-variant hover:shadow-[0_8px_32px_rgba(27,67,50,0.12)] transition-shadow duration-300">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img 
                        alt={featuredBlog.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src={getImageUrl(featuredBlog.image_url)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <span className="absolute top-4 left-4 bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full backdrop-blur-md bg-opacity-90">
                        {featuredBlog.is_featured ? 'Sorotan Utama' : 'Artikel Terbaru'}
                    </span>
                  </div>
                  <div className="p-stack-md lg:p-stack-lg flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-stack-sm text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{formatDate(featuredBlog.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>{featuredBlog.category}</span>
                    </div>
                    <Link to={`/blog/${featuredBlog.slug}`}>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm leading-tight group-hover:text-primary transition-colors">
                          {featuredBlog.title}
                      </h2>
                    </Link>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md line-clamp-3">
                        {featuredBlog.excerpt || featuredBlog.content}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-stack-sm border-t border-surface-variant">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold uppercase">
                            {featuredBlog.author ? featuredBlog.author.substring(0, 2) : 'A'}
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{featuredBlog.author || 'Admin'}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">Penulis</p>
                        </div>
                      </div>
                      <Link to={`/blog/${featuredBlog.slug}`} className="inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:text-on-surface transition-colors">
                        Baca Selengkapnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </section>
            )}

            {/* Search and Category Filter */}
            <section className="mb-stack-lg space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">search</span>
                <input 
                  type="text" 
                  placeholder="Cari artikel, tips wellness, atau berita desa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-2xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body-md"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-md text-label-md shadow-sm transition-all duration-200 cursor-pointer border
                      ${selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container hover:bg-surface-variant text-on-surface-variant border-outline-variant'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20 bg-surface-container/30 rounded-3xl border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
                <p className="text-xl font-bold text-on-surface mb-2">Tidak menemukan artikel</p>
                <p className="text-on-surface-variant">Coba gunakan kata kunci lain atau pilih kategori berbeda.</p>
                <button onClick={() => {setSearchQuery(""); setSelectedCategory("Semua Kabar");}} className="mt-6 text-primary font-bold hover:underline">Hapus semua filter</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    {gridBlogs.map(blog => (
                        <article key={blog.id} className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(27,67,50,0.04)] border border-surface-variant hover:shadow-[0_4px_24px_rgba(27,67,50,0.08)] transition-all duration-300">
                          <div className="relative h-48 overflow-hidden">
                            <img alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={getImageUrl(blog.image_url)} />
                            <span className="absolute top-3 left-3 bg-surface text-on-surface font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-outline-variant shadow-sm">
                                {blog.category}
                            </span>
                          </div>
                          <div className="p-stack-md flex flex-col flex-grow">
                            <Link to={`/blog/${blog.slug}`}>
                              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                                  {blog.title}
                              </h3>
                            </Link>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-3">
                                {blog.excerpt || blog.content}
                            </p>
                            <div className="mt-auto flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-4 border-t border-surface-variant/50">
                              <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">edit_note</span> {blog.author || 'Admin'}
                              </span>
                              <span>{formatDate(blog.created_at)}</span>
                            </div>
                          </div>
                        </article>
                    ))}
                  </div>
                  {allGridBlogs.length > visibleCount && (
                    <div className="mt-stack-lg text-center">
                      <button 
                        onClick={handleLoadMore}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                      >
                        Muat Lebih Banyak <span className="material-symbols-outlined text-[20px]">refresh</span>
                      </button>
                    </div>
                  )}
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-stack-lg mt-stack-lg lg:mt-0">
                  <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-surface-variant shadow-[0_2px_8px_rgba(27,67,50,0.03)]">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary-container icon-fill">local_fire_department</span>
                      Artikel Terbaru
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {blogs.slice(0, 3).map((b, idx) => (
                          <li key={idx} className={`group flex gap-4 items-start ${idx > 0 ? 'border-t border-surface-variant/50 pt-4' : ''}`}>
                            <div className="w-8 font-headline-md text-outline-variant group-hover:text-primary transition-colors">0{idx + 1}</div>
                            <div className="flex-1">
                              <Link to={`/blog/${b.slug}`} className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight cursor-pointer block">{b.title}</Link>
                              <span className="text-label-sm font-label-sm text-on-surface-variant mt-1 block">{b.category}</span>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary-container text-on-primary-container rounded-xl p-stack-md relative overflow-hidden shadow-sm">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-fixed opacity-10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <span className="material-symbols-outlined text-[32px] mb-2 text-primary-fixed">mark_email_read</span>
                      <h3 className="font-headline-md text-headline-md mb-2 text-white">Langganan Buletin</h3>
                      <p className="font-body-md text-body-md text-primary-fixed-dim mb-4 text-sm">Dapatkan inspirasi wellness mingguan dan penawaran eksklusif langsung di kotak masuk Anda.</p>
                      <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
                        <input className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border-none text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-fixed focus:outline-none font-body-md" placeholder="Alamat email Anda" required type="email"/>
                        <button className="w-full bg-primary-fixed text-on-primary-fixed px-4 py-3 rounded-lg font-label-md text-label-md hover:bg-white transition-colors flex justify-center items-center gap-2 cursor-pointer" type="submit">
                          Daftar Sekarang <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                      </form>
                      <p className="text-[10px] text-primary-fixed-dim mt-3 text-center">Kami menjaga privasi Anda. Tidak ada spam.</p>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
