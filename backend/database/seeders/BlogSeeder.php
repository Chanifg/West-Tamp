<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run()
    {
        $categories = ["Tips Wellness", "Cerita Petualangan", "Warta Desa", "UMKM Lokal"];
        $authors = ["Admin Westtamp", "Tim Kreatif", "Mas Budi", "Mbak Sari"];
        
        $data = [
            [
                'title' => 'Rahasia Kebugaran Tubuh dengan Terapi Air Sungai',
                'category' => 'Tips Wellness',
                'content' => 'Sungai bukan hanya tempat bermain, tapi juga sarana penyembuhan alami. Aliran air yang jernih di Westtamp memberikan terapi dingin yang baik untuk sirkulasi darah...',
            ],
            [
                'title' => 'Menjelajahi Keindahan Tersembunyi Desa Tampirkulon',
                'category' => 'Cerita Petualangan',
                'content' => 'Di balik rimbunnya pepohonan, tersimpan sejuta pesona yang belum banyak diketahui orang. Perjalanan kami dimulai dari menyusuri pematang sawah hingga sampai ke air terjun kecil...',
            ],
            [
                'title' => 'Pemberdayaan Pemuda Desa Melalui Wisata Tubing',
                'category' => 'Warta Desa',
                'content' => 'Wisata tubing Westtamp kini menjadi motor penggerak ekonomi warga. Banyak pemuda yang terlibat aktif sebagai pemandu profesional dan pengelola operasional harian...',
            ],
            [
                'title' => 'Kisah Sukses Kopi Robusta Asli Tampirkulon',
                'category' => 'UMKM Lokal',
                'content' => 'Kopi bukan sekadar minuman, tapi identitas. Petani kopi di desa kami mulai bangkit dengan kemasan yang lebih modern dan rasa yang tetap otentik peninggalan leluhur...',
            ],
            [
                'title' => 'Panduan Aman Bermain Tubing untuk Pemula',
                'category' => 'Tips Wellness',
                'content' => 'Keamanan adalah prioritas utama kami. Pastikan Anda selalu menggunakan pelampung dan helm, serta mengikuti setiap instruksi dari pemandu lapangan...',
            ],
            [
                'title' => 'Festival Budaya Desa Magelang: Sebuah Catatan',
                'category' => 'Warta Desa',
                'content' => 'Minggu lalu desa kami diramaikan dengan pagelaran seni tradisional. Ini adalah upaya kami menjaga warisan budaya agar tetap lestari di tengah zaman modern...',
            ],
            [
                'title' => 'Spot Foto Instagramable di Sepanjang Jalur Tubing',
                'category' => 'Cerita Petualangan',
                'content' => 'Siapkan kamera Anda! Ada 5 titik rahasia di mana cahaya matahari masuk menembus pepohonan, menciptakan suasana magis untuk kenang-kenangan Anda...',
            ],
            [
                'title' => 'Manfaat Relaksasi di Alam untuk Kesehatan Mental',
                'category' => 'Tips Wellness',
                'content' => 'Sound of nature bukan sekadar mitos. Suara gemericik air dan kicauan burung di Westtamp terbukti mampu menurunkan tingkat stres secara signifikan...',
            ],
            [
                'title' => 'Mengenal Lebih Dekat Kerajinan Bambu Warga Desa',
                'category' => 'UMKM Lokal',
                'content' => 'Selain bertani, warga Tampirkulon mahir mengolah bambu menjadi perabotan rumah tangga bernilai seni tinggi. Mari dukung produk lokal desa kita...',
            ],
            [
                'title' => 'Agenda Kerja Bakti Bersama Membersihkan Sungai',
                'category' => 'Warta Desa',
                'content' => 'Menjaga kebersihan sungai adalah tanggung jawab bersama. Seluruh warga dan tim pengelola rutin bergotong royong menjaga aliran tetap jernih dan bebas sampah...',
            ],
            [
                'title' => 'Petualangan Malam: Mencari Jejak Kunang-kunang',
                'category' => 'Cerita Petualangan',
                'content' => 'Sensasi berbeda ditawarkan saat malam hari. Masih ada area di desa kami yang dipenuhi kunang-kunang di saat musim tertentu, sebuah pemandangan langka...',
            ],
            [
                'title' => 'Resep Minuman Jahe Hangat ala Kedai Westtamp',
                'category' => 'Tips Wellness',
                'content' => 'Setelah lelah bermain air, wedang jahe adalah kunci. Campuran rempah rahasia kami akan mengembalikan kehangatan tubuh Anda seketika...',
            ],
            [
                'title' => 'Wisata Edukasi: Mengenal Flora di Pinggir Sungai',
                'category' => 'Cerita Petualangan',
                'content' => 'Bermain sambil belajar. Kami mendata puluhan jenis tanaman obat yang tumbuh liar di sepanjang daerah aliran sungai yang bisa dipelajari oleh anak-anak...',
            ],
            [
                'title' => 'Peningkatan Fasilitas Parkir untuk Kenyamanan Pengunjung',
                'category' => 'Warta Desa',
                'content' => 'Kami mendengar masukan Anda. Kini area parkir telah diperluas dan dijaga ketat agar kendaraan pengunjung aman selama menikmati wahana tubing...',
            ],
            [
                'title' => 'Sorgum: Tanaman Alternatif Masa Depan Desa',
                'category' => 'UMKM Lokal',
                'content' => 'Beberapa petak lahan di desa mulai ditanami sorgum sebagai diversifikasi pangan. Mari mengenal lebih jauh manfaat tanaman yang kaya serat ini...',
            ],
            [
                'title' => 'Kenapa Anda Harus Mencoba Tubing Minimal Sekali Seumur Hidup',
                'category' => 'Cerita Petualangan',
                'content' => 'Adrenalin dan ketenangan bersatu. Tubing memberikan perspektif unik dari sudut pandang permukaan air yang tidak didapatkan saat berjalan kaki...',
            ],
            [
                'title' => 'Latihan Pernapasan di Udara Segar Pedesaan',
                'category' => 'Tips Wellness',
                'content' => 'Udara di sini masih murni karena jauh dari polusi kota. Manfaatkan waktu pagi untuk bermeditasi dan mengatur ritme napas demi paru-paru yang sehat...',
            ],
            [
                'title' => 'Rencana Pembangunan Jembatan Gantung Ikonik',
                'category' => 'Warta Desa',
                'content' => 'Pemerintah desa berencana membangun jembatan gantung yang akan menghubungkan dua dusun sekaligus menjadi spot selfie baru bertema petualangan...',
            ],
            [
                'title' => 'Kripik Talas Renyah: Camilan Wajib Saat Pulang',
                'category' => 'UMKM Lokal',
                'content' => 'Talas melimpah di kebun belakang rumah warga. Dengan teknik penggorengan tradisional, terciptalah kripik yang gurih tanpa bahan pengawet...',
            ],
            [
                'title' => 'Memperingati Hari Air Sedunia di Westtamp Wellness',
                'category' => 'Warta Desa',
                'content' => 'Acara ini diisi dengan penanaman ribuan bibit pohon di hulu sungai untuk memastikan kelestarian air demi generasi yang akan datang...',
            ],
        ];

        foreach ($data as $index => $blogData) {
            Blog::create([
                'title' => $blogData['title'],
                'slug' => Str::slug($blogData['title']) . '-' . uniqid(),
                'category' => $blogData['category'],
                'author' => $authors[array_rand($authors)],
                'excerpt' => Str::limit($blogData['content'], 120),
                'content' => $blogData['content'] . "\n\n" . "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                'image_url' => 'https://picsum.photos/seed/' . $index . '/800/600', // Random placeholder image
                'is_featured' => ($index === 0), // Use first one as featured
                'created_at' => now()->subDays($index),
            ]);
        }
    }
}
