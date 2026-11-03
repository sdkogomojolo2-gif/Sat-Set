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
import { AtpParams, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import { getKurikulumPusat, getMataPelajaranKhususGuru } from '../data/kurikulumPusat';
import * as XLSX from 'xlsx';

interface AtpFormProps {
  onGenerate: (params: AtpParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

export interface AtpItemRow {
  id: string;
  no: number;
  capaianPembelajaran: string;
  elemen: string;
  tujuanPembelajaran: string;
  alokasiWaktu: string;
  profilPancasila: string;
}

const STORAGE_KEY_ATP = 'satset_atp_items_v4';

export const AtpForm: React.FC<AtpFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
  currentUser,
}) => {
  const isSMP = currentUser?.teacherLevel === 'SMP' || schoolProfile.jenjang === 'SMP';
  const targetJenjang: 'SD' | 'SMP' = isSMP ? 'SMP' : 'SD';
  const targetFase = currentUser?.faseTerkunci || currentUser?.kelasYangDiajar || schoolProfile.faseKelasDiampu || (isSMP ? 'Fase D (Kelas 7-9 SMP)' : 'Fase B (Kelas 3-4 SD)');
  
  // Daftar mapel khusus guru (tidak tercampur mapel lain)
  const allowedMapelList = getMataPelajaranKhususGuru(currentUser);
  const defaultMapel = allowedMapelList[0] || (isSMP ? 'Ilmu Pengetahuan Alam (IPA)' : 'Ilmu Pengetahuan Alam dan Sosial (IPAS)');

  // Ambil data kurikulum pusat awal
  const initialKurikulum = getKurikulumPusat(targetJenjang, currentUser?.mataPelajaran || defaultMapel, targetFase);

  const [formData, setFormData] = useState<AtpParams>({
    mataPelajaran: initialKurikulum.mataPelajaran || defaultMapel,
    jenjang: targetJenjang as any,
    faseKelas: targetFase,
    tahunAjaran: '2026/2027',
    capaianPembelajaran: initialKurikulum.capaianPembelajaran,
    elemenCp: initialKurikulum.elemenCp,
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '196608151986062001',
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || (isSMP ? 'SMP NEGERI 1 PALASA' : 'SD NEGERI 1 PALASA'),
    kepalaSekolah: schoolProfile.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah || '19700712 199606 1 001',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kab. Parigi Moutong',
    peranGuru: isSMP ? 'Guru Mata Pelajaran' : 'Guru Kelas',
  });

  // Dynamic CRUD rows for ATP (Default langsung resmi dari pusat BSKAP)
  const [atpRows, setAtpRows] = useState<AtpItemRow[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_ATP}_${initialKurikulum.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    return initialKurikulum.atpList.map((item) => ({
      id: `atp-pusat-${item.no}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      no: item.no,
      capaianPembelajaran: initialKurikulum.capaianPembelajaran,
      elemen: item.elemen,
      tujuanPembelajaran: item.tujuanPembelajaran,
      alokasiWaktu: item.alokasiWaktu,
      profilPancasila: item.profilPancasila,
    }));
  });

  // Fungsi muat CP & ATP resmi pusat BSKAP
  const handleLoadOfficialPusat = (customMapel?: string) => {
    const mapelTarget = customMapel || formData.mataPelajaran;
    const kurikulum = getKurikulumPusat(targetJenjang, mapelTarget, formData.faseKelas);

    const rows: AtpItemRow[] = kurikulum.atpList.map((item) => ({
      id: `atp-pusat-${item.no}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      no: item.no,
      capaianPembelajaran: kurikulum.capaianPembelajaran,
      elemen: item.elemen,
      tujuanPembelajaran: item.tujuanPembelajaran,
      alokasiWaktu: item.alokasiWaktu,
      profilPancasila: item.profilPancasila,
    }));

    setFormData((prev) => ({
      ...prev,
      mataPelajaran: kurikulum.mataPelajaran,
      capaianPembelajaran: kurikulum.capaianPembelajaran,
      elemenCp: kurikulum.elemenCp,
    }));
    setAtpRows(rows);

    try {
      localStorage.setItem(`${STORAGE_KEY_ATP}_${kurikulum.id}`, JSON.stringify(rows));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATP, JSON.stringify(atpRows));
    } catch (e) {}
  }, [atpRows]);

  // Sync profile when currentUser updates
  useEffect(() => {
    if (currentUser) {
      const allowed = getMataPelajaranKhususGuru(currentUser);
      const userMapel = allowed.find((m) => m === currentUser.mataPelajaran) || allowed[0] || formData.mataPelajaran;
      const fase = currentUser.faseTerkunci || currentUser.kelasYangDiajar || formData.faseKelas;
      const kurikulum = getKurikulumPusat(currentUser.teacherLevel, userMapel, fase);

      setFormData((prev) => ({
        ...prev,
        mataPelajaran: kurikulum.mataPelajaran,
        capaianPembelajaran: kurikulum.capaianPembelajaran,
        elemenCp: kurikulum.elemenCp,
        faseKelas: fase,
        namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
        namaGuru: currentUser.name || prev.namaGuru,
        nipGuru: currentUser.nip || prev.nipGuru,
        peranGuru: currentUser.teacherLevel === 'SMP' ? 'Guru Mata Pelajaran' : 'Guru Kelas',
      }));

      const rows: AtpItemRow[] = kurikulum.atpList.map((item) => ({
        id: `atp-pusat-${item.no}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        no: item.no,
        capaianPembelajaran: kurikulum.capaianPembelajaran,
        elemen: item.elemen,
        tujuanPembelajaran: item.tujuanPembelajaran,
        alokasiWaktu: item.alokasiWaktu,
        profilPancasila: item.profilPancasila,
      }));
      setAtpRows(rows);
    }
  }, [currentUser]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AtpItemRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [rowForm, setRowForm] = useState<{
    capaianPembelajaran: string;
    elemen: string;
    tujuanPembelajaran: string;
    alokasiWaktu: string;
    profilPancasila: string;
  }>({
    capaianPembelajaran: '',
    elemen: '',
    tujuanPembelajaran: '',
    alokasiWaktu: '8 JP',
    profilPancasila: 'Beriman, Mandiri, Bernalar Kritis, Kreatif, Gotong Royong.',
  });

  const handleOpenAdd = () => {
    setRowForm({
      capaianPembelajaran: '',
      elemen: 'Pancasila',
      tujuanPembelajaran: '',
      alokasiWaktu: '8 JP',
      profilPancasila: 'Beriman, Mandiri, Bernalar Kritis, Kreatif, Gotong Royong.',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (row: AtpItemRow) => {
    setEditingRow(row);
    setRowForm({
      capaianPembelajaran: row.capaianPembelajaran,
      elemen: row.elemen,
      tujuanPembelajaran: row.tujuanPembelajaran,
      alokasiWaktu: row.alokasiWaktu,
      profilPancasila: row.profilPancasila,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowForm.tujuanPembelajaran.trim()) return;
    const newRow: AtpItemRow = {
      id: `atp-${Date.now()}`,
      no: atpRows.length + 1,
      capaianPembelajaran: rowForm.capaianPembelajaran || formData.capaianPembelajaran,
      elemen: rowForm.elemen || 'Elemen Capaian',
      tujuanPembelajaran: rowForm.tujuanPembelajaran,
      alokasiWaktu: rowForm.alokasiWaktu || '8 JP',
      profilPancasila: rowForm.profilPancasila || 'Mandiri, Bernalar Kritis.',
    };
    setAtpRows([...atpRows, newRow]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow || !rowForm.tujuanPembelajaran.trim()) return;
    setAtpRows((prev) =>
      prev.map((r) =>
        r.id === editingRow.id
          ? {
              ...r,
              capaianPembelajaran: rowForm.capaianPembelajaran,
              elemen: rowForm.elemen,
              tujuanPembelajaran: rowForm.tujuanPembelajaran,
              alokasiWaktu: rowForm.alokasiWaktu,
              profilPancasila: rowForm.profilPancasila,
            }
          : r
      )
    );
    setEditingRow(null);
  };

  const handleDeleteRow = (id: string) => {
    setAtpRows((prev) =>
      prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, no: idx + 1 }))
    );
    setDeleteId(null);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan butir ATP ke standar kurikulum resmi BSKAP?')) {
      handleLoadOfficialPusat();
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const rows: any[][] = [];
    rows.push(['ALUR TUJUAN PEMBELAJARAN (ATP)']);
    rows.push([formData.namaSekolah.toUpperCase()]);
    rows.push([`Mata Pelajaran: ${formData.mataPelajaran} | Kelas: ${formData.faseKelas} | Tahun: ${formData.tahunAjaran}`]);
    rows.push([]);
    rows.push(['NO', 'CAPAIAN PEMBELAJARAN', 'ELEMEN', 'TUJUAN PEMBELAJARAN', 'ALOKASI WAKTU', 'PROFIL PELAJAR PANCASILA']);
    atpRows.forEach((r) => {
      rows.push([r.no, r.capaianPembelajaran, r.elemen, r.tujuanPembelajaran, r.alokasiWaktu, r.profilPancasila]);
    });
    rows.push([]);
    rows.push(['', '', 'Mengetahui,', '', formData.peranGuru || 'Guru Kelas']);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', formData.kepalaSekolah, '', formData.namaGuru]);
    rows.push(['', '', `NIP: ${formData.nipKepalaSekolah}`, '', `NIP: ${formData.nipGuru}`]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 45 }, { wch: 20 }, { wch: 45 }, { wch: 15 }, { wch: 35 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ATP');
    XLSX.writeFile(wb, `ATP_${formData.mataPelajaran.replace(/\s+/g, '_')}_Kelas_${formData.faseKelas}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-indigo-800/40">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-3 py-1 text-xs text-indigo-200 mb-3">
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
          <span>Administrasi Guru • Alur Tujuan Pembelajaran (ATP)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          ALUR TUJUAN PEMBELAJARAN (ATP)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Penyusunan Alur Tujuan Pembelajaran (ATP) operasional dari Capaian Pembelajaran (CP) dan Elemen, lengkap dengan tombol <strong>Tambah Baris</strong>, <strong>Edit</strong>, dan <strong>Hapus</strong> pada setiap butir alur tujuan pembelajaran.
        </p>
      </div>

      {/* Interactive ATP Table Card */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-8 shadow-xs text-xs font-serif overflow-x-auto">
        {/* Banner Resmi Kemendikbudristek BSKAP */}
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950 font-sans shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-emerald-900 block">
                ✓ CP & ATP Resmi Pemerintah Pusat (BSKAP Kemendikbudristek No. 032/H/KR/2024)
              </span>
              <span className="text-[11px] text-emerald-800">
                Data Capaian Pembelajaran & Alur Tujuan Pembelajaran otomatis dimuat sesuai fase & mata pelajaran Anda (<strong>{formData.mataPelajaran}</strong> • {formData.faseKelas}). Guru tidak perlu mengetik ulang dari awal.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLoadOfficialPusat()}
            className="shrink-0 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            title="Muat ulang CP & ATP resmi dari surat edaran pusat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang CP & ATP Resmi</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 font-sans border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 font-bold text-indigo-900">
            <Info className="w-4 h-4 text-indigo-700 shrink-0" />
            <span>Matriks Alur Tujuan Pembelajaran (ATP) - Kelola Butir TP:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Tambah Baris ATP</span>
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
              onClick={() => handleLoadOfficialPusat()}
              className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
              title="Reset ke standar resmi pusat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pusat</span>
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
            ALUR TUJUAN PEMBELAJARAN (ATP)
          </div>
          <div className="mt-3 text-xs text-slate-900 space-y-1 font-mono">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold">Nama Penyusun</span>
              <span className="col-span-9">: {formData.namaGuru}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold">NIP</span>
              <span className="col-span-9">: {formData.nipGuru}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold">Kelas</span>
              <span className="col-span-9">: {formData.faseKelas}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold">Mata Pelajaran</span>
              <span className="col-span-9">: {formData.mataPelajaran}</span>
            </div>
          </div>

          <table className="w-full mt-4 border-collapse text-[10.5px]">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-slate-900 p-1.5 w-8">NO</th>
                <th className="border border-slate-900 p-1.5 text-left px-2 w-64">CAPAIAN PEMBELAJARAN</th>
                <th className="border border-slate-900 p-1.5 w-24">ELEMEN</th>
                <th className="border border-slate-900 p-1.5 text-left px-2">TUJUAN PEMBELAJARAN</th>
                <th className="border border-slate-900 p-1.5 w-16">ALOKASI WAKTU</th>
                <th className="border border-slate-900 p-1.5 w-44">PROFIL PELAJAR PANCASILA</th>
                <th className="no-print border border-slate-900 p-1.5 w-20">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {atpRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{row.no}</td>
                  <td className="border border-slate-900 p-1.5 px-2 text-slate-800">
                    {row.capaianPembelajaran}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center font-semibold text-indigo-900">
                    {row.elemen}
                  </td>
                  <td className="border border-slate-900 p-1.5 px-2 font-medium text-slate-950">
                    {row.tujuanPembelajaran}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold text-slate-900">
                    {row.alokasiWaktu}
                  </td>
                  <td className="border border-slate-900 p-1.5 px-2 text-[10px] text-slate-700">
                    {row.profilPancasila}
                  </td>
                  <td className="no-print border border-slate-900 p-1.5 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(row)}
                        className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                        title="Edit baris ATP ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(row.id)}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                        title="Hapus baris ATP ini"
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
            Konfigurasi Rumusan CP & Generator AI Sat-Set
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Mata Pelajaran <span className="text-rose-500">* (Fokus Mapel Guru)</span>
            </label>
            {allowedMapelList.length === 1 ? (
              <input
                type="text"
                disabled
                value={formData.mataPelajaran}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-100 text-sm font-bold text-slate-900"
              />
            ) : (
              <select
                value={formData.mataPelajaran}
                onChange={(e) => {
                  const newMapel = e.target.value;
                  setFormData({ ...formData, mataPelajaran: newMapel });
                  handleLoadOfficialPusat(newMapel);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:border-indigo-600 focus:outline-hidden"
              >
                {allowedMapelList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Kelas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.faseKelas}
              onChange={(e) => setFormData({ ...formData, faseKelas: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Peran Guru Penyusun
            </label>
            <select
              value={formData.peranGuru || 'Guru Kelas'}
              onChange={(e) => setFormData({ ...formData, peranGuru: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="Guru Kelas">Guru Kelas</option>
              <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Rumusan Capaian Pembelajaran (CP) Resmi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.capaianPembelajaran}
              onChange={(e) => setFormData({ ...formData, capaianPembelajaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Elemen Mata Pelajaran (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.elemenCp}
              onChange={(e) => setFormData({ ...formData, elemenCp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-xs text-slate-500">
            AI akan menyusun dokumen ATP resmi dinas lengkap siap download dan cetak.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-700 to-sky-700 hover:from-indigo-800 hover:to-sky-800 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-indigo-700/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Menyusun ATP...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Susun Dokumen ATP Sat-Set ⚡</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Tambah Baris ATP */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Tambah Baris Alur Tujuan Pembelajaran</h3>
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
                <label className="font-bold text-slate-700 block mb-1">Elemen</label>
                <input
                  type="text"
                  required
                  value={rowForm.elemen}
                  onChange={(e) => setRowForm({ ...rowForm, elemen: e.target.value })}
                  placeholder="Contoh: Pancasila / Pemahaman IPA"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={3}
                  required
                  value={rowForm.tujuanPembelajaran}
                  onChange={(e) => setRowForm({ ...rowForm, tujuanPembelajaran: e.target.value })}
                  placeholder="Contoh: 1.1 Peserta didik memahami simbol dan mengamalkan sila Pancasila..."
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alokasi Waktu (Jam)</label>
                  <input
                    type="text"
                    required
                    value={rowForm.alokasiWaktu}
                    onChange={(e) => setRowForm({ ...rowForm, alokasiWaktu: e.target.value })}
                    placeholder="Contoh: 8 JP"
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Profil Pelajar Pancasila</label>
                  <input
                    type="text"
                    value={rowForm.profilPancasila}
                    onChange={(e) => setRowForm({ ...rowForm, profilPancasila: e.target.value })}
                    placeholder="Contoh: Mandiri, Bernalar Kritis, Gotong Royong"
                    className="w-full p-2 border border-slate-300 rounded"
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
                  className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded"
                >
                  Simpan Baris ATP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Baris ATP */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Baris ATP ke-{editingRow.no}</h3>
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
                <label className="font-bold text-slate-700 block mb-1">Elemen</label>
                <input
                  type="text"
                  required
                  value={rowForm.elemen}
                  onChange={(e) => setRowForm({ ...rowForm, elemen: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-semibold text-indigo-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={3}
                  required
                  value={rowForm.tujuanPembelajaran}
                  onChange={(e) => setRowForm({ ...rowForm, tujuanPembelajaran: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alokasi Waktu (Jam)</label>
                  <input
                    type="text"
                    required
                    value={rowForm.alokasiWaktu}
                    onChange={(e) => setRowForm({ ...rowForm, alokasiWaktu: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Profil Pelajar Pancasila</label>
                  <input
                    type="text"
                    value={rowForm.profilPancasila}
                    onChange={(e) => setRowForm({ ...rowForm, profilPancasila: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
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
            <h4 className="font-bold text-sm text-slate-900 mb-1">Hapus Baris ATP Ini?</h4>
            <p className="text-xs text-slate-500 mb-4">
              Baris alur tujuan pembelajaran ini akan dihapus dari daftar matriks ATP.
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
