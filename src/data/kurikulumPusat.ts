/**
 * KURIKULUM MERDEKA PUSAT - BSKAP KEMENDIKBUDRISTEK RESMI
 * Sumber: Keputusan Kepala BSKAP Kemendikbudristek No. 032/H/KR/2024 & No. 033/H/KR/2022
 * 
 * Database Capaian Pembelajaran (CP), Elemen, dan Alur Tujuan Pembelajaran (ATP)
 * Terstandarisasi Pemerintah Pusat per Fase & Mata Pelajaran.
 * Guru tidak perlu mengetik ulang dari nol.
 */

export interface AtpTemplateItem {
  no: number;
  tujuanPembelajaran: string;
  elemen: string;
  alokasiWaktu: string;
  profilPancasila: string;
  lingkupMateri: string;
  semester: 'Ganjil' | 'Genap';
  kktpDeskripsi: string;
}

export interface KurikulumMapelData {
  id: string;
  jenjang: 'SD' | 'SMP';
  fase: 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D';
  kelas: string;
  mataPelajaran: string;
  elemenCp: string;
  capaianPembelajaran: string;
  alokasiJPTahunan: string;
  daftarMateriPokok: string[];
  atpList: AtpTemplateItem[];
}

export const DATA_KURIKULUM_PUSAT: KurikulumMapelData[] = [
  // =========================================================================
  // 1. SD - FASE A (KELAS 1 - 2)
  // =========================================================================
  {
    id: 'sd-fase-a-bahasa-indonesia',
    jenjang: 'SD',
    fase: 'Fase A',
    kelas: 'Kelas 1 SD',
    mataPelajaran: 'Bahasa Indonesia',
    elemenCp: 'Menyimak, Membaca dan Memirsa, Berbicara dan Mempresentasikan, Menulis',
    capaianPembelajaran: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, kepada teman sebaya dan orang dewasa di sekitar tentang diri dan lingkungannya melalui berbagai kegiatan berbahasa dan bersastra dengan topik yang beragam dan sesuai dengan tujuan komunikasi.',
    alokasiJPTahunan: '216 JP (6 JP / Minggu)',
    daftarMateriPokok: [
      'Bunyi dan Huruf Vokal/Konsonan di Sekitar',
      'Mengenal Anggota Tubuh dan Pancaindra',
      'Membaca Kata Sederhana Bergambar',
      'Sopan Santun dan Kalimat Tolong, Maaf, Terima Kasih',
      'Benda, Hewan, dan Tanaman di Lingkungan Sekitar',
      'Peristiwa Siang dan Malam Serta Cuaca',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '1.1 Mengenal dan melafalkan bunyi huruf alfabet (vokal dan konsonan) melalui nama-nama benda di lingkungan sekitar.',
        elemen: 'Menyimak & Membaca',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Mandiri, Bernalar Kritis',
        lingkupMateri: 'Bunyi Huruf dan Suku Kata',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu melafalkan dan merangkai minimal 10 kombinasi suku kata terbuka (ba-bi-bu-be-bo) secara lancar.',
      },
      {
        no: 2,
        tujuanPembelajaran: '1.2 Mengeja dan membaca kata-kata sederhana yang sering ditemui sehari-hari disertai gambar pendukung.',
        elemen: 'Membaca dan Memirsa',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Membaca Kata Bergambar',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membaca 15 kosakata dasar tentang benda di kelas dan rumah dengan intonasi tepat.',
      },
      {
        no: 3,
        tujuanPembelajaran: '1.3 Mengungkapkan perasaan, kebutuhan, dan ide sederhana secara lisan dengan santun menggunakan kata tolong dan terima kasih.',
        elemen: 'Berbicara dan Mempresentasikan',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Berakhlak Mulia, Bergotong Royong',
        lingkupMateri: 'Kalimat Santun Sehari-hari',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mempraktikkan percakapan santun meminta bantuan dan mengucap terima kasih kepada guru dan teman.',
      },
      {
        no: 4,
        tujuanPembelajaran: '1.4 Menuliskan huruf lepas dan tegak bersambung sederhana untuk melengkapi nama benda dan diri sendiri.',
        elemen: 'Menulis',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Mandiri, Kreatif',
        lingkupMateri: 'Menulis Huruf dan Kata Dasar',
        semester: 'Genap',
        kktpDeskripsi: 'Menulis rapi nama diri sendiri, anggota keluarga, dan 5 nama benda favorit dengan proporsi huruf tepat.',
      },
      {
        no: 5,
        tujuanPembelajaran: '1.5 Menceritakan kembali isi dongeng fabel atau cerita anak sederhana yang diperdengarkan secara runtut.',
        elemen: 'Menyimak & Berbicara',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Berkebinekaan Global',
        lingkupMateri: 'Menyimak Cerita Anak',
        semester: 'Genap',
        kktpDeskripsi: 'Menjelaskan tokoh utama, sifat tokoh, dan pesan moral dalam dongeng menggunakan bahasa sendiri.',
      },
    ],
  },
  {
    id: 'sd-fase-a-matematika',
    jenjang: 'SD',
    fase: 'Fase A',
    kelas: 'Kelas 1 SD',
    mataPelajaran: 'Matematika',
    elemenCp: 'Bilangan, Aljabar, Pengukuran, Geometri, Analisis Data',
    capaianPembelajaran: 'Peserta didik dapat membilang lambang bilangan cacah sampai dengan 100, melakukan operasi penjumlahan dan pengurangan sampai dengan 20, mengenal bangun datar dan bangun ruang sederhana, serta membandingkan panjang dan berat benda secara konkret.',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Bilangan Cacah 1 sampai dengan 20',
      'Penjumlahan dan Pengurangan Bilangan Cacah sampai 20',
      'Bilangan Cacah sampai dengan 100 dan Nilai Tempat',
      'Bentuk Bangun Datar (Segitiga, Segiempat, Lingkaran) dan Bangun Ruang',
      'Pengukuran Panjang dan Berat Benda dengan Satuan Tidak Baku',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '1.1 Menghitung, membaca, dan menuliskan lambang bilangan cacah 1 sampai dengan 20 menggunakan benda konkret.',
        elemen: 'Bilangan',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Mandiri, Bernalar Kritis',
        lingkupMateri: 'Bilangan Cacah 1 - 20',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membilang urut maju dan mundur serta memasangkan jumlah benda dengan angka 1 sampai 20.',
      },
      {
        no: 2,
        tujuanPembelajaran: '1.2 Melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai dengan 20 menggunakan bantuan jari atau kancing hitung.',
        elemen: 'Bilangan',
        alokasiWaktu: '20 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Penjumlahan dan Pengurangan Kontekstual',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyelesaikan 10 soal cerita kontekstual penjumlahan dan pengurangan sederhana dengan skor minimal 75%.',
      },
      {
        no: 3,
        tujuanPembelajaran: '1.3 Mengenal dan mengelompokkan berbagai bangun datar (segitiga, segiempat, lingkaran) dan bangun ruang (balok, kubus, bola).',
        elemen: 'Geometri',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Kreatif, Bernalar Kritis',
        lingkupMateri: 'Bangun Datar dan Bangun Ruang',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu mengidentifikasi 5 benda di sekitar kelas berdasarkan bentuk bangun dasarnya.',
      },
      {
        no: 4,
        tujuanPembelajaran: '1.4 Membandingkan panjang dan berat dua benda secara langsung menggunakan satuan tidak baku (jengkal, langkah, klip kertas).',
        elemen: 'Pengukuran',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Gotong Royong',
        lingkupMateri: 'Pengukuran Satuan Tidak Baku',
        semester: 'Genap',
        kktpDeskripsi: 'Melakukan pengukuran panjang meja dengan jengkal dan menyatakan perbandingan lebih panjang/pendek.',
      },
    ],
  },
  {
    id: 'sd-fase-a-pendidikan-pancasila',
    jenjang: 'SD',
    fase: 'Fase A',
    kelas: 'Kelas 1 SD',
    mataPelajaran: 'Pendidikan Pancasila',
    elemenCp: 'Pancasila, Undang-Undang Dasar 1945, Bhinneka Tunggal Ika, Negara Kesatuan Republik Indonesia',
    capaianPembelajaran: 'Peserta didik mengenali simbol dan sila Pancasila, mematuhi tata tertib di rumah dan sekolah, menceritakan identitas diri dan menghargai keragaman teman, serta mempraktikkan gotong royong di lingkungan sekitar.',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Aku Cinta Pancasila dan Simbol Lambang Garuda',
      'Aturan dan Tata Tertib di Rumah dan Sekolah',
      'Aku dan Teman-Temanku yang Beragam',
      'Gotong Royong di Lingkungan Sekitar',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '1.1 Menyebutkan simbol dan sila-sila Pancasila serta memasangkan simbol dengan silanya secara tepat.',
        elemen: 'Pancasila',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Beriman, Bertakwa kepada Tuhan YME, Bernalar Kritis',
        lingkupMateri: 'Simbol Lambang Negara Garuda Pancasila',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu melafalkan 5 sila Pancasila dan menunjukkan lambang bintang, rantai, pohon beringin, banteng, padi & kapas.',
      },
      {
        no: 2,
        tujuanPembelajaran: '1.2 Mengidentifikasi aturan yang berlaku di rumah dan di sekolah serta mempraktikkan disiplin waktu.',
        elemen: 'Undang-Undang Dasar 1945',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Mandiri, Berakhlak Mulia',
        lingkupMateri: 'Tata Tertib di Rumah dan Sekolah',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menerapkan tata tertib berpakaian rapi, datang tepat waktu, dan merapikan alat belajar sendiri.',
      },
      {
        no: 3,
        tujuanPembelajaran: '1.3 Menghargai perbedaan suku, bahasa daerah, dan ciri fisik teman sebaya dalam suasana rukun.',
        elemen: 'Bhinneka Tunggal Ika',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Berkebinekaan Global, Bergotong Royong',
        lingkupMateri: 'Keragaman Identitas Teman',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu bekerja sama dalam kelompok belajar tanpa membeda-bedakan latar belakang teman.',
      },
    ],
  },
  {
    id: 'sd-fase-a-pjok',
    jenjang: 'SD',
    fase: 'Fase A',
    kelas: 'Kelas 1 SD',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemenCp: 'Keterampilan Gerak, Pengetahuan Gerak, Pemanfaatan Gerak, Pengembangan Karakter',
    capaianPembelajaran: 'Peserta didik mempraktikkan dan memahami pola gerak dasar lokomotor, non-lokomotor, dan manipulatif melalui permainan sederhana, serta menerapkan kebiasaan hidup bersih dan sehat dalam keseharian.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Pola Gerak Dasar Lokomotor (Jalan, Lari, Lompat)',
      'Pola Gerak Dasar Non-Lokomotor (Liuk, Ayun, Tekuk)',
      'Pola Gerak Dasar Manipulatif (Melempar dan Menangkap Bola)',
      'Senam Ketangkasan dan Irama Dasar',
      'Mengenal Makanan Sehat dan Kebersihan Diri',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '1.1 Mempraktikkan variasi pola gerak dasar lokomotor (berjalan, berlari, melompat) dengan koordinasi yang baik.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Mandiri, Gotong Royong',
        lingkupMateri: 'Gerak Dasar Lokomotor',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu berjalan lurus pada garis titian dan berlari zig-zag tanpa terjatuh.',
      },
      {
        no: 2,
        tujuanPembelajaran: '1.2 Mempraktikkan pola gerak melempar dan menangkap bola kecil dan besar dalam permainan beregu.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Gotong Royong, Bernalar Kritis',
        lingkupMateri: 'Gerak Manipulatif Melempar & Menangkap',
        semester: 'Ganjil',
        kktpDeskripsi: 'Melempar dan menangkap bola dengan dua tangan sebanyak 5 kali berturut-turut.',
      },
      {
        no: 3,
        tujuanPembelajaran: '1.3 Menjelaskan dan mempraktikkan cara mencuci tangan dengan sabun, menjaga kebersihan gigi, dan memakai pakaian bersih.',
        elemen: 'Pemanfaatan Gerak & Kesehatan',
        alokasiWaktu: '12 JP',
        profilPancasila: 'Mandiri, Beriman dan Bertakwa',
        lingkupMateri: 'Budaya Hidup Bersih dan Sehat',
        semester: 'Genap',
        kktpDeskripsi: 'Menunjukkan 6 langkah cuci tangan pakai sabun dan air mengalir secara benar.',
      },
    ],
  },
  {
    id: 'sd-fase-a-pabp',
    jenjang: 'SD',
    fase: 'Fase A',
    kelas: 'Kelas 1 SD',
    mataPelajaran: 'Pendidikan Agama dan Budi Pekerti (PABP)',
    elemenCp: 'Al-Qur\'an dan Hadis, Akidah, Akhlak, Fikih, Sejarah Peradaban Islam',
    capaianPembelajaran: 'Peserta didik mengenal huruf hijaiyah bersambung, menghafal surah-surah pendek pilihan (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas), meyakini Rukun Iman, mempraktikkan doa harian dan tata cara wudhu serta salat fardu.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Huruf Hijaiyah Berharakat dan Surah Al-Fatihah',
      'Mengenal Rukun Iman dan Asmaul Husna (Ar-Rahman, Ar-Rahim)',
      'Adab Berdoa dan Perilaku Kasih Sayang',
      'Tata Cara Bersuci (Bersuci dari Hadas Kecil dan Berwudhu)',
      'Kisah Teladan Nabi Muhammad SAW',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '1.1 Mengenal, membaca, dan melafalkan huruf hijaiyah berharakat fathah, kasrah, dan dhammah dengan makhraj yang benar.',
        elemen: 'Al-Qur\'an dan Hadis',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Beriman dan Bertakwa kepada Tuhan YME',
        lingkupMateri: 'Makharijul Huruf Hijaiyah',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membaca 15 huruf hijaiyah berharakat tunggal secara fasih.',
      },
      {
        no: 2,
        tujuanPembelajaran: '1.2 Menghafalkan Q.S. Al-Fatihah dan Q.S. Al-Ikhlas dengan tartil dan lancar.',
        elemen: 'Al-Qur\'an dan Hadis',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Beriman, Mandiri',
        lingkupMateri: 'Hafalan Surah Pendek',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menghafal utuh Surah Al-Fatihah 7 ayat tanpa terbata-bata.',
      },
      {
        no: 3,
        tujuanPembelajaran: '1.3 Mempraktikkan tata cara berwudhu secara tertib dan rukun sesuai syariat Islam.',
        elemen: 'Fikih',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Mandiri, Beriman dan Bertakwa',
        lingkupMateri: 'Tata Cara Wudhu',
        semester: 'Genap',
        kktpDeskripsi: 'Mempraktikkan rukun dan sunnah wudhu dari niat hingga tertib di tempat wudhu sekolah.',
      },
    ],
  },

  // =========================================================================
  // 2. SD - FASE B (KELAS 3 - 4)
  // =========================================================================
  {
    id: 'sd-fase-b-ipas',
    jenjang: 'SD',
    fase: 'Fase B',
    kelas: 'Kelas 4 SD',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    elemenCp: 'Pemahaman IPAS (Sains dan Sosial), Keterampilan Proses',
    capaianPembelajaran: 'Peserta didik memahami bagian tubuh tumbuhan dan fungsinya, wujud zat dan perubahannya, bentuk energi dan perubahannya, siklus air dan pelestarian sumber daya alam, serta keragaman kearifan lokal daerah tempat tinggalnya.',
    alokasiJPTahunan: '180 JP (5 JP / Minggu)',
    daftarMateriPokok: [
      'Bagian Tubuh Tumbuhan dan Proses Fotosintesis',
      'Wujud Zat dan Perubahannya dalam Kehidupan Sehari-hari',
      'Gaya dan Gerak di Sekitar Kita (Gaya Gesek, Magnet, Gravitasi)',
      'Mengubah Bentuk Energi (Energi Kinetik, Potensial, Listrik)',
      'Cerita Tentang Daerahku dan Sejarah Lokal',
      'Indonesiaku Kaya Budaya dan Kearifan Lokal',
      'Bagaimana Mendapatkan Semua Keperluan Kita (Kegiatan Ekonomi)',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '4.1 Mengidentifikasi bagian-bagian tubuh tumbuhan (akar, batang, daun, bunga, buah) dan mengaitkan fungsinya dengan fotosintesis.',
        elemen: 'Pemahaman IPAS',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Tumbuhan Sumber Kehidupan di Bumi',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu menjelaskan peran klorofil, sinar matahari, air, dan CO2 dalam menghasilkan glukosa dan oksigen.',
      },
      {
        no: 2,
        tujuanPembelajaran: '4.2 Menganalisis wujud zat (padat, cair, gas) serta mendemonstrasikan perubahan wujud zat melalui eksperimen sederhana.',
        elemen: 'Pemahaman IPAS & Keterampilan Proses',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Gotong Royong',
        lingkupMateri: 'Wujud Zat dan Perubahannya',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mempraktikkan peristiwa mencair, membeku, menguap, dan mengembun disertai laporan observasi.',
      },
      {
        no: 3,
        tujuanPembelajaran: '4.3 Mengidentifikasi ragam gaya (gaya otot, gesek, pegas, magnet, gravitasi) dan pengaruhnya terhadap arah serta bentuk gerak benda.',
        elemen: 'Pemahaman IPAS',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Gaya di Sekitar Kita',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyelesaikan percobaan pengaruh permukaan kasar dan halus terhadap gaya gesek benda.',
      },
      {
        no: 4,
        tujuanPembelajaran: '4.4 Menjelaskan konsep transformasi energi (listrik ke panas, kimia ke gerak) dan penerapannya pada teknologi ramah lingkungan.',
        elemen: 'Pemahaman IPAS',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Kreatif, Bernalar Kritis',
        lingkupMateri: 'Transformasi Energi',
        semester: 'Ganjil',
        kktpDeskripsi: 'Membuat skema bagan alur perubahan energi pada 5 peralatan rumah tangga di sekitar.',
      },
      {
        no: 5,
        tujuanPembelajaran: '4.5 Mendeskripsikan keanekaragaman suku, budaya, pakaian adat, dan kearifan lokal di daerah provinsinya.',
        elemen: 'Pemahaman IPAS (Sosial)',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Berkebinekaan Global, Bergotong Royong',
        lingkupMateri: 'Kearifan Lokal Nusantara',
        semester: 'Genap',
        kktpDeskripsi: 'Mempresentasikan kliping adat istiadat dan makanan tradisional daerah asal dengan percaya diri.',
      },
      {
        no: 6,
        tujuanPembelajaran: '4.6 Mengidentifikasi alur kegiatan ekonomi (produksi, distribusi, konsumsi) dalam pemenuhan kebutuhan hidup masyarakat.',
        elemen: 'Pemahaman IPAS (Sosial)',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Kegiatan Ekonomi dan Pasar',
        semester: 'Genap',
        kktpDeskripsi: 'Menyusun alur rantai pasok sederhana dari petani produsen hingga sampai ke meja makan konsumen.',
      },
    ],
  },
  {
    id: 'sd-fase-b-bahasa-indonesia',
    jenjang: 'SD',
    fase: 'Fase B',
    kelas: 'Kelas 4 SD',
    mataPelajaran: 'Bahasa Indonesia',
    elemenCp: 'Menyimak, Membaca dan Memirsa, Berbicara dan Mempresentasikan, Menulis',
    capaianPembelajaran: 'Peserta didik mampu memahami ide pokok dan ide pendukung pada teks informatif dan fiksi, menulis teks narasi dan deskripsi dengan kaidah ejaan EYD yang tepat, serta berdiskusi secara aktif dan santun.',
    alokasiJPTahunan: '216 JP (6 JP / Minggu)',
    daftarMateriPokok: [
      'Kalimat Transitif dan Intransitif',
      'Mencari Ide Pokok dan Ide Pendukung Paragraf',
      'Teks Petunjuk dan Prosedur Sederhana',
      'Wawancara dan Laporan Hasil Wawancara',
      'Puisi Anak dan Majas Personifikasi',
      'Menulis Surat Pribadi dan Narasi Pengalaman',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '4.1 Mengidentifikasi kalimat transitif (memerlukan objek) dan intransitif dalam teks narasi serta menggunakannya dalam tulisan.',
        elemen: 'Membaca & Menulis',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Struktur Kalimat Transitif & Intransitif',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menulis 8 kalimat majemuk dengan mengidentifikasi subjek, predikat, objek, dan keterangan (SPOK).',
      },
      {
        no: 2,
        tujuanPembelajaran: '4.2 Menemukan ide pokok dan ide pendukung pada setiap paragraf teks bacaan informatif secara mandiri.',
        elemen: 'Membaca dan Memirsa',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Ide Pokok Paragraf',
        semester: 'Ganjil',
        kktpDeskripsi: 'Meringkas teks bacaan sepanjang 4 paragraf menjadi 1 paragraf kesimpulan pokok.',
      },
      {
        no: 3,
        tujuanPembelajaran: '4.3 Menulis teks prosedur langkah-langkah membuat suatu karya atau melakukan kegiatan secara urut menggunakan kata keterangan cara.',
        elemen: 'Menulis',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Kreatif, Mandiri',
        lingkupMateri: 'Teks Prosedur',
        semester: 'Genap',
        kktpDeskripsi: 'Menyusun teks prosedur 5 langkah pembuatan makanan khas lokal dengan bahasa baku dan runtut.',
      },
    ],
  },
  {
    id: 'sd-fase-b-matematika',
    jenjang: 'SD',
    fase: 'Fase B',
    kelas: 'Kelas 4 SD',
    mataPelajaran: 'Matematika',
    elemenCp: 'Bilangan, Aljabar, Pengukuran, Geometri, Analisis Data',
    capaianPembelajaran: 'Peserta didik dapat membaca dan menulis bilangan cacah sampai 10.000, menentukan kelipatan dan faktor (KPK & FPB), membandingkan pecahan senilai, menghitung keliling dan luas bangun datar (persegi, persegi panjang, segitiga), serta mengolah data dalam diagram batang.',
    alokasiJPTahunan: '180 JP (5 JP / Minggu)',
    daftarMateriPokok: [
      'Bilangan Cacah Sampai 10.000 dan Nilai Tempat',
      'Pecahan Senilai dan Operasi Hitung Pecahan Sederhana',
      'Pola Gambar dan Pola Bilangan Membesar/Mengecil',
      'Pengukuran Luas dan Volume dengan Satuan Baku (cm², m², Liter)',
      'Keliling dan Luas Persegi, Persegi Panjang, dan Segitiga',
      'Diagram Batang dan Piktogram',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '4.1 Membaca, menulis, membandingkan, dan mengurutkan bilangan cacah sampai dengan 10.000 serta menentukan nilai tempatnya.',
        elemen: 'Bilangan',
        alokasiWaktu: '20 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Bilangan Cacah Sampai 10.000',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu menyusun nilai tempat ribuan, ratusan, puluhan, satuan pada angka 4 digit dengan benar.',
      },
      {
        no: 2,
        tujuanPembelajaran: '4.2 Memahami konsep pecahan senilai menggunakan model konkret gambar terarsir dan garis bilangan.',
        elemen: 'Bilangan',
        alokasiWaktu: '20 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Pecahan Senilai',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menentukan 3 pasangan pecahan senilai (misal 1/2 = 2/4 = 4/8) menggunakan perkalian/pembagian pembilang-penyebut.',
      },
      {
        no: 3,
        tujuanPembelajaran: '4.3 Menghitung keliling dan luas bangun datar persegi, persegi panjang, dan segitiga menggunakan rumus baku.',
        elemen: 'Geometri & Pengukuran',
        alokasiWaktu: '20 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Keliling & Luas Persegi & Segitiga',
        semester: 'Genap',
        kktpDeskripsi: 'Menyelesaikan 5 permasalahan sehari-hari terkait luas pekarangan atau ubin lantai dengan rumus baku.',
      },
      {
        no: 4,
        tujuanPembelajaran: '4.4 Menyajikan dan menginterpretasikan data hasil sensus kelas ke dalam bentuk tabel frekuensi dan diagram batang.',
        elemen: 'Analisis Data',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Gotong Royong',
        lingkupMateri: 'Diagram Batang',
        semester: 'Genap',
        kktpDeskripsi: 'Menggambar diagram batang tinggi badan teman sekelas dengan sumbu koordinat rapi dan proporsional.',
      },
    ],
  },
  {
    id: 'sd-fase-b-pendidikan-pancasila',
    jenjang: 'SD',
    fase: 'Fase B',
    kelas: 'Kelas 4 SD',
    mataPelajaran: 'Pendidikan Pancasila',
    elemenCp: 'Pancasila, Undang-Undang Dasar 1945, Bhinneka Tunggal Ika, Negara Kesatuan Republik Indonesia',
    capaianPembelajaran: 'Peserta didik memahami makna sila-sila Pancasila dan penerapannya dalam kehidupan sehari-hari, mengidentifikasi hak dan kewajiban sebagai anggota keluarga dan warga sekolah, menghargai keragaman identitas masyarakat, serta mempertahankan keutuhan NKRI di lingkungan sekitarnya.',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Makna Sila-Sila Pancasila dalam Kehidupan Sehari-hari',
      'Hak dan Kewajiban Anak di Rumah dan di Sekolah',
      'Menghargai Keberagaman Suku, Agama, dan Budaya di Lingkungan Sekitar',
      'Menjaga Keutuhan Wilayah NKRI dan Gotong Royong Warga',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '4.1 Menjelaskan makna hubungan simbol dengan sila-sila Pancasila dan mencontohkan pengamalannya di lingkungan keluarga dan sekolah.',
        elemen: 'Pancasila',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Beriman, Bertakwa kepada Tuhan YME, Berakhlak Mulia',
        lingkupMateri: 'Penerapan Sila Pancasila',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyebutkan 3 contoh konkret pengamalan sila 1 sampai 5 dalam interaksi antarteman kelas.',
      },
      {
        no: 2,
        tujuanPembelajaran: '4.2 Membedakan hak dan kewajiban sebagai anak di rumah dan peserta didik di sekolah secara bertanggung jawab.',
        elemen: 'Undang-Undang Dasar 1945',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Mandiri, Gotong Royong',
        lingkupMateri: 'Hak dan Kewajiban Warga Sekolah',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyusun daftar komitmen kewajiban harian belajar dan menjaga fasilitas kelas bersama.',
      },
    ],
  },
  {
    id: 'sd-fase-b-pjok',
    jenjang: 'SD',
    fase: 'Fase B',
    kelas: 'Kelas 4 SD',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemenCp: 'Keterampilan Gerak, Pengetahuan Gerak, Pemanfaatan Gerak, Pengembangan Karakter',
    capaianPembelajaran: 'Peserta didik mempraktikkan variasi dan kombinasi gerak dasar lokomotor, non-lokomotor, dan manipulatif dalam permainan invasi (sepak bola/bola tangan), net (bola voli/bulutangkis), atletik (lari cepat, lompat jauh), serta menjaga kesehatan alat reproduksi dan gizi seimbang.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Variasi Gerak Dasar Permainan Bola Besar (Sepak Bola / Futsal)',
      'Variasi Gerak Dasar Permainan Bola Kecil (Kasti / Rounders)',
      'Aktivitas Atletik (Lari Cepat 40m dan Lompat Katak)',
      'Aktivitas Kebugaran Jasmani (Daya Tahan Jantung dan Kekuatan Otot)',
      'Pemeliharaan Kebersihan Alat Reproduksi dan Pencegahan Cedera',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '4.1 Mempraktikkan kombinasi gerak menendang, menghentikan, dan menggiring bola pada permainan sepak bola mini.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Gotong Royong, Mandiri',
        lingkupMateri: 'Permainan Invasi Bola Besar',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menggiring bola zig-zag melewati 5 cone rintangan dan mengoper bola ke sasaran tepat.',
      },
      {
        no: 2,
        tujuanPembelajaran: '4.2 Mempraktikkan variasi gerak melempar melambung, mendatar, dan memukul bola menggunakan tongkat kasti.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Gotong Royong',
        lingkupMateri: 'Permainan Net / Lapangan Kasti',
        semester: 'Ganjil',
        kktpDeskripsi: 'Memukul bola lambung dengan ayunan tongkat kayu minimal melewati garis batas 10 meter.',
      },
      {
        no: 3,
        tujuanPembelajaran: '4.3 Menjelaskan pentingnya menjaga kebersihan alat reproduksi diri dan bahaya pergaulan bebas sejak dini.',
        elemen: 'Kesehatan & Karakter',
        alokasiWaktu: '12 JP',
        profilPancasila: 'Beriman, Bertakwa kepada Tuhan YME, Mandiri',
        lingkupMateri: 'Kesehatan Diri dan Reproduksi',
        semester: 'Genap',
        kktpDeskripsi: 'Menjelaskan 4 bagian tubuh pribadi yang tidak boleh disentuh orang lain dan cara merawatnya.',
      },
    ],
  },
  {
    id: 'sd-fase-b-pabp',
    jenjang: 'SD',
    fase: 'Fase B',
    kelas: 'Kelas 4 SD',
    mataPelajaran: 'Pendidikan Agama dan Budi Pekerti (PABP)',
    elemenCp: 'Al-Qur\'an dan Hadis, Akidah, Akhlak, Fikih, Sejarah Peradaban Islam',
    capaianPembelajaran: 'Peserta didik membaca Q.S. Al-Hujurat/49:13 dan Q.S. At-Tin dengan tajwid yang benar, memahami Asmaul Husna (Al-Malik, Al-Quddus, As-Salam), menghormati keberagaman sebagai sunnatullah, menyambut usia baligh (tanda-tanda pubertas menurut fikih), dan meneladani dakwah Nabi Muhammad SAW di Madinah.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Mari Mengaji Q.S. At-Tin dan Q.S. Al-Hujurat Ayat 13',
      'Teladan Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu\'min, Al-Aziz)',
      'Indahnya Saling Menghargai dalam Keragaman',
      'Menyambut Usia Baligh (Tanda-Tanda Puber Menurut Fikih dan Biologi)',
      'Kisah Hijrah Rasulullah SAW ke Madinah',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '4.1 Membaca Q.S. At-Tin dengan tartil sesuai hukum tajwid nun sukun/tanwin dan menghafalkannya dengan lancar.',
        elemen: 'Al-Qur\'an dan Hadis',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Beriman dan Bertakwa, Mandiri',
        lingkupMateri: 'Tafsir Ringkas Q.S. At-Tin',
        semester: 'Ganjil',
        kktpDeskripsi: 'Membaca surah At-Tin ayat 1-8 dengan kaidah mad thobi\'i dan ghunnah secara benar.',
      },
      {
        no: 2,
        tujuanPembelajaran: '4.2 Menjelaskan tanda-tanda usia baligh (dewasa) menurut pandangan ilmu fikih dan ilmu biologi serta kewajiban salat lima waktu.',
        elemen: 'Fikih',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Mandiri, Bernalar Kritis',
        lingkupMateri: 'Fikih Usia Baligh',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyebutkan rukun mandi wajib setelah hadas besar (mimpi basah/haid) dengan runut.',
      },
      {
        no: 3,
        tujuanPembelajaran: '4.3 Menceritakan peristiwa hijrah Nabi Muhammad SAW ke Madinah dan meneladani toleransi Piagam Madinah.',
        elemen: 'Sejarah Peradaban Islam',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Berkebinekaan Global, Bergotong Royong',
        lingkupMateri: 'Sejarah Dakwah Nabi di Madinah',
        semester: 'Genap',
        kktpDeskripsi: 'Menjelaskan hikmah persaudaraan kaum Muhajirin dan kaum Anshar dalam kehidupan bertetangga.',
      },
    ],
  },

  // =========================================================================
  // 2B. SD - FASE C (KELAS 5 - 6)
  // Sesuai Keputusan Kepala BSKAP Kemendikbudristek No. 032/H/KR/2024
  // =========================================================================
  {
    id: 'sd-fase-c-ipas',
    jenjang: 'SD',
    fase: 'Fase C',
    kelas: 'Kelas 5 SD',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    elemenCp: 'Pemahaman IPAS (Sains & Sosial), Keterampilan Proses',
    capaianPembelajaran: 'Peserta didik memahami sistem organ tubuh manusia (pernapasan, pencernaan, peredaran darah) yang dikaitkan dengan cara menjaga kesehatannya; hubungan antar komponen biotik dan abiotik serta rantai makanan pada ekosistem; gelombang bunyi dan cahaya; kelistrikan dan kemagnetan; struktur lapisan bumi dan sistem tata surya; serta keanekaragaman hayati, kearifan lokal, dan sejarah perjuangan bangsa Indonesia.',
    alokasiJPTahunan: '180 JP (5 JP / Minggu)',
    daftarMateriPokok: [
      'Melihat karena Cahaya, Mendengar karena Bunyi',
      'Harmoni dalam Ekosistem (Rantai Makanan & Jaring Makanan)',
      'Magnet, Listrik, dan Teknologi untuk Kehidupan',
      'Ayo Berkenalan dengan Bumi Kita (Struktur & Relief Bumi)',
      'Bagaimana Bernapas dan Mencerna Makanan (Sistem Organ Manusia)',
      'Indonesiaku Kaya Raya (Geografi dan Sumber Daya Alam)',
      'Warisan Budaya Indonesia yang Mendunia',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '5.1 Menjelaskan sifat-sifat cahaya (merambat lurus, dipantulkan, dibiaskan) melalui percobaan sederhana dan kaitannya dengan indra penglihatan.',
        elemen: 'Pemahaman IPAS',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Sifat Cahaya dan Penglihatan',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membuktikan minimal 3 sifat cahaya lewat praktikum dan menyajikan laporan hasil pengamatan.',
      },
      {
        no: 2,
        tujuanPembelajaran: '5.2 Menganalisis hubungan antar komponen rantai makanan dan peran makhluk hidup (produsen, konsumen, pengurai) dalam ekosistem jaring-jaring makanan.',
        elemen: 'Pemahaman IPAS',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Bergotong Royong',
        lingkupMateri: 'Rantai Makanan dan Ekosistem',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membuat bagan jaring-jaring makanan pada suatu ekosistem dan memprediksi dampak jika salah satu komponen punah.',
      },
      {
        no: 3,
        tujuanPembelajaran: '5.3 Mengidentifikasi sifat-sifat magnet, medan magnet, dan pemanfaatan energi listrik dalam rangkaian seri/paralel sederhana.',
        elemen: 'Pemahaman IPAS & Keterampilan Proses',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Kreatif, Bernalar Kritis',
        lingkupMateri: 'Kelistrikan dan Kemagnetan',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu merakit rangkaian listrik sederhana dan menguji daya hantar konduktor/isolator.',
      },
      {
        no: 4,
        tujuanPembelajaran: '5.4 Mengidentifikasi organ pernapasan dan pencernaan manusia serta cara memelihara kesehatannya dari penyakit sehari-hari.',
        elemen: 'Pemahaman IPAS',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Mandiri, Beriman & Bertakwa',
        lingkupMateri: 'Sistem Pernapasan dan Pencernaan',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu mendeskripsikan alur pencernaan makanan dan menyusun menu makanan sehat bergizi seimbang.',
      },
      {
        no: 5,
        tujuanPembelajaran: '5.5 Menelaah keragaman bentang alam Indonesia serta pemanfaatan potensi sumber daya alam bagi kesejahteraan masyarakat sekitar.',
        elemen: 'Pemahaman IPAS (Sosial)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Berkebinekaan Global, Bernalar Kritis',
        lingkupMateri: 'Kondisi Geografis Indonesia',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu memetakan potensi sumber daya maritim dan agraris di wilayah kepulauan Indonesia pada peta tematik.',
      },
    ],
  },
  {
    id: 'sd-fase-c-bahasa-indonesia',
    jenjang: 'SD',
    fase: 'Fase C',
    kelas: 'Kelas 5 SD',
    mataPelajaran: 'Bahasa Indonesia',
    elemenCp: 'Menyimak, Membaca dan Memirsa, Berbicara dan Mempresentasikan, Menulis',
    capaianPembelajaran: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan dan konteks sosial. Mampu memahami, mengolah, dan menginterpretasi informasi dari teks eksplanasi, pidato, teks narasi, dan laporan hasil wawancara, serta menulis teks persuasif dan deskripsi secara kreatif.',
    alokasiJPTahunan: '216 JP (6 JP / Minggu)',
    daftarMateriPokok: [
      'Aku yang Unik (Teks Deskripsi dan Kata Sifat)',
      'Buku Jendela Dunia (Teks Narasi dan Majas Metafora)',
      'Ekspresi Diri Melalui Hobi (Teks Prosedur dan Wawancara)',
      'Belajar Berwirausaha (Teks Formulir dan Surat Undangan)',
      'Menjadi Warga Dunia (Teks Eksplanasi dan Pidato Singkat)',
      'Cinta Indonesia (Teks Laporan Hasil Pengamatan)',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '5.1 Menganalisis ide pokok dan informasi rinci dari teks narasi atau deskripsi dengan kosakata baru dan sinonim/antonim.',
        elemen: 'Membaca dan Memirsa',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Teks Deskripsi & Karakter Tokoh',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu mengidentifikasi 3 kata sifat perwatakan tokoh dan ide pokok tiap paragraf.',
      },
      {
        no: 2,
        tujuanPembelajaran: '5.2 Menyusun teks eksplanasi sebab-akibat sederhana mengenai fenomena alam atau sosial dengan kaidah ejaan yang disempurnakan (EYD).',
        elemen: 'Menulis',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Kreatif, Bernalar Kritis',
        lingkupMateri: 'Teks Eksplanasi Fenomena',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menulis teks eksplanasi 3 paragraf (pernyataan umum, deretan penjelas, simpulan) dengan tanda baca tepat.',
      },
      {
        no: 3,
        tujuanPembelajaran: '5.3 Menyampaikan pidato persuasif atau tanggapan lisan dalam diskusi kelompok dengan artikulasi jelas dan intonasi santun.',
        elemen: 'Berbicara dan Mempresentasikan',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Mandiri, Berkebinekaan Global',
        lingkupMateri: 'Pidato Persuasif Singkat',
        semester: 'Genap',
        kktpDeskripsi: 'Berpidato di depan kelas selama 2-3 menit bertema kepedulian lingkungan secara percaya diri.',
      },
    ],
  },
  {
    id: 'sd-fase-c-matematika',
    jenjang: 'SD',
    fase: 'Fase C',
    kelas: 'Kelas 5 SD',
    mataPelajaran: 'Matematika',
    elemenCp: 'Bilangan, Aljabar, Pengukuran, Geometri, Analisis Data dan Peluang',
    capaianPembelajaran: 'Peserta didik dapat melakukan operasi hitung penjumlahan, pengurangan, perkalian, dan pembagian pecahan biasa/campuran/desimal/persen; menyelesaikan masalah perbandingan dan skala denah; menghitung volume bangun ruang kubus dan balok; serta mengorganisasi dan menyajikan data dalam bentuk diagram batang dan lingkaran.',
    alokasiJPTahunan: '180 JP (5 JP / Minggu)',
    daftarMateriPokok: [
      'Operasi Hitung Pecahan (Penjumlahan dan Pengurangan)',
      'Perkalian dan Pembagian Pecahan serta Desimal',
      'Kecepatan, Debit, dan Perbandingan Skala',
      'Volume Kubus dan Balok serta Jaring-Jaring Bangun Ruang',
      'Pengumpulan dan Penyajian Data (Tabel dan Diagram Batang)',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '5.1 Menghitung operasi penjumlahan dan pengurangan pecahan berbeda penyebut dan pecahan desimal dalam konteks kehidupan sehari-hari.',
        elemen: 'Bilangan',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Penjumlahan & Pengurangan Pecahan',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu menyamakan penyebut KPK dan menyelesaikan minimal 4 dari 5 soal cerita pecahan dengan benar.',
      },
      {
        no: 2,
        tujuanPembelajaran: '5.2 Menghitung perbandingan senilai dan skala denah lokasi/peta untuk menentukan jarak sebenarnya.',
        elemen: 'Aljabar & Pengukuran',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Skala dan Denah',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu menentukan jarak sebenarnya berdasarkan jarak pada peta berskala 1 : 100.000.',
      },
      {
        no: 3,
        tujuanPembelajaran: '5.3 Menghitung volume kubus dan balok menggunakan kubus satuan serta rumus volume baku (V = p x l x t).',
        elemen: 'Geometri & Pengukuran',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Volume Kubus dan Balok',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu menghitung volume wadah balok dan menggambar jaring-jaring kubus/balok secara terukur.',
      },
      {
        no: 4,
        tujuanPembelajaran: '5.4 Membaca, menginterpretasi, dan menyajikan data frekuensi dalam bentuk diagram batang ganda dan diagram garis.',
        elemen: 'Analisis Data dan Peluang',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Penyajian Diagram Batang',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu membuat diagram batang vertikal dari data hasil ulangan siswa dengan skala sumbu yang konsisten.',
      },
    ],
  },
  {
    id: 'sd-fase-c-pendidikan-pancasila',
    jenjang: 'SD',
    fase: 'Fase C',
    kelas: 'Kelas 5 SD',
    mataPelajaran: 'Pendidikan Pancasila',
    elemenCp: 'Pancasila, Undang-Undang Dasar Negara Republik Indonesia 1945, Bhinneka Tunggal Ika, Negara Kesatuan Republik Indonesia',
    capaianPembelajaran: 'Peserta didik memahami kronologi perumusan Pancasila dan meneladani sikap para perumus; menerapkan norma dan aturan dalam kehidupan berbangsa; menghargai keragaman budaya, suku, dan agama di Indonesia; serta menjaga persatuan dan keutuhan wilayah Negara Kesatuan Republik Indonesia (NKRI).',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Meneladani Nilai-Nilai Luhur Perumusan Pancasila',
      'Norma dalam Kehidupanku (Hak dan Kewajiban Warga Negara)',
      'Keragaman Budaya Negeriku (Menghargai Perbedaan)',
      'Menjaga Keutuhan dan Persatuan NKRI',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '5.1 Menjelaskan sejarah perumusan Pancasila oleh para pendiri bangsa (BPUPKI & PPKI) dan meneladani sikap patriotisme serta musyawarah.',
        elemen: 'Pancasila',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Beriman dan Bertakwa, Berkebinekaan Global, Gotong Royong',
        lingkupMateri: 'Perumusan Pancasila & Keteladanan',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu menyebutkan tokoh perumus Pancasila dan 3 nilai keteladanan musyawarah mufakat.',
      },
      {
        no: 2,
        tujuanPembelajaran: '5.2 Membedakan hak dan kewajiban warga negara di rumah, sekolah, dan masyarakat sesuai norma hukum dan kesopanan yang berlaku.',
        elemen: 'Undang-Undang Dasar 1945',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Mandiri, Bernalar Kritis',
        lingkupMateri: 'Hak dan Kewajiban Warga Negara',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membuat daftar 5 hak dan 5 kewajiban anak sebagai pelajar di sekolah.',
      },
      {
        no: 3,
        tujuanPembelajaran: '5.3 Mempraktikkan sikap toleransi dan gotong royong dalam menyikapi keragaman suku, bahasa daerah, dan agama di lingkungan sekitar.',
        elemen: 'Bhinneka Tunggal Ika & NKRI',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Berkebinekaan Global, Bergotong Royong',
        lingkupMateri: 'Toleransi dan Keutuhan NKRI',
        semester: 'Genap',
        kktpDeskripsi: 'Berperan aktif dalam kegiatan kerja bakti lingkungan sekolah tanpa membeda-bedakan latar belakang kawan.',
      },
    ],
  },
  {
    id: 'sd-fase-c-pjok',
    jenjang: 'SD',
    fase: 'Fase C',
    kelas: 'Kelas 5 SD',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemenCp: 'Keterampilan Gerak, Pengetahuan Gerak, Pemanfaatan Gerak, Pengembangan Karakter dan Nilai-Nilai Gerak',
    capaianPembelajaran: 'Peserta didik mempraktikkan modifikasi pola gerak dasar lokomotor, nonlokomotor, dan manipulatif dalam berbagai olahraga invasi (sepak bola/bola basket), net (bola voli/bulu tangkis), lapangan (kasti), aktivitas senam lantai, kebugaran jasmani, dan menjaga kesehatan dari zat berbahaya (NAPZA/rokok).',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Pola Gerak Dasar Permainan Invasi (Sepak Bola dan Bola Tangan)',
      'Pola Gerak Dasar Permainan Net (Bola Voli dan Bulu Tangkis)',
      'Aktivitas Kebugaran Jasmani (Daya Tahan dan Kekuatan Otot)',
      'Senam Lantai Kombinasi Keseimbangan dan Guling Depan/Belakang',
      'Bahaya Merokok, Minuman Keras, dan Obat Terlarang bagi Kesehatan',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '5.1 Mempraktikkan kombinasi gerak menendang, menghentikan, dan menggiring bola pada permainan sepak bola mini sesuai konsep ruang.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Mandiri, Bergotong Royong',
        lingkupMateri: 'Permainan Bola Besar (Sepak Bola)',
        semester: 'Ganjil',
        kktpDeskripsi: 'Melakukan passing kaki bagian dalam sejauh 5 meter sebanyak 5 kali tanpa kehilangan kendali bola.',
      },
      {
        no: 2,
        tujuanPembelajaran: '5.2 Mempraktikkan passing bawah bola voli dengan perkenaan lengan bawah secara benar dalam kerja sama tim.',
        elemen: 'Keterampilan Gerak & Karakter',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bergotong Royong, Mandiri',
        lingkupMateri: 'Permainan Bola Voli',
        semester: 'Ganjil',
        kktpDeskripsi: 'Melakukan passing bawah bola voli berpasangan sebanyak 4 kali pantulan stabil.',
      },
      {
        no: 3,
        tujuanPembelajaran: '5.3 Menjelaskan bahaya zat adiktif (rokok, alkohol, obat terlarang) terhadap kesehatan organ tubuh dan menolaknya dengan tegas.',
        elemen: 'Pemanfaatan Gerak & Kesehatan',
        alokasiWaktu: '12 JP',
        profilPancasila: 'Beriman dan Bertakwa, Bernalar Kritis',
        lingkupMateri: 'Kesehatan Diri & Bahaya Rokok/Zat Adiktif',
        semester: 'Genap',
        kktpDeskripsi: 'Mampu membuat poster ajakan hidup sehat bebas rokok dan narkoba di lingkungan sekolah.',
      },
    ],
  },
  {
    id: 'sd-fase-c-pabp',
    jenjang: 'SD',
    fase: 'Fase C',
    kelas: 'Kelas 5 SD',
    mataPelajaran: 'Pendidikan Agama dan Budi Pekerti (PABP)',
    elemenCp: 'Al-Qur\'an dan Hadis, Akidah, Akhlak, Fikih, Sejarah Peradaban Islam',
    capaianPembelajaran: 'Peserta didik membaca Q.S. Al-Ma\'un dan Q.S. At-Takatsur dengan tartil, meyakini Asmaul Husna (Al-Qawiyyu, Al-Qayyum, Al-Muhyi, Al-Mumit, Al-Ba\'its), berakhlak terpuji kepada sesama dan lingkungan, memahami ketentuan zakat fitrah, infak, sedekah, dan hadiah, serta meneladani perjuangan Fathu Makkah dan Haji Wada Rasulullah SAW.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Menyayangi Anak Yatim: Q.S. Al-Ma\'un',
      'Mengenal Allah Melalui Asmaul Husna (Al-Qawiyyu, Al-Qayyum, Al-Muhyi, Al-Mumit)',
      'Hidup Damai dalam Kebersamaan dan Saling Menghargai',
      'Ayo Berzakat, Infak, dan Sedekah Membantu Sesama',
      'Kisah Kejayaan Fathu Makkah dan Haji Wada',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '5.1 Membaca dan menghafalkan Q.S. Al-Ma\'un dengan tartil serta menjelaskan pesan penting menyantuni anak yatim dan fakir miskin.',
        elemen: 'Al-Qur\'an dan Hadis',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Beriman, Bertakwa, Berakhlak Mulia',
        lingkupMateri: 'Surah Al-Ma\'un & Kepedulian Sosial',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mampu membaca tartil ayat 1-7 Surah Al-Ma\'un dan mengartikan minimal 3 kosakata pokok.',
      },
      {
        no: 2,
        tujuanPembelajaran: '5.2 Menjelaskan makna Asmaul Husna Al-Qawiyyu, Al-Qayyum, Al-Muhyi, Al-Mumit, Al-Ba\'its dan menerapkannya dalam tawakal.',
        elemen: 'Akidah',
        alokasiWaktu: '12 JP',
        profilPancasila: 'Beriman dan Bertakwa, Mandiri',
        lingkupMateri: 'Asmaul Husna Ketuhanan',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menjelaskan arti Al-Qawiyyu (Maha Kuat) dan Al-Qayyum (Maha Mandiri) disertai contoh sikap mandiri.',
      },
      {
        no: 3,
        tujuanPembelajaran: '5.3 Menjelaskan ketentuan zakat fitrah, infak, sedekah, dan hadiah sebagai wujud kepedulian sosial terhadap kaum dhuafa.',
        elemen: 'Fikih',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Berakhlak Mulia, Gotong Royong',
        lingkupMateri: 'Zakat Fitrah, Infak, dan Sedekah',
        semester: 'Genap',
        kktpDeskripsi: 'Menghitung besaran zakat fitrah (2,5 kg beras per jiwa) dan menyebutkan 8 golongan mustahik.',
      },
    ],
  },

  // =========================================================================
  // 3. SMP - FASE D (KELAS 7 - 9)
  // =========================================================================
  {
    id: 'smp-fase-d-ipa',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Ilmu Pengetahuan Alam (IPA)',
    elemenCp: 'Pemahaman IPA (Fisika, Biologi, Kimia, Bumi & Antariksa), Keterampilan Proses',
    capaianPembelajaran: 'Peserta didik memahami hakikat sains dan metode ilmiah, zat dan perubahannya, suhu dan kalor, gerak dan gaya, klasifikasi makhluk hidup, interaksi antar komponen ekosistem dan jaring-jaring makanan, pewarisan sifat, bioteknologi, serta struktur bumi dan sistem tata surya.',
    alokasiJPTahunan: '180 JP (5 JP / Minggu)',
    daftarMateriPokok: [
      'Hakikat Ilmu Sains, Pengukuran, dan Metode Ilmiah',
      'Zat dan Perubahannya (Wujud Zat, Partikel, Perubahan Fisika & Kimia)',
      'Suhu, Kalor, dan Pemuaian',
      'Gerak Lurus (GLB & GLBB) dan Hukum-Hukum Newton tentang Gaya',
      'Klasifikasi Makhluk Hidup (Kunci Determinasi & Binomial Nomenklatur)',
      'Ekosistem: Rantai Makanan, Jaring-Jaring Makanan, dan Siklus Biogeokimia',
      'Bumi dan Tata Surya: Gerak Rotasi, Revolusi, Gerhana, dan Lapisan Bumi',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Menjelaskan cabang-cabang sains, merancang prosedur penyelidikan ilmiah, dan menerapkan keselamatan kerja di laboratorium IPA.',
        elemen: 'Keterampilan Proses & Pemahaman IPA',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Metode Ilmiah dan Pengukuran',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyusun laporan eksperimen lengkap dengan hipotesis, variabel bebas, variabel terikat, dan kontrol.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Menganalisis perbedaan sifat fisik dan kimia zat padat, cair, dan gas berdasarkan teori partikel serta membedakan unsur, senyawa, dan campuran.',
        elemen: 'Pemahaman IPA (Kimia-Fisika)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Zat dan Perubahannya',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mempraktikkan pemisahan campuran sederhana (filtrasi, evaporasi, kromatografi) di kelas.',
      },
      {
        no: 3,
        tujuanPembelajaran: '7.3 Menghitung besaran kalor (Q = m.c.ΔT), kalor lebur/uap, serta menganalisis asas Black dalam pertukaran kalor.',
        elemen: 'Pemahaman IPA (Fisika)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Suhu, Kalor, dan Pemuaian',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menghitung suhu akhir campuran air panas dan dingin dengan formula Asas Black.',
      },
      {
        no: 4,
        tujuanPembelajaran: '7.4 Menyelidiki Hukum I, II, dan III Newton tentang gerak serta mengaitkannya dengan keselamatan berkendara (seatbelt & airbag).',
        elemen: 'Pemahaman IPA (Fisika)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Gaya dan Gerak Newton',
        semester: 'Ganjil',
        kktpDeskripsi: 'Membuktikan Hukum II Newton (F = m.a) melalui percobaan kereta dinamika berbeban.',
      },
      {
        no: 5,
        tujuanPembelajaran: '7.5 Mengklasifikasikan makhluk hidup 5 kingdom menggunakan kunci dikotomi dan determinasi format standar BSKAP.',
        elemen: 'Pemahaman IPA (Biologi)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Klasifikasi Makhluk Hidup',
        semester: 'Genap',
        kktpDeskripsi: 'Menentukan taksonomi 3 jenis tumbuhan lokal menggunakan kunci determinasi sederhana.',
      },
      {
        no: 6,
        tujuanPembelajaran: '7.6 Menganalisis dinamika rantai makanan dan dampak perusakan habitat terhadap kepunahan trofik dalam ekosistem lokal.',
        elemen: 'Pemahaman IPA (Biologi)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Beriman & Bertakwa, Bergotong Royong',
        lingkupMateri: 'Interaksi Ekosistem & Lingkungan',
        semester: 'Genap',
        kktpDeskripsi: 'Membuat rancangan solusi konservasi ekosistem mangrove / persawahan dari serangan hama tikus.',
      },
      {
        no: 7,
        tujuanPembelajaran: '7.7 Mengidentifikasi lapisan litosfer, hidrosfer, atmosfer bumi serta mekanisme mitigasi bencana gempa bumi dan gunung meletus.',
        elemen: 'Pemahaman IPA (Bumi & Antariksa)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Gotong Royong, Bernalar Kritis',
        lingkupMateri: 'Lapisan Bumi & Mitigasi Kebencanaan',
        semester: 'Genap',
        kktpDeskripsi: 'Merancang simulasi evakuasi mandiri saat terjadi gempa bumi di gedung sekolah.',
      },
    ],
  },
  {
    id: 'smp-fase-d-matematika',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Matematika',
    elemenCp: 'Bilangan, Aljabar, Pengukuran, Geometri, Analisis Data dan Peluang',
    capaianPembelajaran: 'Peserta didik dapat mengoperasikan bilangan rasional dan irasional, menyelesaikan persamaan dan pertidaksamaan linear satu variabel (PLSV/PtLSV), menentukan gradien dan garis lurus, menerapkan teorema Pythagoras, menghitung luas permukaan dan volume bangun ruang sisi datar, serta menganalisis pemusatan data (mean, median, modus).',
    alokasiJPTahunan: '180 JP (5 JP / Minggu)',
    daftarMateriPokok: [
      'Bilangan Bulat dan Bilangan Rasional (Pecahan)',
      'Aljabar (Bentuk Aljabar, Operasi Hitung, Faktorisasi)',
      'Persamaan dan Pertidaksamaan Linear Satu Variabel (PLSV & PtLSV)',
      'Perbandingan Senilai dan Berbalik Nilai Serta Aritmetika Sosial',
      'Garis dan Sudut Serta Teorema Pythagoras',
      'Bangun Datar dan Bangun Ruang Sisi Datar (Kubus, Balok, Prisma, Limas)',
      'Penyajian Data, Ukuran Pemusatan Data (Mean, Median, Modus)',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Menyelesaikan operasi hitung bilangan bulat dan bilangan pecahan (positif & negatif) dalam masalah finansial sehari-hari.',
        elemen: 'Bilangan',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Operasi Bilangan Rasional',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyelesaikan 10 soal cerita bertingkat untung-rugi dan pembagian waris dengan ketepatan 80%.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Mengoperasikan bentuk aljabar (penjumlahan, pengurangan, perkalian suku dua, pemfaktoran aljabar).',
        elemen: 'Aljabar',
        alokasiWaktu: '20 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Bentuk Aljabar',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyederhanakan bentuk aljabar pecahan dan menguraikan perkalian binomial (ax + b)(cx + d).',
      },
      {
        no: 3,
        tujuanPembelajaran: '7.3 Menyelesaikan persamaan dan pertidaksamaan linear satu variabel (PLSV dan PtLSV) secara analitis.',
        elemen: 'Aljabar',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Persamaan Linear Satu Variabel',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menentukan himpunan penyelesaian pertidaksamaan linear dan menggambarkannya pada garis bilangan.',
      },
      {
        no: 4,
        tujuanPembelajaran: '7.4 Menghitung perbandingan senilai dan berbalik nilai pada tabel skala denah peta dan lama waktu penyelesaian proyek.',
        elemen: 'Bilangan & Aljabar',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Perbandingan & Skala',
        semester: 'Genap',
        kktpDeskripsi: 'Menghitung kebutuhan pekerja tambahan jika proyek pembangunan dipercepat 10 hari.',
      },
      {
        no: 5,
        tujuanPembelajaran: '7.5 Menganalisis hubungan antarsudut yang terbentuk oleh dua garis sejajar yang dipotong oleh sebuah garis transversal.',
        elemen: 'Geometri',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Garis dan Sudut',
        semester: 'Genap',
        kktpDeskripsi: 'Menghitung besar sudut sehadap, sudut bertolak belakang, dan sudut dalam berseberangan pada gambar rancang bangun.',
      },
      {
        no: 6,
        tujuanPembelajaran: '7.6 Menghitung nilai rata-rata (mean), median, dan modus dari kumpulan data tunggal serta menyajikannya dalam histogram.',
        elemen: 'Analisis Data & Peluang',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Gotong Royong',
        lingkupMateri: 'Statistika Data Tunggal',
        semester: 'Genap',
        kktpDeskripsi: 'Menganalisis data hasil survei nilai ujian sekolah dan menarik kesimpulan simpangan data.',
      },
    ],
  },
  {
    id: 'smp-fase-d-bahasa-indonesia',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Bahasa Indonesia',
    elemenCp: 'Menyimak, Membaca dan Memirsa, Berbicara dan Mempresentasikan, Menulis',
    capaianPembelajaran: 'Peserta didik memahami informasi eksplisit dan implisit dalam teks deskripsi, teks narasi fantasi, teks prosedur, teks laporan hasil observasi (LHO), teks berita, dan teks tanggapan, serta mampu menyajikan gagasan kreatif dalam bentuk tulisan yang terstruktur sesuai PUEBI.',
    alokasiJPTahunan: '216 JP (6 JP / Minggu)',
    daftarMateriPokok: [
      'Menjelajah Keindahan Nusantara Melalui Teks Deskripsi',
      'Berkelana di Alam Imajinasi Melalui Teks Cerita Fantasi',
      'Menyusun Petunjuk Hidup Sehat Lewat Teks Prosedur',
      'Menyibak Ilmu Pengetahuan dalam Teks Laporan Hasil Observasi (LHO)',
      'Membuka Cakrawala Dunia Lewat Teks Berita Digital',
      'Menulis Surat Resmi Dinas dan Surat Pribadi',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Mengidentifikasi ciri objek, tujuan, isi, dan penggunaan bahasa bermajas dalam teks deskripsi lisan dan tulis.',
        elemen: 'Membaca dan Memirsa',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Kreatif, Bernalar Kritis',
        lingkupMateri: 'Teks Deskripsi Objek Wisata',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menulis teks deskripsi 3 paragraf tentang destinasi lokal dengan pemilihan kata konkret dan cerapan pancaindra.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Menelaah struktur alur (orientasi, komplikasi, resolusi) dan kebahasaan cerita fantasi serta menciptakan cerita imajinatif sendiri.',
        elemen: 'Membaca & Menulis',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Kreatif, Mandiri',
        lingkupMateri: 'Teks Cerita Fantasi',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menghasilkan cerita fantasi orisinal bertema pelestarian lingkungan sepanjang minimal 400 kata.',
      },
      {
        no: 3,
        tujuanPembelajaran: '7.3 Menyusun teks prosedur kompleks yang memuat tujuan, bahan/alat, langkah-langkah sistematis, dan kalimat instruktif.',
        elemen: 'Menulis & Mempresentasikan',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Mandiri, Gotong Royong',
        lingkupMateri: 'Teks Prosedur Kompleks',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mempresentasikan video tutorial atau poster teks prosedur pembuatan pupuk kompos sekolah.',
      },
      {
        no: 4,
        tujuanPembelajaran: '7.4 Menggali informasi faktual berbasis data dalam Teks Laporan Hasil Observasi (LHO) dan membedakannya dari opini.',
        elemen: 'Membaca dan Memirsa',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Bernalar Kritis',
        lingkupMateri: 'Teks Laporan Hasil Observasi',
        semester: 'Genap',
        kktpDeskripsi: 'Menyusun laporan observasi tentang flora fauna khas sekolah lengkap dengan klasifikasi umum dan deskripsi bagian.',
      },
    ],
  },
  {
    id: 'smp-fase-d-bahasa-inggris',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Bahasa Inggris',
    elemenCp: 'Listening and Speaking, Reading and Viewing, Writing and Presenting',
    capaianPembelajaran: 'Peserta didik menggunakan bahasa Inggris untuk berinteraksi dan berkomunikasi dalam konteks kelas, mendeskripsikan orang, benda, dan tempat, menceritakan rutinitas harian (simple present tense), memahami resep dan petunjuk, serta menceritakan pengalaman masa lalu (recount text).',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Greetings, Leave-takings, and Self Introduction',
      'Describing People, Animals, and Everyday Objects',
      'Daily Routines, School Schedules, and Hobbies',
      'Procedural Texts (My Favorite Recipe and DIY Crafts)',
      'Personal Experiences in the Past (Simple Past Tense)',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Produce spoken English to introduce oneself and others politely using pronouns and verbs to be.',
        elemen: 'Listening and Speaking',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Berkebinekaan Global, Mandiri',
        lingkupMateri: 'Self Introduction & Greetings',
        semester: 'Ganjil',
        kktpDeskripsi: 'Students can deliver a 1-minute oral self-introduction covering name, origin, hobbies, and family members.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Write a descriptive paragraph about a favorite teacher, friend, or historical monument using adjective phrases.',
        elemen: 'Reading and Writing',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Creative, Critical Thinking',
        lingkupMateri: 'Descriptive Text',
        semester: 'Ganjil',
        kktpDeskripsi: 'Compose a 100-word descriptive text with correct capitalization, punctuation, and subject-verb agreement.',
      },
    ],
  },
  {
    id: 'smp-fase-d-ips',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Ilmu Pengetahuan Sosial (IPS)',
    elemenCp: 'Pemahaman Konsep (Geografi, Sejarah, Sosiologi, Ekonomi), Keterampilan Proses',
    capaianPembelajaran: 'Peserta didik memahami keberadaan diri dan keluarga di tengah lingkungan sosial terdekat, konektivitas antarruang dan letak astronomis Indonesia, peninggalan masa praaksara dan Hindu-Buddha, kegiatan ekonomi dan peran pasar, serta pemberdayaan masyarakat dalam mengelola potensi sumber daya alam.',
    alokasiJPTahunan: '144 JP (4 JP / Minggu)',
    daftarMateriPokok: [
      'Keluarga Awal Kehidupan dan Pembentukan Identitas Sosial',
      'Keanekaragaman Lingkungan Alam dan Peta Wilayah Indonesia',
      'Potensi Sumber Daya Alam dan Kemaritiman Indonesia',
      'Aktivitas Ekonomi: Kelangkaan, Kebutuhan, Permintaan, Penawaran, dan Harga',
      'Dinamika Interaksi Sosial dan Lembaga Sosial',
      'Pemberdayaan Masyarakat dan Kelestarian Lingkungan Hidup',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Menganalisis silsilah keluarga, sosialisasi primer, dan norma sosial dalam membentuk kepribadian individu.',
        elemen: 'Pemahaman Konsep (Sosiologi)',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Berakhlak Mulia, Mandiri',
        lingkupMateri: 'Keluarga dan Identitas Diri',
        semester: 'Ganjil',
        kktpDeskripsi: 'Membuat bagan pohon silsilah keluarga 3 generasi disertai nilai-nilai moral yang diwariskan.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Menjelaskan letak astronomis, geografis, dan geologis Indonesia serta pengaruhnya terhadap iklim dan potensi alam.',
        elemen: 'Pemahaman Konsep (Geografi)',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Berkebinekaan Global',
        lingkupMateri: 'Kondisi Geografis Indonesia',
        semester: 'Ganjil',
        kktpDeskripsi: 'Membaca peta tematik persebaran flora fauna zona Asiatis, Peralihan, dan Australis.',
      },
      {
        no: 3,
        tujuanPembelajaran: '7.3 Menjelaskan konsep kelangkaan barang dan jasa serta menganalisis terbentuknya kurva permintaan dan penawaran di pasar tradisional.',
        elemen: 'Pemahaman Konsep (Ekonomi)',
        alokasiWaktu: '16 JP',
        profilPancasila: 'Bernalar Kritis, Mandiri',
        lingkupMateri: 'Kegiatan Ekonomi dan Pasar',
        semester: 'Genap',
        kktpDeskripsi: 'Menghitung titik keseimbangan pasar (ekuilibrium) sederhana berdasarkan tabel harga dan jumlah barang.',
      },
    ],
  },
  {
    id: 'smp-fase-d-pendidikan-pancasila',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Pendidikan Pancasila',
    elemenCp: 'Pancasila, Undang-Undang Dasar 1945, Bhinneka Tunggal Ika, Negara Kesatuan Republik Indonesia',
    capaianPembelajaran: 'Peserta didik menganalisis kronologis kelahiran Pancasila melalui sidang BPUPKI dan PPKI, menerapkan norma dan hierarki peraturan perundang-undangan, mengapresiasi keberagaman suku, agama, ras, dan antargolongan (SARA), serta menjaga keutuhan wilayah NKRI dari ancaman internal dan eksternal.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Sejarah Kelahiran Pancasila (Sidang BPUPKI & Piagam Jakarta)',
      'Norma dalam Kehidupan Bermasyarakat dan UUD NRI Tahun 1945',
      'Kesatuan Indonesia dan Karakteristik Daerah Tempat Tinggal',
      'Keberagaman Suku, Agama, Ras, dan Antargolongan dalam Bingkai Bhinneka Tunggal Ika',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Menganalisis kronologi perumusan dan penetapan Pancasila sebagai Dasar Negara oleh para pendiri bangsa.',
        elemen: 'Pancasila',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Berkebinekaan Global',
        lingkupMateri: 'Sejarah Perumusan Pancasila',
        semester: 'Ganjil',
        kktpDeskripsi: 'Membuat infografis komparasi usulan dasar negara oleh Moh. Yamin, Soepomo, dan Ir. Soekarno.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Membedakan norma agama, norma kesusilaan, norma kesopanan, dan norma hukum serta sanksinya dalam masyarakat.',
        elemen: 'Undang-Undang Dasar 1945',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Berakhlak Mulia, Mandiri',
        lingkupMateri: 'Norma dan Keadilan',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyelesaikan studi kasus pelanggaran norma lalu lintas dan norma kesopanan dengan solusi berbasis restoratif.',
      },
    ],
  },
  {
    id: 'smp-fase-d-pjok',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    elemenCp: 'Keterampilan Gerak, Pengetahuan Gerak, Pemanfaatan Gerak, Pengembangan Karakter',
    capaianPembelajaran: 'Peserta didik mempraktikkan keterampilan gerak spesifik permainan bola besar (sepak bola, voli, basket), bola kecil (bulutangkis, tenis meja), atletik (lari jarak pendek, tolak peluru), bela diri (pencak silat/karate), serta menyusun program latihan kebugaran jasmani pribadi.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Keterampilan Gerak Spesifik Permainan Sepak Bola',
      'Keterampilan Gerak Spesifik Permainan Bola Voli (Passing Bawah & Atas)',
      'Keterampilan Gerak Spesifik Atletik (Start Jongkok & Lari 100m)',
      'Seni Bela Diri Pencak Silat (Kuda-Kuda, Pukulan, Tangkisan)',
      'Peningkatan Daya Tahan Aerobik (Cardiorespiratory Endurance)',
      'Pola Hidup Sehat: Pencegahan Penyakit Menular dan Narkoba',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Mempraktikkan keterampilan gerak spesifik passing bawah dan passing atas dalam permainan bola voli secara berkelompok.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Gotong Royong, Mandiri',
        lingkupMateri: 'Permainan Bola Voli',
        semester: 'Ganjil',
        kktpDeskripsi: 'Melakukan passing bawah berpasangan sebanyak 10 pantulan tanpa bola menyentuh lantai.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Mempraktikkan teknik start jongkok, aba-aba lari sprint, dan teknik memasuki garis finis lari cepat 60 meter.',
        elemen: 'Keterampilan Gerak',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Mandiri, Bernalar Kritis',
        lingkupMateri: 'Atletik Lari Jarak Pendek',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mencatatkan waktu lari 60 meter sesuai standar kebugaran jasmani Indonesia (SKJI) kategori usia 13-15 tahun.',
      },
    ],
  },
  {
    id: 'smp-fase-d-pabp',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Pendidikan Agama dan Budi Pekerti (PABP)',
    elemenCp: 'Al-Qur\'an dan Hadis, Akidah, Akhlak, Fikih, Sejarah Peradaban Islam',
    capaianPembelajaran: 'Peserta didik membaca Q.S. An-Nisa/4:59 dan Q.S. An-Nahl/16:64 sesuai kaidah tajwid mad, meyakini sifat-sifat Allah melalui Asmaul Husna (Al-Alim, Al-Khabir, As-Sami, Al-Bashir), menjauhi ghibah dan fitnah, mempraktikkan salat gerhana, salat jenazah, dan zakat mal, serta mengapresiasi keemasan ilmu pengetahuan pada masa Daulah Umayyah dan Abbasiyah.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Al-Qur\'an Sumber Kebaikan: Membaca Q.S. An-Nisa: 59 dan Q.S. An-Nahl: 64',
      'Mengenal Allah Lebih Dekat Melalui Asmaul Husna',
      'Indahnya Ikhlas, Sabar, dan Pemaaf dalam Pergaulan Remaja',
      'Fikih Salat Berjamaah, Salat Jamak Qashar, dan Salat Jenazah',
      'Peradaban Islam Masa Daulah Umayyah di Damaskus dan Andalusia',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Membaca Q.S. An-Nisa/4:59 dan Q.S. An-Nahl/16:64 dengan tajwid hukum bacaan Alif Lam Syamsiyah dan Alif Lam Qamariyah secara fasih.',
        elemen: 'Al-Qur\'an dan Hadis',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Beriman, Bertakwa kepada Tuhan YME',
        lingkupMateri: 'Hukum Tajwid Alif Lam',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mengidentifikasi 10 contoh bacaan Alif Lam Syamsiyah dan Qamariyah dalam mushaf Al-Qur\'an.',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Mempraktikkan tata cara salat jamak taqdim dan jamak takhir serta qashar bagi musafir sesuai sunnah Rasulullah SAW.',
        elemen: 'Fikih',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Mandiri, Berakhlak Mulia',
        lingkupMateri: 'Fikih Salat Musafir (Jamak & Qashar)',
        semester: 'Ganjil',
        kktpDeskripsi: 'Mempraktikkan niat dan urutan salat jamak qashar Zhuhur dan Ashar di mushola sekolah.',
      },
    ],
  },
  {
    id: 'smp-fase-d-informatika',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Informatika',
    elemenCp: 'Berpikir Komputasional (BK), Teknologi Informasi dan Komunikasi (TIK), Sistem Komputer (SK), Jaringan Komputer dan Internet (JKI), Analisis Data (AD), Algoritma dan Pemrograman (AP), Dampak Sosial Informatika (DSI)',
    capaianPembelajaran: 'Peserta didik menerapkan berpikir komputasional (dekomposisi, pengenalan pola, abstraksi, algoritma) untuk menyelesaikan persoalan logis, mengoperasikan surel dan peramban web, memahami interaksi perangkat keras dan lunak, mengenal enkripsi data dan cyber security dasar, serta membuat program blok visual menggunakan Scratch atau Blockly.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Berpikir Komputasional (Computational Thinking)',
      'Teknologi Informasi dan Komunikasi (Aplikasi Pengolah Kata & Lembar Sebar)',
      'Sistem Komputer (Hardware, Software, dan Sistem Operasi)',
      'Jaringan Komputer dan Internet (Koneksi WiFi, Tethering, dan Enkripsi)',
      'Analisis Data (Pengolahan Angka dan Visualisasi Grafik)',
      'Algoritma dan Pemrograman Blok Visual (Scratch)',
      'Dampak Sosial Informatika dan Etika Berinternet (Netiket)',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Menerapkan 4 pilar berpikir komputasional (dekomposisi, pengenalan pola, abstraksi, dan algoritma) dalam memecahkan teka-teki logika Bebras.',
        elemen: 'Berpikir Komputasional (BK)',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Bernalar Kritis, Kreatif',
        lingkupMateri: 'Computational Thinking',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menyelesaikan 5 tantangan logika algoritma pengurutan (sorting) dan pencarian (searching).',
      },
      {
        no: 2,
        tujuanPembelajaran: '7.2 Membuat animasi interaktif sederhana atau game edukasi menggunakan bahasa pemrograman visual blok Scratch.',
        elemen: 'Algoritma dan Pemrograman (AP)',
        alokasiWaktu: '18 JP',
        profilPancasila: 'Kreatif, Mandiri',
        lingkupMateri: 'Pemrograman Blok Visual Scratch',
        semester: 'Genap',
        kktpDeskripsi: 'Menyusun kode blok percabangan (if-else) dan perulangan (loop) untuk menggerakkan sprite animasi.',
      },
    ],
  },
  {
    id: 'smp-fase-d-seni-budaya',
    jenjang: 'SMP',
    fase: 'Fase D',
    kelas: 'Kelas 7 SMP',
    mataPelajaran: 'Seni dan Prakarya',
    elemenCp: 'Mengalami, Menciptakan, Merefleksikan, Berpikir dan Bekerja Artistik, Berdampak',
    capaianPembelajaran: 'Peserta didik mengamati dan mengeksplorasi unsur rupa (garis, bentuk, ruang, warna, tekstur), menggambar ragam hias nusantara, menciptakan karya seni kriya berbahan lokal, serta mengapresiasi warisan budaya daerah.',
    alokasiJPTahunan: '108 JP (3 JP / Minggu)',
    daftarMateriPokok: [
      'Menggambar Ragam Hias Flora, Fauna, dan Geometris Nusantara',
      'Prinsip Menggambar Bentuk dan Perspektif Satu Titik Hilang',
      'Teknik Pewarnaan Kering dan Basah (Gradasi Cat Air / Pensil Warna)',
      'Karya Seni Kriya Tradisional Menggunakan Bahan Daur Ulang / Bambu',
      'Pameran dan Apresiasi Seni Rupa Tingkat Kelas',
    ],
    atpList: [
      {
        no: 1,
        tujuanPembelajaran: '7.1 Menggambar motif ragam hias tradisional nusantara dengan menerapkan pola simetris dan asimetris.',
        elemen: 'Menciptakan & Mengalami',
        alokasiWaktu: '15 JP',
        profilPancasila: 'Kreatif, Berkebinekaan Global',
        lingkupMateri: 'Ragam Hias Nusantara',
        semester: 'Ganjil',
        kktpDeskripsi: 'Menghasilkan 1 karya gambar batik/ragam hias geometris di atas kertas gambar A3 dengan pewarnaan rapi.',
      },
    ],
  },
];

