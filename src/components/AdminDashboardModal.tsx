import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Search,
  Filter,
  FileSpreadsheet,
  Trash2,
  Edit2,
  Check,
  Eye,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  School,
  Lock,
  Unlock,
  KeyRound,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import { UserAccount, TeacherLevel, PaketLangganan } from '../types/modul';
import * as XLSX from 'xlsx';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateCurrentUser: (user: UserAccount) => void;
}

const REGISTERED_USERS_KEY = 'satset_registered_teachers_v2';
const ADMIN_PIN = 'Hanin231221'; // Password admin utama

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    currentUser.isAdmin || currentUser.email === 'fadli46046@gmail.com' || false
  );
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Daftar seluruh guru yang terdaftar
  const [teachers, setTeachers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');
  const [filterJenjang, setFilterJenjang] = useState<string>('SEMUA');

  // Preview Bukti Transfer modal
  const [previewBukti, setPreviewBukti] = useState<{ url: string; nama: string } | null>(null);

  // Form Tambah Guru Baru Manual oleh Admin
  const [isAddManualOpen, setIsAddManualOpen] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newJenjang, setNewJenjang] = useState<TeacherLevel>('SD');
  const [newKelas, setNewKelas] = useState('Kelas 4');
  const [newPaket, setNewPaket] = useState<PaketLangganan>('SEMESTER');
  const [newWA, setNewWA] = useState('');

  // Load teachers from localStorage
  const loadTeachers = () => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Pastikan akun admin utama fadli46046@gmail.com selalu tersedia
          const hasAdmin = parsed.some((t: UserAccount) => t.email.toLowerCase() === 'fadli46046@gmail.com');
          if (!hasAdmin) {
            parsed.unshift({
              id: 'admin-utama-fadli',
              name: 'Fadli (Admin Utama)',
              email: 'fadli46046@gmail.com',
              password: 'Hanin231221',
              role: 'GURU_SMP',
              teacherLevel: 'SMP',
              kelasYangDiajar: 'Semua Kelas',
              faseTerkunci: 'Fase D (Kelas 7-9 SMP)',
              namaSekolah: 'SMP Negeri 1 Palasa',
              nomorWA: '082290569062',
              isLoggedIn: false,
              isAdmin: true,
              statusAktivasi: 'AKTIF',
              paketDipilih: 'TAHUNAN',
              hargaPaket: 100000,
              createdAt: new Date().toISOString(),
            });
            localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(parsed));
          }
          setTeachers(parsed);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Jika kosong, masukkan akun demo awal beserta Admin Utama
    const initialDemo: UserAccount[] = [
      {
        id: 'admin-utama-fadli',
        name: 'Fadli (Admin Utama)',
        email: 'fadli46046@gmail.com',
        password: 'Hanin231221',
        role: 'GURU_SMP',
        teacherLevel: 'SMP',
        kelasYangDiajar: 'Semua Kelas',
        faseTerkunci: 'Fase D (Kelas 7-9 SMP)',
        namaSekolah: 'SMP Negeri 1 Palasa',
        nomorWA: '082290569062',
        isLoggedIn: false,
        isAdmin: true,
        statusAktivasi: 'AKTIF',
        paketDipilih: 'TAHUNAN',
        hargaPaket: 100000,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'guru-sd-1',
        name: 'MARWINI, A.Ma',
        email: 'marwini@guru.sd.belajar.id',
        role: 'GURU_SD',
        teacherLevel: 'SD',
        nip: '196608151986062001',
        kelasYangDiajar: 'Kelas 4',
        faseTerkunci: 'Fase B (Kelas 3-4 SD)',
        namaSekolah: 'SDN 4 PALASA',
        nomorWA: '081234567890',
        isLoggedIn: false,
        statusAktivasi: 'AKTIF',
        paketDipilih: 'TAHUNAN',
        hargaPaket: 100000,
        createdAt: new Date().toISOString(),
      },
    ];
    setTeachers(initialDemo);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(initialDemo));
  };

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim();
    if (
      clean === ADMIN_PIN ||
      clean === 'Hanin231221' ||
      clean === '082290569062' ||
      clean === 'admin123' ||
      clean === 'admin'
    ) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Kata sandi atau PIN admin tidak sesuai. Silakan coba lagi.');
    }
  };

  // Update status guru (Aktifkan / Setujui Pembayaran)
  const handleUpdateStatus = (
    teacherId: string,
    newStatus: 'AKTIF' | 'MENUNGGU_PERSETUJUAN' | 'NONAKTIF',
    newPaket?: PaketLangganan
  ) => {
    let activatedTeacher: UserAccount | null = null;
    const updatedList = teachers.map((t) => {
      if (t.id === teacherId) {
        const updated: UserAccount = {
          ...t,
          statusAktivasi: newStatus,
          paketDipilih: newPaket || t.paketDipilih || 'SEMESTER',
          hargaPaket: (newPaket || t.paketDipilih) === 'TAHUNAN' ? 100000 : 50000,
          tanggalAktivasi: newStatus === 'AKTIF' ? new Date().toISOString() : t.tanggalAktivasi,
        };
        if (newStatus === 'AKTIF') {
          activatedTeacher = updated;
        }
        // Jika yang diaktifkan adalah user yang sedang login saat ini
        if (currentUser.id === t.id) {
          onUpdateCurrentUser(updated);
        }
        return updated;
      }
      return t;
    });

    setTeachers(updatedList);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));

    if (activatedTeacher && (activatedTeacher as UserAccount).nomorWA) {
      const guru = activatedTeacher as UserAccount;
      if (confirm(`Akun "${guru.name}" berhasil diaktifkan!\n\nKirimkan konfirmasi notifikasi ke WhatsApp guru (${guru.nomorWA}) sekarang?`)) {
        handleSendWhatsAppNotification(guru);
      }
    }
  };

  // Kirim Notifikasi WhatsApp ke Guru
  const handleSendWhatsAppNotification = (teacher: UserAccount) => {
    if (!teacher.nomorWA) {
      alert(`Guru ${teacher.name} belum mencantumkan nomor WhatsApp.`);
      return;
    }
    const cleanPhone = teacher.nomorWA.replace(/[^0-9]/g, '');
    const phoneFormatted = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    
    const statusText = teacher.statusAktivasi === 'AKTIF' ? 'AKTIF (LUNAS)' : 'DALAM PROSES VERIFIKASI';
    const paketNama = teacher.paketDipilih === 'TAHUNAN' ? '1 Tahun Penuh (2 Semester)' : '1 Semester';
    const appUrl = window.location.origin;

    const message = `Halo Bapak/Ibu ${teacher.name},\n\nTerima kasih telah mendaftar di aplikasi *Sat-Set Administrasi Guru Kurikulum Merdeka*.\n\nBerikut status akun Anda:\n✅ Status Akun: *${statusText}*\n📦 Paket: ${paketNama}\n🏫 Jenjang/Peran: ${teacher.teacherLevel} (${teacher.kelasYangDiajar})\n📧 Email Login: ${teacher.email}\n\nSilakan langsung login dan gunakan aplikasi di:\n${appUrl}\n\nJika ada pertanyaan silakan balas pesan ini. Selamat menyusun perangkat ajar sat-set & sukses selalu! 🙏\n- Admin Sat-Set`;

    const waUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Hapus guru dari daftar
  const handleDeleteTeacher = (teacherId: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun guru "${nama}"?`)) {
      const updatedList = teachers.filter((t) => t.id !== teacherId);
      setTeachers(updatedList);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));
    }
  };

  // Tambah Guru Manual Langsung Aktif
  const handleAddManualTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim() || !newEmail.trim()) return;

    const newTeacher: UserAccount = {
      id: `teacher-${Date.now()}`,
      name: newNama.trim(),
      email: newEmail.trim(),
      role: newJenjang === 'SD' ? 'GURU_SD' : 'GURU_SMP',
      teacherLevel: newJenjang,
      kelasYangDiajar: newJenjang === 'SD' ? newKelas : 'Semua Kelas SMP (Kelas 7, 8, 9)',
      faseTerkunci: newJenjang === 'SD' ? (newKelas.includes('1') || newKelas.includes('2') ? 'Fase A' : newKelas.includes('3') || newKelas.includes('4') ? 'Fase B' : 'Fase C') : 'Fase D',
      nomorWA: newWA.trim(),
      isLoggedIn: false,
      statusAktivasi: 'AKTIF',
      paketDipilih: newPaket,
      hargaPaket: newPaket === 'TAHUNAN' ? 100000 : 50000,
      tanggalAktivasi: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newTeacher, ...teachers];
    setTeachers(updatedList);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));

    setIsAddManualOpen(false);
    setNewNama('');
    setNewEmail('');
    setNewWA('');
  };

  // Export Data Guru ke Excel (.xlsx)
  const handleExportExcel = () => {
    const wsData = [
      ['REKAPITULASI DATA GURU & PEMBAYARAN SAT-SET KURIKULUM MERDEKA'],
      [`Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}`],
      [`Admin Pengelola: 0822-9056-9062`],
      [],
      ['No', 'Nama Lengkap Guru', 'Jenjang', 'Kelas Diajar', 'Email', 'No. WhatsApp', 'Paket Layanan', 'Nominal (Rp)', 'Status Akun', 'Tanggal Daftar', 'Tanggal Aktivasi'],
      ...teachers.map((t, idx) => [
        idx + 1,
        t.name,
        t.teacherLevel,
        t.kelasYangDiajar,
        t.email,
        t.nomorWA || '-',
        t.paketDipilih === 'TAHUNAN' ? '1 Tahun (2 Smt)' : '1 Semester (6 Bulan)',
        t.hargaPaket || (t.paketDipilih === 'TAHUNAN' ? 100000 : 50000),
        t.statusAktivasi || 'MENUNGGU_PEMBAYARAN',
        t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : '-',
        t.tanggalAktivasi ? new Date(t.tanggalAktivasi).toLocaleDateString('id-ID') : '-',
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Guru SatSet');
    XLSX.writeFile(wb, `Rekap_Guru_SatSet_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Hitung KPI Statistik
  const totalGuru = teachers.length;
  const menungguApproval = teachers.filter((t) => t.statusAktivasi === 'MENUNGGU_PERSETUJUAN').length;
  const totalAktif = teachers.filter((t) => t.statusAktivasi === 'AKTIF').length;
  const totalPemasukan = teachers
    .filter((t) => t.statusAktivasi === 'AKTIF')
    .reduce((sum, t) => sum + (t.hargaPaket || (t.paketDipilih === 'TAHUNAN' ? 100000 : 50000)), 0);

  // Filter List
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      if (filterStatus !== 'SEMUA') {
        if (filterStatus === 'MENUNGGU' && t.statusAktivasi !== 'MENUNGGU_PERSETUJUAN') return false;
        if (filterStatus === 'AKTIF' && t.statusAktivasi !== 'AKTIF') return false;
        if (filterStatus === 'BELUM_BAYAR' && t.statusAktivasi !== 'MENUNGGU_PEMBAYARAN') return false;
      }
      if (filterJenjang !== 'SEMUA' && t.teacherLevel !== filterJenjang) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          (t.nomorWA && t.nomorWA.includes(q)) ||
          t.kelasYangDiajar.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [teachers, filterStatus, filterJenjang, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 text-white rounded-2xl max-w-6xl w-full border border-slate-700 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 p-5 border-b border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Pusat Kendali Admin Sat-Set
                </h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Admin 0822-9056-9062
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kelola pendaftaran guru, verifikasi bukti transfer DANA, dan aktivasi akun paket Rp 50.000 & Rp 100.000
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Screen if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Masukkan Kata Sandi / PIN Admin</h3>
            <p className="text-xs text-slate-400">
              Halaman ini terproteksi khusus Pemilik Aplikasi. Masukkan kata sandi administrator untuk melanjutkan.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                placeholder="Masukkan kata sandi / PIN admin"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center font-mono text-base text-white tracking-widest focus:border-purple-500 focus:outline-hidden"
              />
              {pinError && <p className="text-xs text-rose-400 font-semibold">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Buka Panel Admin ⚡
              </button>
            </form>
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Guru Terdaftar
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {totalGuru} <span className="text-xs font-normal text-slate-400">Guru</span>
                </span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block flex items-center justify-between">
                  <span>Menunggu Verifikasi</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                </span>
                <span className="text-2xl font-black text-amber-300 mt-1 block">
                  {menungguApproval} <span className="text-xs font-normal text-amber-400/80">Perlu Dicek</span>
                </span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  Akun Aktif (Lunas)
                </span>
                <span className="text-2xl font-black text-emerald-300 mt-1 block">
                  {totalAktif} <span className="text-xs font-normal text-emerald-400/80">Guru</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                  Estimasi Dana Masuk
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">
                  Rp {totalPemasukan.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Action Bar & Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAddManualOpen(true)}
                  className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Guru Manual</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                  title="Unduh seluruh rekap data guru ke Excel"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>Ekspor Excel (.xlsx)</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, WA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300"
                >
                  <option value="SEMUA">Semua Status</option>
                  <option value="MENUNGGU">Menunggu Approval</option>
                  <option value="AKTIF">Sudah Aktif</option>
                  <option value="BELUM_BAYAR">Belum Bayar</option>
                </select>

                <select
                  value={filterJenjang}
                  onChange={(e) => setFilterJenjang(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300"
                >
                  <option value="SEMUA">Semua Jenjang</option>
                  <option value="SD">Guru SD</option>
                  <option value="SMP">Guru SMP</option>
                </select>
              </div>
            </div>

            {/* Table of Registered Teachers */}
            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-200 font-bold uppercase text-[11px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3 w-48">Identitas Guru & Jenjang</th>
                    <th className="p-3 w-44">Kontak (Email / WA)</th>
                    <th className="p-3 w-36">Paket Dipilih</th>
                    <th className="p-3 w-32 text-center">Bukti Transfer</th>
                    <th className="p-3 w-36 text-center">Status Akun</th>
                    <th className="p-3 w-40 text-center">Aksi Admin</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                        Tidak ada guru yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((teacher, idx) => {
                      const isAktif = teacher.statusAktivasi === 'AKTIF';
                      const isMenunggu = teacher.statusAktivasi === 'MENUNGGU_PERSETUJUAN';
                      const paketLabel =
                        teacher.paketDipilih === 'TAHUNAN' ? '1 Tahun (Rp 100k)' : '1 Semester (Rp 50k)';

                      return (
                        <tr
                          key={teacher.id}
                          className={`hover:bg-slate-800/50 transition-colors ${
                            isMenunggu ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>

                          <td className="p-3">
                            <span className="font-bold text-white text-xs block">{teacher.name}</span>
                            <span className="text-[11px] text-slate-400">
                              Guru {teacher.teacherLevel} • {teacher.kelasYangDiajar}
                            </span>
                            {teacher.nip && teacher.nip !== '-' && (
                              <span className="text-[10px] text-slate-500 block font-mono">
                                NIP: {teacher.nip}
                              </span>
                            )}
                          </td>

                          <td className="p-3 font-mono text-[11px]">
                            <div className="flex items-center space-x-1 text-slate-300">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span className="truncate max-w-[150px]">{teacher.email}</span>
                            </div>
                            {teacher.nomorWA && (
                              <div className="flex items-center space-x-1 text-emerald-400 mt-1">
                                <Phone className="w-3 h-3 text-emerald-500" />
                                <span>{teacher.nomorWA}</span>
                              </div>
                            )}
                          </td>

                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                teacher.paketDipilih === 'TAHUNAN'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                              }`}
                            >
                              {paketLabel}
                            </span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">
                              {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString('id-ID') : ''}
                            </span>
                          </td>

                          {/* Foto Bukti Transfer */}
                          <td className="p-3 text-center">
                            {teacher.buktiTransferUrl ? (
                              <button
                                onClick={() =>
                                  setPreviewBukti({
                                    url: teacher.buktiTransferUrl!,
                                    nama: teacher.name,
                                  })
                                }
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-600/40 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Foto</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Belum Ada</span>
                            )}
                          </td>

                          {/* Status Akun */}
                          <td className="p-3 text-center">
                            {isAktif ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                <Check className="w-3 h-3" />
                                <span>Aktif (Lunas)</span>
                              </span>
                            ) : isMenunggu ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Menunggu Approval</span>
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                                Menunggu Pembayaran
                              </span>
                            )}
                          </td>

                          {/* Aksi Admin: Aktifkan / Nonaktifkan */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              {!isAktif ? (
                                <button
                                  onClick={() => handleUpdateStatus(teacher.id, 'AKTIF')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                                  title="Setujui transfer & Aktifkan akun sekarang"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aktifkan</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(teacher.id, 'NONAKTIF')}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                                  title="Nonaktifkan akun"
                                >
                                  Nonaktifkan
                                </button>
                              )}

                              {teacher.nomorWA && (
                                <button
                                  onClick={() => handleSendWhatsAppNotification(teacher)}
                                  className="p-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                                  title={`Kirim status & info akun via WhatsApp ke ${teacher.nomorWA}`}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                                className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Akun"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Pratinjau Foto Bukti Transfer */}
        {previewBukti && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-sm text-white">
                  Bukti Transfer Guru: {previewBukti.nama}
                </h4>
                <button
                  onClick={() => setPreviewBukti(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center">
                <img
                  src={previewBukti.url}
                  alt="Bukti Transfer"
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setPreviewBukti(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Tambah Guru Manual */}
        {isAddManualOpen && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-base text-white">Tambah Akun Guru Baru (Manual)</h4>
                <button onClick={() => setIsAddManualOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddManualTeacher} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Contoh: Ahmad Fauzi, S.Pd."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Belajar / Pribadi *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Contoh: ahmad@guru.sd.belajar.id"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Jenjang</label>
                    <select
                      value={newJenjang}
                      onChange={(e) => setNewJenjang(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                    >
                      <option value="SD">Guru SD</option>
                      <option value="SMP">Guru SMP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Paket</label>
                    <select
                      value={newPaket}
                      onChange={(e) => setNewPaket(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                    >
                      <option value="SEMESTER">1 Semester (Rp 50k)</option>
                      <option value="TAHUNAN">1 Tahun (Rp 100k)</option>
                    </select>
                  </div>
                </div>

                {newJenjang === 'SD' && (
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Kelas yang Diajar</label>
                    <select
                      value={newKelas}
                      onChange={(e) => setNewKelas(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="Kelas 1">Kelas 1 (Fase A)</option>
                      <option value="Kelas 2">Kelas 2 (Fase A)</option>
                      <option value="Kelas 3">Kelas 3 (Fase B)</option>
                      <option value="Kelas 4">Kelas 4 (Fase B)</option>
                      <option value="Kelas 5">Kelas 5 (Fase C)</option>
                      <option value="Kelas 6">Kelas 6 (Fase C)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={newWA}
                    onChange={(e) => setNewWA(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddManualOpen(false)}
                    className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                  >
                    Simpan & Aktifkan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
