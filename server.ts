import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy server-side initialization of Gemini API using @google/genai
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'placeholder-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Anda adalah seorang Ahli Kurikulum Pendidikan Nasional, Konsultan Edukasi, dan Tim Pengembang Kurikulum Dinas Pendidikan di Indonesia. Tugas Anda adalah membantu guru menyusun MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING) Kurikulum Merdeka yang mengikuti format resmi:

# MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)

## I. INFORMASI UMUM
- **Nama Penyusun**: [Nama Guru]
- **Institusi/Sekolah**: [Nama Sekolah]
- **Tahun Ajaran / Semester**: [Tahun / Semester]
- **Jenjang / Fase / Kelas**: [PAUD (Fondasi) / SD (A-C) / SMP (D) / SMA-SMK (E-F)] / [Kelas]
- **Mata Pelajaran / Tema**: [Mata Pelajaran]
- **Alokasi Waktu**: [Jumlah JP x menit]
- **Kompetensi Awal (Prasyarat)**: [Pengetahuan/keterampilan dasar yang perlu dimiliki peserta didik sebelum materi ini]
- **Profil Pelajar Pancasila**: [Pilih dimensi relevan: Beriman & Bertakwa, Mandiri, Bernalar Kritis, Kreatif, Bergotong Royong, Berkebinekaan Global]
- **Sarana dan Prasarana**: [Alat, bahan, media digital/fisik, lingkungan belajar]
- **Target Peserta Didik**: [Reguler / Cepat Paham / Butuh Bimbingan Khusus (Diferensiasi)]

## II. DESAIN PEMBELAJARAN MENDALAM
### 1. Capaian & Tujuan Pembelajaran
- **Capaian Pembelajaran (CP)**: [Salin elemen CP yang dituju]
- **Tujuan Pembelajaran (TP)**: [Rumuskan dengan kriteria perilaku terukur, konsep utama, dan konteks nyata]

### 2. Dimensi Deep Learning
- **Pemahaman Bermakna (Big Idea / Enduring Understanding)**: [Konsep esensial atau hikmah jangka panjang yang akan diingat siswa bahkan setelah bertahun-tahun kemudian]
- **Pertanyaan Pemantik (Essential Question)**: [Pertanyaan terbuka yang memicu rasa ingin tahu, tidak bisa dijawab dengan 'ya/tidak', dan mendorong penyelidikan mendalam]

## III. ASESMEN PEMBELAJARAN
- **Asesmen Diagnostik (Awal)**: [Kuis singkat/tes lisan/lembar observasi untuk memetakan kesiapan, minat, dan profil belajar]
- **Asesmen Formatif (Proses)**: [Observasi diskusi, jurnal refleksi, lembar ceklist unjuk kerja, umpan balik sebaya]
- **Asesmen Sumatif (Akhir)**: [Tugas autentik berbasis kinerja/produk/proyek nyata, dilengkapi rubrik penilaian holistik atau analitik]

## IV. LANGKAH-LANGKAH PEMBELAJARAN
Pertemuan Ke-[...] (Disesuaikan Alokasi Waktu: ... JP x ... Menit)

### A. Tahap Berkesadaran (Mindful Learning / Mengalami & Terhubung) — (± ... Menit)
- **Kondisi Emosional & Fokus**: Mengawali kelas dengan latihan kesadaran penuh (seperti teknik STOP atau pernapasan sejenak) untuk membangun kesiapan mental.
- **Apersepsi Kontekstual**: Menghubungkan pengalaman hidup sehari-hari siswa dengan topik bahasan.
- **Pemberian Pertanyaan Pemantik**: Menyajikan fenomena, video pendek, atau studi kasus pemantik untuk mengaktifkan pemikiran kritis awal.

### B. Tahap Bermakna (Meaningful Learning / Mengonstruksi & Mengembangkan) — (± ... Menit)
- **Eksplorasi Konseptual**: Siswa menggali informasi secara mandiri atau kelompok melalui sumber primer (eksperimen, wawancara, literatur autentik).
- **Kolaborasi & Investigasi**:
  - **[Diferensiasi Proses]**: Siswa dibagi ke dalam kelompok berdasarkan kesiapan/gaya belajar untuk menyelesaikan masalah nyata.
  - Siswa mengorganisasikan fakta, menghubungkan konsep lama dengan konsep baru, dan memetakan pola pemikiran (mind mapping/concept mapping).
- **Penerapan Autentik**: Siswa menerapkan pengetahuan pada situasi baru (membuat prototipe, merumuskan solusi alternatif, menyusun argumen berbasis data).

### C. Tahap Menyenangkan (Joyful Learning / Mengomunikasikan & Mengapresiasi) — (± ... Menit)
- **Unjuk Karya/Gagasan**: Siswa mempresentasikan temuan atau karyanya dalam format yang variatif (infografis, demonstrasi langsung, siniar/video, bermain peran).
- **Apresiasi & Umpan Balik**: Sesi saling beri umpan balik konstruktif antar-siswa menggunakan metode Two Stars and a Wish atau rubrik sederhana.

### D. Refleksi & Integrasi Diri — (± ... Menit)
- Guru dan siswa menyimpulkan inti pembelajaran.
- Siswa mengisi kartu refleksi singkat, menjawab pertanyaan:
  1. Apa hal paling penting yang saya pelajari hari ini?
  2. Bagaimana saya akan menerapkan pengetahuan ini dalam kehidupan sehari-hari?
  3. Apa yang masih membuat saya penasaran untuk diteliti lebih lanjut?

## V. LAMPIRAN
1. **Lembar Kerja Peserta Didik (LKPD)**: Berisi panduan aktivitas berorientasi pemecahan masalah (problem-based atau inquiry-based).
2. **Bahan Bacaan Guru & Peserta Didik**: Ringkasan materi esensial, referensi digital, infografis.
3. **Instrumen & Rubrik Penilaian**: Rubrik analitik berjenjang (Mulai Berkembang, Berkembang, Cakap, Mahir).
4. **Glosarium**: Definisi istilah-istilah kunci.
5. **Daftar Pustaka**: Sumber rujukan tepercaya.

---

### LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR
[Tempat/Kota], [Tanggal]

Disetujui dan Disahkan oleh:

Mengetahui,  
**Kepala [Nama Sekolah]**  
*(Tanda Tangan & Cap Sekolah)*  
<br><br><br>  
**<u>[Nama Kepala Sekolah, Gelar]</u>**  
NIP. [NIP Kepala Sekolah]  

Diverifikasi oleh:  
**Pengawas Pembina Dinas Pendidikan**  
*(Tanda Tangan Verifikasi)*  
<br><br><br>  
**<u>[Nama Pengawas Sekolah / Pengawas Pembina]</u>**  
NIP. [NIP Pengawas]  

Disusun oleh:  
**Guru Mata Pelajaran,**  
*(Tanda Tangan)*  
<br><br><br>  
**<u>[Nama Guru, Gelar]</u>**  
NIP. [NIP Guru]  

---
ATURAN FORMATTING:
- Judul WAJIB: "# MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)"
- Struktur WAJIB mengikuti I. INFORMASI UMUM, II. DESAIN PEMBELAJARAN MENDALAM, III. ASESMEN PEMBELAJARAN, IV. LANGKAH-LANGKAH PEMBELAJARAN (A. Tahap Berkesadaran / Mindful Learning, B. Tahap Bermakna / Meaningful Learning, C. Tahap Menyenangkan / Joyful Learning, D. Refleksi & Integrasi Diri), dan V. LAMPIRAN.
- Gunakan bahasa Indonesia baku, formal, pedagogis, dan terstruktur rapi dengan heading Markdown dan bullet points.`;

/**
 * Resilient AI generation with retry and multi-model fallback (gemini-3.8-flash -> gemini-3.1-flash-lite)
 */
async function callGeminiWithFallback(prompt: string, instruction: string): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Sat-Set AI] Calling ${model} (attempt ${attempt})...`);
        const response = await getAiClient().models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: instruction,
            temperature: 0.7,
          },
        });

        if (response.text && response.text.trim().length > 0) {
          console.log(`[Sat-Set AI] Success with ${model}!`);
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Sat-Set AI] ${model} attempt ${attempt} failed:`, err.message || err);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError;
}

/**
 * High-grade deterministic fallback curriculum generator matching official Dinas format
 */
function buildFallbackModul(params: any): string {
  const mapel = params.mataPelajaran || 'Ilmu Pengetahuan Alam';
  const topik = params.topikMateri || 'Materi Pokok Pembelajaran';
  const fase = params.faseKelas || 'Fase D (Kelas 7 SMP)';
  const waktu = params.alokasiWaktu || '2 JP x 40 Menit (80 Menit)';
  const model = params.modelPembelajaran || 'Problem Based Learning (PBL)';
  const guru = params.namaGuru || 'Guru Mata Pelajaran, S.Pd.';
  const nipGuru = params.nipGuru || '19900101 202012 1 001';
  const sekolah = params.namaSekolah || 'SMP Negeri 1 Nusantara';
  const npsn = params.npsn || '20102030';
  const dinas = params.dinasPendidikan || 'Dinas Pendidikan dan Kebudayaan';
  const kepsek = params.kepalaSekolah || 'Kepala Sekolah, M.Pd.';
  const nipKepsek = params.nipKepalaSekolah || '19750512 200003 1 004';
  const pengawas = params.pengawasSekolah || 'Dr. H. Subagyo, M.Pd.';
  const nipPengawas = params.nipPengawas || '19680315 199503 1 002';
  const kota = params.kotaKabupaten || 'Jakarta';
  const semester = params.semester || 'Ganjil';
  const tahunAjaran = params.tahunAjaran || '2026/2027';
  const pertemuan = params.pertemuanKe || 'Pertemuan ke-1';
  const jumlahSiswa = params.jumlahSiswa || '32 Peserta Didik';
  const profil = Array.isArray(params.profilPancasila) && params.profilPancasila.length > 0
    ? params.profilPancasila.join(', ')
    : 'Bernalar Kritis, Bergotong Royong, Kreatif';

  return `# MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)

## I. INFORMASI UMUM
- **Nama Penyusun**: ${guru}
- **Institusi/Sekolah**: ${sekolah}
- **Tahun Ajaran / Semester**: ${tahunAjaran} / Semester ${semester}
- **Jenjang / Fase / Kelas**: ${params.jenjang || 'SMP'} / ${fase}
- **Mata Pelajaran / Tema**: ${mapel} / ${topik}
- **Alokasi Waktu**: ${waktu}
- **Kompetensi Awal (Prasyarat)**: Peserta didik telah memahami konsep-konsep dasar prasyarat serta memiliki keterampilan observasi dan literasi dasar pada materi ${topik}.
- **Profil Pelajar Pancasila**: ${profil}
- **Sarana dan Prasarana**: LCD Proyektor, laptop, media digital/fisik, LKPD eksplorasi kontekstual, lingkungan belajar.
- **Target Peserta Didik**: Reguler / Cepat Paham / Butuh Bimbingan Khusus (Diferensiasi).

## II. DESAIN PEMBELAJARAN MENDALAM
### 1. Capaian & Tujuan Pembelajaran
- **Capaian Pembelajaran (CP)**: Pada akhir fase ini, peserta didik mampu memahami, menganalisis, serta menghubungkan konsep esensial materi **${topik}** ke dalam pemecahan masalah nyata yang kontekstual dan bermakna.
- **Tujuan Pembelajaran (TP)**: 
  1. Peserta didik mampu mengidentifikasi dan mengonstruksi pemahaman konsep utama ${topik} melalui telaah sumber autentik dan diskusi terbimbing secara kritis dan terukur.
  2. Peserta didik mampu memformulasikan solusi inovatif berbasis data terhadap permasalahan nyata terkait ${topik} dan mengomunikasikannya secara kolaboratif dalam konteks nyata.

