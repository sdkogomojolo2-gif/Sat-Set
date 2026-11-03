import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
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
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { KktpParams, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import { getKurikulumPusat, getMataPelajaranKhususGuru } from '../data/kurikulumPusat';
import * as XLSX from 'xlsx';

interface KktpFormProps {
  onGenerate: (params: KktpParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

export interface KktpItemRow {
  id: string;
  no: number;
  lingkupMateri: string;
  deskripsiCP: string;
  perluBimbingan: string; // 0-69
  cukup: string; // 70-79
  baik: string; // 80-89
  sangatBaik: string; // 90-100
}

const STORAGE_KEY_KKTP = 'satset_kktp_items_v3';

const DEFAULT_SD_KKTP: KktpItemRow[] = [
  {
    id: 'kktp-sd-1',
    no: 1,
    lingkupMateri: 'Simbol-Simbol Pancasila & Garuda',
    deskripsiCP: 'Peserta didik mengenali dan menyebutkan simbol-simbol sila Pancasila pada Lambang Negara Garuda Pancasila secara berurutan.',
    perluBimbingan: 'Belum mampu menyebutkan simbol sila Pancasila meskipun dibimbing.',
    cukup: 'Mampu menyebutkan 1-3 simbol sila Pancasila dengan bantuan guru.',
    baik: 'Mampu menyebutkan ke-5 simbol sila Pancasila dengan tepat secara mandiri.',
    sangatBaik: 'Mampu menyebutkan dan menjelaskan makna ke-5 simbol sila Pancasila secara runtut dan percaya diri.',
  },
  {
    id: 'kktp-sd-2',
    no: 2,
    lingkupMateri: 'Pengamalan Sila dalam Perilaku',
    deskripsiCP: 'Peserta didik menceritakan contoh hubungan simbol dengan pengamalan sila-sila Pancasila di rumah dan sekolah.',
    perluBimbingan: 'Belum mampu memberikan contoh pengamalan sila Pancasila.',
    cukup: 'Mampu memberikan 1 contoh sikap pengamalan sila dengan bimbingan guru.',
    baik: 'Mampu memberikan contoh sikap pengamalan tiap sila dengan tepat.',
    sangatBaik: 'Mampu memberikan contoh dan menunjukkan pembiasaan sikap pengamalan sila dalam kehidupan nyata.',
  },
  {
    id: 'kktp-sd-3',
    no: 3,
    lingkupMateri: 'Aturan di Rumah dan di Sekolah',
    deskripsiCP: 'Peserta didik mengidentifikasi dan mematuhi aturan yang berlaku di rumah serta di lingkungan kelas.',
    perluBimbingan: 'Belum mampu membedakan aturan di rumah dan di sekolah.',
    cukup: 'Mampu menyebutkan aturan namun belum konsisten mematuhinya.',
    baik: 'Mampu menyebutkan dan mematuhi aturan di rumah dan sekolah secara mandiri.',
    sangatBaik: 'Menjadi teladan dalam mematuhi aturan dan mengingatkan teman secara santun.',
  },
];

const DEFAULT_SMP_KKTP: KktpItemRow[] = [
  {
    id: 'kktp-smp-1',
    no: 1,
    lingkupMateri: 'Hakikat Sains & Metode Ilmiah',
    deskripsiCP: 'Peserta didik mampu merancang penyelidikan ilmiah dan menggunakan alat ukur laboratorium secara aman dan presisi.',
    perluBimbingan: 'Belum mampu membaca skala alat ukur dasar laboratorium.',
    cukup: 'Mampu menggunakan alat ukur dengan bimbingan dan arahan intensif.',
    baik: 'Mampu membaca skala alat ukur (jangka sorong/mikrometer) secara mandiri.',
    sangatBaik: 'Mampu merancang eksperimen dan menyajikan data hasil pengukuran secara akurat.',
  },
  {
    id: 'kktp-smp-2',
    no: 2,
    lingkupMateri: 'Klasifikasi Materi & Perubahannya',
    deskripsiCP: 'Peserta didik mengklasifikasikan zat padat, cair, gas serta membedakan perubahan fisika dan kimia dalam kehidupan sehari-hari.',
    perluBimbingan: 'Belum dapat membedakan perubahan fisika dan perubahan kimia.',
    cukup: 'Mampu memberi contoh perubahan fisika dengan bantuan guru.',
    baik: 'Mampu membedakan ciri perubahan fisika dan kimia secara mandiri.',
    sangatBaik: 'Mampu menganalisis dan memisahkan campuran melalui metode praktikum tepat.',
  },
];

export const KktpForm: React.FC<KktpFormProps> = ({
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

  const [formData, setFormData] = useState<KktpParams>({
    mataPelajaran: initialKurikulum.mataPelajaran || defaultMapel,
    jenjang: targetJenjang as any,
    faseKelas: targetFase,
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    lingkupMateri: initialKurikulum.daftarMateriPokok.slice(0, 4).join('; '),
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '196608151986062001',
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || (isSMP ? 'SMP NEGERI 1 PALASA' : 'SD NEGERI 1 PALASA'),
    kepalaSekolah: schoolProfile.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah || '19700712 199606 1 001',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kab. Parigi Moutong',
    peranGuru: isSMP ? 'Guru Mata Pelajaran' : 'Guru Kelas',
  });

  const generateKktpRowsFromKurikulum = (
    kurikulum: ReturnType<typeof getKurikulumPusat>,
    sem: 'Ganjil' | 'Genap'
  ): KktpItemRow[] => {
    const list = kurikulum.atpList.filter((it) => it.semester === sem);
    const targetList = list.length > 0 ? list : kurikulum.atpList;
    return targetList.map((item, idx) => ({
      id: `kktp-pusat-${idx + 1}-${Date.now()}`,
      no: idx + 1,
      lingkupMateri: item.lingkupMateri || item.elemen,
      deskripsiCP: item.kktpDeskripsi || item.tujuanPembelajaran,
      perluBimbingan: `Belum mampu menunjukkan penguasaan materi ${item.lingkupMateri || item.elemen} meski dengan bimbingan guru.`,
      cukup: `Mampu memahami sebagian konsep materi ${item.lingkupMateri || item.elemen} dengan bantuan arahan berkala.`,
      baik: `Mampu menguasai indikator dan menyelesaikan tugas materi ${item.lingkupMateri || item.elemen} secara mandiri.`,
      sangatBaik: `Menguasai materi ${item.lingkupMateri || item.elemen} dengan sangat baik, kreatif, dan mampu membimbing teman.`,
    }));
  };

  const [kktpRows, setKktpRows] = useState<KktpItemRow[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_KKTP}_${initialKurikulum.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return generateKktpRowsFromKurikulum(initialKurikulum, 'Ganjil');
  });

  const handleLoadOfficialKktp = (customMapel?: string, customSemester?: 'Ganjil' | 'Genap') => {
    const mapelTarget = customMapel || formData.mataPelajaran;
    const semTarget = customSemester || formData.semester;
    const kurikulum = getKurikulumPusat(targetJenjang, mapelTarget, formData.faseKelas);
    const newRows = generateKktpRowsFromKurikulum(kurikulum, semTarget);

    setFormData((prev) => ({
      ...prev,
      mataPelajaran: kurikulum.mataPelajaran,
      lingkupMateri: kurikulum.daftarMateriPokok.slice(0, 4).join('; '),
    }));
    setKktpRows(newRows);

    try {
      localStorage.setItem(`${STORAGE_KEY_KKTP}_${kurikulum.id}`, JSON.stringify(newRows));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_KKTP, JSON.stringify(kktpRows));
    } catch (e) {}
  }, [kktpRows]);

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
        lingkupMateri: kurikulum.daftarMateriPokok.slice(0, 4).join('; '),
        faseKelas: fase,
        namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
        namaGuru: currentUser.name || prev.namaGuru,
        nipGuru: currentUser.nip || prev.nipGuru,
        peranGuru: currentUser.teacherLevel === 'SMP' ? 'Guru Mata Pelajaran' : 'Guru Kelas',
      }));

      const rows = generateKktpRowsFromKurikulum(kurikulum, sem);
      setKktpRows(rows);
    }
  }, [currentUser]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<KktpItemRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [rowForm, setRowForm] = useState<{
    lingkupMateri: string;
    deskripsiCP: string;
    perluBimbingan: string;
    cukup: string;
    baik: string;
    sangatBaik: string;
  }>({
    lingkupMateri: '',
    deskripsiCP: '',
    perluBimbingan: '',
    cukup: '',
    baik: '',
    sangatBaik: '',
  });

  const handleOpenAdd = () => {
    setRowForm({
      lingkupMateri: '',
      deskripsiCP: '',
      perluBimbingan: 'Belum mampu mencapai indikator tujuan pembelajaran meskipun dibimbing.',
      cukup: 'Mampu mencapai sebagian indikator tujuan pembelajaran dengan bantuan.',
      baik: 'Mampu mencapai seluruh indikator tujuan pembelajaran secara mandiri.',
      sangatBaik: 'Mampu menguasai indikator melebihi target dan mampu menjadi tutor sebaya.',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (row: KktpItemRow) => {
    setEditingRow(row);
    setRowForm({
      lingkupMateri: row.lingkupMateri,
      deskripsiCP: row.deskripsiCP,
      perluBimbingan: row.perluBimbingan,
      cukup: row.cukup,
      baik: row.baik,
      sangatBaik: row.sangatBaik,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowForm.lingkupMateri.trim()) return;
    const newRow: KktpItemRow = {
      id: `kktp-${Date.now()}`,
      no: kktpRows.length + 1,
      lingkupMateri: rowForm.lingkupMateri,
      deskripsiCP: rowForm.deskripsiCP || 'Peserta didik memahami dan menerapkan materi pokok secara tuntas.',
      perluBimbingan: rowForm.perluBimbingan || 'Belum tuntas (0-69)',
      cukup: rowForm.cukup || 'Cukup tuntas (70-79)',
      baik: rowForm.baik || 'Baik (80-89)',
      sangatBaik: rowForm.sangatBaik || 'Sangat baik (90-100)',
    };
    setKktpRows([...kktpRows, newRow]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow || !rowForm.lingkupMateri.trim()) return;
    setKktpRows((prev) =>
      prev.map((r) =>
        r.id === editingRow.id
          ? {
              ...r,
              lingkupMateri: rowForm.lingkupMateri,
              deskripsiCP: rowForm.deskripsiCP,
              perluBimbingan: rowForm.perluBimbingan,
              cukup: rowForm.cukup,
              baik: rowForm.baik,
              sangatBaik: rowForm.sangatBaik,
            }
          : r
      )
    );
    setEditingRow(null);
  };

  const handleDeleteRow = (id: string) => {
    setKktpRows((prev) =>
      prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, no: idx + 1 }))
    );
    setDeleteId(null);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan baris KKTP ke contoh standar kurikulum?')) {
      setKktpRows(isSMP ? DEFAULT_SMP_KKTP : DEFAULT_SD_KKTP);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const rows: any[][] = [];
    rows.push(['KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)']);
    rows.push([formData.namaSekolah.toUpperCase()]);
    rows.push([`Mata Pelajaran: ${formData.mataPelajaran} | Kelas: ${formData.faseKelas} | Semester: ${formData.semester}`]);
    rows.push([]);
    rows.push(['No.', 'Lingkup Materi', 'Deskripsi CP', 'Perlu Bimbingan (0-69)', 'Cukup (70-79)', 'Baik (80-89)', 'Sangat Baik (90-100)']);
    kktpRows.forEach((r) => {
      rows.push([r.no, r.lingkupMateri, r.deskripsiCP, r.perluBimbingan, r.cukup, r.baik, r.sangatBaik]);
    });
    rows.push([]);
    rows.push(['', '', 'Mengetahui,', '', '', formData.peranGuru || 'Guru Kelas']);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', formData.kepalaSekolah, '', '', formData.namaGuru]);
    rows.push(['', '', `NIP: ${formData.nipKepalaSekolah}`, '', '', `NIP: ${formData.nipGuru}`]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 25 }, { wch: 45 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KKTP');
    XLSX.writeFile(wb, `KKTP_${formData.mataPelajaran.replace(/\s+/g, '_')}_Kelas_${formData.faseKelas}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-emerald-800/40">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 text-xs text-emerald-200 mb-3">
          <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Administrasi Guru • Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          KRITERIA KETERCAPAIAN TUJUAN (KKTP)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Format matriks interval nilai ketuntasan (Perlu Bimbingan 0-69, Cukup 70-79, Baik 80-89, Sangat Baik 90-100) dilengkapi Deskripsi Capaian Pembelajaran. Lengkap dengan tombol <strong>Tambah</strong>, <strong>Edit</strong>, dan <strong>Hapus</strong> pada setiap baris kriteria.
        </p>
      </div>

      {/* Interactive KKTP Table Card */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-8 shadow-xs text-xs font-serif overflow-x-auto">
        {/* Banner Resmi Kemendikbudristek BSKAP */}
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950 font-sans shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-emerald-900 block">
                ✓ KKTP Berdasarkan Interval Ketercapaian Resmi BSKAP (No. 032/H/KR/2024)
              </span>
              <span className="text-[11px] text-emerald-800">
                Deskripsi rubrik kriteria ketuntasan (Perlu Bimbingan, Cukup, Baik, Sangat Baik) otomatis dimuat dari standar kurikulum pusat untuk <strong>{formData.mataPelajaran}</strong> ({formData.faseKelas}).
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLoadOfficialKktp()}
            className="shrink-0 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            title="Muat ulang rubrik KKTP resmi pusat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat KKTP Resmi</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 font-sans border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 font-bold text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Matriks Interval KKTP Resmi - Kelola Butir Kriteria Ketuntasan:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Tambah Baris KKTP</span>
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
            KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)
          </div>
          <div className="mt-3 text-xs text-slate-900 grid grid-cols-2 gap-4 font-mono pb-2 border-b border-slate-300">
            <div>
              <p>Nama Sekolah : {formData.namaSekolah}</p>
              <p>Mata Pelajaran: {formData.mataPelajaran}</p>
              <p>Kelas / Fase : {formData.faseKelas}</p>
            </div>
            <div>
              <p>Semester &nbsp; &nbsp; &nbsp; &nbsp;: {formData.semester}</p>
              <p>Tahun Pelajaran : {formData.tahunAjaran}</p>
              <p>Nama Guru &nbsp; &nbsp; &nbsp; : {formData.namaGuru}</p>
            </div>
          </div>

          <table className="w-full mt-4 border-collapse text-[10.5px]">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th rowSpan={2} className="border border-slate-900 p-1.5 w-8">No.</th>
                <th rowSpan={2} className="border border-slate-900 p-1.5 w-36">Lingkup Materi</th>
                <th rowSpan={2} className="border border-slate-900 p-1.5 text-left px-2">Deskripsi CP (Capaian Pembelajaran)</th>
                <th colSpan={4} className="border border-slate-900 p-1.5">Interval Ketuntasan</th>
                <th rowSpan={2} className="no-print border border-slate-900 p-1.5 w-16">Aksi</th>
              </tr>
              <tr className="bg-slate-50 text-center font-semibold text-[10px]">
                <th className="border border-slate-900 p-1 w-24 bg-rose-50 text-rose-900">Perlu Bimbingan<br/><span className="text-[9px] font-normal">0-69</span></th>
                <th className="border border-slate-900 p-1 w-20 bg-amber-50 text-amber-900">Cukup<br/><span className="text-[9px] font-normal">70-79</span></th>
                <th className="border border-slate-900 p-1 w-20 bg-emerald-50 text-emerald-900">Baik<br/><span className="text-[9px] font-normal">80-89</span></th>
                <th className="border border-slate-900 p-1 w-24 bg-blue-50 text-blue-900">Sangat Baik<br/><span className="text-[9px] font-normal">90-100</span></th>
              </tr>
            </thead>
            <tbody>
              {kktpRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{row.no}</td>
                  <td className="border border-slate-900 p-1.5 font-bold text-center text-slate-900">{row.lingkupMateri}</td>
                  <td className="border border-slate-900 p-1.5 px-2">{row.deskripsiCP}</td>
                  <td className="border border-slate-900 p-1.5 px-1.5 text-[9.5px] bg-rose-50/30 text-slate-700">{row.perluBimbingan}</td>
                  <td className="border border-slate-900 p-1.5 px-1.5 text-[9.5px] bg-amber-50/30 text-slate-700">{row.cukup}</td>
                  <td className="border border-slate-900 p-1.5 px-1.5 text-[9.5px] bg-emerald-50/30 text-slate-700">{row.baik}</td>
                  <td className="border border-slate-900 p-1.5 px-1.5 text-[9.5px] bg-blue-50/30 text-slate-700">{row.sangatBaik}</td>
                  <td className="no-print border border-slate-900 p-1.5 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(row)}
                        className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                        title="Edit baris KKTP ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                        title="Hapus baris KKTP ini"
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
              <p className="font-bold">{formData.peranGuru || 'Guru Kelas / Mata Pelajaran'}</p>
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
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
            Konfigurasi & Generator AI KKTP
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
                handleLoadOfficialKktp(newM, formData.semester);
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
                handleLoadOfficialKktp(formData.mataPelajaran, newS);
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white font-medium"
            >
              <option value="Ganjil">Semester Ganjil (Juli - Desember)</option>
              <option value="Genap">Semester Genap (Januari - Juni)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Lingkup Materi Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.lingkupMateri}
              onChange={(e) => setFormData({ ...formData, lingkupMateri: e.target.value })}
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
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Menyusun KKTP...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Susun KKTP Sat-Set ⚡</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Tambah Baris KKTP */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Tambah Baris Kriteria Ketuntasan (KKTP)</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran / Lingkup Materi</label>
                <input
                  type="text"
                  required
                  value={rowForm.lingkupMateri}
                  onChange={(e) => setRowForm({ ...rowForm, lingkupMateri: e.target.value })}
                  placeholder="Contoh: Simbol Sila Pancasila"
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Capaian Pembelajaran</label>
                <textarea
                  rows={2}
                  required
                  value={rowForm.deskripsiCP}
                  onChange={(e) => setRowForm({ ...rowForm, deskripsiCP: e.target.value })}
                  placeholder="Ketik deskripsi capaian kompetensi..."
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="p-3 bg-slate-50 border rounded-lg space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase">Deskripsi 4 Interval Nilai:</span>
                <div>
                  <label className="font-bold text-rose-800 block text-[10px]">Perlu Bimbingan (0-69)</label>
                  <input
                    type="text"
                    value={rowForm.perluBimbingan}
                    onChange={(e) => setRowForm({ ...rowForm, perluBimbingan: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-800 block text-[10px]">Cukup (70-79)</label>
                  <input
                    type="text"
                    value={rowForm.cukup}
                    onChange={(e) => setRowForm({ ...rowForm, cukup: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-800 block text-[10px]">Baik (80-89)</label>
                  <input
                    type="text"
                    value={rowForm.baik}
                    onChange={(e) => setRowForm({ ...rowForm, baik: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-blue-800 block text-[10px]">Sangat Baik (90-100)</label>
                  <input
                    type="text"
                    value={rowForm.sangatBaik}
                    onChange={(e) => setRowForm({ ...rowForm, sangatBaik: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
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
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Simpan Baris KKTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Baris KKTP */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Baris KKTP ke-{editingRow.no}</h3>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran / Lingkup Materi</label>
                <input
                  type="text"
                  required
                  value={rowForm.lingkupMateri}
                  onChange={(e) => setRowForm({ ...rowForm, lingkupMateri: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Capaian Pembelajaran</label>
                <textarea
                  rows={2}
                  required
                  value={rowForm.deskripsiCP}
                  onChange={(e) => setRowForm({ ...rowForm, deskripsiCP: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="p-3 bg-slate-50 border rounded-lg space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase">Deskripsi 4 Interval Nilai:</span>
                <div>
                  <label className="font-bold text-rose-800 block text-[10px]">Perlu Bimbingan (0-69)</label>
                  <input
                    type="text"
                    value={rowForm.perluBimbingan}
                    onChange={(e) => setRowForm({ ...rowForm, perluBimbingan: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-800 block text-[10px]">Cukup (70-79)</label>
                  <input
                    type="text"
                    value={rowForm.cukup}
                    onChange={(e) => setRowForm({ ...rowForm, cukup: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-800 block text-[10px]">Baik (80-89)</label>
                  <input
                    type="text"
                    value={rowForm.baik}
                    onChange={(e) => setRowForm({ ...rowForm, baik: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-blue-800 block text-[10px]">Sangat Baik (90-100)</label>
                  <input
                    type="text"
                    value={rowForm.sangatBaik}
                    onChange={(e) => setRowForm({ ...rowForm, sangatBaik: e.target.value })}
                    className="w-full p-1.5 border rounded text-xs"
                  />
                </div>
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
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
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
            <h4 className="font-bold text-sm text-slate-900 mb-1">Hapus Baris KKTP Ini?</h4>
            <p className="text-xs text-slate-500 mb-4">
              Baris kriteria ketuntasan ini akan dihapus dari dokumen KKTP.
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