function isMapelMatch(normInput: string, itemMapel: string): boolean {
  if (!normInput) return true;
  if (itemMapel.includes(normInput) || normInput.includes(itemMapel)) return true;
  if ((normInput.includes('ipa') || normInput.includes('sains')) && itemMapel.includes('alam')) return true;
  if (normInput.includes('ipas') && itemMapel.includes('ipas')) return true;
  if ((normInput.includes('pjok') || normInput.includes('penjas') || normInput.includes('jasmani')) && itemMapel.includes('jasmani')) return true;
  if ((normInput.includes('agama') || normInput.includes('pabp') || normInput.includes('pai')) && itemMapel.includes('agama')) return true;
  if ((normInput.includes('pancasila') || normInput.includes('ppkn')) && itemMapel.includes('pancasila')) return true;
  if (normInput.includes('indonesia') && itemMapel.includes('indonesia')) return true;
  if (normInput.includes('inggris') && itemMapel.includes('inggris')) return true;
  if ((normInput.includes('matematika') || normInput.includes('mtk')) && itemMapel.includes('matematika')) return true;
  if (normInput.includes('ips') && itemMapel.includes('sosial')) return true;
  if ((normInput.includes('informatika') || normInput.includes('tik')) && itemMapel.includes('informatika')) return true;
  if ((normInput.includes('seni') || normInput.includes('prakarya')) && (itemMapel.includes('seni') || itemMapel.includes('prakarya'))) return true;
  return false;
}

