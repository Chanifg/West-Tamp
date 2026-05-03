import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FacilitiesPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="">
        {/* Hero Section */}
        <section className="relative min-h-[614px] flex items-center justify-center overflow-hidden bg-primary-container">
          <div className="absolute inset-0 z-0">
            <img alt="Lanskap Westtamp Wellness" className="w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz6HL8zyLy6ECV2qNQyKDbHz2z1HIk9BmtLmsHuw4FHBblzq2iFF2Z7sFwn4t3RQ_YrLkXUIRTIjF-VAhbc0AgZ_kd3aHNVzA-jR3AxB0EV7maWwgoUdP5qfJlnzc07jVVHfGoFahcDzqDnPhW4S4Q6gWR1uL-I5MSc2Rkgn-R4xl5cuAi9dp81AVpG_Jk0-44rEZ6tpXS7DpxCu13lEc0OvC3twzldDIs0ejPV7pwM4iRts8blROgV0z_BLSwSuZgwiX-tT43wEax" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 via-primary-container/50 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container-low/20 backdrop-blur-sm text-on-primary-container font-label-sm text-sm uppercase tracking-widest mb-6 border border-on-primary-container/20">Westtamp Wellness</span>
            <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-surface-container-lowest mb-6 text-balance">Fasilitas & Kenyamanan Kami</h1>
            <p className="font-body-lg text-lg text-surface-container-low max-w-6xl mx-auto text-balance">
              Kami memprioritaskan keamanan dan kesejahteraan fisik Anda. Fasilitas kami dirancang khusus untuk berpadu harmonis dengan alam sekitar Tampirkulon, memastikan Anda merasa segar dan aman sebelum, selama, dan setelah petualangan Anda.
            </p>
          </div>
        </section>

        {/* Bento Grid Facilities */}
        <section className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,_auto)]">
            {/* Safety Facility - Large Card */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(27,67,50,0.08)] group hover:shadow-[0_12px_40px_rgba(27,67,50,0.12)] transition-shadow duration-300 relative">
              <div className="absolute top-0 right-0 w-1/2 h-full hidden md:block">
                <img alt="Peralatan Keamanan" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcCMzvrzEZobQGxgFLAHoiJYcPxwV3_vx1_c6DHxWV6HsygaZMbk_OhrPLOoOvNgotInkZM4LTMhjKXLAfLYhGgkBhCOw6sFqy6xrUOoJzZqgpF4rwhPRv2kBZLCKVR_3Jq2nAZEkdrta-UM9awj8ry2cP58pyYWbWKccx7_cGTdIt_6yyvJdvPm1hsrZFVFMAWkHcHrO2OwtKSPszIkSR9jEH42ONQIFsRI6qGJ6NbcmeMTdfKIWrcgwUXPG-ug8AM4vcY-co-IzP" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
              </div>
              <div className="relative z-10 p-6 md:p-12 h-full flex flex-col justify-center max-w-md">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <h2 className="font-headline-md text-2xl font-semibold text-on-surface mb-4">Keamanan Tubing</h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                  Keamanan Anda adalah komitmen utama kami. Area persiapan keamanan kami menyediakan akses ke helm berkualitas premium dan pelampung bersertifikat ISO yang pas untuk Anda.
                </p>
                <ul className="space-y-3 font-body-md text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1 text-[18px]">check_circle</span>
                    Pemasangan perlengkapan pelindung tingkat profesional
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1 text-[18px]">check_circle</span>
                    Briefing keamanan wajib oleh pemandu sungai
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1 text-[18px]">check_circle</span>
                    Penyimpanan barang pribadi yang aman selama tubing
                  </li>
                </ul>
              </div>
            </div>

            {/* Health Screening - Small Card */}
            <div className="md:col-span-4 bg-primary-container text-on-primary-container rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(27,67,50,0.08)] p-6 flex flex-col relative">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mb-4 relative z-10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <h2 className="font-headline-md text-2xl font-semibold mb-4 relative z-10">Fasilitas Kesehatan</h2>
              <p className="font-body-md opacity-90 mb-6 relative z-10 flex-grow">
                Kami memastikan Anda fit untuk berpetualang. Kunjungi stasiun kesehatan kami untuk pemeriksaan kesehatan pra-aktivitas gratis.
              </p>
              <div className="space-y-2 relative z-10 bg-primary/20 p-4 rounded-lg">
                <div className="flex justify-between items-center font-label-md text-sm font-semibold">
                  <span>Cek Tekanan Darah</span>
                  <span className="material-symbols-outlined text-sm">blood_pressure</span>
                </div>
                <div className="flex justify-between items-center font-label-md text-sm font-semibold">
                  <span>Berat Badan & BMI</span>
                  <span className="material-symbols-outlined text-sm">scale</span>
                </div>
                <div className="flex justify-between items-center font-label-md text-sm font-semibold">
                  <span>Pertolongan Pertama Dasar</span>
                  <span className="material-symbols-outlined text-sm">medical_services</span>
                </div>
              </div>
            </div>

            {/* Nutrition - Small Card */}
            <div className="md:col-span-5 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(27,67,50,0.08)] flex flex-col group">
              <div className="h-48 relative overflow-hidden">
                <img alt="Makanan Lokal Sehat" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiAwCJNq_plsvC9qZuE8p5W8Vct5FLdeRlwl3cqLV27P-T6A25gEIOtg6gKcpRT_Wid_bWVtnI04fAvYhQ04Z-H-_InNn7v9yFzv7x2P6afYn7u-FGHg4tsRSuEUuz3fqb-X2s2MAAkdpQKDevfHqFWK9TMkgoPFaMPHzLHAPeX-GfaGOWXYvkWgNMZqeDZ4IQ5gX14pcC0n6lpN6Nu8fb-6yiwTfj-69Hk7JMAIkqzb3EosPG-Skcfz5jRJOyfv1lHUA_eBE8nul-" />
                <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-xs font-medium backdrop-blur-md">
                  Lokal & Organik
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-12 h-12 rounded-full text-on-surface flex items-center justify-center mb-4 bg-primary-fixed text-on-primary-fixed">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                </div>
                <h2 className="font-headline-md text-2xl font-semibold text-on-surface mb-4">Konsumsi Sehat</h2>
                <p className="font-body-md text-on-surface-variant mb-6 flex-grow">
                  Isi ulang tenaga dengan penuh kesadaran. Paviliun makan kami menyajikan hidangan lokal yang menyehatkan, dirancang untuk memulihkan tubuh Anda setelah beraktivitas di sungai.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-surface-container p-3 rounded-lg text-center">
                    <span className="block font-label-md text-sm font-semibold text-on-surface mb-1">Bakso Lele</span>
                    <span className="font-label-sm text-xs font-medium text-on-surface-variant block">Protein Tinggi</span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-lg text-center">
                    <span className="block font-label-md text-sm font-semibold text-on-surface mb-1">Jahe Telang</span>
                    <span className="font-label-sm text-xs font-medium text-on-surface-variant block">Teh Antioksidan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Public Comfort - Large Card */}
            <div className="md:col-span-7 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(27,67,50,0.08)] flex flex-col md:flex-row group">
              <div className="p-6 md:p-12 flex flex-col justify-center md:w-1/2 order-2 md:order-1">
                <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                </div>
                <h2 className="font-headline-md text-2xl font-semibold text-on-surface mb-4">Kenyamanan Publik</h2>
                <p className="font-body-md text-on-surface-variant mb-6">
                  Transisi dari petualangan ke relaksasi dengan lancar. Fasilitas publik kami dirancang dengan mempertimbangkan kebersihan, privasi, dan keselarasan lingkungan.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">shower</span>Shower Bersih
                  </span>
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">door_sliding</span> Ruang Ganti Privat
                  </span>
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">lock</span> Loker Aman
                  </span>
                  <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">nature_people</span> Area Istirahat Teduh
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 h-64 md:h-auto order-1 md:order-2 overflow-hidden">
                <img alt="Fasilitas Kenyamanan Publik" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWBQyLKyngElzvPRpSLvASpgQQ6hTejCJgQd1ylzHqKa_9QiAKvVV7l1iTASxrOBOESxzBawUYML-lfK5tvj0gfQeh84utBN9QTvVCYvz-mA2OzddSWxx6qVgkRwT4JRUtqaaFQSVc0zHcuIbvLWQn70Km_G364D75GtIiG7xXgIpwLh3ooINKmwFwGmNkMbfT3ZGDlAi11bJLeBBdx3KlnijsrOVV_cYXdQqttOfHrinh29fjVUAnec3DbHGT8sdBJWNjNdcnV3Z6" />
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="bg-surface-container-low py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="font-headline-lg text-3xl font-semibold text-on-surface mb-4">Lokasi Kami</h2>
              <p className="font-body-md text-on-surface-variant">Temukan kami di jantung alam. Mudah dijangkau namun menawarkan pelarian sempurna dari hiruk-pikuk perkotaan. Berikut adalah panduan menuju Westtamp Wellness.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 rounded-lg overflow-hidden bg-surface-container h-80 relative flex items-center justify-center">
                <iframe
                  title="Peta Lokasi Westtamp Wellness"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.912386274291!2d110.279893414777!3d-7.581691894532658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8bb03b9b00eb%3A0x805213697e88b5ba!2sTampirkulon%2C%20Kec.%20Muntilan%2C%20Kabupaten%20Magelang%2C%20Jawa%20Tengah!5e0!3m2!1sen!2sid!4v1683908253164!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/50">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-sm font-semibold text-on-surface">Alamat Lengkap</h3>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">Desa Wisata Tampirkulon, Kecamatan Muntilan, Kabupaten Magelang, Jawa Tengah, Indonesia.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/50">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">directions_car</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-sm font-semibold text-on-surface">Aksesibilitas</h3>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">Dapat dijangkau dengan kendaraan roda dua maupun roda empat. Area parkir luas tersedia di dekat pintu masuk utama.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/50">
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-sm font-semibold text-on-surface">Jam Operasional</h3>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">Buka setiap hari mulai pukul 08:00 WIB hingga 16:00 WIB. Disarankan datang lebih pagi untuk menikmati suasana terbaik.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-on-primary py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 150%, var(--tw-colors-primary-container) 0%, transparent 50%)" }}></div>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-headline-xl text-4xl font-bold mb-6">Siap untuk Vitalitas Alami?</h2>
            <p className="font-body-lg text-lg opacity-90 mb-12 max-w-xl mx-auto">
              Rasakan keseimbangan sempurna antara petualangan sungai yang mendebarkan dan fasilitas kesehatan yang memulihkan. Amankan tempat Anda hari ini.
            </p>
            <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-label-md text-sm font-semibold hover:bg-surface-bright transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2">
              Pesan Petualangan Anda Sekarang
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
