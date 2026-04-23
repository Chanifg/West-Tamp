import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/blogs')
      .then(res => {
        // Take the latest 3 blogs
        setBlogs(res.data.slice(0, 3));
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingBlogs(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://lh3.googleusercontent.com/aida-public/AB6AXuAeodPvk7ZVRaCZ8Dzxa2CaNkefcVlz_6v_sCkCS4GCcoBWuz3FtQOi2WSzW_JeKkQLVCj8H3-7RTCZfvpnhvZYVybTkfa9A4ZZIYy7Su9PW721JgF98MDNRDstC-jAim0TMjEtdfwUw2uW5q7LL4UJIIYj7FkWS-A03cK7Rdvs6QzZtNFXWNmbxPO3Kxswmkn5eczCw1G2O6TjFMRBZIri4crxrFFpV7vQSB6kIhTOmtHTFlM2We42VjZs6xepk14IttpeyC4R4Jsd";
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] md:min-h-[921px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="River tubing scenery" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOV8Fkil5gWn5WomVc0jKUkQHDc8RObXooZsrAws6uo_eHX0YyP3JeaLcQ1IkJbNUys7DUp-QhUW80UyOFzM0GkoH4QwaDK4Ez8k7fB1WMxnzO46WfgkDLhHz0o__H0hYRpcg3RSrvDntGoHkL4Z-wZh7sgvg0L8dje628nV-qlqkGv0b-TJwyItSFHUE993Wg31-Jn6i1lZ0s0a71VRNjznmn6QHkjQDZd31p7JoGc4AVTRxzpbGjTGqDXg15KeCd530DS7_7KXnr" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-6 md:px-12 w-full text-center mt-20">
            <span className="inline-block px-4 py-2 bg-primary-container/90 backdrop-blur-sm text-on-primary-container rounded-full font-label-sm font-bold tracking-wider uppercase mb-6 shadow-lg">
              Wellness-tourism di Desa Tampirkulon
            </span>
            <h1 className="font-headline-xl text-4xl md:text-6xl lg:text-[64px] text-on-primary drop-shadow-xl mb-6 max-w-4xl mx-auto leading-tight font-bold">
              Westtamp Wellness: <br/> Petualangan Seru & Karya Lokal
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link to="/booking">
                <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-md font-bold shadow-xl hover:bg-primary hover:text-white transition-all active:scale-95 cursor-pointer">
                  Book Your Escape
                </button>
              </Link>
              <button className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full font-label-md font-bold hover:bg-white/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                Watch Video
              </button>
            </div>

            {/* Stats Bento Box */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-surface-variant shadow-[0_8px_30px_rgb(27,67,50,0.12)] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-container/10 rounded-full mx-auto mb-4 text-primary-container">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div className="font-headline-lg text-3xl font-bold text-primary mb-1">1000+</div>
                <div className="font-label-sm text-on-surface-variant">Happy Visitors</div>
              </div>
              <div className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-surface-variant shadow-[0_8px_30px_rgb(27,67,50,0.12)] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-container/10 rounded-full mx-auto mb-4 text-primary-container">
                  <span className="material-symbols-outlined">star</span>
                </div>
                <div className="font-headline-lg text-3xl font-bold text-primary mb-1">4.9</div>
                <div className="font-label-sm text-on-surface-variant">Average Rating</div>
              </div>
              <div className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-surface-variant shadow-[0_8px_30px_rgb(27,67,50,0.12)] hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-container/10 rounded-full mx-auto mb-4 text-primary-container">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div className="font-headline-lg text-3xl font-bold text-primary mb-1">100%</div>
                <div className="font-label-sm text-on-surface-variant">Safety Record</div>
              </div>
            </div>
          </div>
        </section>

        {/* Fasilitas Section */}
        <section className="py-24 px-6 md:px-12 max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-xl text-3xl md:text-headline-lg text-primary mb-4 font-bold">Pilar Fasilitas Kami</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">Kami mengutamakan keselamatan, kesehatan, dan kenyamanan Anda selama menikmati wisata alam di Desa Tampirkulon.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:shadow-[0_8px_30px_rgb(27,67,50,0.15)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container mb-6 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-3xl">water_drop</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">Keamanan Tubing</h3>
              <p className="font-body-md text-on-surface-variant">Perlengkapan safety gear standar internasional dan pemandu tersertifikasi untuk setiap petualangan.</p>
            </div>
            {/* Pillar 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:shadow-[0_8px_30px_rgb(27,67,50,0.15)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-error-container rounded-xl flex items-center justify-center text-on-error-container mb-6 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-3xl">monitor_heart</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">Fasilitas Kesehatan</h3>
              <p className="font-body-md text-on-surface-variant">Layanan free checkup sebelum memulai aktivitas untuk memastikan kondisi fisik prima.</p>
            </div>
            {/* Pillar 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:shadow-[0_8px_30px_rgb(27,67,50,0.15)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center text-on-tertiary-fixed mb-6 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-3xl">restaurant</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">Konsumsi Sehat</h3>
              <p className="font-body-md text-on-surface-variant">Sajian lokal bergizi tinggi seperti olahan lele segar dan minuman hangat jahe telang.</p>
            </div>
            {/* Pillar 4 */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.08)] hover:shadow-[0_8px_30px_rgb(27,67,50,0.15)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center text-on-primary-fixed mb-6 group-hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-3xl">deck</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">Kenyamanan Publik</h3>
              <p className="font-body-md text-on-surface-variant">Area bilas bersih, loker aman, dan ruang istirahat yang menyatu dengan alam pedesaan.</p>
            </div>
          </div>
        </section>

        {/* Blog & Kabar Lokal Section */}
        <section className="py-24 px- margin md:px-12 max-w-container-max mx-auto bg-surface-container-low/30">
          <div className="text-center mb-16">
            <h2 className="font-headline-xl text-3xl md:text-headline-lg text-primary mb-4 font-bold">Kabar dari Aliran Sungai & Desa</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">Temukan inspirasi kesejahteraan, cerita petualangan seru, dan perkembangan terbaru dari komunitas lokal Tampirkulon. Merawat bumi, merawat diri.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingBlogs ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-surface-variant"></div>
              ))
            ) : blogs.length > 0 ? (
              blogs.map(blog => (
                <article key={blog.id} className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-[0_4px_20px_rgb(27,67,50,0.05)] hover:shadow-[0_8px_30px_rgb(27,67,50,0.12)] transition-all duration-300 flex flex-col group">
                  <div className="h-48 overflow-hidden">
                    <img 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={getImageUrl(blog.image_url)} 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="font-label-sm text-primary mb-3 font-semibold">{formatDate(blog.created_at)}</div>
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="font-headline-md text-xl text-on-surface mb-3 font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="font-body-md text-sm text-on-surface-variant mb-6 flex-grow line-clamp-3">
                      {blog.excerpt || blog.content}
                    </p>
                    <Link 
                      to={`/blog/${blog.slug}`} 
                      className="font-label-md text-primary font-bold hover:text-primary-container transition-colors inline-flex items-center gap-1 mt-auto"
                    >
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
                <div className="col-span-3 text-center py-10 text-on-surface-variant">Belum ada kabar terbaru.</div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/blog">
              <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">
                Lihat Semua Artikel
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
