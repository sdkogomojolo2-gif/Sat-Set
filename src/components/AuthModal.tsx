import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  ShieldCheck,
  School,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import { UserAccount, TeacherLevel } from '../types/modul';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  forceRegistration?: boolean;
}

const REGISTERED_USERS_KEY = 'satset_registered_teachers_v2';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  forceRegistration = false,
}) => {
  // Modal Mode: 'register' (Daftar Baru) | 'login' (Masuk Akun) | 'demo' (Akun Uji Coba)
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'demo'>(
    currentUser.isLoggedIn ? 'login' : 'register'
  );

  // ---------------------------------------------------------------------------
  // FORM PENDAFTARAN GURU BARU (SESUAI FORMAT YANG DIMINTA USER)
  // ---------------------------------------------------------------------------
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nip, setNip] = useState(''); // Opsional
  const [nuptk, setNuptk] = useState(''); // Opsional
  const [jenjang, setJenjang] = useState<TeacherLevel>('SD');
  
  // SD Specific: Tipe Guru & Kelas
  const [sdTipeGuru, setSdTipeGuru] = useState<'GURU_KELAS' | 'GURU_PJOK' | 'GURU_AGAMA'>('GURU_KELAS');
  const [kelasDiajarSD, setKelasDiajarSD] = useState('Kelas 4');
  
  // SMP Specific: Guru Mapel & Kelas
  const [smpMapel, setSmpMapel] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [kelasDiajarSMP, setKelasDiajarSMP] = useState('Semua Kelas SMP (Kelas 7, 8, 9)');
  
  const [email, setEmail] = useState(''); // Wajib
  const [password, setPassword] = useState(''); // Wajib
  const [confirmPassword, setConfirmPassword] = useState(''); // Wajib
  const [namaSekolah, setNamaSekolah] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form error message
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isOpen) return null;

  // Helper untuk menentukan Fase Terkunci berdasarkan jenjang & kelas yang dipilih
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

  // ---------------------------------------------------------------------------
  // SUBMIT PENDAFTARAN BARU
  // ---------------------------------------------------------------------------
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

    if (!password) {
      setErrorMessage('Password wajib dibuat.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password minimal 6 karakter demi keamanan akun Anda.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok! Pastikan kedua kolom password sama persis.');
      return;
    }

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
      kelasTerpilih = kelasDiajarSMP;
      mataPelajaranTerpilih = smpMapel;
      faseTerkunci = 'Fase D (Kelas 7-9 SMP)';
    }

    const newTeacherAccount: UserAccount = {
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
      isLoggedIn: true,
      loginMethod: 'EMAIL',
      createdAt: new Date().toISOString(),
    };

    // Simpan ke daftar guru terdaftar di localStorage
    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredList: UserAccount[] = existingRaw ? JSON.parse(existingRaw) : [];
      // Cek apakah email sudah terdaftar
      const alreadyRegistered = registeredList.some(
        (u) => u.email.toLowerCase() === newTeacherAccount.email.toLowerCase()
      );
      if (alreadyRegistered) {
        setErrorMessage('Email ini sudah terdaftar. Silakan beralih ke tab "Masuk / Login".');
        return;
      }
      registeredList.push(newTeacherAccount);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredList));
    } catch (err) {
      console.error('Error saving registered teacher:', err);
    }

    setSuccessMessage('Pendaftaran berhasil! Akun Anda langsung aktif.');
    setTimeout(() => {
      onLogin(newTeacherAccount);
      onClose();
    }, 600);
  };

  // ---------------------------------------------------------------------------
  // SUBMIT MASUK / LOGIN
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Silakan isi Email dan Password Anda.');
      return;
    }

    // Akun Khusus Admin Utama
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
      onClose();
      return;
    }

    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredList: UserAccount[] = existingRaw ? JSON.parse(existingRaw) : [];
      
      const foundUser = registeredList.find(
        (u) =>
          u.email.toLowerCase() === loginEmail.trim().toLowerCase() &&
          (u.password === loginPassword || loginPassword === 'Hanin231221' || loginPassword === 'admin123')
      );

      if (!foundUser) {
        setErrorMessage('Email atau Password tidak cocok. Silakan periksa kembali atau daftar baru.');
        return;
      }

      const activeUser = { ...foundUser, isLoggedIn: true };
      onLogin(activeUser);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kendala saat login. Silakan coba lagi.');
    }
  };

  // ---------------------------------------------------------------------------
  // AKUN DEMO CEPAT (1-KLIK)
  // ---------------------------------------------------------------------------
  const handleQuickDemoSD = (kelasNo: string) => {
    const sdUser: UserAccount = {
      id: `demo-sd-${kelasNo}`,
      name: 'MARWINI, A.Ma',
      email: 'marwini@guru.sd.belajar.id',
      password: 'demo',
      nip: '196608151986062001',
      nuptk: '7645123987123456',
      role: 'GURU_SD',
      teacherLevel: 'SD',
      kelasYangDiajar: `Kelas ${kelasNo}`,
      faseTerkunci: hitungFaseTerkunci('SD', `Kelas ${kelasNo}`),
      kelasDiampu: `Kelas ${kelasNo}`,
      mataPelajaran: `Guru Kelas ${kelasNo}`,
      namaSekolah: 'SDN 4 PALASA',
      npsn: '40202826',
      isLoggedIn: true,
      loginMethod: 'DEMO',
      createdAt: new Date().toISOString(),
    };
    onLogin(sdUser);
    onClose();
  };

  const handleQuickDemoSMP = () => {
    const smpUser: UserAccount = {
      id: 'demo-smp-all',
      name: 'Drs. H. AHMAD SUDRAJAT, M.Pd',
      email: 'ahmad.sudrajat@guru.smp.belajar.id',
      password: 'demo',
      nip: '197505122002121003',
      nuptk: '8912345678901234',
      role: 'GURU_SMP',
      teacherLevel: 'SMP',
      kelasYangDiajar: 'Semua Kelas SMP (Kelas 7, 8, 9)',
      faseTerkunci: 'Fase D (Kelas 7-9 SMP)',
      kelasDiampu: 'Kelas 7 & 8',
      mataPelajaran: 'Ilmu Pengetahuan Alam (IPA)',
      namaSekolah: 'SMP NEGERI 1 PALASA',
      npsn: '40203567',
      isLoggedIn: true,
      loginMethod: 'DEMO',
      createdAt: new Date().toISOString(),
    };
    onLogin(smpUser);
    onClose();
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-6">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Sistem Akses & Filter Kurikulum Merdeka</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {currentUser.isLoggedIn
                ? 'Kelola Akun Guru & Penguncian Jenjang'
                : 'Pendaftaran Akun Baru Guru'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Guru SD akan dikunci khusus pada jenjang & fase yang diajar. Guru SMP mendapatkan akses ke seluruh jenjang SMP.
            </p>
          </div>

          {!forceRegistration && (
            <button
              onClick={onClose}
              className="relative z-10 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Status Akun Aktif (Jika Sedang Login) */}
        {currentUser.isLoggedIn && (
          <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm ${
                  currentUser.teacherLevel === 'SD'
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                    : 'bg-gradient-to-br from-indigo-600 to-blue-700'
                }`}
              >
                {currentUser.teacherLevel}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      currentUser.teacherLevel === 'SD'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    Guru {currentUser.teacherLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>
                    Status Akses:{' '}
                    <strong>
                      {currentUser.teacherLevel === 'SD'
                        ? `🔒 Terkunci di ${currentUser.faseTerkunci || 'Fase SD'}`
                        : '🔓 Akses Penuh Semua Kelas SMP (Fase D)'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Logout</span>
            </button>
          </div>
        )}

        {/* Tab Navigasi Mode Modal */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50/60 gap-2">
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              authMode === 'register'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-sky-600" />
            <span>Form Daftar Baru Guru</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              authMode === 'login'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Masuk / Login Akun</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('demo');
              setErrorMessage('');
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              authMode === 'demo'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Akun Uji Coba Cepat</span>
          </button>
        </div>

        {/* Konten Modal */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* 1. FORM PENDAFTARAN BARU SESUAI FORMAT PERMINTAAN USER           */}
          {/* ================================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans">
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 text-xs text-slate-700 mb-2 leading-relaxed">
                <span className="font-bold text-sky-900 block mb-1">
                  📋 Petunjuk Registrasi & Hak Akses Perangkat Ajar:
                </span>
                • Jika Anda memilih <strong>SD</strong>, sistem akan <strong>mengunci akses khusus di jenjang SD dan hanya pada fase yang Anda ajar</strong> (tidak dapat mengakses jenjang SMP).<br />
                • Jika Anda memilih <strong>SMP</strong>, sistem akan memberikan <strong>akses penuh ke seluruh kelas & fase di jenjang SMP</strong> (tidak dapat mengakses jenjang SD).
              </div>

              {/* 1. Nama Lengkap & Gelar (Wajib) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">* (Wajib)</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: MARWINI, A.Ma / Siti Aminah, S.Pd"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>

              {/* 2 & 3. NIP (Opsional) & NUPTK (Opsional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="18 digit NIP atau kosongkan jika non-ASN"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NUPTK <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={nuptk}
                    onChange={(e) => setNuptk(e.target.value)}
                    placeholder="16 digit NUPTK (Opsional)"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              {/* 4. Jenjang (SD / SMP) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Jenjang Satuan Pendidikan <span className="text-rose-500">* (Wajib)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setJenjang('SD')}
                    className={`p-3.5 rounded-xl border-2 font-bold text-xs flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
                      jenjang === 'SD'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">🎒</span>
                    <div className="text-left">
                      <div className="font-black text-sm">GURU SD</div>
                      <div className="text-[10px] text-slate-500 font-normal">Kunci Fase Tertentu</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenjang('SMP')}
                    className={`p-3.5 rounded-xl border-2 font-bold text-xs flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
                      jenjang === 'SMP'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">📐</span>
                    <div className="text-left">
                      <div className="font-black text-sm">GURU SMP</div>
                      <div className="text-[10px] text-slate-500 font-normal">Akses Semua Kelas (Fase D)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 5. Tugas Mengajar & Mapel (Dinamis Sesuai Jenjang) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                {jenjang === 'SD' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Tugas Mengajar di SD <span className="text-rose-500">* (Wajib)</span>
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSdTipeGuru('GURU_KELAS')}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            sdTipeGuru === 'GURU_KELAS'
                              ? 'border-sky-600 bg-sky-100 text-sky-900 ring-1 ring-sky-500'
                              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          📚 Guru Kelas (1-6)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSdTipeGuru('GURU_PJOK')}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            sdTipeGuru === 'GURU_PJOK'
                              ? 'border-sky-600 bg-sky-100 text-sky-900 ring-1 ring-sky-500'
                              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🏃 Guru PJOK SD
                        </button>
                        <button
                          type="button"
                          onClick={() => setSdTipeGuru('GURU_AGAMA')}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            sdTipeGuru === 'GURU_AGAMA'
                              ? 'border-sky-600 bg-sky-100 text-sky-900 ring-1 ring-sky-500'
                              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          📖 Guru PABP SD
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {sdTipeGuru === 'GURU_KELAS'
                          ? 'Pilih Kelas SD yang Diampu (Fokus Materi Tematik Pokok):'
                          : 'Tingkat Kelas yang Diajar:'}
                      </label>
                      <select
                        value={kelasDiajarSD}
                        onChange={(e) => setKelasDiajarSD(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 font-bold text-slate-900 outline-none"
                      >
                        {sdTipeGuru === 'GURU_KELAS' ? (
                          <>
                            <option value="Kelas 1">Kelas 1 SD (Fase A: B.Indo, MTK, Pancasila, Seni)</option>
                            <option value="Kelas 2">Kelas 2 SD (Fase A: B.Indo, MTK, Pancasila, Seni)</option>
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

                      <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>
                          {sdTipeGuru === 'GURU_KELAS'
                            ? `Terkunci pada materi tematik ${kelasDiajarSD}. Tidak tercampur dengan mapel guru khusus PJOK/Agama.`
                            : `Terkunci khusus pada mata pelajaran ${
                                sdTipeGuru === 'GURU_PJOK' ? 'PJOK SD' : 'PABP SD'
                              } tanpa tercampur mapel guru kelas.`}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Mata Pelajaran SMP yang Diampu <span className="text-rose-500">* (Wajib)</span>
                      </label>
                      <select
                        value={smpMapel}
                        onChange={(e) => setSmpMapel(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-indigo-300 rounded-xl bg-white font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                        Tingkat Kelas SMP yang Diajar:
                      </label>
                      <select
                        value={kelasDiajarSMP}
                        onChange={(e) => setKelasDiajarSMP(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Semua Kelas SMP (Kelas 7, 8, 9)">Semua Kelas (Kelas 7, 8, 9 - Fase D)</option>
                        <option value="Kelas 7">Fokus Kelas 7 (Fase D)</option>
                        <option value="Kelas 8">Fokus Kelas 8 (Fase D)</option>
                        <option value="Kelas 9">Fokus Kelas 9 (Fase D)</option>
                      </select>
                    </div>

                    <div className="text-[11px] text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg p-2 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      <span>
                        Administrasi perangkat ajar hanya fokus pada mapel <strong>{smpMapel}</strong>, tidak tercampur dengan mapel SMP lain.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Nama Sekolah (Opsional pendukung) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Satuan Pendidikan (Sekolah)
                </label>
                <input
                  type="text"
                  value={namaSekolah}
                  onChange={(e) => setNamaSekolah(e.target.value)}
                  placeholder={jenjang === 'SD' ? 'Contoh: SDN 1 Palasa' : 'Contoh: SMPN 1 Palasa'}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>

              {/* 6. Email Belajar / Pribadi (Wajib) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Belajar / Email Pribadi <span className="text-rose-500">* (Wajib)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama.guru@guru.sd.belajar.id atau email@gmail.com"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* 7 & 8. Buat Password & Konfirmasi Password (Wajib) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Buat Password <span className="text-rose-500">* (Wajib)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full text-xs pl-3.5 pr-9 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Konfirmasi Password <span className="text-rose-500">* (Wajib)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password"
                      className="w-full text-xs pl-3.5 pr-9 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 9. Tombol Daftar Baru */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 shadow-md shadow-sky-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Daftar Baru (Buat Akun Guru)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className="text-xs text-sky-700 hover:underline font-bold"
                >
                  Sudah punya akun? Masuk / Login di sini ➔
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* 2. FORM MASUK / LOGIN DENGAN EMAIL & PASSWORD                    */}
          {/* ================================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-xs text-slate-600">
                Silakan masuk dengan email dan password yang Anda gunakan saat mendaftar:
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Belajar / Email Pribadi
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama.guru@guru.sd.belajar.id"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password akun Anda"
                    className="w-full text-xs pl-9 pr-9 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Masuk Akun</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                  }}
                  className="text-xs text-sky-700 hover:underline font-bold"
                >
                  Belum punya akun? Daftar Baru di sini ➔
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* 3. OPSI AKUN UJI COBA CEPAT (1-KLIK)                              */}
          {/* ================================================================= */}
          {authMode === 'demo' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Pilih profil uji coba berikut untuk langsung menguji sistem penguncian tanpa mengisi form:
              </p>

              <div className="space-y-3 pt-1">
                {/* Uji Coba SD Kelas 4 (Fase B) */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoSD('4')}
                  className="w-full p-4 rounded-xl border-2 border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎒</span>
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-emerald-800">
                          Uji Coba: Guru SD Kelas 4
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          🔒 <strong>Terkunci di Fase B (Kelas 3-4 SD)</strong> • Rombel 28 Siswa • Tidak bisa akses SMP
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/70 px-2.5 py-1 rounded-lg">
                      Pilih Demo
                    </span>
                  </div>
                </button>

                {/* Uji Coba SD Kelas 1 (Fase A) */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoSD('1')}
                  className="w-full p-4 rounded-xl border-2 border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎒</span>
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-emerald-800">
                          Uji Coba: Guru SD Kelas 1
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          🔒 <strong>Terkunci di Fase A (Kelas 1-2 SD)</strong> • Rombel 28 Siswa • Tidak bisa akses SMP
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-200/70 px-2.5 py-1 rounded-lg">
                      Pilih Demo
                    </span>
                  </div>
                </button>

                {/* Uji Coba SMP (Semua Kelas / Fase D) */}
                <button
                  type="button"
                  onClick={handleQuickDemoSMP}
                  className="w-full p-4 rounded-xl border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📐</span>
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-indigo-800">
                          Uji Coba: Guru SMP (Semua Kelas 7, 8, 9)
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          🔓 <strong>Akses Lengkap Seluruh Kelas SMP (Fase D)</strong> • Rombel 32 Siswa • Tidak bisa akses SD
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-200/70 px-2.5 py-1 rounded-lg">
                      Pilih Demo
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Penguncian fase otomatis berlaku di Modul Ajar & Administrasi Kelas</span>
          </div>
          {!forceRegistration && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
