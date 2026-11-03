import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  FileCheck2,
  Presentation,
  Building2,
  FolderOpen,
  HelpCircle,
  Zap,
  Printer,
  Award,
  Layers,
  ChevronDown,
  ChevronRight,
  Eye,
  CheckCircle,
  BookOpen,
  Users,
  ClipboardList,
  FileSpreadsheet,
  Grid,
  Package,
  FileBadge,
  ArrowLeftRight,
  FileDown,
  BookMarked,
  UserCheck,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { SchoolTeacherProfile, UserSubscription, UserAccount } from '../types/modul';

export type NavTab = 
  // 1. Administrasi Guru (Perangkat Kurikulum)
  | 'sampul'
  | 'atp'
  | 'promes'
  | 'prota'
  | 'kktp'
  | 'jurnal'
  | 'modul' 
  | 'p5' 
  | 'bank_soal' 
  | 'slide_ajar' 

  // 2. Administrasi Kelas
  | 'sampul_kelas'
  | 'data_sekolah'
  | 'data_siswa'
  | 'absen_kelas'
  | 'daftar_nilai'
  | 'jadwal_kelas'
  | 'struktur_kelas'
  | 'denah_kelas'
  | 'inventaris_kelas'
  | 'mutasi_siswa'
  | 'surat_pindah'

  // 3. Dokumen & Profil
  | 'viewer' 
  | 'history' 
  | 'profile_sekolah' 
  | 'pricing' 
  | 'guideline';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount: number;
  hasActiveDocument: boolean;
  schoolProfile: SchoolTeacherProfile;
  onQuickPrint?: () => void;
  subscription?: UserSubscription;
  currentUser?: UserAccount;
  onOpenAuth?: () => void;
  onOpenAdminPanel?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  hasActiveDocument,
  schoolProfile,
  onQuickPrint,
  subscription,
  currentUser,
  onOpenAuth,
  onOpenAdminPanel,
  onLogout,
}) => {
  // Check if current tab belongs to Administrasi Guru
  const isGuruTab = [
    'sampul',
    'atp',
    'promes',
    'prota',
    'kktp',
    'jurnal',
    'modul',
    'p5',
    'bank_soal',
    'slide_ajar',
  ].includes(activeTab);

  // Check if current tab belongs to Administrasi Kelas
  const isKelasTab = [
    'sampul_kelas',
    'data_sekolah',
    'data_siswa',
    'absen_kelas',
    'daftar_nilai',
    'jadwal_kelas',
    'struktur_kelas',
    'denah_kelas',
    'inventaris_kelas',
    'mutasi_siswa',
    'surat_pindah',
  ].includes(activeTab);

  // Accordion open states
  const [adminGuruOpen, setAdminGuruOpen] = useState(true);
  const [adminKelasOpen, setAdminKelasOpen] = useState(isKelasTab);

  useEffect(() => {
    if (isGuruTab) {
      setAdminGuruOpen(true);
    }
    if (isKelasTab) {
      setAdminKelasOpen(true);
    }
  }, [activeTab, isGuruTab, isKelasTab]);

  // List 1: Administrasi Guru (Perangkat Kurikulum) matching Screenshot 2 Right Box
  const adminGuruItems = [
    { id: 'sampul' as NavTab, label: 'Sampul (Cover Perangkat)', icon: BookOpen },
    { id: 'atp' as NavTab, label: 'ATP (Alur Tujuan)', icon: Layers },
    { id: 'promes' as NavTab, label: 'PROSEM (Program Semester)', icon: Calendar },
    { id: 'prota' as NavTab, label: 'PROTA (Program Tahunan)', icon: Calendar },
    { id: 'kktp' as NavTab, label: 'KKTP (Kriteria Ketuntasan)', icon: FileCheck2 },
    { id: 'jurnal' as NavTab, label: 'Jurnal Harian Mengajar', icon: BookMarked },
    { id: 'modul' as NavTab, label: 'Modul Ajar / RPP Dinas', icon: FileText },
    { id: 'p5' as NavTab, label: 'Modul Projek P5', icon: Sparkles },
    { id: 'bank_soal' as NavTab, label: 'Bank Soal HOTS', icon: Award },
  ];

  // List 2: Administrasi Kelas matching Screenshot 2 Left Box
  const adminKelasItems = [
    { id: 'sampul_kelas' as NavTab, label: 'Sampul Administrasi Kelas', icon: BookOpen },
    { id: 'data_sekolah' as NavTab, label: 'Data Sekolah', icon: Building2 },
    { id: 'data_siswa' as NavTab, label: 'Data Siswa', icon: Users },
    { id: 'absen_kelas' as NavTab, label: 'Absen Kelas', icon: ClipboardList },
    { id: 'daftar_nilai' as NavTab, label: 'Daftar Nilai', icon: FileSpreadsheet },
    { id: 'jadwal_kelas' as NavTab, label: 'Jadwal Pelajaran', icon: Calendar },
    { id: 'struktur_kelas' as NavTab, label: 'Struktur Kelas', icon: Grid },
    { id: 'denah_kelas' as NavTab, label: 'Denah Kelas', icon: Grid },
    { id: 'inventaris_kelas' as NavTab, label: 'Inventaris Kelas', icon: Package },
    { id: 'mutasi_siswa' as NavTab, label: 'Daftar Mutasi / Masuk', icon: ArrowLeftRight },
    { id: 'surat_pindah' as NavTab, label: 'Surat Pindah & Lolos Mutu', icon: FileDown },
  ];

  return (
    <aside 
      className="no-print sidebar-locked w-64 lg:w-72 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl select-none h-screen sticky top-0"
    >
      {/* 1. Header & Brand */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 shrink-0">
        <div 
          onClick={() => setActiveTab('modul')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white">
                Sat-Set
              </span>
              {subscription?.planType === 'GURU_PRO' ? (
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase shadow-xs">
                  VIP PRO
                </span>
              ) : subscription?.planType === 'SEKOLAH' ? (
                <span className="bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase shadow-xs">
                  SEKOLAH
                </span>
              ) : (
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Format Dinas
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
              Administrasi Guru & Kelas
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Role & Level Badge */}
      <div className="px-3 pt-3 shrink-0">
        <div
          onClick={onOpenAuth}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between ${
            currentUser?.teacherLevel === 'SD'
              ? 'bg-emerald-950/40 border-emerald-800/80 hover:border-emerald-600 hover:bg-emerald-950/60'
              : 'bg-indigo-950/40 border-indigo-800/80 hover:border-indigo-600 hover:bg-indigo-950/60'
          }`}
          title="Klik untuk beralih jenjang (SD / SMP) atau mengelola akun guru"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                currentUser?.teacherLevel === 'SD'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {currentUser?.teacherLevel === 'SD' ? 'SD' : 'SMP'}
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-black tracking-wide text-white uppercase">
                  {currentUser?.teacherLevel === 'SD' ? `Guru SD (${currentUser.kelasYangDiajar || 'Kelas'})` : 'Guru Mapel SMP'}
                </span>
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                    currentUser?.teacherLevel === 'SD'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {currentUser?.teacherLevel === 'SD'
                    ? (currentUser.faseTerkunci ? currentUser.faseTerkunci.split('(')[0].trim() : 'Fase Terkunci')
                    : 'Semua Kelas (Fase D)'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                {currentUser?.name || schoolProfile.namaGuru}
              </p>
            </div>
          </div>
          <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0 ml-1" />
        </div>
      </div>

      {/* 2. Scrollable Middle Navigation Groups */}
      <div className="flex-1 px-3 py-3 space-y-3 overflow-y-auto pr-1.5 custom-scrollbar flex flex-col justify-start">
        
        {/* DUA KELOMPOK UTAMA SESUAI PERMINTAAN USER */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              setAdminGuruOpen(true);
              if (!isGuruTab) setActiveTab('sampul');
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              isGuruTab
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] leading-tight font-black">Admin Guru</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAdminKelasOpen(true);
              if (!isKelasTab) setActiveTab('sampul_kelas');
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              isKelasTab
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] leading-tight font-black">Admin Kelas</span>
          </button>
        </div>

        {/* KELOMPOK 1: ADMINISTRASI GURU / PERANGKAT KURIKULUM */}
        <div>
          <button
            onClick={() => setAdminGuruOpen(!adminGuruOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              isGuruTab
                ? 'text-emerald-300 bg-slate-800/90'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Layers className={`w-4 h-4 shrink-0 ${isGuruTab ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="truncate">Administrasi Guru (Perangkat)</span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 ml-1">
              <span className="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-1.5 py-0.5 rounded font-mono">
                {adminGuruItems.length}
              </span>
              {adminGuruOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>

          {adminGuruOpen && (
            <div className="pl-3 pr-1 pt-1 pb-1 space-y-0.5 border-l-2 border-emerald-800/50 ml-4 my-1">
              {adminGuruItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveTab(sub.id)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer text-left ${
                      isSubActive
                        ? 'bg-emerald-600/30 text-emerald-200 font-bold border-l-2 border-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* KELOMPOK 2: APLIKASI ADMINISTRASI KELAS (Matching Screenshot 2 Left Box) */}
        <div>
          <button
            onClick={() => setAdminKelasOpen(!adminKelasOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              isKelasTab
                ? 'text-sky-300 bg-slate-800/90'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Users className={`w-4 h-4 shrink-0 ${isKelasTab ? 'text-sky-400' : 'text-slate-400'}`} />
              <span className="truncate">Administrasi Kelas</span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 ml-1">
              <span className="text-[10px] text-sky-300 bg-sky-950/80 border border-sky-700/50 px-1.5 py-0.5 rounded font-mono">
                {adminKelasItems.length}
              </span>
              {adminKelasOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>

          {adminKelasOpen && (
            <div className="pl-3 pr-1 pt-1 pb-1 space-y-0.5 border-l-2 border-sky-800/50 ml-4 my-1">
              {adminKelasItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveTab(sub.id)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer text-left ${
                      isSubActive
                        ? 'bg-sky-600/30 text-sky-200 font-bold border-l-2 border-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section Label: DOKUMEN & PROFIL */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-0.5">
          Dokumen & Cetak A4
        </p>

        {/* Tombol Cetak / Unduh PDF A4 Cepat untuk Semua Navigasi */}
        <button
          type="button"
          onClick={() => {
            if (onQuickPrint) {
              onQuickPrint();
            } else {
              window.print();
            }
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 hover:from-rose-800 hover:to-red-800 text-white shadow-md shadow-rose-950/40 border border-rose-500/40 group"
          title="Unduh / Cetak tampilan halaman aktif ke format PDF Kertas A4 Standar Dinas"
        >
          <div className="flex items-center space-x-2.5">
            <Printer className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="font-extrabold tracking-wide">Unduh PDF A4</span>
          </div>
          <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">
            A4
          </span>
        </button>

        {/* Item: Lihat & Cetak Dokumen Aktif */}
        <button
          disabled={!hasActiveDocument}
          onClick={() => setActiveTab('viewer')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
            !hasActiveDocument
              ? 'opacity-30 cursor-not-allowed text-slate-500'
              : activeTab === 'viewer'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Eye className={`w-4 h-4 shrink-0 ${activeTab === 'viewer' ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>Lihat & Cetak Dokumen</span>
          </div>
          {hasActiveDocument && activeTab !== 'viewer' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* Item: Arsip Dokumen Tersimpan */}
        <button
          onClick={() => setActiveTab('history')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <FolderOpen className={`w-4 h-4 shrink-0 ${activeTab === 'history' ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>Arsip Dokumen</span>
          </div>
          {savedCount > 0 && (
            <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded-full font-bold">
              {savedCount}
            </span>
          )}
        </button>

        {/* Item: Profil Satuan Pendidikan & TTD */}
        <button
          onClick={() => setActiveTab('profile_sekolah')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'profile_sekolah'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'profile_sekolah' ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>Profil Sekolah & TTD</span>
          </div>
        </button>

        {/* Item: Buku Petunjuk & Bantuan (Solusi Kesulitan) */}
        <button
          onClick={() => setActiveTab('guideline')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
            activeTab === 'guideline'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Buku Petunjuk Penggunaan Aplikasi & Panduan Solusi Apabila Ada Kesulitan"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <BookMarked className={`w-4 h-4 shrink-0 ${activeTab === 'guideline' ? 'text-amber-300' : 'text-emerald-400'}`} />
            <span className="truncate">Buku Petunjuk & Bantuan</span>
          </div>
          <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
            BANTUAN
          </span>
        </button>

        {/* Item: Panel Admin (Aktivasi Guru) */}
        {onOpenAdminPanel && (
          <button
            onClick={onOpenAdminPanel}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30"
          >
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Panel Admin (Aktivasi)</span>
            </div>
            <span className="text-[9px] bg-purple-500/40 text-purple-200 px-1.5 py-0.5 rounded font-mono font-bold">
              WA
            </span>
          </button>
        )}
      </div>

      {/* 3. Footer Profile Snippet */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0 text-xs">
        <div className="flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="font-bold text-slate-200 truncate text-[11px]">
              {schoolProfile.namaGuru || 'Guru Kelas'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {schoolProfile.namaSekolah || 'Satuan Pendidikan'}
            </p>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setActiveTab('profile_sekolah')}
              title="Kelola Data Sekolah & Guru"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="p-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
