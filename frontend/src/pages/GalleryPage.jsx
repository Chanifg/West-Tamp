import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function GalleryPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:pb-20">
        <section className="mb-12 text-center md:text-left">
          <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-on-surface mb-4">Galeri Petualangan & Wellness</h1>
          <p className="font-body-md text-lg text-on-surface-variant max-w-2xl">Jelajahi momen-momen penuh energi di sungai dan ketenangan otentik di desa kami. Temukan inspirasi untuk kunjungan Anda berikutnya.</p>
        </section>

        <section className="mb-12 flex flex-wrap gap-2 justify-center md:justify-start">
          <button className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-md shadow-sm transition-all">Semua</button>
          <button className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md transition-all">River Tubing</button>
          <button className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md transition-all">Wellness & Kesehatan</button>
          <button className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md transition-all">UMKM & Kuliner</button>
          <button className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md transition-all">Suasana Desa</button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 auto-rows-[280px] gap-6">
          <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-8 row-span-2 cursor-pointer bg-surface-container">
            <img alt="River Tubing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOTZZ8_RLfTuuhJvhg6nPU7eRArLIy_huWkADAaxClQGgsjwxrNmyDE7PHVLxCUAIyPpc86xQ4ApBGvR9Q7So3kVpNCWDbQmPRoulA1leKfbmdLA3PP-NJ0Auhje4B--PJGSZVtVTMEl7Gyaex3Jaq_GZih8-EZ114wZA9TCUExdg5tyo0r5NzVVaLwMonu-Zx7z7uf1oMJtgTeHW1SpUw9chmEBSmnf-RC6ipQzZVo3ZSPTVHTB5e_GxR4_UAR-nd-KTgIT2Rt_Jz"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/80 via-[#012d1d]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full -translate-y-2 group-hover:-translate-y-4 transition-transform duration-300">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-label-sm mb-2 border border-white/30">River Tubing</span>
              <h3 className="font-headline-lg text-3xl font-semibold text-white mb-1">Arus Deras Penuh Tawa</h3>
              <p className="font-body-md text-emerald-50/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span> Sungai Tampirkulon
              </p>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-4 row-span-1 cursor-pointer bg-surface-container">
            <img alt="Wellness Screening" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOzEw--9OKMLuzJ0i3TJXhf-6z7vXczKas0mW_FousLHjkrfkGzKUgQFHVbR-SLueDzv3KuvB6NQGJ1potoMSnqjmF0pSH5vxhgSMQdy_r_BNksw2AoiO8HT5sx6v5xexPvSFEYPTaO1dO6xfScjPBlCnF2kPv9mUi5QYFvnky5hVsWar9pqN01yr6e86OnYyFsmSrUqyXqgkx_TQ7KbnkCLfunbohcSwxQT2NKLqUYRS_th0n8a3YblaZsmXMhehF_108VrD-j3KD"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-white font-label-sm text-[10px] mb-1 border border-white/30">Wellness & Kesehatan</span>
              <h3 className="font-headline-md text-xl font-semibold text-white mb-1 leading-tight">Posyandu Lansia</h3>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-4 row-span-1 cursor-pointer bg-surface-container">
            <img alt="Village Landscape" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDs_UucNDis3TG7thsznk9RUYtxwTTfbMLyruU1GR16NV5mU4-nisI8P5FxnmxM9ZfZ9lnz8Ebd4_TGSHblgDBVICiXCFGfVyHPJOsFFLWbyWTK6FzvyW8YF3U5fFun34LOjh4vxI_9V1fXCe98Wuz8WTraAaq5LBUSr1751WmGj3OyT-E4718BSumUd3EZPkWQ2HUYG31OsnoKBDFLKa3aMLxn0G-ElQ6ZyF1sIXV93vBSWBuqaNtjUfDeuhQogxWkZii9Q7Z728N"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-white font-label-sm text-[10px] mb-1 border border-white/30">Suasana Desa</span>
              <h3 className="font-headline-md text-xl font-semibold text-white mb-1 leading-tight">Pagi di Tampirkulon</h3>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-6 row-span-1 cursor-pointer bg-surface-container">
            <img alt="Bakso Lele Culinary" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5m4Ue0oq9C5FEqj8C_yQ6_gcvfR5dyKgC0g3KIs2_QEvv6TGbfKczEkDRJjTOQUIYIzd7b8pX8TB_ZxTSrtlKPGOSv3i5Uexfui_18srnyxrXjslKP4Pry_Fm7i0hUpVucPzsbC4obYtptzajXE5jMNN8-nU77lqJMmZ7tvK2PKgF_9BpXx0-YUujWR3KV0E-2E4wybO9VUv-RrGJh3_0DrBmoBTZDEnhXOVR0hl_nYYF6HOYWnP_DApwaQhF0avhAMbbOv8BPS6"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f1d00]/80 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-white font-label-sm text-[10px] mb-1 border border-white/30">UMKM & Kuliner</span>
              <h3 className="font-headline-md text-xl font-semibold text-white mb-1 leading-tight">Bakso Lele Khas Warga</h3>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-6 row-span-1 cursor-pointer bg-surface-container">
            <img alt="River Tubing Joy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbGK0mYewPOS8eWI7Mkmr_EFPLN_X5Pze9MZeri2wvYJbW57fVP1GLQUkX5KlDswwOL3Qe4RztFfdyBk2xaHaKaVX7XMVZMty7vkam0Ty98G563vJjAgtpDoI63y_76wS2fvSr_t9qRUERl1TDhvewzw0jJCmXGgRNgE3l7RXuUBhYvCzkUH_sap1t6jj4ZzM5ujJHJq791wD73qzHydqhVCQmUNt_0KlQQ8FlizA031OZNNfhDEQY8HtvvNhssWd8RQ7JqJCtL-Md"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-white font-label-sm text-[10px] mb-1 border border-white/30">River Tubing</span>
              <h3 className="font-headline-md text-xl font-semibold text-white mb-1 leading-tight">Petualangan Bersama</h3>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
