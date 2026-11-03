import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Zap,
  Info,
  Printer,
  Building2,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  X,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react';
import { PromesParams, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import { getKurikulumPusat, getMataPelajaranKhususGuru } from '../data/kurikulumPusat';
import * as XLSX from 'xlsx';

interface PromesFormProps {
  onGenerate: (params: PromesParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

export interface PromesItemRow {
  id: string;
  no: number;
  noAtp: string;
  alurTujuan: string;
  jam: string;
  activeWeekIdx: number; // e.g. 0 to 29 (week index in semester)
}

const STORAGE_KEY_PROMES = 'satset_promes_items_v3';

const DEFAULT_SD_PROMES: PromesItemRow[] = [
  {
    id: 'prm-sd-1',
    no: 1,
    noAtp: '1.1',
    alurTujuan: '1.1 Peserta didik memahami dan menunjukkan simbol-simbol sila Pancasila.',
    jam: '4',
    activeWeekIdx: 2, // Juli W3
  },
  {
    id: 'prm-sd-2',
    no: 2,
    noAtp: '1.2',
    alurTujuan: '1.2 Menghubungkan simbol dengan sikap gotong royong dan tolong menolong.',
    jam: '4',
    activeWeekIdx: 3, // Juli W4
  },
  {
    id: 'prm-sd-3',
    no: 3,
    noAtp: '1.3',
    alurTujuan: '1.3 Mengenal dan mematuhi aturan tata tertib kelas dan rumah.',
    jam: '4',
    activeWeekIdx: 7, // Agust W3
  },
  {
    id: 'prm-sd-4',
    no: 4,
    noAtp: '1.4',
    alurTujuan: '1.4 Mengidentifikasi hak dan kewajiban anak sebagai anggota keluarga.',
    jam: '4',
    activeWeekIdx: 8, // Agust W4
  },
  {
    id: 'prm-sd-5',
    no: 5,
    noAtp: '1.5',
    alurTujuan: '1.5 Asesmen Sumatif Tengah Semester (STS) Lingkup Materi 1.',
    jam: '2',
    activeWeekIdx: 12, // Sept W3
  },
];

const DEFAULT_SMP_PROMES: PromesItemRow[] = [
  {
    id: 'prm-smp-1',
    no: 1,
    noAtp: '7.1',
    alurTujuan: '7.1 Hakikat sains, keselamatan kerja laboratorium IPA, dan metode ilmiah.',
    jam: '5',
    activeWeekIdx: 2, // Juli W3
  },
  {
    id: 'prm-smp-2',
    no: 2,
    noAtp: '7.2',
    alurTujuan: '7.2 Besaran pokok, besaran turunan, dan pengukuran berulang dengan jangka sorong.',
    jam: '5',
    activeWeekIdx: 3, // Juli W4
  },
  {
    id: 'prm-smp-3',
    no: 3,
    noAtp: '7.3',
    alurTujuan: '7.3 Klasifikasi zat: unsur, senyawa, dan campuran serta pemisahan campuran.',
    jam: '5',
    activeWeekIdx: 7, // Agust W3
  },
  {
    id: 'prm-smp-4',
    no: 4,
    noAtp: '7.4',
    alurTujuan: '7.4 Sifat fisika, sifat kimia, dan perubahan wujud zat dalam kehidupan sehari-hari.',
    jam: '5',
    activeWeekIdx: 8, // Agust W4
  },
  {
    id: 'prm-smp-5',
    no: 5,
    noAtp: '7.5',
    alurTujuan: '7.5 Asesmen Sumatif Tengah Semester (STS) IPA Fase D.',
    jam: '3',
    activeWeekIdx: 12, // Sept W3
  },
];

export const PromesForm: React.FC<PromesFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
  currentUser,
}) => {
  const isSMP = currentUser?.teacherLevel === 'SMP' || schoolProfile.jenjang === 'SMP';
  const targetJenjang: 'SD' | 'SMP' = isSMP ? 'SMP' : 'SD';
  const targetFase = currentUser?.faseTerkunci || currentUser?.kelasYangDiajar || (isSMP ? 'Fase D (Kelas 7-9 SMP)' : 'Fase B (Kelas 3-4 SD)');

  // Daftar mapel khusus guru (tidak tercampur mapel lain)
  const allowedMapelList = getMataPelajaranKhususGuru(currentUser);
  const defaultMapel = allowedMapelList[0] || (isSMP ? 'Ilmu Pengetahuan Alam (IPA)' : 'Ilmu Pengetahuan Alam dan Sosial (IPAS)');

  const initialKurikulum = getKurikulumPusat(targetJenjang, currentUser?.mataPelajaran || defaultMapel, targetFase);

  const [formData, setFormData] = useState<PromesParams>({
    mataPelajaran: initialKurikulum.mataPelajaran || defaultMapel,
    jenjang: targetJenjang as any,
    faseKelas: targetFase,
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    alokasiTotalJP: initialKurikulum.alokasiJPTahunan || (isSMP ? '90 JP (5 JP / Minggu)' : '72 JP (4 JP / Minggu)'),
    distribusiMingguan: isSMP ? '5 JP per minggu' : '4 JP per minggu',
    lingkupMateri: initialKurikulum.daftarMateriPokok.slice(0, 3).join('; '),
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '196608151986062001',
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || (isSMP ? 'SMP NEGERI 1 PALASA' : 'SD NEGERI 1 PALASA'),
    kepalaSekolah: schoolProfile.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah || '19700712 199606 1 001',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kab. Parigi Moutong',
    peranGuru: isSMP ? 'Guru Mata Pelajaran' : 'Guru Kelas',
  });

  const generateRowsFromKurikulum = (
    kurikulum: ReturnType<typeof getKurikulumPusat>,
    sem?: string
  ): PromesItemRow[] => {
    const list = kurikulum.atpList.filter((it) => !sem || sem.includes('1 Tahun') || it.semester === sem);
    const targetList = list.length > 0 ? list : kurikulum.atpList;
    return targetList.map((item, idx) => ({
      id: `prm-pusat-${idx + 1}-${Date.now()}`,
      no: idx + 1,
      noAtp: item.tujuanPembelajaran.match(/^[0-9]+\.[0-9]+/)?.[0] || `${idx + 1}.1`,
      alurTujuan: item.tujuanPembelajaran,
      jam: item.alokasiWaktu.replace(/[^0-9]/g, '') || (isSMP ? '5' : '4'),
      activeWeekIdx: Math.min(29, (idx + 1) * 3),
    }));
  };

  const [promesRows, setPromesRows] = useState<PromesItemRow[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PROMES}_${initialKurikulum.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return generateRowsFromKurikulum(initialKurikulum, 'Ganjil');
  });

  const handleLoadOfficialPromes = (customMapel?: string, customSemester?: string) => {
    const mapelTarget = customMapel || formData.mataPelajaran;
    const semTarget = customSemester || formData.semester;
    const kurikulum = getKurikulumPusat(targetJenjang, mapelTarget, formData.faseKelas);
    const newRows = generateRowsFromKurikulum(kurikulum, semTarget);

    setFormData((prev) => ({
      ...prev,
      mataPelajaran: kurikulum.mataPelajaran,
      alokasiTotalJP: kurikulum.alokasiJPTahunan,
      lingkupMateri: kurikulum.daftarMateriPokok.slice(0, 4).join('; '),
    }));
    setPromesRows(newRows);

    try {
      localStorage.setItem(`${STORAGE_KEY_PROMES}_${kurikulum.id}`, JSON.stringify(newRows));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROMES, JSON.stringify(promesRows));
    } catch (e) {}
  }, [promesRows]);

  // Sync profile when currentUser updates
  useEffect(() => {
    if (currentUser) {
      const allowed = getMataPelajaranKhususGuru(currentUser);
      const userMapel = allowed.find((m) => m === currentUser.mataPelajaran) || allowed[0] || formData.mataPelajaran;
      const fase = currentUser.faseTerkunci || currentUser.kelasYangDiajar || formData.faseKelas;
      const kurikulum = getKurikulumPusat(currentUser.teacherLevel, userMapel, fase);
      const sem = formData.semester || 'Ganjil';

      setFormData((prev) => ({
        ...prev,
        mataPelajaran: kurikulum.mataPelajaran,
        alokasiTotalJP: kurikulum.alokasiJPTahunan,
        lingkupMateri: kurikulum.daftarMateriPokok.slice(0, 4).join('; '),
        faseKelas: fase,
        namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
        namaGuru: currentUser.name || prev.namaGuru,
        nipGuru: currentUser.nip || prev.nipGuru,
        peranGuru: currentUser.teacherLevel === 'SMP' ? 'Guru Mata Pelajaran' : 'Guru Kelas',
      }));

      const rows = generateRowsFromKurikulum(kurikulum, sem);
      setPromesRows(rows);
    }
  }, [currentUser]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<PromesItemRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [rowForm, setRowForm] = useState<{
    noAtp: string;
    alurTujuan: string;
    jam: string;
    activeWeekIdx: number;
  }>({
    noAtp: '',
    alurTujuan: '',
    jam: '4',
    activeWeekIdx: 2,
  });

  const handleOpenAdd = () => {
    const nextIdx = promesRows.length + 1;
    setRowForm({
      noAtp: `1.${nextIdx}`,
      alurTujuan: '',
      jam: '4',
      activeWeekIdx: (nextIdx * 2) % 30,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (row: PromesItemRow) => {
    setEditingRow(row);
    setRowForm({
      noAtp: row.noAtp,
      alurTujuan: row.alurTujuan,
      jam: row.jam,
      activeWeekIdx: row.activeWeekIdx,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowForm.alurTujuan.trim()) return;
    const newRow: PromesItemRow = {
      id: `prm-${Date.now()}`,
      no: promesRows.length + 1,
      noAtp: rowForm.noAtp || `1.${promesRows.length + 1}`,
      alurTujuan: rowForm.alurTujuan,
      jam: rowForm.jam || '4',
      activeWeekIdx: Number(rowForm.activeWeekIdx) || 0,
    };
    setPromesRows([...promesRows, newRow]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow || !rowForm.alurTujuan.trim()) return;
    setPromesRows((prev) =>
      prev.map((r) =>
        r.id === editingRow.id
          ? {
              ...r,
              noAtp: rowForm.noAtp,
              alurTujuan: rowForm.alurTujuan,
              jam: rowForm.jam,
              activeWeekIdx: Number(rowForm.activeWeekIdx) || 0,
            }
          : r
      )
    );
    setEditingRow(null);
  };

  const handleDeleteRow = (id: string) => {
    setPromesRows((prev) =>
      prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, no: idx + 1 }))
    );
    setDeleteId(null);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan baris PROSEM ke contoh standar kurikulum?')) {
      setPromesRows(isSMP ? DEFAULT_SMP_PROMES : DEFAULT_SD_PROMES);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const rows: any[][] = [];
    rows.push(['PROGRAM SEMESTER (PROSEM)']);
    rows.push([formData.namaSekolah.toUpperCase()]);
    rows.push([`Mata Pelajaran: ${formData.mataPelajaran} | Kelas: ${formData.faseKelas} | Semester: ${formData.semester}`]);
    rows.push([]);
    rows.push(['No.', 'No ATP', 'Alur tujuan Pembelajaran (ATP)', 'Jam']);
    promesRows.forEach((r) => {
      rows.push([r.no, r.noAtp, r.alurTujuan, r.jam]);
    });
    rows.push([]);
    rows.push(['', '', 'Mengetahui,', formData.peranGuru || 'Guru Kelas']);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', formData.kepalaSekolah, formData.namaGuru]);
    rows.push(['', '', `NIP: ${formData.nipKepalaSekolah}`, `NIP: ${formData.nipGuru}`]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 12 }, { wch: 60 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PROSEM');
    XLSX.writeFile(wb, `PROSEM_${formData.mataPelajaran.replace(/\s+/g, '_')}_Kelas_${formData.faseKelas}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-indigo-800/40">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-3 py-1 text-xs text-indigo-200 mb-3">
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
          <span>Administrasi Guru • Program Semester (PROSEM)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          PROGRAM SEMESTER (PROSEM)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Matriks distribusi materi mingguan tiap bulan semester berjalan dengan kolom No, No ATP, Alur Tujuan Pembelajaran, Jam, dan matriks pekan. Lengkap dengan tombol <strong>Tambah</strong>, <strong>Edit</strong>, dan <strong>Hapus</strong> pada setiap baris.
        </p>
      </div>

      {/* Interactive PROSEM Table Card */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-8 shadow-xs text-xs font-serif overflow-x-auto">
        {/* Banner Resmi Kemendikbudristek BSKAP */}
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950 font-sans shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-emerald-900 block">
                ✓ PROSEM Berbasis CP & ATP Resmi Pemerintah Pusat (BSKAP No. 032/H/KR/2024)
              </span>
              <span className="text-[11px] text-emerald-800">
                Materi pokok mingguan dan alokasi jam otomatis disesuaikan dengan mapel spesifik Anda (<strong>{formData.mataPelajaran}</strong> • {formData.faseKelas} • Semester {formData.semester}).
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLoadOfficialPromes()}
            className="shrink-0 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            title="Muat ulang matriks PROSEM resmi pusat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat PROSEM Resmi</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 font-sans border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 font-bold text-indigo-900">
            <Info className="w-4 h-4 text-indigo-700 shrink-0" />
            <span>Matriks Program Semester (PROSEM) - Kelola Baris & Distribusi Jam:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Tambah Baris PROSEM</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={triggerPrint}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </button>
          </div>
        </div>

        <div className="min-w-[850px] border-2 border-slate-800 bg-white p-4 rounded">
          <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-sm uppercase bg-slate-50 tracking-wider">
            PROGRAM SEMESTER (PROSEM)
          </div>
          <div className="mt-2 text-xs font-bold text-slate-900 space-y-0.5">
            <p>Kelas &nbsp;: {formData.faseKelas}</p>
            <p>Mapel : {formData.mataPelajaran.toUpperCase()}</p>
          </div>

          <table className="w-full mt-3 border-collapse text-[10px]">
            <thead>
              <tr className="bg-slate-100 text-center">
                <th rowSpan={2} className="border border-slate-900 p-1 w-8">No.</th>
                <th rowSpan={2} className="border border-slate-900 p-1 w-12">No ATP</th>
                <th rowSpan={2} className="border border-slate-900 p-1 text-left px-2">Alur tujuan Pembelajaran (ATP)</th>
                <th rowSpan={2} className="border border-slate-900 p-1 w-8">Jam</th>
                <th colSpan={5} className="border border-slate-900 p-1 bg-purple-200 font-bold">Juli</th>
                <th colSpan={5} className="border border-slate-900 p-1 bg-purple-200 font-bold">Agust</th>
                <th colSpan={5} className="border border-slate-900 p-1 bg-purple-200 font-bold">Sept</th>
                <th colSpan={5} className="border border-slate-900 p-1 bg-purple-200 font-bold">Okt</th>
                <th colSpan={5} className="border border-slate-900 p-1 bg-purple-200 font-bold">Nov</th>
                <th colSpan={5} className="border border-slate-900 p-1 bg-purple-200 font-bold">Des</th>
                <th rowSpan={2} className="no-print border border-slate-900 p-1 w-16">Aksi</th>
              </tr>
              <tr className="text-center font-mono text-[9px]">
                {Array(6).fill(0).map((_, m) => (
                  <React.Fragment key={`p-${m}`}>
                    <th className="border border-slate-900 bg-purple-100 w-4">1</th>
                    <th className="border border-slate-900 bg-purple-100 w-4">2</th>
                    <th className="border border-slate-900 bg-purple-100 w-4">3</th>
                    <th className="border border-slate-900 bg-purple-100 w-4">4</th>
                    <th className="border border-slate-900 bg-purple-100 w-4">5</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {promesRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="border border-slate-900 p-1 text-center font-bold">{row.no}</td>
                  <td className="border border-slate-900 p-1 text-center font-bold">{row.noAtp}</td>
                  <td className="border border-slate-900 p-1 px-2">{row.alurTujuan}</td>
                  <td className="border border-slate-900 p-1 text-center font-bold">{row.jam}</td>
                  {Array(30).fill(0).map((_, w) => (
                    <td
                      key={w}
                      className={`border border-slate-900 text-center font-bold text-[9px] ${
                        w === row.activeWeekIdx ? 'bg-purple-300 text-slate-950 font-black' : 'bg-purple-50/30'
                      }`}
                    >
                      {w === row.activeWeekIdx ? row.jam : ''}
                    </td>
                  ))}
                  <td className="no-print border border-slate-900 p-1 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(row)}
                        className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                        title="Edit baris PROSEM ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                        title="Hapus baris PROSEM ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom Signatures matching photo */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="font-semibold">Mengetahui</p>
              <p className="font-bold">Kepala Sekolah</p>
              <div className="h-16"></div>
              <p className="font-bold uppercase underline">{formData.kepalaSekolah}</p>
              <p className="text-[11px]">NIP : {formData.nipKepalaSekolah.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
            </div>
            <div>
              <p className="font-bold">{formData.peranGuru || 'Guru Kelas'}</p>
              <div className="h-20"></div>
              <p className="font-bold uppercase underline">{formData.namaGuru}</p>
              <p className="text-[11px]">NIP : {formData.nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Inputs for AI auto-generation */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
          <Sparkles className="w-5 h-5 text-indigo-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
            Konfigurasi Alokasi Jam & Generator AI PROSEM
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Mata Pelajaran (Terkunci Sesuai Akun) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.mataPelajaran}
              onChange={(e) => {
                const newM = e.target.value;
                setFormData({ ...formData, mataPelajaran: newM });
                handleLoadOfficialPromes(newM, formData.semester);
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white"
            >
              {allowedMapelList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <p className="text-[10.5px] text-slate-500 mt-1">
              Fokus pada mapel spesifik Anda, tidak tercampur mapel lain.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Kelas / Fase <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.faseKelas}
              onChange={(e) => setFormData({ ...formData, faseKelas: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Semester
            </label>
            <select
              value={formData.semester}
              onChange={(e) => {
                const newS = e.target.value as 'Ganjil' | 'Genap';
                setFormData({ ...formData, semester: newS });
                handleLoadOfficialPromes(formData.mataPelajaran, newS);
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white font-medium"
            >
              <option value="Ganjil">Semester Ganjil (Juli - Desember)</option>
              <option value="Genap">Semester Genap (Januari - Juni)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Alokasi Jam Mingguan & Total Jam Semester
            </label>
            <input
              type="text"
              value={formData.distribusiMingguan}
              onChange={(e) => setFormData({ ...formData, distribusiMingguan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-xs text-slate-500">
            Dapat langsung diunduh ke Excel (.xlsx), Word (.doc), atau dicetak format dinas A4.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-indigo-700/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Menyusun PROSEM...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Susun Program Semester Sat-Set ⚡</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Tambah Baris PROSEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Tambah Baris Program Semester (PROSEM)</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No ATP</label>
                  <input
                    type="text"
                    required
                    value={rowForm.noAtp}
                    onChange={(e) => setRowForm({ ...rowForm, noAtp: e.target.value })}
                    placeholder="Contoh: 1.1"
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alokasi Jam</label>
                  <input
                    type="text"
                    required
                    value={rowForm.jam}
                    onChange={(e) => setRowForm({ ...rowForm, jam: e.target.value })}
                    placeholder="Contoh: 4"
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alur Tujuan Pembelajaran (ATP)</label>
                <textarea
                  rows={3}
                  required
                  value={rowForm.alurTujuan}
                  onChange={(e) => setRowForm({ ...rowForm, alurTujuan: e.target.value })}
                  placeholder="Ketik rumusan alur tujuan pembelajaran..."
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alokasi Pekan Mengajar (Minggu ke- 1 s.d 30)</label>
                <input
                  type="number"
                  min="0"
                  max="29"
                  value={rowForm.activeWeekIdx}
                  onChange={(e) => setRowForm({ ...rowForm, activeWeekIdx: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
                <p className="text-[10px] text-slate-500 mt-1">Pekan 0-4: Juli, 5-9: Agustus, 10-14: September, dst.</p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border rounded text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded"
                >
                  Simpan Baris PROSEM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Baris PROSEM */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Baris PROSEM ke-{editingRow.no}</h3>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No ATP</label>
                  <input
                    type="text"
                    required
                    value={rowForm.noAtp}
                    onChange={(e) => setRowForm({ ...rowForm, noAtp: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alokasi Jam</label>
                  <input
                    type="text"
                    required
                    value={rowForm.jam}
                    onChange={(e) => setRowForm({ ...rowForm, jam: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alur Tujuan Pembelajaran (ATP)</label>
                <textarea
                  rows={3}
                  required
                  value={rowForm.alurTujuan}
                  onChange={(e) => setRowForm({ ...rowForm, alurTujuan: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alokasi Pekan Mengajar (Minggu ke- 0 s.d 29)</label>
                <input
                  type="number"
                  min="0"
                  max="29"
                  value={rowForm.activeWeekIdx}
                  onChange={(e) => setRowForm({ ...rowForm, activeWeekIdx: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="px-3 py-1.5 border rounded text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center font-sans">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Hapus Baris PROSEM Ini?</h4>
            <p className="text-xs text-slate-500 mb-4">
              Baris alur tujuan dan jadwal jam ini akan dihapus dari Program Semester.
            </p>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 border rounded text-xs font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRow(deleteId)}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded"
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
