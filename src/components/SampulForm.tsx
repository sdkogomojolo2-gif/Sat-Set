import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Zap,
  CheckCircle2,
  Building2,
  User,
  Info,
  Layers,
  FileCheck,
  Plus,
  Trash2,
  Edit2,
  X,
  Printer,
  Download,
  RotateCcw,
} from 'lucide-react';
import { SampulParams, SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';

interface SampulFormProps {
  onGenerateSampul: (params: SampulParams) => void;
  schoolProfile: SchoolTeacherProfile;
  currentUser?: UserAccount;
}

const STORAGE_KEY_SAMPUL = 'satset_sampul_items_v3';

const DEFAULT_ITEMS = [
  'Kalender Pendidikan',
  'Modul Ajar (MA)',
  'Alur Tujuan Pembelajaran (ATP)',
  'Program Semester (PROSEM)',
  'Program Tahunan (PROTA)',
  'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
];

export const SampulForm: React.FC<SampulFormProps> = ({
  onGenerateSampul,
  schoolProfile,
  currentUser,
}) => {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAMPUL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAMPUL, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const [formData, setFormData] = useState<SampulParams>({
    namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || 'SDN 4 PALASA',
    dinasPendidikan: schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
    faseKelas: currentUser?.kelasYangDiajar || schoolProfile.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1',
    tahunAjaran: '2024/2025',
    namaGuru: currentUser?.name || schoolProfile.namaGuru || 'MARWINI, A.Ma',
    nipGuru: currentUser?.nip || schoolProfile.nipGuru || '196608151986062001',
    daftarIsiPerangkat: items,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      daftarIsiPerangkat: items,
      namaSekolah: currentUser?.namaSekolah || schoolProfile.namaSekolah || prev.namaSekolah,
      namaGuru: currentUser?.name || schoolProfile.namaGuru || prev.namaGuru,
      nipGuru: currentUser?.nip || schoolProfile.nipGuru || prev.nipGuru,
    }));
  }, [items, currentUser, schoolProfile]);

  // Modal / Inline Edit states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    setItems((prev) => [...prev, newDocTitle.trim()]);
    setNewDocTitle('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdx === null || !editingValue.trim()) return;
    setItems((prev) => {
      const copy = [...prev];
      copy[editingIdx] = editingValue.trim();
      return copy;
    });
    setEditingIdx(null);
    setEditingValue('');
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset daftar isi berkas ke format standar dinas?')) {
      setItems(DEFAULT_ITEMS);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateSampul({ ...formData, daftarIsiPerangkat: items });
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-blue-800/40">
        <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-xs text-blue-200 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>Sampul Resmi Berstandar Kemendikbudristek</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          SAMPUL PERANGKAT PEMBELAJARAN
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Sampul bundel berkas perangkat pembelajaran Kurikulum Merdeka resmi dengan logo Tut Wuri Handayani, Merdeka Mengajar, identitas sekolah & guru, serta kotak indeks isi berkas perangkat yang dapat Anda <strong>Tambah</strong>, <strong>Edit</strong>, dan <strong>Hapus</strong>.
        </p>
      </div>

      {/* Visual Replica Preview Card */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 mb-8 shadow-xs text-xs font-serif">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 font-sans border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 font-bold text-blue-900">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Pratinjau Desain Sampul A4 (Persis Sesuai Format Dinas):</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Berkas</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
              title="Reset ke daftar bawaan dinas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
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

        <div className="max-w-md mx-auto bg-white border-4 border-blue-700 p-6 rounded shadow-lg text-center relative overflow-hidden">
          {/* Logo Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1.5 text-left">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                MM
              </div>
              <div className="leading-tight text-[9px] font-sans font-bold text-slate-800">
                Merdeka<br />Mengajar
              </div>
            </div>

            {/* Logo Tut Wuri Handayani */}
            <div className="w-14 h-14 rounded-full border-2 border-amber-400 flex items-center justify-center bg-blue-50 mx-auto shadow-inner">
              <div className="w-11 h-11 rounded-full bg-sky-600 border border-white flex items-center justify-center text-white font-serif font-black text-xs">
                🎓
              </div>
            </div>

            <div className="w-14"></div>
          </div>

          <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900">
            {formData.dinasPendidikan}
          </h3>
          <h2 className="font-extrabold text-sm uppercase tracking-wide text-slate-950 mt-0.5">
            {formData.namaSekolah}
          </h2>

          <div className="my-6">
            <h1 className="font-black text-lg sm:text-xl uppercase tracking-tighter text-slate-950 leading-tight font-sans">
              PERANGKAT PEMBELAJARAN<br />KURIKULUM MERDEKA
            </h1>
            <p className="font-bold text-sm text-slate-900 mt-2">
              Kelas {formData.faseKelas}
            </p>
          </div>

          {/* Teacher Identity */}
          <div className="text-left font-mono text-xs max-w-xs mx-auto space-y-1 mb-5 font-semibold text-slate-900">
            <p>Nama Guru : {formData.namaGuru}</p>
            <p>NIP &nbsp; &nbsp; &nbsp; : {formData.nipGuru}</p>
          </div>

          {/* Checklist Box with Edit & Hapus Buttons */}
          <div className="border border-slate-900 p-3 max-w-xs mx-auto text-left text-[11px] font-sans space-y-1.5 bg-slate-50/50">
            <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-300 pb-1 mb-1 text-[10px] uppercase">
              <span>Daftar Berkas Terlampir:</span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="no-print text-blue-700 hover:underline flex items-center space-x-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah</span>
              </button>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between group py-0.5">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-blue-700 font-bold shrink-0">✎</span>
                  <span className="text-slate-800 font-medium truncate">{item}</span>
                </div>
                <div className="no-print flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIdx(idx);
                      setEditingValue(item);
                    }}
                    className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                    title="Edit nama berkas ini"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                    title="Hapus berkas ini dari sampul"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 mt-4 italic font-sans">
            Tahun Pelajaran {formData.tahunAjaran}
          </p>
        </div>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
            Pengaturan Sampul Perangkat Pembelajaran
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Nama Satuan Pendidikan (Sekolah) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.namaSekolah}
              onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Dinas Pendidikan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.dinasPendidikan}
              onChange={(e) => setFormData({ ...formData, dinasPendidikan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Tahun Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tahunAjaran}
              onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              Nama Guru Pengampu & Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.namaGuru}
              onChange={(e) => setFormData({ ...formData, namaGuru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
              NIP Guru
            </label>
            <input
              type="text"
              value={formData.nipGuru}
              onChange={(e) => setFormData({ ...formData, nipGuru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-xs text-slate-500">
            Dapat langsung dicetak ke kertas A4 atau diunduh sebagai Word (.doc) dan PDF!
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-blue-700/25 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Tampilkan Sampul Resmi Sat-Set ⚡</span>
          </button>
        </div>
      </form>

      {/* Modal Tambah Berkas */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Tambah Berkas ke Sampul</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Judul Berkas / Perangkat</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Contoh: Pemetaan Kompetensi Dasar / ATP"
                  className="w-full p-2 border border-slate-300 rounded text-xs"
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
                  Tambahkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Berkas */}
      {editingIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Judul Berkas Sampul</h3>
              <button
                type="button"
                onClick={() => setEditingIdx(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Judul Berkas</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-medium"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingIdx(null)}
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
    </div>
  );
};