/**
 * Helper: Ambil data kurikulum pusat berdasarkan jenjang, mapel, dan fase/kelas
 * Sesuai Keputusan Kepala BSKAP Kemendikbudristek No. 032/H/KR/2024 & No. 033/H/KR/2022
 */
export function getKurikulumPusat(
  jenjang: 'SD' | 'SMP',
  mapel?: string,
  faseKelas?: string
): KurikulumMapelData {
  const normMapel = (mapel || '').toLowerCase();
  const normFase = (faseKelas || '').toLowerCase();

  // Tentukan target fase jika ada indikator di fase/kelas
  let targetFase: 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D' | undefined;
  if (normFase.includes('fase a') || normFase.includes('kelas 1') || normFase.includes('kelas 2') || normFase === '1' || normFase === '2') {
    targetFase = 'Fase A';
  } else if (normFase.includes('fase c') || normFase.includes('kelas 5') || normFase.includes('kelas 6') || normFase === '5' || normFase === '6') {
    targetFase = 'Fase C';
  } else if (normFase.includes('fase b') || normFase.includes('kelas 3') || normFase.includes('kelas 4') || normFase === '3' || normFase === '4') {
    targetFase = 'Fase B';
  } else if (jenjang === 'SMP' || normFase.includes('fase d') || normFase.includes('smp') || normFase.includes('7') || normFase.includes('8') || normFase.includes('9')) {
    targetFase = 'Fase D';
  }

  // 1. Cari yang cocok jenjang, target fase, dan mapel
  if (targetFase) {
    const matchedWithFase = DATA_KURIKULUM_PUSAT.find((item) => {
      if (item.jenjang !== jenjang) return false;
      if (item.fase !== targetFase) return false;
      return isMapelMatch(normMapel, item.mataPelajaran.toLowerCase());
    });
    if (matchedWithFase) return matchedWithFase;
  }

  // 2. Cari yang cocok jenjang dan mapel (jika target fase tidak spesifik)
  const matchedMapel = DATA_KURIKULUM_PUSAT.find((item) => {
    if (item.jenjang !== jenjang) return false;
    return isMapelMatch(normMapel, item.mataPelajaran.toLowerCase());
  });
  if (matchedMapel) return matchedMapel;

  // 3. Fallback default terstandarisasi per jenjang & fase
  if (jenjang === 'SD') {
    if (targetFase === 'Fase A') {
      return DATA_KURIKULUM_PUSAT.find((i) => i.id === 'sd-fase-a-bahasa-indonesia') || DATA_KURIKULUM_PUSAT[0];
    }
    if (targetFase === 'Fase C') {
      return DATA_KURIKULUM_PUSAT.find((i) => i.id === 'sd-fase-c-ipas') || DATA_KURIKULUM_PUSAT[0];
    }
    return DATA_KURIKULUM_PUSAT.find((i) => i.id === 'sd-fase-b-ipas') || DATA_KURIKULUM_PUSAT[0];
  } else {
    return DATA_KURIKULUM_PUSAT.find((i) => i.id === 'smp-fase-d-ipa') || DATA_KURIKULUM_PUSAT[6];
  }
}

