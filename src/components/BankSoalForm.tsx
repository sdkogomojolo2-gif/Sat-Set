import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck2,
  Zap,
  Sparkles,
  BookOpen,
  ListChecks,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  Edit2,
  X,
  RotateCcw,
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { BankSoalParams, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import { getKurikulumPusat, getMataPelajaranKhususGuru } from '../data/kurikulumPusat';
import * as XLSX from 'xlsx';

export interface BankSoalItemRow {
  id: string;
  no: number;
  tujuanPembelajaran: string;
  lingkupMateri: string;
  indikatorSoal: string;
  levelKognitif: string; // 'L1 (Pemahaman)' | 'L2 (Penerapan)' | 'L3 (Penalaran HOTS)'
  bentukSoal: 'Pilihan Ganda' | 'PG Kompleks' | 'Menjodohkan' | 'Uraian';
  soalText: string;
  kunciJawaban: string;
  skor: number;
}

interface BankSoalFormProps {
  onGenerate: (params: BankSoalParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

const STORAGE_KEY_BANK_SOAL = 'satset_bank_soal_items_v3';

// Preset SD (Pendidikan Pancasila)
const DEFAULT_SD_SOAL: BankSoalItemRow[] = [
  {
    id: 'soal-sd-1',
    no: 1,
    tujuanPembelajaran: '1.1 Mengenal simbol dan bunyi sila-sila Pancasila pada lambang Garuda Pancasila',
    lingkupMateri: 'Simbol Garuda Pancasila',
    indikatorSoal: 'Disajikan gambar perisai burung garuda, siswa dapat menentukan simbol sila pertama Pancasila.',
    levelKognitif: 'L1 (Pemahaman)',
    bentukSoal: 'Pilihan Ganda',
    soalText: 'Simbol pada perisai Burung Garuda yang melambangkan sila pertama "Ketuhanan Yang Maha Esa" adalah...\nA. Rantai Emas\nB. Bintang Emas\nC. Pohon Beringin\nD. Kepala Banteng',
    kunciJawaban: 'B (Bintang Emas)',
    skor: 1,
  },
  {
    id: 'soal-sd-2',
    no: 2,
    tujuanPembelajaran: '1.2 Menghubungkan simbol dengan sikap gotong royong dan tolong-menolong',
    lingkupMateri: 'Pengamalan Sila Kedua',
    indikatorSoal: 'Disajikan studi kasus anak menolong teman terjatuh dari sepeda di sekolah, siswa dapat mengaitkan dengan sila Pancasila yang tepat.',
    levelKognitif: 'L2 (Penerapan)',
    bentukSoal: 'Pilihan Ganda',
    soalText: 'Edo melihat Siti terjatuh dari sepeda saat pulang sekolah. Edo segera membantu Siti berdiri dan mengobati lukanya. Sikap Edo mencerminkan pengamalan Pancasila sila ke...\nA. Satu\nB. Dua\nC. Tiga\nD. Empat',
    kunciJawaban: 'B (Dua)',
    skor: 1,
  },
  {
    id: 'soal-sd-3',
    no: 3,
    tujuanPembelajaran: '1.3 Mengidentifikasi aturan tata tertib di rumah dan di sekolah',
    lingkupMateri: 'Aturan Sekolah',
    indikatorSoal: 'Disajikan beberapa pernyataan perilaku di kelas, siswa dapat memilih lebih dari satu contoh perilaku yang menaati aturan.',
    levelKognitif: 'L3 (Penalaran HOTS)',
    bentukSoal: 'PG Kompleks',
    soalText: 'Manakah dari pernyataan berikut yang merupakan contoh ketaatan terhadap aturan di sekolah? (Pilihlah 2 jawaban benar!)\n[ ] Membuang bungkus makanan ke tempat sampah\n[ ] Berbicara keras saat guru sedang menjelaskan materi\n[ ] Datang ke sekolah 15 menit sebelum bel berbunyi\n[ ] Mencoret-coret meja belajar dengan spidol',
    kunciJawaban: 'Pernyataan 1 dan 3 benar',
    skor: 2,
  },
  {
    id: 'soal-sd-4',
    no: 4,
    tujuanPembelajaran: '1.4 Mengenali simbol-simbol sila Pancasila dan maknanya',
    lingkupMateri: 'Pasangan Simbol & Makna',
    indikatorSoal: 'Disajikan daftar simbol dan daftar bunyi sila Pancasila, siswa dapat menjodohkan dengan tepat.',
    levelKognitif: 'L1 (Pemahaman)',
    bentukSoal: 'Menjodohkan',
    soalText: 'Jodohkan simbol sila di kolom kiri dengan bunyi sila di kolom kanan yang sesuai:\n1. Kepala Banteng -> (A) Keadilan Sosial\n2. Pohon Beringin  -> (B) Kerakyatan yang dipimpin hikmat...\n3. Padi dan Kapas -> (C) Persatuan Indonesia',
    kunciJawaban: '1 - B, 2 - C, 3 - A',
    skor: 3,
  },
  {
    id: 'soal-sd-5',
    no: 5,
    tujuanPembelajaran: '1.5 Menceritakan pengalaman bergotong royong di lingkungan sekitar',
    lingkupMateri: 'Gotong Royong & Kerja Sama',
    indikatorSoal: 'Disajikan situasi kerja bakti membersihkan selokan desa yang tersumbat, siswa dapat menganalisis manfaat gotong royong.',
    levelKognitif: 'L3 (Penalaran HOTS)',
    bentukSoal: 'Uraian',
    soalText: 'Jelaskan 3 (tiga) manfaat jika seluruh warga kelas kompak dan bergotong royong membersihkan ruang kelas setiap hari!',
    kunciJawaban: '1. Kelas menjadi bersih dan nyaman untuk belajar.\n2. Pekerjaan membersihkan kelas cepat selesai.\n3. Menjalin keakraban dan kerukunan antar teman.',
    skor: 5,
  },
];

// Preset SMP (IPA)
const DEFAULT_SMP_SOAL: BankSoalItemRow[] = [
  {
    id: 'soal-smp-1',
    no: 1,
    tujuanPembelajaran: '7.1 Menjelaskan hakikat ilmu sains, metode ilmiah, dan pengukuran besaran IPA',
    lingkupMateri: 'Pengukuran & Besaran Pokok',
    indikatorSoal: 'Disajikan gambar jangka sorong mengukur diameter kelereng, siswa dapat membaca skala hasil pengukuran dengan teliti.',
    levelKognitif: 'L2 (Penerapan)',
    bentukSoal: 'Pilihan Ganda',
    soalText: 'Sebuah silinder logam diukur diameternya menggunakan jangka sorong. Skala utama menunjukkan 3,1 cm dan skala nonius garis ke-4 berimpit lurus. Diameter silinder tersebut adalah...\nA. 3,14 cm\nB. 3,18 cm\nC. 3,40 cm\nD. 3,54 cm',
    kunciJawaban: 'A (3,14 cm)',
    skor: 1,
  },
  {
    id: 'soal-smp-2',
    no: 2,
    tujuanPembelajaran: '7.2 Mengidentifikasi komponen biotik dan abiotik dalam interaksi ekosistem',
    lingkupMateri: 'Interaksi Ekosistem & Jaring Makanan',
    indikatorSoal: 'Disajikan grafik penurunan populasi elang akibat perburuan liar, siswa dapat memprediksi dampak terhadap rantai makanan ekosistem sawah.',
    levelKognitif: 'L3 (Penalaran HOTS)',
    bentukSoal: 'PG Kompleks',
    soalText: 'Di sebuah sawah terjadi perburuan liar burung elang secara besar-besaran. Pilihlah pernyataan yang merupakan dampak berantai yang terjadi! (Pilih 2 jawaban yang tepat)\n[ ] Populasi ular sawah akan mengalami peningkatan pesat\n[ ] Populasi tikus perusak padi akan meningkat tidak terkendali\n[ ] Hasil panen padi para petani akan meningkat drastis\n[ ] Keseimbangan rantai makanan sawah terganggu',
    kunciJawaban: 'Pernyataan 1 dan 4 benar',
    skor: 2,
  },
  {
    id: 'soal-smp-3',
    no: 3,
    tujuanPembelajaran: '7.3 Menjelaskan konsep kalor dan perpindahan panas',
    lingkupMateri: 'Perpindahan Kalor',
    indikatorSoal: 'Disajikan peristiwa perpindahan kalor dalam kehidupan sehari-hari, siswa dapat menjodohkannya dengan mekanisme perpindahan kalor yang sesuai.',
    levelKognitif: 'L2 (Penerapan)',
    bentukSoal: 'Menjodohkan',
    soalText: 'Jodohkan peristiwa sehari-hari dengan jenis perpindahan kalor yang tepat:\n1. Ujung sendok logam terasa panas saat mengaduk teh hangat -> (A) Radiasi\n2. Terjadinya angin darat dan angin laut di pesisir pantai    -> (B) Konduksi\n3. Panas matahari yang terasa sampai ke permukaan bumi      -> (C) Konveksi',
    kunciJawaban: '1 - B (Konduksi), 2 - C (Konveksi), 3 - A (Radiasi)',
    skor: 3,
  },
  {
    id: 'soal-smp-4',
    no: 4,
    tujuanPembelajaran: '7.4 Mengkaji fenomena pemanasan global dan efek rumah kaca',
    lingkupMateri: 'Pemanasan Global & Perubahan Iklim',
    indikatorSoal: 'Disajikan infografis data peningkatan konsentrasi gas CO2 di atmosfer selama 50 tahun terakhir, siswa dapat merumuskan solusi berbasis gaya hidup berkelanjutan.',
    levelKognitif: 'L3 (Penalaran HOTS)',
    bentukSoal: 'Uraian',
    soalText: 'Berdasarkan fenomena efek rumah kaca, analisislah mengapa penggundulan hutan (deforestasi) dapat mempercepat pemanasan global, dan tuliskan 3 tindakan nyata yang dapat dilakukan pelajar di lingkungan sekolah untuk mengatasinya!',
    kunciJawaban: 'Analisis: Pohon berfungsi menyerap CO2 untuk fotosintesis. Jika hutan ditebang, penyerapan CO2 berkurang sehingga gas CO2 menumpuk dan memerangkap panas di atmosfer.\nSolusi Pelajar:\n1. Menanam pohon peneduh di pekarangan sekolah (reboisasi/green school).\n2. Mematikan lampu kelas dan pendingin ruangan saat tidak digunakan (hemat listrik).\n3. Menggunakan sepeda atau berjalan kaki ke sekolah untuk mengurangi emisi bahan bakar.',
    skor: 5,
  },
];

export const BankSoalForm: React.FC<BankSoalFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
  currentUser,
}) => {
  const isSMP = currentUser?.teacherLevel === 'SMP' || schoolProfile.jenjang === 'SMP';
  const targetJenjang: 'SD' | 'SMP' = isSMP ? 'SMP' : 'SD';
  const targetFase = currentUser?.faseTerkunci || currentUser?.kelasYangDiajar || (isSMP ? 'Fase D (Kelas 7-9 SMP)' : 'Fase B (Kelas 3-4 SD)');

  // Mapel khusus guru
  const allowedMapelList = getMataPelajaranKhususGuru(currentUser);
  const defaultMapel = allowedMapelList[0] || (isSMP ? 'Ilmu Pengetahuan Alam (IPA)' : 'Ilmu Pengetahuan Alam dan Sosial (IPAS)');
  const initialKurikulum = getKurikulumPusat(targetJenjang, currentUser?.mataPelajaran || defaultMapel, targetFase);

  const [formData, setFormData] = useState<BankSoalParams>({
    mataPelajaran: initialKurikulum.mataPelajaran || defaultMapel,
    jenjang: targetJenjang as any,
    faseKelas: targetFase,
    topikMateri: initialKurikulum.daftarMateriPokok[0] || (isSMP ? 'Interaksi Komponen Ekosistem' : 'Simbol-Simbol Pancasila'),
    jenisAsesmen: 'Sumatif Akhir Semester (SAS)',
    jumlahSoalPG: 5,
    jumlahSoalKompleks: 2,
    jumlahSoalMenjodohkan: 2,
    jumlahSoalUraian: 3,
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || (isSMP ? 'SMP NEGERI 1 PALASA' : 'SD NEGERI 1 PALASA'),
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kab. Parigi Moutong',
  });

  // Selected TP from official central curriculum
  const [selectedTpIndex, setSelectedTpIndex] = useState<number>(0);

  // Storage key scoped by user ID
  const userStorageKey = `satset_bank_soal_${currentUser?.id || 'guest'}_${initialKurikulum.id}`;

  // Table items state with localStorage persistence
  const [soalRows, setSoalRows] = useState<BankSoalItemRow[]>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return isSMP ? DEFAULT_SMP_SOAL : DEFAULT_SD_SOAL;
  });

  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(soalRows));
    } catch (e) {}
  }, [soalRows, userStorageKey]);

  // Sync profile & user
  useEffect(() => {
    if (currentUser) {
      const allowed = getMataPelajaranKhususGuru(currentUser);
      const userMapel = allowed.find((m) => m === currentUser.mataPelajaran) || allowed[0] || formData.mataPelajaran;
      const fase = currentUser.faseTerkunci || currentUser.kelasYangDiajar || formData.faseKelas;
      const kurikulum = getKurikulumPusat(currentUser.teacherLevel, userMapel, fase);

      setFormData((prev) => ({
        ...prev,
        mataPelajaran: kurikulum.mataPelajaran,
        faseKelas: fase,
        topikMateri: kurikulum.daftarMateriPokok[0] || prev.topikMateri,
        namaSekolah: currentUser?.namaSekolah || prev.namaSekolah,
        namaGuru: currentUser?.name || prev.namaGuru,
      }));
    }
  }, [currentUser]);

  // Function to generate 10 questions + rubric from selected official TP
  const handleGenerateFromOfficialTP = (tpIndex: number) => {
    const kurikulum = getKurikulumPusat(targetJenjang, formData.mataPelajaran, formData.faseKelas);
    const chosenTp = kurikulum.atpList[tpIndex] || kurikulum.atpList[0];
    if (!chosenTp) return;

    const materi = chosenTp.lingkupMateri || chosenTp.elemen;
    const tpText = chosenTp.tujuanPembelajaran;

    const generatedPackage: BankSoalItemRow[] = [
      {
        id: `soal-gen-${Date.now()}-1`,
        no: 1,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan konsep dasar tentang ${materi}, siswa dapat mengidentifikasi fakta kunci secara tepat.`,
        levelKognitif: 'L1 (Pemahaman)',
        bentukSoal: 'Pilihan Ganda',
        soalText: `Berdasarkan pembelajaran mengenai ${materi}, manakah pernyataan berikut yang paling tepat?\nA. Konsep dasar ${materi} berlaku pada lingkungan tertentu saja.\nB. Penerapan ${materi} bertujuan untuk menunjang keteraturan dan efektivitas proses pembelajaran.\nC. ${materi} tidak memiliki hubungan dengan kehidupan sehari-hari.\nD. Semua jawaban salah.`,
        kunciJawaban: 'B (Penerapan bertujuan untuk menunjang keteraturan dan efektivitas proses)',
        skor: 1,
      },
      {
        id: `soal-gen-${Date.now()}-2`,
        no: 2,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan ilustrasi situasi nyata terkait ${materi}, siswa dapat menentukan tindakan yang sesuai dengan prinsip kurikulum.`,
        levelKognitif: 'L2 (Penerapan)',
        bentukSoal: 'Pilihan Ganda',
        soalText: `Dalam kegiatan sehari-hari di lingkungan sekolah/masyarakat terkait ${materi}, seorang peserta didik dihadapkan pada permasalahan praktis. Langkah pertama yang paling tepat dilakukan adalah...\nA. Mengabaikan masalah karena bukan tanggung jawabnya.\nB. Mengidentifikasi faktor penyebab masalah dan mencari solusi berdasarkan prinsip ${materi}.\nC. Menunggu arahan dari guru tanpa mencoba berpikir mandiri.\nD. Meminta teman lain untuk menyelesaikan tugas tersebut.`,
        kunciJawaban: 'B (Mengidentifikasi faktor penyebab masalah dan mencari solusi berdasarkan prinsip)',
        skor: 1,
      },
      {
        id: `soal-gen-${Date.now()}-3`,
        no: 3,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan data komparasi atau tabel perbandingan ${materi}, siswa dapat menyimpulkan hubungan sebab-akibat.`,
        levelKognitif: 'L3 (Penalaran HOTS)',
        bentukSoal: 'Pilihan Ganda',
        soalText: `Perhatikan studi kasus tentang fenomena perubahan pada ${materi}. Jika variabel utama ditingkatkan secara bertahap, kesimpulan yang paling logis dan berdasar bukti adalah...\nA. Hasil akhir tetap sama tanpa adanya perubahan signifikan.\nB. Terjadi peningkatan efisiensi yang berbanding lurus dengan penerapan prinsip ${materi}.\nC. Sistem akan mengalami kegagalan total secara mendadak.\nD. Tidak ada keterkaitan antara variabel input dengan kondisi sistem.`,
        kunciJawaban: 'B (Terjadi peningkatan efisiensi yang berbanding lurus dengan penerapan prinsip)',
        skor: 1,
      },
      {
        id: `soal-gen-${Date.now()}-4`,
        no: 4,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan stimulus kontekstual mengenai ${materi}, siswa dapat memecahkan masalah dengan penalaran kritis.`,
        levelKognitif: 'L3 (Penalaran HOTS)',
        bentukSoal: 'Pilihan Ganda',
        soalText: `Mengapa penguasaan terhadap ${materi} sangat penting dalam kehidupan bermasyarakat dan pembelajaran di era digital saat ini?\nA. Karena dapat membantu mengambil keputusan yang bijak, kritis, dan berbasis fakta empiris.\nB. Hanya untuk keperluan memperoleh nilai rapor semata.\nC. Agar dapat menyelesaikan ujian tanpa perlu memahami maknanya.\nD. Menghafal seluruh istilah tanpa mengaplikasikannya.`,
        kunciJawaban: 'A (Membantu mengambil keputusan yang bijak, kritis, dan berbasis fakta empiris)',
        skor: 1,
      },
      {
        id: `soal-gen-${Date.now()}-5`,
        no: 5,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan beberapa pernyataan terkait ${materi}, siswa dapat memilih lebih dari satu pernyataan yang bernilai benar.`,
        levelKognitif: 'L2 (Penerapan)',
        bentukSoal: 'PG Kompleks',
        soalText: `Tentukan pernyataan-pernyataan berikut yang bernilai BENAR terkait topik ${materi} (Pilihlah 2 opsi yang tepat!):\n[ ] Pemahaman konsep ${materi} dapat diintegrasikan dalam proyek Profil Pelajar Pancasila.\n[ ] Pembelajaran ${materi} hanya dapat dipraktikkan di dalam ruangan kelas saja.\n[ ] Keterampilan bernalar kritis dan kreatif sangat dibutuhkan dalam menguasai ${materi}.\n[ ] Hasil akhir tidak dipengaruhi oleh proses refleksi belajar.`,
        kunciJawaban: 'Pernyataan 1 dan 3 Benar',
        skor: 2,
      },
      {
        id: `soal-gen-${Date.now()}-6`,
        no: 6,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan dua kolom pasangan konsep dan penjelasan pada ${materi}, siswa dapat menjodohkan pasangan yang tepat.`,
        levelKognitif: 'L1 (Pemahaman)',
        bentukSoal: 'Menjodohkan',
        soalText: `Jodohkan istilah pada Kolom Kiri dengan deskripsi pada Kolom Kanan yang sesuai:\n1. Konsep Utama ${materi} -> (A) Tahap evaluasi dan pemecahan masalah nyata\n2. Penerapan Praktis     -> (B) Landasan dasar teori yang mendasari fenomena\n3. Analisis Reflektif     -> (C) Implementasi langsung dalam karya atau solusi`,
        kunciJawaban: '1 - B, 2 - C, 3 - A',
        skor: 3,
      },
      {
        id: `soal-gen-${Date.now()}-7`,
        no: 7,
        tujuanPembelajaran: tpText,
        lingkupMateri: materi,
        indikatorSoal: `Disajikan permasalahan kompleks terkait ${materi}, siswa dapat menganalisis dan merumuskan solusi mendalam secara tertulis.`,
        levelKognitif: 'L3 (Penalaran HOTS)',
        bentukSoal: 'Uraian',
        soalText: `Jelaskan bagaimana konsep ${materi} dapat diterapkan dalam mengatasi permasalahan nyata di lingkungan sekitar Anda! Tuliskan minimal 2 contoh konkret beserta analisis manfaatnya!`,
        kunciJawaban: `Pedoman Penskoran Uraian:\n- Menyebutkan 2 contoh nyata yang relevan dengan ${materi} (Skor 2)\n- Menjelaskan hubungan sebab-akibat secara runtut dan logis (Skor 2)\n- Menarik kesimpulan atau solusi pemecahan masalah dengan bahasa yang santun dan jelas (Skor 1)\nTotal Skor Maksimal: 5`,
        skor: 5,
      },
    ];

    setSoalRows(generatedPackage);
    setFormData((prev) => ({
      ...prev,
      topikMateri: materi,
    }));
  };

  // Filters & Search
  const [filterBentuk, setFilterBentuk] = useState<string>('SEMUA');
  const [filterLevel, setFilterLevel] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal / Form state for Add/Edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BankSoalItemRow | null>(null);

  // Form state for modal input
  const [itemInput, setItemInput] = useState<Omit<BankSoalItemRow, 'id' | 'no'>>({
    tujuanPembelajaran: '',
    lingkupMateri: '',
    indikatorSoal: '',
    levelKognitif: 'L3 (Penalaran HOTS)',
    bentukSoal: 'Pilihan Ganda',
    soalText: '',
    kunciJawaban: '',
    skor: 1,
  });

  const filteredItems = useMemo(() => {
    return soalRows.filter((item) => {
      if (filterBentuk !== 'SEMUA' && item.bentukSoal !== filterBentuk) return false;
      if (filterLevel !== 'SEMUA' && !item.levelKognitif.startsWith(filterLevel)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.soalText.toLowerCase().includes(q) ||
          item.tujuanPembelajaran.toLowerCase().includes(q) ||
          item.lingkupMateri.toLowerCase().includes(q) ||
          item.indikatorSoal.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [soalRows, filterBentuk, filterLevel, searchQuery]);

  // CRUD Handlers
  const handleOpenAdd = () => {
    setItemInput({
      tujuanPembelajaran: formData.topikMateri ? `Memahami dan menganalisis ${formData.topikMateri}` : '',
      lingkupMateri: formData.topikMateri || '',
      indikatorSoal: 'Disajikan stimulus kasus, siswa dapat menentukan solusi yang tepat.',
      levelKognitif: 'L3 (Penalaran HOTS)',
      bentukSoal: 'Pilihan Ganda',
      soalText: '',
      kunciJawaban: '',
      skor: 1,
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: BankSoalItemRow) => {
    setEditingItem(item);
    setItemInput({
      tujuanPembelajaran: item.tujuanPembelajaran,
      lingkupMateri: item.lingkupMateri,
      indikatorSoal: item.indikatorSoal,
      levelKognitif: item.levelKognitif,
      bentukSoal: item.bentukSoal,
      soalText: item.soalText,
      kunciJawaban: item.kunciJawaban,
      skor: item.skor,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // Update existing item
      setSoalRows((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? { ...it, ...itemInput }
            : it
        )
      );
    } else {
      // Add new item
      const newItem: BankSoalItemRow = {
        id: `soal-${Date.now()}`,
        no: soalRows.length + 1,
        ...itemInput,
      };
      setSoalRows((prev) => [...prev, newItem]);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus butir soal & kisi-kisi ini?')) {
      setSoalRows((prev) =>
        prev.filter((it) => it.id !== id).map((it, idx) => ({ ...it, no: idx + 1 }))
      );
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan butir soal ke paket standar rekomendasi kurikulum merdeka?')) {
      setSoalRows(isSMP ? DEFAULT_SMP_SOAL : DEFAULT_SD_SOAL);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const wsData = [
      ['KISI-KISI & NASKAH BANK SOAL HOTS KURIKULUM MERDEKA'],
      [`Mata Pelajaran: ${formData.mataPelajaran}`],
      [`Jenjang/Kelas: ${formData.faseKelas}`],
      [`Sekolah: ${formData.namaSekolah}`],
      [`Penyusun: ${formData.namaGuru}`],
      [],
      ['No', 'Tujuan Pembelajaran (TP)', 'Lingkup Materi', 'Indikator Soal', 'Bentuk Soal', 'Level Kognitif', 'Butir Soal & Stimulus', 'Kunci Jawaban / Pedoman Penskoran', 'Skor'],
      ...soalRows.map((it) => [
        it.no,
        it.tujuanPembelajaran,
        it.lingkupMateri,
        it.indikatorSoal,
        it.bentukSoal,
        it.levelKognitif,
        it.soalText,
        it.kunciJawaban,
        it.skor,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kisi-Kisi & Soal HOTS');
    XLSX.writeFile(wb, `Bank_Soal_HOTS_${formData.mataPelajaran.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  // Stats
  const countPG = soalRows.filter((it) => it.bentukSoal === 'Pilihan Ganda').length;
  const countPGKompleks = soalRows.filter((it) => it.bentukSoal === 'PG Kompleks').length;
  const countMenjodohkan = soalRows.filter((it) => it.bentukSoal === 'Menjodohkan').length;
  const countUraian = soalRows.filter((it) => it.bentukSoal === 'Uraian').length;
  const totalSkor = soalRows.reduce((acc, it) => acc + (Number(it.skor) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 font-sans">
      {/* Header Banner - Clean & Official Dinas BSKAP / ANBK without TTD block */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 border border-purple-800/40">
        <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1 text-xs text-purple-200 mb-3">
          <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Format Kisi-Kisi & Asesmen Standar ANBK / BSKAP Kemendikbudristek</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Administrasi Bank Soal & Kisi-Kisi Asesmen HOTS
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Kelola matriks kisi-kisi dan butir soal asesmen secara fleksibel: Tambah, Edit, dan Hapus butir soal (Pilihan Ganda, PG Kompleks, Menjodohkan, Uraian) atau gunakan Generator AI Sat-Set untuk memproduksi paket naskah soal lengkap dalam hitungan detik.
        </p>

        {/* Quick KPI Badges */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-purple-800/50 text-xs">
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-purple-300 block text-[10px]">Total Soal</span>
            <span className="font-bold text-base text-white">{soalRows.length} Butir</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-purple-300 block text-[10px]">Pilihan Ganda</span>
            <span className="font-bold text-base text-emerald-300">{countPG} Soal</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-purple-300 block text-[10px]">PG Kompleks</span>
            <span className="font-bold text-base text-sky-300">{countPGKompleks} Soal</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-purple-300 block text-[10px]">Menjodohkan</span>
            <span className="font-bold text-base text-amber-300">{countMenjodohkan} Soal</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs">
            <span className="text-purple-300 block text-[10px]">Uraian & Total Skor</span>
            <span className="font-bold text-base text-rose-300">{countUraian} ({totalSkor} Poin)</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {/* Banner Generator Soal Berdasarkan TP BSKAP Pusat */}
        <div className="p-4 bg-purple-50/80 border-b border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-purple-700 shrink-0" />
            <div>
              <span className="font-bold text-purple-950 block">
                ✓ Generator Bank Soal & Kisi-Kisi Berdasarkan TP Resmi BSKAP (No. 032/H/KR/2024)
              </span>
              <span className="text-[11px] text-purple-800">
                Pilih salah satu Tujuan Pembelajaran (TP) untuk menyusun naskah soal HOTS (PG, Kompleks, Menjodohkan, Uraian) & kisi-kisi instan.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={selectedTpIndex}
              onChange={(e) => setSelectedTpIndex(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white text-xs text-purple-950 font-medium max-w-[280px] truncate"
            >
              {initialKurikulum.atpList.map((tp, idx) => (
                <option key={tp.no} value={idx}>
                  TP {tp.no}: {tp.lingkupMateri || tp.elemen}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleGenerateFromOfficialTP(selectedTpIndex)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Buat Soal dari TP ⚡</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal Baru</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
              title="Unduh seluruh kisi-kisi dan butir soal ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Unduh Excel</span>
            </button>

            <button
              onClick={triggerPrint}
              className="inline-flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
              title="Cetak matriks soal ke kertas A4 / simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-rose-200" />
              <span>Cetak / PDF A4</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold px-3 py-2 rounded-lg text-xs transition-all cursor-pointer"
              title="Kembalikan butir soal ke rekomendasi kurikulum"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Rekomendasi</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari soal, materi, TP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 w-44 sm:w-56 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <select
              value={filterBentuk}
              onChange={(e) => setFilterBentuk(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="SEMUA">Semua Bentuk Soal</option>
              <option value="Pilihan Ganda">Pilihan Ganda</option>
              <option value="PG Kompleks">PG Kompleks</option>
              <option value="Menjodohkan">Menjodohkan</option>
              <option value="Uraian">Uraian</option>
            </select>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="SEMUA">Semua Level</option>
              <option value="L1">Level 1 (Pemahaman)</option>
              <option value="L2">Level 2 (Penerapan)</option>
              <option value="L3">Level 3 (Penalaran HOTS)</option>
            </select>
          </div>
        </div>

        {/* Table of Questions & Kisi-Kisi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-800 text-white font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3 w-12 text-center border-r border-slate-700">No</th>
                <th className="p-3 w-48 border-r border-slate-700">Tujuan & Lingkup Materi</th>
                <th className="p-3 w-28 text-center border-r border-slate-700">Bentuk & Level</th>
                <th className="p-3 border-r border-slate-700">Naskah Butir Soal & Stimulus</th>
                <th className="p-3 w-56 border-r border-slate-700">Kunci Jawaban & Penskoran</th>
                <th className="p-3 w-24 text-center">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <p className="font-semibold">Belum ada butir soal yang sesuai filter pencarian.</p>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-3 inline-flex items-center space-x-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Butir Soal Sekarang</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-700 border-r border-slate-200 align-top">
                      {item.no}
                    </td>

                    <td className="p-3 border-r border-slate-200 align-top">
                      <span className="font-bold text-slate-900 block mb-1">
                        {item.lingkupMateri}
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.tujuanPembelajaran}
                      </p>
                      {item.indikatorSoal && (
                        <p className="mt-1 text-[10px] text-purple-700 font-medium bg-purple-50 p-1.5 rounded border border-purple-200">
                          <strong>Indikator:</strong> {item.indikatorSoal}
                        </p>
                      )}
                    </td>

                    <td className="p-3 text-center border-r border-slate-200 align-top space-y-1.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.bentukSoal === 'Pilihan Ganda'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.bentukSoal === 'PG Kompleks'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : item.bentukSoal === 'Menjodohkan'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {item.bentukSoal}
                      </span>

                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold block ${
                          item.levelKognitif.startsWith('L3')
                            ? 'bg-purple-100 text-purple-900 font-bold'
                            : item.levelKognitif.startsWith('L2')
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.levelKognitif}
                      </span>

                      <span className="text-[10px] text-slate-500 block font-mono">
                        Bobot: {item.skor} Poin
                      </span>
                    </td>

                    <td className="p-3 border-r border-slate-200 align-top font-serif">
                      <div className="whitespace-pre-line text-slate-800 leading-relaxed text-xs">
                        {item.soalText}
                      </div>
                    </td>

                    <td className="p-3 border-r border-slate-200 align-top bg-slate-50/50">
                      <div className="text-[11px] font-mono text-emerald-900 bg-emerald-50 border border-emerald-200 p-2 rounded whitespace-pre-line leading-relaxed font-semibold">
                        {item.kunciJawaban}
                      </div>
                    </td>

                    {/* Action buttons: Edit & Hapus */}
                    <td className="p-3 text-center align-top space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-md transition-colors cursor-pointer"
                          title="Edit Butir Soal & Kisi-kisi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md transition-colors cursor-pointer"
                          title="Hapus Butir Soal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Sat-Set Generator Form Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 text-purple-900 font-bold mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold uppercase tracking-wider">
            Generator Paket Naskah Bank Soal Otomatis (AI Sat-Set)
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Ingin membuat naskah lengkap baru dari nol? Tentukan parameter materi dan jumlah soal di bawah ini, lalu klik tombol generator untuk merumuskan paket soal dinas beserta rubrik kisi-kisinya.
        </p>

        <form onSubmit={handleGenerateAI} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Topik / Lingkup Materi Ujian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.topikMateri}
                onChange={(e) => setFormData({ ...formData, topikMateri: e.target.value })}
                placeholder="Contoh: Interaksi Makhluk Hidup, Persamaan Linear, Simbol Pancasila..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-purple-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mata Pelajaran (Terkunci Sesuai Akun) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.mataPelajaran}
                onChange={(e) => {
                  const newM = e.target.value;
                  const kur = getKurikulumPusat(targetJenjang, newM, formData.faseKelas);
                  setFormData({
                    ...formData,
                    mataPelajaran: newM,
                    topikMateri: kur.daftarMateriPokok[0] || formData.topikMateri,
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:border-purple-500 focus:outline-hidden"
              >
                {allowedMapelList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="text-[10.5px] text-slate-500 mt-1">
                Fokus pada mata pelajaran khusus Anda, tidak tercampur mapel lain.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fase & Jenjang Kelas
              </label>
              <input
                type="text"
                value={formData.faseKelas}
                onChange={(e) => setFormData({ ...formData, faseKelas: e.target.value })}
                placeholder="Contoh: Fase D (Kelas 7 SMP) / Fase A (Kelas 1 SD)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-purple-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenis Asesmen
              </label>
              <select
                value={formData.jenisAsesmen}
                onChange={(e) => setFormData({ ...formData, jenisAsesmen: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:border-purple-500 focus:outline-hidden"
              >
                <option value="Sumatif Akhir Semester (SAS)">Sumatif Akhir Semester (SAS)</option>
                <option value="Sumatif Tengah Semester (STS)">Sumatif Tengah Semester (STS)</option>
                <option value="Asesmen Formatif">Asesmen Formatif (Ulangan Harian)</option>
                <option value="Simulasi ANBK HOTS">Simulasi Asesmen Nasional (ANBK) HOTS</option>
              </select>
            </div>

            {/* Komposisi Tipe Soal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jumlah PG Tunggal
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.jumlahSoalPG}
                  onChange={(e) => setFormData({ ...formData, jumlahSoalPG: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-purple-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jumlah PG Kompleks
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={formData.jumlahSoalKompleks}
                  onChange={(e) => setFormData({ ...formData, jumlahSoalKompleks: parseInt(e.target.value) || 2 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-purple-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jumlah Menjodohkan
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={formData.jumlahSoalMenjodohkan}
                  onChange={(e) => setFormData({ ...formData, jumlahSoalMenjodohkan: parseInt(e.target.value) || 2 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-purple-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jumlah Soal Uraian HOTS
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.jumlahSoalUraian}
                  onChange={(e) => setFormData({ ...formData, jumlahSoalUraian: parseInt(e.target.value) || 3 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-purple-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              ⚡ Hasil generate otomatis menyertakan stimulus studi kasus kontekstual, kunci jawaban, dan rubrik pedoman penskoran resmi tanpa tanda tangan pengesahan dinas.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-purple-700/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isLoading ? 'Menulis Bank Soal & Kisi-kisi...' : 'Buat Bank Soal HOTS Sat-Set ⚡'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal: Tambah & Edit Butir Soal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">
                  {editingItem ? 'Edit Butir Soal & Kisi-Kisi' : 'Tambah Butir Soal & Kisi-Kisi Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bentuk Soal <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={itemInput.bentukSoal}
                    onChange={(e) => setItemInput({ ...itemInput, bentukSoal: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-900"
                  >
                    <option value="Pilihan Ganda">Pilihan Ganda</option>
                    <option value="PG Kompleks">PG Kompleks</option>
                    <option value="Menjodohkan">Menjodohkan</option>
                    <option value="Uraian">Uraian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Level Kognitif <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={itemInput.levelKognitif}
                    onChange={(e) => setItemInput({ ...itemInput, levelKognitif: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-900"
                  >
                    <option value="L1 (Pemahaman)">Level 1 (Mengingat / Pemahaman C1-C2)</option>
                    <option value="L2 (Penerapan)">Level 2 (Aplikasi / Penerapan C3)</option>
                    <option value="L3 (Penalaran HOTS)">Level 3 (Penalaran / HOTS C4-C6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lingkup / Topik Materi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemInput.lingkupMateri}
                    onChange={(e) => setItemInput({ ...itemInput, lingkupMateri: e.target.value })}
                    placeholder="Contoh: Interaksi Biotik dan Abiotik"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bobot Skor Soal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={itemInput.skor}
                    onChange={(e) => setItemInput({ ...itemInput, skor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tujuan Pembelajaran (TP)
                </label>
                <input
                  type="text"
                  value={itemInput.tujuanPembelajaran}
                  onChange={(e) => setItemInput({ ...itemInput, tujuanPembelajaran: e.target.value })}
                  placeholder="Contoh: 7.1 Menganalisis interaksi antar makhluk hidup..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Indikator Soal & Stimulus
                </label>
                <input
                  type="text"
                  value={itemInput.indikatorSoal}
                  onChange={(e) => setItemInput({ ...itemInput, indikatorSoal: e.target.value })}
                  placeholder="Contoh: Disajikan teks cerita, siswa mampu..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Naskah Butir Soal & Pilihan Jawaban <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={itemInput.soalText}
                  onChange={(e) => setItemInput({ ...itemInput, soalText: e.target.value })}
                  placeholder="Tuliskan teks stimulus, pertanyaan, serta opsi jawaban (A, B, C, D)..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kunci Jawaban & Rubrik Penskoran <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={itemInput.kunciJawaban}
                  onChange={(e) => setItemInput({ ...itemInput, kunciJawaban: e.target.value })}
                  placeholder="Contoh: Kunci: B (Bintang Emas). Pembahasan: ..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono text-emerald-900 bg-emerald-50/50 leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Butir Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
