import React, { useState } from 'react';
import {
  Building2,
  User,
  ShieldCheck,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  Sparkles,
} from 'lucide-react';
import { SchoolTeacherProfile } from '../types/modul';

interface SchoolProfileModalProps {
  profile: SchoolTeacherProfile;
  onSaveProfile: (profile: SchoolTeacherProfile) => void;
  onClose?: () => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<SchoolTeacherProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleJenjangChange = (jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK') => {
    setFormData((prev) => ({
      ...prev,
      jenjang,
      dinasPendidikan: jenjang === 'SMA' || jenjang === 'SMK'
        ? 'Dinas Pendidikan Provinsi'
        : 'Dinas Pendidikan Kabupaten/Kota',
      cabangDinas: jenjang === 'SMA' || jenjang === 'SMK'
        ? (prev.cabangDinas || 'Cabang Dinas Pendidikan Wilayah II')
        : '',
    }));
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-indigo-800/40">
        <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/30 rounded-full px-3 py-1 text-xs text-sky-200 mb-3">
          <Building2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Administrasi Profil Resmi Dinas Pendidikan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Data Identitas Satuan Pendidikan, Kepala Sekolah & Guru
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Seluruh data yang Anda isikan di formulir ini akan tersimpan permanen dan secara otomatis terintegrasi ke dalam Kop Surat Kedinasan, Tabel Identitas Administrasi, serta Lembar Pengesahan 3 Pihak pada seluruh dokumen (Modul Ajar, Prota, Promes, Modul P5, dan Bank Soal).
        </p>
      </div>

      {isSaved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center space-x-2 text-sm font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Data identitas sekolah, kepala sekolah, dan guru berhasil disimpan secara permanen!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BAGIAN 1: IDENTITAS SATUAN PENDIDIKAN */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
            <Building2 className="w-5 h-5 text-sky-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              1. Identitas Satuan Pendidikan (Sekolah / Madrasah)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap Satuan Pendidikan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                placeholder="Contoh: SMP Negeri 1 Nusantara / SMA Negeri 3 Jakarta / SD Negeri Pagi"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NPSN Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                placeholder="Contoh: 20101234"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jenjang Pendidikan
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['SD', 'SMP', 'SMA', 'SMK'] as const).map((jenjang) => (
                  <button
                    key={jenjang}
                    type="button"
                    onClick={() => handleJenjangChange(jenjang)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      formData.jenjang === jenjang
                        ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {jenjang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status Satuan Pendidikan
              </label>
              <select
                value={formData.statusSekolah}
                onChange={(e) => setFormData({ ...formData, statusSekolah: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900 bg-white"
              >
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Peringkat Akreditasi
              </label>
              <select
                value={formData.akreditasi}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900 bg-white"
              >
                <option value="A">Terakreditasi A (Unggul)</option>
                <option value="B">Terakreditasi B (Baik)</option>
                <option value="C">Terakreditasi C (Cukup)</option>
                <option value="Belum Terakreditasi">Belum Terakreditasi</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Instansi Dinas Pendidikan Pembina <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.dinasPendidikan}
                onChange={(e) => setFormData({ ...formData, dinasPendidikan: e.target.value })}
                placeholder="Contoh: Dinas Pendidikan dan Kebudayaan / Dinas Pendidikan Provinsi"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Cabang Dinas Pendidikan (Khusus SMA/SMK)
              </label>
              <input
                type="text"
                value={formData.cabangDinas || ''}
                onChange={(e) => setFormData({ ...formData, cabangDinas: e.target.value })}
                placeholder="Contoh: Cabang Dinas Wilayah II (Kosongkan bila SD/SMP)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Lengkap Satuan Pendidikan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.alamatSekolah}
                onChange={(e) => setFormData({ ...formData, alamatSekolah: e.target.value })}
                placeholder="Contoh: Jl. Pendidikan No. 45, RT 02 / RW 05"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kota / Kabupaten <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.kotaKabupaten}
                onChange={(e) => setFormData({ ...formData, kotaKabupaten: e.target.value })}
                placeholder="Contoh: Jakarta / Bandung / Surabaya"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kecamatan
              </label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                placeholder="Contoh: Gambir / Sukajadi"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Provinsi
              </label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                placeholder="Contoh: DKI Jakarta / Jawa Barat"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kontak Telepon / Email Sekolah
              </label>
              <input
                type="text"
                value={formData.teleponEmail}
                onChange={(e) => setFormData({ ...formData, teleponEmail: e.target.value })}
                placeholder="Contoh: (021) 345678 / sekolah@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 2: IDENTITAS KEPALA SEKOLAH */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
            <GraduationCap className="w-5 h-5 text-indigo-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              2. Data Kepala Satuan Pendidikan (Penandatangan Dokumen)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap & Gelar Kepala Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.kepalaSekolah}
                onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                placeholder="Contoh: Dr. H. Sulaiman, M.Pd."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NIP / NUPTK Kepala Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                placeholder="Contoh: 19750512 200003 1 004"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pangkat / Golongan Ruang
              </label>
              <input
                type="text"
                value={formData.pangkatGolonganKepsek || ''}
                onChange={(e) => setFormData({ ...formData, pangkatGolonganKepsek: e.target.value })}
                placeholder="Contoh: Pembina Utama Muda, IV/c"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 3: IDENTITAS GURU PENGAMPU */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
            <User className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              3. Data Diri Guru Pengampu (Penyusun Modul Ajar)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap & Gelar Guru <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.namaGuru}
                onChange={(e) => setFormData({ ...formData, namaGuru: e.target.value })}
                placeholder="Contoh: Fadli R., S.Pd., Gr."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NIP / NUPTK / NI P3K Guru <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nipGuru}
                onChange={(e) => setFormData({ ...formData, nipGuru: e.target.value })}
                placeholder="Contoh: 19900101 202012 1 001"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mata Pelajaran Utama Diampu
              </label>
              <input
                type="text"
                value={formData.mataPelajaranGuru}
                onChange={(e) => setFormData({ ...formData, mataPelajaranGuru: e.target.value })}
                placeholder="Contoh: Ilmu Pengetahuan Alam (IPA)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fase & Jenjang Kelas Diampu
              </label>
              <input
                type="text"
                value={formData.faseKelasDiampu}
                onChange={(e) => setFormData({ ...formData, faseKelasDiampu: e.target.value })}
                placeholder="Contoh: Fase D (Kelas VII SMP)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp / HP Guru
              </label>
              <input
                type="text"
                value={formData.noHpGuru || ''}
                onChange={(e) => setFormData({ ...formData, noHpGuru: e.target.value })}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 4: IDENTITAS PENGAWAS PEMBINA */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 mb-6">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              4. Data Pengawas Pembina Dinas Pendidikan (Verifikator Supervisi)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Pengawas Pembina Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.pengawasSekolah}
                onChange={(e) => setFormData({ ...formData, pengawasSekolah: e.target.value })}
                placeholder="Contoh: Dr. H. Subagyo, M.Pd."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                NIP Pengawas Pembina <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nipPengawas}
                onChange={(e) => setFormData({ ...formData, nipPengawas: e.target.value })}
                placeholder="Contoh: 19680315 199503 1 002"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-600 text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Tombol Simpan Profil */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            * Data tersimpan aman di peramban dan dapat diperbarui sewaktu-waktu.
          </p>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-700 to-indigo-800 hover:from-sky-800 hover:to-indigo-900 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-sky-700/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Simpan Seluruh Data Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
};