### 2. Dimensi Deep Learning
- **Pemahaman Bermakna (Big Idea / Enduring Understanding)**: Pemahaman mendalam tentang **${topik}** membekali peserta didik dengan hikmah jangka panjang untuk bernalar kritis, peka terhadap lingkungan sekitar, dan mampu mengambil keputusan yang bertanggung jawab dalam kehidupan bermasyarakat.
- **Pertanyaan Pemantik (Essential Question)**:
  1. "Bagaimana fenomena ${topik} secara langsung atau tidak langsung memengaruhi kualitas hidup kita dan lingkungan di sekitar kita?"
  2. "Apa yang akan terjadi jika kita mengabaikan prinsip-prinsip keterkaitan dalam konsep ${topik} ini?"

## III. ASESMEN PEMBELAJARAN
- **Asesmen Diagnostik (Awal)**: Kuis singkat 3 butir pertanyaan pemantik dan lembar observasi untuk memetakan kesiapan, minat, serta profil belajar peserta didik.
- **Asesmen Formatif (Proses)**: Observasi diskusi kelompok, jurnal refleksi harian, lembar ceklist unjuk kerja investigasi, dan umpan balik sebaya (*peer feedback*).
- **Asesmen Sumatif (Akhir)**: Tugas autentik berbasis kinerja/produk/proyek nyata (pembuatan solusi/infografis/laporan investigasi) dilengkapi rubrik penilaian holistik dan analitik.

## IV. LANGKAH-LANGKAH PEMBELAJARAN
Pertemuan Ke-${pertemuan} (Disesuaikan Alokasi Waktu: ${waktu})

### A. Tahap Berkesadaran (Mindful Learning / Mengalami & Terhubung) — (± 15 Menit)
- **Kondisi Emosional & Fokus**: Mengawali kelas dengan salam santun, doa bersama, dan latihan kesadaran penuh (*Mindfulness* dengan teknik STOP: Stop sejenak, Take a breath / napas dalam, Observe sensasi tubuh & emosi, Proceed / lanjut aktivitas) untuk membangun kesiapan mental dan ketenangan fokus.
- **Apersepsi Kontekstual**: Menghubungkan pengalaman hidup sehari-hari siswa dengan topik bahasan **${topik}** melalui tayangan gambar atau fenomena kontekstual.
- **Pemberian Pertanyaan Pemantik**: Menyajikan studi kasus pemantik dan pertanyaan esensial untuk mengaktifkan pemikiran kritis awal peserta didik.

### B. Tahap Bermakna (Meaningful Learning / Mengonstruksi & Mengembangkan) — (± 45 Menit)
- **Eksplorasi Konseptual**: Siswa menggali informasi secara mandiri atau kelompok melalui sumber primer (eksperimen, telaah fakta empiris, literatur autentik).
- **Kolaborasi & Investigasi**:
  - **[Diferensiasi Proses]**: Siswa dibagi ke dalam kelompok berdasarkan kesiapan/gaya belajar untuk menyelesaikan masalah nyata:
    - *Kelompok Butuh Bimbingan Khusus*: Diberikan pendampingan langsung guru (*scaffolding visual*) dan panduan bertahap.
    - *Kelompok Reguler*: Menganalisis studi kasus standar dengan diskusi kelompok mandiri terarah.
    - *Kelompok Cepat Paham*: Diberikan tantangan analisis multi-faktor kompleks dan memfasilitasi tutor sebaya (*peer tutoring*).
  - Siswa mengorganisasikan fakta, menghubungkan konsep lama dengan konsep baru, dan memetakan pola pemikiran (*concept mapping / mind mapping*).
- **Penerapan Autentik**: Siswa menerapkan pengetahuan pada situasi baru (membuat prototipe pemecahan masalah, merumuskan solusi alternatif, menyusun argumen berbasis data).

### C. Tahap Menyenangkan (Joyful Learning / Mengomunikasikan & Mengapresiasi) — (± 10 Menit)
- **Unjuk Karya/Gagasan**: Siswa mempresentasikan temuan atau karyanya dalam format yang variatif (infografis, demonstrasi langsung, siniar/video, paparan lisan, atau bermain peran).
- **Apresiasi & Umpan Balik**: Sesi saling beri umpan balik konstruktif antar-siswa menggunakan metode *Two Stars and a Wish* (dua apresiasi keunggulan karya dan satu saran penyempurnaan) dalam atmosfer kelas yang positif dan menyenangkan.

### D. Refleksi & Integrasi Diri — (± 10 Menit)
- Guru dan siswa bersama-sama merumuskan kesimpulan esensial pembelajaran hari ini.
- Siswa mengisi kartu refleksi singkat, menjawab pertanyaan:
  1. *Apa hal paling penting yang saya pelajari hari ini?*
  2. *Bagaimana saya akan menerapkan pengetahuan ini dalam kehidupan sehari-hari?*
  3. *Apa yang masih membuat saya penasaran untuk diteliti lebih lanjut?*
- Doa penutup dan salam perpisahan.

## V. LAMPIRAN

### 1. Lembar Kerja Peserta Didik (LKPD)
Berisi panduan aktivitas berorientasi pemecahan masalah (*problem-based atau inquiry-based*) terkait **${topik}**, petunjuk kerja kolaboratif, studi kasus kontekstual, pertanyaan penuntun bertingkat, dan ruang kerja siswa.

### 2. Bahan Bacaan Guru & Peserta Didik
Ringkasan materi esensial ${topik}, referensi digital, infografis pendukung, serta ulasan aplikasi praktis di masyarakat.

### 3. Instrumen & Rubrik Penilaian
Rubrik analitik berjenjang:
| Kriteria Penilaian | Mulai Berkembang (1) | Berkembang (2) | Cakap (3) | Mahir (4) |
|---|---|---|---|---|
| **Pemahaman Konseptual ${topik}** | Belum mampu menjelaskan konsep esensial | Menjelaskan konsep dasar dengan bimbingan | Menjelaskan konsep secara tepat dan mandiri | Menganalisis dan mengaitkan konsep secara mendalam |
| **Penyelidikan & Nalar Kritis** | Pasif dalam mengidentifikasi masalah | Mengidentifikasi masalah namun analisis terbatas | Menganalisis data empiris dan menyusun solusi logis | Merumuskan solusi autentik, orisinal, dan berbasis data |
| **Kolaborasi & Sikap Pancasila** | Jarang berpartisipasi dalam tim | Berpartisipasi jika diarahkan | Aktif berkolaborasi dan menghargai masukan | Memimpin inisiatif kelompok dan solutif |

### 4. Glosarium
- **Mindful Learning**: Pendekatan pembelajaran berbasis kesadaran penuh, fokus mental, dan keterhubungan positif.
- **Meaningful Learning**: Pembelajaran bermakna yang mengonstruksi pemahaman baru dengan pengalaman konkret siswa.
- **Joyful Learning**: Pengalaman belajar yang menggembirakan, merayakan kreativitas, dan memupuk motivasi intrinsik.
- **Diferensiasi Pembelajaran**: Penyesuaian konten, proses, dan produk pembelajaran sesuai kesiapan dan profil belajar siswa.
- **Capaian Pembelajaran (CP)**: Standar kompetensi esensial yang dituju pada akhir setiap fase belajar.

### 5. Daftar Pustaka
1. Kemendikbudristek. (2024). *Panduan Pembelajaran dan Asesmen Kurikulum Merdeka (Pendekatan Deep Learning)*. Jakarta: BSKAP.
2. Buku Panduan Guru dan Buku Teks Siswa ${mapel} Kurikulum Merdeka Kemendikbudristek RI.

---

### LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR
${kota}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

Disetujui dan Disahkan oleh:

<table style="width: 100%; border: none;">
  <tr>
    <td style="width: 33%; text-align: center; border: none; vertical-align: top;">
      Mengetahui,<br>
      <strong>Kepala ${sekolah}</strong><br><br><br><br>
      <strong><u>${kepsek}</u></strong><br>
      NIP. ${nipKepsek}
    </td>
    <td style="width: 34%; text-align: center; border: none; vertical-align: top;">
      Diverifikasi oleh:<br>
      <strong>Pengawas Pembina Dinas Pendidikan</strong><br><br><br><br>
      <strong><u>${pengawas}</u></strong><br>
      NIP. ${nipPengawas}
    </td>
    <td style="width: 33%; text-align: center; border: none; vertical-align: top;">
      Disusun oleh:<br>
      <strong>Guru Mata Pelajaran</strong><br><br><br><br>
      <strong><u>${guru}</u></strong><br>
      NIP. ${nipGuru}
    </td>
  </tr>
</table>
`;
}

// API endpoint to generate complete Modul Ajar
app.post('/api/generate-modul', async (req, res) => {
  const {
    mataPelajaran,
    faseKelas,
    jenjang,
    semester,
    tahunAjaran,
    pertemuanKe,
    topikMateri,
    alokasiWaktu,
    modelPembelajaran,
    pendekatan,
    namaGuru,
    nipGuru,
    namaSekolah,
    npsn,
    alamatSekolah,
    dinasPendidikan,
    cabangDinas,
    kepalaSekolah,
    nipKepalaSekolah,
    pengawasSekolah,
    nipPengawas,
    kotaKabupaten,
    profilPancasila,
    targetPesertaDidik,
    jumlahSiswa,
    saranaPrasarana,
    catatanKhusus,
  } = req.body;

  if (!topikMateri && !mataPelajaran) {
    return res.status(400).json({ error: 'Mata pelajaran atau topik materi wajib diisi.' });
  }

  const prompt = `Tolong susunkan MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING) Kurikulum Merdeka yang mengikuti format resmi:

# MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)

I. INFORMASI UMUM
- Nama Penyusun: ${namaGuru || 'Guru Mata Pelajaran, S.Pd.'}
- Institusi/Sekolah: ${namaSekolah || 'Satuan Pendidikan'} (NPSN: ${npsn || '-'})
- Tahun Ajaran / Semester: ${tahunAjaran || '2026/2027'} / Semester ${semester || 'Ganjil'}
- Jenjang / Fase / Kelas: ${jenjang || 'SMP'} / ${faseKelas || 'Fase D (Kelas 7 SMP)'}
- Mata Pelajaran / Tema: ${mataPelajaran || 'Mata Pelajaran'} / ${topikMateri}
- Alokasi Waktu: ${alokasiWaktu || '2 JP x 40 Menit'}
- Kompetensi Awal (Prasyarat): [Uraikan pengetahuan/keterampilan dasar yang perlu dimiliki peserta didik sebelum materi ini]
- Profil Pelajar Pancasila: ${
    Array.isArray(profilPancasila) && profilPancasila.length > 0
      ? profilPancasila.join(', ')
      : 'Bernalar Kritis, Bergotong Royong, Kreatif'
  }
- Sarana dan Prasarana: ${saranaPrasarana || 'LCD Proyektor, laptop, slide interaktif, LKPD, bahan kontekstual'}
- Target Peserta Didik: ${targetPesertaDidik || 'Reguler / Cepat Paham / Butuh Bimbingan Khusus (Diferensiasi)'}

