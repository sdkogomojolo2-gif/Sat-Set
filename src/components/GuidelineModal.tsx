import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
  ShieldCheck,
  Target,
  FileCheck,
  Building2,
  GraduationCap,
  Award,
  Users,
  Search,
  Printer,
  FileSpreadsheet,
  Calendar,
  ClipboardList,
  AlertCircle,
  Lock,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  BookMarked,
  ArrowRight,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface GuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideSection = 'alur' | 'multi_guru' | 'admin_guru' | 'admin_kelas' | 'cetak_a4' | 'faq' | 'kontak';

export const GuidelineModal: React.FC<GuidelineModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<GuideSection>('alur');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans text-slate-800">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Header Buku Petunjuk */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center shadow-md">
              <BookMarked className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Buku Petunjuk & Bantuan Aplikasi
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Sat-Set v2.4
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Panduan lengkap fitur, alur kerja guru, dan solusi cepat apabila menghadapi kesulitan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Petunjuk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader: Quick Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center overflow-x-auto space-x-1 shrink-0 text-xs font-bold custom-scrollbar">
          <button
            onClick={() => setActiveSection('alur')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'alur'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Alur & Pendaftaran</span>
          </button>

          <button
            onClick={() => setActiveSection('multi_guru')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'multi_guru'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Keamanan Multi-Guru (10+ Akun)</span>
          </button>

          <button
            onClick={() => setActiveSection('admin_guru')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'admin_guru'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>3. Administrasi Guru (Kurikulum)</span>
          </button>

          <button
            onClick={() => setActiveSection('admin_kelas')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'admin_kelas'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
            <span>4. Administrasi Kelas</span>
          </button>

          <button
            onClick={() => setActiveSection('cetak_a4')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'cetak_a4'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>5. Cetak A4 & Unduh Word/Excel</span>
          </button>

          <button
            onClick={() => setActiveSection('faq')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'faq'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>6. Solusi Kesulitan (FAQ)</span>
          </button>

          <button
            onClick={() => setActiveSection('kontak')}
            className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeSection === 'kontak'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7. Bantuan Cepat WhatsApp</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 custom-scrollbar">
          
          {/* TAB 1: ALUR & PENDAFTARAN */}
          {activeSection === 'alur' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <h4 className="font-black text-sky-950 text-sm flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  <span>Alur Memulai & Hak Akses Penggunaan Aplikasi</span>
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Aplikasi <strong>Sat-Set</strong> dirancang untuk mempermudah guru SD dan SMP dalam menyusun berkas administrasi perangkat pembelajaran dan administrasi kelas tanpa perlu repot mengetik ulang format dinas secara manual.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs mb-2">
                    1
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Pilih Jenjang Sekolah</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih <strong>Sekolah Dasar (SD)</strong> atau <strong>Sekolah Menengah Pertama (SMP)</strong>. Pilihan ini akan menyesuaikan durasi JP (35 menit vs 40 menit) dan format administrasi.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs mb-2">
                    2
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Pilih Peran Mengajar</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>SD</strong>: Guru Kelas (1-6) terkunci otomatis hanya mapel tematik kelasnya; atau Guru Khusus PJOK / Agama Islam.<br />
                    <strong>SMP</strong>: Guru Mapel spesifik (IPA, MTK, B. Indo, B. Inggris, IPS, PPKn, PJOK, Informatika, Seni, PAI).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black flex items-center justify-center text-xs mb-2">
                    3
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Aktivasi Akun DANA</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Biaya lisensi Rp 50.000 (Akses Selamanya). Transfer ke DANA <strong>0822-9056-9062</strong> (a.n. Fadli). Kirim bukti lewat WhatsApp atau admin langsung mengaktifkan di Panel Admin.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h5 className="font-bold text-emerald-900 flex items-center space-x-2 mb-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Keamanan Akun & Kredensial Admin</span>
                </h5>
                <p className="text-xs text-slate-600">
                  Form masuk tidak lagi menampilkan email/sandi admin secara publik. Pemilik aplikasi (admin) dapat langsung masuk menggunakan akun admin berwenang untuk mengakses panel persetujuan guru di pojok kanan bawah atau sidebar.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-GURU (10+ GURU) */}
          {activeSection === 'multi_guru' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-xl p-4.5">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-950 text-sm mb-1">
                      Bagaimana Jika Ada 10 Guru Menggunakan Aplikasi Ini? Apakah Data Tercampur / Saling Tindih?
                    </h4>
                    <p className="text-xs text-emerald-800 font-bold">
                      Jawabannya: TIDAK AKAN TERCAMPUR DAN TIDAK AKAN SALING TINDIH. Sistem dilengkapi Isolasi Data Penuh (User-Scoped Storage).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Mekanisme Perlindungan & Pemisahan Data:
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2 mb-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">1</span>
                      <span>Kunci Penyimpanan Khusus ID Guru (Scoped Storage)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Setiap kali seorang guru mendaftar atau login, sistem memberikan identitas unik (<code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono">user.id</code>). Semua dokumen kurikulum (Modul Ajar, ATP, PROTA, PROMES, KKTP), presensi, nilai, dan profil disimpan dengan awalan ID guru tersebut (contoh: <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono">satset_saved_docs_user123</code>).
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2 mb-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">2</span>
                      <span>Aman Digunakan Bergantian di 1 Komputer / Laptop Ruang Guru</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Jika di sekolah hanya ada 1 laptop yang dipakai bersama oleh 10 guru: saat Guru Kelas 1 logout dan Guru Matematika login, aplikasi secara otomatis <strong>mengalihkan seluruh data ke berkas milik Guru Matematika</strong>. Data Guru Kelas 1 tetap aman tersimpan dan tidak terhapus sedikitpun.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2 mb-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">3</span>
                      <span>Penggunaan di HP atau Laptop Pribadi Masing-Masing</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Jika masing-masing dari 10 guru membuka aplikasi di laptop atau ponsel pintar pribadinya, data tersimpan terpisah pada peramban (browser) masing-masing secara independen dan 100% mandiri.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2 mb-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">4</span>
                      <span>Fitur Cadangkan & Unduh Berkas (Word & Excel)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Setiap guru dapat langsung mengunduh hasil kerjanya ke berkas Microsoft Word (.doc) atau Microsoft Excel (.xlsx) dan menyimpannya di flashdisk atau Google Drive pribadi kapan saja.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMINISTRASI GURU (PERANGKAT KURIKULUM) */}
          {activeSection === 'admin_guru' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-900 text-white rounded-xl p-4">
                <h4 className="font-black text-sm mb-1 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>10 Menu Administrasi Guru (Standar Resmi BSKAP No. 032/H/KR/2024)</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Seluruh perangkat tersinkronisasi otomatis dengan standar resmi Kemendikbudristek tanpa perlu input manual yang melelahkan.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>1. Sampul Kurikulum (Cover Administrasi Dinas)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Cover resmi berbingkai klasik kedinasan, dilengkapi logo Tut Wuri Handayani resolusi tinggi, kop dinas, dan identitas tahun ajaran berjalan.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                    <span>2. ATP (Alur Tujuan Pembelajaran)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Otomatis memuat Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran resmi BSKAP sesuai mata pelajaran akun guru. Dilengkapi kolom Alokasi Jam Pelajaran (JP), semester, tombol edit langsung di tabel, ekspor Excel, dan cetak A4.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>3. PROTA (Program Tahunan)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Tabel matriks alokasi jam pelajaran yang membagi seluruh materi pokok ke dalam Semester Ganjil dan Semester Genap secara terstruktur lengkap dengan tanda tangan Kepala Sekolah dan Guru.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>4. PROMES (Program Semester)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Distribusi alokasi waktu mingguan untuk 6 bulan berjalan (Juli-Desember atau Januari-Juni) dengan kotak ceklis mingguan otomatis sesuai alur kurikulum pusat.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <Target className="w-4 h-4 text-rose-600" />
                    <span>5. KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Rubrik interval ketuntasan resmi (Perlu Bimbingan 0-69, Cukup 70-79, Baik 80-89, Sangat Baik 90-100) serta deskripsi kriteria ketercapaian setiap tujuan pembelajaran.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    <span>6. Jurnal Harian Mengajar Guru</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Pencatatan harian proses KBM: pertemuan ke-, materi yang diajarkan, catatan kehadiran siswa, evaluasi kendala, serta rencana tindak lanjut per hari.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>7. Modul Ajar Pembelajaran Mendalam (Deep Learning) Standar Supervisi</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Generator cerdas berstruktur resmi 5 bagian: <strong>I. Informasi Umum</strong> (Identitas, Kompetensi Awal, Profil Pancasila, Sarana-Prasarana, Target Siswa); <strong>II. Desain Pembelajaran Mendalam</strong> (Capaian & Tujuan Pembelajaran, Dimensi Deep Learning: Pemahaman Bermakna & Pertanyaan Pemantik); <strong>III. Asesmen Pembelajaran</strong> (Diagnostik, Formatif, Sumatif); <strong>IV. Langkah-Langkah Pembelajaran</strong> (A. Tahap Berkesadaran / Mindful, B. Tahap Bermakna / Meaningful, C. Tahap Menyenangkan / Joyful, D. Refleksi & Integrasi Diri); serta <strong>V. Lampiran Lengkap</strong> (LKPD pemecahan masalah, Bahan Bacaan, Instrumen & Rubrik KKTP, Glosarium, Daftar Pustaka) dan Lembar Pengesahan Resmi 3 Pihak.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>8. Modul Projek Penguatan Profil Pelajar Pancasila (P5)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Penyusun modul P5 sesuai tema resmi: Gaya Hidup Berkelanjutan, Kearifan Lokal, Bhinneka Tunggal Ika, Bangunlah Jiwa dan Raganya, Suara Demokrasi, dan Rekayasa Teknologi.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    <span>9. Bank Soal HOTS & Kisi-Kisi Asesmen</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Penyusun soal pilihan ganda dan esai berbasis nalar tingkat tinggi (C4-C6), stimulus kontekstual, kunci jawaban, dan rubrik pedoman penskoran.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>10. Slide Bahan Ajar Siap Pakai</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Rangkuman materi ajar dalam format slide presentasi terstruktur (Slide 1 s.d. 8) yang siap disalin ke Canva, PowerPoint, atau Google Slides.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMINISTRASI KELAS */}
          {activeSection === 'admin_kelas' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-sky-900 text-white rounded-xl p-4">
                <h4 className="font-black text-sm mb-1 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-sky-300" />
                  <span>11 Menu Aplikasi Administrasi Kelas Lengkap</span>
                </h4>
                <p className="text-xs text-sky-100">
                  Mendukung kebutuhan wali kelas dan guru dalam mengelola data siswa, presensi, nilai, serta inventaris ruangan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">1. Data Sekolah & Guru</strong>
                  <p className="text-xs text-slate-600">Form identitas lengkap satuan pendidikan, nomor statistik, alamat, serta info kepala sekolah & wali kelas.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">2. Data Siswa Lengkap</strong>
                  <p className="text-xs text-slate-600">Tabel biodata siswa (NIS, NISN, NIK, nama orang tua, alamat, BB/TB) dengan fitur Tambah, Edit, Hapus, dan Impor/Ekspor Excel.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">3. Presensi / Absensi Siswa</strong>
                  <p className="text-xs text-slate-600">Grid absensi tanggal 1 s.d. 31 per bulan dengan simbol S (Sakit), I (Izin), A (Alfa), serta rekap total otomatis.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">4. Daftar Nilai & Leger / E-Rapor</strong>
                  <p className="text-xs text-slate-600">Pengisian nilai seluruh mata pelajaran, UH 1-4, PTS, PAS, pembobotan, rata-rata otomatis, dan cetak leger format dinas.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">5. Jadwal Pelajaran Mingguan</strong>
                  <p className="text-xs text-slate-600">Jadwal pelajaran Senin s.d. Sabtu dengan jam ke-1 s.d. jam ke-5 yang dapat diedit langsung.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">6. Jadwal Piket Kebersihan</strong>
                  <p className="text-xs text-slate-600">Pembagian regu piket harian siswa untuk menjaga kebersihan dan ketertiban ruang kelas.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">7. Struktur Organisasi Kelas</strong>
                  <p className="text-xs text-slate-600">Bagan pengurus kelas: Wali Kelas, Ketua, Wakil, Sekretaris, Bendahara, dan Sie Keamanan/Kebersihan/Keagamaan.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">8. Denah Tempat Duduk Siswa</strong>
                  <p className="text-xs text-slate-600">Tata letak 20 meja siswa menghadap papan tulis yang dapat disesuaikan nama siswanya.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">9. Inventaris Barang Kelas</strong>
                  <p className="text-xs text-slate-600">Daftar meja, kursi, papan tulis, lambang garuda, jam dinding, kotak P3K dengan jumlah dan kondisi.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-900 block mb-0.5">10. Mutasi & Surat Pindah</strong>
                  <p className="text-xs text-slate-600">Pencatatan siswa keluar/masuk serta pembuatan format Surat Keterangan Pindah Sekolah resmi siap cetak.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CETAK A4 & EKSPOR WORD/EXCEL */}
          {activeSection === 'cetak_a4' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <h4 className="font-black text-rose-950 text-sm flex items-center space-x-2 mb-1.5">
                  <Printer className="w-4 h-4 text-rose-600" />
                  <span>Petunjuk Mencetak Kertas A4 Pas dan Rapi Tanpa Terpotong</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semua berkas di aplikasi ini telah diatur dengan ukuran standar kertas <strong>A4 Kedinasan</strong> (Margin 2 cm) dan font resmi <strong>Times New Roman</strong>.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Langkah-Langkah Saat Jendela Cetak Browser Terbuka (Ctrl + P):
                </h5>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
                  <li>
                    <strong>Tujuan / Destination:</strong> Pilih printer fisik Anda, atau pilih <em>&quot;Simpan sebagai PDF / Save as PDF&quot;</em> untuk menyimpan berkas digital.
                  </li>
                  <li>
                    <strong>Ukuran Kertas (Paper Size):</strong> Pastikan memilih <strong>A4</strong> (bukan Letter).
                  </li>
                  <li>
                    <strong>Margin:</strong> Pilih <strong>Default</strong> atau <strong>Minimum</strong> (tata letak aplikasi sudah memiliki padding margin kedinasan sendiri).
                  </li>
                  <li>
                    <strong>Grafik Latar Belakang (PENTING):</strong> Wajib <strong>MENCENTANG &quot;Background graphics / Grafik latar belakang&quot;</strong> agar warna bingkai cover dinas, tabel arsip, dan kop surat tercetak dengan warna asli.
                  </li>
                  <li>
                    <strong>Skala (Scale):</strong> Pilih <strong>100%</strong> (atau Fit to Page jika teks terasa terlalu besar di printer tertentu).
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 mb-1">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Ekspor Microsoft Word (.doc)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Gunakan tombol &quot;Unduh Word Dinas (.doc)&quot; di halaman peninjau dokumen untuk membuka modul ajar di Microsoft Word dengan tabel bergaris rapi yang siap diedit kembali.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Ekspor Microsoft Excel (.xlsx)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Tersedia tombol ekspor Excel pada menu ATP, Data Siswa, Presensi, dan Daftar Nilai untuk pengolahan angka di aplikasi Excel atau Dapodik.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ & SOLUSI KESULITAN */}
          {activeSection === 'faq' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-black text-amber-950 text-sm flex items-center space-x-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Pertanyaan Sering Diajukan & Solusi Apabila Ada Kesulitan</span>
                </h4>
                <p className="text-xs text-amber-800">
                  Berikut rangkuman solusi kendala yang kerap dihadapi oleh Bapak/Ibu Guru.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 text-emerald-800">
                    Q: Bagaimana cara mengganti jenjang dari SD ke SMP atau mengubah kelas yang diajar?
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Jawab:</strong> Klik badge jenjang pada sidebar kiri atas (kotak warna hijau atau ungu yang bertuliskan &quot;Guru SD&quot; atau &quot;Guru Mapel SMP&quot;). Jendela pemilihan jenjang dan kelas akan terbuka, silakan pilih rombel atau mapel baru Anda lalu klik simpan.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 text-emerald-800">
                    Q: Saya sudah transfer pembayaran DANA Rp 50.000, mengapa akun saya belum aktif?
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Jawab:</strong> Pembayaran perlu diverifikasi oleh admin. Silakan klik tombol hijau <strong>&quot;Kirim Konfirmasi WhatsApp&quot;</strong> yang ada di halaman pembayaran DANA, atau kirim bukti screenshot transfer ke nomor WhatsApp Admin di <strong>0822-9056-9062</strong>. Admin akan langsung menekan tombol &quot;Setujui &amp; Aktifkan&quot; di Panel Admin dan akun Anda seketika aktif.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 text-emerald-800">
                    Q: Apakah saya bisa mengedit langsung isi ATP, PROTA, atau Nilai di tabel sebelum dicetak?
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Jawab:</strong> Tentu bisa! Seluruh tabel ATP, PROTA, PROMES, KKTP, Presensi, dan Nilai bersifat interaktif. Anda dapat mengklik tombol &quot;Edit&quot; atau mengisi langsung angka dan teks pada kolom tabel sebelum mencetak.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 text-emerald-800">
                    Q: Mengapa tombol &quot;Lihat &amp; Cetak Dokumen&quot; di sidebar berwarna redup / tidak bisa diklik?
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Jawab:</strong> Tombol tersebut hanya aktif apabila ada dokumen yang sedang dibuka. Jika Anda baru pertama kali masuk, silakan buat dokumen baru lewat menu Modul Ajar, ATP, atau buka salah satu dokumen yang tersimpan di menu <strong>&quot;Arsip Dokumen&quot;</strong>.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 text-emerald-800">
                    Q: Bagaimana cara menyesuaikan nama Kepala Sekolah, Pengawas, dan NIP saya?
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Jawab:</strong> Buka menu <strong>&quot;Profil Sekolah &amp; TTD&quot;</strong> di sidebar. Isi data nama sekolah, NPSN, nama kepala sekolah, NIP, serta pengawas pembina. Data ini akan otomatis dicantumkan di lembar pengesahan 3 pihak seluruh dokumen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: KONTAK ADMIN & WHATSAPP */}
          {activeSection === 'kontak' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Layanan Bantuan Resmi
                    </span>
                    <h4 className="text-lg font-black text-white">
                      Hubungi Bantuan Cepat WhatsApp Admin
                    </h4>
                    <p className="text-xs text-emerald-100 max-w-md">
                      Jika Bapak/Ibu mengalami kendala teknis, butuh aktivasi akun segera, atau ingin panduan khusus, tim kami siap membantu melalui WhatsApp.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/6282290569062?text=Halo%20Admin%20Sat-Set%2C%20saya%20membutuhkan%20bantuan%20terkait%20aplikasi%20administrasi%20guru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-emerald-800 font-black text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Chat WhatsApp Admin</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Kontak WhatsApp Resmi</span>
                  </h5>
                  <p className="text-base font-black text-indigo-900 font-mono">
                    0822-9056-9062
                  </p>
                  <p className="text-xs text-slate-500">
                    Atas Nama: Fadli (Pengembang &amp; Administrator Sat-Set)
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Informasi Pembayaran DANA</span>
                  </h5>
                  <p className="text-base font-black text-emerald-900 font-mono">
                    0822-9056-9062 (DANA)
                  </p>
                  <p className="text-xs text-slate-500">
                    Lisensi Akses Guru: Rp 50.000 (Akses Penuh Selamanya)
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Sat-Set • Administrasi Guru &amp; Kelas Kurikulum Merdeka Terstandarisasi Dinas Pendidikan
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer ml-auto"
          >
            Tutup Buku Petunjuk
          </button>
        </div>
      </div>
    </div>
  );
};
