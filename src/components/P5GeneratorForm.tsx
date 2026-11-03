import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  Check,
  Plus,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  Clock,
  Building2,
} from 'lucide-react';
import { P5Params, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import * as XLSX from 'xlsx';

export interface P5AktivitasRow {
  id: string;
  no: number;
  tahap: 'Pengenalan' | 'Kontekstualisasi' | 'Aksi' | 'Refleksi' | 'Tindak Lanjut';
  namaAktivitas: string;
  alokasiJP: string;
  kegiatanPesertaDidik: string;
  outputHasil: string;
}

interface P5GeneratorFormProps {
  onGenerate: (params: P5Params) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

const STORAGE_KEY_P5_AKTIVITAS = 'satset_p5_items_v3';

const TEMA_P5_OPTIONS = [
  { id: 'Gaya Hidup Berkelanjutan', title: 'Gaya Hidup Berkelanjutan', desc: 'Pengelolaan sampah, hemat energi, jejak karbon, reboisasi' },
  { id: 'Kearifan Lokal', title: 'Kearifan Lokal', desc: 'Eksplorasi budaya, kuliner tradisional, seni daerah, kearifan nenek moyang' },
  { id: 'Bhinneka Tunggal Ika', title: 'Bhinneka Tunggal Ika', desc: 'Membangun toleransi, anti-perundungan (bullying), dialog lintas budaya' },
  { id: 'Bangunlah Jiwa dan Raganya', title: 'Bangunlah Jiwa dan Raganya', desc: 'Kesehatan mental, kebugaran fisik, pencegahan narkoba & pergaulan bebas' },
  { id: 'Suara Demokrasi', title: 'Suara Demokrasi', desc: 'Pemilihan ketua OSIS, musyawarah kelas, kebebasan berekspresi santun' },
  { id: 'Rekayasa dan Teknologi', title: 'Rekayasa dan Teknologi', desc: 'Robotika sederhana, teknologi tepat guna, purwarupa alat ramah lingkungan' },
  { id: 'Kewirausahaan', title: 'Kewirausahaan', desc: 'Bisnis olahan pangan lokal, kerajinan tangan bernilai jual, festival bazar' },
  { id: 'Kebekerjaan (Khusus SMK)', title: 'Kebekerjaan (Khusus SMK)', desc: 'Budaya kerja industri, K3LH, persiapan portofolio dan wawancara kerja' },
];

const DIMENSI_PANCASILA = [
  'Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia',
  'Berkebinekaan Global',
  'Bergotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif',
];

const NILAI_PPRA_KEMENAG = [
  'Berkeadaban (Ta’addub)',
  'Keteladanan (Qudwah)',
  'Kewarganegaraan & Kebangsaan (Muwathanah)',
  'Mengambil Jalan Tengah (Tawassuth)',
  'Berimbang (Tawazun)',
  'Lurus dan Tegas (I’tidal)',
  'Kesetaraan (Musawah)',
  'Musyawarah (Syura)',
  'Toleransi (Tasamuh)',
  'Dinamis dan Inovatif (Tathawwur wa Ibtikar)',
];

const DEFAULT_SD_P5: P5AktivitasRow[] = [
  {
    id: 'p5-sd-1',
    no: 1,
    tahap: 'Pengenalan',
    namaAktivitas: 'Eksplorasi Jenis Sampah di Lingkungan Sekolah',
    alokasiJP: '4 JP',
    kegiatanPesertaDidik: 'Mengamati tempat sampah di sekitar kelas dan kantin, mendengarkan dongeng tentang menjaga bumi.',
    outputHasil: 'Lembar observasi gambar jenis sampah organik dan anorganik.',
  },
  {
    id: 'p5-sd-2',
    no: 2,
    tahap: 'Kontekstualisasi',
    namaAktivitas: 'Wawancara Petugas Kebersihan & Pilah Sampah Nyata',
    alokasiJP: '6 JP',
    kegiatanPesertaDidik: 'Berdialog sederhana dengan petugas sekolah tentang sampah plastik yang menumpuk.',
    outputHasil: 'Tabel catatan sampah terbanyak di sekolah.',
  },
  {
    id: 'p5-sd-3',
    no: 3,
    tahap: 'Aksi',
    namaAktivitas: 'Membuat Kerajinan Pot Tanaman dari Botol Bekas',
    alokasiJP: '16 JP',
    kegiatanPesertaDidik: 'Menghias botol bekas menjadi pot bunga karakter hewan lucu bersama kelompok.',
    outputHasil: 'Karya pot bunga daur ulang siap tanam untuk taman kelas.',
  },
  {
    id: 'p5-sd-4',
    no: 4,
    tahap: 'Refleksi',
    namaAktivitas: 'Festival Gelar Karya dan Cerita Bintang Inspirasi',
    alokasiJP: '8 JP',
    kegiatanPesertaDidik: 'Mempresentasikan pot hasil karya kepada teman sekelas dan orang tua murid.',
    outputHasil: 'Refleksi diri emotikon senang dan bangga menjaga lingkungan.',
  },
  {
    id: 'p5-sd-5',
    no: 5,
    tahap: 'Tindak Lanjut',
    namaAktivitas: 'Pembiasaan Gerakan Membawa Tumbler dan Kotak Bekal',
    alokasiJP: '6 JP',
    kegiatanPesertaDidik: 'Menandatangani kesepakatan kelas bebas plastik sekali pakai.',
    outputHasil: 'Poster janji menjaga kebersihan sekolah.',
  },
];

const DEFAULT_SMP_P5: P5AktivitasRow[] = [
  {
    id: 'p5-smp-1',
    no: 1,
    tahap: 'Pengenalan',
    namaAktivitas: 'Riset Literatur Krisis Lingkungan dan Jejak Karbon',
    alokasiJP: '6 JP',
    kegiatanPesertaDidik: 'Menonton video dokumenter pencemaran limbah plastik dan efek rumah kaca di Indonesia.',
    outputHasil: 'Resume infografis bahaya mikroplastik bagi kesehatan.',
  },
  {
    id: 'p5-smp-2',
    no: 2,
    tahap: 'Kontekstualisasi',
    namaAktivitas: 'Audit Sampah Organik Kantin & Perumusan Hipotesis Kompos',
    alokasiJP: '8 JP',
    kegiatanPesertaDidik: 'Mengukur timbulan sisa makanan harian kantin dan merancang formula bio-fermentasi EM4.',
    outputHasil: 'Proposal mini proyek pembuatan Pupuk Organik Cair (POC).',
  },
  {
    id: 'p5-smp-3',
    no: 3,
    tahap: 'Aksi',
    namaAktivitas: 'Fabrikasi Reaktor Kompos Takakura & Pengemasan Pupuk',
    alokasiJP: '18 JP',
    kegiatanPesertaDidik: 'Merakit wadah komposter, mencampurkan dedaunan kering dan mikroba, memanen pupuk organik.',
    outputHasil: 'Produk pupuk cair organik siap pakai dengan label merk tim siswa.',
  },
  {
    id: 'p5-smp-4',
    no: 4,
    tahap: 'Refleksi',
    namaAktivitas: 'Expo Inovasi Ramah Lingkungan & Uji Publik Efektivitas Kompos',
    alokasiJP: '6 JP',
    kegiatanPesertaDidik: 'Mendemonstrasikan hasil uji tumbuh tanaman yang diberi pupuk pada ajang expo sekolah.',
    outputHasil: 'Laporan rubrik asesmen sumatif profil pelajar pancasila.',
  },
  {
    id: 'p5-smp-5',
    no: 5,
    tahap: 'Tindak Lanjut',
    namaAktivitas: 'Pemberdayaan Bank Sampah Sekolah Berkelanjutan',
    alokasiJP: '4 JP',
    kegiatanPesertaDidik: 'Membentuk divisi pengurus kompos rutin bekerjasama dengan OSIS.',
    outputHasil: 'SOP pengomposan mandiri di lingkungan sekolah.',
  },
];

export const P5GeneratorForm: React.FC<P5GeneratorFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
  currentUser,
}) => {
  const isSMP = currentUser?.teacherLevel === 'SMP' || schoolProfile.jenjang === 'SMP';

  const [formData, setFormData] = useState<P5Params>({
    temaP5: 'Gaya Hidup Berkelanjutan',
    subTemaJudul: isSMP
      ? 'Sampahku Tanggung Jawabku: Inovasi Daur Ulang dan Pembuatan Kompos Organik'
      : 'Bumi Hijau Sekolahku: Memilah Sampah dan Berkreasi dari Botol Bekas',
    jenjang: (currentUser?.teacherLevel || schoolProfile.jenjang || (isSMP ? 'SMP' : 'SD')) as any,
    fase: currentUser?.faseTerkunci || currentUser?.kelasYangDiajar || schoolProfile.faseKelasDiampu || (isSMP ? 'Fase D (SMP)' : 'Fase A (SD)'),
    alokasiWaktuProjek: isSMP ? '40 JP (Sistem Blok 2 Minggu)' : '32 JP (Sistem Reguler Mingguan)',
    dimensiSasaran: ['Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia', 'Bergotong Royong', 'Kreatif'],
    isMadrasahPPRA: false,
    nilaiPPRA: ['Berkeadaban (Ta’addub)', 'Dinamis dan Inovatif (Tathawwur wa Ibtikar)'],
    targetHasilKarya: isSMP
      ? 'Pupuk Organik Cair (POC), reaktor komposter sederhana, dan Expo Pameran Karya Siswa'
      : 'Pot tanaman hias karakter hewan dari botol plastik dan sudut taman hijau kelas',
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || 'SD NEGERI 4 PALASA',
    namaGuruKoordinator: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '196608151986062001',
    kepalaSekolah: schoolProfile.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah || '19700712 199606 1 001',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kab. Parigi Moutong',
  });

  // Table items state
  const [aktivitasRows, setAktivitasRows] = useState<P5AktivitasRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_P5_AKTIVITAS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return isSMP ? DEFAULT_SMP_P5 : DEFAULT_SD_P5;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_P5_AKTIVITAS, JSON.stringify(aktivitasRows));
    } catch (e) {}
  }, [aktivitasRows]);

  // Modal / Form state for Add/Edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<P5AktivitasRow | null>(null);

  const [inputRow, setInputRow] = useState<Omit<P5AktivitasRow, 'id' | 'no'>>({
    tahap: 'Pengenalan',
    namaAktivitas: '',
    alokasiJP: '4 JP',
    kegiatanPesertaDidik: '',
    outputHasil: '',
  });

  const handleOpenAdd = () => {
    setInputRow({
      tahap: 'Aksi',
      namaAktivitas: '',
      alokasiJP: '6 JP',
      kegiatanPesertaDidik: '',
      outputHasil: '',
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (row: P5AktivitasRow) => {
    setEditingItem(row);
    setInputRow({
      tahap: row.tahap,
      namaAktivitas: row.namaAktivitas,
      alokasiJP: row.alokasiJP,
      kegiatanPesertaDidik: row.kegiatanPesertaDidik,
      outputHasil: row.outputHasil,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setAktivitasRows((prev) =>
        prev.map((r) => (r.id === editingItem.id ? { ...r, ...inputRow } : r))
      );
    } else {
      const newRow: P5AktivitasRow = {
        id: `p5-${Date.now()}`,
        no: aktivitasRows.length + 1,
        ...inputRow,
      };
      setAktivitasRows((prev) => [...prev, newRow]);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteRow = (id: string) => {
    if (confirm('Hapus aktivitas tahapan projek ini?')) {
      setAktivitasRows((prev) =>
        prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, no: idx + 1 }))
      );
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan tahapan projek ke rekomendasi standar kurikulum?')) {
      setAktivitasRows(isSMP ? DEFAULT_SMP_P5 : DEFAULT_SD_P5);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const wsData = [
      ['ALUR TAHAPAN & AKTIVITAS PROJEK P5 KURIKULUM MERDEKA'],
      [`Tema Projek: ${formData.temaP5}`],
      [`Judul Projek: ${formData.subTemaJudul}`],
      [`Jenjang/Fase: ${formData.fase}`],
      [`Sekolah: ${formData.namaSekolah}`],
      [`Koordinator: ${formData.namaGuruKoordinator}`],
      [],
      ['No', 'Tahapan Projek', 'Nama Aktivitas', 'Alokasi JP', 'Uraian Kegiatan Peserta Didik', 'Output / Hasil Karya'],
      ...aktivitasRows.map((r) => [
        r.no,
        r.tahap,
        r.namaAktivitas,
        r.alokasiJP,
        r.kegiatanPesertaDidik,
        r.outputHasil,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Aktivitas Projek P5');
    XLSX.writeFile(wb, `Modul_P5_${formData.temaP5.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleToggleDimensi = (dimensi: string) => {
    setFormData((prev) => {
      const exists = prev.dimensiSasaran.includes(dimensi);
      if (exists) {
        if (prev.dimensiSasaran.length <= 1) return prev;
        return { ...prev, dimensiSasaran: prev.dimensiSasaran.filter((d) => d !== dimensi) };
      } else {
        return { ...prev, dimensiSasaran: [...prev.dimensiSasaran, dimensi] };
      }
    });
  };

  const handleTogglePPRA = (nilai: string) => {
    setFormData((prev) => {
      const current = prev.nilaiPPRA || [];
      const exists = current.includes(nilai);
      if (exists) {
        return { ...prev, nilaiPPRA: current.filter((n) => n !== nilai) };
      } else {
        return { ...prev, nilaiPPRA: [...current, nilai] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 border border-teal-800/40">
        <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-3 py-1 text-xs text-teal-200 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Panduan Resmi P5 BSKAP No. 009/H/KR/2022</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Administrasi Modul Projek Penguatan Profil Pelajar Pancasila (P5)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Kelola rincian tahapan alur projek secara interaktif: Tambah, Edit, dan Hapus kegiatan peserta didik (Pengenalan, Kontekstualisasi, Aksi Nyata, Refleksi, Tindak Lanjut) atau buat modul lengkap dengan AI Sat-Set ⚡.
        </p>

        <div className="mt-4 pt-4 border-t border-teal-800/50 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1.5 text-teal-300">
            <Clock className="w-4 h-4" />
            <span>Alokasi: <strong>{formData.alokasiWaktuProjek}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-teal-300">
            <Layers className="w-4 h-4" />
            <span>Total Aktivitas: <strong>{aktivitasRows.length} Kegiatan</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Table of Tahapan P5 with Tambah, Edit, Hapus */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Tabel Alur Tahapan & Aktivitas Projek P5
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aktivitas Projek</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
              title="Unduh ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Unduh Excel</span>
            </button>

            <button
              onClick={triggerPrint}
              className="inline-flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
              title="Cetak A4 / PDF"
            >
              <Printer className="w-3.5 h-3.5 text-rose-200" />
              <span>Cetak / PDF A4</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer"
              title="Kembalikan ke rekomendasi kurikulum"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-800 text-white font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3 w-12 text-center border-r border-slate-700">No</th>
                <th className="p-3 w-36 border-r border-slate-700">Tahapan Projek</th>
                <th className="p-3 w-56 border-r border-slate-700">Nama Aktivitas & Alokasi</th>
                <th className="p-3 border-r border-slate-700">Uraian Kegiatan Peserta Didik</th>
                <th className="p-3 w-56 border-r border-slate-700">Output / Hasil Karya</th>
                <th className="p-3 w-24 text-center">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {aktivitasRows.map((row) => (
                <tr key={row.id} className="hover:bg-teal-50/40 transition-colors">
                  <td className="p-3 text-center font-bold text-slate-700 border-r border-slate-200 align-top">
                    {row.no}
                  </td>
                  <td className="p-3 border-r border-slate-200 align-top">
                    <span
                      className={`inline-block px-2 py-1 rounded text-[11px] font-bold border ${
                        row.tahap === 'Pengenalan'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : row.tahap === 'Kontekstualisasi'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : row.tahap === 'Aksi'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : row.tahap === 'Refleksi'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                      }`}
                    >
                      Tahap {row.tahap}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-200 align-top">
                    <span className="font-bold text-slate-900 block mb-1">
                      {row.namaAktivitas}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                      {row.alokasiJP}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-200 align-top leading-relaxed text-slate-800">
                    {row.kegiatanPesertaDidik}
                  </td>
                  <td className="p-3 border-r border-slate-200 align-top font-semibold text-emerald-900 bg-emerald-50/30">
                    {row.outputHasil}
                  </td>
                  <td className="p-3 text-center align-top">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(row)}
                        className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-md transition-colors cursor-pointer"
                        title="Edit Aktivitas"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md transition-colors cursor-pointer"
                        title="Hapus Aktivitas"
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

      {/* AI Modul P5 Generator Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 text-teal-900 font-bold mb-4">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold uppercase tracking-wider">
            Generator Modul Projek P5 Lengkap (AI Sat-Set)
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilihan Tema Resmi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Tema Utama Projek P5 (Kemendikbudristek) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEMA_P5_OPTIONS.map((t) => {
                const isSelected = formData.temaP5 === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, temaP5: t.id })}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-900 block">{t.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Topik / Judul Sub-Tema Projek <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subTemaJudul}
                onChange={(e) => setFormData({ ...formData, subTemaJudul: e.target.value })}
                placeholder="Contoh: Sampahku Tanggung Jawabku: Inovasi Daur Ulang Menjadi Pupuk Kompos..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alokasi Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={formData.alokasiWaktuProjek}
                onChange={(e) => setFormData({ ...formData, alokasiWaktuProjek: e.target.value })}
                placeholder="Contoh: 40 JP (Sistem Blok 2 Minggu)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Produk / Hasil Karya Projek
              </label>
              <input
                type="text"
                value={formData.targetHasilKarya}
                onChange={(e) => setFormData({ ...formData, targetHasilKarya: e.target.value })}
                placeholder="Contoh: Pupuk Kompos Cair & Festival Pameran Karya Siswa"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dimensi Profil Pelajar Pancasila */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Dimensi Profil Pelajar Pancasila Sasaran (Pilih 2 - 3 Dimensi) <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIMENSI_PANCASILA.map((dim) => {
                const active = formData.dimensiSasaran.includes(dim);
                return (
                  <button
                    key={dim}
                    type="button"
                    onClick={() => handleToggleDimensi(dim)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {active ? '✓ ' : '+ '} {dim}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Modul memuat: Alur Tujuan Projek, Rubrik Asesmen Sumatif Perkembangan Profil Pelajar Pancasila, dan LKPD Projek.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-700 to-indigo-800 hover:from-teal-800 hover:to-indigo-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-teal-700/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isLoading ? 'Menyusun Modul Projek P5...' : 'Buat Modul Projek P5 Sat-Set ⚡'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal Add / Edit Aktivitas */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-teal-800 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">
                  {editingItem ? 'Edit Aktivitas Projek P5' : 'Tambah Aktivitas Projek P5 Baru'}
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
                    Tahapan Projek <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={inputRow.tahap}
                    onChange={(e) => setInputRow({ ...inputRow, tahap: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-900"
                  >
                    <option value="Pengenalan">Tahap Pengenalan</option>
                    <option value="Kontekstualisasi">Tahap Kontekstualisasi</option>
                    <option value="Aksi">Tahap Aksi Nyata</option>
                    <option value="Refleksi">Tahap Refleksi</option>
                    <option value="Tindak Lanjut">Tahap Tindak Lanjut</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alokasi JP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={inputRow.alokasiJP}
                    onChange={(e) => setInputRow({ ...inputRow, alokasiJP: e.target.value })}
                    placeholder="Contoh: 6 JP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Aktivitas Projek <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inputRow.namaAktivitas}
                  onChange={(e) => setInputRow({ ...inputRow, namaAktivitas: e.target.value })}
                  placeholder="Contoh: Eksplorasi Sumber Sampah Kantin dan Pemilahan Sampah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Kegiatan Peserta Didik <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={inputRow.kegiatanPesertaDidik}
                  onChange={(e) => setInputRow({ ...inputRow, kegiatanPesertaDidik: e.target.value })}
                  placeholder="Deskripsikan apa yang dilakukan siswa secara berkelompok/mandiri..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Output / Hasil Karya yang Diharapkan
                </label>
                <input
                  type="text"
                  value={inputRow.outputHasil}
                  onChange={(e) => setInputRow({ ...inputRow, outputHasil: e.target.value })}
                  placeholder="Contoh: Lembar observasi, produk karya pot daur ulang, poster..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold"
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
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Aktivitas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