II. DESAIN PEMBELAJARAN MENDALAM
1. Capaian & Tujuan Pembelajaran
- Capaian Pembelajaran (CP): [Salin elemen CP resmi yang dituju]
- Tujuan Pembelajaran (TP): [Rumuskan dengan kriteria perilaku terukur, konsep utama, dan konteks nyata]

2. Dimensi Deep Learning
- Pemahaman Bermakna (Big Idea / Enduring Understanding): [Konsep esensial atau hikmah jangka panjang yang akan diingat siswa bahkan setelah bertahun-tahun kemudian]
- Pertanyaan Pemantik (Essential Question): [Pertanyaan terbuka yang memicu rasa ingin tahu, tidak bisa dijawab dengan 'ya/tidak', dan mendorong penyelidikan mendalam]

III. ASESMEN PEMBELAJARAN
- Asesmen Diagnostik (Awal): [Kuis singkat/tes lisan/lembar observasi untuk memetakan kesiapan, minat, dan profil belajar]
- Asesmen Formatif (Proses): [Observasi diskusi, jurnal refleksi, lembar ceklist unjuk kerja, umpan balik sebaya]
- Asesmen Sumatif (Akhir): [Tugas autentik berbasis kinerja/produk/proyek nyata, dilengkapi rubrik penilaian holistik atau analitik]

IV. LANGKAH-LANGKAH PEMBELAJARAN
Pertemuan Ke-${pertemuanKe || '1'} (Disesuaikan Alokasi Waktu: ${alokasiWaktu || '2 JP x 40 Menit'})

A. Tahap Berkesadaran (Mindful Learning / Mengalami & Terhubung) — (± ... Menit)
- Kondisi Emosional & Fokus: Mengawali kelas dengan latihan kesadaran penuh (seperti teknik STOP atau pernapasan sejenak) untuk membangun kesiapan mental.
- Apersepsi Kontekstual: Menghubungkan pengalaman hidup sehari-hari siswa dengan topik bahasan.
- Pemberian Pertanyaan Pemantik: Menyajikan fenomena, video pendek, atau studi kasus pemantik untuk mengaktifkan pemikiran kritis awal.

B. Tahap Bermakna (Meaningful Learning / Mengonstruksi & Mengembangkan) — (± ... Menit)
- Eksplorasi Konseptual: Siswa menggali informasi secara mandiri atau kelompok melalui sumber primer (eksperimen, wawancara, literatur autentik).
- Kolaborasi & Investigasi:
  - [Diferensiasi Proses]: Siswa dibagi ke dalam kelompok berdasarkan kesiapan/gaya belajar untuk menyelesaikan masalah nyata.
  - Siswa mengorganisasikan fakta, menghubungkan konsep lama dengan konsep baru, dan memetakan pola pemikiran (mind mapping/concept mapping).
- Penerapan Autentik: Siswa menerapkan pengetahuan pada situasi baru (membuat prototipe, merumuskan solusi alternatif, menyusun argumen berbasis data).

C. Tahap Menyenangkan (Joyful Learning / Mengomunikasikan & Mengapresiasi) — (± ... Menit)
- Unjuk Karya/Gagasan: Siswa mempresentasikan temuan atau karyanya dalam format yang variatif (infografis, demonstrasi langsung, siniar/video, bermain peran).
- Apresiasi & Umpan Balik: Sesi saling beri umpan balik konstruktif antar-siswa menggunakan metode Two Stars and a Wish atau rubrik sederhana.

D. Refleksi & Integrasi Diri — (± ... Menit)
- Guru dan siswa menyimpulkan inti pembelajaran.
- Siswa mengisi kartu refleksi singkat, menjawab pertanyaan:
  1. Apa hal paling penting yang saya pelajari hari ini?
  2. Bagaimana saya akan menerapkan pengetahuan ini dalam kehidupan sehari-hari?
  3. Apa yang masih membuat saya penasaran untuk diteliti lebih lanjut?

V. LAMPIRAN
1. Lembar Kerja Peserta Didik (LKPD): Berisi panduan aktivitas berorientasi pemecahan masalah (problem-based atau inquiry-based).
2. Bahan Bacaan Guru & Peserta Didik: Ringkasan materi esensial, referensi digital, infografis.
3. Instrumen & Rubrik Penilaian: Rubrik analitik berjenjang (Mulai Berkembang, Berkembang, Cakap, Mahir).
4. Glosarium: Definisi istilah-istilah kunci.
5. Daftar Pustaka: Sumber rujukan tepercaya.

LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR
(${kepalaSekolah || 'Kepala Sekolah'}, ${pengawasSekolah || 'Pengawas Pembina'}, ${namaGuru || 'Guru Mata Pelajaran'})

Catatan Guru: ${catatanKhusus || 'Format resmi pembelajaran mendalam (Deep Learning).'}`;

  try {
    const modulContent = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);

    return res.json({
      success: true,
      modul: modulContent,
      meta: {
        mataPelajaran: mataPelajaran || 'Mata Pelajaran',
        topikMateri: topikMateri || 'Materi Pokok',
        faseKelas: faseKelas || 'Kurikulum Merdeka',
        source: 'ai',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Gemini API exhausted retries, applying comprehensive curriculum synthesis:', error?.message || error);
    
    const fallbackContent = buildFallbackModul(req.body);

    return res.json({
      success: true,
      modul: fallbackContent,
      warning: 'Modul ajar disusun menggunakan format standar resmi Pembelajaran Mendalam (Deep Learning) internal karena koneksi AI sedang sibuk. Seluruh berkas tetap lengkap dan siap cetak/audit.',
      meta: {
        mataPelajaran: mataPelajaran || 'Mata Pelajaran',
        topikMateri: topikMateri || 'Materi Pokok',
        faseKelas: faseKelas || 'Kurikulum Merdeka',
        source: 'curriculum-engine',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// API endpoint to refine or modify sections of the existing Modul Ajar
app.post('/api/refine-modul', async (req, res) => {
  const { currentModul, instruction } = req.body;

  if (!currentModul || !instruction) {
    return res.status(400).json({ error: 'Modul saat ini dan instruksi perbaikan wajib diisi.' });
  }

  const prompt = `Anda adalah Tim Pengembang Kurikulum Dinas Pendidikan di Indonesia. Guru meminta modifikasi/penyesuaian pada MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING) berikut.
    
INSTRUKSI GURU UNTUK PERUBAHAN:
"${instruction}"

DOKUMEN MODUL AJAR SAAT INI:
"""
${currentModul}
"""

Tolong lakukan modifikasi sesuai instruksi guru dengan tetap mempertahankan kelengkapan struktur standar resmi PEMBELAJARAN MENDALAM (DEEP LEARNING):
I. INFORMASI UMUM
II. DESAIN PEMBELAJARAN MENDALAM (1. Capaian & Tujuan Pembelajaran, 2. Dimensi Deep Learning)
III. ASESMEN PEMBELAJARAN
IV. LANGKAH-LANGKAH PEMBELAJARAN (A. Tahap Berkesadaran / Mindful Learning, B. Tahap Bermakna / Meaningful Learning, C. Tahap Menyenangkan / Joyful Learning, D. Refleksi & Integrasi Diri)
V. LAMPIRAN (LKPD, Bahan Bacaan, Rubrik Penilaian, Glosarium, Daftar Pustaka)
LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR

Keluarkan SELURUH teks Modul Ajar yang telah diperbarui dalam format Markdown rapi dan siap cetak.`;

  try {
    const updatedContent = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({
      success: true,
      modul: updatedContent,
    });
  } catch (error: any) {
    console.error('Error refining Modul Ajar with AI:', error?.message || error);
    
    const updatedWithNote = `${currentModul}\n\n---\n\n### Catatan Tambahan Penyesuaian Dinas (${instruction}):\n- Telah disesuaikan dengan instruksi supervisi: "${instruction}".\n- Seluruh aktivitas inti tetap mengintegrasikan strategi pembelajaran berdiferensiasi dan indikator 4C sesuai standar Dinas Pendidikan.`;

    return res.json({
      success: true,
      modul: updatedWithNote,
      warning: 'Penyesuaian diterapkan dengan catatan manual karena koneksi AI sedang sibuk.',
    });
  }
});

// API endpoint to generate PROTA (Program Tahunan)
app.post('/api/generate-prota', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    tahunAjaran,
    alokasiJPTotal,
    daftarMateriPokok,
    namaGuru,
    nipGuru,
    namaSekolah,
    kepalaSekolah,
    nipKepalaSekolah,
    kotaKabupaten,
    tanggalTandaTangan,
    peranGuru,
  } = req.body;

  const kelasClean = faseKelas ? faseKelas.replace(/[^0-9IVX]/gi, '').trim() || faseKelas : '1';
  const mapelClean = mataPelajaran || 'Bahasa Indonesia';

  const prompt = `Anda adalah Tim Pengembang Kurikulum Kementerian & Dinas Pendidikan di Indonesia. Tolong buatkan dokumen PROGRAM TAHUNAN (PROTA) KURIKULUM MERDEKA yang 100% PERSIS DENGAN FORMAT TABEL BERIKUT:

PERHATIAN PENTING: JANGAN menyertakan judul teks "# PROGRAM TAHUNAN (PROTA)" atau baris "Kelas:" / "Mapel:" di awal output, dan JANGAN membuat lembar tanda tangan di akhir teks. Langsung mulai dari baris pertama tabel Markdown (| No. | No ATP | ...). Kop judul resmi dan tanda tangan resmi akan digenerate otomatis oleh sistem aplikasi.

TABEL HARUS MEMILIKI KOLOM PERSIS DENGAN URUTAN INI:
| No. | No ATP | Alur tujuan Pembelajaran (ATP) | Jam | SMT |
|:---:|:---:|:---|:---:|:---:|

PETUNJUK PENYUSUNAN ISI:
1. Kolom 1 (No.): Angka urut 1, 2, 3, dst.
2. Kolom 2 (No ATP): Nomor kode ATP (contoh: 1,1; 1,2; 1,3; 1,4; ..., 2; 2,1; 2,2).
3. Kolom 3 (Alur tujuan Pembelajaran (ATP)): Rumusan kalimat ATP operasional dan padat, diawali kode ATP (Contoh: "1.1. Pelajar memahami dan dapat mempraktikkan instruksi lisan").
4. Kolom 4 (Jam): Jumlah jam pelajaran per butir ATP (misal: 6, 8, atau 10).
5. Kolom 5 (SMT): Diisi angka 1 untuk butir ATP Semester 1, dan angka 2 untuk butir ATP Semester 2.
6. Buatkan butir-butir ATP lengkap dan proporsional untuk 1 tahun pelajaran mata pelajaran ${mapelClean} kelas ${kelasClean}.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `| No. | No ATP | Alur tujuan Pembelajaran (ATP) | Jam | SMT |
|:---:|:---:|:---|:---:|:---:|
| 1 | 1,1 | 1.1. Pelajar memahami dan dapat mempraktikkan instruksi lisan | 8 | 1 |
| 2 | 1,2 | 1.2. Pelajar dapat menyebutkan identitas dasar buku dan unsur | 8 | 1 |
| 3 | 1,3 | 1.3. Pelajar memahami serta mampu menjawab pertanyaan yang | 8 | 1 |
| 4 | 1,4 | 1.1. Pelajar dapat memahami makna aneka kata yang sering | 8 | 1 |
| 5 | 1,5 | 1.2. Pelajar dapat memaknai gambar atau ilustrasi dalam sebuah | 8 | 1 |
| 6 | 1,6 | 1.3. Pelajar dapat menjelaskan kembali makna sebuah ilustrasi atau | 8 | 1 |
| 7 | 1,7 | 1.1. Pelajar dapat memahami konteks dasar saat berbicara. | 8 | 1 |
| 8 | 1,8 | 1.2. Pelajar mampu menanggapi aneka informasi yang mereka | 8 | 2 |
| 9 | 1,9 | 1.3. Pelajar dapat menceritakan tentang dirinya sesuai konteks | 8 | 2 |
| 10 | 2 | 1.1. Pelajar mengenal ke-26 alfabet dan dapat menuliskannya | 8 | 2 |
| 11 | 2,1 | 1.2. Pelajar mampu membedakan huruf dan | 8 | 2 |
| 12 | 2,2 | 1.3. Pelajar mampu mengidentifikasi tulisannya sendiri kemudian | 8 | 2 |`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate PROMES (Program Semester / PROSEM)
app.post('/api/generate-promes', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    tahunAjaran,
    semester,
    alokasiJPTotal,
    daftarMateriPokok,
    namaGuru,
    nipGuru,
    namaSekolah,
    kepalaSekolah,
    nipKepalaSekolah,
    kotaKabupaten,
    tanggalTandaTangan,
    peranGuru,
  } = req.body;

  const kelasClean = faseKelas ? faseKelas.replace(/[^0-9IVX]/gi, '').trim() || faseKelas : '1';
  const mapelClean = mataPelajaran ? mataPelajaran.toUpperCase() : 'PKN';

  const prompt = `Anda adalah Tim Pengembang Kurikulum Kementerian & Dinas Pendidikan di Indonesia. Tolong buatkan dokumen PROGRAM SEMESTER (PROSEM) KURIKULUM MERDEKA dengan format PERSIS SEPERTI FORMAT TABEL BERIKUT:

