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
import { ProtaParams, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import { getKurikulumPusat, getMataPelajaranKhususGuru } from '../data/kurikulumPusat';
import * as XLSX from 'xlsx';

interface ProtaFormProps {
  onGenerate: (params: ProtaParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

export interface ProtaItemRow {
  id: string;
  no: number;
  noAtp: string;
  alurTujuan: string;
  jam: string;
  smt: string;
}

const STORAGE_KEY_PROTA = 'satset_prota_items_v4';

export const ProtaForm: React.FC<ProtaFormProps> = ({
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

  const initialKurikulum = getKurikulumPusat(targetJenjang, currentUser?.mataPelajaran || defaultMapel, targetFase);

  const [formData, setFormData] = useState<ProtaParams>({
    mataPelajaran: initialKurikulum.mataPelajaran || defaultMapel,
    jenjang: targetJenjang as any,
    faseKelas: targetFase,
    tahunAjaran: '2026/2027',
    alokasiTotalJP: initialKurikulum.alokasiJPTahunan || (isSMP ? '180 JP (5 JP / Minggu)' : '144 JP (4 JP / Minggu)'),
    lingkupMateriUtama: initialKurikulum.daftarMateriPokok.join('; '),
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '196608151986062001',
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || (isSMP ? 'SMP NEGERI 1 PALASA' : 'SD NEGERI 1 PALASA'),
    kepalaSekolah: schoolProfile.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah || '19700712 199606 1 001',
    kotaKabupaten: schoolProfile.kotaKabupaten || 'Kab. Parigi Moutong',
    peranGuru: isSMP ? 'Guru Mata Pelajaran' : 'Guru Kelas',
  });

  // Dynamic CRUD rows for PROTA (Otomatis dari BSKAP Pusat)
  const [protaRows, setProtaRows] = useState<ProtaItemRow[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PROTA}_${initialKurikulum.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    return initialKurikulum.atpList.map((item, idx) => ({
      id: `prota-pusat-${idx + 1}-${Date.now()}`,
      no: item.no,
      noAtp: item.tujuanPembelajaran.match(/^[0-9]+\.[0-9]+/)?.[0] || `${idx + 1}.1`,
      alurTujuan: item.tujuanPembelajaran,
      jam: item.alokasiWaktu.replace(/[^0-9]/g, '') || '16',
      smt: item.semester === 'Ganjil' ? '1' : '2',
    }));
  });

  // Fungsi muat ulang PROTA resmi pusat
  const handleLoadOfficialProta = (customMapel?: string) => {
    const mapelTarget = customMapel || formData.mataPelajaran;
    const kurikulum = getKurikulumPusat(targetJenjang, mapelTarget, formData.faseKelas);

    const rows: ProtaItemRow[] = kurikulum.atpList.map((item, idx) => ({
      id: `prota-pusat-${idx + 1}-${Date.now()}`,
      no: item.no,
      noAtp: item.tujuanPembelajaran.match(/^[0-9]+\.[0-9]+/)?.[0] || `${idx + 1}.1`,
      alurTujuan: item.tujuanPembelajaran,
      jam: item.alokasiWaktu.replace(/[^0-9]/g, '') || '16',
      smt: item.semester === 'Ganjil' ? '1' : '2',
    }));

    setFormData((prev) => ({
      ...prev,
      mataPelajaran: kurikulum.mataPelajaran,
      alokasiTotalJP: kurikulum.alokasiJPTahunan,
      lingkupMateriUtama: kurikulum.daftarMateriPokok.join('; '),
    }));
    setProtaRows(rows);

    try {
      localStorage.setItem(`${STORAGE_KEY_PROTA}_${kurikulum.id}`, JSON.stringify(rows));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROTA, JSON.stringify(protaRows));
    } catch (e) {}
  }, [protaRows]);

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
        alokasiTotalJP: kurikulum.alokasiJPTahunan,
        lingkupMateriUtama: kurikulum.daftarMateriPokok.join('; '),
        faseKelas: fase,
        namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
        namaGuru: currentUser.name || prev.namaGuru,
        nipGuru: currentUser.nip || prev.nipGuru,
        peranGuru: currentUser.teacherLevel === 'SMP' ? 'Guru Mata Pelajaran' : 'Guru Kelas',
      }));

      const rows: ProtaItemRow[] = kurikulum.atpList.map((item, idx) => ({
        id: `prota-pusat-${idx + 1}-${Date.now()}`,
        no: item.no,
        noAtp: item.tujuanPembelajaran.match(/^[0-9]+\.[0-9]+/)?.[0] || `${idx + 1}.1`,
        alurTujuan: item.tujuanPembelajaran,
        jam: item.alokasiWaktu.replace(/[^0-9]/g, '') || '16',
        smt: item.semester === 'Ganjil' ? '1' : '2',
      }));
      setProtaRows(rows);
    }
  }, [currentUser]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProtaItemRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [rowForm, setRowForm] = useState<{
    noAtp: string;
    alurTujuan: string;
    jam: string;
    smt: string;
  }>({
    noAtp: '',
    alurTujuan: '',
    jam: '8',
    smt: '1',
  });

  const handleOpenAdd = () => {
    const nextIdx = protaRows.length + 1;
    setRowForm({
      noAtp: `1.${nextIdx}`,
      alurTujuan: '',
      jam: '8',
      smt: nextIdx <= 3 ? '1' : '2',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (row: ProtaItemRow) => {
    setEditingRow(row);
    setRowForm({
      noAtp: row.noAtp,
      alurTujuan: row.alurTujuan,
      jam: row.jam,
      smt: row.smt,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowForm.alurTujuan.trim()) return;
    const newRow: ProtaItemRow = {
      id: `prota-${Date.now()}`,
      no: protaRows.length + 1,
      noAtp: rowForm.noAtp || `1.${protaRows.length + 1}`,
      alurTujuan: rowForm.alurTujuan,
      jam: rowForm.jam || '8',
      smt: rowForm.smt || '1',
    };
    setProtaRows([...protaRows, newRow]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow || !rowForm.alurTujuan.trim()) return;
    setProtaRows((prev) =>
      prev.map((r) =>
        r.id === editingRow.id
          ? {
              ...r,
              noAtp: rowForm.noAtp,
              alurTujuan: rowForm.alurTujuan,
              jam: rowForm.jam,
              smt: rowForm.smt,
            }
          : r
      )
    );
    setEditingRow(null);
  };

  const handleDeleteRow = (id: string) => {
    setProtaRows((prev) =>
      prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, no: idx + 1 }))
    );
    setDeleteId(null);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan butir PROTA ke standar kurikulum resmi BSKAP?')) {
      handleLoadOfficialProta();
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const rows: any[][] = [];
    rows.push(['PROGRAM TAHUNAN (PROTA)']);
    rows.push([formData.namaSekolah.toUpperCase()]);
    rows.push([`Kelas: ${formData.faseKelas} | Mapel: ${formData.mataPelajaran} | Tahun: ${formData.tahunAjaran}`]);
    rows.push([]);
    rows.push(['No.', 'No ATP', 'Alur tujuan Pembelajaran (ATP)', 'Jam', 'SMT']);
    protaRows.forEach((r) => {
      rows.push([r.no, r.noAtp, r.alurTujuan, r.jam, r.smt]);
    });
    rows.push([]);
    rows.push(['', '', 'Mengetahui,', '', formData.peranGuru || 'Guru Kelas']);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', formData.kepalaSekolah, '', formData.namaGuru]);
    rows.push(['', '', `NIP: ${formData.nipKepalaSekolah}`, '', `NIP: ${formData.nipGuru}`]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 12 }, { wch: 60 }, { wch: 8 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PROTA');
    XLSX.writeFile(wb, `PROTA_${formData.mataPelajaran.replace(/\s+/g, '_')}_Kelas_${formData.faseKelas}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-blue-800/40">
        <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-xs text-blue-200 mb-3">
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
          <span>Administrasi Guru • Program Tahunan (PROTA)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          PROGRAM TAHUNAN (PROTA)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Penyusunan Program Tahunan resmi berstandar kedinasan dengan kolom No, No ATP, Alur Tujuan Pembelajaran, Alokasi Jam, dan Semester. Lengkap dengan tombol <strong>Tambah</strong>, <strong>Edit</strong>, dan <strong>Hapus</strong> pada setiap baris ATP.
        </p>
      </div>

      {/* Interactive PROTA Table Card */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-8 shadow-xs text-xs font-serif overflow-x-auto">
        {/* Banner Resmi Kemendikbudristek BSKAP */}
        <div className="mb-4 bg-blue-50 border border-blue-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-blue-950 font-sans shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-blue-900 block">
                ✓ PROTA Resmi Pusat (BSKAP Kemendikbudristek No. 032/H/KR/2024)
              </span>
              <span className="text-[11px] text-blue-800">
                Program Tahunan & Alokasi JP tahunan otomatis dimuat dari surat edaran resmi pusat untuk mapel <strong>{formData.mataPelajaran}</strong> ({formData.faseKelas}).
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLoadOfficialProta()}
            className="shrink-0 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            title="Muat ulang PROTA resmi sesuai surat edaran pusat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang PROTA Resmi</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 font-sans border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 font-bold text-blue-900">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Matriks Program Tahunan (PROTA) - Kelola Baris Materi & Jam:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Tambah Baris PROTA</span>
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
              onClick={() => handleLoadOfficialProta()}
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

        <div className="border-2 border-slate-800 bg-white p-4 rounded max-w-3xl mx-auto">
          <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-sm uppercase bg-slate-50 tracking-wider">
            PROGRAM TAHUNAN (PROTA)
          </div>
          <div className="mt-3 text-xs font-bold text-slate-900 space-y-0.5">
            <p>Kelas &nbsp;: {formData.faseKelas}</p>
            <p>Mapel : {formData.mataPelajaran}</p>
          </div>

          <table className="w-full mt-3 border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-slate-900 p-1.5 w-10">No.</th>
                <th className="border border-slate-900 p-1.5 w-16">No ATP</th>
                <th className="border border-slate-900 p-1.5 text-left px-3">Alur tujuan Pembelajaran (ATP)</th>
                <th className="border border-slate-900 p-1.5 w-14">Jam</th>
                <th className="border border-slate-900 p-1.5 w-14">SMT</th>
                <th className="no-print border border-slate-900 p-1.5 w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {protaRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{row.no}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{row.noAtp}</td>
                  <td className="border border-slate-900 p-1.5 px-3 text-slate-900">{row.alurTujuan}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-bold">{row.jam}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-semibold">{row.smt}</td>
                  <td className="no-print border border-slate-900 p-1.5 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(row)}
                        className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                        title="Edit baris PROTA ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(row.id)}
                        className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                        title="Hapus baris PROTA ini"
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
          <Sparkles className="w-5 h-5 text-blue-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
            Konfigurasi Alokasi & Generator AI PROTA
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
                  handleLoadOfficialProta(newMapel);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:border-blue-600 focus:outline-hidden"
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
              Total Alokasi Jam Pertahun
            </label>
            <input
              type="text"
              value={formData.alokasiTotalJP}
              onChange={(e) => setFormData({ ...formData, alokasiTotalJP: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Daftar Bab / Lingkup Materi Pokok (Pisahkan dengan titik koma ;) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.lingkupMateriUtama}
              onChange={(e) => setFormData({ ...formData, lingkupMateriUtama: e.target.value })}
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
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-blue-700/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Menyusun PROTA...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Susun Program Tahunan Sat-Set ⚡</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Tambah Baris PROTA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Tambah Baris Program Tahunan (PROTA)</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
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
                    placeholder="Contoh: 8"
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={rowForm.smt}
                    onChange={(e) => setRowForm({ ...rowForm, smt: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold bg-white"
                  >
                    <option value="1">1 (Ganjil)</option>
                    <option value="2">2 (Genap)</option>
                  </select>
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
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Simpan Baris PROTA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Baris PROTA */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Baris PROTA ke-{editingRow.no}</h3>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={rowForm.smt}
                    onChange={(e) => setRowForm({ ...rowForm, smt: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-bold bg-white"
                  >
                    <option value="1">1 (Ganjil)</option>
                    <option value="2">2 (Genap)</option>
                  </select>
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
            <h4 className="font-bold text-sm text-slate-900 mb-1">Hapus Baris PROTA Ini?</h4>
            <p className="text-xs text-slate-500 mb-4">
              Baris materi dan alokasi jam ini akan dihapus dari dokumen Program Tahunan.
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