/**
 * Helper: Dapatkan daftar mata pelajaran spesifik yang tersedia untuk Guru tersebut
 * Menghindari pencampuran mapel antar jenjang atau antar guru mapel!
 */
export function getMataPelajaranKhususGuru(user?: {
  teacherLevel?: 'SD' | 'SMP';
  role?: string;
  kelasYangDiajar?: string;
  mataPelajaran?: string;
}): string[] {
  if (!user) {
    return ['Ilmu Pengetahuan Alam dan Sosial (IPAS)', 'Matematika', 'Bahasa Indonesia'];
  }

  // JIKA GURU SMP:
  if (user.teacherLevel === 'SMP') {
    // Jika guru memilih mata pelajaran tertentu saat pendaftaran
    if (
      user.mataPelajaran &&
      user.mataPelajaran.trim() &&
      !user.mataPelajaran.includes('Mata Pelajaran SMP') &&
      !user.mataPelajaran.includes('Semua Mapel')
    ) {
      return [user.mataPelajaran];
    }
    // Jika belum terkunci satu mapel, berikan daftar resmi mapel SMP BSKAP
    return [
      'Ilmu Pengetahuan Alam (IPA)',
      'Matematika',
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'Ilmu Pengetahuan Sosial (IPS)',
      'Pendidikan Pancasila',
      'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
      'Pendidikan Agama dan Budi Pekerti (PABP)',
      'Informatika',
      'Seni dan Prakarya',
    ];
  }

  // JIKA GURU SD:
  const normMapel = (user.mataPelajaran || '').toLowerCase();
  const normKelas = (user.kelasYangDiajar || '').toLowerCase();

  // 1. Cek apakah Guru Mapel Khusus SD (PJOK atau Agama)
  if (normMapel.includes('pjok') || normMapel.includes('jasmani') || normKelas.includes('pjok')) {
    return ['Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)'];
  }
  if (normMapel.includes('agama') || normMapel.includes('pabp') || normKelas.includes('agama')) {
    return ['Pendidikan Agama dan Budi Pekerti (PABP)'];
  }

  // 2. Guru Kelas SD (Kelas 1 - 6)
  // Menampilkan HANYA paket mapel tematik pokok untuk kelas tersebut tanpa campur mapel luar!
  if (normKelas.includes('1') || normKelas.includes('2')) {
    // Fase A: Tematik Dasar (Belum ada IPAS terpisah)
    return [
      'Bahasa Indonesia',
      'Matematika',
      'Pendidikan Pancasila',
      'Seni dan Budaya',
    ];
  }

  // Kelas 3, 4, 5, 6 (Fase B & C): Ada IPAS
  return [
    'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    'Bahasa Indonesia',
    'Matematika',
    'Pendidikan Pancasila',
    'Seni dan Budaya',
  ];
}