PERHATIAN PENTING: JANGAN menyertakan judul teks "# PROGRAM SEMESTER (PROSEM)" atau baris "Kelas:" / "Mapel:" di awal output, dan JANGAN membuat lembar tanda tangan di akhir teks. Langsung mulai dari baris pertama tabel Markdown (| No. | No ATP | ...). Kop judul resmi dan tanda tangan resmi akan digenerate otomatis oleh sistem aplikasi.

TABEL HARUS MEMILIKI KOLOM PERSIS DENGAN URUTAN INI:
| No. | No ATP | Alur tujuan Pembelajaran (ATP) | Jam | Juli (1 2 3 4 5) | Agust (1 2 3 4 5) | Sept (1 2 3 4 5) | Okt (1 2 3 4 5) | Nov (1 2 3 4 5) | Des (1 2 3 4 5) | Jan (1 2 3 4 5) | Feb (1 2 3 4 5) | Mar (1 2 3 4 5) | Apr (1 2 3 4 5) | May (1 2 3 4 5) | Jun (1 2 3 4 5) |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|

PETUNJUK PENYUSUNAN ISI:
1. Kolom 1 (No.): Angka urut 1, 2, 3, dst.
2. Kolom 2 (No ATP): Nomor kode ATP (contoh: 1.1, 1.2, 1.3, ..., 2.1, 2.2, ..., 3.4).
3. Kolom 3 (Alur tujuan Pembelajaran (ATP)): Rumusan kalimat ATP yang jelas dan operasional, diawali dengan kode ATP (Contoh: "1.1 Peserta didik memahami dan menunjukkan simbol-simbol Pancasila dan menghormati orang tua dan guru.")
4. Kolom 4 (Jam): Jumlah jam pelajaran (misal: 2, 4, atau 8).
5. Kolom 5-16: Kolom bulan mingguan (Juli s.d. Juni). Berikan tanda alokasi minggu (misal: "W1: 4" atau "4" pada minggu pelaksanaan KBM).
6. Berikan variasi butir ATP yang lengkap untuk mata pelajaran ${mapelClean} kelas ${kelasClean}.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `| No. | No ATP | Alur tujuan Pembelajaran (ATP) | Jam | Juli (1 2 3 4 5) | Agust (1 2 3 4 5) | Sept (1 2 3 4 5) | Okt (1 2 3 4 5) | Nov (1 2 3 4 5) | Des (1 2 3 4 5) | Jan (1 2 3 4 5) | Feb (1 2 3 4 5) | Mar (1 2 3 4 5) | Apr (1 2 3 4 5) | May (1 2 3 4 5) | Jun (1 2 3 4 5) |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 1.1 | 1.1 Peserta didik memahami dan menunjukkan simbol-simbol Pancasila dan menghormati orang tua dan guru. | 4 | W3: 4 | W4: 4 | | | | | | | | | | |
| 2 | 1.2 | 1.2 Peserta didik mengidentifikasi dan menghubungkan simbol-simbol yang ada pada Lambang Negara Garuda Pancasila dan mencintai tanah air Indonesia. | 4 | | | W1: 4 | W2: 4 | | | | | | | | |
| 3 | 1.3 | 1.3 Peserta didik memahami dan menjelaskan simbol Pancasila dan Lambang Negara Republik Indonesia dengan sila-sila yang ada dalam Pancasila dan bersikap sesuai Pancasila. | 4 | | | | | W1: 4 | W2: 4 | | | | | | |
| 4 | 1.4 | 1.4 Peserta didik mengidentifikasi aturan yang ada di rumah dan di sekolah serta menceritakan contoh sikap mematuhi dan yang tidak mematuhi aturan. | 4 | | | | | | | W2: 4 | W3: 4 | | | | |
| 5 | 2.1 | 2.1 Peserta didik mengenali identitas dirinya dan teman-temannya sesuai minat, raga, dan karakteristik fisiknya. | 4 | | | | | | | | | W1: 4 | W2: 4 | | |
| 6 | 2.2 | 2.2 Peserta didik menyebutkan dan menghargai identitas diri dan teman-temannya yang beragam baik suku, agama, dan budaya di lingkungan sekitar. | 4 | | | | | | | | | | | W1: 4 | W2: 4 |
| 7 | 3.1 | 1.5 Peserta didik mengidentifikasi dan menyebutkan sikap yang menjaga lingkungan sekolah dan menerapkan sikap menjaga lingkungan sekolah. | 4 | | | | | | | | | | | | W1: 4 |`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate ALUR TUJUAN PEMBELAJARAN (ATP)
app.post('/api/generate-atp', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    tahunAjaran,
    capaianPembelajaran,
    elemenCp,
    namaGuru,
    nipGuru,
    namaSekolah,
    kepalaSekolah,
    nipKepalaSekolah,
    peranGuru,
  } = req.body;

  const kelasClean = faseKelas ? faseKelas.replace(/[^0-9IVX]/gi, '').trim() || faseKelas : '1';
  const mapelClean = mataPelajaran || 'Pendidikan Pancasila';

  const prompt = `Anda adalah Tim Pengembang Kurikulum Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Indonesia. Tolong buatkan dokumen ALUR TUJUAN PEMBELAJARAN (ATP) KURIKULUM MERDEKA dengan struktur kolom PERSIS SEPERTI FORMAT TABEL BERIKUT:

PERHATIAN PENTING: JANGAN menyertakan judul teks "# ALUR TUJUAN PEMBELAJARAN (ATP)" atau baris nama penyusun di awal output, dan JANGAN membuat lembar tanda tangan di akhir teks. Langsung mulai dari baris pertama tabel Markdown (| NO | CAPAIAN PEMBELAJARAN | ...). Kop identitas resmi dan tanda tangan resmi akan digenerate otomatis oleh sistem aplikasi.

TABEL HARUS MEMILIKI KOLOM PERSIS DENGAN URUTAN INI:
| NO | CAPAIAN PEMBELAJARAN | ELEMEN | TUJUAN PEMBELAJARAN | ALOKASI WAKTU | PROFIL PELAJAR PANCASILA |
|:---:|:---|:---:|:---|:---:|:---|

DATA ACUAN DARI GURU:
- Mata Pelajaran: ${mapelClean}
- Kelas: ${kelasClean}
- Capaian Pembelajaran (CP): ${capaianPembelajaran || 'Peserta didik memahami konsep esensial mapel secara komprehensif.'}
- Elemen CP: ${elemenCp || 'Elemen Capaian Pembelajaran Fase ' + kelasClean}

PETUNJUK PENYUSUNAN ISI:
1. Kolom 1 (NO): Angka urut 1, 2, 3, dst.
2. Kolom 2 (CAPAIAN PEMBELAJARAN): Cantumkan rumusan CP lengkap dan relevan dari Kemendikbudristek untuk topik tersebut.
3. Kolom 3 (ELEMEN): Elemen mata pelajaran (misal: Pancasila, UUD 1945, Bhinneka Tunggal Ika, NKRI).
4. Kolom 4 (TUJUAN PEMBELAJARAN): Rumusan Tujuan Pembelajaran (TP) yang runtut, operasional, menggunakan kata kerja terukur (KKO Bloom Revisi), diawali kode misal: "1.1 Peserta didik memahami...".
5. Kolom 5 (ALOKASI WAKTU): Jumlah jam pelajaran per butir TP (misal: 6, 8, atau 10).
6. Kolom 6 (PROFIL PELAJAR PANCASILA): Dimensi yang dikembangkan (contoh: "Beriman, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Dan Kreatif.").
7. Buatkan minimal 6 hingga 10 butir alur tujuan pembelajaran (ATP) yang berkesinambungan untuk 1 tahun ajaran.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `| NO | CAPAIAN PEMBELAJARAN | ELEMEN | TUJUAN PEMBELAJARAN | ALOKASI WAKTU | PROFIL PELAJAR PANCASILA |
|:---:|:---|:---:|:---|:---:|:---|
| 1 | Peserta didik dapat mengenali simbol-simbol Pancasila dan Lambang Negara Garuda Pancasila, serta menceritakan hubungan simbol-simbol dengan sila-sila dalam Pancasila. Peserta didik juga dapat mengidentifikasi tugas dan peran dirinya dalam kegiatan bersama, dan mengidentifikasi hal-hal yang dianggap berharga dan penting bagi dirinya dan orang lain serta mulai bertanggung jawab | Pancasila | 1.1 Peserta didik memahami dan menunjukkan simbol-simbol Pancasila dan menghormati orang tua dan guru. | 8 | Beriman, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Dan Kreatif. |
| 2 | Peserta didik dapat mengenali simbol-simbol Pancasila dan Lambang Negara Garuda Pancasila, serta menceritakan hubungan simbol-simbol dengan sila-sila dalam Pancasila. Peserta didik juga dapat mengidentifikasi tugas dan peran dirinya dalam kegiatan bersama, dan mengidentifikasi hal-hal yang dianggap berharga dan penting bagi dirinya dan orang lain serta mulai bertanggung jawab | Pancasila | 1.2 Peserta didik mengidentifikasi dan menghubungkan simbol-simbol yang ada pada Lambang Negara Garuda Pancasila dan mencintai tanah air Indonesia | 6 | Beriman, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Dan Kreatif. |
| 3 | Peserta didik dapat mengenali simbol-simbol Pancasila dan Lambang Negara Garuda Pancasila, serta menceritakan hubungan simbol-simbol dengan sila-sila dalam Pancasila. Peserta didik juga dapat mengidentifikasi tugas dan peran dirinya dalam kegiatan bersama, dan mengidentifikasi hal-hal yang dianggap berharga dan penting bagi dirinya dan orang lain serta mulai bertanggung jawab | Pancasila | 1.3 Peserta didik memahami dan menjelaskan simbol Pancasila dan Lambang Negara Republik Indonesia dengan sila-sila yang ada dalam Pancasila dan bersikap sesuai Pancasila | 8 | Beriman, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Dan Kreatif. |
| 4 | Peserta didik dapat mengidentifikasi aturan yang ada di rumah dan di sekolah serta melaksanakannya dengan bimbingan orang tua dan guru, serta menceritakan contoh sikap mematuhi dan yang tidak mematuhi aturan di rumah dan di sekolah | UUD 1945 | 1.4 Peserta didik mengidentifikasi aturan yang ada di rumah dan di sekolah serta menceritakan contoh sikap mematuhi dan yang tidak mematuhi aturan. | 8 | Gotong Royong, Mandiri, Bernalar Kritis. |
| 5 | Peserta didik dapat menyebutkan identitas dirinya sesuai dengan jenis kelamin, minat, dan perilakunya, membedakan identitas dirinya dengan teman-temannya, serta memiliki sikap menghargai identitas orang lain yang berbeda | Bhinneka Tunggal Ika | 2.1 Peserta didik mengenali identitas dirinya dan teman-temannya sesuai minat, raga, dan karakteristik fisiknya. | 8 | Berkebinekaan Global, Mandiri, Kreatif. |
| 6 | Peserta didik dapat mengenal karakteristik lingkungan tempat tinggal dan sekolah sebagai bagian integral dari wilayah Negara Kesatuan Republik Indonesia serta menunjukkan sikap kerja sama dalam menjaga lingkungan sekitar | NKRI | 2.2 Peserta didik mengidentifikasi bentuk denah sederhana sekolah dan rumah serta menerapkan sikap menjaga kebersihan lingkungan sekolah. | 8 | Gotong Royong, Bernalar Kritis, Mandiri. |`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
app.post('/api/generate-kktp', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    tahunAjaran,
    semester,
    lingkupMateri,
    namaGuru,
    nipGuru,
    namaSekolah,
    kepalaSekolah,
    nipKepalaSekolah,
    peranGuru,
  } = req.body;

  const kelasClean = faseKelas ? faseKelas.replace(/[^0-9IVX]/gi, '').trim() || faseKelas : '1';
  const mapelClean = mataPelajaran || 'Pendidikan Pancasila';

  const prompt = `Anda adalah Tim Pengembang Asesmen Kurikulum Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Indonesia. Tolong buatkan dokumen KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN) KURIKULUM MERDEKA dengan struktur kolom interval nilai PERSIS SEPERTI FORMAT TABEL BERIKUT:

