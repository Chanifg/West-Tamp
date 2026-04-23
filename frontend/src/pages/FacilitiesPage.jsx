import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FacilitiesPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
        {/* Page Header */}
        <section className="text-center mb-16">
          <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-primary mb-4">Pilar Fasilitas Kami</h1>
          <p className="font-body-md text-lg text-on-surface-variant max-w-2xl mx-auto">Kami mengutamakan keselamatan, kesehatan, dan kenyamanan Anda selama menikmati wisata alam di Desa Tampirkulon. Fasilitas kami dibangun untuk memberikan rasa aman optimal dan ketenangan pikiran.</p>
        </section>

        {/* Detailed Facilities Content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
            <div>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoiKRb9VzsbHQZxu2_LlpaIk3MVvRkS_546pktQ6TmCIGO0em00RUmXl1AvVeh8IrahnCiXgJZs5BbJkU4os-h_rhX_f9NjR-E4O_UE00lHcbMB9CZ78_t90L6MY61INPRQI2O6cAxGzM9gSie8EdSuqJYDwJNqzSBtN7ZAGEhfArJfuU2za_q8l-XMvyhJge8aaze86sMUwqp8rpJw_wWKpYdPlOzTovZ-cIhkkWKcr-dkNkppFrmgEkRkndpfB8pzdhs6xtuh4A_" alt="Keamanan Tubing" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-on-secondary-container mb-6 text-2xl font-bold">1</div>
                <h2 className="font-headline-lg text-3xl font-semibold text-on-surface mb-4">Keamanan Tubing Kelas Atas</h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                    Aktivitas mengarungi sungai memberikan sensasi tak terlupakan, namun kami tidak pernah berkompromi soal keselamatan. Westtamp Wellness melengkapi setiap pengunjung dengan pelampung standar internasional, helm keselamatan, serta pengawasan dari tim pemandu lokal tersertifikasi yang sangat memahami kontur sungai.
                </p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-secondary">check_circle</span> Perlengkapan Standar SNI & Internasional</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-secondary">check_circle</span> Pemantauan arus real-time</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-secondary">check_circle</span> Rescue Team on Standby</li>
                </ul>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
            <div className="order-2 md:order-1 flex flex-col justify-center">
                <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center text-on-error-container mb-6 text-2xl font-bold">2</div>
                <h2 className="font-headline-lg text-3xl font-semibold text-on-surface mb-4">Fasilitas Kesehatan Terpadu</h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                    Sebagai destinasi wellness-tourism, kesehatan Anda adalah fokus utama kami. Di setiap titik kumpul kami menyediakan layanan kesehatan dasar yang dikelola oleh tenaga medis dan kader desa yang terlatih.
                </p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-error">favorite</span> Pemeriksaan Tekanan Darah Gratis</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-error">monitor_weight</span> Pengukuran Tinggi & Berat Badan (IMT)</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-error">medical_services</span> Kotak P3K Lengkap & Tandu Evakuasi</li>
                </ul>
            </div>
            <div className="order-1 md:order-2">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOzEw--9OKMLuzJ0i3TJXhf-6z7vXczKas0mW_FousLHjkrfkGzKUgQFHVbR-SLueDzv3KuvB6NQGJ1potoMSnqjmF0pSH5vxhgSMQdy_r_BNksw2AoiO8HT5sx6v5xexPvSFEYPTaO1dO6xfScjPBlCnF2kPv9mUi5QYFvnky5hVsWar9pqN01yr6e86OnYyFsmSrUqyXqgkx_TQ7KbnkCLfunbohcSwxQT2NKLqUYRS_th0n8a3YblaZsmXMhehF_108VrD-j3KD" alt="Fasilitas Kesehatan" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
            <div>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5m4Ue0oq9C5FEqj8C_yQ6_gcvfR5dyKgC0g3KIs2_QEvv6TGbfKczEkDRJjTOQUIYIzd7b8pX8TB_ZxTSrtlKPGOSv3i5Uexfui_18srnyxrXjslKP4Pry_Fm7i0hUpVucPzsbC4obYtptzajXE5jMNN8-nU77lqJMmZ7tvK2PKgF_9BpXx0-YUujWR3KV0E-2E4wybO9VUv-RrGJh3_0DrBmoBTZDEnhXOVR0hl_nYYF6HOYWnP_DApwaQhF0avhAMbbOv8BPS6" alt="Konsumsi Sehat" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="w-16 h-16 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-on-tertiary-fixed mb-6 text-2xl font-bold">3</div>
                <h2 className="font-headline-lg text-3xl font-semibold text-on-surface mb-4">Konsumsi Sehat Bernutrisi</h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                    Berkegiatan di luar ruangan membutuhkan asupan energi yang baik. Kami menyajikan hidangan lokal bergizi dan sehat yang memberdayakan hasil panen kelompok tani Desa Tampirkulon, disajikan segar tanpa bahan pengawet sintetik.
                </p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-tertiary">restaurant</span> Bakso Ikan Lele Tinggi Protein</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-tertiary">local_cafe</span> Wedang Jahe Telang Hangat & Merilekskan</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-tertiary">eco</span> Sayuran Segar Hasil Panen Lokal</li>
                </ul>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8 items-center">
             <div className="order-2 md:order-1 flex flex-col justify-center">
                <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-on-primary-fixed mb-6 text-2xl font-bold">4</div>
                <h2 className="font-headline-lg text-3xl font-semibold text-on-surface mb-4">Kenyamanan Publik Extra</h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                    Sebuah destinasi belum lengkap tanpa fasilitas pendukung yang memadai. Westtamp Wellness memastikan kebersihan dan ketersediaan ruang umum yang layak bagi setiap anggota komunitas dan wisatawan.
                </p>
                <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-primary">directions_car</span> Area Parkir Luas & Aman</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-primary">inventory_2</span> Loker Penyimpanan Barang</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-primary">mosque</span> Musala Bersih dan Nyaman</li>
                    <li className="flex items-center gap-3 text-on-surface-variant"><span className="material-symbols-outlined text-primary">wc</span> Kamar Bilas & Toilet Estetik</li>
                </ul>
            </div>
            <div className="order-1 md:order-2">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDs_UucNDis3TG7thsznk9RUYtxwTTfbMLyruU1GR16NV5mU4-nisI8P5FxnmxM9ZfZ9lnz8Ebd4_TGSHblgDBVICiXCFGfVyHPJOsFFLWbyWTK6FzvyW8YF3U5fFun34LOjh4vxI_9V1fXCe98Wuz8WTraAaq5LBUSr1751WmGj3OyT-E4718BSumUd3EZPkWQ2HUYG31OsnoKBDFLKa3aMLxn0G-ElQ6ZyF1sIXV93vBSWBuqaNtjUfDeuhQogxWkZii9Q7Z728N" alt="Kenyamanan Ekstra" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
