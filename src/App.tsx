import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { ModulForm } from './components/ModulForm';
import { AtpForm } from './components/AtpForm';
import { ProtaForm } from './components/ProtaForm';
import { PromesForm } from './components/PromesForm';
import { KktpForm } from './components/KktpForm';
import { SampulForm } from './components/SampulForm';
import { JurnalGuruForm } from './components/JurnalGuruForm';
import { AdministrasiKelasView, SubAdminKelas } from './components/AdministrasiKelasView';
import { P5GeneratorForm } from './components/P5GeneratorForm';
import { BankSoalForm } from './components/BankSoalForm';
import { SlideAjarForm } from './components/SlideAjarForm';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { DocumentViewer } from './components/DocumentViewer';
import { HistoryModal } from './components/HistoryModal';
import { GuidelineModal } from './components/GuidelineModal';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { AuthLandingPage } from './components/AuthLandingPage';
import { PaymentView } from './components/PaymentView';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import {
  ModulParams,
  AtpParams,
  ProtaParams,
  PromesParams,
  KktpParams,
  SampulParams,
  JurnalParams,
  ProtaPromesParams,
  P5Params,
  BankSoalParams,
  SlideAjarParams,
  SavedModul,
  SchoolTeacherProfile,
  UserSubscription,
  UserAccount,
} from './types/modul';
import { INITIAL_SAMPLE_MODUL } from './data/presets';
import { triggerPrint } from './utils/exporter';
import { AlertCircle, CheckCircle, Info, Menu, X, UserCheck, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'satset_saved_documents_v2';
const PROFILE_KEY = 'satset_school_profile_v2';
const USER_ACCOUNT_KEY = 'satset_active_user_account_v2';

const DEFAULT_USER_ACCOUNT: UserAccount = {
  id: 'guru-guest',
  name: '',
  email: '',
  role: 'GURU_SD',
  teacherLevel: 'SD',
  kelasYangDiajar: 'Kelas 4',
  faseTerkunci: 'Fase B (Kelas 3-4 SD)',
  isLoggedIn: false, // Default is logged out so first-time visitors see AuthLandingPage
  statusAktivasi: 'MENUNGGU_PEMBAYARAN',
  createdAt: new Date().toISOString(),
};

const DEFAULT_PROFILE: SchoolTeacherProfile = {
  namaSekolah: 'SDN 4 PALASA',
  npsn: '40202826',
  jenjang: 'SD',
  statusSekolah: 'Negeri',
  akreditasi: 'A',
  alamatSekolah: 'Jl. Pantai Indah Dusun V Palasa Tangki',
  kelurahanDesa: 'Palasa',
  kecamatan: 'Parigi Moutong',
  kotaKabupaten: 'Sulawesi Tengah',
  provinsi: 'Sulawesi Tengah',
  kodePos: '94477',
  teleponEmail: '-',
  dinasPendidikan: 'KOORDINATOR WILAYAH SATUAN PENDIDIKAN KECAMATAN PALASA',
  cabangDinas: 'PEMERINTAH KABUPATEN PARIGI MOUTONG',
  kepalaSekolah: 'HADJRIN, S.Pd',
  nipKepalaSekolah: '19700712 199606 1 001',
  pangkatGolonganKepsek: 'Pembina, IV/a',
  namaGuru: 'MARWINI, A.Ma',
  nipGuru: '196608151986062001',
  nuptkGuru: '-',
  mataPelajaranGuru: 'Guru Kelas 1',
  faseKelasDiampu: '1',
  noHpGuru: '-',
  pengawasSekolah: 'Pengawas Pembina Kecamatan Palasa',
  nipPengawas: '-',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('viewer');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // School and Teacher Profile State
  const [schoolProfile, setSchoolProfile] = useState<SchoolTeacherProfile>(() => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROFILE;
  });

  // Saved Documents State
  const [savedDocuments, setSavedDocuments] = useState<SavedModul[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading saved documents:', e);
      }
    }

    // Initial official Dinas sample
    const initialItem: SavedModul = {
      id: 'default-ipa-ekosistem',
      title: 'Interaksi Antar Komponen Ekosistem dan Jaring-Jaring Makanan',
      subject: 'Ilmu Pengetahuan Alam (IPA)',
      faseKelas: 'Fase D (Kelas 7 SMP)',
      docType: 'MODUL_AJAR',
      jenjang: 'SMP',
      model: 'Problem Based Learning (PBL)',
      markdownContent: INITIAL_SAMPLE_MODUL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schoolInfo: DEFAULT_PROFILE,
    };
    return [initialItem];
  });

  const [currentDocument, setCurrentDocument] = useState<SavedModul | null>(() => {
    return savedDocuments.length > 0 ? savedDocuments[0] : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // User Subscription Plan State
  const SUBSCRIPTION_KEY = 'satset_user_subscription_v2';
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const raw = localStorage.getItem(SUBSCRIPTION_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      planType: 'FREE',
      planName: 'Guru Pemula (Uji Coba Gratis)',
    };
  });

  // User Account & Teacher Role State (SD vs SMP)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const raw = localStorage.getItem(USER_ACCOUNT_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.email && parsed.email.toLowerCase() === 'fadli46046@gmail.com') {
          return {
            ...DEFAULT_USER_ACCOUNT,
            ...parsed,
            isAdmin: true,
            statusAktivasi: 'AKTIF',
          };
        }
        return { ...DEFAULT_USER_ACCOUNT, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER_ACCOUNT;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const handleUpdateUser = (updatedUser: UserAccount) => {
    const finalUser = {
      ...updatedUser,
      isAdmin: updatedUser.isAdmin || updatedUser.email.toLowerCase() === 'fadli46046@gmail.com',
      statusAktivasi: updatedUser.email.toLowerCase() === 'fadli46046@gmail.com' ? 'AKTIF' : updatedUser.statusAktivasi,
    };
    setCurrentUser(finalUser);
    try {
      localStorage.setItem(USER_ACCOUNT_KEY, JSON.stringify(finalUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (user: UserAccount) => {
    const finalUser = {
      ...user,
      isAdmin: user.isAdmin || user.email.toLowerCase() === 'fadli46046@gmail.com',
      statusAktivasi: user.email.toLowerCase() === 'fadli46046@gmail.com' ? 'AKTIF' : user.statusAktivasi,
    };
    setCurrentUser(finalUser);
    try {
      localStorage.setItem(USER_ACCOUNT_KEY, JSON.stringify(finalUser));
    } catch (e) {
      console.error(e);
    }
    setSchoolProfile((prev) => ({
      ...prev,
      namaGuru: user.name || prev.namaGuru,
      nipGuru: user.nip || prev.nipGuru,
      nuptkGuru: user.nuptk || prev.nuptkGuru,
      namaSekolah: user.namaSekolah || prev.namaSekolah,
      npsn: user.npsn || prev.npsn,
      jenjang: user.teacherLevel,
      mataPelajaranGuru: user.mataPelajaran || prev.mataPelajaranGuru,
      faseKelasDiampu: user.kelasYangDiajar || user.kelasDiampu || prev.faseKelasDiampu,
    }));
    if (user.statusAktivasi === 'AKTIF' || user.isAdmin) {
      showToast(
        `Selamat Datang, Bapak/Ibu ${user.name || 'Guru'}! Akses Guru ${user.teacherLevel} telah aktif.`,
        'success'
      );
    } else {
      showToast(
        `Pendaftaran berhasil! Selesaikan pembayaran DANA untuk aktivasi akun.`,
        'info'
      );
    }
  };

  const handleLogout = () => {
    const guestUser: UserAccount = {
      ...DEFAULT_USER_ACCOUNT,
      isLoggedIn: false,
      statusAktivasi: 'MENUNGGU_PEMBAYARAN',
      name: '',
      email: '',
    };
    setCurrentUser(guestUser);
    try {
      localStorage.setItem(USER_ACCOUNT_KEY, JSON.stringify(guestUser));
    } catch (e) {
      console.error(e);
    }
    showToast('Anda telah keluar dari akun.', 'info');
  };

  const handleActivateSubscription = (plan: UserSubscription) => {
    setSubscription(plan);
    try {
      localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(plan));
    } catch (e) {
      console.error(e);
    }
    showToast(`Akun Berhasil Ditingkatkan: ${plan.planName}`, 'success');
  };

  // Sync profile to localStorage (Data terisolasi per akun guru)
  useEffect(() => {
    try {
      const userProfileKey = currentUser?.id ? `satset_school_profile_${currentUser.id}` : PROFILE_KEY;
      localStorage.setItem(userProfileKey, JSON.stringify(schoolProfile));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(schoolProfile));
    } catch (e) {
      console.error(e);
    }
  }, [schoolProfile, currentUser?.id]);

  // Sync savedDocuments to user-scoped localStorage (Data terisolasi per akun guru)
  useEffect(() => {
    try {
      const userDocKey = currentUser?.id ? `satset_saved_docs_${currentUser.id}` : STORAGE_KEY;
      localStorage.setItem(userDocKey, JSON.stringify(savedDocuments));
    } catch (e) {
      console.error(e);
    }
  }, [savedDocuments, currentUser?.id]);

  // When currentUser changes, reload that user's private documents & private profile
  useEffect(() => {
    if (currentUser?.id) {
      // 1. Reload user-scoped documents
      const userDocKey = `satset_saved_docs_${currentUser.id}`;
      const rawDocs = localStorage.getItem(userDocKey);
      if (rawDocs) {
        try {
          const parsed = JSON.parse(rawDocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedDocuments(parsed);
            setCurrentDocument(parsed[0]);
          } else {
            setSavedDocuments([]);
            setCurrentDocument(null);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setSavedDocuments([]);
        setCurrentDocument(null);
      }

      // 2. Reload user-scoped profile
      const userProfileKey = `satset_school_profile_${currentUser.id}`;
      const rawProfile = localStorage.getItem(userProfileKey);
      if (rawProfile) {
        try {
          const parsed = JSON.parse(rawProfile);
          setSchoolProfile((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Initialize profile from user's registration data
        setSchoolProfile((prev) => ({
          ...prev,
          namaGuru: currentUser.name || prev.namaGuru,
          nipGuru: currentUser.nip || prev.nipGuru,
          nuptkGuru: currentUser.nuptk || prev.nuptkGuru,
          namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
          npsn: currentUser.npsn || prev.npsn,
          jenjang: currentUser.teacherLevel,
          mataPelajaranGuru: currentUser.mataPelajaran || prev.mataPelajaranGuru,
          faseKelasDiampu: currentUser.kelasYangDiajar || currentUser.kelasDiampu || prev.faseKelasDiampu,
        }));
      }
    }
  }, [currentUser?.id]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaveSchoolProfile = (profile: SchoolTeacherProfile) => {
    setSchoolProfile(profile);
    // Realtime update active document schoolInfo so Kop and Signatures update instantly
    if (currentDocument) {
      const updatedDoc: SavedModul = {
        ...currentDocument,
        schoolInfo: profile,
        updatedAt: new Date().toISOString(),
      };
      setCurrentDocument(updatedDoc);
      setSavedDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    }
    showToast('Data Profil Satuan Pendidikan, Kepala Sekolah & Guru berhasil disimpan!', 'success');
  };

  // Helper to store generated document
  const saveGeneratedDocument = (
    title: string,
    subject: string,
    faseKelas: string,
    docType: any,
    content: string,
    modelName?: string
  ) => {
    const newDoc: SavedModul = {
      id: `doc-${Date.now()}`,
      title,
      subject,
      faseKelas,
      docType,
      model: modelName || 'Format Resmi Dinas',
      markdownContent: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schoolInfo: schoolProfile,
    };

    setSavedDocuments((prev) => [newDoc, ...prev]);
    setCurrentDocument(newDoc);
    setActiveTab('viewer');
    setMobileSidebarOpen(false);
  };

  // 1. Generate Modul Ajar
  const handleGenerateModul = async (params: ModulParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-modul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons modul kosong dari server.');

      saveGeneratedDocument(
        params.topikMateri,
        params.mataPelajaran,
        params.faseKelas,
        'MODUL_AJAR',
        data.modul,
        params.modelPembelajaran
      );

      if (data.warning) {
        showToast(data.warning, 'info');
      } else {
        showToast('Modul Ajar Format Dinas berhasil disusun!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun modul ajar. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Generate PROTA (Program Tahunan)
  const handleGenerateProta = async (params: ProtaParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-prota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons PROTA kosong dari server.');

      saveGeneratedDocument(
        `PROTA ${params.mataPelajaran} - ${params.tahunAjaran}`,
        params.mataPelajaran,
        params.faseKelas,
        'PROTA',
        data.modul,
        'Program Tahunan Format Resmi Dinas'
      );

      showToast('Program Tahunan (PROTA) berhasil disusun!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun PROTA. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Generate PROMES (Program Semester)
  const handleGeneratePromes = async (params: PromesParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-promes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons PROMES kosong dari server.');

      saveGeneratedDocument(
        `PROMES ${params.mataPelajaran} Semester ${params.semester} - ${params.tahunAjaran}`,
        params.mataPelajaran,
        params.faseKelas,
        'PROMES',
        data.modul,
        `Program Semester ${params.semester} Format Resmi Dinas`
      );

      showToast(`Program Semester (PROMES) ${params.semester} berhasil disusun!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun PROMES. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate ALUR TUJUAN PEMBELAJARAN (ATP)
  const handleGenerateAtp = async (params: AtpParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-atp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons ATP kosong dari server.');

      saveGeneratedDocument(
        `ATP ${params.mataPelajaran} - ${params.tahunAjaran}`,
        params.mataPelajaran,
        params.faseKelas,
        'ATP',
        data.modul,
        'Alur Tujuan Pembelajaran dari CP'
      );

      showToast('Alur Tujuan Pembelajaran (ATP) berhasil disusun dari Capaian Pembelajaran!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun ATP. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
  const handleGenerateKktp = async (params: KktpParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-kktp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons KKTP kosong dari server.');

      saveGeneratedDocument(
        `KKTP ${params.mataPelajaran} Semester ${params.semester} - ${params.tahunAjaran}`,
        params.mataPelajaran,
        params.faseKelas,
        'KKTP',
        data.modul,
        params.semester
      );

      showToast(`Kriteria Ketercapaian (KKTP) Semester ${params.semester} berhasil disusun!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun KKTP. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Sampul (Cover Perangkat Pembelajaran)
  const handleGenerateSampul = (params: SampulParams) => {
    saveGeneratedDocument(
      `Sampul Perangkat Pembelajaran Kelas ${params.faseKelas} - ${params.tahunAjaran}`,
      'Perangkat Pembelajaran',
      params.faseKelas,
      'SAMPUL',
      `# PERANGKAT PEMBELAJARAN KURIKULUM MERDEKA\n\n**Satuan Pendidikan**: ${params.namaSekolah}\n**Kelas**: ${params.faseKelas}\n**Guru**: ${params.namaGuru}\n**NIP**: ${params.nipGuru}\n**Tahun Pelajaran**: ${params.tahunAjaran}`,
      'Cover Sampul Perangkat'
    );
    showToast('Sampul Perangkat Pembelajaran berhasil ditampilkan!', 'success');
  };

  // Generate Jurnal Pembelajaran Guru
  const handleGenerateJurnal = async (params: JurnalParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-jurnal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons jurnal kosong dari server.');

      saveGeneratedDocument(
        `Jurnal Harian Mengajar ${params.mataPelajaran} - ${params.tahunAjaran}`,
        params.mataPelajaran,
        params.faseKelas,
        'JURNAL',
        data.modul,
        params.semester
      );

      showToast(`Jurnal Harian Mengajar Semester ${params.semester} berhasil disusun!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun Jurnal Mengajar. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy Combined Generator PROTA & PROMES
  const handleGenerateProtaPromes = async (params: ProtaPromesParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-prota-promes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons prota promes kosong.');

      saveGeneratedDocument(
        `PROTA & PROMES ${params.mataPelajaran}`,
        params.mataPelajaran,
        params.faseKelas,
        'PROTA',
        data.modul,
        'Alokasi Waktu 1 Tahun'
      );

      showToast('Program Tahunan (PROTA) & Semester (PROMES) berhasil disusun!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun PROTA & PROMES. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Generate Modul Projek P5
  const handleGenerateP5 = async (params: P5Params) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-p5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons modul P5 kosong.');

      saveGeneratedDocument(
        `P5: ${params.temaP5} - ${params.subTemaJudul}`,
        'Projek Profil Pelajar Pancasila (P5)',
        params.fase,
        'MODUL_P5',
        data.modul,
        params.temaP5
      );

      showToast('Modul Projek P5 berhasil dirancang dan siap pakai!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal merancang modul P5. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Generate Bank Soal HOTS
  const handleGenerateBankSoal = async (params: BankSoalParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-bank-soal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons bank soal kosong.');

      saveGeneratedDocument(
        `Bank Soal ${params.jenisAsesmen}: ${params.topikMateri}`,
        params.mataPelajaran,
        params.faseKelas,
        'BANK_SOAL',
        data.modul,
        params.jenisAsesmen
      );

      showToast('Bank Soal HOTS & Kisi-Kisi berhasil dibuat!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyusun bank soal.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Generate Slide Bahan Ajar
  const handleGenerateSlideAjar = async (params: SlideAjarParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-slide-ajar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Respons slide kosong.');

      saveGeneratedDocument(
        `Slide Presentasi: ${params.topikMateri}`,
        params.mataPelajaran,
        params.faseKelas,
        'SLIDE_AJAR',
        data.modul,
        'Slide Deck Canva/PPT'
      );

      showToast('Slide Bahan Ajar berhasil dirangkum!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal membuat slide bahan ajar.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Refine active document
  const handleRefineModul = async (instruction: string) => {
    if (!currentDocument) return;
    setIsRefining(true);
    try {
      const response = await fetch('/api/refine-modul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentModul: currentDocument.markdownContent,
          instruction,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (!data.modul) throw new Error('Hasil penyesuaian kosong.');

      const updated: SavedModul = {
        ...currentDocument,
        markdownContent: data.modul,
        updatedAt: new Date().toISOString(),
      };

      setCurrentDocument(updated);
      setSavedDocuments((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showToast('Dokumen berhasil disesuaikan dengan instruksi supervisi!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyesuaikan dokumen.', 'error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleUpdateModul = (updatedContent: string) => {
    if (!currentDocument) return;
    const updated: SavedModul = {
      ...currentDocument,
      markdownContent: updatedContent,
      updatedAt: new Date().toISOString(),
    };
    setCurrentDocument(updated);
    setSavedDocuments((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast('Perubahan dokumen berhasil disimpan!', 'success');
  };

  const handleDeleteModul = (id: string) => {
    if (confirm('Hapus dokumen ini dari arsip?')) {
      const updated = savedDocuments.filter((m) => m.id !== id);
      setSavedDocuments(updated);
      if (currentDocument?.id === id) {
        setCurrentDocument(updated.length > 0 ? updated[0] : null);
      }
      showToast('Dokumen telah dihapus dari arsip.', 'info');
    }
  };

  // 1. Jika belum masuk / belum mendaftar: Tampilkan Portal Login & Pendaftaran Guru Baru
  if (!currentUser.isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
        {toast && (
          <div className="no-print fixed top-5 right-5 z-50 flex items-center space-x-2 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-2xl animate-bounce border border-slate-700">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        )}
        <AuthLandingPage
          onLogin={handleLogin}
          onOpenAdminPanel={() => setIsAdminDashboardOpen(true)}
        />
        <AdminDashboardModal
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          currentUser={currentUser}
          onUpdateCurrentUser={handleUpdateUser}
        />
      </div>
    );
  }

  // 2. Jika sudah login/daftar tapi status aktivasi belum AKTIF dan bukan admin: Tampilkan Halaman Info Pembayaran DANA
  if (currentUser.isLoggedIn && currentUser.statusAktivasi !== 'AKTIF' && !currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
        {toast && (
          <div className="no-print fixed top-5 right-5 z-50 flex items-center space-x-2 bg-slate-950 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-2xl animate-bounce border border-slate-700">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        )}
        <PaymentView
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onOpenAdminPanel={() => setIsAdminDashboardOpen(true)}
        />
        <AdminDashboardModal
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          currentUser={currentUser}
          onUpdateCurrentUser={handleUpdateUser}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-serif text-slate-900 antialiased selection:bg-sky-200">
      {/* Toast Notification */}
      {toast && (
        <div className="no-print fixed top-5 right-5 z-50 flex items-center space-x-2 bg-slate-950 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-2xl animate-bounce border border-slate-700">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Mobile Top Header (Toggle for Sidebar) */}
      <div className="no-print md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-black tracking-tight text-white">Sat-Set</span>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border flex items-center space-x-1 cursor-pointer ${
              currentUser.teacherLevel === 'SD'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-indigo-950/80 text-indigo-300 border-indigo-700'
            }`}
          >
            <span>Guru {currentUser.teacherLevel}</span>
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="no-print md:hidden fixed inset-0 bg-slate-950/70 z-35 backdrop-blur-xs"
        />
      )}

      {/* FIXED LOCKED SIDEBAR (Positioned on the left, non-scrollable) */}
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block z-40`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          savedCount={savedDocuments.length}
          hasActiveDocument={Boolean(currentDocument)}
          schoolProfile={schoolProfile}
          onQuickPrint={triggerPrint}
          subscription={subscription}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminDashboardOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* MAIN CONTENT AREA (Offset by sidebar width: ml-64 lg:ml-72) */}
      <div className="flex-1 md:ml-64 lg:ml-72 flex flex-col min-h-screen">
        <main className="flex-1 pb-16">
          {activeTab === 'modul' && (
            <ModulForm
              onGenerate={handleGenerateModul}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
              onOpenProfile={() => setActiveTab('profile_sekolah')}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'sampul' && (
            <SampulForm
              onGenerateSampul={handleGenerateSampul}
              schoolProfile={schoolProfile}
            />
          )}

          {activeTab === 'atp' && (
            <AtpForm
              onGenerate={handleGenerateAtp}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
            />
          )}

          {activeTab === 'prota' && (
            <ProtaForm
              onGenerate={handleGenerateProta}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
            />
          )}

          {activeTab === 'promes' && (
            <PromesForm
              onGenerate={handleGeneratePromes}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
            />
          )}

          {activeTab === 'kktp' && (
            <KktpForm
              onGenerate={handleGenerateKktp}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
            />
          )}

          {activeTab === 'jurnal' && (
            <JurnalGuruForm
              onGenerate={handleGenerateJurnal}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'p5' && (
            <P5GeneratorForm
              onGenerate={handleGenerateP5}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'bank_soal' && (
            <BankSoalForm
              onGenerate={handleGenerateBankSoal}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'slide_ajar' && (
            <SlideAjarForm
              onGenerate={handleGenerateSlideAjar}
              isLoading={isLoading}
              schoolProfile={schoolProfile}
            />
          )}

          {[
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
          ].includes(activeTab) && (
            <AdministrasiKelasView
              activeSub={activeTab as SubAdminKelas}
              setActiveSub={(sub) => setActiveTab(sub as any)}
              schoolProfile={schoolProfile}
              onUpdateSchoolProfile={handleSaveSchoolProfile}
              onOpenProfileModal={() => setActiveTab('profile_sekolah')}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'profile_sekolah' && (
            <SchoolProfileModal
              profile={schoolProfile}
              onSaveProfile={handleSaveSchoolProfile}
            />
          )}

          {activeTab === 'viewer' && (
            <DocumentViewer
              currentModul={currentDocument}
              onUpdateModul={handleUpdateModul}
              onRefineModul={handleRefineModul}
              isRefining={isRefining}
              onNewModul={() => setActiveTab('modul')}
              schoolProfile={schoolProfile}
              onOpenProfile={() => setActiveTab('profile_sekolah')}
            />
          )}

          {activeTab === 'history' && (
            <HistoryModal
              savedModuls={savedDocuments}
              onSelectModul={(modul) => {
                setCurrentDocument(modul);
                setActiveTab('viewer');
              }}
              onDeleteModul={handleDeleteModul}
              onNewModul={() => setActiveTab('modul')}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingModal
              subscription={subscription}
              onActivateSubscription={handleActivateSubscription}
            />
          )}

          {activeTab === 'guideline' && (
            <GuidelineModal
              isOpen={true}
              onClose={() => setActiveTab('modul')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-semibold text-slate-800">
              Sat-Set • Asisten Administrasi Kurikulum Merdeka Terstandarisasi Dinas Pendidikan
            </div>
            <p className="text-slate-400">
              Times New Roman Standard • Format Supervisi Pengawas (SD, SMP, SMA, SMK)
            </p>
          </div>
        </footer>
      </div>

      {/* Modal Login & Pemilihan Jenjang Guru (SD vs SMP) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Modal Panel Admin untuk Pemilik Aplikasi */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        currentUser={currentUser}
        onUpdateCurrentUser={handleUpdateUser}
      />
    </div>
  );
}