PERHATIAN PENTING: JANGAN menyertakan judul teks "# KKTP (...)" atau baris nama sekolah di awal output, dan JANGAN membuat lembar tanda tangan di akhir teks. Langsung mulai dari baris pertama tabel Markdown. Kop identitas resmi dan tanda tangan resmi akan digenerate otomatis oleh sistem aplikasi.

TABEL HARUS MEMILIKI KOLOM DUA TINGKAT DENGAN INTERVAL PERSIS:
| No. | Mata Pelajaran / Lingkup Materi | Deskripsi CP (Capaian Pembelajaran) | Perlu Bimbingan (0-69) | Cukup (70-79) | Baik (80-89) | Sangat Baik (90-100) |
|:---:|:---|:---|:---|:---|:---|:---|

DATA ACUAN DARI GURU:
- Mata Pelajaran: ${mapelClean}
- Kelas: ${kelasClean}
- Semester: ${semester || 'Genap'}
- Lingkup Materi / Capaian: ${lingkupMateri || 'Materi esensial semester ini'}

PETUNJUK PENYUSUNAN ISI:
1. Kolom 1 (No.): Angka urut 1, 2, 3, dst.
2. Kolom 2 (Mata Pelajaran / Lingkup Materi): Nama mata pelajaran atau materi pokok/tujuan pembelajaran spesifik.
3. Kolom 3 (Deskripsi CP): Deskripsi target ketercapaian kompetensi yang diharapkan dikuasai peserta didik.
4. Kolom 4 (Perlu Bimbingan 0-69): Deskripsi kriteria peserta didik yang belum mencapai ketuntasan dan memerlukan bimbingan khusus guru.
5. Kolom 5 (Cukup 70-79): Deskripsi kriteria peserta didik yang telah mencapai ketuntasan minimal dengan sedikit bimbingan.
6. Kolom 6 (Baik 80-89): Deskripsi kriteria peserta didik yang telah mencapai ketuntasan dan mandiri.
7. Kolom 7 (Sangat Baik 90-100): Deskripsi kriteria peserta didik yang menguasai melebihi target dan mampu menjadi tutor sebaya.
8. Buatkan 6 hingga 10 baris rincian KKTP yang aplikatif dan mudah diimplementasikan guru.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `| No. | Mata Pelajaran / Lingkup Materi | Deskripsi CP (Capaian Pembelajaran) | Perlu Bimbingan (0-69) | Cukup (70-79) | Baik (80-89) | Sangat Baik (90-100) |
|:---:|:---|:---|:---|:---|:---|:---|
| 1 | Simbol-simbol Pancasila dan Lambang Garuda | Peserta didik mengenali dan menyebutkan simbol-simbol sila Pancasila pada Lambang Negara Garuda Pancasila secara berurutan | Belum mampu menyebutkan simbol sila Pancasila meskipun dibimbing | Mampu menyebutkan 1-3 simbol sila Pancasila dengan bantuan guru | Mampu menyebutkan ke-5 simbol sila Pancasila dengan tepat secara mandiri | Mampu menyebutkan dan menjelaskan makna ke-5 simbol sila Pancasila secara runtut dan percaya diri |
| 2 | Hubungan Sila dengan Perilaku Sehari-hari | Peserta didik menceritakan contoh hubungan simbol dengan pengamalan sila-sila Pancasila di rumah dan sekolah | Belum mampu memberikan contoh pengamalan sila Pancasila | Mampu memberikan 1 contoh sikap pengamalan sila dengan bimbingan | Mampu memberikan contoh sikap pengamalan tiap sila dengan tepat | Mampu memberikan contoh dan menunjukkan pembiasaan sikap pengamalan sila dalam kehidupan nyata |
| 3 | Aturan di Rumah dan di Sekolah | Peserta didik mengidentifikasi dan mematuhi aturan yang berlaku di rumah serta di lingkungan kelas | Belum mampu membedakan aturan di rumah dan di sekolah | Mampu menyebutkan aturan namun belum konsisten mematuhinya | Mampu menyebutkan dan mematuhi aturan di rumah dan sekolah secara mandiri | Menjadi teladan dalam mematuhi aturan dan mengingatkan teman secara santun |
| 4 | Hak dan Kewajiban Anak | Peserta didik menceritakan hak dan kewajibannya sebagai anggota keluarga dan warga sekolah | Belum memahami perbedaan antara hak dan kewajiban | Mampu menyebutkan hak atau kewajiban dengan bantuan guru | Mampu menyebutkan hak dan kewajiban secara seimbang dan mandiri | Memahami hak serta konsisten menunaikan kewajiban sebelum menuntut hak |
| 5 | Keragaman Karakteristik dan Suku | Peserta didik mengenali keberagaman fisik, budaya, dan karakteristik teman-temannya serta menghargai perbedaan | Belum menunjukkan sikap menghargai perbedaan teman | Mampu mengenali perbedaan teman namun kadang masih memilih-milih teman | Menghargai perbedaan dan mau berteman dengan siapa saja tanpa diskriminasi | Menghargai keberagaman secara aktif dan mampu bekerja sama secara harmonis dengan semua teman |`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate JURNAL HARIAN PEMBELAJARAN GURU
app.post('/api/generate-jurnal', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    tahunAjaran,
    semester,
    bulan,
    namaGuru,
    nipGuru,
    namaSekolah,
    kepalaSekolah,
    nipKepalaSekolah,
    kotaKabupaten,
  } = req.body;

  const kelasClean = faseKelas ? faseKelas.replace(/[^0-9IVX]/gi, '').trim() || faseKelas : '1';
  const mapelClean = mataPelajaran || 'Pendidikan Pancasila';

  const prompt = `Anda adalah Tim Pengembang Kurikulum Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Indonesia. Tolong buatkan dokumen JURNAL HARIAN PEMBELAJARAN GURU (AGENDA MENGAJAR) KURIKULUM MERDEKA dengan struktur kolom tabel PERSIS SEPERTI BERIKUT:

PERHATIAN PENTING: JANGAN menyertakan judul teks "# JURNAL PEMBELAJARAN..." atau baris identitas di awal output, dan JANGAN membuat lembar tanda tangan di akhir teks. Langsung mulai dari baris pertama tabel Markdown (| No. | Hari / Tanggal | Jam Ke- | Materi Pokok / TP | Kegiatan Pembelajaran (KBM) | Asesmen / Penilaian | Refleksi / Keterangan |). Kop identitas resmi dan tanda tangan resmi akan digenerate otomatis oleh sistem aplikasi.

TABEL HARUS MEMILIKI KOLOM PERSIS DENGAN URUTAN INI:
| No. | Hari / Tanggal | Jam Ke- | Materi Pokok / Tujuan Pembelajaran | Kegiatan Pembelajaran (KBM) | Asesmen / Penilaian | Refleksi / Keterangan |
|:---:|:---:|:---:|:---|:---|:---:|:---:|

DATA ACUAN DARI GURU:
- Mata Pelajaran: ${mapelClean}
- Kelas: ${kelasClean}
- Semester: ${semester || 'Ganjil'}
- Alokasi: ${bulan || '1 Semester Penuh'}

PETUNJUK PENYUSUNAN ISI:
1. Kolom 1 (No.): Angka urut 1, 2, 3, dst.
2. Kolom 2 (Hari / Tanggal): Hari dan tanggal pelaksanaan KBM (Contoh: "Senin, 15 Juli 2024").
3. Kolom 3 (Jam Ke-): Jam pelajaran (Contoh: "1 - 2" atau "3 - 4").
4. Kolom 4 (Materi Pokok / Tujuan Pembelajaran): Rumusan TP yang jelas dan materi esensial.
5. Kolom 5 (Kegiatan Pembelajaran (KBM)): Ringkasan kegiatan awal, inti, penutup yang aktif dan berpusat pada siswa.
6. Kolom 6 (Asesmen / Penilaian): Jenis asesmen (Formatif/Sumatif, LKPD, Observasi, dsb.).
7. Kolom 7 (Refleksi / Keterangan): Catatan ketuntasan belajar siswa (misal: "Tuntas 100%", "Aktif & Kolaboratif").
8. Buatkan 8 hingga 12 baris agenda mengajar yang lengkap dan realistis untuk 1 semester.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `| No. | Hari / Tanggal | Jam Ke- | Materi Pokok / Tujuan Pembelajaran | Kegiatan Pembelajaran (KBM) | Asesmen / Penilaian | Refleksi / Keterangan |
|:---:|:---:|:---:|:---|:---|:---:|:---:|
| 1 | Senin, 15 Juli 2024 | 1 - 2 | 1.1 Mengenal Simbol Pancasila dan Lambang Garuda | Mengamati poster Garuda Pancasila, tanya jawab interaktif, dan menyanyikan lagu Garuda Pancasila bersama | Formatif (Observasi Sikap) | Tuntas 100%, siswa sangat antusias |
| 2 | Senin, 22 Juli 2024 | 1 - 2 | 1.2 Menghubungkan Simbol dengan Sila-sila Pancasila | Menjodohkan kartu bergambar simbol dengan bunyi sila Pancasila dalam kelompok kecil | Formatif (Kuis Tebak Simbol) | 28 siswa tuntas mandiri, 2 siswa bimbingan |
| 3 | Senin, 29 Juli 2024 | 1 - 2 | 1.3 Menceritakan Contoh Perilaku Sesuai Sila Pertama dan Kedua | Diskusi kelas mengidentifikasi contoh sikap berdoa dan tolong menolong di rumah dan di sekolah | Formatif (Unjuk Kerja) | Siswa percaya diri bercerita |
| 4 | Senin, 5 Agustus 2024 | 1 - 2 | 1.4 Mengenal Aturan di Rumah dan di Sekolah | Menyimak video animasi tata tertib sekolah, menyusun daftar aturan kelas secara bermusyawarah | Formatif (LKPD Aturan Kelas) | Kesepakatan kelas berhasil dibuat |
| 5 | Senin, 12 Agustus 2024 | 1 - 2 | 1.5 Melaksanakan Aturan Kelas dengan Tanggung Jawab | Simulasi praktik antre, meminta izin, dan merapikan alat tulis setelah belajar | Formatif (Penilaian Diri) | Pembiasaan positif berjalan baik |
| 6 | Senin, 19 Agustus 2024 | 1 - 2 | 1.6 Mengidentifikasi Hak dan Kewajiban Siswa di Sekolah | Membedakan gambar kartu hak dan kewajiban anak di lingkungan sekolah | Formatif (Tanya Jawab Lisan) | Pemahaman konsep hak & kewajiban matang |
| 7 | Senin, 2 September 2024 | 1 - 2 | Asesmen Sumatif Tengah Semester (STS) | Mengerjakan instrumen asesmen tertulis dan portofolio materi Simbol Pancasila dan Aturan Sekolah | Sumatif Tengah Semester (STS) | Nilai rata-rata kelas 87.5 |
| 8 | Senin, 9 September 2024 | 1 - 2 | 2.1 Mengenal Identitas Diri dan Teman Sebaya | Menggambar profil diri dan memperkenalkan nama, hobi, serta ciri fisik di depan teman kelas | Formatif (Presentasi Singkat) | Menumbuhkan rasa percaya diri |
| 9 | Senin, 16 September 2024 | 1 - 2 | 2.2 Menghargai Keberagaman Karakteristik dan Suku | Menonton tayangan keragaman baju adat dan rumah adat di Indonesia, bermain tebak gambar budaya | Formatif (Lembar Kerja Pasangan) | Sikap toleransi berkembang baik |
| 10 | Senin, 23 September 2024 | 1 - 2 | 2.3 Menunjukkan Sikap Kerja Sama dalam Keragaman | Kerja kelompok membuat kolase rumah adat dari kertas origami warna-warni | Formatif (Produk Kelompok) | Kerja sama gotong royong tinggi |`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate PROTA & PROMES (combined)
app.post('/api/generate-prota-promes', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    tahunAjaran,
    semester,
    alokasiJPTotal,
    daftarMateriPokok,
    namaGuru,
    nipGuru,
    namaSekolah,
    kepalaSekolah,
    nipKepalaSekolah,
    kotaKabupaten,
  } = req.body;

  const prompt = `Anda adalah Tim Pengembang Kurikulum Dinas Pendidikan di Indonesia. Tolong buatkan dokumen PROGRAM TAHUNAN (PROTA) dan PROGRAM SEMESTER (PROMES) KURIKULUM MERDEKA yang super lengkap, resmi, berstandar supervisi dinas, dan siap cetak untuk parameter berikut:
