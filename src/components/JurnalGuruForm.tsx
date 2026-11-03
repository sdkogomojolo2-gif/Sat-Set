import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Zap,
  Info,
  FileSpreadsheet,
  Printer,
  Building2,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FileText,
  Search,
  RotateCcw,
  Clock,
  CheckSquare,
  HelpCircle,
  Download,
} from 'lucide-react';
import { JurnalParams, JurnalMateriItem, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import * as XLSX from 'xlsx';

interface JurnalGuruFormProps {
  onGenerate: (params: JurnalParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

const STORAGE_KEY_JURNAL = 'satset_jurnal_items_v3';

// Default initial items for SD
const DEFAULT_SD_ITEMS: JurnalMateriItem[] = [
  {
    id: 'jrn-1',
    no: 1,
    hariTanggal: 'Senin, 15 Juli 2024',
    jamKe: '1 - 2',
    materiPokokTP: '1.1 Mengenal Simbol Pancasila dan Lambang Negara Garuda Pancasila',
    kegiatanKBM: 'Membaca teks cerita bergambar, mengamati poster Garuda Pancasila, dan tanya jawab interaktif.',
    asesmen: 'Formatif (Observasi Sikap & Partisipasi)',
    status: 'sudah_diajarkan',
    refleksi: 'Tuntas (100% siswa antusias dan mengenali 5 lambang sila).',
  },
  {
    id: 'jrn-2',
    no: 2,
    hariTanggal: 'Senin, 22 Juli 2024',
    jamKe: '1 - 2',
    materiPokokTP: '1.2 Menghubungkan Simbol dengan Bunyi Sila Pancasila',
    kegiatanKBM: 'Permainan mencocokkan kartu simbol dengan kartu bunyi sila secara berkelompok.',
    asesmen: 'LKPD Kelompok & Kuis Tebak Simbol',
    status: 'sudah_diajarkan',
    refleksi: 'Aktif & tertib (27 dari 28 siswa berhasil memasangkan dengan tepat).',
  },
  {
    id: 'jrn-3',
    no: 3,
    hariTanggal: 'Senin, 29 Juli 2024',
    jamKe: '1 - 2',
    materiPokokTP: '1.3 Mengidentifikasi Sikap Sesuai Sila Pertama dan Kedua di Rumah',
    kegiatanKBM: 'Menyimak cerita dongeng tentang tolong menolong, diskusi pembiasaan berdoa sebelum makan.',
    asesmen: 'Formatif Unjuk Kerja (Menceritakan Pengalaman)',
    status: 'sudah_diajarkan',
    refleksi: '26 siswa tuntas mandiri, 2 siswa membutuhkan bimbingan bercerita.',
  },
  {
    id: 'jrn-4',
    no: 4,
    hariTanggal: 'Senin, 5 Agustus 2024',
    jamKe: '1 - 2',
    materiPokokTP: '1.4 Mengenal Aturan di Rumah dan di Lingkungan Sekolah',
    kegiatanKBM: 'Observasi tata tertib kelas, menyusun kesepakatan kelas bersama, mewarnai gambar perilaku tertib.',
    asesmen: 'Formatif (Portofolio Lembar Mewarnai Tertib)',
    status: 'akan_diajarkan',
    refleksi: 'Direncanakan menggunakan media visual kesepakatan kelas 5S.',
  },
  {
    id: 'jrn-5',
    no: 5,
    hariTanggal: 'Senin, 12 Agustus 2024',
    jamKe: '1 - 2',
    materiPokokTP: '1.5 Hak dan Kewajiban Peserta Didik di Sekolah',
    kegiatanKBM: 'Bermain peran (role play) piket kelas dan menjaga kebersihan meja belajar masing-masing.',
    asesmen: 'Penilaian Diri (Self Assessment)',
    status: 'akan_diajarkan',
    refleksi: 'Menyiapkan kartu peran piket dan instrumen ceklis kebersihan.',
  },
  {
    id: 'jrn-6',
    no: 6,
    hariTanggal: 'Senin, 19 Agustus 2024',
    jamKe: '1 - 2',
    materiPokokTP: '1.6 Asesmen Sumatif Lingkup Materi 1 (Pancasila & Aturan)',
    kegiatanKBM: 'Mengerjakan tes tulis pilihan ganda dan tanya jawab lisan pemahaman lambang negara.',
    asesmen: 'Sumatif Lingkup Materi (STS 1)',
    status: 'akan_diajarkan',
    refleksi: 'Kisi-kisi soal HOTS dan lembar jawaban telah disiapkan.',
  },
];

// Default initial items for SMP
const DEFAULT_SMP_ITEMS: JurnalMateriItem[] = [
  {
    id: 'jrn-smp-1',
    no: 1,
    hariTanggal: 'Selasa, 16 Juli 2024',
    jamKe: '3 - 4',
    materiPokokTP: '7.1 Hakikat Ilmu Sains, Pengukuran, dan Metode Ilmiah',
    kegiatanKBM: 'Demonstrasi alat laboratorium IPA (gelas ukur, mikroskop), merancang hipotesis sederhana.',
    asesmen: 'Formatif (Lembar Identifikasi Alat Lab)',
    status: 'sudah_diajarkan',
    refleksi: 'Siswa sangat tertarik dengan alat praktikum, tata tertib lab dipahami baik.',
  },
  {
    id: 'jrn-smp-2',
    no: 2,
    hariTanggal: 'Selasa, 23 Juli 2024',
    jamKe: '3 - 4',
    materiPokokTP: '7.2 Besaran Pokok, Besaran Turunan, dan Konversi Satuan SI',
    kegiatanKBM: 'Praktikum mengukur panjang meja, massa batu kecil, dan volume air menggunakan jangka sorong.',
    asesmen: 'LKPD Praktikum Pengukuran Berulang',
    status: 'sudah_diajarkan',
    refleksi: 'Tuntas, perlu penekanan ulang cara membaca skala nonius jangka sorong.',
  },
  {
    id: 'jrn-smp-3',
    no: 3,
    hariTanggal: 'Selasa, 30 Juli 2024',
    jamKe: '3 - 4',
    materiPokokTP: '7.3 Klasifikasi Zat: Unsur, Senyawa, dan Campuran Homogen/Heterogen',
    kegiatanKBM: 'Eksperimen pemisahan campuran (filtrasi teh keruh dan larutan gula), diskusi perbedaan zat.',
    asesmen: 'Formatif (Kuis Cepat & Observasi Lab)',
    status: 'akan_diajarkan',
    refleksi: 'Menyiapkan alat filtrasi sederhana corong kaca dan kertas saring.',
  },
  {
    id: 'jrn-smp-4',
    no: 4,
    hariTanggal: 'Selasa, 6 Agustus 2024',
    jamKe: '3 - 4',
    materiPokokTP: '7.4 Perubahan Fisika dan Perubahan Kimia Zat',
    kegiatanKBM: 'Mengamati lilin menyala, perkaratan paku, dan pelarutan garam; menganalisis ciri reaksi kimia.',
    asesmen: 'Laporan Mini Praktikum Kimia Sehari-hari',
    status: 'akan_diajarkan',
    refleksi: 'Direncanakan studi kasus korosi pada jembatan dan pencegahannya.',
  },
  {
    id: 'jrn-smp-5',
    no: 5,
    hariTanggal: 'Selasa, 13 Agustus 2024',
    jamKe: '3 - 4',
    materiPokokTP: '7.5 Suhu, Kalor, dan Pemuaian Benda',
    kegiatanKBM: 'Investigasi konversi skala Celcius ke Kelvin/Fahrenheit, demonstrasi bimetal pemutus arus.',
    asesmen: 'Latihan Soal Pemecahan Masalah Kalor',
    status: 'akan_diajarkan',
    refleksi: 'Menyiapkan termometer air raksa dan simulasi virtual PhET.',
  },
];

export const JurnalGuruForm: React.FC<JurnalGuruFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
  currentUser,
}) => {
  const isSMP = currentUser?.teacherLevel === 'SMP' || schoolProfile.jenjang === 'SMP';

  const [formData, setFormData] = useState<JurnalParams>({
    mataPelajaran: currentUser?.mataPelajaran || schoolProfile.mataPelajaranGuru || (isSMP ? 'Ilmu Pengetahuan Alam (IPA)' : 'Pendidikan Pancasila'),
    jenjang: (currentUser?.teacherLevel || schoolProfile.jenjang || (isSMP ? 'SMP' : 'SD')) as any,
    faseKelas: currentUser?.faseTerkunci || currentUser?.kelasYangDiajar || schoolProfile.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || (isSMP ? 'Fase D (Kelas VII SMP)' : 'Kelas 1 (Fase A)'),
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    bulan: 'Juli - Desember',
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'Guru Pengampu, S.Pd',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '198503152010011005',
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || (isSMP ? 'SMP NEGERI 1 CONTOH' : 'SD NEGERI 1 CONTOH'),
    kepalaSekolah: schoolProfile.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah || '19700712 199606 1 001',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kota Bandung',
  });

  // Dynamic Journal Items CRUD State
  const [items, setItems] = useState<JurnalMateriItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JURNAL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load jurnal items from localStorage', e);
    }
    return isSMP ? DEFAULT_SMP_ITEMS : DEFAULT_SD_ITEMS;
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JURNAL, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save jurnal items to localStorage', e);
    }
  }, [items]);

  // Sync profile when currentUser or schoolProfile updates
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || prev.namaSekolah,
      namaGuru: currentUser?.name || schoolProfile.namaGuru || prev.namaGuru,
      nipGuru: currentUser?.nip || schoolProfile.nipGuru || prev.nipGuru,
      kepalaSekolah: schoolProfile.kepalaSekolah || prev.kepalaSekolah,
      nipKepalaSekolah: schoolProfile.nipKepalaSekolah || prev.nipKepalaSekolah,
      kotaKabupaten: schoolProfile.kotaKabupaten || prev.kotaKabupaten,
    }));
  }, [currentUser, schoolProfile]);

  // Filters & Search
  const [filterStatus, setFilterStatus] = useState<'all' | 'akan_diajarkan' | 'sudah_diajarkan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JurnalMateriItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for Modal Add / Edit
  const [modalForm, setModalForm] = useState<{
    hariTanggal: string;
    jamKe: string;
    materiPokokTP: string;
    kegiatanKBM: string;
    asesmen: string;
    status: 'akan_diajarkan' | 'sudah_diajarkan';
    refleksi: string;
  }>({
    hariTanggal: '',
    jamKe: '1 - 2',
    materiPokokTP: '',
    kegiatanKBM: '',
    asesmen: 'Formatif (Observasi & LKPD)',
    status: 'akan_diajarkan',
    refleksi: '',
  });

  // Summary counts
  const totalCount = items.length;
  const sudahCount = items.filter((i) => i.status === 'sudah_diajarkan').length;
  const akanCount = items.filter((i) => i.status === 'akan_diajarkan').length;
  const percentCompleted = totalCount > 0 ? Math.round((sudahCount / totalCount) * 100) : 0;

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchStatus =
        filterStatus === 'all' ? true : item.status === filterStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.materiPokokTP.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kegiatanKBM.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hariTanggal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.asesmen.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [items, filterStatus, searchQuery]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    const nextNo = items.length + 1;
    setModalForm({
      hariTanggal: `Senin, ${nextNo * 7} Juli 2024`,
      jamKe: '1 - 2',
      materiPokokTP: '',
      kegiatanKBM: '',
      asesmen: 'Formatif (Observasi & LKPD)',
      status: 'akan_diajarkan',
      refleksi: '',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: JurnalMateriItem) => {
    setEditingItem(item);
    setModalForm({
      hariTanggal: item.hariTanggal,
      jamKe: item.jamKe,
      materiPokokTP: item.materiPokokTP,
      kegiatanKBM: item.kegiatanKBM,
      asesmen: item.asesmen,
      status: item.status,
      refleksi: item.refleksi,
    });
  };

  // Save Add
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.materiPokokTP.trim()) return;

    const newItem: JurnalMateriItem = {
      id: `jrn-${Date.now()}`,
      no: items.length + 1,
      hariTanggal: modalForm.hariTanggal,
      jamKe: modalForm.jamKe,
      materiPokokTP: modalForm.materiPokokTP,
      kegiatanKBM: modalForm.kegiatanKBM || 'Pembelajaran tatap muka, diskusi kelompok, tanya jawab, dan penugasan LKPD.',
      asesmen: modalForm.asesmen || 'Formatif (Observasi & LKPD)',
      status: modalForm.status,
      refleksi: modalForm.refleksi || (modalForm.status === 'sudah_diajarkan' ? 'Tuntas, tujuan pembelajaran tercapai.' : 'Materi direncanakan sesuai jadwal kalender pendidikan.'),
    };

    setItems([...items, newItem]);
    setIsAddModalOpen(false);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !modalForm.materiPokokTP.trim()) return;

    setItems((prev) =>
      prev.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              hariTanggal: modalForm.hariTanggal,
              jamKe: modalForm.jamKe,
              materiPokokTP: modalForm.materiPokokTP,
              kegiatanKBM: modalForm.kegiatanKBM,
              asesmen: modalForm.asesmen,
              status: modalForm.status,
              refleksi: modalForm.refleksi,
            }
          : it
      )
    );
    setEditingItem(null);
  };

  // Quick Toggle Status
  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextStatus = it.status === 'sudah_diajarkan' ? 'akan_diajarkan' : 'sudah_diajarkan';
          return {
            ...it,
            status: nextStatus,
            refleksi:
              nextStatus === 'sudah_diajarkan' && (!it.refleksi || it.refleksi.includes('direncanakan'))
                ? 'Tuntas, pembelajaran terlaksana dengan baik.'
                : it.refleksi,
          };
        }
        return it;
      })
    );
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id).map((it, idx) => ({ ...it, no: idx + 1 }));
    setItems(updated);
    setDeleteConfirmId(null);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan daftar materi jurnal harian ke contoh kurikulum standar? Perubahan kustom Anda akan direset.')) {
      setItems(isSMP ? DEFAULT_SMP_ITEMS : DEFAULT_SD_ITEMS);
    }
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const rows: any[][] = [];

    // Header KOP
    rows.push(['JURNAL HARIAN PEMBELAJARAN GURU (AGENDA MENGAJAR)']);
    rows.push([formData.namaSekolah.toUpperCase()]);
    rows.push([`TAHUN PELAJARAN: ${formData.tahunAjaran} | SEMESTER: ${formData.semester.toUpperCase()}`]);
    rows.push([]);
    rows.push(['Mata Pelajaran', ':', formData.mataPelajaran, '', 'Nama Guru', ':', formData.namaGuru]);
    rows.push(['Kelas / Fase', ':', formData.faseKelas, '', 'NIP Guru', ':', formData.nipGuru]);
    rows.push([]);

    // Table Headers
    rows.push([
      'No.',
      'Hari / Tanggal',
      'Jam Ke-',
      'Materi Pokok / Tujuan Pembelajaran (TP)',
      'Kegiatan Pembelajaran (KBM)',
      'Asesmen / Penilaian',
      'Status Pelaksanaan',
      'Refleksi / Keterangan',
    ]);

    // Rows
    items.forEach((it) => {
      rows.push([
        it.no,
        it.hariTanggal,
        it.jamKe,
        it.materiPokokTP,
        it.kegiatanKBM,
        it.asesmen,
        it.status === 'sudah_diajarkan' ? 'Sudah Diajarkan / Tuntas' : 'Akan Diajarkan (Rencana)',
        it.refleksi,
      ]);
    });

    // Space & Signatures
    rows.push([]);
    rows.push([]);
    rows.push(['', '', 'Mengetahui,', '', '', `${formData.kotaKabupaten}, 15 Juli 2024`]);
    rows.push(['', '', 'Kepala Sekolah', '', '', 'Guru Mata Pelajaran / Kelas']);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', formData.kepalaSekolah, '', '', formData.namaGuru]);
    rows.push(['', '', `NIP: ${formData.nipKepalaSekolah}`, '', '', `NIP: ${formData.nipGuru}`]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
    ];
    ws['!cols'] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 10 },
      { wch: 45 },
      { wch: 45 },
      { wch: 25 },
      { wch: 24 },
      { wch: 30 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Jurnal_Harian');
    XLSX.writeFile(wb, `Jurnal_Harian_${formData.mataPelajaran.replace(/\s+/g, '_')}_Kelas_${formData.faseKelas.replace(/\s+/g, '_')}.xlsx`);
  };

  // Export to Word (.doc)
  const handleExportWord = () => {
    const tableRows = items
      .map(
        (it) => `
        <tr>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${it.no}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${it.hariTanggal}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${it.jamKe}</td>
          <td style="border: 1px solid #000; padding: 6px;">${it.materiPokokTP}</td>
          <td style="border: 1px solid #000; padding: 6px;">${it.kegiatanKBM}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${it.asesmen}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">
            ${it.status === 'sudah_diajarkan' ? 'Sudah Diajarkan' : 'Akan Diajarkan'}
          </td>
          <td style="border: 1px solid #000; padding: 6px;">${it.refleksi}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Jurnal Harian Guru</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; }
          .header-box { text-align: center; font-weight: bold; margin-bottom: 20px; }
          .meta-table { width: 100%; border: none; margin-bottom: 15px; font-size: 10.5pt; }
          .meta-table td { border: none; padding: 3px; }
          .data-table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
          .data-table th { border: 1px solid #000; padding: 8px; background-color: #f1f5f9; text-align: center; }
          .sign-table { width: 100%; border: none; margin-top: 35px; }
          .sign-table td { border: none; text-align: center; vertical-align: top; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h2 style="margin: 0; text-transform: uppercase;">JURNAL HARIAN PEMBELAJARAN GURU</h2>
          <h3 style="margin: 3px 0; text-transform: uppercase;">${formData.namaSekolah}</h3>
          <p style="margin: 0; font-size: 10pt;">Tahun Pelajaran: ${formData.tahunAjaran} | Semester: ${formData.semester}</p>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width: 15%;">Mata Pelajaran</td>
            <td style="width: 35%;">: <strong>${formData.mataPelajaran}</strong></td>
            <td style="width: 15%;">Nama Guru</td>
            <td style="width: 35%;">: <strong>${formData.namaGuru}</strong></td>
          </tr>
          <tr>
            <td>Kelas / Fase</td>
            <td>: ${formData.faseKelas}</td>
            <td>NIP Guru</td>
            <td>: ${formData.nipGuru}</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 4%;">No.</th>
              <th style="width: 14%;">Hari / Tanggal</th>
              <th style="width: 7%;">Jam Ke</th>
              <th style="width: 25%;">Materi Pokok / TP</th>
              <th style="width: 25%;">Kegiatan Pembelajaran (KBM)</th>
              <th style="width: 10%;">Asesmen</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 15%;">Refleksi / Ket.</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <table class="sign-table">
          <tr>
            <td style="width: 45%;">
              Mengetahui,<br>
              <strong>Kepala Sekolah</strong><br>
              <br><br><br><br>
              <strong><u>${formData.kepalaSekolah}</u></strong><br>
              NIP: ${formData.nipKepalaSekolah}
            </td>
            <td style="width: 10%;"></td>
            <td style="width: 45%;">
              ${formData.kotaKabupaten}, 15 Juli 2024<br>
              <strong>Guru Mata Pelajaran / Kelas</strong><br>
              <br><br><br><br>
              <strong><u>${formData.namaGuru}</u></strong><br>
              NIP: ${formData.nipGuru}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Jurnal_Harian_${formData.mataPelajaran.replace(/\s+/g, '_')}_Kelas_${formData.faseKelas.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit to AI
  const handleAIGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 border border-indigo-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-3 py-1 text-xs text-indigo-200">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Administrasi Guru • Jurnal Harian & Agenda Mengajar</span>
          </div>
          <span className="text-xs bg-sky-500/20 border border-sky-400/30 text-sky-200 font-bold px-2.5 py-1 rounded-md">
            Jenjang Terkunci: {formData.jenjang}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          JURNAL HARIAN PEMBELAJARAN (AGENDA MENGAJAR)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Kelola agenda materi pelajaran Anda dengan mudah. Lengkap dengan tombol <strong>Tambah</strong>, <strong>Edit</strong>, dan <strong>Hapus</strong> untuk tiap materi yang akan diajarkan maupun setelah diajarkan. Terintegrasi langsung dengan format cetak kedinasan A4 dan ekspor Excel (.xlsx).
        </p>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Materi</p>
            <p className="text-xl font-black text-white mt-0.5">{totalCount} Pertemuan</p>
          </div>
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-700/40">
            <p className="text-[11px] text-emerald-300 font-semibold uppercase">Sudah Diajarkan</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{sudahCount} Terlaksana</p>
          </div>
          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-700/40">
            <p className="text-[11px] text-amber-300 font-semibold uppercase">Akan Diajarkan</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">{akanCount} Rencana</p>
          </div>
          <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/40">
            <p className="text-[11px] text-indigo-300 font-semibold uppercase">Keterlaksanaan</p>
            <p className="text-xl font-black text-indigo-300 mt-0.5">{percentCompleted}%</p>
          </div>
        </div>
      </div>

      {/* 2. Top Info & Settings Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Satuan Pendidikan:</span>
              <strong className="text-slate-900">{formData.namaSekolah}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Mata Pelajaran:</span>
              <strong className="text-slate-900">{formData.mataPelajaran}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Kelas / Fase:</span>
              <strong className="text-slate-900">{formData.faseKelas}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Guru Pengampu:</span>
              <strong className="text-slate-900">{formData.namaGuru}</strong>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors"
              title="Unduh seluruh daftar agenda ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Unduh Excel</span>
            </button>
            <button
              onClick={handleExportWord}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors"
              title="Unduh format dinas ke Microsoft Word (.doc)"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>Unduh Word</span>
            </button>
            <button
              onClick={triggerPrint}
              className="px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors"
              title="Cetak lembar Jurnal Pembelajaran resmi ke kertas A4"
            >
              <Printer className="w-4 h-4 text-rose-200" />
              <span>Cetak A4</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar & Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('akan_diajarkan')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors flex items-center space-x-1 ${
                  filterStatus === 'akan_diajarkan'
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'hover:text-amber-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Akan Diajarkan ({akanCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('sudah_diajarkan')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors flex items-center space-x-1 ${
                  filterStatus === 'sudah_diajarkan'
                    ? 'bg-emerald-100 text-emerald-900 shadow-xs'
                    : 'hover:text-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sudah Diajarkan ({sudahCount})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi pokok / TP..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-indigo-600 bg-slate-50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetToDefault}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              title="Reset contoh materi ke kurikulum baku"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Template</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-700 to-sky-700 hover:from-indigo-800 hover:to-sky-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Tambah Materi Pelajaran</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Data Table (Printable) */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-8 shadow-xs overflow-x-auto">
        <div className="min-w-[900px] border-2 border-slate-900 bg-white p-4 rounded font-serif">
          {/* Header Title inside doc */}
          <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-sm uppercase bg-slate-50 tracking-wider">
            JURNAL HARIAN PEMBELAJARAN GURU
          </div>

          <div className="mt-3 text-xs text-slate-900 grid grid-cols-2 gap-4 font-mono pb-3 border-b border-slate-300">
            <div>
              <p>Nama Sekolah : {formData.namaSekolah}</p>
              <p>Mata Pelajaran: {formData.mataPelajaran}</p>
              <p>Kelas / Fase : {formData.faseKelas}</p>
            </div>
            <div>
              <p>Nama Guru &nbsp; &nbsp;: {formData.namaGuru}</p>
              <p>Semester &nbsp; &nbsp; : {formData.semester}</p>
              <p>Tahun Pelajaran: {formData.tahunAjaran}</p>
            </div>
          </div>

          <table className="w-full mt-4 border-collapse text-[11px] font-sans">
            <thead>
              <tr className="bg-slate-100 text-center font-bold text-slate-900">
                <th className="border border-slate-900 p-2 w-10">No.</th>
                <th className="border border-slate-900 p-2 w-28">Hari / Tanggal</th>
                <th className="border border-slate-900 p-2 w-16">Jam Ke-</th>
                <th className="border border-slate-900 p-2 text-left px-3 w-72">Materi Pokok / Tujuan Pembelajaran</th>
                <th className="border border-slate-900 p-2 text-left px-3">Kegiatan Pembelajaran (KBM)</th>
                <th className="border border-slate-900 p-2 w-32">Asesmen / Penilaian</th>
                <th className="border border-slate-900 p-2 w-32">Status Pelaksanaan</th>
                <th className="border border-slate-900 p-2 text-left px-3 w-44">Refleksi / Ket.</th>
                <th className="no-print border border-slate-900 p-2 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="border border-slate-900 p-8 text-center text-slate-500 font-sans">
                    <p className="font-semibold text-sm">Tidak ada materi yang sesuai filter.</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="mt-2 text-indigo-700 underline text-xs font-bold cursor-pointer"
                    >
                      + Tambah Materi Pertama Sekarang
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="border border-slate-900 p-2 text-center font-bold">{item.no}</td>
                    <td className="border border-slate-900 p-2 text-center font-medium">{item.hariTanggal}</td>
                    <td className="border border-slate-900 p-2 text-center font-bold">{item.jamKe}</td>
                    <td className="border border-slate-900 p-2 px-3 font-semibold text-slate-950">
                      {item.materiPokokTP}
                    </td>
                    <td className="border border-slate-900 p-2 px-3 text-slate-700 text-[10.5px]">
                      {item.kegiatanKBM}
                    </td>
                    <td className="border border-slate-900 p-2 text-center text-[10.5px]">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 font-medium">
                        {item.asesmen}
                      </span>
                    </td>
                    <td className="border border-slate-900 p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        title="Klik untuk ubah status secara cepat"
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
                          item.status === 'sudah_diajarkan'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                        }`}
                      >
                        {item.status === 'sudah_diajarkan' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Setelah Diajarkan</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Akan Diajarkan</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="border border-slate-900 p-2 px-3 text-[10.5px] italic text-slate-600">
                      {item.refleksi || '-'}
                    </td>
                    <td className="no-print border border-slate-900 p-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                          title="Edit baris materi ini"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                          title="Hapus baris materi ini"
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

          {/* Official Signature Footer */}
          <div className="mt-8 pt-4 grid grid-cols-2 text-center text-xs font-serif break-inside-avoid">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Sekolah</p>
              <div className="h-20"></div>
              <p className="font-bold underline uppercase">{formData.kepalaSekolah}</p>
              <p className="text-[11px] font-sans">NIP : {formData.nipKepalaSekolah.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
            </div>
            <div>
              <p>{formData.kotaKabupaten}, 15 Juli 2024</p>
              <p className="font-bold">Guru Mata Pelajaran / Kelas</p>
              <div className="h-20"></div>
              <p className="font-bold underline uppercase">{formData.namaGuru}</p>
              <p className="text-[11px] font-sans">NIP : {formData.nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Optional AI Auto-Generator Box */}
      <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 text-xs text-slate-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Ingin Susun 1 Semester Penuh Secara Otomatis dengan AI?
              </h4>
              <p className="text-slate-600 mt-0.5">
                AI Sat-Set dapat menyusun 16–18 minggu pertemuan lengkap dengan TP, rincian aktivitas KBM, dan bentuk asesmen Kurikulum Merdeka.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAIGenerateSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-700 to-sky-700 hover:from-indigo-800 hover:to-sky-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Menyusun Jurnal AI...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Susun Jurnal Lengkap Otomatis ⚡</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL TAMBAH MATERI JURNAL                                          */}
      {/* =================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-2 text-indigo-700">
                <Plus className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 font-sans">
                  Tambah Baris Materi Jurnal Pembelajaran
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hari / Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.hariTanggal}
                    onChange={(e) => setModalForm({ ...modalForm, hariTanggal: e.target.value })}
                    placeholder="Contoh: Senin, 15 Juli 2024"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alokasi Jam Ke- <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.jamKe}
                    onChange={(e) => setModalForm({ ...modalForm, jamKe: e.target.value })}
                    placeholder="Contoh: 1 - 2 (2 JP)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Materi Pokok / Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalForm.materiPokokTP}
                  onChange={(e) => setModalForm({ ...modalForm, materiPokokTP: e.target.value })}
                  placeholder="Contoh: 1.1 Mengenal Simbol Pancasila dan Lambang Negara Garuda Pancasila"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Aktivitas Pembelajaran (KBM) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={modalForm.kegiatanKBM}
                  onChange={(e) => setModalForm({ ...modalForm, kegiatanKBM: e.target.value })}
                  placeholder="Contoh: Mengamati gambar, diskusi kelompok mencocokkan simbol, presentasi singkat."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bentuk Asesmen / Penilaian
                  </label>
                  <input
                    type="text"
                    value={modalForm.asesmen}
                    onChange={(e) => setModalForm({ ...modalForm, asesmen: e.target.value })}
                    placeholder="Contoh: Formatif (Observasi & LKPD)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Materi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={modalForm.status}
                    onChange={(e) => setModalForm({ ...modalForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                  >
                    <option value="akan_diajarkan">⏳ Rencana (Akan Diajarkan)</option>
                    <option value="sudah_diajarkan">✅ Terlaksana (Setelah Diajarkan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Refleksi / Keterangan Pelaksanaan
                </label>
                <input
                  type="text"
                  value={modalForm.refleksi}
                  onChange={(e) => setModalForm({ ...modalForm, refleksi: e.target.value })}
                  placeholder="Contoh: Tuntas (100% siswa mencapai KKTP) atau Membutuhkan remedial kelompok"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Materi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL EDIT MATERI JURNAL                                            */}
      {/* =================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 font-sans">
                  Edit Baris Materi Pertemuan ke-{editingItem.no}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hari / Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.hariTanggal}
                    onChange={(e) => setModalForm({ ...modalForm, hariTanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alokasi Jam Ke- <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.jamKe}
                    onChange={(e) => setModalForm({ ...modalForm, jamKe: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Materi Pokok / Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalForm.materiPokokTP}
                  onChange={(e) => setModalForm({ ...modalForm, materiPokokTP: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Aktivitas Pembelajaran (KBM) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={modalForm.kegiatanKBM}
                  onChange={(e) => setModalForm({ ...modalForm, kegiatanKBM: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bentuk Asesmen / Penilaian
                  </label>
                  <input
                    type="text"
                    value={modalForm.asesmen}
                    onChange={(e) => setModalForm({ ...modalForm, asesmen: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Materi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={modalForm.status}
                    onChange={(e) => setModalForm({ ...modalForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                  >
                    <option value="akan_diajarkan">⏳ Rencana (Akan Diajarkan)</option>
                    <option value="sudah_diajarkan">✅ Terlaksana (Setelah Diajarkan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Refleksi / Keterangan Pelaksanaan
                </label>
                <input
                  type="text"
                  value={modalForm.refleksi}
                  onChange={(e) => setModalForm({ ...modalForm, refleksi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL KONFIRMASI HAPUS                                              */}
      {/* =================================================================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center font-sans">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Hapus Baris Materi Ini?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Baris materi ini akan dihapus dari jurnal harian Anda. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
