import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  GraduationCap,
  Clock,
  School,
  User,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Lightbulb,
  Building2,
  FileCheck2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Lock,
  Plus,
  Trash2,
  Edit2,
  X,
  RotateCcw,
  Printer,
} from 'lucide-react';
import { ModulParams, PresetItem, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { KURIKULUM_PRESETS } from '../data/presets';
import { triggerPrint } from '../utils/exporter';
import { getKurikulumPusat, getMataPelajaranKhususGuru } from '../data/kurikulumPusat';
import * as XLSX from 'xlsx';

export interface ModulLangkahRow {
  id: string;
  no: number;
  faseKegiatan:
    | 'A. Tahap Berkesadaran (Mindful Learning)'
    | 'B. Tahap Bermakna (Meaningful Learning)'
    | 'C. Tahap Menyenangkan (Joyful Learning)'
    | 'D. Refleksi & Integrasi Diri'
    | 'Pendahuluan'
    | 'Inti (Diferensiasi Konten)'
    | 'Inti (Diferensiasi Proses)'
    | 'Inti (Diferensiasi Produk)'
    | 'Penutup'
    | 'Asesmen Formatif';
  deskripsi: string;
  alokasiMenit: string;
  peranGuruSiswa: string;
}

const STORAGE_KEY_MODUL_LANGKAH = 'satset_modul_langkah_deep_learning_v4';

const DEFAULT_SD_LANGKAH: ModulLangkahRow[] = [
  {
    id: 'step-sd-1',
    no: 1,
    faseKegiatan: 'A. Tahap Berkesadaran (Mindful Learning)',
    deskripsi: 'Guru mengawali kelas dengan latihan kesadaran penuh (Mindful Breathing / Teknik STOP sejenak), menyapa ramah, berdoa bersama, presensi, serta apersepsi kontekstual menghubungkan materi dengan pengalaman hidup siswa.',
    alokasiMenit: '15 Menit',
    peranGuruSiswa: 'Guru menumbuhkan kesiapan emosional dan memantik rasa ingin tahu siswa melalui gambar/studi kasus kontekstual.',
  },
  {
    id: 'step-sd-2',
    no: 2,
    faseKegiatan: 'B. Tahap Bermakna (Meaningful Learning)',
    deskripsi: 'Eksplorasi konsep dan investigasi kelompok berdiferensiasi. Siswa mengorganisasikan fakta, menghubungkan konsep lama dengan konsep baru, dan menyelesaikan LKPD pemecahan masalah dengan pendampingan bertingkat (scaffolding).',
    alokasiMenit: '30 Menit',
    peranGuruSiswa: 'Siswa bergotong royong, bernalar kritis dalam penyelidikan kelompok, dan merumuskan solusi nyata.',
  },
  {
    id: 'step-sd-3',
    no: 3,
    faseKegiatan: 'C. Tahap Menyenangkan (Joyful Learning)',
    deskripsi: 'Unjuk karya kreatif kelompok (mading mini, poster, atau demonstrasi bermain peran), dilanjutkan sesi saling memberi apresiasi konstruktif antarsiswa menggunakan metode Two Stars and a Wish.',
    alokasiMenit: '15 Menit',
    peranGuruSiswa: 'Siswa saling mengapresiasi dan guru memberikan penguatan konsep ilmiah secara positif.',
  },
  {
    id: 'step-sd-4',
    no: 4,
    faseKegiatan: 'D. Refleksi & Integrasi Diri',
    deskripsi: 'Guru dan siswa menyimpulkan inti pembelajaran. Siswa mengisi kartu refleksi singkat mengenai hal paling berharga yang dipelajari dan penerapannya dalam kehidupan sehari-hari, diakhiri doa penutup.',
    alokasiMenit: '10 Menit',
    peranGuruSiswa: 'Siswa menginternalisasi hikmah pembelajaran dan berkomitmen menerapkannya di rumah/sekolah.',
  },
];

const DEFAULT_SMP_LANGKAH: ModulLangkahRow[] = [
  {
    id: 'step-smp-1',
    no: 1,
    faseKegiatan: 'A. Tahap Berkesadaran (Mindful Learning)',
    deskripsi: 'Latihan kesadaran penuh (Mindful Breathing) untuk kesiapan mental belajar, apersepsi mengaitkan fenomena sains lingkungan sekitar, penyajian video kasus pemantik, dan penyampaian tujuan pembelajaran.',
    alokasiMenit: '15 Menit',
    peranGuruSiswa: 'Guru melontarkan pertanyaan pemantik problematis dan siswa mengajukan hipotesis penyelidikan awal.',
  },
  {
    id: 'step-smp-2',
    no: 2,
    faseKegiatan: 'B. Tahap Bermakna (Meaningful Learning)',
    deskripsi: 'Eksplorasi konseptual mendalam dan investigasi kelompok berdiferensiasi (konten & proses). Siswa menelaah data, memetakan rantai transfer energi/konsep utama, dan merumuskan solusi pemecahan kasus nyata.',
    alokasiMenit: '35 Menit',
    peranGuruSiswa: 'Siswa mempraktikkan keterampilan berpikir kritis, berdialog logis, dan guru memfasilitasi scaffolding terarah.',
  },
  {
    id: 'step-smp-3',
    no: 3,
    faseKegiatan: 'C. Tahap Menyenangkan (Joyful Learning)',
    deskripsi: 'Unjuk karya/gagasan autentik kelompok (infografis mini, presentasi bagan plano interaktif), diikuti sesi saling bertukar apresiasi konstruktif metode Two Stars and a Wish.',
    alokasiMenit: '18 Menit',
    peranGuruSiswa: 'Siswa mempresentasikan temuan dengan bangga, audiens menyimak aktif, dan guru memberi klarifikasi serta apresiasi.',
  },
  {
    id: 'step-smp-4',
    no: 4,
    faseKegiatan: 'D. Refleksi & Integrasi Diri',
    deskripsi: 'Simpulan bersama inti pemahaman, pengisian kartu refleksi diri 3 butir Deep Learning (hal penting, penerapan kehidupan, rasa ingin tahu lanjut), tugas observasi mandiri, dan doa penutup.',
    alokasiMenit: '12 Menit',
    peranGuruSiswa: 'Peserta didik merefleksikan nilai karakter profil pelajar pancasila dan komitmen aksi nyata.',
  },
];

interface ModulFormProps {
  onGenerate: (params: ModulParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile?: SchoolTeacherProfile;
  onOpenProfile?: () => void;
  onSelectPresetToView?: (presetId: string) => void;
  currentUser?: UserAccount;
}

const DIMENSI_PANCASILA = [
  { id: 'Bernalar Kritis', label: 'Bernalar Kritis', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Bergotong Royong', label: 'Bergotong Royong', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Kreatif', label: 'Kreatif', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Mandiri', label: 'Mandiri', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Beriman & Bertakwa', label: 'Beriman & Bertakwa', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'Berkebinekaan Global', label: 'Berkebinekaan Global', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

const FASE_OPTIONS = [
  { value: 'Fase A (Kelas 1-2 SD)', label: 'Fase A (Kelas 1-2 SD)', jenjang: 'SD', defaultJP: '2 JP x 35 Menit (70 Menit)', defaultRombel: '28 Siswa' },
  { value: 'Fase B (Kelas 3-4 SD)', label: 'Fase B (Kelas 3-4 SD)', jenjang: 'SD', defaultJP: '2 JP x 35 Menit (70 Menit)', defaultRombel: '28 Siswa' },
  { value: 'Fase C (Kelas 5-6 SD)', label: 'Fase C (Kelas 5-6 SD)', jenjang: 'SD', defaultJP: '2 JP x 35 Menit (70 Menit)', defaultRombel: '28 Siswa' },
  { value: 'Fase D (Kelas 7 SMP)', label: 'Fase D (Kelas 7 SMP)', jenjang: 'SMP', defaultJP: '2 JP x 40 Menit (80 Menit)', defaultRombel: '32 Siswa' },
  { value: 'Fase D (Kelas 8 SMP)', label: 'Fase D (Kelas 8 SMP)', jenjang: 'SMP', defaultJP: '2 JP x 40 Menit (80 Menit)', defaultRombel: '32 Siswa' },
  { value: 'Fase D (Kelas 9 SMP)', label: 'Fase D (Kelas 9 SMP)', jenjang: 'SMP', defaultJP: '2 JP x 40 Menit (80 Menit)', defaultRombel: '32 Siswa' },
  { value: 'Fase D (Kelas 7-9 SMP)', label: 'Fase D (Kelas 7-9 SMP - Terpadu)', jenjang: 'SMP', defaultJP: '2 JP x 40 Menit (80 Menit)', defaultRombel: '32 Siswa' },
  { value: 'Fase E (Kelas 10 SMA)', label: 'Fase E (Kelas 10 SMA)', jenjang: 'SMA', defaultJP: '2 JP x 45 Menit (90 Menit)', defaultRombel: '36 Siswa' },
  { value: 'Fase F (Kelas 11-12 SMA)', label: 'Fase F (Kelas 11-12 SMA)', jenjang: 'SMA', defaultJP: '3 JP x 45 Menit (135 Menit)', defaultRombel: '36 Siswa' },
];

const MODEL_OPTIONS = [
  { value: 'Problem Based Learning (PBL)', label: 'Problem Based Learning (PBL) - Investigasi Masalah Kontekstual' },
  { value: 'Project Based Learning (PjBL)', label: 'Project Based Learning (PjBL) - Proyek Karya / Produk Nyata' },
  { value: 'Discovery Learning', label: 'Discovery Learning - Penemuan Konsep Terbimbing' },
  { value: 'Inquiry Learning', label: 'Inquiry Learning - Penyelidikan Ilmiah & Eksperimen' },
  { value: 'Teaching at The Right Level (TaRL)', label: 'Teaching at The Right Level (TaRL) - Pembelajaran Sesuai Kesiapan' },
  { value: 'Cooperative Learning', label: 'Cooperative Learning - Kerja Sama Tim Terstruktur' },
  { value: 'Contextual Teaching and Learning (CTL)', label: 'Contextual Teaching and Learning (CTL) - Pengaitan Kehidupan Riil' },
];

export const ModulForm: React.FC<ModulFormProps> = ({ 
  onGenerate, 
  isLoading, 
  schoolProfile,
  onOpenProfile,
  currentUser,
}) => {
  const isSD = currentUser?.teacherLevel === 'SD';
  const isSMP = currentUser?.teacherLevel === 'SMP';

  // Load saved teacher and school defaults from props or localStorage
  const [formData, setFormData] = useState<ModulParams>(() => {
    const initialJenjang = currentUser?.teacherLevel || schoolProfile?.jenjang || 'SD';
    const isInitSD = initialJenjang === 'SD';

    return {
      mataPelajaran: currentUser?.mataPelajaran || schoolProfile?.mataPelajaranGuru || (isInitSD ? 'Pendidikan Pancasila' : 'Ilmu Pengetahuan Alam (IPA)'),
      faseKelas: isInitSD ? 'Fase B (Kelas 3-4 SD)' : 'Fase D (Kelas 7-9 SMP)',
      jenjang: initialJenjang,
      semester: 'Ganjil',
      tahunAjaran: '2026/2027',
      pertemuanKe: 'Pertemuan ke-1',
      topikMateri: isInitSD
        ? 'Menjaga Persatuan dan Kesatuan di Lingkungan Sekolah'
        : 'Interaksi Antar Komponen Ekosistem dan Jaring-Jaring Makanan',
      alokasiWaktu: isInitSD ? '2 JP x 35 Menit (70 Menit)' : '2 JP x 40 Menit (80 Menit)',
      modelPembelajaran: 'Problem Based Learning (PBL)',
      pendekatan: 'Pendekatan Saintifik, TPACK, dan Pembelajaran Berdiferensiasi (Konten, Proses, & Produk)',
      namaGuru: currentUser?.name || schoolProfile?.namaGuru || 'Guru Pamong',
      nipGuru: currentUser?.nip || schoolProfile?.nipGuru || '-',
      namaSekolah: currentUser?.namaSekolah || schoolProfile?.namaSekolah || (isInitSD ? 'SD Negeri 1 Palasa' : 'SMP Negeri 1 Palasa'),
      npsn: currentUser?.npsn || schoolProfile?.npsn || '40201823',
      alamatSekolah: schoolProfile?.alamatSekolah || 'Jl. Pendidikan No. 1, Kecamatan Palasa',
      dinasPendidikan: schoolProfile?.dinasPendidikan || 'Dinas Pendidikan dan Kebudayaan',
      cabangDinas: schoolProfile?.cabangDinas || '',
      kepalaSekolah: schoolProfile?.kepalaSekolah || 'HADJRIN, S.Pd',
      nipKepalaSekolah: schoolProfile?.nipKepalaSekolah || '19700712 199606 1 001',
      pengawasSekolah: schoolProfile?.pengawasSekolah || 'Pengawas Pembina Kecamatan Palasa',
      nipPengawas: schoolProfile?.nipPengawas || '-',
      kotaKabupaten: schoolProfile?.kotaKabupaten || 'Parigi Moutong',
      profilPancasila: ['Bernalar Kritis', 'Bergotong Royong', 'Kreatif'],
      targetPesertaDidik: 'Peserta didik reguler/tipikal, berpencapaian tinggi, dan perlu bimbingan (berdiferensiasi)',
      jumlahSiswa: isInitSD ? '28 Peserta Didik (Rombel SD)' : '32 Peserta Didik (Rombel SMP)',
      saranaPrasarana: 'LCD Proyektor, laptop, kartu gambar organisme, LKPD, buku guru dan siswa Kemendikbudristek',
      catatanKhusus: 'Ikuti format lengkap dinas pendidikan berstandar supervisi pengawas sekolah (LKPD, rubrik KKTP, remedial & pengayaan).',
      formatDinasType: 'SUPERVISI_PENGAWAS',
    };
  });

  // Sync when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const isCurrentSD = currentUser.teacherLevel === 'SD';
      const allowed = getMataPelajaranKhususGuru(currentUser);
      const userMapel = allowed.find((m) => m === currentUser.mataPelajaran) || allowed[0] || (isCurrentSD ? 'Pendidikan Pancasila' : 'Ilmu Pengetahuan Alam (IPA)');
      const fase = currentUser.faseTerkunci || currentUser.kelasYangDiajar || (isCurrentSD ? 'Fase B (Kelas 3-4 SD)' : 'Fase D (Kelas 7-9 SMP)');
      const kurikulum = getKurikulumPusat(currentUser.teacherLevel, userMapel, fase);

      setSelectedPresetJenjang(currentUser.teacherLevel);
      setFormData((prev) => ({
        ...prev,
        jenjang: currentUser.teacherLevel,
        namaGuru: currentUser.name || prev.namaGuru,
        nipGuru: currentUser.nip || prev.nipGuru,
        namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
        npsn: currentUser.npsn || prev.npsn,
        faseKelas: fase,
        mataPelajaran: kurikulum.mataPelajaran || userMapel,
        capaianPembelajaran: kurikulum.capaianPembelajaran || prev.capaianPembelajaran,
        alokasiWaktu: isCurrentSD ? '2 JP x 35 Menit (70 Menit)' : '2 JP x 40 Menit (80 Menit)',
        jumlahSiswa: isCurrentSD ? '28 Peserta Didik (Rombel SD)' : '32 Peserta Didik (Rombel SMP)',
      }));
    }
  }, [currentUser]);

  // Sync when schoolProfile changes externally
  useEffect(() => {
    if (schoolProfile) {
      setFormData((prev) => ({
        ...prev,
        namaGuru: schoolProfile.namaGuru || prev.namaGuru,
        nipGuru: schoolProfile.nipGuru || prev.nipGuru,
        namaSekolah: schoolProfile.namaSekolah || prev.namaSekolah,
        npsn: schoolProfile.npsn || prev.npsn,
        alamatSekolah: schoolProfile.alamatSekolah || prev.alamatSekolah,
        dinasPendidikan: schoolProfile.dinasPendidikan || prev.dinasPendidikan,
        cabangDinas: schoolProfile.cabangDinas || prev.cabangDinas,
        kepalaSekolah: schoolProfile.kepalaSekolah || prev.kepalaSekolah,
        nipKepalaSekolah: schoolProfile.nipKepalaSekolah || prev.nipKepalaSekolah,
        pengawasSekolah: schoolProfile.pengawasSekolah || prev.pengawasSekolah,
        nipPengawas: schoolProfile.nipPengawas || prev.nipPengawas,
        kotaKabupaten: schoolProfile.kotaKabupaten || prev.kotaKabupaten,
      }));
    }
  }, [schoolProfile]);

  const [selectedPresetJenjang, setSelectedPresetJenjang] = useState<'SEMUA' | 'SD' | 'SMP' | 'SMA' | 'SMK'>(
    currentUser?.teacherLevel || 'SD'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Sync school and teacher defaults to localStorage whenever changed
  useEffect(() => {
    const schoolInfo = {
      namaGuru: formData.namaGuru,
      nipGuru: formData.nipGuru,
      namaSekolah: formData.namaSekolah,
      npsn: formData.npsn,
      alamatSekolah: formData.alamatSekolah,
      dinasPendidikan: formData.dinasPendidikan,
      cabangDinas: formData.cabangDinas,
      kepalaSekolah: formData.kepalaSekolah,
      nipKepalaSekolah: formData.nipKepalaSekolah,
      pengawasSekolah: formData.pengawasSekolah,
      nipPengawas: formData.nipPengawas,
      kotaKabupaten: formData.kotaKabupaten,
    };
    localStorage.setItem('satset_school_info_dinas', JSON.stringify(schoolInfo));
  }, [
    formData.namaGuru,
    formData.nipGuru,
    formData.namaSekolah,
    formData.npsn,
    formData.alamatSekolah,
    formData.dinasPendidikan,
    formData.cabangDinas,
    formData.kepalaSekolah,
    formData.nipKepalaSekolah,
    formData.pengawasSekolah,
    formData.nipPengawas,
    formData.kotaKabupaten,
  ]);

  // Loading steps animation
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleApplyPreset = (preset: PresetItem) => {
    const selectedFase = FASE_OPTIONS.find((f) => f.value === preset.faseKelas);
    setFormData((prev) => ({
      ...prev,
      mataPelajaran: preset.mataPelajaran,
      faseKelas: preset.faseKelas,
      jenjang: preset.jenjang,
      topikMateri: preset.topikMateri,
      alokasiWaktu: preset.alokasiWaktu,
      modelPembelajaran: preset.modelPembelajaran,
      profilPancasila: preset.profilPancasila,
      jumlahSiswa: selectedFase ? selectedFase.defaultRombel : prev.jumlahSiswa,
      dinasPendidikan: preset.jenjang === 'SMA' || preset.jenjang === 'SMK'
        ? 'Dinas Pendidikan Provinsi'
        : 'Dinas Pendidikan Kabupaten/Kota',
      cabangDinas: preset.jenjang === 'SMA' || preset.jenjang === 'SMK'
        ? 'Cabang Dinas Pendidikan Wilayah II'
        : '',
    }));
  };

  const handleTogglePancasila = (dimensi: string) => {
    setFormData((prev) => {
      const exists = prev.profilPancasila.includes(dimensi);
      if (exists) {
        if (prev.profilPancasila.length <= 1) return prev;
        return { ...prev, profilPancasila: prev.profilPancasila.filter((d) => d !== dimensi) };
      } else {
        return { ...prev, profilPancasila: [...prev.profilPancasila, dimensi] };
      }
    });
  };

  const handleFaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = FASE_OPTIONS.find((f) => f.value === e.target.value);
    const newJenjang = selected ? (selected.jenjang as any) : formData.jenjang;
    setFormData((prev) => ({
      ...prev,
      faseKelas: e.target.value,
      jenjang: newJenjang,
      alokasiWaktu: selected ? selected.defaultJP : prev.alokasiWaktu,
      jumlahSiswa: selected ? selected.defaultRombel : prev.jumlahSiswa,
      dinasPendidikan: newJenjang === 'SMA' || newJenjang === 'SMK'
        ? 'Dinas Pendidikan Provinsi'
        : 'Dinas Pendidikan Kabupaten/Kota',
    }));
  };

  // Dynamic CRUD rows for Langkah Kegiatan Pembelajaran & Asesmen
  const [langkahRows, setLangkahRows] = useState<ModulLangkahRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODUL_LANGKAH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return isSD ? DEFAULT_SD_LANGKAH : DEFAULT_SMP_LANGKAH;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MODUL_LANGKAH, JSON.stringify(langkahRows));
    } catch (e) {}
  }, [langkahRows]);

  const [isLangkahModalOpen, setIsLangkahModalOpen] = useState(false);
  const [editingLangkah, setEditingLangkah] = useState<ModulLangkahRow | null>(null);
  const [langkahInput, setLangkahInput] = useState<Omit<ModulLangkahRow, 'id' | 'no'>>({
    faseKegiatan: 'B. Tahap Bermakna (Meaningful Learning)',
    deskripsi: '',
    alokasiMenit: '20 Menit',
    peranGuruSiswa: '',
  });

  const handleOpenAddLangkah = () => {
    setLangkahInput({
      faseKegiatan: 'B. Tahap Bermakna (Meaningful Learning)',
      deskripsi: '',
      alokasiMenit: '15 Menit',
      peranGuruSiswa: '',
    });
    setEditingLangkah(null);
    setIsLangkahModalOpen(true);
  };

  const handleOpenEditLangkah = (row: ModulLangkahRow) => {
    setEditingLangkah(row);
    setLangkahInput({
      faseKegiatan: row.faseKegiatan,
      deskripsi: row.deskripsi,
      alokasiMenit: row.alokasiMenit,
      peranGuruSiswa: row.peranGuruSiswa,
    });
    setIsLangkahModalOpen(true);
  };

  const handleSaveLangkahModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLangkah) {
      setLangkahRows((prev) =>
        prev.map((r) => (r.id === editingLangkah.id ? { ...r, ...langkahInput } : r))
      );
    } else {
      const newRow: ModulLangkahRow = {
        id: `step-${Date.now()}`,
        no: langkahRows.length + 1,
        ...langkahInput,
      };
      setLangkahRows((prev) => [...prev, newRow]);
    }
    setIsLangkahModalOpen(false);
    setEditingLangkah(null);
  };

  const handleDeleteLangkah = (id: string) => {
    if (confirm('Hapus langkah kegiatan pembelajaran ini?')) {
      setLangkahRows((prev) =>
        prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, no: idx + 1 }))
      );
    }
  };

  const handleResetLangkahDefaults = () => {
    if (confirm('Kembalikan langkah pembelajaran ke susunan standar kurikulum?')) {
      setLangkahRows(isSD ? DEFAULT_SD_LANGKAH : DEFAULT_SMP_LANGKAH);
    }
  };

  const handleExportLangkahExcel = () => {
    const wsData = [
      ['RANCANGAN LANGKAH PEMBELAJARAN BERDIFERENSIASI KURIKULUM MERDEKA'],
      [`Mata Pelajaran: ${formData.mataPelajaran}`],
      [`Topik/Materi: ${formData.topikMateri}`],
      [`Jenjang/Fase: ${formData.faseKelas}`],
      [`Guru: ${formData.namaGuru}`],
      [],
      ['No', 'Fase Kegiatan', 'Alokasi Waktu', 'Deskripsi Sintaks Pembelajaran Berdiferensiasi', 'Peran Guru & Respon Siswa'],
      ...langkahRows.map((r) => [
        r.no,
        r.faseKegiatan,
        r.alokasiMenit,
        r.deskripsi,
        r.peranGuruSiswa,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Langkah KBM');
    XLSX.writeFile(wb, `Langkah_KBM_${formData.mataPelajaran.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topikMateri.trim()) {
      alert('Silakan masukkan Topik / Materi Pokok pembelajaran terlebih dahulu.');
      return;
    }
    const stepsSummary = langkahRows.map((r) => `[${r.faseKegiatan} - ${r.alokasiMenit}]: ${r.deskripsi}`).join(' \n');
    const enrichedParams = {
      ...formData,
      catatanKhusus: formData.catatanKhusus
        ? `${formData.catatanKhusus}\n\nInstruksi Rincian Langkah KBM Disusun Guru:\n${stepsSummary}`
        : `Instruksi Rincian Langkah KBM Disusun Guru:\n${stepsSummary}`,
    };
    onGenerate(enrichedParams);
  };

  const loadingMessages = [
    'Menyusun Lembar Identitas Resmi Administrasi Dinas & Pengetahuan Prasyarat...',
    'Menetapkan Capaian Pembelajaran (CP), ATP, TP rumus ABCD & Pertanyaan Pemantik...',
    'Merancang Sintaks Pembelajaran Berdiferensiasi (Konten, Proses, Produk) & Integrasi 4C...',
    'Menyusun Asesmen Diagnostik, Formatif, Sumatif & Tabel Rubrik KKTP Supervisi...',
    'Menyiapkan Lampiran Berkas Dinas: LKPD Siap Pakai, Kisi-kisi Soal, Bahan Bacaan, & Pengesahan...',
  ];

  const filteredPresets = KURIKULUM_PRESETS.filter((p) => {
    if (currentUser?.teacherLevel === 'SD') {
      // Guru SD: Kunci hanya di SD dan hanya fase yang diajar!
      if (p.jenjang !== 'SD') return false;
      const targetFase = currentUser?.faseTerkunci || '';
      if (targetFase.includes('Fase A')) return p.faseKelas.includes('Fase A');
      if (targetFase.includes('Fase B')) return p.faseKelas.includes('Fase B');
      if (targetFase.includes('Fase C')) return p.faseKelas.includes('Fase C');
      return true;
    }
    if (currentUser?.teacherLevel === 'SMP') {
      // Guru SMP: Berikan akses ke seluruh materi jenjang SMP!
      return p.jenjang === 'SMP';
    }
    if (selectedPresetJenjang === 'SEMUA') return true;
    return p.jenjang === selectedPresetJenjang;
  });

  const availableFaseOptions = FASE_OPTIONS.filter((fase) => {
    if (currentUser?.teacherLevel === 'SD') {
      // Guru SD: KUNCI KHUSUS pada fase yang dipilih saat mendaftar!
      const targetFase = currentUser?.faseTerkunci || '';
      if (targetFase.includes('Fase A')) return fase.value.includes('Fase A');
      if (targetFase.includes('Fase B')) return fase.value.includes('Fase B');
      if (targetFase.includes('Fase C')) return fase.value.includes('Fase C');
      return fase.jenjang === 'SD';
    }
    if (currentUser?.teacherLevel === 'SMP') {
      // Guru SMP: BERIKAN AKSES KE SEMUA KELAS / FASE DI JENJANG SMP (Fase D 7, 8, 9)!
      return fase.jenjang === 'SMP';
    }
    return true;
  });

  const quickMapelSuggestions = getMataPelajaranKhususGuru(currentUser);
  const currentKurikulum = getKurikulumPusat(
    (currentUser?.teacherLevel || formData.jenjang || 'SD') as 'SD' | 'SMP',
    formData.mataPelajaran,
    formData.faseKelas
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Hero Banner Dinas */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/30 rounded-full px-3 py-1 text-xs text-sky-200 mb-3">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Format Resmi Dinas Pendidikan & Supervisi Pengawas Sekolah (SD, SMP, SMA, SMK)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Penyusun Modul Ajar & RPP <span className="text-sky-300">Format Resmi Dinas</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Menghasilkan dokumen perangkat ajar Kurikulum Merdeka super lengkap sesuai standar audit supervisi pengawas: Lembar Identitas Dinas, TP ABCD, Sintaks Berdiferensiasi 4C, Program Remedial/Pengayaan, LKPD siap cetak, hingga Lembar Pengesahan 3 Pihak.
          </p>

          {/* Quick Badges Dinas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standar Supervisi Pengawas</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Diferensiasi & 4C Lengkap</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Remedial, Pengayaan & Rubrik</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kop Dinas & Pengesahan 3 Pihak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profil Sekolah, Kepsek & Guru Aktif Card */}
      <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-50/60 via-white to-indigo-50/50">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
                Data Satuan Pendidikan, Kepala Sekolah & Guru Pengampu
              </span>
              <span className="text-[10px] bg-sky-200/80 text-sky-900 font-bold px-2 py-0.5 rounded">
                Terintegrasi ke Kop Surat & Pengesahan
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {formData.namaSekolah || 'Satuan Pendidikan'} • NPSN: {formData.npsn || '-'} • {formData.kotaKabupaten || '-'}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Kepsek: <span className="font-semibold text-slate-900">{formData.kepalaSekolah || '-'}</span> | Guru: <span className="font-semibold text-slate-900">{formData.namaGuru || '-'}</span> | Pengawas: <span className="font-semibold text-slate-900">{formData.pengawasSekolah || '-'}</span>
            </p>
          </div>
        </div>

        {onOpenProfile && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Kelola Data Sekolah & Kepsek</span>
          </button>
        )}
      </div>

      {/* Preset Section: Sat-Set 1-Klik */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Template Cepat Standar Dinas (SD, SMP, SMA, SMK)
            </h2>
          </div>

          {/* Filter Jenjang - Locked per Teacher Level */}
          {currentUser?.teacherLevel === 'SD' ? (
            <div className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Terkunci: Guru SD ({currentUser?.faseTerkunci || 'Fase Terpilih'})</span>
            </div>
          ) : currentUser?.teacherLevel === 'SMP' ? (
            <div className="flex items-center space-x-1.5 bg-indigo-100 text-indigo-900 border border-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
              <span>Akses Penuh: Guru SMP (Fase D - Semua Kelas 7, 8, 9)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {(['SEMUA', 'SD', 'SMP', 'SMA', 'SMK'] as const).map((jenjang) => (
                <button
                  key={jenjang}
                  type="button"
                  onClick={() => setSelectedPresetJenjang(jenjang)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedPresetJenjang === jenjang
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {jenjang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preset Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3.5">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-sky-100 group-hover:text-sky-800">
                  {preset.jenjang}
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-sky-600 font-medium">Pakai Template</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1.5 group-hover:text-sky-900 line-clamp-1">
                {preset.label}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {preset.deskripsi}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Generator Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Formulir Administrasi Modul Ajar / RPP Format Dinas
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Sesuai Permendikbudristek 2024/2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topik / Materi Pokok (Full width) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topik / Materi Pokok Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.topikMateri}
              onChange={(e) => setFormData({ ...formData, topikMateri: e.target.value })}
              placeholder="Contoh: Interaksi Antar Komponen Ekosistem, Hukum Gerak Newton, Persamaan Linear, Teks Eksplanasi..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
            />
            {/* Quick Central Topic Chips */}
            {currentKurikulum.daftarMateriPokok && currentKurikulum.daftarMateriPokok.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Materi Resmi BSKAP ({formData.mataPelajaran}):
                </span>
                {currentKurikulum.daftarMateriPokok.map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => {
                      const matchedAtp = currentKurikulum.atpList.find(
                        (a) => a.lingkupMateri.includes(tp) || tp.includes(a.lingkupMateri)
                      ) || currentKurikulum.atpList[0];

                      setFormData({
                        ...formData,
                        topikMateri: tp,
                        tujuanPembelajaran: matchedAtp ? matchedAtp.tujuanPembelajaran : formData.tujuanPembelajaran,
                        capaianPembelajaran: currentKurikulum.capaianPembelajaran || formData.capaianPembelajaran,
                      });
                    }}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      formData.topikMateri === tp
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Pilih salah satu materi resmi di atas untuk otomatis mengisi TP dan CP dari surat edaran pusat.</span>
            </p>
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mata Pelajaran (Terkunci Sesuai Akun) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.mataPelajaran}
              onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
              placeholder={isSD ? "Contoh: Pendidikan Pancasila, IPAS, Bahasa Indonesia..." : "Contoh: IPA, Matematika, Bahasa Inggris, Informatika..."}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900"
            />
            {/* Quick Mapel Recommendation Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">
                Pilihan Mapel Khusus Anda:
              </span>
              {quickMapelSuggestions.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    const k = getKurikulumPusat(
                      (currentUser?.teacherLevel || formData.jenjang || 'SD') as 'SD' | 'SMP',
                      m,
                      formData.faseKelas
                    );
                    setFormData({
                      ...formData,
                      mataPelajaran: m,
                      capaianPembelajaran: k.capaianPembelajaran || formData.capaianPembelajaran,
                    });
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                    formData.mataPelajaran === m
                      ? 'bg-sky-100 text-sky-800 border-sky-300 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Fase & Jenjang Kelas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Fase & Jenjang Kelas <span className="text-rose-500">*</span>
              </label>
              {currentUser?.teacherLevel && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                  isSD ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  Terkunci: Guru {currentUser.teacherLevel}
                </span>
              )}
            </div>
            <select
              value={formData.faseKelas}
              onChange={handleFaseChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 bg-white"
            >
              {availableFaseOptions.map((fase) => (
                <option key={fase.value} value={fase.value}>
                  {fase.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester & Tahun Ajaran */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 text-sm text-slate-900 bg-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                placeholder="2026/2027"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Pertemuan & Alokasi Waktu */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pertemuan Ke-
              </label>
              <input
                type="text"
                value={formData.pertemuanKe}
                onChange={(e) => setFormData({ ...formData, pertemuanKe: e.target.value })}
                placeholder="Pertemuan ke-1"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alokasi Waktu (JP)
              </label>
              <input
                type="text"
                value={formData.alokasiWaktu}
                onChange={(e) => setFormData({ ...formData, alokasiWaktu: e.target.value })}
                placeholder="2 JP x 40 Menit"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Model Pembelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Model Pembelajaran Resmi Dinas <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.modelPembelajaran}
              onChange={(e) => setFormData({ ...formData, modelPembelajaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 bg-white"
            >
              {MODEL_OPTIONS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah Peserta Didik */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jumlah Peserta Didik (Rombel)
            </label>
            <input
              type="text"
              value={formData.jumlahSiswa}
              onChange={(e) => setFormData({ ...formData, jumlahSiswa: e.target.value })}
              placeholder="32 Peserta Didik (Rombel Reguler)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 text-sm text-slate-900"
            />
          </div>

          {/* Dimensi Profil Pelajar Pancasila (Full width) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dimensi Profil Pelajar Pancasila (Wajib Disertai Elemen & Subelemen)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DIMENSI_PANCASILA.map((dimensi) => {
                const isSelected = formData.profilPancasila.includes(dimensi.id);
                return (
                  <button
                    key={dimensi.id}
                    type="button"
                    onClick={() => handleTogglePancasila(dimensi.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${dimensi.color} border-current shadow-xs`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span>{dimensi.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Collapsible Formal School & Dinas Information */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-700 uppercase tracking-wider hover:text-sky-700 transition-colors py-2 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Identitas Resmi Dinas Pendidikan, Sekolah, Kepala Sekolah & Pengawas Pembina</span>
            </div>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Satuan Pendidikan / Sekolah
                </label>
                <input
                  type="text"
                  value={formData.namaSekolah}
                  onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                  placeholder="Contoh: SMP Negeri 1 Nusantara / SMAN 3 Jakarta"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  NPSN Sekolah
                </label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  placeholder="Contoh: 20101234"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Instansi Dinas Pendidikan Pembina
                </label>
                <input
                  type="text"
                  value={formData.dinasPendidikan}
                  onChange={(e) => setFormData({ ...formData, dinasPendidikan: e.target.value })}
                  placeholder="Contoh: Dinas Pendidikan dan Kebudayaan / Dinas Pendidikan Provinsi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cabang Dinas Pendidikan (Khusus SMA/SMK)
                </label>
                <input
                  type="text"
                  value={formData.cabangDinas}
                  onChange={(e) => setFormData({ ...formData, cabangDinas: e.target.value })}
                  placeholder="Contoh: Cabang Dinas Pendidikan Wilayah II (Kosongkan bila SD/SMP)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Alamat Lengkap Satuan Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.alamatSekolah}
                  onChange={(e) => setFormData({ ...formData, alamatSekolah: e.target.value })}
                  placeholder="Contoh: Jl. Pendidikan No. 45, Kecamatan Gambir"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kota / Kabupaten
                </label>
                <input
                  type="text"
                  value={formData.kotaKabupaten}
                  onChange={(e) => setFormData({ ...formData, kotaKabupaten: e.target.value })}
                  placeholder="Contoh: Jakarta / Bandung / Surabaya"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Guru Pengampu (Lengkap dengan Gelar)
                </label>
                <input
                  type="text"
                  value={formData.namaGuru}
                  onChange={(e) => setFormData({ ...formData, namaGuru: e.target.value })}
                  placeholder="Contoh: Fadli R., S.Pd., Gr."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  NIP Guru Pengampu
                </label>
                <input
                  type="text"
                  value={formData.nipGuru}
                  onChange={(e) => setFormData({ ...formData, nipGuru: e.target.value })}
                  placeholder="Contoh: 19900101 202012 1 001"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Kepala Satuan Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.kepalaSekolah}
                  onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                  placeholder="Contoh: Dr. H. Sulaiman, M.Pd."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  NIP Kepala Satuan Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                  placeholder="Contoh: 19750512 200003 1 004"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Pengawas Pembina Dinas Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.pengawasSekolah}
                  onChange={(e) => setFormData({ ...formData, pengawasSekolah: e.target.value })}
                  placeholder="Contoh: Dr. H. Subagyo, M.Pd."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  NIP Pengawas Pembina
                </label>
                <input
                  type="text"
                  value={formData.nipPengawas}
                  onChange={(e) => setFormData({ ...formData, nipPengawas: e.target.value })}
                  placeholder="Contoh: 19680315 199503 1 002"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Catatan / Instruksi Khusus Supervisi
                </label>
                <textarea
                  rows={2}
                  value={formData.catatanKhusus}
                  onChange={(e) => setFormData({ ...formData, catatanKhusus: e.target.value })}
                  placeholder="Contoh: Lengkapi kisi-kisi instrumen asesmen HOTS, buat tabel remedial dan pengayaan resmi, perjelas diferensiasi untuk siswa lambat belajar..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Interactive Table: Langkah Kegiatan Pembelajaran Berdiferensiasi (CRUD) */}
        <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 mt-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center space-x-2 text-indigo-900 font-bold">
                <Layers className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Rancangan Langkah Kegiatan Pembelajaran & Asesmen (Interaktif)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Susun atau sesuaikan langkah KBM: Tambah, Edit, dan Hapus kegiatan sebelum dokumen dinas digenerate.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddLangkah}
                className="inline-flex items-center space-x-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Langkah</span>
              </button>

              <button
                type="button"
                onClick={handleExportLangkahExcel}
                className="inline-flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                title="Unduh langkah KBM ke Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>Excel</span>
              </button>

              <button
                type="button"
                onClick={triggerPrint}
                className="inline-flex items-center space-x-1 bg-rose-700 hover:bg-rose-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                title="Cetak A4 / PDF"
              >
                <Printer className="w-3.5 h-3.5 text-rose-200" />
                <span>Cetak</span>
              </button>

              <button
                type="button"
                onClick={handleResetLangkahDefaults}
                className="inline-flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-semibold px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                title="Kembalikan ke susunan standar"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-800 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5 w-10 text-center border-r border-slate-700">No</th>
                  <th className="p-2.5 w-44 border-r border-slate-700">Fase Kegiatan & Alokasi</th>
                  <th className="p-2.5 border-r border-slate-700">Deskripsi Sintaks Pembelajaran Berdiferensiasi</th>
                  <th className="p-2.5 w-52 border-r border-slate-700">Peran Guru & Respon Siswa</th>
                  <th className="p-2.5 w-20 text-center">Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {langkahRows.map((row) => (
                  <tr key={row.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200 align-top">
                      {row.no}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-1 ${
                          row.faseKegiatan.includes('Pendahuluan')
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : row.faseKegiatan.includes('Konten')
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : row.faseKegiatan.includes('Proses')
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : row.faseKegiatan.includes('Produk')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-purple-50 text-purple-800 border-purple-300'
                        }`}
                      >
                        {row.faseKegiatan}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 font-bold">
                        ⏱️ {row.alokasiMenit}
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 align-top text-slate-800 leading-relaxed text-xs">
                      {row.deskripsi}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 align-top text-slate-600 text-[11px] leading-relaxed bg-slate-50/40">
                      {row.peranGuruSiswa}
                    </td>
                    <td className="p-2.5 text-center align-top">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditLangkah(row)}
                          className="p-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded transition-colors cursor-pointer"
                          title="Edit Langkah KBM"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLangkah(row.id)}
                          className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded transition-colors cursor-pointer"
                          title="Hapus Langkah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add/Edit Langkah KBM */}
        {isLangkahModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-gradient-to-r from-sky-800 to-indigo-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Edit2 className="w-4 h-4 text-amber-300" />
                  <h3 className="font-bold text-sm">
                    {editingLangkah ? 'Edit Langkah Kegiatan KBM' : 'Tambah Langkah Kegiatan KBM Baru'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLangkahModalOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fase Kegiatan
                    </label>
                    <select
                      value={langkahInput.faseKegiatan}
                      onChange={(e) => setLangkahInput({ ...langkahInput, faseKegiatan: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-900"
                    >
                      <option value="A. Tahap Berkesadaran (Mindful Learning)">A. Tahap Berkesadaran (Mindful Learning)</option>
                      <option value="B. Tahap Bermakna (Meaningful Learning)">B. Tahap Bermakna (Meaningful Learning)</option>
                      <option value="C. Tahap Menyenangkan (Joyful Learning)">C. Tahap Menyenangkan (Joyful Learning)</option>
                      <option value="D. Refleksi & Integrasi Diri">D. Refleksi & Integrasi Diri</option>
                      <option value="Pendahuluan">Pendahuluan (Orientasi & Apersepsi)</option>
                      <option value="Inti (Diferensiasi Konten)">Inti (Diferensiasi Konten)</option>
                      <option value="Inti (Diferensiasi Proses)">Inti (Diferensiasi Proses)</option>
                      <option value="Inti (Diferensiasi Produk)">Inti (Diferensiasi Produk)</option>
                      <option value="Penutup">Penutup & Tindak Lanjut</option>
                      <option value="Asesmen Formatif">Asesmen Formatif Berjalan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alokasi Waktu
                    </label>
                    <input
                      type="text"
                      value={langkahInput.alokasiMenit}
                      onChange={(e) => setLangkahInput({ ...langkahInput, alokasiMenit: e.target.value })}
                      placeholder="Contoh: 15 Menit"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Kegiatan Pembelajaran <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={langkahInput.deskripsi}
                    onChange={(e) => setLangkahInput({ ...langkahInput, deskripsi: e.target.value })}
                    placeholder="Uraikan sintaks pembelajaran dan aktivitas siswa..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peran Guru & Respon Siswa
                  </label>
                  <input
                    type="text"
                    value={langkahInput.peranGuruSiswa}
                    onChange={(e) => setLangkahInput({ ...langkahInput, peranGuruSiswa: e.target.value })}
                    placeholder="Contoh: Guru memfasilitasi scaffolding dan siswa berdiskusi aktif..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsLangkahModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLangkahModal}
                    className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {editingLangkah ? 'Simpan' : 'Tambahkan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button & Progress Indicator */}
        <div className="mt-8">
          {isLoading ? (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 text-center">
              <div className="inline-flex items-center space-x-2 text-sky-800 font-bold text-sm mb-2">
                <Building2 className="w-5 h-5 text-amber-500 animate-bounce" />
                <span>Konsultan Dinas Sedang Merancang Modul Ajar Standar Resmi...</span>
              </div>
              <p className="text-xs text-sky-600 animate-pulse font-medium">
                {loadingMessages[loadingStep] || loadingMessages[0]}
              </p>
              <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden mt-3 max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-700 ease-out"
                  style={{ width: `${((loadingStep + 1) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Dokumen mengikuti struktur supervisi Pengawas Sekolah resmi Kemendikbudristek (SD s/d SMA/SMK).
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-sky-600/25 hover:shadow-sky-600/40 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>Susun RPP Format Dinas Sat-Set ⚡</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