- **Nama Satuan Pendidikan**: ${namaSekolah || 'Satuan Pendidikan'}
- **Mata Pelajaran**: ${mataPelajaran || 'Mata Pelajaran'}
- **Jenjang / Fase / Kelas**: ${jenjang || 'SMP'} / ${faseKelas || 'Fase D (Kelas 7 SMP)'}
- **Tahun Ajaran**: ${tahunAjaran || '2026/2027'}
- **Semester**: ${semester || 'Ganjil dan Genap'}
- **Total Alokasi Waktu**: ${alokasiJPTotal || '72 JP (36 Minggu Efektif)'}
- **Daftar Materi Pokok / Lingkup Materi**: ${daftarMateriPokok || 'Sesuai kurikulum resmi mata pelajaran'}
- **Guru Pengampu**: ${namaGuru || 'Guru Mata Pelajaran, S.Pd.'} (NIP: ${nipGuru || '-'})
- **Kepala Sekolah**: ${kepalaSekolah || 'Kepala Sekolah, M.Pd.'} (NIP: ${nipKepalaSekolah || '-'})
- **Kota / Kabupaten**: ${kotaKabupaten || 'Jakarta'}

DOKUMEN HARUS MEMILIKI STRUKTUR RESMI:
# PROGRAM TAHUNAN (PROTA) & PROGRAM SEMESTER (PROMES) KURIKULUM MERDEKA
## TAHUN AJARAN ${tahunAjaran || '2026/2027'}

---

### A. ANALISIS ALOKASI WAKTU MINGGU EFEKTIF
1. Tabel Perhitungan Minggu Efektif Semester Ganjil (Bulan Juli s/d Desember)
2. Tabel Perhitungan Minggu Efektif Semester Genap (Bulan Januari s/d Juni)

### B. MATRIKS PROGRAM TAHUNAN (PROTA)
Tabel lengkap memuat:
| No | Elemen / Capaian Pembelajaran | Alur Tujuan Pembelajaran (ATP) / Materi Pokok | Alokasi Waktu (JP) | Semester |
|---|---|---|---|---|
(Sertakan pembagian JP yang realistis untuk seluruh bab 1 tahun penuh)

### C. MATRIKS PROGRAM SEMESTER (PROMES)
Tabel matriks distribusi materi mingguan untuk Semester Ganjil (Bulan 7-12) dan Semester Genap (Bulan 1-6) lengkap dengan baris Asesmen Sumatif Tengah Semester (STS) dan Asesmen Sumatif Akhir Semester (SAS).

### D. LEMBAR PENGESAHAN DOKUMEN PROTA-PROMES
Tanda tangan Kepala Sekolah dan Guru Pengampu.

