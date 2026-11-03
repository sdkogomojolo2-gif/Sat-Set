import React, { useState } from 'react';
import {
  Calendar,
  Zap,
  Sparkles,
  Clock,
  BookOpen,
  GraduationCap,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { ProtaPromesParams, SchoolTeacherProfile } from '../types/modul';

interface ProtaPromesFormProps {
  onGenerate: (params: ProtaPromesParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
}

export const ProtaPromesForm: React.FC<ProtaPromesFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
}) => {
  const [formData, setFormData] = useState<ProtaPromesParams>({
    mataPelajaran: schoolProfile.mataPelajaranGuru || 'Ilmu Pengetahuan Alam (IPA)',
    jenjang: schoolProfile.jenjang || 'SMP',
    faseKelas: schoolProfile.faseKelasDiampu || 'Fase D (Kelas VII SMP)',
    tahunAjaran: '2026/2027',
    semester: 'Keduanya',
    alokasiJPTotal: '72 JP (36 Minggu Efektif)',
    daftarMateriPokok: 'Bab 1: Hakikat Ilmu Sains & Pengukuran, Bab 2: Zat & Perubahannya, Bab 3: Suhu, Kalor & Pemuaian, Bab 4: Gerak & Gaya, Bab 5: Klasifikasi Makhluk Hidup & Ekosistem, Bab 6: Bumi & Tata Surya',
    namaGuru: schoolProfile.namaGuru,
    nipGuru: schoolProfile.nipGuru,
    namaSekolah: schoolProfile.namaSekolah,
    kepalaSekolah: schoolProfile.kepalaSekolah,
    nipKepalaSekolah: schoolProfile.nipKepalaSekolah,
    kotaKabupaten: schoolProfile.kotaKabupaten,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-emerald-800/40">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 text-xs text-emerald-200 mb-3">
          <Calendar className="w-3.5 h-3.5 text-amber-300" />
          <span>Administrasi Tahunan Resmi Kurikulum Merdeka</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Generator PROTA & PROMES Format Dinas Pendidikan
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Menyusun secara otomatis Program Tahunan (PROTA) dan Program Semester (PROMES) lengkap dengan analisis minggu efektif, distribusi jam pelajaran per bab materi pokok, jadwal Asesmen Sumatif (STS/SAS), dan lembar pengesahan kepala sekolah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
          <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Formulir Parameter Program Tahunan & Semester
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.mataPelajaran}
              onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
              placeholder="Contoh: Matematika / IPA / Bahasa Indonesia"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fase & Jenjang Kelas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.faseKelas}
              onChange={(e) => setFormData({ ...formData, faseKelas: e.target.value })}
              placeholder="Contoh: Fase D (Kelas VII SMP)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tahun Ajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tahunAjaran}
              onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
              placeholder="2026/2027"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cakupan Program Semester
            </label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="Keduanya">Semester Ganjil & Genap (1 Tahun Penuh)</option>
              <option value="Ganjil">Semester Ganjil Saja</option>
              <option value="Genap">Semester Genap Saja</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Total Alokasi Waktu (Jam Pelajaran 1 Tahun)
            </label>
            <input
              type="text"
              value={formData.alokasiJPTotal}
              onChange={(e) => setFormData({ ...formData, alokasiJPTotal: e.target.value })}
              placeholder="Contoh: 72 JP (36 Minggu Efektif x 2 JP)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Daftar Materi Pokok / Lingkup Pembelajaran 1 Tahun <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.daftarMateriPokok}
              onChange={(e) => setFormData({ ...formData, daftarMateriPokok: e.target.value })}
              placeholder="Sebutkan bab atau lingkup materi yang diajarkan dalam 1 tahun ajaran..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Tabel minggu efektif dan kalender promes disesuaikan dengan kalender pendidikan nasional.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isLoading ? 'Menyusun PROTA & PROMES...' : 'Buat PROTA & PROMES Sat-Set ⚡'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
