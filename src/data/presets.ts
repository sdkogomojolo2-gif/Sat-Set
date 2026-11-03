import { PresetItem } from '../types/modul';

export const KURIKULUM_PRESETS: PresetItem[] = [
  {
    id: 'smp-ipa-ekosistem',
    jenjang: 'SMP',
    label: 'IPA Kelas 7: Ekosistem & Jaring Makanan',
    mataPelajaran: 'Ilmu Pengetahuan Alam (IPA)',
    faseKelas: 'Fase D (Kelas 7 SMP)',
    topikMateri: 'Interaksi Antar Komponen Ekosistem dan Jaring-Jaring Makanan',
    alokasiWaktu: '2 JP x 40 Menit (80 Menit)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    profilPancasila: ['Bernalar Kritis', 'Bergotong Royong', 'Kreatif'],
    deskripsi: 'Menganalisis dampak kepunahan salah satu spesies dalam rantai makanan lokal sawah/hutan.',
  },
  {
    id: 'smp-matematika-plsv',
    jenjang: 'SMP',
    label: 'Matematika Kelas 7: Persamaan Linear (PLSV)',
    mataPelajaran: 'Matematika',
    faseKelas: 'Fase D (Kelas 7 SMP)',
    topikMateri: 'Persamaan Linear Satu Variabel dalam Masalah Finansial Sehari-hari',
    alokasiWaktu: '2 JP x 40 Menit (80 Menit)',
    modelPembelajaran: 'Discovery Learning',
    profilPancasila: ['Bernalar Kritis', 'Mandiri'],
    deskripsi: 'Menemukan konsep solusi persamaan linear melalui permodelan timbangan dan budgeting belanja.',
  },
  {
    id: 'smp-bindo-eksplanasi',
    jenjang: 'SMP',
    label: 'B. Indonesia Kelas 8: Teks Eksplanasi',
    mataPelajaran: 'Bahasa Indonesia',
    faseKelas: 'Fase D (Kelas 8 SMP)',
    topikMateri: 'Menulis Teks Eksplanasi Fenomena Alam dan Bencana Lingkungan',
    alokasiWaktu: '3 JP x 40 Menit (120 Menit)',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    profilPancasila: ['Bernalar Kritis', 'Kreatif', 'Bergotong Royong'],
    deskripsi: 'Menghasilkan infografis eksplanasi sebab-akibat fenomena banjir dan tanah longsor.',
  },
  {
    id: 'sd-ipas-siklus-air',
    jenjang: 'SD',
    label: 'IPAS Kelas 4: Siklus Air & Konservasi',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    faseKelas: 'Fase B (Kelas 4 SD)',
    topikMateri: 'Daur Air dan Upaya Menjaga Ketersediaan Air Bersih',
    alokasiWaktu: '2 JP x 35 Menit (70 Menit)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    profilPancasila: ['Beriman & Bertakwa', 'Bergotong Royong', 'Bernalar Kritis'],
    deskripsi: 'Investigasi mengapa air di bumi tidak pernah habis dan cara hemat air di rumah & sekolah.',
  },
  {
    id: 'sd-mtk-pecahan',
    jenjang: 'SD',
    label: 'Matematika Kelas 5: Pecahan Kontekstual',
    mataPelajaran: 'Matematika',
    faseKelas: 'Fase C (Kelas 5 SD)',
    topikMateri: 'Operasi Penjumlahan & Pengurangan Pecahan Berpenyebut Beda',
    alokasiWaktu: '2 JP x 35 Menit (70 Menit)',
    modelPembelajaran: 'Contextual Teaching and Learning (CTL)',
    profilPancasila: ['Bernalar Kritis', 'Mandiri'],
    deskripsi: 'Menggunakan simulasi pemotongan kue tradisional dan pembagian resep masakan nusantara.',
  },
  {
    id: 'sd-pancasila-keragaman',
    jenjang: 'SD',
    label: 'P. Pancasila Kelas 4: Gotong Royong',
    mataPelajaran: 'Pendidikan Pancasila',
    faseKelas: 'Fase B (Kelas 4 SD)',
    topikMateri: 'Mengenal Keragaman Budaya dan Praktik Gotong Royong di Lingkungan Sekitar',
    alokasiWaktu: '2 JP x 35 Menit (70 Menit)',
    modelPembelajaran: 'Cooperative Learning',
    profilPancasila: ['Berkebinekaan Global', 'Bergotong Royong'],
    deskripsi: 'Simulasi karnaval mini keragaman suku nusantara dan pemecahan masalah gotong royong warga.',
  },
  {
    id: 'sma-fisika-newton',
    jenjang: 'SMA',
    label: 'Fisika Kelas 10: Hukum Gerak Newton',
    mataPelajaran: 'Fisika',
    faseKelas: 'Fase E (Kelas 10 SMA)',
    topikMateri: 'Hukum Gerak Newton dan Rekayasa Keselamatan Berkendara (Seatbelt & Airbag)',
    alokasiWaktu: '3 JP x 45 Menit (135 Menit)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    profilPancasila: ['Bernalar Kritis', 'Kreatif'],
    deskripsi: 'Eksperimen inersia dan analisis fisika di balik fungsi sabuk pengaman kendaraan bermotor.',
  },
  {
    id: 'sma-biologi-biotek',
    jenjang: 'SMA',
    label: 'Biologi Kelas 11: Bioteknologi Pangan',
    mataPelajaran: 'Biologi',
    faseKelas: 'Fase F (Kelas 11 SMA)',
    topikMateri: 'Prinsip Bioteknologi Konvensional Melalui Pembuatan Produk Fermentasi Pangan',
    alokasiWaktu: '3 JP x 45 Menit (135 Menit)',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    profilPancasila: ['Kreatif', 'Bergotong Royong', 'Mandiri'],
    deskripsi: 'Rancang bangun proyek pembuatan yogurt, tempe, atau kombucha dengan kontrol variabel ilmiah.',
  },
  {
    id: 'smk-rpl-web',
    jenjang: 'SMK',
    label: 'Informatika/RPL Kelas 11: Web & Algoritma',
    mataPelajaran: 'Konsentrasi Keahlian RPL / Rekayasa Perangkat Lunak',
    faseKelas: 'Fase F (Kelas 11 SMK)',
    topikMateri: 'Penerapan Logika Algoritma & Desain Antarmuka Web Responsif',
    alokasiWaktu: '4 JP x 45 Menit (180 Menit)',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    profilPancasila: ['Bernalar Kritis', 'Kreatif', 'Mandiri'],
    deskripsi: 'Membuat prototype halaman landing page UMKM lokal yang responsif dan aksesibel.',
  },
];