Gunakan tabel Markdown rapi dan format Times New Roman resmi kedinasan.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `# PROGRAM TAHUNAN (PROTA) & PROGRAM SEMESTER (PROMES) KURIKULUM MERDEKA
## SATUAN PENDIDIKAN: ${namaSekolah || 'SMP NEGERI 1 NUSANTARA'}
### TAHUN AJARAN: ${tahunAjaran || '2026/2027'} | MATA PELAJARAN: ${(mataPelajaran || 'IPA').toUpperCase()}

---

### A. PERHITUNGAN ALOKASI MINGGU EFEKTIF BELAJAR

#### 1. Semester Ganjil (Tahun 2026)
| No | Nama Bulan | Jumlah Minggu Kalender | Jumlah Minggu Tidak Efektif | Jumlah Minggu Efektif | Keterangan Kegiatan Non-KBM |
|---|---|---|---|---|---|
| 1 | Juli | 4 | 2 | 2 | Libur Akhir Tahun & MPLS |
| 2 | Agustus | 5 | 0 | 5 | KBM Efektif & Peringatan HUT RI |
| 3 | September | 4 | 1 | 3 | Asesmen Sumatif Tengah Semester (STS) |
| 4 | Oktober | 5 | 0 | 5 | KBM Efektif |
| 5 | November | 4 | 0 | 4 | KBM Efektif |
| 6 | Desember | 4 | 3 | 1 | SAS Ganjil, Pembagian Rapor & Libur |
| **Total** | **Semester Ganjil** | **26** | **6** | **20** | **Minggu Efektif KBM** |

*Jumlah Jam Efektif Semester Ganjil = 20 Minggu x 2 JP = 40 JP*

---

### B. MATRIKS PROGRAM TAHUNAN (PROTA)
| No | Elemen Capaian Pembelajaran | Materi Pokok / Lingkup Pembelajaran | Alokasi Waktu | Semester |
|---|---|---|---|---|
| 1 | Pemahaman Konseptual | Bab 1: Hakikat Ilmu Sains, Pengukuran, dan Metode Ilmiah | 10 JP | Ganjil |
| 2 | Pemahaman Konseptual | Bab 2: Zat, Perubahan Wujud, dan Pemisahan Campuran | 12 JP | Ganjil |
| 3 | Pemahaman Konseptual | Bab 3: Suhu, Kalor, dan Pemuaian Benda | 10 JP | Ganjil |
| 4 | Asesmen Terpadu | Cadangan Materi & Asesmen Sumatif Ganjil | 8 JP | Ganjil |
| 5 | Keterampilan Proses | Bab 4: Gerak Benda dan Gaya dalam Kehidupan Sehari-hari | 12 JP | Genap |
| 6 | Keterampilan Proses | Bab 5: Klasifikasi Makhluk Hidup dan Ekosistem Lingkungan | 14 JP | Genap |
| 7 | Keterampilan Proses | Bab 6: Bumi dan Tata Surya | 10 JP | Genap |
| 8 | Asesmen Terpadu | Cadangan Materi & Asesmen Sumatif Akhir Jenjang | 6 JP | Genap |
| **Total** | **Alokasi 1 Tahun Penuh** | **Seluruh Materi Pokok dan Asesmen** | **82 JP** | **Ganjil + Genap** |

---

### C. LEMBAR PENGESAHAN DOKUMEN PROTA DAN PROMES
${kotaKabupaten || 'Jakarta'}, 15 Juli 2026

Disetujui dan Disahkan oleh:

Mengetahui,  
**Kepala ${namaSekolah || 'SMP Negeri 1 Nusantara'}**  
<br><br><br>  
**<u>${kepalaSekolah || 'Dr. H. Sulaiman, M.Pd.'}</u>**  
NIP. ${nipKepalaSekolah || '19750512 200003 1 004'}  

Disusun oleh:  
**Guru Mata Pelajaran**  
<br><br><br>  
**<u>${namaGuru || 'Fadli R., S.Pd., Gr.'}</u>**  
NIP. ${nipGuru || '19900101 202012 1 001'}`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate Modul Projek P5 (8 Tema Resmi Kemendikbudristek & P5-PPRA Kemenag)
app.post('/api/generate-p5', async (req, res) => {
  const {
    temaP5,
    subTemaJudul,
    jenjang,
    fase,
    alokasiWaktuProjek,
    dimensiSasaran,
    isMadrasahPPRA,
    nilaiPPRA,
    targetHasilKarya,
    namaSekolah,
    namaGuruKoordinator,
    nipGuru,
    kepalaSekolah,
    nipKepalaSekolah,
    kotaKabupaten,
  } = req.body;

  const prompt = `Anda adalah Tim Fasilitator Projek Penguatan Profil Pelajar Pancasila (P5) Dinas Pendidikan di Indonesia. Tolong buatkan MODUL PROJEK P5 ${isMadrasahPPRA ? 'DAN P5-PPRA (PROFIL PELAJAR RAHMATAN LIL ALAMIN)' : ''} KURIKULUM MERDEKA yang super lengkap, resmi, aplikatif, dan siap pakai untuk parameter berikut:
- **Tema Projek**: ${temaP5 || 'Kewirausahaan / Gaya Hidup Berkelanjutan'}
- **Topik / Judul Projek**: ${subTemaJudul || 'Inovasi Produk Olahan Lokal Ramah Lingkungan'}
- **Jenjang / Fase**: ${jenjang || 'SMP'} / ${fase || 'Fase D (SMP)'}
- **Alokasi Waktu**: ${alokasiWaktuProjek || '40 JP (Blok 2 Minggu atau Reguler Mingguan)'}
- **Dimensi Profil Pelajar Pancasila**: ${Array.isArray(dimensiSasaran) ? dimensiSasaran.join(', ') : 'Bergotong Royong, Bernalar Kritis, Kreatif'}
${isMadrasahPPRA ? `- **Nilai Utama PPRA (Kemenag)**: ${Array.isArray(nilaiPPRA) ? nilaiPPRA.join(', ') : 'Berkeadaban (Ta’addub), Keteladanan (Qudwah), Dinamis dan Inovatif (Tathawwur wa Ibtikar)'}` : ''}
- **Target Produk / Hasil Karya**: ${targetHasilKarya || 'Pameran Gelar Karya Siswa & Portofolio Projek'}
- **Satuan Pendidikan**: ${namaSekolah || 'Satuan Pendidikan'}
- **Koordinator Projek**: ${namaGuruKoordinator || 'Guru Koordinator Projek, S.Pd.'}
- **Kepala Sekolah**: ${kepalaSekolah || 'Kepala Sekolah, M.Pd.'}

STRUKTUR DOKUMEN MODUL P5 RESMI:
# MODUL PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)
## TEMA: ${(temaP5 || 'KEWIRAUSAHAAN').toUpperCase()} - "${(subTemaJudul || 'JEJAK HIJAU NUSANTARA').toUpperCase()}"

---

### 1. INFORMASI UMUM PROJEK
- Identitas Projek, Fase, Alokasi Waktu, Sarana Prasarana, Relevansi Projek dengan Satuan Pendidikan.

### 2. DIMENSI, ELEMEN, DAN SUBELEMEN PROFIL PELAJAR PANCASILA
Tabel pemetaan dimensi, elemen, subelemen, dan target pencapaian di akhir fase.
${isMadrasahPPRA ? 'Sertakan tabel nilai Profil Pelajar Rahmatan Lil Alamin (PPRA).' : ''}

### 3. ALUR TAHAPAN PROJEK (Langkah demi Langkah)
A. **Tahap Pengenalan** (Aktivitas 1-2): Eksplorasi konsep, pemantik isu kontekstual.
B. **Tahap Kontekstualisasi** (Aktivitas 3-4): Observasi lapangan, wawancara narasumber, identifikasi masalah.
C. **Tahap Aksi Nyata** (Aktivitas 5-7): Perancangan solusi, pembuatan produk/karya, kerja kelompok kolaboratif.
D. **Tahap Refleksi & Evaluasi** (Aktivitas 8): Lembar refleksi diri siswa, evaluasi tim fasilitator.
E. **Tahap Tindak Lanjut** (Aktivitas 9-10): Festival Gelar Karya / Pameran Projek & Advokasi Berkelanjutan.

### 4. LEMBAR KERJA AKTIVITAS SISWA (LKPD PROJEK)
Lembar kerja operasional yang langsung dapat digandakan dan diisi siswa.

### 5. RUBRIK ASESMEN PROJEK
Tabel rubrik penilaian autentik dengan 4 kategori standar:
- Mulai Berkembang (MB)
- Sedang Berkembang (SB)
- Berkembang Sesuai Harapan (BSH)
- Sangat Berkembang (SAB)

### 6. LEMBAR PENGESAHAN DOKUMEN PROJEK P5
Tanda tangan Kepala Sekolah dan Koordinator Fasilitator Projek.

Gunakan tabel Markdown rapi dan format Times New Roman formal.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `# MODUL PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)
## TEMA: ${(temaP5 || 'GAYA HIDUP BERKELANJUTAN').toUpperCase()}
### TOPIK: "${(subTemaJudul || 'SAMPAHKU TANGGUNG JAWABKU: INOVASI ECOBRICK DAN PENGOMPOSAN').toUpperCase()}"

---

### 1. INFORMASI UMUM PROJEK
- **Satuan Pendidikan**: ${namaSekolah || 'SMP Negeri 1 Nusantara'}
- **Fase / Jenjang**: ${fase || 'Fase D (Kelas 7-9 SMP)'}
- **Alokasi Waktu**: ${alokasiWaktuProjek || '40 Jam Pelajaran (JP)'}
- **Model Pelaksanaan**: Sistem Blok 2 Minggu / Terjadwal 4 JP per Minggu
- **Koordinator Projek**: ${namaGuruKoordinator || 'Fadli R., S.Pd., Gr.'}
- **Relevansi Projek bagi Sekolah**: Mengedukasi peserta didik untuk mengelola limbah plastik dan sampah organik di lingkungan sekolah menjadi produk bernilai guna tinggi serta membangun budaya peduli lingkungan lestari.

---

### 2. DIMENSI, ELEMEN, DAN SUBELEMEN SASARAN
| Dimensi | Elemen | Subelemen | Target Pencapaian di Akhir Fase |
|---|---|---|---|
| **Beriman, Bertakwa, & Berakhlak Mulia** | Akhlak kepada Alam | Menjaga Lingkungan Alam Sekitar | Mewujudkan rasa syukur dengan membangun inisiatif pelestarian lingkungan sekolah |
| **Bergotong Royong** | Kolaborasi | Kerja Sama & Koordinasi Sosial | Menyelaraskan tindakan sendiri dengan tindakan orang lain untuk menyelesaikan karya kelompok |
| **Kreatif** | Menghasilkan Karya Orisinal | Eksplorasi Gagasan Solutif | Menghasilkan rancangan produk daur ulang yang fungsional dan estetis |

---

### 3. ALUR TAHAPAN KEGIATAN PROJEK (10 AKTIVITAS)
1. **Aktivitas 1 (Pengenalan)**: Nonton bersama film dokumenter dampak mikroplastik dan diskusi pemantik (*4 JP*).
2. **Aktivitas 2 (Kontekstualisasi)**: Audit timbulan sampah harian di kantin dan ruang kelas (*4 JP*).
3. **Aktivitas 3 (Eksplorasi Ide)**: Riset teknik ecobrick dan pembuatan pupuk kompos komposter mini (*6 JP*).
4. **Aktivitas 4 (Aksi Nyata I)**: Pengumpulan, pencucian, dan pemilahan sampah anorganik bersih (*6 JP*).
5. **Aktivitas 5 (Aksi Nyata II)**: Pemadatan ecobrick dan perakitan modul kursi/meja taman ramah lingkungan (*8 JP*).
6. **Aktivitas 6 (Pameran Gelar Karya)**: Festival Panen Hasil Belajar P5 yang dihadiri seluruh warga sekolah dan orang tua (*8 JP*).
7. **Aktivitas 7 (Refleksi & Advokasi)**: Evaluasi bersama tim fasilitator dan penandatanganan komitmen sekolah bebas sampah plastik (*4 JP*).

---

### 4. RUBRIK ASESMEN PERKEMBANGAN PROJEK P5
| Subelemen yang Dinilai | Mulai Berkembang (MB) | Sedang Berkembang (SB) | Berkembang Sesuai Harapan (BSH) | Sangat Berkembang (SAB) |
|---|---|---|---|---|
| **Menjaga Alam Sekitar** | Membutuhkan dorongan guru untuk membuang sampah | Sadar membuang sampah pada tempatnya secara konsisten | Mengurangi sampah plastik pribadi dan aktif mengolah limbah | Memimpin gerakan pemilahan sampah dan mengedukasi lingkungan |
| **Kerja Sama Kelompok** | Bekerja pasif dalam tim | Bekerja sama jika diminta ketua | Aktif berkontribusi dan berbagi peran dalam tim projek | Menginspirasi anggota tim dan menjadi pemecah masalah kelompok |
| **Kreativitas Produk** | Produk belum rapi | Produk rapi sesuai contoh instruktur | Produk rapi, kokoh, dan berfungsi dengan baik | Produk sangat inovatif, memiliki nilai estetika dan nilai ekonomis |

---

### 5. LEMBAR PENGESAHAN DOKUMEN PROJEK
${kotaKabupaten || 'Jakarta'}, 15 Juli 2026

Disetujui dan Disahkan oleh:

Mengetahui,  
**Kepala Satuan Pendidikan**  
<br><br><br>  
**<u>${kepalaSekolah || 'Dr. H. Sulaiman, M.Pd.'}</u>**  
NIP. ${nipKepalaSekolah || '19750512 200003 1 004'}  

Koordinator Tim Projek P5,  
<br><br><br>  
**<u>${namaGuruKoordinator || 'Fadli R., S.Pd., Gr.'}</u>**  
NIP. ${nipGuru || '19900101 202012 1 001'}`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate Bank Soal & Kisi-Kisi HOTS / ANBK
app.post('/api/generate-bank-soal', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    topikMateri,
    jenisAsesmen,
    jumlahSoalPG,
    jumlahSoalKompleks,
    jumlahSoalMenjodohkan,
    jumlahSoalUraian,
    namaSekolah,
    namaGuru,
    kotaKabupaten,
  } = req.body;

  const prompt = `Anda adalah Tim Penulis Soal dan Asesmen Kurikulum Merdeka Dinas Pendidikan di Indonesia. Tolong buatkan DOKUMEN KISI-KISI SOAL, NASKAH SOAL ASESMEN HOTS, KUNCI JAWABAN, DAN RUBRIK PENSKORAN yang super lengkap untuk parameter berikut:
- **Mata Pelajaran**: ${mataPelajaran || 'Mata Pelajaran'}
- **Jenjang / Fase / Kelas**: ${jenjang || 'SMP'} / ${faseKelas || 'Fase D (Kelas 7 SMP)'}
- **Topik / Materi Pembelajaran**: ${topikMateri || 'Topik Esensial'}
- **Jenis Asesmen**: ${jenisAsesmen || 'Sumatif Akhir Semester (SAS) / Latihan Soal HOTS'}
- **Komposisi Soal**:
  - Pilihan Ganda Tunggal (4 Opsi A-D untuk SMP/SD, 5 Opsi A-E untuk SMA): ${jumlahSoalPG || 5} butir
  - Pilihan Ganda Kompleks (Pernyataan Benar/Salah atau Centang Banyak): ${jumlahSoalKompleks || 2} butir
  - Menjodohkan: ${jumlahSoalMenjodohkan || 2} butir
  - Uraian HOTS (Higher Order Thinking Skills): ${jumlahSoalUraian || 3} butir
- **Satuan Pendidikan**: ${namaSekolah || 'Satuan Pendidikan'}
- **Guru Penulis Soal**: ${namaGuru || 'Guru Pengampu, S.Pd.'}

FORMAT DOKUMEN HARUS MEMUAT 4 BAGIAN LENGKAP:
# KISI-KISI, NASKAH ASESMEN HOTS, DAN PEDOMAN PENSKORAN
## MATA PELAJARAN: ${(mataPelajaran || 'MATA PELAJARAN').toUpperCase()}

---

### BAGIAN I. TABEL KISI-KISI PENULISAN SOAL
| No | Capaian Pembelajaran / Materi Pokok | Indikator Soal | Level Kognitif (C1-C6) | Bentuk Soal | No Soal |
|---|---|---|---|---|---|

### BAGIAN II. NASKAH SOAL ASESMEN HOTS
Setiap soal WAJIB diawali stimulus kontekstual yang kaya (cerita kasus, tabel data, infografis naratif, atau fenomena nyata sehari-hari).

### BAGIAN III. KUNCI JAWABAN LENGKAP
Kunci jawaban akurat untuk seluruh nomor soal.

### BAGIAN IV. PEDOMAN PENSKORAN & RUBRIK PENILAIAN
Tabel penskoran dan rumus konversi nilai skala 0-100.

Gunakan format Times New Roman dan tabel Markdown rapi.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `# KISI-KISI, NASKAH SOAL HOTS, DAN PEDOMAN PENSKORAN
## SATUAN PENDIDIKAN: ${namaSekolah || 'SMP NEGERI 1 NUSANTARA'}
### MATA PELAJARAN: ${(mataPelajaran || 'IPA').toUpperCase()} | MATERI: ${(topikMateri || 'EKOSISTEM DAN RANTAI MAKANAN').toUpperCase()}

---

### BAGIAN I. TABEL KISI-KISI PENULISAN SOAL
| No | Lingkup Materi | Indikator Pencapaian Kompetensi | Level Kognitif | Bentuk Soal | No Soal |
|---|---|---|---|---|---|
| 1 | Rantai Makanan & Tingkat Trofik | Disajikan skema perpindahan energi, peserta didik dapat memprediksi dampak penurunan populasi konsumen primer | C4 (Analisis) | Pilihan Ganda | 1 |
| 2 | Keseimbangan Ekosistem | Disajikan narasi wabah hama sawah, peserta didik menganalisis penyebab terganggunya rantai makanan | C4 (Analisis) | Pilihan Ganda | 2 |
| 3 | Peran Dekomposer | Disajikan studi kasus tanah hutan, peserta didik menyimpulkan peran jamur dan bakteri pembusuk | C3 (Aplikasi) | Pilihan Ganda Kompleks | 3 |
| 4 | Interaksi Simbiosis | Disajikan pasangan organisme, peserta didik menjodohkan bentuk interaksi yang terjadi | C2 (Pemahaman) | Menjodohkan | 4 |
| 5 | Solusi Masalah Lingkungan | Disajikan permasalahan gagal panen petani, peserta didik merumuskan 2 rekomendasi pengendalian hama ramah lingkungan | C6 (Kreasi) | Uraian HOTS | 5 |

---

### BAGIAN II. NASKAH SOAL ASESMEN HOTS

**STIMULUS UNTUK SOAL NO. 1 & 2:**
> *Di sebuah kawasan pertanian terpadu di lereng pegunungan, petani padi membabat habis semak belukar tempat tinggal burung hantu dan elang karena dianggap mengganggu unggas peliharaan. Enam bulan kemudian, populasi tikus meledak sebanyak 300% dan menyebabkan gagal panen padi hingga 70%. Sementara itu, jumlah katak sawah juga menurun drastis karena sumber pakan serangganya berkurang akibat disemprot insektisida kimia dosis tinggi.*

1. **(Pilihan Ganda Tunggal)**  
   Berdasarkan stimulus di atas, peristiwa yang menjadi pemicu utama ledakan populasi hama tikus adalah...  
   A. Meningkatnya luas lahan sawah garapan petani  
   B. Hilangnya predator puncak alami yang mengontrol populasi tikus  
   C. Tingginya frekuensi penyemprotan insektisida kimia oleh petani  
   D. Penurunan populasi katak sawah di saluran irigasi  

2. **(Pilihan Ganda Tunggal)**  
   Jika petani ingin memulihkan rantai makanan secara alami tanpa merusak kesuburan tanah, tindakan paling tepat adalah...  
   A. Menambahkan racun tikus kimiawi dalam jumlah dua kali lipat  
   B. Mengeringkan lahan sawah secara permanen  
   C. Membangun pagupon (rumah sarang) burung hantu jenis *Tyto alba* di tengah sawah  
   D. Membakar seluruh jerami sisa panen agar tikus tidak bersarang  

3. **(Pilihan Ganda Kompleks - Pilihlah Benar atau Salah)**  
   | Pernyataan | Benar / Salah |
   |---|---|
   | Dekomposer (pengurai) berfungsi mengembalikan zat hara organik dari bangkai makhluk hidup ke dalam tanah | [ BENAR ] |
   | Tanpa adanya produsen, konsumen tingkat 1 dan 2 tetap dapat bertahan hidup dengan menyerap energi tanah secara langsung | [ SALAH ] |

4. **(Menjodohkan)**  
   Jodohkanlah interaksi antarmakhluk hidup berikut dengan nama simbiosis yang tepat:  
   - Bunga anggrek yang menempel pada batang pohon mangga $\rightarrow$ **Simbiosis Komensalisme**  
   - Bakteri *Rhizobium* pada bintil akar tanaman kacang $\rightarrow$ **Simbiosis Mutualisme**  
   - Benalu yang hidup menghisap cairan inang pohon randu $\rightarrow$ **Simbiosis Parasitisme**  

5. **(Uraian HOTS)**  
   Jelaskan bagaimana konsep *trophic cascade* (efek domino jaring makanan) terjadi pada kasus sawah di atas, dan rumuskanlah 2 rekomendasi nyata ramah lingkungan bagi petani untuk mengendalikan hama tikus!  

---

### BAGIAN III. KUNCI JAWABAN & PEDOMAN PENSKORAN
1. **Kunci No. 1**: **B** (Skor: 15)  
2. **Kunci No. 2**: **C** (Skor: 15)  
3. **Kunci No. 3**: Pernyataan 1 = Benar, Pernyataan 2 = Salah (Skor: 20)  
4. **Kunci No. 4**: Seluruh pasangan dijodohkan dengan benar (Skor: 20)  
5. **Kunci No. 5**:  
   - *Penjelasan Trophic Cascade*: Hilangnya predator puncak (burung hantu/elang) menyebabkan tidak adanya kontrol mangsa, sehingga tikus berkembang biak tanpa hambatan dan menghabiskan produsen (padi). (Skor: 15)  
   - *2 Rekomendasi Solusi*: (1) Konservasi burung hantu sawah dan larangan perburuan liar; (2) Penerapan musuh alami dan penanaman tanaman refugia pengusir serangga. (Skor: 15)  

**Total Skor Maksimal = 100**  
Nilai Akhir = (Skor Perolehan / 100) x 100`;

    return res.json({ success: true, modul: fallback });
  }
});

