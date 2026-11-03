import React, { useState } from 'react';
import {
  Presentation,
  Zap,
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { SlideAjarParams, SchoolTeacherProfile } from '../types/modul';

interface SlideAjarFormProps {
  onGenerate: (params: SlideAjarParams) => Promise<void>;
  isLoading: boolean;
  schoolProfile: SchoolTeacherProfile;
}

export const SlideAjarForm: React.FC<SlideAjarFormProps> = ({
  onGenerate,
  isLoading,
  schoolProfile,
}) => {
  const [formData, setFormData] = useState<SlideAjarParams>({
    mataPelajaran: schoolProfile.mataPelajaranGuru || 'Ilmu Pengetahuan Alam (IPA)',
    jenjang: schoolProfile.jenjang || 'SMP',
    faseKelas: schoolProfile.faseKelasDiampu || 'Fase D (Kelas VII SMP)',
    topikMateri: 'Interaksi Antar Komponen Ekosistem dan Jaring-Jaring Makanan',
    jumlahSlide: 7,
    namaGuru: schoolProfile.namaGuru,
    namaSekolah: schoolProfile.namaSekolah,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-rose-800/40">
        <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-400/30 rounded-full px-3 py-1 text-xs text-rose-200 mb-3">
          <Presentation className="w-3.5 h-3.5 text-amber-300" />
          <span>Media Presentasi Interaktif Canva & PowerPoint Ready</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Generator Slide Bahan Ajar Pembelajaran Kelas
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Ubah materi ajar Anda menjadi slide presentasi ringkas, visual, dan menarik untuk ditampilkan lewat proyektor di kelas. Lengkap dengan instruksi visual guru, pertanyaan pemantik, studi kasus, panduan aktivitas kelompok, kuis cepat, dan rangkuman.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topik / Materi Pembelajaran Kelas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.topikMateri}
              onChange={(e) => setFormData({ ...formData, topikMateri: e.target.value })}
              placeholder="Contoh: Ekosistem dan Jaring Makanan, Hukum Newton, Persamaan Linear..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.mataPelajaran}
              onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
              placeholder="Contoh: IPA / Fisika / Bahasa Indonesia"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fase & Jenjang Kelas
            </label>
            <input
              type="text"
              value={formData.faseKelas}
              onChange={(e) => setFormData({ ...formData, faseKelas: e.target.value })}
              placeholder="Contoh: Fase D (Kelas 7 SMP)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jumlah Slide Tayangan
            </label>
            <select
              value={formData.jumlahSlide}
              onChange={(e) => setFormData({ ...formData, jumlahSlide: parseInt(e.target.value) || 7 })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value={5}>5 Slide Ringkas (1 JP)</option>
              <option value={7}>7 Slide Lengkap Standard (2 JP)</option>
              <option value={10}>10 Slide Mendalam & Interaktif (3 JP)</option>
            </select>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Teks tayangan dapat langsung disalin ke Canva atau Microsoft PowerPoint.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-700 to-indigo-800 hover:from-rose-800 hover:to-indigo-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-rose-700/25 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isLoading ? 'Menyusun Slide Bahan Ajar...' : 'Buat Slide Bahan Ajar Sat-Set ⚡'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