export const INITIAL_SAMPLE_MODUL = `# MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)
## KURIKULUM MERDEKA - STANDAR RESMI DINAS PENDIDIKAN TAHUN AJARAN 2026/2027

---

## I. INFORMASI UMUM

- **Nama Penyusun**: Fadli R., S.Pd., Gr.
- **Institusi/Sekolah**: SMP Negeri 1 Palasa
- **Tahun Ajaran / Semester**: 2026/2027 / Ganjil
- **Jenjang / Fase / Kelas**: SMP / Fase D / Kelas VII (Tujuh)
- **Mata Pelajaran / Tema**: Ilmu Pengetahuan Alam (IPA) / Interaksi Komponen Ekosistem dan Jaring-Jaring Makanan
- **Alokasi Waktu**: 2 JP x 40 Menit (80 Menit)
- **Kompetensi Awal (Prasyarat)**: Peserta didik telah mampu membedakan komponen biotik dan abiotik di lingkungan sekitar serta memahami kebutuhan dasar nutrisi organisme untuk melangsungkan kehidupannya.
- **Profil Pelajar Pancasila**: 
  - **Bernalar Kritis**: Mengidentifikasi, mengklarifikasi, dan mengolah informasi terkait jaring-jaring makanan dan dampak ketidakseimbangan rantai trofik.
  - **Bergotong Royong**: Bekerja sama, berkomunikasi aktif, dan berbagi peran dalam menyelidiki studi kasus ekologi sawah.
  - **Kreatif**: Mengonstruksi bagan jaring-jaring makanan visual dan merumuskan alternatif solusi pelestarian ekosistem lokal.
- **Sarana dan Prasarana**: LCD Proyektor, laptop, kartu bergambar organisme ekosistem sawah, kertas plano, spidol warna, LKPD penyelidikan, buku guru dan siswa Kemendikbudristek.
- **Target Peserta Didik**: Peserta didik reguler, cepat paham (pencapaian tinggi), dan butuh bimbingan khusus (Diferensiasi Pembelajaran).

---

## II. DESAIN PEMBELAJARAN MENDALAM

### 1. Capaian & Tujuan Pembelajaran
- **Capaian Pembelajaran (CP)**: Pada akhir Fase D, peserta didik mampu mengidentifikasi interaksi antarmakhluk hidup dan lingkungannya, serta merancang upaya pencegahan dan penanggulangan ketidakseimbangan ekosistem.
- **Tujuan Pembelajaran (TP)**: 
  1. Melalui eksplorasi kartu organisme dan studi kasus terarah, peserta didik mampu mengonstruksi jaring-jaring makanan minimal 3 rantai makanan yang saling bersilangan dengan tepat dan logis.
  2. Melalui diskusi investigatif, peserta didik mampu menganalisis dampak kepunahan salah satu tingkat trofik terhadap kestabilan ekosistem serta merumuskan rekomendasi pemecahan masalah kontekstual secara kritis.

### 2. Dimensi Deep Learning
- **Pemahaman Bermakna (Big Idea / Enduring Understanding)**: 
  Seluruh makhluk hidup di bumi terhubung dalam jejaring kehidupan yang harmonis. Perusakan atau pemusnahan terhadap satu makhluk hidup (meskipun dianggap menakutkan atau sepele) dapat memicu kehancuran berantai yang berujung pada ancaman ketahanan pangan manusia secara langsung.
- **Pertanyaan Pemantik (Essential Question)**: 
  1. *"Mengapa perburuan burung hantu dan ular sawah justru mengakibatkan petani merugi hingga ratusan juta rupiah akibat gagal panen?"*
  2. *"Apa yang akan terjadi pada kehidupan manusia jika salah satu makhluk kecil di alam punah tanpa kita sadari?"*

---

## III. ASESMEN PEMBELAJARAN

- **Asesmen Diagnostik (Awal)**: 
  Kuis visual 3 menit mengelompokkan organisme produsen, konsumen, dan dekomposer untuk memetakan kesiapan dan profil belajar siswa ke dalam kelompok berdiferensiasi.
- **Asesmen Formatif (Proses)**: 
  Lembar observasi keaktifan diskusi kelompok, ceklist keterampilan menyusun bagan transfer energi, jurnal refleksi singkat berkala, dan umpan balik antarteman (*peer assessment: Two Stars and a Wish*).
- **Asesmen Sumatif (Akhir)**: 
  Tugas autentik berbasis unjuk kerja kelompok memecahkan kasus ledakan hama dan penyusunan bagan jaring makanan, dinilai dengan rubrik analitik berjenjang (*Mulai Berkembang, Berkembang, Cakap, Mahir*).

---

## IV. LANGKAH-LANGKAH PEMBELAJARAN
### Pertemuan Ke-1 (Alokasi Waktu: 2 JP x 40 Menit = 80 Menit)

#### A. Tahap Berkesadaran (Mindful Learning / Mengalami & Terhubung) — (± 15 Menit)
1. **Kondisi Emosional & Fokus**: 
   - Guru membuka kelas dengan salam hangat khas Indonesia, menyapa siswa, dan memandu doa bersama (**Profil Pelajar Pancasila: Beriman & Bertakwa**).
   - Guru mengajak seluruh siswa melakukan latihan kesadaran penuh (*Mindful Breathing / Teknik STOP*: Stop sejenak, Tarik napas perlahan, Observasi perasaan, Proceed/Lanjutkan) selama 2 menit untuk menstabilkan konsentrasi dan kesiapan mental belajar.
2. **Apersepsi Kontekstual**: 
   - Guru menayangkan 2 foto perbandingan di layar proyektor: Sawah hijau royo-royo siap panen vs Sawah puso yang ludes dimakan jutaan hama tikus. Siswa diajak mengamati dan menghubungkan fenomena dengan pengalaman lingkungan sekitarnya.
3. **Pemberian Pertanyaan Pemantik**: 
   - Guru menyajikan cuplikan berita investigasi singkat: *"Wabah Tikus Karawang: Puluhan Hektar Padi Rusak Pasca Perburuan Ular dan Burung Hantu"*.
   - Guru melontarkan pertanyaan pemantik yang memicu rasa ingin tahu mendalam: *"Siapa yang sebenarnya menjadi benteng utama pelindung beras kita di sawah?"*

#### B. Tahap Bermakna (Meaningful Learning / Mengonstruksi & Mengembangkan) — (± 35 Menit)
1. **Eksplorasi Konseptual**: 
   - Siswa menggali informasi konsep rantai makanan, produsen, konsumen primer/sekunder/tersier, dan pengurai melalui bahan bacaan dan set kartu organisme terlampir.
2. **Kolaborasi & Investigasi (Diferensiasi Konten & Proses)**: 
   - Siswa dibagi ke dalam kelompok kolaboratif beranggotakan 4-5 orang sesuai profil kesiapan belajar:
     - **Kelompok Butuh Bimbingan (Diferensiasi Proses)**: Guru memberikan pendampingan intensif (*scaffolding* terarah) berbantu kartu organisme berwarna dan diagram panah aliran energi awal.
     - **Kelompok Berkembang / Reguler**: Siswa menyusun jaring-jaring makanan mandiri dari kartu acak dan menganalisis peran masing-masing trofik.
     - **Kelompok Mahir / Cepat Paham**: Siswa memecahkan tantangan multi-variabel (efek domino perubahan iklim digabung dengan perburuan predator puncak).
   - Siswa mengorganisasikan fakta, menghubungkan konsep lama dengan konsep baru, dan memetakan pola pemikiran (*concept mapping*) pada lembar kerja plano kelompok.
3. **Penerapan Autentik**: 
   - Siswa menerapkan pengetahuan pada situasi riil dengan merumuskan proposal solusi ekologis ramah lingkungan bagi petani setempat (misal: perbanyakan rumah burung hantu *Tyto alba* dan larangan perburuan ular).

#### C. Tahap Menyenangkan (Joyful Learning / Mengomunikasikan & Mengapresiasi) — (± 18 Menit)
1. **Unjuk Karya / Gagasan**: 
   - Perwakilan kelompok mempresentasikan bagan jaring-jaring makanan dan argumen solusi ekologis mereka dalam format karya variatif (bagan plano interaktif, infografis mini, atau simulasi rantai makanan langsung).
2. **Apresiasi & Umpan Balik Konstruktif**: 
   - Sesi saling memberikan apresiasi antarkelompok menggunakan metode *Two Stars and a Wish* (2 pujian tulus atas gagasan cemerlang teman dan 1 masukan membangun).
   - Guru mengonfirmasi konsep ilmiah, mengoreksi miskonsepsi (arah panah energi mengalir dari yang dimakan ke pemakan), dan memberikan apresiasi tepuk salut kepada seluruh peserta didik.

#### D. Refleksi & Integrasi Diri — (± 12 Menit)
1. **Simpulan Pembelajaran Bersama**: 
   - Guru dan siswa merangkum intisari pembelajaran: keterikatan makhluk hidup adalah pondasi keseimbangan bumi.
2. **Pengisian Kartu Refleksi Diri Deep Learning**: 
   - Setiap peserta didik menjawab tiga pertanyaan refleksi personal secara jujur:
     - *1. Apa hal paling penting dan mengejutkan yang saya pelajari hari ini?*
     - *2. Bagaimana saya akan menerapkan pengetahuan ini untuk menjaga lingkungan hidup di sekitarku?*
     - *3. Pertanyaan apa yang masih membuat saya penasaran untuk diteliti lebih lanjut?*
3. **Tindak Lanjut & Penutup**: 
   - Guru memberikan arahan eksplorasi mandiri mengamati ekosistem kebun rumah, berdoa penuh syukur, dan mengakhiri sesi dengan salam.

---

## V. LAMPIRAN

### 1. Lembar Kerja Peserta Didik (LKPD) Berorientasi Pemecahan Masalah
**MATA PELAJARAN**: ILMU PENGETAHUAN ALAM (IPA)  
**TOPIK**: INVESTIGASI KASUS KETIDAKSEIMBANGAN JARING MAKANAN SAWAH  
**KELAS / KELOMPOK**: VII / ............................................................  
**NAMA ANGGOTA**:  
1. ............................................................ (Ketua)  
2. ............................................................  
3. ............................................................  
4. ............................................................  

#### A. Petunjuk Kerja:
1. Amati kartu-kartu organisme ekosistem sawah yang ada di dalam amplop kelompokmu!
2. Susun dan hubungkan tanda panah aliran energi membentuk minimal 3 rantai makanan yang saling berjalinan menjadi jaring-jaring makanan!
3. Bacalah studi kasus nyata di bawah ini dan diskusikan solusinya secara gotong royong!

#### B. Studi Kasus Kontekstual:
> *"Di sebuah desa agraris, para pemburu menangkap ratusan ular sawah dan burung hantu setiap minggunya untuk dijual ke pasar eksotis. Enam bulan kemudian, populasi tikus meledak tak terkendali hingga memakan lebih dari 60 hektar tanaman padi petani sampai ludes."*

#### C. Pertanyaan Investigasi Kritis:
1. Berdasarkan studi kasus, gambarkan bagan jaring-jaring makanan yang terjadi di sawah desa tersebut!
2. Mengapa pembasmian ular dan burung hantu memicu ledakan populasi tikus secara eksponensial? Jelaskan mekanisme aliran energinya!
3. Solusi ramah lingkungan apa yang kelompok kalian rekomendasikan kepada kepala desa setempat agar panen terselamatkan tanpa menggunakan racun kimia berbahaya?

---

### 2. Bahan Bacaan Guru & Peserta Didik (Rangkuman Esensial)
- **Ekosistem dan Keseimbangan Dinamis**: Ekosistem tersusun atas komponen biotik (produsen, konsumen, pengurai) dan abiotik (tanah, air, udara, cahaya). Hubungan makan dan dimakan di alam membentuk jaring-jaring makanan kompleks yang berfungsi menjaga stabilitas populasi.
- **Tingkat Trofik dan Transfer Energi**: Energi matahari diikat oleh tumbuhan hijau (produsen / trofik 1) melalui fotosintesis, lalu dialirkan ke herbivora (konsumen I / trofik 2), berlanjut ke karnivora (trofik 3 & 4), dan akhirnya diuraikan oleh dekomposer. Dalam setiap perpindahan tingkatan trofik, hanya sekitar 10% energi yang berhasil ditransfer ke tingkat berikutnya.
- **Fenomena Trophic Cascade**: Ketika predator puncak (*top predator*) dihilangkan secara masif, kendala alami bagi herbivora hilang sehingga populasi hama membengkak dan menghancurkan produsen primer penopang ekosistem.

---

### 3. Instrumen & Rubrik Penilaian Analitik Berjenjang
| Dimensi Penilaian | Mulai Berkembang (0 - 65) | Berkembang (66 - 75) | Cakap (76 - 88) | Mahir (89 - 100) |
|---|---|---|---|---|
| **1. Desain Jaring Makanan** | Belum mampu mengelompokkan trofik dengan benar | Mampu menyusun 1 rantai makanan namun arah panah energi terbalik | Mampu menyusun jaring-jaring makanan (2-3 rantai) secara tepat | Mengonstruksi jaring makanan kompleks (>3 rantai) lengkap dengan peran dekomposer secara sempurna |
| **2. Penalaran Kasus Kritis** | Jawaban belum memuat alasan logis | Mampu mengidentifikasi 1 dampak secara umum tanpa analisis alur trofik | Mampu menganalisis hubungan sebab-akibat kepunahan predator terhadap ledakan hama | Mampu membedah fenomena trophic cascade mendalam serta merumuskan rekomendasi ekologis aplikatif |
| **3. Kolaborasi & Empati** | Pasif atau kurang berkontribusi dalam kelompok | Berpartisipasi saat diingatkan teman | Aktif berdiskusi, membagi tugas, dan menghargai ide rekan | Menjadi penggerak kelompok, merangkul semua teman, dan fasilitator musyawarah mufakat |
| **4. Komunikasi & Unjuk Karya** | Paparan tidak terstruktur dan sulit dipahami | Hasil karya rapi namun penjelasan masih terbata-bata | Hasil karya komunikatif, visual rapi, dan percaya diri saat unjuk karya | Karya sangat kreatif, visual memikat, artikulatif, dan responsif terhadap pertanyaan audiens |

---

### 4. Glosarium
- **Deep Learning (Pembelajaran Mendalam)**: Pendekatan pembelajaran yang berorientasi pada pemahaman konsep mendalam dan bermakna melalui 3 pilar: Berkesadaran (*Mindful*), Bermakna (*Meaningful*), dan Menyenangkan (*Joyful*).
- **Komponen Biotik**: Seluruh makhluk hidup yang menempati suatu ekosistem (tumbuhan, hewan, mikroorganisme).
- **Komponen Abiotik**: Faktor fisik dan kimia tak hidup yang memengaruhi ekosistem (suhu, air, tanah, intensitas cahaya).
- **Tingkat Trofik**: Kedudukan suatu organisme dalam tingkatan piramida makanan ekosistem.
- **Trophic Cascade**: Efek berantai yang timbul pada seluruh tingkat ekosistem akibat penurunan atau hilangnya predator puncak.
- **Two Stars and a Wish**: Metode asesmen formatif sebaya dengan memberikan dua apresiasi positif dan satu harapan/saran konstruktif.

---

### 5. Daftar Pustaka
1. Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP). (2024). *Panduan Pembelajaran dan Asesmen Kurikulum Merdeka Edisi Revisi*. Jakarta: Kemendikbudristek RI.
2. Campbell, N.A., & Reece, J.B. (2020). *Biologi Edisi Kesepuluh Jilid 3*. Jakarta: Penerbit Erlangga.
3. Fullan, M., Quinn, J., & McEachen, J. (2018). *Deep Learning: Engage the World Change the World*. Thousand Oaks: Corwin Press.
4. Kemendikbudristek RI. (2022). *Ilmu Pengetahuan Alam untuk SMP Kelas VII Buku Guru dan Buku Siswa*. Jakarta: Pusat Perbukuan Kemendikbudristek.

---

### LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR
Mengetahui dan Mengesahkan:
Palasa, 29 September 2026

<table style="width: 100%; border: none;">
  <tr>
    <td style="width: 33%; text-align: center; border: none; vertical-align: top;">
      Mengetahui,<br>
      <strong>Kepala Satuan Pendidikan</strong><br><br><br><br>
      <strong><u>HADJRIN, S.Pd</u></strong><br>
      NIP. 19700712 199606 1 001
    </td>
    <td style="width: 34%; text-align: center; border: none; vertical-align: top;">
      Diverifikasi oleh:<br>
      <strong>Pengawas Pembina Sekolah</strong><br><br><br><br>
      <strong><u>Drs. H. Subagyo, M.Pd.</u></strong><br>
      NIP. 19680315 199503 1 002
    </td>
    <td style="width: 33%; text-align: center; border: none; vertical-align: top;">
      Disusun oleh:<br>
      <strong>Guru Mata Pelajaran</strong><br><br><br><br>
      <strong><u>Fadli R., S.Pd., Gr.</u></strong><br>
      NIP. 19900101 202012 1 001
    </td>
  </tr>
</table>
`;