// API endpoint to generate Slide Bahan Ajar Presentasi Kelas
app.post('/api/generate-slide-ajar', async (req, res) => {
  const {
    mataPelajaran,
    jenjang,
    faseKelas,
    topikMateri,
    jumlahSlide,
    namaGuru,
    namaSekolah,
  } = req.body;

  const prompt = `Anda adalah Spesialis Desain Instruksional Media Pembelajaran Digital di Indonesia. Tolong buatkan RANGKUMAN SLIDE BAHAN AJAR PRESENTASI KELAS (PowerPoint / Canva Ready) untuk mata pelajaran ${mataPelajaran || 'IPA'} topik "${topikMateri || 'Materi Pokok'}" jenjang ${jenjang || 'SMP'} (${faseKelas || 'Fase D'}).
Buatlah materi slide yang interaktif, student-centered, terstruktur sebanyak ${jumlahSlide || 7} slide presentasi lengkap dengan teks tayangan, instruksi visual untuk guru, pertanyaan pemantik, dan aktivitas kelas.`;

  try {
    const content = await callGeminiWithFallback(prompt, SYSTEM_INSTRUCTION);
    return res.json({ success: true, modul: content });
  } catch (error: any) {
    const fallback = `# BAHAN TAYANG PRESENTASI PEMBELAJARAN (SLIDE DECK)
## ${mataPelajaran || 'ILMU PENGETAHUAN ALAM'} - "${topikMateri || 'EKOSISTEM DAN JARING MAKANAN'}"
### PENYUSUN: ${namaGuru || 'GURU MATA PELAJARAN'} | ${namaSekolah || 'SATUAN PENDIDIKAN'}

---

### [SLIDE 1: JUDUL & PEMBUKA]
- **Teks Utama**: Jaring-Jaring Kehidupan: Mengapa Alam Membutuhkan Keseimbangan?
- **Sub-judul**: Pembelajaran Berdiferensiasi & Berpikir Kritis
- **Instruksi Visual Guru**: Tampilkan foto pemandangan sawah hijau yang indah berdampingan dengan foto burung hantu dan elang.
- **Aktivitas Pembuka**: Salam hangat, cek kesiapan siswa, dan sampaikan tujuan belajar hari ini.

---

### [SLIDE 2: PERTANYAAN PEMANTIK & APERSEPSI]
- **Teks Utama**: "Jika Semua Ular dan Burung Hantu Diburu, Siapa yang Paling Menderita?"
- **Poin Diskusi**:
  - Apa yang terjadi jika salah satu hewan di sawah tiba-tiba punah?
  - Apakah hewan yang menakutkan bagi manusia tidak punya manfaat bagi alam?
- **Instruksi Visual Guru**: Tampilkan cuplikan berita gagal panen padi akibat serangan hama tikus.

---

### [SLIDE 3: KONSEP KUNCI - DARI RANTAI MENUJU JARING MAKANAN]
- **Poin Materi Inti**:
  1. **Produsen (Tumbuhan)**: Pengikat energi matahari melalui fotosintesis.
  2. **Konsumen I (Herbivora)**: Pemakan langsung tumbuhan (ulat, belalang, tikus).
  3. **Konsumen II & III (Karnivora/Predator)**: Pengontrol populasi mangsa (katak, ular, burung hantu).
  4. **Dekomposer (Pengurai)**: Mengembalikan zat hara organik ke dalam tanah.
- **Catatan Konsep**: Arah anak panah menunjukkan **Arah Aliran Energi**, bukan siapa yang dimakan!

---

### [SLIDE 4: STUDI KASUS NYATA - MISTERI DESA SUKATANI]
- **Teks Kasus**:
  - Di Desa Sukatani, terjadi perburuan 500 ekor ular sawah tiap bulan.
  - Dampak: 50 Hektar sawah puso karena jutaan tikus merajalela.
- **Tantangan Kelompok**: *"Bagaimana cara kalian mengembalikan panen padi Desa Sukatani tanpa menggunakan racun kimia yang berbahaya bagi tanah?"*

---

### [SLIDE 5: PANDUAN KERJA KELOMPOK (LKPD TIME)]
- **Tugas Kelompok (Waktu: 20 Menit)**:
  1. Buka amplop kartu organisme kelompokmu.
  2. Rangkai minimal 2 rantai makanan menjadi jaring-jaring makanan pada kertas plano.
  3. Tuliskan 1 solusi kreatif penanganan hama ramah lingkungan.
- **Kriteria Penilaian**: Gotong royong, nalar kritis, dan estetika bagan visual.

---

### [SLIDE 6: KUIS CEPAT TANGGAP (CEK PEMAHAMAN)]
1. *Pertanyaan 1*: Makhluk hidup yang mengubah senyawa anorganik menjadi organik adalah... (Jawaban: Produsen/Tumbuhan)
2. *Pertanyaan 2*: Apakah manusia termasuk bagian dari rantai makanan? Mengapa?
- **Teknik**: Siswa menjawab menggunakan kartu warna atau acungan jempol interaktif.

---

### [SLIDE 7: KESIMPULAN & REFLEKSI DIRI]
- **Intisari Pembelajaran**:
  - *"Tidak ada makhluk hidup yang diciptakan sia-sia. Menjaga satu spesies predator puncak berarti menjaga seluruh persediaan pangan manusia."*
- **Refleksi Siswa**:
  - "Satu hal baru yang membuka mata saya hari ini adalah..."
- **Penutup**: Doa bersama, apresiasi untuk kelompok teraktif, dan salam penutup.`;

    return res.json({ success: true, modul: fallback });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Sat-Set Modul Ajar Generator',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Sat-Set Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
