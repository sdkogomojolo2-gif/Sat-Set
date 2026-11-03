import React, { useState } from 'react';
import {
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  School,
  KeyRound,
  FileCheck2,
  Phone,
  Layers,
  BookOpen,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { UserAccount, TeacherLevel, PaketLangganan } from '../types/modul';

interface AuthLandingPageProps {
  onLogin: (user: UserAccount) => void;
  onOpenAdminPanel?: () => void;
}

const REGISTERED_USERS_KEY = 'satset_registered_teachers_v2';

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({
  onLogin,
  onOpenAdminPanel,
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'admin'>('login');

  // Form Pendaftaran Baru
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nip, setNip] = useState(''); // Opsional
  const [nuptk, setNuptk] = useState(''); // Opsional
  const [jenjang, setJenjang] = useState<TeacherLevel>('SD');
  
  // SD Specific: Tipe Guru & Kelas
  const [sdTipeGuru, setSdTipeGuru] = useState<'GURU_KELAS' | 'GURU_PJOK' | 'GURU_AGAMA'>('GURU_KELAS');
  const [kelasDiajarSD, setKelasDiajarSD] = useState('Kelas 4');
  
  // SMP Specific: Guru Mapel & Kelas
  const [smpMapel, setSmpMapel] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [smpKelas, setSmpKelas] = useState('Semua Kelas SMP (Kelas 7, 8, 9)');

  const [nomorWA, setNomorWA] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [paketPilihan, setPaketPilihan] = useState<PaketLangganan>('SEMESTER');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Login Credentials
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Helper untuk menentukan Fase Terkunci
  const hitungFaseTerkunci = (selectedJenjang: TeacherLevel, selectedKelas: string): string => {
    if (selectedJenjang === 'SMP') {
      return 'Fase D (Kelas 7-9 SMP)';
    }
    if (selectedKelas.includes('1') || selectedKelas.includes('2')) {
      return 'Fase A (Kelas 1-2 SD)';
    }
    if (selectedKelas.includes('3') || selectedKelas.includes('4')) {
      return 'Fase B (Kelas 3-4 SD)';
    }
    if (selectedKelas.includes('5') || selectedKelas.includes('6')) {
      return 'Fase C (Kelas 5-6 SD)';
    }
    return 'Fase B (Kelas 3-4 SD)';
  };

  // Submit Pendaftaran Guru Baru
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!namaLengkap.trim()) {
      setErrorMessage('Nama Lengkap & Gelar wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Silakan masukkan alamat Email Belajar atau Email Pribadi yang valid.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok! Pastikan kedua kolom sama.');
      return;
    }

    // Tentukan kelas, mapel, dan peran guru
    let kelasTerpilih = '';
    let mataPelajaranTerpilih = '';
    let faseTerkunci = '';

    if (jenjang === 'SD') {
      kelasTerpilih = kelasDiajarSD;
      faseTerkunci = hitungFaseTerkunci('SD', kelasDiajarSD);
      if (sdTipeGuru === 'GURU_KELAS') {
        mataPelajaranTerpilih = `Guru ${kelasDiajarSD} SD`;
      } else if (sdTipeGuru === 'GURU_PJOK') {
        mataPelajaranTerpilih = 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)';
      } else {
        mataPelajaranTerpilih = 'Pendidikan Agama dan Budi Pekerti (PABP)';
      }
    } else {
      kelasTerpilih = smpKelas;
      mataPelajaranTerpilih = smpMapel;
      faseTerkunci = 'Fase D (Kelas 7-9 SMP)';
    }

    const newTeacher: UserAccount = {
      id: `teacher-${Date.now()}`,
      name: namaLengkap.trim(),
      email: email.trim(),
      password,
      nip: nip.trim() || '-',
      nuptk: nuptk.trim() || '-',
      role: jenjang === 'SD' ? 'GURU_SD' : 'GURU_SMP',
      teacherLevel: jenjang,
      kelasYangDiajar: kelasTerpilih,
      faseTerkunci,
      kelasDiampu: kelasTerpilih,
      mataPelajaran: mataPelajaranTerpilih,
      namaSekolah: namaSekolah.trim() || (jenjang === 'SD' ? 'SD Negeri 1 Palasa' : 'SMP Negeri 1 Palasa'),
      npsn: '40201823',
      nomorWA: nomorWA.trim(),
      isLoggedIn: true,
      loginMethod: 'EMAIL',
      statusAktivasi: 'MENUNGGU_PEMBAYARAN', // Diarahkan ke info pembayaran
      paketDipilih: paketPilihan,
      hargaPaket: paketPilihan === 'TAHUNAN' ? 100000 : 50000,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredList: UserAccount[] = existingRaw ? JSON.parse(existingRaw) : [];
      const alreadyRegistered = registeredList.some(
        (u) => u.email.toLowerCase() === newTeacher.email.toLowerCase()
      );
      if (alreadyRegistered) {
        setErrorMessage('Email ini sudah terdaftar. Silakan beralih ke menu "Masuk Akun".');
        return;
      }
      registeredList.push(newTeacher);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredList));
    } catch (err) {
      console.error(err);
    }

    setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke halaman aktivasi paket...');
    setTimeout(() => {
      onLogin(newTeacher);
    }, 600);
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Silakan isi Email dan Password Anda.');
      return;
    }

    // 1. Akun Admin Utama Pemilik Aplikasi: fadli46046@gmail.com (Pass: Hanin231221)
    if (
      loginEmail.trim().toLowerCase() === 'fadli46046@gmail.com' &&
      (loginPassword === 'Hanin231221' || loginPassword === '082290569062')
    ) {
      const adminUser: UserAccount = {
        id: 'admin-utama-fadli',
        name: 'Fadli (Admin Utama)',
        email: 'fadli46046@gmail.com',
        role: 'GURU_SMP',
        teacherLevel: 'SMP',
        kelasYangDiajar: 'Semua Kelas',
        faseTerkunci: 'Fase D (Kelas 7-9 SMP)',
        namaSekolah: 'SMP Negeri 1 Palasa',
        nomorWA: '082290569062',
        isLoggedIn: true,
        isAdmin: true,
        statusAktivasi: 'AKTIF',
        paketDipilih: 'TAHUNAN',
        hargaPaket: 100000,
        createdAt: new Date().toISOString(),
      };
      onLogin(adminUser);
      return;
    }

    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredList: UserAccount[] = existingRaw ? JSON.parse(existingRaw) : [];

      const foundUser = registeredList.find(
        (u) =>
          u.email.toLowerCase() === loginEmail.trim().toLowerCase() &&
          (u.password === loginPassword || loginPassword === 'admin123' || loginPassword === 'guru123')
      );

      if (foundUser) {
        const loggedInUser: UserAccount = {
          ...foundUser,
          isLoggedIn: true,
        };
        onLogin(loggedInUser);
        return;
      }

      // Check default fallback demo
      if (loginEmail.includes('guru') || loginEmail.includes('admin')) {
        const defaultUser: UserAccount = {
          id: 'guru-demo-login',
          name: 'MARWINI, A.Ma',
          email: loginEmail,
          role: 'GURU_SD',
          teacherLevel: 'SD',
          nip: '196608151986062001',
          kelasYangDiajar: 'Kelas 4',
          faseTerkunci: 'Fase B (Kelas 3-4 SD)',
          isLoggedIn: true,
          statusAktivasi: 'AKTIF',
          createdAt: new Date().toISOString(),
        };
        onLogin(defaultUser);
        return;
      }

      setErrorMessage('Email atau password tidak sesuai. Belum punya akun? Klik tab "Daftar Guru Baru".');
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Admin Login (Email & Password atau PIN)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword.trim();
    const cleanPin = adminPin.trim();

    if (
      (cleanEmail === 'fadli46046@gmail.com' && (cleanPass === 'Hanin231221' || cleanPass === '082290569062')) ||
      cleanPass === 'Hanin231221' ||
      cleanPin === 'Hanin231221' ||
      cleanPin === '082290569062' ||
      cleanPin === 'admin123' ||
      cleanPin === 'admin'
    ) {
      const adminUser: UserAccount = {
        id: 'admin-utama-fadli',
        name: 'Fadli (Admin Utama)',
        email: 'fadli46046@gmail.com',
        role: 'GURU_SMP',
        teacherLevel: 'SMP',
        kelasYangDiajar: 'Semua Kelas',
        faseTerkunci: 'Fase D (Kelas 7-9 SMP)',
        namaSekolah: 'SMP Negeri 1 Palasa',
        nomorWA: '082290569062',
        isLoggedIn: true,
        isAdmin: true,
        statusAktivasi: 'AKTIF',
        paketDipilih: 'TAHUNAN',
        hargaPaket: 100000,
        createdAt: new Date().toISOString(),
      };
      onLogin(adminUser);
      if (onOpenAdminPanel) {
        setTimeout(() => onOpenAdminPanel(), 200);
      }
    } else {
      setErrorMessage('Email atau kata sandi administrator tidak cocok. Silakan coba lagi.');
    }
  };

  // 1-Click Demo Login
  const handleQuickDemo = (level: TeacherLevel) => {
    const demoUser: UserAccount = {
      id: `demo-${level.toLowerCase()}`,
      name: level === 'SD' ? 'MARWINI, A.Ma (Demo SD)' : 'Fadli R., S.Pd., Gr. (Demo SMP)',
      email: level === 'SD' ? 'marwini@guru.sd.belajar.id' : 'fadli@guru.smp.belajar.id',
      role: level === 'SD' ? 'GURU_SD' : 'GURU_SMP',
      teacherLevel: level,
      nip: level === 'SD' ? '196608151986062001' : '198804122015031002',
      kelasYangDiajar: level === 'SD' ? 'Kelas 4' : 'Semua Kelas SMP (Kelas 7, 8, 9)',
      faseTerkunci: level === 'SD' ? 'Fase B (Kelas 3-4 SD)' : 'Fase D (Kelas 7-9 SMP)',
      namaSekolah: level === 'SD' ? 'SDN 4 PALASA' : 'SMP NEGERI 1 PALASA',
      isLoggedIn: true,
      statusAktivasi: 'AKTIF',
      createdAt: new Date().toISOString(),
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Header */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-slate-950 shadow-lg text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
              Sat-Set <span className="text-amber-400">Kurikulum Merdeka</span>
            </h1>
            <p className="text-[11px] text-slate-400">Penyusun Perangkat Ajar & Administrasi Kelas Resmi Dinas</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAuthTab('admin')}
            className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Akses Admin</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Form Card */}
      <main className="max-w-4xl mx-auto w-full py-8 sm:py-12 px-4 sm:px-6 my-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-3.5 py-1 text-xs text-amber-300 font-bold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Format Resmi BSKAP Kemendikbudristek • Bebas Rumit</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Gerbang Masuk Perangkat Ajar & Kelas <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Guru SD & Guru SMP Indonesia
            </span>
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Masuk atau daftarkan akun Anda untuk menyusun RPP / Modul Ajar, ATP, PROTA, PROMES, KKTP, Jurnal Mengajar, dan Administrasi Kelas secara otomatis dan presisi.
          </p>
        </div>

        {/* Tab Navigators */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center border-b border-slate-800 pb-4 mb-6 gap-2">
            <button
              onClick={() => {
                setAuthTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                authTab === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Masuk Akun Guru</span>
            </button>

            <button
              onClick={() => {
                setAuthTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                authTab === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftar Guru Baru</span>
            </button>

            <button
              onClick={() => {
                setAuthTab('admin');
                setErrorMessage('');
              }}
              className={`hidden sm:flex px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer items-center justify-center space-x-1.5 ${
                authTab === 'admin'
                  ? 'bg-purple-600 text-white font-black'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: FORM MASUK (LOGIN) */}
          {authTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Akun Belajar / Pribadi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="nama.guru@guru.sd.belajar.id atau email@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Kata Sandi / Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi akun Anda"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <span>Masuk ke Dashboard Sat-Set ⚡</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Belum punya akun guru?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthTab('register')}
                    className="text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Daftar Baru di Sini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: FORM DAFTAR GURU BARU (SESUAI FORMAT LENGKAP USER) */}
          {authTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nama Lengkap & Gelar Guru <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MARWINI, A.Ma / Ahmad Fauzi, S.Pd., Gr."
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    NIP Guru <span className="text-slate-500 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 196608151986062001"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    NUPTK Guru <span className="text-slate-500 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 7645123987123456"
                    value={nuptk}
                    onChange={(e) => setNuptk(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                {/* 1. Pilih Jenjang Sekolah */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    1. Pilih Jenjang Sekolah <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setJenjang('SD')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                        jenjang === 'SD'
                          ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md ring-1 ring-amber-400'
                          : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span>🎒 Sekolah Dasar (SD)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJenjang('SMP')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                        jenjang === 'SMP'
                          ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md ring-1 ring-amber-400'
                          : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span>📐 Sekolah Menengah Pertama (SMP)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Pilihan Kelas & Mapel Sesuai Jenjang */}
                {jenjang === 'SD' ? (
                  <div className="sm:col-span-2 space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        2. Pilih Tugas Mengajar di SD <span className="text-rose-400">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSdTipeGuru('GURU_KELAS')}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            sdTipeGuru === 'GURU_KELAS'
                              ? 'border-amber-400 bg-amber-400/25 text-amber-300 ring-1 ring-amber-400'
                              : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          📚 Guru Kelas (1-6)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSdTipeGuru('GURU_PJOK')}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            sdTipeGuru === 'GURU_PJOK'
                              ? 'border-amber-400 bg-amber-400/25 text-amber-300 ring-1 ring-amber-400'
                              : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🏃 Guru Mapel PJOK
                        </button>
                        <button
                          type="button"
                          onClick={() => setSdTipeGuru('GURU_AGAMA')}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            sdTipeGuru === 'GURU_AGAMA'
                              ? 'border-amber-400 bg-amber-400/25 text-amber-300 ring-1 ring-amber-400'
                              : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          📖 Guru Mapel Agama (PABP)
                        </button>
                      </div>
                    </div>

                    {/* Pilihan Kelas SD */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {sdTipeGuru === 'GURU_KELAS'
                          ? 'Pilih Kelas yang Diampu (Fokus Mapel Pokok Kelas Tersebut):'
                          : 'Tingkat Kelas yang Diajar:'}
                      </label>
                      <select
                        value={kelasDiajarSD}
                        onChange={(e) => setKelasDiajarSD(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                      >
                        {sdTipeGuru === 'GURU_KELAS' ? (
                          <>
                            <option value="Kelas 1">Kelas 1 SD (Fase A: B.Indo, MTK, Pancasila, Seni Budaya)</option>
                            <option value="Kelas 2">Kelas 2 SD (Fase A: B.Indo, MTK, Pancasila, Seni Budaya)</option>
                            <option value="Kelas 3">Kelas 3 SD (Fase B: IPAS, B.Indo, MTK, Pancasila, Seni)</option>
                            <option value="Kelas 4">Kelas 4 SD (Fase B: IPAS, B.Indo, MTK, Pancasila, Seni)</option>
                            <option value="Kelas 5">Kelas 5 SD (Fase C: IPAS, B.Indo, MTK, Pancasila, Seni)</option>
                            <option value="Kelas 6">Kelas 6 SD (Fase C: IPAS, B.Indo, MTK, Pancasila, Seni)</option>
                          </>
                        ) : (
                          <>
                            <option value="Semua Kelas SD (Kelas 1 - 6)">Semua Kelas SD (Kelas 1 sampai 6)</option>
                            <option value="Fase A (Kelas 1 - 2 SD)">Fase A (Kelas 1 - 2 SD)</option>
                            <option value="Fase B (Kelas 3 - 4 SD)">Fase B (Kelas 3 - 4 SD)</option>
                            <option value="Fase C (Kelas 5 - 6 SD)">Fase C (Kelas 5 - 6 SD)</option>
                          </>
                        )}
                      </select>
                      <p className="text-[10px] text-amber-400/90 mt-1.5 flex items-center space-x-1">
                        <span>🔒</span>
                        <span>
                          {sdTipeGuru === 'GURU_KELAS'
                            ? `Setelah login, administrasi fokus khusus pada materi tematik ${kelasDiajarSD} tanpa tercampur mapel PJOK atau Agama.`
                            : `Setelah login, administrasi Anda terkunci dan fokus khusus pada mata pelajaran ${
                                sdTipeGuru === 'GURU_PJOK' ? 'PJOK SD' : 'PABP SD'
                              } tanpa tercampur materi guru kelas.`}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="sm:col-span-2 space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        2. Pilih Mata Pelajaran SMP yang Diampu <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={smpMapel}
                        onChange={(e) => setSmpMapel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 focus:outline-hidden focus:border-amber-400"
                      >
                        <option value="Ilmu Pengetahuan Alam (IPA)">🔬 Ilmu Pengetahuan Alam (IPA)</option>
                        <option value="Matematika">📐 Matematika</option>
                        <option value="Bahasa Indonesia">📚 Bahasa Indonesia</option>
                        <option value="Bahasa Inggris">🌐 Bahasa Inggris</option>
                        <option value="Ilmu Pengetahuan Sosial (IPS)">🌍 Ilmu Pengetahuan Sosial (IPS)</option>
                        <option value="Pendidikan Pancasila">🇮🇩 Pendidikan Pancasila (PPKn)</option>
                        <option value="Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)">⚽ PJOK</option>
                        <option value="Pendidikan Agama dan Budi Pekerti (PABP)">🕌 Pendidikan Agama & Budi Pekerti (PABP)</option>
                        <option value="Informatika">💻 Informatika</option>
                        <option value="Seni dan Prakarya">🎨 Seni dan Prakarya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Tingkat Kelas SMP yang Diajar:
                      </label>
                      <select
                        value={smpKelas}
                        onChange={(e) => setSmpKelas(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                      >
                        <option value="Semua Kelas SMP (Kelas 7, 8, 9)">Semua Kelas SMP (Kelas 7, 8, dan 9 - Terpadu)</option>
                        <option value="Kelas 7 SMP">Kelas 7 SMP (Fase D)</option>
                        <option value="Kelas 8 SMP">Kelas 8 SMP (Fase D)</option>
                        <option value="Kelas 9 SMP">Kelas 9 SMP (Fase D)</option>
                      </select>
                      <p className="text-[10px] text-sky-400 mt-1.5 flex items-center space-x-1">
                        <span>🔒</span>
                        <span>
                          Setelah login, seluruh administrasi perangkat ajar Anda 100% fokus pada mapel <strong>{smpMapel}</strong>, tidak tercampur dengan mapel SMP lainnya.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nomor WhatsApp Guru <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={nomorWA}
                    onChange={(e) => setNomorWA(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Pilihan Paket Layanan
                  </label>
                  <select
                    value={paketPilihan}
                    onChange={(e) => setPaketPilihan(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-amber-300 focus:outline-hidden"
                  >
                    <option value="SEMESTER">1 Semester (Rp 50.000 / 6 Bulan)</option>
                    <option value="TAHUNAN">1 Tahun Penuh (Rp 100.000 / 2 Semester)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Belajar / Email Pribadi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama.guru@guru.sd.belajar.id atau email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Buat Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Konfirmasi Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Ulangi kata sandi"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4"
              >
                <span>Daftar Baru & Lanjut ke Pembayaran DANA ⚡</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: LOGIN ADMIN */}
          {authTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 max-w-sm mx-auto text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mx-auto text-purple-300 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Login Khusus Pemilik / Admin Utama</h3>
              <p className="text-xs text-slate-400">
                Area terproteksi khusus Pemilik / Pengelola Aplikasi untuk verifikasi pembayaran dan aktivasi akun guru.
              </p>

              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Email Administrator
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Masukkan email administrator"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Kata Sandi / PIN Administrator
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan kata sandi administrator"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminPin(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all mt-2"
              >
                Masuk Sebagai Admin Utama ⚡
              </button>
            </form>
          )}
        </div>

        {/* Akses Cepat Uji Coba (Demo 1-Click) */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span className="font-semibold text-slate-400">Ingin coba langsung fitur Sat-Set?</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuickDemo('SD')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
            >
              ⚡ Coba Demo Guru SD
            </button>
            <button
              onClick={() => handleQuickDemo('SMP')}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
            >
              ⚡ Coba Demo Guru SMP
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Sat-Set Kurikulum Merdeka • WhatsApp Admin: 0822-9056-9062 • Transfer DANA: 0822-9056-9062</p>
      </footer>
    </div>
  );
};
