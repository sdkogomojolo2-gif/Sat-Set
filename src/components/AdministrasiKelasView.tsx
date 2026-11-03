import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  Building2,
  FileSpreadsheet,
  Printer,
  FileDown,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Grid,
  ClipboardList,
  Package,
  BookOpen,
  ArrowLeftRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  RotateCcw,
  UserCheck,
  UserX,
  Save,
  RefreshCw,
} from 'lucide-react';
import { SchoolTeacherProfile, UserAccount } from '../types/modul';
import { triggerPrint } from '../utils/exporter';
import * as XLSX from 'xlsx';

export type SubAdminKelas =
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
  | 'surat_pindah';

interface AdministrasiKelasViewProps {
  activeSub: SubAdminKelas;
  setActiveSub: (sub: SubAdminKelas) => void;
  schoolProfile: SchoolTeacherProfile;
  onUpdateSchoolProfile?: (profile: SchoolTeacherProfile) => void;
  onOpenProfileModal: () => void;
  currentUser?: UserAccount;
  onOpenAuth?: () => void;
}

// -----------------------------------------------------------------------------
// 1. DATA MODELS & STORAGE KEYS
// -----------------------------------------------------------------------------
export interface StudentItem {
  id: string;
  nisNisn: string; // e.g. "123/4567"
  nis: string;
  nisn: string;
  nama: string;
  nik: string;
  jk: 'L' | 'P';
  tanggalLahir: string;
  agama: string;
  kelas: string;
  statusSiswa: string;
  alamat: string;
  telepon: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  tinggiBadan: string;
  beratBadan: string;
}

export interface StudentPindahItem {
  id: string;
  studentId?: string;
  nis: string;
  nisn: string;
  nama: string;
  nik: string;
  jk: 'L' | 'P';
  tanggalLahir: string;
  kelas: string;
  namaOrtu: string;
  tanggalPindah: string;
  sekolahTujuan: string;
  alamatSekolah: string;
  alasan: string;
}

export interface InventarisItem {
  id: string;
  namaBarang: string;
  jumlahBarang: number;
  tahunPembelian: string;
  hargaBarang: string;
  kondisiBarang: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  keterangan: string;
}

const DEFAULT_STUDENTS: StudentItem[] = [
  {
    id: '1',
    nisNisn: '123/4567',
    nis: '123',
    nisn: '4567',
    nama: 'Moh. Fadli',
    nik: '7208123456789000',
    jk: 'L',
    tanggalLahir: 'Palasa, 12-12-2012',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Siswa baru',
    alamat: 'Palasa',
    telepon: '0822-xxxx-xxxx',
    namaAyah: 'Ayah',
    namaIbu: 'Ibu',
    pekerjaanAyah: 'Petani',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '150 Cm',
    beratBadan: '40 Kg',
  },
  {
    id: '2',
    nisNisn: '124/4568',
    nis: '124',
    nisn: '4568',
    nama: 'Syafiqah Nazyla Putri',
    nik: '7208123456789001',
    jk: 'P',
    tanggalLahir: 'Palasa Tangki, 08-04-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Desa Palasa Tangki',
    telepon: '0852-1122-3344',
    namaAyah: 'Salim Badjeber',
    namaIbu: 'Nurhayati',
    pekerjaanAyah: 'PNS ( Pegawai Negeri Sipil )',
    pekerjaanIbu: 'Guru',
    tinggiBadan: '145 Cm',
    beratBadan: '38 Kg',
  },
  {
    id: '3',
    nisNisn: '125/4569',
    nis: '125',
    nisn: '4569',
    nama: 'Aisyah Putri Kirana',
    nik: '7208123456789002',
    jk: 'P',
    tanggalLahir: 'Parigi, 15-06-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Dusun V Palasa',
    telepon: '0813-9988-7766',
    namaAyah: 'Ahmad Ridwan',
    namaIbu: 'Siti Aminah',
    pekerjaanAyah: 'Wiraswasta',
    pekerjaanIbu: 'Pedagang',
    tinggiBadan: '142 Cm',
    beratBadan: '36 Kg',
  },
  {
    id: '4',
    nisNisn: '126/4570',
    nis: '126',
    nisn: '4570',
    nama: 'Alif Pratama',
    nik: '7208123456789003',
    jk: 'L',
    tanggalLahir: 'Palasa, 22-01-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Jl. Pantai Indah',
    telepon: '0821-4455-6677',
    namaAyah: 'Pratama Jaya',
    namaIbu: 'Ratna Sari',
    pekerjaanAyah: 'Nelayan',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '148 Cm',
    beratBadan: '39 Kg',
  },
  {
    id: '5',
    nisNisn: '127/4571',
    nis: '127',
    nisn: '4571',
    nama: 'Bintang Ramadhan',
    nik: '7208123456789004',
    jk: 'L',
    tanggalLahir: 'Palu, 11-09-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Palasa Tangki',
    telepon: '0853-2233-4455',
    namaAyah: 'Dedi Kurniawan',
    namaIbu: 'Halimah',
    pekerjaanAyah: 'Petani',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '146 Cm',
    beratBadan: '37 Kg',
  },
  {
    id: '6',
    nisNisn: '128/4572',
    nis: '128',
    nisn: '4572',
    nama: 'Citra Lestari',
    nik: '7208123456789005',
    jk: 'P',
    tanggalLahir: 'Palasa, 05-03-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Dusun V Palasa',
    telepon: '0822-7788-9900',
    namaAyah: 'Hendra Wijaya',
    namaIbu: 'Rostina',
    pekerjaanAyah: 'PNS',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '140 Cm',
    beratBadan: '35 Kg',
  },
  {
    id: '7',
    nisNisn: '129/4573',
    nis: '129',
    nisn: '4573',
    nama: 'Dimas Arya Kusuma',
    nik: '7208123456789006',
    jk: 'L',
    tanggalLahir: 'Parigi, 18-07-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Palasa Tangki',
    telepon: '0812-3344-5566',
    namaAyah: 'Kusuma Wardhana',
    namaIbu: 'Mardiana',
    pekerjaanAyah: 'Wiraswasta',
    pekerjaanIbu: 'Pedagang',
    tinggiBadan: '151 Cm',
    beratBadan: '41 Kg',
  },
  {
    id: '8',
    nisNisn: '130/4574',
    nis: '130',
    nisn: '4574',
    nama: 'Fadhilah Nurul Huda',
    nik: '7208123456789007',
    jk: 'P',
    tanggalLahir: 'Palasa, 29-10-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Jl. Pantai Indah',
    telepon: '0852-6677-8899',
    namaAyah: 'Nur Hidayat',
    namaIbu: 'Fatimah',
    pekerjaanAyah: 'Petani',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '144 Cm',
    beratBadan: '38 Kg',
  },
  {
    id: '9',
    nisNisn: '131/4575',
    nis: '131',
    nisn: '4575',
    nama: 'Gilang Permana',
    nik: '7208123456789008',
    jk: 'L',
    tanggalLahir: 'Palasa Tangki, 03-12-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Dusun V Palasa',
    telepon: '0823-1144-7788',
    namaAyah: 'Agus Permana',
    namaIbu: 'Sri Wahyuni',
    pekerjaanAyah: 'Nelayan',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '147 Cm',
    beratBadan: '39 Kg',
  },
  {
    id: '10',
    nisNisn: '132/4576',
    nis: '132',
    nisn: '4576',
    nama: 'Hanifah Azzahra',
    nik: '7208123456789009',
    jk: 'P',
    tanggalLahir: 'Palasa, 14-02-2013',
    agama: 'Islam',
    kelas: '1',
    statusSiswa: 'Aktif',
    alamat: 'Palasa',
    telepon: '0813-5566-7788',
    namaAyah: 'Lukman Hakim',
    namaIbu: 'Khadijah',
    pekerjaanAyah: 'Wiraswasta',
    pekerjaanIbu: 'IRT',
    tinggiBadan: '143 Cm',
    beratBadan: '37 Kg',
  },
];

const DEFAULT_PINDAH: StudentPindahItem[] = [
  {
    id: 'p1',
    nis: '124',
    nisn: '4568',
    nama: 'Syafiqah Nazyla Putri',
    nik: '7208123456789001',
    jk: 'P',
    tanggalLahir: 'Palasa Tangki, 08-04-2013',
    kelas: '1',
    namaOrtu: 'Salim Badjeber',
    tanggalPindah: '01 Agustus 2023',
    sekolahTujuan: 'SD Negeri 1 Parigi',
    alamatSekolah: 'Kecamatan Parigi Kabupaten Parigi Moutong',
    alasan: 'Mengikuti Orang Tua',
  },
];

const DEFAULT_INVENTARIS: InventarisItem[] = [
  { id: 'inv-1', namaBarang: 'Meja Guru', jumlahBarang: 1, tahunPembelian: '2021', hargaBarang: 'Rp 650.000', kondisiBarang: 'Baik', keterangan: 'Inventaris Sekolah' },
  { id: 'inv-2', namaBarang: 'Kursi Guru', jumlahBarang: 1, tahunPembelian: '2021', hargaBarang: 'Rp 350.000', kondisiBarang: 'Baik', keterangan: 'Inventaris Sekolah' },
  { id: 'inv-3', namaBarang: 'Meja Siswa', jumlahBarang: 20, tahunPembelian: '2022', hargaBarang: 'Rp 400.000', kondisiBarang: 'Baik', keterangan: 'BOS Reguler' },
  { id: 'inv-4', namaBarang: 'Kursi Siswa', jumlahBarang: 20, tahunPembelian: '2022', hargaBarang: 'Rp 200.000', kondisiBarang: 'Baik', keterangan: 'BOS Reguler' },
  { id: 'inv-5', namaBarang: 'Papan Tulis Whiteboard', jumlahBarang: 1, tahunPembelian: '2020', hargaBarang: 'Rp 750.000', kondisiBarang: 'Baik', keterangan: 'DAK Fisik' },
  { id: 'inv-6', namaBarang: 'Lemari Buku & Arsip Kelas', jumlahBarang: 1, tahunPembelian: '2021', hargaBarang: 'Rp 1.200.000', kondisiBarang: 'Baik', keterangan: 'Inventaris Sekolah' },
  { id: 'inv-7', namaBarang: 'Gambar Presiden & Wapres', jumlahBarang: 1, tahunPembelian: '2019', hargaBarang: 'Rp 150.000', kondisiBarang: 'Baik', keterangan: 'Kas Kelas' },
  { id: 'inv-8', namaBarang: 'Lambang Garuda Pancasila', jumlahBarang: 1, tahunPembelian: '2019', hargaBarang: 'Rp 120.000', kondisiBarang: 'Baik', keterangan: 'Kas Kelas' },
  { id: 'inv-9', namaBarang: 'Jam Dinding', jumlahBarang: 1, tahunPembelian: '2023', hargaBarang: 'Rp 85.000', kondisiBarang: 'Baik', keterangan: 'Kas Kelas' },
  { id: 'inv-10', namaBarang: 'Kotak P3K Lengkap', jumlahBarang: 1, tahunPembelian: '2023', hargaBarang: 'Rp 175.000', kondisiBarang: 'Baik', keterangan: 'UKS Sekolah' },
];

export const AdministrasiKelasView: React.FC<AdministrasiKelasViewProps> = ({
  activeSub,
  setActiveSub,
  schoolProfile,
  onUpdateSchoolProfile,
  onOpenProfileModal,
  currentUser,
  onOpenAuth,
}) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT (PERSISTENT VIA LOCALSTORAGE)
  // ---------------------------------------------------------------------------
  // User Scope for strict data isolation (Data 100% terpisah per akun guru)
  const userScope = currentUser?.id ? `_u_${currentUser.id}` : '';
  const STUDENTS_KEY = `satset_students_data_v3${userScope}`;
  const PINDAH_KEY = `satset_pindah_data_v3${userScope}`;
  const INVENTARIS_KEY = `satset_inventaris_data_v3${userScope}`;
  const ABSEN_KEY = `satset_absen_records_v3${userScope}`;
  const NILAI_KEY = `satset_nilai_records_v3${userScope}`;

  // 1. Data Siswa
  const [students, setStudents] = useState<StudentItem[]>(() => {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_STUDENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // Selected Checkboxes for Data Siswa
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [excelImportFeedback, setExcelImportFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  // 2. Data Siswa Pindah / Mutasi
  const [pindahList, setPindahList] = useState<StudentPindahItem[]>(() => {
    const raw = localStorage.getItem(PINDAH_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PINDAH;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PINDAH_KEY, JSON.stringify(pindahList));
    } catch (e) {
      console.error(e);
    }
  }, [pindahList]);

  const [selectedPindahIds, setSelectedPindahIds] = useState<string[]>([]);
  const [isPindahModalOpen, setIsPindahModalOpen] = useState(false);
  const [editingPindah, setEditingPindah] = useState<StudentPindahItem | null>(null);

  // 3. Inventaris
  const [inventarisList, setInventarisList] = useState<InventarisItem[]>(() => {
    const raw = localStorage.getItem(INVENTARIS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_INVENTARIS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(INVENTARIS_KEY, JSON.stringify(inventarisList));
    } catch (e) {
      console.error(e);
    }
  }, [inventarisList]);

  const [selectedInventarisIds, setSelectedInventarisIds] = useState<string[]>([]);
  const [isInventarisModalOpen, setIsInventarisModalOpen] = useState(false);
  const [editingInventaris, setEditingInventaris] = useState<InventarisItem | null>(null);

  // 4. Data Presensi / Absensi State (Bulan Juli 2023 by default matching Screenshot)
  const [absenBulanTahun, setAbsenBulanTahun] = useState('BULAN JULI 2023');
  const [absenGrid, setAbsenGrid] = useState<Record<string, Record<number, string>>>(() => {
    const raw = localStorage.getItem(ABSEN_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial sample matching image absen siswa.png
    return {
      '1': { 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'A', 9: 'A', 10: 'A', 11: 'A', 12: 'A', 13: 'A', 14: 'I', 15: 'I', 16: 'I', 17: 'I', 18: '.', 19: '.', 20: '.', 21: '.', 22: '.', 23: '.' },
      '3': { 3: '.', 5: 'A', 7: 'S', 9: 'I' },
      '5': { 9: 'I' },
      '6': { 7: 'A' },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(ABSEN_KEY, JSON.stringify(absenGrid));
    } catch (e) {
      console.error(e);
    }
  }, [absenGrid]);

  // 5. Data Nilai State (Matching daftar nilai.png)
  interface GradesRecord {
    agama?: number;
    pkn?: number;
    bindo?: number;
    mtk?: number;
    ipas?: number;
    rupa?: number;
    musik?: number;
    tari?: number;
    teater?: number;
    pjok?: number;
    uh1?: number;
    uh2?: number;
    uh3?: number;
    uh4?: number;
    praktik?: number;
    pts?: number;
    pas?: number;
  }

  const [nilaiGrid, setNilaiGrid] = useState<Record<string, GradesRecord>>(() => {
    const raw = localStorage.getItem(NILAI_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial values matching daftar nilai.png
    return {
      '1': { agama: 60, pkn: 60, bindo: 60, mtk: 60, ipas: 60, rupa: 60, pjok: 60, uh1: 78, uh2: 70, uh3: 70, uh4: 70, praktik: 80, pts: 85, pas: 90 },
      '2': { agama: 70, pkn: 77, bindo: 86, mtk: 78, ipas: 66, rupa: 65, teater: 78, pjok: 98, uh1: 60, uh2: 60, uh3: 60, uh4: 60, praktik: 60, pts: 60, pas: 60 },
      '3': { agama: 60, pkn: 60, bindo: 60, mtk: 60, ipas: 90, rupa: 90, musik: 90, tari: 90, teater: 60, pjok: 60, uh1: 70, uh2: 77, uh3: 98, uh4: 78, praktik: 66, pts: 65, pas: 78 },
      '4': { agama: 70, pkn: 77, bindo: 86, mtk: 78, ipas: 98, rupa: 65, teater: 78, pjok: 98, uh1: 60, uh2: 60, uh3: 60, uh4: 60, praktik: 60, pts: 60, pas: 60 },
      '5': { agama: 60, pkn: 60, bindo: 60, mtk: 60, ipas: 60, rupa: 60, teater: 60, pjok: 60, uh1: 70, uh2: 77, uh3: 86, uh4: 78, praktik: 66, pts: 65, pas: 78 },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(NILAI_KEY, JSON.stringify(nilaiGrid));
    } catch (e) {
      console.error(e);
    }
  }, [nilaiGrid]);

  const [editingNilaiStudent, setEditingNilaiStudent] = useState<StudentItem | null>(null);
  const [modeNilaiTab, setModeNilaiTab] = useState<'LEGER' | 'E_RAPOR'>('LEGER');

  // 6. Data Sekolah State (Direct in-place form matching data sekolah.png)
  const [schoolFormData, setSchoolFormData] = useState({
    namaSekolah: schoolProfile?.namaSekolah || 'SDN 4 PALASA',
    npsn: schoolProfile?.npsn || '40202826',
    alamatSekolah: schoolProfile?.alamatSekolah || 'Jl. Pantai Indah Dusun V Palasa Tangki',
    kodePos: schoolProfile?.kodePos || '94477',
    noTelepon: schoolProfile?.teleponEmail || '-',
    dusunTelp: 'Palasa Tangki',
    desaKelurahan: schoolProfile?.kelurahanDesa || 'Palasa',
    kecamatan: schoolProfile?.kecamatan || 'Parigi Moutong',
    kabupatenKota: schoolProfile?.kotaKabupaten || 'Sulawesi Tengah',
    provinsi: schoolProfile?.provinsi || 'Sulawesi Tengah',
    website: '-',
    email: '-',
    namaKepalaSekolah: schoolProfile?.kepalaSekolah || 'HADJRIN, S.Pd',
    nipKepalaSekolah: schoolProfile?.nipKepalaSekolah || '19700712 199606 1 001',
    namaWaliKelas: schoolProfile?.namaGuru || 'MARWINI, A.Ma',
    nipWaliKelas: schoolProfile?.nipGuru || '196608151986062001',
    nuptk: schoolProfile?.nuptkGuru || '-',
    kelas: schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || (currentUser?.teacherLevel === 'SMP' ? '7' : '1'),
    semester: 'Genap',
    tahunPelajaran: '2023/2024',
    fase: currentUser?.teacherLevel === 'SMP' ? 'D' : 'A',
  });

  // Sync when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const isCurSD = currentUser.teacherLevel === 'SD';
      const parsedKelas = currentUser.kelasYangDiajar
        ? currentUser.kelasYangDiajar.replace(/[^0-9]/g, '')
        : (isCurSD ? '4' : '7');
      const parsedFase = currentUser.faseTerkunci
        ? (currentUser.faseTerkunci.includes('Fase A') ? 'A' : currentUser.faseTerkunci.includes('Fase B') ? 'B' : currentUser.faseTerkunci.includes('Fase C') ? 'C' : 'D')
        : (isCurSD ? 'B' : 'D');

      setSchoolFormData((prev) => ({
        ...prev,
        namaSekolah: currentUser.namaSekolah || prev.namaSekolah,
        npsn: currentUser.npsn || prev.npsn,
        namaWaliKelas: currentUser.name || prev.namaWaliKelas,
        nipWaliKelas: currentUser.nip || prev.nipWaliKelas,
        kelas: parsedKelas || (isCurSD ? '4' : '7'),
        fase: parsedFase,
      }));
    }
  }, [currentUser]);

  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [schoolSaveSuccess, setSchoolSaveSuccess] = useState(false);

  // 6. Dynamic Jadwal Pelajaran & Piket State
  const JADWAL_KEY = `satset_jadwal_pelajaran_v2${userScope}`;
  const PIKET_KEY = `satset_jadwal_piket_v2${userScope}`;
  const STRUKTUR_KEY = `satset_struktur_kelas_v2${userScope}`;
  const DENAH_KEY = `satset_denah_kelas_v2${userScope}`;

  const [jadwalPelajaran, setJadwalPelajaran] = useState<string[][]>(() => {
    try {
      const saved = localStorage.getItem(JADWAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      ['Upacara / Agama', 'Pancasila', 'B. Indonesia', 'Matematika', 'IPAS', 'Senam'],
      ['Agama', 'Pancasila', 'B. Indonesia', 'Matematika', 'IPAS', 'Seni Rupa'],
      ['Istirahat', 'Istirahat', 'Istirahat', 'Istirahat', 'Istirahat', 'Istirahat'],
      ['B. Indonesia', 'Matematika', 'IPAS', 'PJOK', 'P5', 'Pembersihan'],
      ['B. Indonesia', 'Matematika', 'IPAS', 'PJOK', 'P5', 'Pulang'],
    ];
  });

  const [jadwalPiket, setJadwalPiket] = useState<string[][]>(() => {
    try {
      const saved = localStorage.getItem(PIKET_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      ['Moh. Fadli', 'Syafiqah', 'Aisyah', 'Alif', 'Bintang', 'Citra'],
      ['Dimas Arya', 'Fadhilah', 'Gilang', 'Hanifah', 'Moh. Fadli', 'Syafiqah'],
      ['Aisyah', 'Alif', 'Bintang', 'Citra', 'Dimas', 'Fadhilah'],
      ['Gilang', 'Hanifah', 'Moh. Fadli', 'Syafiqah', 'Aisyah', 'Alif'],
      ['Bintang', 'Citra', 'Dimas Arya', 'Fadhilah', 'Gilang', 'Hanifah'],
    ];
  });

  const [strukturOrganisasi, setStrukturOrganisasi] = useState<{
    waliKelas: string;
    ketuaKelas: string;
    wakilKetua: string;
    sekretaris1: string;
    sekretaris2: string;
    bendahara1: string;
    bendahara2: string;
    sieKeamanan: string;
    sieKebersihan: string;
    sieKeagamaan: string;
    sieKreativitas: string;
  }>(() => {
    try {
      const saved = localStorage.getItem(STRUKTUR_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      waliKelas: schoolProfile?.namaGuru || 'MARWINI, A.Ma',
      ketuaKelas: 'Moh. Fadli',
      wakilKetua: 'Alif Pratama',
      sekretaris1: 'Syafiqah Nazyla Putri',
      sekretaris2: 'Aisyah Putri Kirana',
      bendahara1: 'Citra Lestari',
      bendahara2: 'Fadhilah Nurul Huda',
      sieKeamanan: 'Bintang R. & Dimas Arya',
      sieKebersihan: 'Gilang Permana & Hanifah Azzahra',
      sieKeagamaan: 'Moh. Fadli & Syafiqah',
      sieKreativitas: 'Aisyah Putri & Alif Pratama',
    };
  });

  const [denahMejaSiswa, setDenahMejaSiswa] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(DENAH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return Array.from({ length: 20 }, (_, i) => '');
  });

  // Save to localStorage
  useEffect(() => {
    try { localStorage.setItem(JADWAL_KEY, JSON.stringify(jadwalPelajaran)); } catch (e) {}
  }, [jadwalPelajaran]);

  useEffect(() => {
    try { localStorage.setItem(PIKET_KEY, JSON.stringify(jadwalPiket)); } catch (e) {}
  }, [jadwalPiket]);

  useEffect(() => {
    try { localStorage.setItem(STRUKTUR_KEY, JSON.stringify(strukturOrganisasi)); } catch (e) {}
  }, [strukturOrganisasi]);

  useEffect(() => {
    try { localStorage.setItem(DENAH_KEY, JSON.stringify(denahMejaSiswa)); } catch (e) {}
  }, [denahMejaSiswa, DENAH_KEY]);

  // Reload user-scoped data when currentUser changes (Data isolasi penuh)
  useEffect(() => {
    if (currentUser?.id) {
      const scope = `_u_${currentUser.id}`;
      const rawStudents = localStorage.getItem(`satset_students_data_v3${scope}`);
      if (rawStudents) {
        try { setStudents(JSON.parse(rawStudents)); } catch (e) {}
      }
      const rawNilai = localStorage.getItem(`satset_nilai_records_v3${scope}`);
      if (rawNilai) {
        try { setNilaiGrid(JSON.parse(rawNilai)); } catch (e) {}
      }
      const rawAbsen = localStorage.getItem(`satset_absen_records_v3${scope}`);
      if (rawAbsen) {
        try { setAbsenGrid(JSON.parse(rawAbsen)); } catch (e) {}
      }
      const rawInventaris = localStorage.getItem(`satset_inventaris_data_v3${scope}`);
      if (rawInventaris) {
        try { setInventarisList(JSON.parse(rawInventaris)); } catch (e) {}
      }
      const rawPindah = localStorage.getItem(`satset_pindah_data_v3${scope}`);
      if (rawPindah) {
        try { setPindahList(JSON.parse(rawPindah)); } catch (e) {}
      }
    }
  }, [currentUser?.id]);

  // Modals for editing Jadwal, Piket, Struktur, Denah
  const [isEditJadwalModalOpen, setIsEditJadwalModalOpen] = useState(false);
  const [isEditPiketModalOpen, setIsEditPiketModalOpen] = useState(false);
  const [isEditStrukturModalOpen, setIsEditStrukturModalOpen] = useState(false);
  const [isEditDenahModalOpen, setIsEditDenahModalOpen] = useState(false);

  const handleSaveSchoolData = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSchoolProfile) {
      onUpdateSchoolProfile({
        ...schoolProfile,
        namaSekolah: schoolFormData.namaSekolah,
        npsn: schoolFormData.npsn,
        alamatSekolah: schoolFormData.alamatSekolah,
        kodePos: schoolFormData.kodePos,
        kelurahanDesa: schoolFormData.desaKelurahan,
        kecamatan: schoolFormData.kecamatan,
        kotaKabupaten: schoolFormData.kabupatenKota,
        provinsi: schoolFormData.provinsi,
        kepalaSekolah: schoolFormData.namaKepalaSekolah,
        nipKepalaSekolah: schoolFormData.nipKepalaSekolah,
        namaGuru: schoolFormData.namaWaliKelas,
        nipGuru: schoolFormData.nipWaliKelas,
        faseKelasDiampu: schoolFormData.kelas,
      });
    }
    setIsEditingSchool(false);
    setSchoolSaveSuccess(true);
    setTimeout(() => setSchoolSaveSuccess(false), 3000);
  };

  // 7. Surat Pindah & Lolos Butuh State
  const [activeSuratType, setActiveSuratType] = useState<'pindah' | 'lolos_butuh'>('pindah');
  const [selectedSuratStudentId, setSelectedSuratStudentId] = useState<string>(students[1]?.id || students[0]?.id || '1');
  const [suratNomor, setSuratNomor] = useState('421.2 / 085 / SD / VII / 2023');
  const [suratTanggal, setSuratTanggal] = useState('1 Agustus 2023');
  const [suratSekolahTujuan, setSekolahTujuan] = useState('Salah Satu Sekolah');
  const [suratAlasan, setSuratAlasan] = useState('Mengikuti Orang Tua');

  // Selected student for letters
  const activeLetterStudent = useMemo(() => {
    return students.find((s) => s.id === selectedSuratStudentId) || students[0] || DEFAULT_STUDENTS[0];
  }, [students, selectedSuratStudentId]);

  // Quick references to school data
  const school = schoolFormData.namaSekolah;
  const kelas = schoolFormData.kelas;
  const guru = schoolFormData.namaWaliKelas;
  const nipGuru = schoolFormData.nipWaliKelas;
  const kepsek = schoolFormData.namaKepalaSekolah;
  const nipKepsek = schoolFormData.nipKepalaSekolah;
  const tapel = schoolFormData.tahunPelajaran;

  // ---------------------------------------------------------------------------
  // FILTERED STUDENTS & ACTIONS
  // ---------------------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return students;
    const q = searchStudent.toLowerCase();
    return students.filter(
      (s) =>
        s.nama.toLowerCase().includes(q) ||
        s.nisNisn.toLowerCase().includes(q) ||
        s.nik.includes(q)
    );
  }, [students, searchStudent]);

  // Select all checkboxes for Data Siswa
  const handleSelectAllStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelectedStudents = () => {
    if (selectedStudentIds.length === 0) return;
    if (window.confirm(`Hapus ${selectedStudentIds.length} data siswa yang dipilih?`)) {
      setStudents((prev) => prev.filter((s) => !selectedStudentIds.includes(s.id)));
      setSelectedStudentIds([]);
    }
  };

  const handleDeleteSingleStudent = (id: string, nama: string) => {
    if (window.confirm(`Hapus data siswa "${nama}"?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSelectedStudentIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSaveStudentModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: StudentItem = {
      id: editingStudent ? editingStudent.id : `stu-${Date.now()}`,
      nisNisn: (fd.get('nisNisn') as string) || '100/2000',
      nis: (fd.get('nis') as string) || (fd.get('nisNisn') as string)?.split('/')[0] || '',
      nisn: (fd.get('nisn') as string) || (fd.get('nisNisn') as string)?.split('/')[1] || '',
      nama: (fd.get('nama') as string) || 'Nama Siswa',
      nik: (fd.get('nik') as string) || '7208000000000000',
      jk: (fd.get('jk') as 'L' | 'P') || 'L',
      tanggalLahir: (fd.get('tanggalLahir') as string) || 'Palasa, 01-01-2013',
      agama: (fd.get('agama') as string) || 'Islam',
      kelas: (fd.get('kelas') as string) || kelas,
      statusSiswa: (fd.get('statusSiswa') as string) || 'Aktif',
      alamat: (fd.get('alamat') as string) || 'Palasa',
      telepon: (fd.get('telepon') as string) || '0822-xxxx-xxxx',
      namaAyah: (fd.get('namaAyah') as string) || 'Ayah',
      namaIbu: (fd.get('namaIbu') as string) || 'Ibu',
      pekerjaanAyah: (fd.get('pekerjaanAyah') as string) || 'Petani',
      pekerjaanIbu: (fd.get('pekerjaanIbu') as string) || 'IRT',
      tinggiBadan: (fd.get('tinggiBadan') as string) || '145 Cm',
      beratBadan: (fd.get('beratBadan') as string) || '38 Kg',
    };

    if (editingStudent) {
      setStudents((prev) => prev.map((s) => (s.id === item.id ? item : s)));
    } else {
      setStudents((prev) => [...prev, item]);
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  // ---------------------------------------------------------------------------
  // ABSENSI CALCULATION LOGIC
  // ---------------------------------------------------------------------------
  const getStudentAbsenStats = (studentId: string) => {
    const studentDays = absenGrid[studentId] || {};
    let s = 0;
    let i = 0;
    let a = 0;
    let hadir = 0;

    for (let day = 1; day <= 31; day++) {
      const mark = (studentDays[day] || '').toUpperCase();
      if (mark === 'S') s++;
      else if (mark === 'I') i++;
      else if (mark === 'A') a++;
      else if (mark === '.') hadir++;
    }

    const totalDays = s + i + a + hadir;
    const pct = totalDays > 0 ? Math.round((hadir / totalDays) * 100) : null;

    return { s, i, a, hadir, pct };
  };

  const handleCellAbsenToggle = (studentId: string, day: number) => {
    setAbsenGrid((prev) => {
      const studentMap = { ...(prev[studentId] || {}) };
      const current = (studentMap[day] || '').toUpperCase();
      let next = '';
      if (!current) next = '.';
      else if (current === '.') next = 'S';
      else if (current === 'S') next = 'I';
      else if (current === 'I') next = 'A';
      else next = ''; // clear

      studentMap[day] = next;
      return { ...prev, [studentId]: studentMap };
    });
  };

  const handleMarkAllHadirToday = (dayNumber: number) => {
    setAbsenGrid((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s.id] = { ...(next[s.id] || {}), [dayNumber]: '.' };
      });
      return next;
    });
  };

  // ---------------------------------------------------------------------------
  // EXPORT & IMPORT EXCEL FUNCTIONS
  // ---------------------------------------------------------------------------
  // 1. Download Template Excel Khusus Data Siswa (Kosong + Contoh Baris)
  const downloadTemplateDataSiswaExcel = () => {
    const headers = [
      'No',
      'NIS/NISN',
      'Nama Siswa',
      'NIK',
      'L/P',
      'Tanggal Lahir',
      'Agama',
      'Kelas',
      'Status Siswa',
      'Alamat',
      'No Telepon Rumah',
      'Nama Ortu (Ayah)',
      'Nama Ortu (Ibu)',
      'Pekerjaan (Ayah)',
      'Pekerjaan (Ibu)',
      'Tinggi Badan',
      'Berat Badan',
    ];

    const sampleRow1 = [
      1,
      '123/4567',
      'Ahmad Fauzi (Contoh)',
      '7208123456789001',
      'L',
      'Palasa, 12-05-2013',
      'Islam',
      kelas,
      'Aktif',
      'Dusun I Palasa',
      '0821-9988-7766',
      'Syarifuddin',
      'Nurhayati',
      'Petani',
      'IRT',
      '142 Cm',
      '35 Kg',
    ];

    const sampleRow2 = [
      2,
      '124/4568',
      'Aisyah Putri (Contoh)',
      '7208123456789002',
      'P',
      'Palasa, 20-08-2013',
      'Islam',
      kelas,
      'Aktif',
      'Dusun II Palasa',
      '0822-1122-3344',
      'Mahmud',
      'Fatimah',
      'Wiraswasta',
      'Pedagang',
      '139 Cm',
      '32 Kg',
    ];

    const rows = [
      ['PETUNJUK PENGISIAN TEMPLATE DATA SISWA'],
      ['1. Jangan ubah urutan kolom pada baris header (Baris 6).'],
      ['2. Kolom L/P diisi "L" untuk Laki-laki atau "P" untuk Perempuan.'],
      ['3. Hapus baris contoh atau ganti dengan data peserta didik asli sekolah Anda.'],
      [],
      headers,
      sampleRow1,
      sampleRow2,
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Data_Siswa');
    XLSX.writeFile(wb, `Template_Data_Siswa_Kelas_${kelas}.xlsx`);
  };

  // 2. Unggah / Impor File Excel Data Siswa (.xlsx / .xls)
  const handleImportDataSiswaExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!rawData || rawData.length === 0) {
          setExcelImportFeedback({
            message: 'File Excel kosong atau tidak terbaca.',
            type: 'error',
          });
          return;
        }

        // Cari baris header yang mengandung 'NIS' atau 'Nama'
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rawData.length, 10); i++) {
          const rowText = (rawData[i] || []).join(' ').toLowerCase();
          if (rowText.includes('nis') && rowText.includes('nama')) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          setExcelImportFeedback({
            message: 'Format file tidak sesuai template: Kolom header NIS/Nama Siswa tidak ditemukan.',
            type: 'error',
          });
          return;
        }

        const dataRows = rawData.slice(headerRowIndex + 1);
        const importedStudents: StudentItem[] = [];

        dataRows.forEach((row, idx) => {
          if (!row || row.length === 0) return;
          // Anggap kolom 1: NIS/NISN, kolom 2: Nama Siswa
          const rawNisNisn = String(row[1] || '').trim();
          const rawNama = String(row[2] || '').trim();

          // Abaikan baris kosong atau petunjuk
          if (!rawNama || rawNama.toLowerCase().includes('(contoh)') || rawNama.toLowerCase().startsWith('nama siswa')) {
            return;
          }

          const rawNik = String(row[3] || '7208000000000000').trim();
          const rawJk = String(row[4] || 'L').trim().toUpperCase() === 'P' ? 'P' : 'L';
          const rawTgl = String(row[5] || '01-01-2013').trim();
          const rawAgama = String(row[6] || 'Islam').trim();
          const rawKelas = String(row[7] || kelas).trim();
          const rawStatus = String(row[8] || 'Aktif').trim();
          const rawAlamat = String(row[9] || 'Palasa').trim();
          const rawTelp = String(row[10] || '-').trim();
          const rawAyah = String(row[11] || '-').trim();
          const rawIbu = String(row[12] || '-').trim();
          const rawPekAyah = String(row[13] || '-').trim();
          const rawPekIbu = String(row[14] || '-').trim();
          const rawTB = String(row[15] || '-').trim();
          const rawBB = String(row[16] || '-').trim();

          const parts = rawNisNisn.split('/');
          const nisPart = parts[0] || String(100 + idx);
          const nisnPart = parts[1] || String(4500 + idx);

          importedStudents.push({
            id: `stu-imp-${Date.now()}-${idx}`,
            nisNisn: rawNisNisn || `${nisPart}/${nisnPart}`,
            nis: nisPart,
            nisn: nisnPart,
            nama: rawNama,
            nik: rawNik,
            jk: rawJk,
            tanggalLahir: rawTgl,
            agama: rawAgama,
            kelas: rawKelas,
            statusSiswa: rawStatus,
            alamat: rawAlamat,
            telepon: rawTelp,
            namaAyah: rawAyah,
            namaIbu: rawIbu,
            pekerjaanAyah: rawPekAyah,
            pekerjaanIbu: rawPekIbu,
            tinggiBadan: rawTB.endsWith('Cm') || rawTB.endsWith('cm') ? rawTB : `${rawTB} Cm`,
            beratBadan: rawBB.endsWith('Kg') || rawBB.endsWith('kg') ? rawBB : `${rawBB} Kg`,
          });
        });

        if (importedStudents.length === 0) {
          setExcelImportFeedback({
            message: 'Tidak ada baris data siswa yang valid untuk diimpor.',
            type: 'error',
          });
          return;
        }

        // Simpan ke state siswa
        setStudents((prev) => [...prev, ...importedStudents]);
        setExcelImportFeedback({
          message: `Berhasil mengimpor ${importedStudents.length} peserta didik dari Excel!`,
          type: 'success',
        });
        setTimeout(() => setExcelImportFeedback(null), 5000);
      } catch (err: any) {
        setExcelImportFeedback({
          message: `Gagal membaca Excel: ${err?.message || 'Format tidak valid'}`,
          type: 'error',
        });
      } finally {
        if (studentFileInputRef.current) {
          studentFileInputRef.current.value = '';
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  // 3. Export Data Siswa ke Excel
  const exportDataSiswaExcel = () => {
    const rows: (string | number)[][] = [
      ['DATA LENGKAP PESERTA DIDIK'],
      [`Satuan Pendidikan : ${school}`],
      [`Kelas             : ${kelas}`],
      [`Wali Kelas        : ${guru}`],
      [],
      [
        'No',
        'NIS/NISN',
        'Nama Siswa',
        'NIK',
        'L/P',
        'Tanggal Lahir',
        'Agama',
        'Kelas',
        'Status Siswa',
        'Alamat',
        'No Telepon Rumah',
        'Nama Ortu (Ayah)',
        'Nama Ortu (Ibu)',
        'Pekerjaan (Ayah)',
        'Pekerjaan (Ibu)',
        'Tinggi Badan',
        'Berat Badan',
      ],
    ];

    students.forEach((s, idx) => {
      rows.push([
        idx + 1,
        s.nisNisn,
        s.nama,
        s.nik,
        s.jk,
        s.tanggalLahir,
        s.agama,
        s.kelas,
        s.statusSiswa,
        s.alamat,
        s.telepon,
        s.namaAyah,
        s.namaIbu,
        s.pekerjaanAyah,
        s.pekerjaanIbu,
        s.tinggiBadan,
        s.beratBadan,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data_Siswa');
    XLSX.writeFile(wb, `Data_Siswa_${school.replace(/\s+/g, '_')}_Kelas_${kelas}.xlsx`);
  };

  const exportAbsensiExcel = () => {
    const rows: (string | number)[][] = [
      ['ABSENSI SISWA KELAS'],
      [`${absenBulanTahun}`],
      [`Satuan Pendidikan : ${school}`],
      [],
    ];

    const header: (string | number)[] = ['No', 'Nama'];
    for (let d = 1; d <= 31; d++) header.push(d);
    header.push('SAKIT (S)', 'IZIN (I)', 'ALPA (A)', 'HADIR (.)', 'Presentasi Kehadiran');
    rows.push(header);

    students.forEach((s, idx) => {
      const stats = getStudentAbsenStats(s.id);
      const studentDays = absenGrid[s.id] || {};
      const row: (string | number)[] = [idx + 1, s.nama];
      for (let d = 1; d <= 31; d++) {
        row.push(studentDays[d] || '');
      }
      row.push(
        stats.s || '-',
        stats.i || '-',
        stats.a || '-',
        stats.hadir,
        stats.pct !== null ? `${stats.pct}%` : '#DIV/0!'
      );
      rows.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Absensi');
    XLSX.writeFile(wb, `Absensi_Siswa_Kelas_${kelas}_${school.replace(/\s+/g, '_')}.xlsx`);
  };

  const exportNilaiExcel = () => {
    const rows: (string | number)[][] = [
      ['REKAP NILAI PERMAPEL'],
      [`Satuan Pendidikan : ${school}`],
      [`Kelas             : ${kelas}`],
      [],
      [
        'No Urut',
        'NIS/NISN',
        'Nama',
        'AGAMA',
        'PKN',
        'BINDO',
        'MTK',
        'IPAS',
        'Rupa',
        'Musik',
        'Tari',
        'Teater',
        'PJOK',
        'Rata2 Nilai Mapel',
        'UH 1',
        'UH 2',
        'UH 3',
        'UH 4',
        'Praktik',
        'PTS',
        'PAS',
        'Jumlah Nilai',
        'RATA-RATA',
        'RANGKING',
      ],
    ];

    // Compute rankings
    const calculatedRows = students.map((s, idx) => {
      const n = nilaiGrid[s.id] || {};
      const mapelScores = [n.agama, n.pkn, n.bindo, n.mtk, n.ipas, n.rupa, n.musik, n.tari, n.teater, n.pjok].filter(
        (val): val is number => typeof val === 'number' && !isNaN(val)
      );
      const rataMapel = mapelScores.length > 0 ? Number((mapelScores.reduce((a, b) => a + b, 0) / mapelScores.length).toFixed(2)) : 0;
      const allScores = [
        ...mapelScores,
        n.uh1,
        n.uh2,
        n.uh3,
        n.uh4,
        n.praktik,
        n.pts,
        n.pas,
      ].filter((val): val is number => typeof val === 'number' && !isNaN(val));

      const total = allScores.reduce((a, b) => a + b, 0);
      const avg = allScores.length > 0 ? Number((total / allScores.length).toFixed(2)) : 0;

      return { s, idx, n, rataMapel, total, avg };
    });

    // Sort to determine ranks
    const sorted = [...calculatedRows].sort((a, b) => b.avg - a.avg);
    const rankMap = new Map<string, number>();
    sorted.forEach((item, rIdx) => {
      rankMap.set(item.s.id, rIdx + 1);
    });

    calculatedRows.forEach((row) => {
      const { s, idx, n, rataMapel, total, avg } = row;
      const rk = rankMap.get(s.id) || idx + 1;
      rows.push([
        idx + 1,
        s.nisNisn,
        s.nama,
        n.agama || '',
        n.pkn || '',
        n.bindo || '',
        n.mtk || '',
        n.ipas || '',
        n.rupa || '',
        n.musik || '',
        n.tari || '',
        n.teater || '',
        n.pjok || '',
        rataMapel || '',
        n.uh1 || '',
        n.uh2 || '',
        n.uh3 || '',
        n.uh4 || '',
        n.praktik || '',
        n.pts || '',
        n.pas || '',
        total || '',
        avg || '',
        rk,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap_Nilai');
    XLSX.writeFile(wb, `Rekap_Nilai_${school.replace(/\s+/g, '_')}_Kelas_${kelas}.xlsx`);
  };

  const exportEraporExcel = () => {
    const rows: (string | number)[][] = [
      ['REKAP CAPAIAN KOMPETENSI (FORMAT e-RAPOR KURIKULUM MERDEKA)'],
      [`Satuan Pendidikan : ${school}`],
      [`Kelas             : ${kelas}`],
      [`Tahun Ajaran      : ${tapel}`],
      [`Wali Kelas        : ${guru}`],
      [],
      [
        'No',
        'NIS / NISN',
        'Nama Peserta Didik',
        'Nilai Akhir (NA)',
        'Predikat',
        'Capaian Kompetensi Tertinggi (Kekuatan Pembelajaran)',
        'Capaian Kompetensi Terendah (Perlu Peningkatan / Bimbingan)',
      ],
      ...students.map((s, idx) => {
        const n = nilaiGrid[s.id] || {};
        const mapelScores = [n.agama, n.pkn, n.bindo, n.mtk, n.ipas, n.rupa, n.musik, n.tari, n.teater, n.pjok].filter(
          (val): val is number => typeof val === 'number' && !isNaN(val)
        );
        const na = mapelScores.length > 0 ? Number((mapelScores.reduce((a, b) => a + b, 0) / mapelScores.length).toFixed(1)) : 75;
        const predikat = na >= 88 ? 'Sangat Baik' : na >= 78 ? 'Baik' : na >= 68 ? 'Cukup' : 'Perlu Bimbingan';
        const tertinggi = `Menunjukkan penguasaan sangat baik dalam mencapai indikator kompetensi tujuan pembelajaran, bernalar kritis, dan aktif dalam penugasan mandiri.`;
        const terendah = na >= 85
          ? `Mampu mempertahankan capaian pembelajaran optimal dan konsisten dalam pemahaman konsep secara mendalam.`
          : `Perlu pendampingan dan bimbingan berkala dalam menganalisis soal pemecahan masalah serta penguatan konsep dasar materi.`;
        return [
          idx + 1,
          s.nisNisn || s.nis || '-',
          s.nama,
          na,
          predikat,
          tertinggi,
          terendah,
        ];
      }),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 18 }, { wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 50 }, { wch: 50 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'e-Rapor Merdeka');
    XLSX.writeFile(wb, `eRapor_Kurikulum_Merdeka_Kelas_${kelas}_${school.replace(/\s+/g, '_')}.xlsx`);
  };

  // ---------------------------------------------------------------------------
  // RENDER SECTIONS
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-full py-3 px-3 sm:px-6">
      {/* Top Banner: Status Jenjang Pengampuan Aktif */}
      <div className="mb-4 no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-xs ${
              currentUser?.teacherLevel === 'SD'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                : 'bg-gradient-to-br from-indigo-600 to-blue-700'
            }`}
          >
            {currentUser?.teacherLevel === 'SD' ? 'SD' : 'SMP'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-slate-900 uppercase">
                {currentUser?.teacherLevel === 'SD'
                  ? 'Buku Administrasi Guru Kelas SD'
                  : 'Buku Administrasi Wali Kelas SMP'}
              </span>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  currentUser?.teacherLevel === 'SD'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {currentUser?.teacherLevel === 'SD'
                  ? `🔒 Terkunci: ${currentUser.kelasYangDiajar || 'Kelas Terpilih'} (${currentUser.faseTerkunci || 'Fase SD'})`
                  : '🔓 Akses Penuh: Semua Kelas SMP (Fase D)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Satuan Pendidikan: <strong>{schoolFormData.namaSekolah}</strong> • Wali/Guru: <strong>{schoolFormData.namaWaliKelas}</strong>
            </p>
          </div>
        </div>

        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            <span>Ganti Jenjang / Akun</span>
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 1. INPUT DATA SEKOLAH (EXACT LAYOUT OF data sekolah.png)             */}
      {/* ===================================================================== */}
      {activeSub === 'data_sekolah' && (
        <div className="bg-[#8ecae6]/30 border-2 border-[#219ebc] rounded-2xl p-6 sm:p-8 shadow-md">
          {/* Title Header with Purple 3D Text matching data sekolah.png */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#581c87] tracking-wider uppercase font-serif drop-shadow-md">
              INPUT DATA SEKOLAH
            </h1>
            <div className="h-0.5 bg-[#581c87]/50 max-w-md mx-auto mt-2"></div>
            <p className="text-xs text-slate-600 mt-1">
              Data ini merupakan <strong>Data Acuan Utama</strong> yang otomatis menghubungkan seluruh dokumen Administrasi Kelas.
            </p>
          </div>

          {schoolSaveSuccess && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data Sekolah berhasil diperbarui dan tersimpan ke seluruh dokumen acuan!</span>
            </div>
          )}

          <form onSubmit={handleSaveSchoolData}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/90 backdrop-blur-xs p-6 rounded-xl border border-[#219ebc]/40 shadow-sm font-sans text-xs">
              {/* Kolom Kiri */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Nama Sekolah</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.namaSekolah}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, namaSekolah: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-bold text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">NPSN/NSS</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.npsn}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, npsn: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-mono text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Alamat Sekolah</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.alamatSekolah}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, alamatSekolah: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Kode Pos</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.kodePos}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, kodePos: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-mono text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">No Telepon</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.noTelepon}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, noTelepon: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Dusun / Wilayah</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.dusunTelp}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, dusunTelp: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Desa/Kelurahan</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.desaKelurahan}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, desaKelurahan: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Kecamatan</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.kecamatan}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, kecamatan: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Kabupaten/Kota</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.kabupatenKota}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, kabupatenKota: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Provinsi</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.provinsi}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, provinsi: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Website</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.website}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, website: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 w-36">Email</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.email}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, email: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Nama Kepala Sekolah</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.namaKepalaSekolah}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, namaKepalaSekolah: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-bold text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">NIP.</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.nipKepalaSekolah}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, nipKepalaSekolah: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-mono text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Nama Wali Kelas</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.namaWaliKelas}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, namaWaliKelas: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-bold text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">NIP.</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.nipWaliKelas}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, nipWaliKelas: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-mono text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">NUPTK.</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.nuptk}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, nuptk: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-mono text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Kelas</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.kelas}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, kelas: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-bold text-sky-800 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-sky-50/50'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Semester</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.semester}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, semester: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-semibold text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Tahun Pelajaran</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.tahunPelajaran}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, tahunPelajaran: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-bold text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-bold text-slate-700 w-36">Fase</span>
                  <span className="text-slate-500 mr-2">:</span>
                  <input
                    type="text"
                    disabled={!isEditingSchool}
                    value={schoolFormData.fase}
                    onChange={(e) => setSchoolFormData({ ...schoolFormData, fase: e.target.value })}
                    className={`flex-1 px-2.5 py-1.5 rounded font-bold text-slate-900 border ${
                      isEditingSchool ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50/70'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Tombol Aksi di Bawah Form */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={triggerPrint}
                className="no-print inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                title="Unduh / Cetak Dokumen Data Sekolah ke ukuran Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF / Cetak A4</span>
              </button>

              <div className="flex items-center space-x-2">
                {!isEditingSchool ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingSchool(true)}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Data Sekolah</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingSchool(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. DATA LENGKAP PESERTA DIDIK (EXACT LAYOUT OF data siswa.png)        */}
      {/* ===================================================================== */}
      {activeSub === 'data_siswa' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-sans">
          {/* Header Banner Hijau matching data siswa.png */}
          <div className="bg-[#84cc16] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 shadow-sm border border-[#65a30d]">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-serif tracking-wider uppercase text-center sm:text-left">
              DATA LENGKAP PESERTA DIDIK
            </h1>
            <div className="flex items-center space-x-2 flex-wrap gap-y-2 justify-center sm:justify-end">
              {/* Tombol Unduh Template Excel */}
              <button
                type="button"
                onClick={downloadTemplateDataSiswaExcel}
                className="flex items-center space-x-1.5 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unduh format template Excel (.xlsx) untuk diisi offline"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Template Excel</span>
              </button>

              {/* Tombol Unggah Template Excel */}
              <label
                className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unggah template Excel data peserta didik (.xlsx / .xls)"
              >
                <Upload className="w-3.5 h-3.5 text-amber-200" />
                <span>Unggah Excel</span>
                <input
                  ref={studentFileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportDataSiswaExcel}
                  className="hidden"
                />
              </label>

              {/* Tombol Unduh Data Siswa Excel */}
              <button
                type="button"
                onClick={exportDataSiswaExcel}
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unduh seluruh data siswa ke Microsoft Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Excel</span>
              </button>

              {/* Tombol Unduh PDF / Cetak A4 */}
              <button
                type="button"
                onClick={triggerPrint}
                className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unduh / Cetak Dokumen Data Siswa dalam format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          {/* Feedback Banner Impor Excel */}
          {excelImportFeedback && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs font-bold flex items-center space-x-2 border animate-fadeIn ${
                excelImportFeedback.type === 'success'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-rose-100 text-rose-900 border-rose-400'
              }`}
            >
              {excelImportFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{excelImportFeedback.message}</span>
            </div>
          )}

          {/* Action Toolbar with Checkboxes, Edit, Hapus, Search, Tambah Siswa */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, NISN, atau NIK..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-60 sm:w-72"
                />
              </div>

              {selectedStudentIds.length > 0 && (
                <div className="flex items-center space-x-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-lg font-bold animate-fadeIn">
                  <span>{selectedStudentIds.length} Siswa Terpilih</span>
                  <button
                    onClick={handleDeleteSelectedStudents}
                    className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-[11px] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Terpilih</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setIsStudentModalOpen(true);
                }}
                className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-lg shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa Baru</span>
              </button>
            </div>
          </div>

          {/* Table matching exact columns 2-17 of data siswa.png */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-inner">
            <table className="w-full text-[11px] text-left border-collapse min-w-[1300px]">
              {/* Header 1 (Light Blue #93c5fd) */}
              <thead className="bg-[#93c5fd] text-slate-900 font-extrabold uppercase border-b-2 border-slate-400">
                <tr>
                  <th rowSpan={2} className="p-2 text-center w-10 border-r border-slate-300">
                    <input
                      type="checkbox"
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudentIds.length === filteredStudents.length
                      }
                      onChange={handleSelectAllStudents}
                      className="rounded text-sky-600 cursor-pointer"
                      title="Centang Semua"
                    />
                  </th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-24">NIS/NISN</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300">Nama Siswa</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-36">NIK</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-12">L/P</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-36">Tanggal Lahir</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-16">Agama</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-14">Kelas</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-24">Status Siswa</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-32">Alamat</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-32">No Telepon Rumah</th>
                  <th colSpan={2} className="p-1.5 border-r border-slate-300 text-center bg-[#7dd3fc]">Nama Ortu</th>
                  <th colSpan={2} className="p-1.5 border-r border-slate-300 text-center bg-[#7dd3fc]">Pekerjaan Ortu</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-20">Tinggi Badan</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-center w-20">Berat Badan</th>
                  <th rowSpan={2} className="p-2.5 text-center w-24">Aksi</th>
                </tr>
                {/* Header 2 Sub-columns */}
                <tr className="bg-[#7dd3fc] text-slate-800 font-bold border-b border-slate-400">
                  <th className="p-1 text-center border-r border-slate-300 w-24">Ayah</th>
                  <th className="p-1 text-center border-r border-slate-300 w-24">Ibu</th>
                  <th className="p-1 text-center border-r border-slate-300 w-24">Ayah</th>
                  <th className="p-1 text-center border-r border-slate-300 w-24">Ibu</th>
                </tr>
                {/* Yellow Column Numbering Row matching Screenshot data siswa.png (2, 3, 4, ... 17) */}
                <tr className="bg-[#facc15] text-slate-900 font-bold text-center border-b border-slate-400 text-[10px]">
                  <th className="p-1 border-r border-slate-400">#</th>
                  <th className="p-1 border-r border-slate-400">2</th>
                  <th className="p-1 border-r border-slate-400">3</th>
                  <th className="p-1 border-r border-slate-400">4</th>
                  <th className="p-1 border-r border-slate-400">5</th>
                  <th className="p-1 border-r border-slate-400">6</th>
                  <th className="p-1 border-r border-slate-400">7</th>
                  <th className="p-1 border-r border-slate-400">8</th>
                  <th className="p-1 border-r border-slate-400">9</th>
                  <th className="p-1 border-r border-slate-400">10</th>
                  <th className="p-1 border-r border-slate-400">11</th>
                  <th className="p-1 border-r border-slate-400">12</th>
                  <th className="p-1 border-r border-slate-400">13</th>
                  <th className="p-1 border-r border-slate-400">14</th>
                  <th className="p-1 border-r border-slate-400">15</th>
                  <th className="p-1 border-r border-slate-400">16</th>
                  <th className="p-1 border-r border-slate-400">17</th>
                  <th className="p-1">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredStudents.map((s, idx) => {
                  const isChecked = selectedStudentIds.includes(s.id);
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-sky-50/50 transition-colors ${
                        isChecked ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      <td className="p-2 text-center border-r border-slate-200">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudent(s.id)}
                          className="rounded text-sky-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-2 text-center font-mono font-semibold text-slate-800 border-r border-slate-200">
                        {s.nisNisn}
                      </td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                        {s.nama}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-700 border-r border-slate-200">
                        {s.nik}
                      </td>
                      <td className="p-2 text-center font-bold border-r border-slate-200">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            s.jk === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.jk}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                        {s.tanggalLahir}
                      </td>
                      <td className="p-2 text-center text-slate-700 border-r border-slate-200">
                        {s.agama}
                      </td>
                      <td className="p-2 text-center font-bold text-sky-800 border-r border-slate-200">
                        {s.kelas}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.statusSiswa}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                        {s.alamat}
                      </td>
                      <td className="p-2 text-slate-700 font-mono border-r border-slate-200 whitespace-nowrap">
                        {s.telepon}
                      </td>
                      <td className="p-2 text-slate-800 border-r border-slate-200 whitespace-nowrap">
                        {s.namaAyah}
                      </td>
                      <td className="p-2 text-slate-800 border-r border-slate-200 whitespace-nowrap">
                        {s.namaIbu}
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                        {s.pekerjaanAyah}
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                        {s.pekerjaanIbu}
                      </td>
                      <td className="p-2 text-center font-medium text-slate-700 border-r border-slate-200">
                        {s.tinggiBadan}
                      </td>
                      <td className="p-2 text-center font-medium text-slate-700 border-r border-slate-200">
                        {s.beratBadan}
                      </td>
                      <td className="p-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingStudent(s);
                              setIsStudentModalOpen(true);
                            }}
                            title="Edit Data Siswa"
                            className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingleStudent(s.id, s.nama)}
                            title="Hapus Siswa"
                            className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <p>
              Total Terdaftar: <strong>{students.length} Siswa</strong> (L: {students.filter((s) => s.jk === 'L').length}, P: {students.filter((s) => s.jk === 'P').length})
            </p>
            <p className="italic">
              * Centang kotak untuk menghapus beberapa siswa sekaligus atau gunakan tombol aksi.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ABSENSI SISWA KELAS (EXACT LAYOUT OF absen siswa.png)               */}
      {/* ===================================================================== */}
      {activeSub === 'absen_kelas' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-sans">
          {/* Header Banner Biru matching absen siswa.png */}
          <div className="bg-[#2563eb] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-sm border border-blue-700">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-black text-white font-serif tracking-wider uppercase">
                ABSENSI SISWA KELAS
              </h1>
              <p className="text-xs text-blue-100 font-bold mt-0.5">
                {absenBulanTahun} • KELAS {kelas} • {school}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportAbsensiExcel}
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Excel</span>
              </button>
              <button
                type="button"
                onClick={triggerPrint}
                className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unduh / Cetak Dokumen Absensi Siswa ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">Periode Bulan:</span>
              <select
                value={absenBulanTahun}
                onChange={(e) => setAbsenBulanTahun(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded font-bold bg-white text-slate-800"
              >
                <option value="BULAN JULI 2023">BULAN JULI 2023</option>
                <option value="BULAN AGUSTUS 2023">BULAN AGUSTUS 2023</option>
                <option value="BULAN SEPTEMBER 2023">BULAN SEPTEMBER 2023</option>
                <option value="BULAN OKTOBER 2023">BULAN OKTOBER 2023</option>
                <option value="BULAN NOVEMBER 2023">BULAN NOVEMBER 2023</option>
                <option value="BULAN DESEMBER 2023">BULAN DESEMBER 2023</option>
                <option value="BULAN JANUARI 2024">BULAN JANUARI 2024</option>
                <option value="BULAN FEBRUARI 2024">BULAN FEBRUARI 2024</option>
                <option value="BULAN MARET 2024">BULAN MARET 2024</option>
                <option value="BULAN APRIL 2024">BULAN APRIL 2024</option>
                <option value="BULAN MEI 2024">BULAN MEI 2024</option>
                <option value="BULAN JUNI 2024">BULAN JUNI 2024</option>
              </select>

              <button
                onClick={() => handleMarkAllHadirToday(new Date().getDate())}
                className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded font-bold cursor-pointer transition-colors"
                title="Tandai semua siswa hadir (.) untuk hari ini"
              >
                ✓ Tandai Semua Hadir Hari Ini ({new Date().getDate()})
              </button>
            </div>

            {/* Legend matching Screenshot Colors */}
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1">
                <span className="w-3.5 h-3.5 bg-[#facc15] border border-black inline-block text-center text-[10px] leading-3 font-bold">S</span>
                <span>Sakit</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3.5 h-3.5 bg-[#38bdf8] border border-black inline-block text-center text-[10px] leading-3 font-bold">I</span>
                <span>Izin</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3.5 h-3.5 bg-[#ef4444] text-white border border-black inline-block text-center text-[10px] leading-3 font-bold">A</span>
                <span>Alpa</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3.5 h-3.5 bg-[#e2e8f0] border border-black inline-block text-center text-[10px] leading-3 font-bold">.</span>
                <span>Hadir</span>
              </span>
            </div>
          </div>

          {/* Attendance Table matching exact layout from absen siswa.png */}
          <div className="overflow-x-auto border-2 border-slate-800 rounded-lg shadow-sm">
            <table className="w-full text-xs text-center border-collapse min-w-[1100px]">
              <thead>
                {/* Header Row 1: Green Header with Month title */}
                <tr className="bg-[#10b981] text-slate-950 font-black border-b-2 border-slate-800">
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-10">No</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 text-left w-48">Nama</th>
                  <th colSpan={31} className="p-1 border-r border-slate-800 uppercase tracking-widest text-xs">
                    {absenBulanTahun}
                  </th>
                  <th className="p-2 border-r border-slate-800 bg-[#fde047] text-slate-900 w-12">SAKIT</th>
                  <th className="p-2 border-r border-slate-800 bg-[#38bdf8] text-slate-900 w-12">IZIN</th>
                  <th className="p-2 border-r border-slate-800 bg-[#ef4444] text-white w-12">ALPA</th>
                  <th className="p-2 border-r border-slate-800 bg-[#e2e8f0] text-slate-900 w-12">HADIR</th>
                  <th className="p-2 bg-[#f8fafc] text-slate-900 w-24">Presentasi</th>
                </tr>
                {/* Header Row 2: Days 1 to 31 & Code indicators */}
                <tr className="bg-[#10b981] text-slate-950 font-bold border-b-2 border-slate-800 text-[11px]">
                  {Array.from({ length: 31 }, (_, i) => (
                    <th key={i + 1} className="w-6 p-1 border-r border-slate-800 font-mono">
                      {i + 1}
                    </th>
                  ))}
                  <th className="p-1 border-r border-slate-800 bg-[#fde047] text-slate-900 font-bold">(S)</th>
                  <th className="p-1 border-r border-slate-800 bg-[#38bdf8] text-slate-900 font-bold">(I)</th>
                  <th className="p-1 border-r border-slate-800 bg-[#ef4444] text-white font-bold">(A)</th>
                  <th className="p-1 border-r border-slate-800 bg-[#e2e8f0] text-slate-900 font-bold">(.)</th>
                  <th className="p-1 bg-[#f8fafc] text-slate-900 font-bold text-[10px]">Kehadiran</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 bg-white font-sans text-[11px]">
                {students.map((s, idx) => {
                  const stats = getStudentAbsenStats(s.id);
                  const studentDays = absenGrid[s.id] || {};
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 border-b border-slate-800">
                      <td className="p-1.5 font-bold border-r border-slate-800 text-slate-700">{idx + 1}</td>
                      <td className="p-1.5 font-bold border-r border-slate-800 text-left text-slate-900 whitespace-nowrap">
                        {s.nama}
                      </td>

                      {/* Days 1 to 31 cells */}
                      {Array.from({ length: 31 }, (_, dayIdx) => {
                        const day = dayIdx + 1;
                        const mark = (studentDays[day] || '').toUpperCase();
                        let cellBg = 'bg-white hover:bg-slate-100';
                        let textColor = 'text-slate-900';
                        if (mark === 'S') {
                          cellBg = 'bg-[#facc15] font-black';
                        } else if (mark === 'I') {
                          cellBg = 'bg-[#38bdf8] font-black';
                        } else if (mark === 'A') {
                          cellBg = 'bg-[#ef4444] text-white font-black';
                        } else if (mark === '.') {
                          cellBg = 'bg-[#e2e8f0] font-black';
                        }

                        return (
                          <td
                            key={day}
                            onClick={() => handleCellAbsenToggle(s.id, day)}
                            title={`Klik untuk ubah: . -> S -> I -> A -> Hapus`}
                            className={`p-0.5 border-r border-slate-800 font-mono cursor-pointer select-none transition-colors ${cellBg} ${textColor}`}
                          >
                            {mark || ''}
                          </td>
                        );
                      })}

                      {/* Summary Columns matching Screenshot */}
                      <td className="p-1 font-bold border-r border-slate-800 bg-[#fef08a] text-slate-900">
                        {stats.s || '-'}
                      </td>
                      <td className="p-1 font-bold border-r border-slate-800 bg-[#bae6fd] text-slate-900">
                        {stats.i || '-'}
                      </td>
                      <td className="p-1 font-bold border-r border-slate-800 bg-[#fecaca] text-rose-900">
                        {stats.a || '-'}
                      </td>
                      <td className="p-1 font-bold border-r border-slate-800 bg-slate-100 text-slate-900">
                        {stats.hadir}
                      </td>
                      <td className="p-1 font-mono font-bold text-center bg-slate-50 text-slate-900">
                        {stats.pct !== null ? `${stats.pct}%` : '#DIV/0!'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500 italic">
            * Klik pada setiap kotak tanggal untuk mengganti status: <strong>. (Hadir)</strong> → <strong>S (Sakit)</strong> → <strong>I (Izin)</strong> → <strong>A (Alpa)</strong> → Kosong. Data siswa otomatis bersumber dari Data Lengkap Siswa.
          </p>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. REKAP NILAI PERMAPEL (EXACT LAYOUT OF daftar nilai.png)            */}
      {/* ===================================================================== */}
      {activeSub === 'daftar_nilai' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-sans">
          {/* Mode Switcher: Leger Nilai vs e-Rapor Kurikulum Merdeka */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setModeNilaiTab('LEGER')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modeNilaiTab === 'LEGER'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📊 Tabel Leger Nilai & Ranking
              </button>
              <button
                type="button"
                onClick={() => setModeNilaiTab('E_RAPOR')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  modeNilaiTab === 'E_RAPOR'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Format e-Rapor Kurikulum Merdeka (Capaian Tertinggi / Terendah)</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              {modeNilaiTab === 'LEGER' ? 'Format Rekap Nilai Harian/PTS/PAS' : 'Format Nilai Akhir Siap Input Aplikasi e-Rapor'}
            </span>
          </div>

          {/* Header Banner Dinamis */}
          <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-sm border ${
            modeNilaiTab === 'E_RAPOR'
              ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white border-purple-800'
              : 'bg-[#7dd3fc] text-slate-950 border-sky-400'
          }`}>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-black font-serif tracking-wider uppercase">
                {modeNilaiTab === 'E_RAPOR' ? 'REKAP CAPAIAN KOMPETENSI (e-RAPOR)' : 'REKAP NILAI PERMAPEL'}
              </h1>
              <p className={`text-xs font-bold mt-0.5 ${modeNilaiTab === 'E_RAPOR' ? 'text-purple-200' : 'text-sky-900'}`}>
                KELAS {kelas} • {tapel} • {school}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={modeNilaiTab === 'E_RAPOR' ? exportEraporExcel : exportNilaiExcel}
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{modeNilaiTab === 'E_RAPOR' ? 'Unduh Excel e-Rapor' : 'Unduh Excel Leger'}</span>
              </button>
              <button
                type="button"
                onClick={triggerPrint}
                className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unduh / Cetak Dokumen Rekap Nilai ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF A4</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Table matching exact layout from daftar nilai.png */}
          {modeNilaiTab === 'LEGER' && (
            <div className="overflow-x-auto border-2 border-slate-800 rounded-lg shadow-sm">
            <table className="w-full text-xs text-center border-collapse min-w-[1300px]">
              <thead className="bg-[#bae6fd] text-slate-950 font-bold border-b-2 border-slate-800">
                <tr>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-12">No Urut</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-24">NIS/NISN</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 text-left w-48">Nama</th>
                  <th colSpan={10} className="p-1 border-r border-slate-800 bg-[#7dd3fc] uppercase font-black">
                    MATA PELAJARAN
                  </th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 bg-[#e0f2fe] text-slate-900 w-16">
                    Rata2 Nilai Mapel
                  </th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-10">UH 1</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-10">UH 2</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-10">UH 3</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-10">UH 4</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-12">Praktik</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-12">PTS</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 w-12">PAS</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 bg-[#e0f2fe] w-14 font-black">Jumlah Nilai</th>
                  <th rowSpan={2} className="p-2 border-r border-slate-800 bg-[#bae6fd] w-16 font-black">RATA-RATA</th>
                  <th rowSpan={2} className="p-2 bg-[#fde047] text-slate-950 w-16 font-black">RANGKING</th>
                  <th rowSpan={2} className="p-2 border-l border-slate-800 w-16">Aksi</th>
                </tr>
                {/* 10 Subject Columns matching Screenshot */}
                <tr className="bg-[#bae6fd] text-slate-900 text-[10px] font-bold border-b-2 border-slate-800">
                  <th className="p-1 border-r border-slate-800 w-11">AGAMA</th>
                  <th className="p-1 border-r border-slate-800 w-11">PKN</th>
                  <th className="p-1 border-r border-slate-800 w-11">BINDO</th>
                  <th className="p-1 border-r border-slate-800 w-11">MTK</th>
                  <th className="p-1 border-r border-slate-800 w-11">IPAS</th>
                  <th className="p-1 border-r border-slate-800 w-11">Rupa</th>
                  <th className="p-1 border-r border-slate-800 w-11">Musik</th>
                  <th className="p-1 border-r border-slate-800 w-11">Tari</th>
                  <th className="p-1 border-r border-slate-800 w-11">Teater</th>
                  <th className="p-1 border-r border-slate-800 w-11">PJOK</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 bg-white font-sans text-[11px]">
                {(() => {
                  // Precompute ranks
                  const calculated = students.map((s, idx) => {
                    const n = nilaiGrid[s.id] || {};
                    const mapelScores = [n.agama, n.pkn, n.bindo, n.mtk, n.ipas, n.rupa, n.musik, n.tari, n.teater, n.pjok].filter(
                      (val): val is number => typeof val === 'number' && !isNaN(val)
                    );
                    const rataMapel = mapelScores.length > 0 ? Number((mapelScores.reduce((a, b) => a + b, 0) / mapelScores.length).toFixed(2)) : 0;
                    const allScores = [
                      ...mapelScores,
                      n.uh1,
                      n.uh2,
                      n.uh3,
                      n.uh4,
                      n.praktik,
                      n.pts,
                      n.pas,
                    ].filter((val): val is number => typeof val === 'number' && !isNaN(val));

                    const total = allScores.reduce((a, b) => a + b, 0);
                    const avg = allScores.length > 0 ? Number((total / allScores.length).toFixed(2)) : 0;

                    return { s, idx, n, rataMapel, total, avg };
                  });

                  const sorted = [...calculated].sort((a, b) => b.avg - a.avg);
                  const rankMap = new Map<string, number>();
                  sorted.forEach((item, rIdx) => {
                    rankMap.set(item.s.id, rIdx + 1);
                  });

                  return calculated.map(({ s, idx, n, rataMapel, total, avg }) => {
                    const rk = rankMap.get(s.id) || idx + 1;
                    return (
                      <tr key={s.id} className="hover:bg-sky-50/50 border-b border-slate-800">
                        <td className="p-1.5 font-bold border-r border-slate-800 text-slate-700">{idx + 1}</td>
                        <td className="p-1.5 font-mono border-r border-slate-800 text-slate-700">{s.nisNisn}</td>
                        <td className="p-1.5 font-bold text-left border-r border-slate-800 text-slate-900 whitespace-nowrap">
                          {s.nama}
                        </td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.agama || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.pkn || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.bindo || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.mtk || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.ipas || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.rupa || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.musik || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.tari || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.teater || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.pjok || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono font-bold bg-[#f0f9ff]">
                          {rataMapel || '-'}
                        </td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.uh1 || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.uh2 || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.uh3 || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.uh4 || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.praktik || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.pts || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono">{n.pas || '-'}</td>
                        <td className="p-1 border-r border-slate-800 font-mono font-bold bg-[#f0f9ff]">
                          {total || '-'}
                        </td>
                        <td className="p-1 border-r border-slate-800 font-mono font-black bg-[#e0f2fe] text-sky-950">
                          {avg || '-'}
                        </td>
                        <td className="p-1 font-mono font-black bg-[#fef08a] text-slate-950">
                          {rk}
                        </td>
                        <td className="p-1 border-l border-slate-800">
                          <button
                            onClick={() => setEditingNilaiStudent(s)}
                            className="px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold rounded text-[10px] cursor-pointer"
                          >
                            Input Nilai
                          </button>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
            </div>
          )}

          {/* Mode 2: Format e-Rapor Kurikulum Merdeka (Capaian Tertinggi / Terendah) */}
          {modeNilaiTab === 'E_RAPOR' && (
            <div className="overflow-x-auto border-2 border-purple-900 rounded-xl shadow-sm">
              <div className="bg-purple-950 p-3 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Format Deskripsi e-Rapor Kurikulum Merdeka Resmi Kemendikbudristek
                  </span>
                </div>
                <span className="text-[11px] text-purple-200">
                  Data siap disalin atau diimpor langsung ke aplikasi e-Rapor SP
                </span>
              </div>

              <table className="w-full text-xs text-left border-collapse min-w-[1050px]">
                <thead className="bg-purple-100 text-purple-950 font-black border-b-2 border-purple-900 uppercase text-[10.5px]">
                  <tr>
                    <th className="p-2.5 border-r border-purple-300 w-12 text-center">No</th>
                    <th className="p-2.5 border-r border-purple-300 w-32 text-center">NIS / NISN</th>
                    <th className="p-2.5 border-r border-purple-300 text-left w-52">Nama Peserta Didik</th>
                    <th className="p-2.5 border-r border-purple-300 w-24 text-center">Nilai Akhir</th>
                    <th className="p-2.5 border-r border-purple-300 w-32 text-center">Predikat</th>
                    <th className="p-2.5 border-r border-purple-300 text-left">Capaian Tertinggi (Kekuatan Pembelajaran)</th>
                    <th className="p-2.5 text-left">Capaian Terendah (Perlu Peningkatan / Bimbingan)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-200 bg-white font-sans text-xs">
                  {students.map((s, idx) => {
                    const n = nilaiGrid[s.id] || {};
                    const mapelScores = [n.agama, n.pkn, n.bindo, n.mtk, n.ipas, n.rupa, n.musik, n.tari, n.teater, n.pjok].filter(
                      (val): val is number => typeof val === 'number' && !isNaN(val)
                    );
                    const na = mapelScores.length > 0 ? Number((mapelScores.reduce((a, b) => a + b, 0) / mapelScores.length).toFixed(1)) : 75;
                    const predikat = na >= 88 ? 'Sangat Baik' : na >= 78 ? 'Baik' : na >= 68 ? 'Cukup' : 'Perlu Bimbingan';
                    const predikatBadgeColor =
                      na >= 88
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : na >= 78
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : na >= 68
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300';
                    const tertinggi = `Menunjukkan penguasaan sangat baik dalam mencapai kompetensi materi pokok, bernalar kritis, dan aktif dalam menyelesaikan penugasan mandiri.`;
                    const terendah =
                      na >= 85
                        ? `Mampu mempertahankan capaian optimal dan konsisten dalam pendalaman konsep materi secara mandiri.`
                        : `Perlu pendampingan dan bimbingan berkala dalam menganalisis soal pemecahan masalah serta penguatan konsep dasar materi.`;

                    return (
                      <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="p-2.5 text-center font-bold text-slate-700 border-r border-purple-100">{idx + 1}</td>
                        <td className="p-2.5 text-center font-mono text-slate-600 border-r border-purple-100">{s.nisNisn || s.nis || '-'}</td>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-purple-100">{s.nama}</td>
                        <td className="p-2.5 text-center font-mono font-black text-sm bg-purple-50 text-purple-950 border-r border-purple-100">
                          {na}
                        </td>
                        <td className="p-2.5 text-center border-r border-purple-100">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${predikatBadgeColor}`}>
                            {predikat}
                          </span>
                        </td>
                        <td className="p-2.5 text-xs text-slate-800 bg-emerald-50/30 border-r border-purple-100">
                          <div className="flex items-start space-x-1.5">
                            <span className="text-emerald-700 font-bold shrink-0">✓</span>
                            <span className="leading-relaxed">{tertinggi}</span>
                          </div>
                        </td>
                        <td className="p-2.5 text-xs text-slate-800 bg-amber-50/30">
                          <div className="flex items-start space-x-1.5">
                            <span className="text-amber-700 font-bold shrink-0">⚠</span>
                            <span className="leading-relaxed">{terendah}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. JADWAL MATA PELAJARAN & PIKET (EXACT LAYOUT OF jadwal.png)          */}
      {/* ===================================================================== */}
      {activeSub === 'jadwal_kelas' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-sans">
          {/* Header Banner matching jadwal.png */}
          <div className="bg-slate-200 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border border-slate-300">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-wider uppercase text-center sm:text-left">
              JADWAL KELAS & PIKET KEBERSIHAN
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditJadwalModalOpen(true)}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center space-x-1.5"
                title="Edit mata pelajaran untuk hari Senin - Sabtu"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Jadwal Pelajaran</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditPiketModalOpen(true)}
                className="px-3 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center space-x-1.5"
                title="Edit nama petugas piket kebersihan kelas"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Petugas Piket</span>
              </button>
              <button
                onClick={triggerPrint}
                className="px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center space-x-1.5"
                title="Unduh / Cetak Dokumen Jadwal ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box Kiri: JADWAL MATA PELAJARAN (Green Header) */}
            <div className="border-4 border-[#84cc16] rounded-xl p-4 bg-white shadow-sm">
              <div className="bg-[#84cc16] text-slate-950 text-center py-2 px-4 rounded-lg font-black tracking-wider uppercase text-sm mb-4 flex items-center justify-between">
                <span>JADWAL MATA PELAJARAN</span>
                <button
                  type="button"
                  onClick={() => setIsEditJadwalModalOpen(true)}
                  className="no-print text-xs font-bold bg-white/70 hover:bg-white text-slate-900 px-2.5 py-0.5 rounded shadow-xs"
                >
                  ✎ Edit
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {['SENIN', 'SELASA', 'RABU', 'KAMIS', "JUM'AT", 'SABTU'].map((day) => (
                  <div key={day} className="bg-[#a3e635] p-1.5 rounded-lg font-black text-[11px] text-slate-950">
                    {day}
                  </div>
                ))}

                {/* Rows of Classes per day from dynamic state */}
                {jadwalPelajaran.map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {row.map((item, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-[#d9f99d]/70 border border-[#84cc16] p-2 rounded-lg font-bold text-[10px] text-slate-800 min-h-[48px] flex items-center justify-center text-center shadow-xs"
                      >
                        {item}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Box Kanan: JADWAL PETUGAS KEBERSIHAN KELAS (Blue Header) */}
            <div className="border-4 border-[#0284c7] rounded-xl p-4 bg-white shadow-sm">
              <div className="bg-[#0284c7] text-white text-center py-2 px-4 rounded-lg font-black tracking-wider uppercase text-sm mb-4 flex items-center justify-between">
                <span>JADWAL PETUGAS KEBERSIHAN KELAS</span>
                <button
                  type="button"
                  onClick={() => setIsEditPiketModalOpen(true)}
                  className="no-print text-xs font-bold bg-white/70 hover:bg-white text-slate-900 px-2.5 py-0.5 rounded shadow-xs"
                >
                  ✎ Edit
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {['SENIN', 'SELASA', 'RABU', 'KAMIS', "JUM'AT", 'SABTU'].map((day) => (
                  <div key={day} className="bg-[#38bdf8] p-1.5 rounded-lg font-black text-[11px] text-slate-950">
                    {day}
                  </div>
                ))}

                {/* Rows of Student Names assigned for duty from dynamic state */}
                {jadwalPiket.map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {row.map((item, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-[#bae6fd]/70 border border-[#0284c7] p-2 rounded-lg font-bold text-[10px] text-slate-900 min-h-[48px] flex items-center justify-center text-center shadow-xs"
                      >
                        {item}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. DENAH TEMPAT DUDUK (EXACT LAYOUT OF denah kelas.png)                */}
      {/* ===================================================================== */}
      {activeSub === 'denah_kelas' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm font-sans">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-black text-slate-900 font-serif tracking-wide uppercase">
                DENAH TEMPAT DUDUK
              </h1>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                KELAS {kelas} • {school}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditDenahModalOpen(true)}
                className="no-print inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-lg shadow-sm text-xs cursor-pointer transition-colors"
                title="Atur penempatan duduk siswa di tiap nomor meja"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Atur Posisi Meja Siswa</span>
              </button>
              <button
                type="button"
                onClick={triggerPrint}
                className="no-print inline-flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3.5 py-2 rounded-lg shadow-sm text-xs cursor-pointer transition-colors"
                title="Unduh / Cetak Denah Tempat Duduk ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          {/* Classroom Double Border Box matching denah kelas.png */}
          <div className="max-w-4xl mx-auto border-4 border-slate-900 p-6 sm:p-10 rounded-xl bg-white relative shadow-sm">
            {/* Top Left: Meja Guru (Green Box) */}
            <div className="mb-8 flex items-center justify-between">
              <div className="w-36 h-14 bg-[#84cc16] border-2 border-slate-900 rounded-lg flex items-center justify-center font-bold text-xs text-slate-950 shadow-md">
                Meja Guru ({guru})
              </div>
              <button
                type="button"
                onClick={() => setIsEditDenahModalOpen(true)}
                className="no-print text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs cursor-pointer"
              >
                ✎ Ubah Susunan Meja
              </button>
            </div>

            {/* 4 Columns x 5 Rows of Student Desks matching denah kelas.png */}
            <div className="grid grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 20 }, (_, idx) => {
                const customName = denahMejaSiswa[idx]?.trim();
                const assignedStudent = students[idx];
                const displayName = customName || (assignedStudent ? assignedStudent.nama : `(Siswa ${idx + 1})`);
                return (
                  <div
                    key={idx}
                    className="h-16 sm:h-20 bg-[#84cc16] border-2 border-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-md hover:scale-105 transition-transform"
                  >
                    <span className="text-[10px] text-slate-800 font-mono font-bold">Meja {idx + 1}</span>
                    <span className="text-xs font-black text-slate-950 truncate max-w-full">
                      {displayName}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center border-t-2 border-dashed border-slate-300 pt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              PINTU MASUK / PAPAN TULIS DEPAN
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. STRUKTUR ORGANISASI KELAS (EXACT LAYOUT OF sturkturkelas.png)       */}
      {/* ===================================================================== */}
      {activeSub === 'struktur_kelas' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm font-sans">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-black text-slate-900 font-serif tracking-wide uppercase">
                STRUKTUR ORGANISASI
              </h1>
              <h2 className="text-xl font-black text-slate-800 font-serif tracking-wider uppercase mt-1">
                {school}
              </h2>
              <p className="text-xs text-slate-500 mt-1">TAHUN PELAJARAN {tapel} • KELAS {kelas}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditStrukturModalOpen(true)}
                className="no-print inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-lg shadow-sm text-xs cursor-pointer transition-colors"
                title="Edit susunan pengurus kelas (Ketua, Wakil, Sekretaris, Bendahara, Sie)"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Pengurus Kelas</span>
              </button>
              <button
                type="button"
                onClick={triggerPrint}
                className="no-print inline-flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3.5 py-2 rounded-lg shadow-sm text-xs cursor-pointer transition-colors"
                title="Unduh / Cetak Struktur Organisasi Kelas ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          {/* Org Chart Tree matching sturkturkelas.png */}
          <div className="max-w-4xl mx-auto border-2 border-slate-800 p-8 rounded-xl bg-white shadow-sm text-center">
            {/* Level 1: Wali Kelas */}
            <div className="inline-block border-2 border-slate-900 rounded-lg overflow-hidden w-56 shadow-md mb-6">
              <div className="bg-slate-300 py-1.5 px-3 font-bold text-xs uppercase text-slate-900 border-b-2 border-slate-900">
                WALI KELAS
              </div>
              <div className="bg-white py-2 px-3 font-black text-xs text-slate-900">
                {strukturOrganisasi.waliKelas || guru}
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-900 mx-auto"></div>

            {/* Level 2: Ketua Kelas */}
            <div className="inline-block border-2 border-slate-900 rounded-lg overflow-hidden w-56 shadow-md mb-6">
              <div className="bg-slate-300 py-1.5 px-3 font-bold text-xs uppercase text-slate-900 border-b-2 border-slate-900">
                KETUA KELAS
              </div>
              <div className="bg-white py-2 px-3 font-black text-xs text-slate-900">
                {strukturOrganisasi.ketuaKelas}
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-900 mx-auto"></div>

            {/* Level 3: Wk. Ketua Kelas */}
            <div className="inline-block border-2 border-slate-900 rounded-lg overflow-hidden w-56 shadow-md mb-8">
              <div className="bg-slate-300 py-1.5 px-3 font-bold text-xs uppercase text-slate-900 border-b-2 border-slate-900">
                WK. KETUA KELAS
              </div>
              <div className="bg-white py-2 px-3 font-black text-xs text-slate-900">
                {strukturOrganisasi.wakilKetua}
              </div>
            </div>

            {/* Level 4: Sekretaris & Bendahara */}
            <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto mb-8">
              {/* Sekretaris */}
              <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-md">
                <div className="bg-slate-300 py-1.5 px-3 font-bold text-xs uppercase text-slate-900 border-b-2 border-slate-900">
                  SEKRETARIS
                </div>
                <div className="bg-white p-2.5 text-left text-xs font-semibold space-y-1">
                  <p>1. {strukturOrganisasi.sekretaris1}</p>
                  <p>2. {strukturOrganisasi.sekretaris2}</p>
                </div>
              </div>

              {/* Bendahara */}
              <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-md">
                <div className="bg-slate-300 py-1.5 px-3 font-bold text-xs uppercase text-slate-900 border-b-2 border-slate-900">
                  BENDAHARA
                </div>
                <div className="bg-white p-2.5 text-left text-xs font-semibold space-y-1">
                  <p>1. {strukturOrganisasi.bendahara1}</p>
                  <p>2. {strukturOrganisasi.bendahara2}</p>
                </div>
              </div>
            </div>

            {/* Level 5: Seksi-Seksi (4 Columns) matching Screenshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-300 py-1 px-2 font-bold text-[11px] uppercase text-slate-900 border-b border-slate-900">
                  SIE. KEAMANAN
                </div>
                <div className="bg-white p-2 text-left text-[11px] space-y-1 font-medium">
                  {strukturOrganisasi.sieKeamanan.split('&').map((p, idx) => (
                    <p key={idx}>{idx + 1}. {p.trim()}</p>
                  ))}
                </div>
              </div>

              <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-300 py-1 px-2 font-bold text-[11px] uppercase text-slate-900 border-b border-slate-900">
                  SIE. KEBERSIHAN
                </div>
                <div className="bg-white p-2 text-left text-[11px] space-y-1 font-medium">
                  {strukturOrganisasi.sieKebersihan.split('&').map((p, idx) => (
                    <p key={idx}>{idx + 1}. {p.trim()}</p>
                  ))}
                </div>
              </div>

              <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-300 py-1 px-2 font-bold text-[11px] uppercase text-slate-900 border-b border-slate-900">
                  SIE. KEAGAMAAN
                </div>
                <div className="bg-white p-2 text-left text-[11px] space-y-1 font-medium">
                  {strukturOrganisasi.sieKeagamaan.split('&').map((p, idx) => (
                    <p key={idx}>{idx + 1}. {p.trim()}</p>
                  ))}
                </div>
              </div>

              <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-300 py-1 px-2 font-bold text-[11px] uppercase text-slate-900 border-b border-slate-900">
                  SIE. KREATIVITAS
                </div>
                <div className="bg-white p-2 text-left text-[11px] space-y-1 font-medium">
                  {strukturOrganisasi.sieKreativitas.split('&').map((p, idx) => (
                    <p key={idx}>{idx + 1}. {p.trim()}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Level 6: Anggota Kelas */}
            <div className="border-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-slate-300 py-1.5 px-3 font-bold text-xs uppercase text-slate-900 border-b border-slate-900">
                ANGGOTA
              </div>
              <div className="bg-white py-2 px-3 font-black text-sm text-slate-900">
                Seluruh Siswa Kelas {kelas} ({school})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. BUKU INVENTARIS KELAS TAPEL 2023/2024 (data inventaris kelas.png) */}
      {/* ===================================================================== */}
      {activeSub === 'inventaris_kelas' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-sans">
          {/* Header Banner Kuning matching data inventaris kelas.png */}
          <div className="bg-[#facc15] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-sm border border-amber-400">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-serif tracking-wider uppercase text-center sm:text-left">
              BUKU INVENTARIS KELAS TAPEL {tapel}
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={triggerPrint}
                className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow cursor-pointer transition-colors"
                title="Unduh / Cetak Buku Inventaris Kelas ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              {selectedInventarisIds.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus ${selectedInventarisIds.length} barang inventaris terpilih?`)) {
                      setInventarisList((prev) => prev.filter((i) => !selectedInventarisIds.includes(i.id)));
                      setSelectedInventarisIds([]);
                    }
                  }}
                  className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus ({selectedInventarisIds.length}) Terpilih</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setEditingInventaris(null);
                setIsInventarisModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Barang Inventaris</span>
            </button>
          </div>

          {/* Table matching data inventaris kelas.png */}
          <div className="overflow-x-auto border-2 border-slate-800 rounded-lg shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 font-black text-slate-950 uppercase border-b-2 border-slate-800">
                <tr>
                  <th className="p-2.5 text-center w-10 border-r border-slate-800">
                    <input
                      type="checkbox"
                      checked={
                        inventarisList.length > 0 &&
                        selectedInventarisIds.length === inventarisList.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) setSelectedInventarisIds(inventarisList.map((i) => i.id));
                        else setSelectedInventarisIds([]);
                      }}
                      className="rounded text-sky-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-2.5 text-center w-12 border-r border-slate-800">No</th>
                  <th className="p-2.5 border-r border-slate-800">Nama Barang</th>
                  <th className="p-2.5 text-center w-24 border-r border-slate-800">Jumlah Barang</th>
                  <th className="p-2.5 text-center w-28 border-r border-slate-800">Tahun Pembelian</th>
                  <th className="p-2.5 text-right w-28 border-r border-slate-800">Harga Barang</th>
                  <th className="p-2.5 text-center w-28 border-r border-slate-800">Kondisi Barang</th>
                  <th className="p-2.5 border-r border-slate-800">Keterangan</th>
                  <th className="p-2.5 text-center w-20">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 bg-white font-sans text-xs">
                {inventarisList.map((inv, idx) => {
                  const isChecked = selectedInventarisIds.includes(inv.id);
                  return (
                    <tr key={inv.id} className={`hover:bg-slate-50 ${isChecked ? 'bg-amber-50/70' : ''}`}>
                      <td className="p-2 text-center border-r border-slate-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedInventarisIds((prev) =>
                              prev.includes(inv.id) ? prev.filter((i) => i !== inv.id) : [...prev, inv.id]
                            )
                          }
                          className="rounded text-sky-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-2 text-center font-bold text-slate-600 border-r border-slate-800">{idx + 1}</td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-800">{inv.namaBarang}</td>
                      <td className="p-2 text-center font-mono font-bold text-slate-800 border-r border-slate-800">{inv.jumlahBarang}</td>
                      <td className="p-2 text-center font-mono text-slate-700 border-r border-slate-800">{inv.tahunPembelian}</td>
                      <td className="p-2 text-right font-mono text-slate-800 border-r border-slate-800">{inv.hargaBarang}</td>
                      <td className="p-2 text-center border-r border-slate-800 font-bold">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800">
                          {inv.kondisiBarang}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-800">{inv.keterangan}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingInventaris(inv);
                              setIsInventarisModalOpen(true);
                            }}
                            className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus "${inv.namaBarang}"?`)) {
                                setInventarisList((prev) => prev.filter((i) => i.id !== inv.id));
                              }
                            }}
                            className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 9. DAFTAR SISWA PINDAH (EXACT LAYOUT OF daftar mutasi siswa.png)      */}
      {/* ===================================================================== */}
      {activeSub === 'mutasi_siswa' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm font-sans">
          {/* Header Banner Kuning matching daftar mutasi siswa.png */}
          <div className="bg-[#facc15] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-sm border border-amber-400">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-serif tracking-wider uppercase text-center sm:text-left">
              DAFTAR SISWA PINDAH
            </h1>
            <button
              onClick={triggerPrint}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center space-x-1.5"
              title="Unduh / Cetak Daftar Mutasi Siswa ke format PDF Kertas A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Unduh PDF A4</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              {selectedPindahIds.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus ${selectedPindahIds.length} data siswa pindah terpilih?`)) {
                      setPindahList((prev) => prev.filter((p) => !selectedPindahIds.includes(p.id)));
                      setSelectedPindahIds([]);
                    }
                  }}
                  className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus ({selectedPindahIds.length}) Terpilih</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setEditingPindah(null);
                setIsPindahModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa Pindah</span>
            </button>
          </div>

          {/* Table matching exact layout from daftar mutasi siswa.png */}
          <div className="overflow-x-auto border-2 border-slate-800 rounded-lg shadow-sm">
            <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
              <thead className="bg-[#93c5fd] font-black text-slate-950 uppercase border-b-2 border-slate-800">
                <tr>
                  <th className="p-2.5 text-center w-10 border-r border-slate-800">
                    <input
                      type="checkbox"
                      checked={
                        pindahList.length > 0 &&
                        selectedPindahIds.length === pindahList.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPindahIds(pindahList.map((p) => p.id));
                        else setSelectedPindahIds([]);
                      }}
                      className="rounded text-sky-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-2.5 text-center w-10 border-r border-slate-800">No</th>
                  <th className="p-2.5 text-center w-16 border-r border-slate-800">NIS</th>
                  <th className="p-2.5 text-center w-20 border-r border-slate-800">NISN</th>
                  <th className="p-2.5 border-r border-slate-800">Nama Siswa</th>
                  <th className="p-2.5 text-center w-32 border-r border-slate-800">NIK</th>
                  <th className="p-2.5 text-center w-12 border-r border-slate-800">L/P</th>
                  <th className="p-2.5 border-r border-slate-800">Tanggal Lahir</th>
                  <th className="p-2.5 text-center w-12 border-r border-slate-800">Kelas</th>
                  <th className="p-2.5 border-r border-slate-800">Nama Orang Tua</th>
                  <th className="p-2.5 border-r border-slate-800">Tanggal Pindah</th>
                  <th className="p-2.5 border-r border-slate-800">Sekolah Tujuan</th>
                  <th className="p-2.5 border-r border-slate-800">Alamat Sekolah</th>
                  <th className="p-2.5 border-r border-slate-800">Alasan</th>
                  <th className="p-2.5 text-center w-20">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 bg-white font-sans text-xs">
                {pindahList.map((p, idx) => {
                  const isChecked = selectedPindahIds.includes(p.id);
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50 ${isChecked ? 'bg-amber-50/70' : ''}`}>
                      <td className="p-2 text-center border-r border-slate-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedPindahIds((prev) =>
                              prev.includes(p.id) ? prev.filter((i) => i !== p.id) : [...prev, p.id]
                            )
                          }
                          className="rounded text-sky-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-2 text-center font-bold text-slate-600 border-r border-slate-800">{idx + 1}</td>
                      <td className="p-2 text-center font-mono border-r border-slate-800">{p.nis}</td>
                      <td className="p-2 text-center font-mono border-r border-slate-800">{p.nisn}</td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-800 whitespace-nowrap">{p.nama}</td>
                      <td className="p-2 text-center font-mono text-slate-700 border-r border-slate-800">{p.nik}</td>
                      <td className="p-2 text-center font-bold border-r border-slate-800">{p.jk}</td>
                      <td className="p-2 text-slate-700 border-r border-slate-800 whitespace-nowrap">{p.tanggalLahir}</td>
                      <td className="p-2 text-center font-bold text-sky-800 border-r border-slate-800">{p.kelas}</td>
                      <td className="p-2 text-slate-800 border-r border-slate-800 whitespace-nowrap">{p.namaOrtu}</td>
                      <td className="p-2 text-slate-700 border-r border-slate-800 whitespace-nowrap">{p.tanggalPindah}</td>
                      <td className="p-2 font-semibold text-slate-900 border-r border-slate-800 whitespace-nowrap">{p.sekolahTujuan}</td>
                      <td className="p-2 text-slate-600 border-r border-slate-800 whitespace-nowrap">{p.alamatSekolah}</td>
                      <td className="p-2 text-slate-700 border-r border-slate-800 whitespace-nowrap">{p.alasan}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingPindah(p);
                              setIsPindahModalOpen(true);
                            }}
                            className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus data pindah siswa "${p.nama}"?`)) {
                                setPindahList((prev) => prev.filter((item) => item.id !== p.id));
                              }
                            }}
                            className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 10. SURAT PINDAH & SURAT LOLOS BUTUH (surat pindah.png & surat lolos butuh.png) */}
      {/* ===================================================================== */}
      {activeSub === 'surat_pindah' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-sm font-sans">
          {/* Sub-tab selection between Surat Pindah & Surat Lolos Butuh */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveSuratType('pindah')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  activeSuratType === 'pindah'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📄 Surat Keterangan Pindah Sekolah
              </button>
              <button
                onClick={() => setActiveSuratType('lolos_butuh')}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  activeSuratType === 'lolos_butuh'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📄 Surat Keterangan Lolos Butuh
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="font-bold text-slate-700">Pilih Siswa:</span>
              <select
                value={selectedSuratStudentId}
                onChange={(e) => setSelectedSuratStudentId(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded font-bold bg-white text-slate-900"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.nisNisn})
                  </option>
                ))}
              </select>

              <button
                onClick={triggerPrint}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center space-x-1.5"
                title="Unduh / Cetak Surat Resmi ke format PDF Kertas A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </button>
            </div>
          </div>

          {/* 10A: SURAT KETERANGAN PINDAH SEKOLAH (EXACT LAYOUT OF surat pindah.png) */}
          {activeSuratType === 'pindah' && (
            <div className="max-w-3xl mx-auto border-2 border-slate-800 p-8 sm:p-12 rounded bg-white text-slate-950 font-serif leading-relaxed text-xs shadow-sm">
              {/* Kop Surat matching surat pindah.png with Logo Pemda & Tut Wuri */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-4 border-double border-slate-900 font-sans text-center">
                <div className="w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50 font-bold text-[10px] text-slate-700 p-1">
                  LOGO PEMDA
                </div>
                <div className="flex-1 px-4">
                  <h3 className="font-bold text-xs uppercase text-slate-900">
                    PEMERINTAH KABUPATEN PARIGI MOUTONG
                  </h3>
                  <h2 className="font-bold text-xs uppercase text-slate-950">
                    KOORWIL SATUAN PENDIDIKAN KECAMATAN PALASA
                  </h2>
                  <h1 className="font-black text-base uppercase text-slate-950 tracking-wide mt-0.5">
                    {school}
                  </h1>
                  <p className="text-[10px] text-slate-700">
                    Alamat : {schoolProfile?.alamatSekolah || 'Jl. Pantai Indah Dusun V Palasa Tangki'}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50 font-bold text-[10px] text-slate-700 p-1">
                  TUT WURI
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-800 mb-4">
                NSS : {schoolProfile?.npsn || '40202826'}
              </div>

              <div className="text-center mb-6">
                <h2 className="font-bold underline text-sm sm:text-base uppercase tracking-wider">
                  SURAT KETERANGAN PINDAH SEKOLAH
                </h2>
                <p className="text-xs text-slate-700 mt-0.5">
                  Nomor : {suratNomor}
                </p>
              </div>

              <p className="mb-4 text-justify">
                Yang bertanda tangan di bawah ini, Kepala {school} Kecamatan {schoolFormData.kecamatan} Kabupaten {schoolFormData.kabupatenKota} Propinsi {schoolFormData.provinsi}, menerangkan bahwa :
              </p>

              <div className="space-y-1.5 pl-6 mb-6 font-mono text-xs">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Nama</span>
                  <span className="col-span-8">: &nbsp;<strong>{activeLetterStudent.nama}</strong></span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">NIS/NISN</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.nisNisn}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Kelas</span>
                  <span className="col-span-8">: &nbsp;{kelas} (Satu)</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Jenis Kelamin</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Alamat</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.alamat}</span>
                </div>
              </div>

              <p className="mb-2">Sesuai surat permohonan pindah sekolah oleh orang tua :</p>
              <div className="space-y-1.5 pl-6 mb-4 font-mono text-xs">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Nama</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.namaAyah}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Pekerjaan</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.pekerjaanAyah}</span>
                </div>
              </div>

              <p className="mb-2">
                telah mengajukan Pindah ke <strong>{suratSekolahTujuan}</strong> dengan alasan <strong>{suratAlasan}</strong>.
              </p>
              <p className="mb-8">
                Bersama ini kami sertakan Buku Raport yang bersangkutan.
              </p>

              <div className="flex justify-end text-center font-sans mt-8">
                <div className="w-64">
                  <p className="text-xs">Kepala Sekolah</p>
                  <p className="text-xs font-bold uppercase mt-0.5">{school}</p>
                  <div className="h-20"></div>
                  <p className="font-bold underline uppercase text-xs">{kepsek}</p>
                  <p className="text-[11px] text-slate-800">NIP. {nipKepsek}</p>
                </div>
              </div>
            </div>
          )}

          {/* 10B: SURAT KETERANGAN LOLOS BUTUH (EXACT LAYOUT OF surat lolos butuh.png) */}
          {activeSuratType === 'lolos_butuh' && (
            <div className="max-w-3xl mx-auto border-2 border-slate-800 p-8 sm:p-12 rounded bg-white text-slate-950 font-serif leading-relaxed text-xs shadow-sm">
              {/* Kop Surat matching surat lolos butuh.png */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-900 font-sans text-center">
                <div className="w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50 font-bold text-[10px] text-slate-700 p-1">
                  LOGO PEMDA
                </div>
                <div className="flex-1 px-4">
                  <h3 className="font-bold text-xs uppercase text-slate-900">
                    PEMERINTAH KABUPATEN PARIGI MOUTONG
                  </h3>
                  <h2 className="font-bold text-xs uppercase text-slate-950">
                    KOORDINATOR WILAYAH SATUAN PENDIDIKAN KECAMATAN PALASA
                  </h2>
                  <h1 className="font-black text-base uppercase text-slate-950 tracking-wide mt-0.5">
                    {school}
                  </h1>
                  <p className="text-[10px] text-slate-700">
                    Alamat : {schoolProfile?.alamatSekolah || 'Jl. Pantai Indah Dusun V Palasa Tangki'}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50 font-bold text-[10px] text-slate-700 p-1">
                  TUT WURI
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="font-bold underline text-sm sm:text-base uppercase tracking-wider">
                  SURAT KETERANGAN LOLOS BUTUH
                </h2>
                <p className="text-xs text-slate-700 mt-0.5">
                  Nomor : {suratNomor}
                </p>
              </div>

              <p className="mb-3">Yang bertanda tangan dibawah ini :</p>
              <div className="space-y-1.5 pl-6 mb-4 font-mono text-xs">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-3">Nama</span>
                  <span className="col-span-9">: &nbsp;<strong>{kepsek}</strong></span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-3">NIP</span>
                  <span className="col-span-9">: &nbsp;{nipKepsek}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-3">Jabatan</span>
                  <span className="col-span-9">: &nbsp;Kepala Sekolah</span>
                </div>
              </div>

              <p className="mb-3">Dengan ini memberikan surat keterangan Lolos Butuh kepada :</p>
              <div className="space-y-1.5 pl-6 mb-6 font-mono text-xs">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Nama</span>
                  <span className="col-span-8">: &nbsp;<strong>{activeLetterStudent.nama}</strong></span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Jenis Kelamin</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Tempat, Tanggal Lahir</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.tanggalLahir}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Kelas</span>
                  <span className="col-span-8">: &nbsp;{kelas}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Agama</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.agama}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Alamat</span>
                  <span className="col-span-8">: &nbsp;{activeLetterStudent.alamat}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4">Asal Sekolah</span>
                  <span className="col-span-8">: &nbsp;TK / PAUD Palasa</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-bold">Mohon Dilampirkan :</p>
                <div className="flex items-center space-x-2 mt-1 pl-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
                  <span>Surat Keterangan Pindah</span>
                </div>
              </div>

              <p className="mb-3 text-justify">
                Bahwa yang bersangkutan benar-benar diterima pada sekolah {school} Kec. {schoolFormData.kecamatan} Kabupaten {schoolFormData.kabupatenKota}.
              </p>
              <p className="mb-8 text-justify">
                Demikian Surat keterangan lolos butuh ini diberikan kepada yang bersangkutan untuk dipergunakan sebagaimana mestinya.
              </p>

              <div className="flex justify-end text-center font-sans mt-8">
                <div className="w-64">
                  <p className="text-xs">...................., {suratTanggal}</p>
                  <p className="text-xs font-bold uppercase mt-0.5">Kepala Sekolah</p>
                  <div className="h-20"></div>
                  <p className="font-bold underline uppercase text-xs">{kepsek}</p>
                  <p className="text-[11px] text-slate-800">NIP. {nipKepsek}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 11. SAMPUL ADMINISTRASI KELAS (COVER JILID RESMI)                     */}
      {/* ===================================================================== */}
      {activeSub === 'sampul_kelas' && (
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-12 shadow-sm font-serif">
          <div className="max-w-2xl mx-auto border-4 border-double border-sky-800 bg-white p-8 sm:p-12 text-center rounded-lg shadow-sm relative">
            <div className="flex items-center justify-between mb-6 font-sans">
              <div className="flex items-center space-x-2 text-left">
                <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  MM
                </div>
                <div className="leading-tight text-[10px] font-bold text-slate-800">
                  Merdeka<br />Mengajar
                </div>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center bg-blue-50 shadow-inner">
                <div className="w-12 h-12 rounded-full bg-sky-600 border border-white flex items-center justify-center text-white font-serif font-black text-sm">
                  🎓
                </div>
              </div>

              <div className="w-28 text-right no-print">
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="inline-flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm text-xs cursor-pointer transition-colors"
                  title="Unduh / Cetak Sampul Administrasi Kelas ke format PDF Kertas A4"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Unduh PDF A4</span>
                </button>
              </div>
            </div>

            <p className="font-bold text-xs uppercase tracking-wider text-sky-900 font-sans">
              KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
            </p>
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-800 mt-1 font-sans">
              {schoolProfile?.dinasPendidikan || 'KOORDINATOR WILAYAH SATUAN PENDIDIKAN KECAMATAN PALASA'}
            </h3>
            <h2 className="font-extrabold text-base uppercase tracking-wide text-slate-950 mt-1 font-sans">
              {school}
            </h2>

            <div className="my-8">
              <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-950 leading-tight font-sans">
                BUKU ADMINISTRASI KELAS<br />KURIKULUM MERDEKA
              </h1>
              <p className="font-bold text-base text-sky-800 mt-3 font-sans">
                Kelas {kelas}
              </p>
            </div>

            <div className="text-left font-mono text-xs sm:text-sm max-w-sm mx-auto space-y-1 mb-6 font-semibold text-slate-900 border-t border-b border-slate-300 py-3">
              <p>Nama Wali Kelas : {guru}</p>
              <p>NIP &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : {nipGuru}</p>
            </div>

            <div className="border-2 border-slate-900 p-4 max-w-sm mx-auto text-left text-xs font-sans space-y-2 bg-slate-50/70">
              <p className="font-bold uppercase tracking-wider text-[11px] text-slate-700 border-b border-slate-300 pb-1 mb-2">
                Daftar Isi Berkas Administrasi Kelas:
              </p>
              {[
                'Data Satuan Pendidikan (Profil Sekolah)',
                'Data Lengkap Peserta Didik (Buku Induk)',
                'Absensi Siswa Kelas (Bulanan & Rekap Kehadiran)',
                'Rekap Nilai Permapel (Formatif & Sumatif)',
                'Jadwal Mata Pelajaran & Jadwal Piket Kebersihan',
                'Struktur Organisasi Kelas',
                'Denah Tempat Duduk Kelas',
                'Buku Inventaris Barang Ruang Kelas',
                'Daftar Siswa Pindah & Mutasi Siswa',
                'Format Surat Keterangan Pindah & Lolos Butuh',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-sky-700 font-bold">✎</span>
                  <span className="text-slate-800 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-700 font-bold mt-8 uppercase tracking-widest font-sans">
              Tahun Pelajaran {tapel}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: TAMBAH / EDIT DATA SISWA                                     */}
      {/* ===================================================================== */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn font-sans">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
              </h3>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIS/NISN (Kolom 2)</label>
                  <input
                    name="nisNisn"
                    defaultValue={editingStudent?.nisNisn || ''}
                    placeholder="Contoh: 123/4567"
                    required
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa (Kolom 3)</label>
                  <input
                    name="nama"
                    defaultValue={editingStudent?.nama || ''}
                    placeholder="Contoh: Moh. Fadli"
                    required
                    className="w-full px-3 py-2 border rounded-lg font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK (Kolom 4)</label>
                  <input
                    name="nik"
                    defaultValue={editingStudent?.nik || ''}
                    placeholder="16 Digit NIK"
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin (Kolom 5)</label>
                  <select
                    name="jk"
                    defaultValue={editingStudent?.jk || 'L'}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold"
                  >
                    <option value="L">L (Laki-laki)</option>
                    <option value="P">P (Perempuan)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tempat, Tanggal Lahir (Kolom 6)</label>
                  <input
                    name="tanggalLahir"
                    defaultValue={editingStudent?.tanggalLahir || ''}
                    placeholder="Contoh: Palasa, 12-12-2012"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Agama (Kolom 7)</label>
                  <input
                    name="agama"
                    defaultValue={editingStudent?.agama || 'Islam'}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas (Kolom 8)</label>
                  <input
                    name="kelas"
                    defaultValue={editingStudent?.kelas || kelas}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Siswa (Kolom 9)</label>
                  <select
                    name="statusSiswa"
                    defaultValue={editingStudent?.statusSiswa || 'Siswa baru'}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-bold"
                  >
                    <option value="Siswa baru">Siswa baru</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Pindahan">Pindahan</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Alamat Domisili (Kolom 10)</label>
                  <input
                    name="alamat"
                    defaultValue={editingStudent?.alamat || ''}
                    placeholder="Contoh: Palasa Tangki"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">No Telepon Rumah (Kolom 11)</label>
                  <input
                    name="telepon"
                    defaultValue={editingStudent?.telepon || ''}
                    placeholder="Contoh: 0822-xxxx-xxxx"
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Ayah (Kolom 12)</label>
                  <input
                    name="namaAyah"
                    defaultValue={editingStudent?.namaAyah || ''}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Ibu (Kolom 13)</label>
                  <input
                    name="namaIbu"
                    defaultValue={editingStudent?.namaIbu || ''}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pekerjaan Ayah (Kolom 14)</label>
                  <input
                    name="pekerjaanAyah"
                    defaultValue={editingStudent?.pekerjaanAyah || ''}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pekerjaan Ibu (Kolom 15)</label>
                  <input
                    name="pekerjaanIbu"
                    defaultValue={editingStudent?.pekerjaanIbu || ''}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tinggi Badan (Kolom 16)</label>
                  <input
                    name="tinggiBadan"
                    defaultValue={editingStudent?.tinggiBadan || '145 Cm'}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Berat Badan (Kolom 17)</label>
                  <input
                    name="beratBadan"
                    defaultValue={editingStudent?.beratBadan || '38 Kg'}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: INPUT NILAI SISWA                                            */}
      {/* ===================================================================== */}
      {editingNilaiStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Input / Edit Rekap Nilai Siswa
                </h3>
                <p className="text-xs text-sky-700 font-bold">
                  {editingNilaiStudent.nama} ({editingNilaiStudent.nisNisn})
                </p>
              </div>
              <button
                onClick={() => setEditingNilaiStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const parseNum = (k: string) => {
                  const val = fd.get(k);
                  return val ? Number(val) : undefined;
                };

                const updated: GradesRecord = {
                  agama: parseNum('agama'),
                  pkn: parseNum('pkn'),
                  bindo: parseNum('bindo'),
                  mtk: parseNum('mtk'),
                  ipas: parseNum('ipas'),
                  rupa: parseNum('rupa'),
                  musik: parseNum('musik'),
                  tari: parseNum('tari'),
                  teater: parseNum('teater'),
                  pjok: parseNum('pjok'),
                  uh1: parseNum('uh1'),
                  uh2: parseNum('uh2'),
                  uh3: parseNum('uh3'),
                  uh4: parseNum('uh4'),
                  praktik: parseNum('praktik'),
                  pts: parseNum('pts'),
                  pas: parseNum('pas'),
                };

                setNilaiGrid((prev) => ({
                  ...prev,
                  [editingNilaiStudent.id]: updated,
                }));
                setEditingNilaiStudent(null);
              }}
              className="space-y-4 text-xs"
            >
              <div className="border p-3 rounded-lg bg-sky-50/50">
                <p className="font-bold text-sky-900 mb-2 uppercase text-[11px]">Nilai Mata Pelajaran</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['agama', 'pkn', 'bindo', 'mtk', 'ipas', 'rupa', 'musik', 'tari', 'teater', 'pjok'].map((subj) => (
                    <div key={subj}>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">{subj}</label>
                      <input
                        type="number"
                        name={subj}
                        defaultValue={nilaiGrid[editingNilaiStudent.id]?.[subj as keyof GradesRecord] ?? ''}
                        className="w-full p-1.5 border rounded text-xs font-mono font-bold"
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border p-3 rounded-lg bg-emerald-50/50">
                <p className="font-bold text-emerald-900 mb-2 uppercase text-[11px]">Ulangan Harian & Asesmen</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['uh1', 'uh2', 'uh3', 'uh4'].map((uh) => (
                    <div key={uh}>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">{uh}</label>
                      <input
                        type="number"
                        name={uh}
                        defaultValue={nilaiGrid[editingNilaiStudent.id]?.[uh as keyof GradesRecord] ?? ''}
                        className="w-full p-1.5 border rounded text-xs font-mono font-bold"
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border p-3 rounded-lg bg-purple-50/50">
                <p className="font-bold text-purple-900 mb-2 uppercase text-[11px]">Praktik & Sumatif Tengah / Akhir</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">Praktik</label>
                    <input
                      type="number"
                      name="praktik"
                      defaultValue={nilaiGrid[editingNilaiStudent.id]?.praktik ?? ''}
                      className="w-full p-1.5 border rounded text-xs font-mono font-bold"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">PTS (STS)</label>
                    <input
                      type="number"
                      name="pts"
                      defaultValue={nilaiGrid[editingNilaiStudent.id]?.pts ?? ''}
                      className="w-full p-1.5 border rounded text-xs font-mono font-bold"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-700 mb-0.5">PAS (SAS)</label>
                    <input
                      type="number"
                      name="pas"
                      defaultValue={nilaiGrid[editingNilaiStudent.id]?.pas ?? ''}
                      className="w-full p-1.5 border rounded text-xs font-mono font-bold"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingNilaiStudent(null)}
                  className="px-4 py-2 border rounded font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow-sm"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: TAMBAH / EDIT BARANG INVENTARIS                              */}
      {/* ===================================================================== */}
      {isInventarisModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingInventaris ? 'Edit Barang Inventaris' : 'Tambah Barang Inventaris'}
              </h3>
              <button
                onClick={() => setIsInventarisModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const item: InventarisItem = {
                  id: editingInventaris ? editingInventaris.id : `inv-${Date.now()}`,
                  namaBarang: (fd.get('namaBarang') as string) || 'Barang Baru',
                  jumlahBarang: Number(fd.get('jumlahBarang')) || 1,
                  tahunPembelian: (fd.get('tahunPembelian') as string) || '2023',
                  hargaBarang: (fd.get('hargaBarang') as string) || 'Rp -',
                  kondisiBarang: (fd.get('kondisiBarang') as any) || 'Baik',
                  keterangan: (fd.get('keterangan') as string) || 'Inventaris Kelas',
                };

                if (editingInventaris) {
                  setInventarisList((prev) => prev.map((i) => (i.id === item.id ? item : i)));
                } else {
                  setInventarisList((prev) => [...prev, item]);
                }
                setIsInventarisModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Barang</label>
                <input
                  name="namaBarang"
                  defaultValue={editingInventaris?.namaBarang || ''}
                  required
                  placeholder="Contoh: Meja Guru"
                  className="w-full p-2 border rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Barang</label>
                  <input
                    type="number"
                    name="jumlahBarang"
                    defaultValue={editingInventaris?.jumlahBarang || 1}
                    min="1"
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun Pembelian</label>
                  <input
                    name="tahunPembelian"
                    defaultValue={editingInventaris?.tahunPembelian || '2023'}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Barang</label>
                  <input
                    name="hargaBarang"
                    defaultValue={editingInventaris?.hargaBarang || 'Rp 500.000'}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kondisi Barang</label>
                  <select
                    name="kondisiBarang"
                    defaultValue={editingInventaris?.kondisiBarang || 'Baik'}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan / Sumber Dana</label>
                <input
                  name="keterangan"
                  defaultValue={editingInventaris?.keterangan || 'BOS Reguler'}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsInventarisModalOpen(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow-sm"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: TAMBAH / EDIT SISWA PINDAH                                   */}
      {/* ===================================================================== */}
      {isPindahModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingPindah ? 'Edit Data Siswa Pindah' : 'Catat Siswa Pindah Baru'}
              </h3>
              <button
                onClick={() => setIsPindahModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const item: StudentPindahItem = {
                  id: editingPindah ? editingPindah.id : `p-${Date.now()}`,
                  nis: (fd.get('nis') as string) || '',
                  nisn: (fd.get('nisn') as string) || '',
                  nama: (fd.get('nama') as string) || 'Nama Siswa',
                  nik: (fd.get('nik') as string) || '',
                  jk: (fd.get('jk') as 'L' | 'P') || 'L',
                  tanggalLahir: (fd.get('tanggalLahir') as string) || '',
                  kelas: (fd.get('kelas') as string) || kelas,
                  namaOrtu: (fd.get('namaOrtu') as string) || '',
                  tanggalPindah: (fd.get('tanggalPindah') as string) || '01 Agustus 2023',
                  sekolahTujuan: (fd.get('sekolahTujuan') as string) || 'SD Negeri Tujuan',
                  alamatSekolah: (fd.get('alamatSekolah') as string) || '',
                  alasan: (fd.get('alasan') as string) || 'Mengikuti Orang Tua',
                };

                if (editingPindah) {
                  setPindahList((prev) => prev.map((p) => (p.id === item.id ? item : p)));
                } else {
                  setPindahList((prev) => [...prev, item]);
                }
                setIsPindahModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              {/* Opsi Pilih Cepat dari Data Siswa */}
              {!editingPindah && (
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg">
                  <label className="font-bold text-sky-900 block mb-1">
                    Pilih Cepat dari Data Siswa Terdaftar:
                  </label>
                  <select
                    onChange={(e) => {
                      const sel = students.find((s) => s.id === e.target.value);
                      if (sel) {
                        const form = e.target.form;
                        if (form) {
                          (form.elements.namedItem('nama') as HTMLInputElement).value = sel.nama;
                          (form.elements.namedItem('nis') as HTMLInputElement).value = sel.nis;
                          (form.elements.namedItem('nisn') as HTMLInputElement).value = sel.nisn;
                          (form.elements.namedItem('nik') as HTMLInputElement).value = sel.nik;
                          (form.elements.namedItem('jk') as HTMLSelectElement).value = sel.jk;
                          (form.elements.namedItem('tanggalLahir') as HTMLInputElement).value = sel.tanggalLahir;
                          (form.elements.namedItem('namaOrtu') as HTMLInputElement).value = sel.namaAyah;
                        }
                      }
                    }}
                    className="w-full p-2 border rounded font-bold text-xs bg-white"
                  >
                    <option value="">-- Pilih Siswa untuk Mengisi Otomatis --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.nisNisn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIS</label>
                  <input
                    name="nis"
                    defaultValue={editingPindah?.nis || ''}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NISN</label>
                  <input
                    name="nisn"
                    defaultValue={editingPindah?.nisn || ''}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Siswa</label>
                <input
                  name="nama"
                  defaultValue={editingPindah?.nama || ''}
                  required
                  className="w-full p-2 border rounded font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK</label>
                  <input
                    name="nik"
                    defaultValue={editingPindah?.nik || ''}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">L/P</label>
                  <select
                    name="jk"
                    defaultValue={editingPindah?.jk || 'L'}
                    className="w-full p-2 border rounded font-bold"
                  >
                    <option value="L">L (Laki-laki)</option>
                    <option value="P">P (Perempuan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                <input
                  name="tanggalLahir"
                  defaultValue={editingPindah?.tanggalLahir || ''}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Orang Tua</label>
                <input
                  name="namaOrtu"
                  defaultValue={editingPindah?.namaOrtu || ''}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Pindah</label>
                  <input
                    name="tanggalPindah"
                    defaultValue={editingPindah?.tanggalPindah || '01 Agustus 2023'}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas</label>
                  <input
                    name="kelas"
                    defaultValue={editingPindah?.kelas || kelas}
                    className="w-full p-2 border rounded font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sekolah Tujuan</label>
                <input
                  name="sekolahTujuan"
                  defaultValue={editingPindah?.sekolahTujuan || ''}
                  placeholder="Contoh: SD Negeri 1 Parigi"
                  className="w-full p-2 border rounded font-bold text-sky-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Sekolah Tujuan</label>
                <input
                  name="alamatSekolah"
                  defaultValue={editingPindah?.alamatSekolah || ''}
                  placeholder="Contoh: Kec. Parigi Kab. Parigi Moutong"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alasan Pindah</label>
                <input
                  name="alasan"
                  defaultValue={editingPindah?.alasan || 'Mengikuti Orang Tua'}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsPindahModalOpen(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow-sm"
                >
                  Simpan Catatan Pindah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL 5: EDIT JADWAL PELAJARAN                                        */}
      {/* ===================================================================== */}
      {isEditJadwalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Edit2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Jadwal Mata Pelajaran (Senin - Sabtu)
                </h3>
              </div>
              <button
                onClick={() => setIsEditJadwalModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditJadwalModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="overflow-x-auto border border-slate-200 rounded-lg p-2 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-emerald-100 text-slate-900 font-bold border-b border-emerald-300">
                      <th className="p-2 w-12 border-r border-emerald-200">Jam</th>
                      {['SENIN', 'SELASA', 'RABU', 'KAMIS', "JUM'AT", 'SABTU'].map((d) => (
                        <th key={d} className="p-2 border-r border-emerald-200">{d}</th>
                      ))}
                      <th className="p-2 w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalPelajaran.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-200">
                        <td className="p-1.5 font-bold bg-slate-50 border-r border-slate-200">
                          Ke-{rIdx + 1}
                        </td>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="p-1 border-r border-slate-200">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => {
                                const nextVal = e.target.value;
                                setJadwalPelajaran((prev) => {
                                  const copy = prev.map((r) => [...r]);
                                  copy[rIdx][cIdx] = nextVal;
                                  return copy;
                                });
                              }}
                              className="w-full px-2 py-1 border border-slate-300 rounded text-center text-xs font-semibold focus:outline-emerald-600 bg-white"
                            />
                          </td>
                        ))}
                        <td className="p-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (jadwalPelajaran.length <= 1) return;
                              setJadwalPelajaran((prev) => prev.filter((_, i) => i !== rIdx));
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Hapus baris jam ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setJadwalPelajaran((prev) => [
                      ...prev,
                      ['Mapel 1', 'Mapel 2', 'Mapel 3', 'Mapel 4', 'Mapel 5', 'Mapel 6'],
                    ]);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Baris Jam Pelajaran</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setJadwalPelajaran([
                        ['Upacara / Agama', 'Pancasila', 'B. Indonesia', 'Matematika', 'IPAS', 'Senam'],
                        ['Agama', 'Pancasila', 'B. Indonesia', 'Matematika', 'IPAS', 'Seni Rupa'],
                        ['Istirahat', 'Istirahat', 'Istirahat', 'Istirahat', 'Istirahat', 'Istirahat'],
                        ['B. Indonesia', 'Matematika', 'IPAS', 'PJOK', 'P5', 'Pembersihan'],
                        ['B. Indonesia', 'Matematika', 'IPAS', 'PJOK', 'P5', 'Pulang'],
                      ]);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border rounded-lg"
                  >
                    Reset Standar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm text-xs"
                  >
                    Selesai & Simpan Jadwal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 6: EDIT JADWAL PIKET KEBERSIHAN                                  */}
      {/* ===================================================================== */}
      {isEditPiketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2 text-sky-700">
                <Edit2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Petugas Piket Kebersihan Kelas (Senin - Sabtu)
                </h3>
              </div>
              <button
                onClick={() => setIsEditPiketModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditPiketModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="overflow-x-auto border border-slate-200 rounded-lg p-2 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-sky-100 text-slate-900 font-bold border-b border-sky-300">
                      <th className="p-2 w-12 border-r border-sky-200">No</th>
                      {['SENIN', 'SELASA', 'RABU', 'KAMIS', "JUM'AT", 'SABTU'].map((d) => (
                        <th key={d} className="p-2 border-r border-sky-200">{d}</th>
                      ))}
                      <th className="p-2 w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalPiket.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-200">
                        <td className="p-1.5 font-bold bg-slate-50 border-r border-slate-200">
                          {rIdx + 1}
                        </td>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="p-1 border-r border-slate-200">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => {
                                const nextVal = e.target.value;
                                setJadwalPiket((prev) => {
                                  const copy = prev.map((r) => [...r]);
                                  copy[rIdx][cIdx] = nextVal;
                                  return copy;
                                });
                              }}
                              className="w-full px-2 py-1 border border-slate-300 rounded text-center text-xs font-semibold focus:outline-sky-600 bg-white"
                            />
                          </td>
                        ))}
                        <td className="p-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (jadwalPiket.length <= 1) return;
                              setJadwalPiket((prev) => prev.filter((_, i) => i !== rIdx));
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Hapus baris nama petugas ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setJadwalPiket((prev) => [
                      ...prev,
                      [
                        students[0]?.nama || 'Nama 1',
                        students[1]?.nama || 'Nama 2',
                        students[2]?.nama || 'Nama 3',
                        students[3]?.nama || 'Nama 4',
                        students[4]?.nama || 'Nama 5',
                        students[5]?.nama || 'Nama 6',
                      ],
                    ]);
                  }}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-lg border border-sky-300 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Baris Petugas Piket</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg shadow-sm text-xs"
                  >
                    Selesai & Simpan Piket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 7: EDIT STRUKTUR ORGANISASI KELAS                                */}
      {/* ===================================================================== */}
      {isEditStrukturModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2 text-indigo-700">
                <Edit2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Pengurus Struktur Organisasi Kelas
                </h3>
              </div>
              <button
                onClick={() => setIsEditStrukturModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditStrukturModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Wali Kelas</label>
                <input
                  type="text"
                  value={strukturOrganisasi.waliKelas}
                  onChange={(e) =>
                    setStrukturOrganisasi({ ...strukturOrganisasi, waliKelas: e.target.value })
                  }
                  className="w-full p-2 border rounded font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ketua Kelas</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.ketuaKelas}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, ketuaKelas: e.target.value })
                    }
                    className="w-full p-2 border rounded font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Wakil Ketua Kelas</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.wakilKetua}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, wakilKetua: e.target.value })
                    }
                    className="w-full p-2 border rounded font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sekretaris 1</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.sekretaris1}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, sekretaris1: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sekretaris 2</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.sekretaris2}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, sekretaris2: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bendahara 1</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.bendahara1}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, bendahara1: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bendahara 2</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.bendahara2}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, bendahara2: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sie. Keamanan</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.sieKeamanan}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, sieKeamanan: e.target.value })
                    }
                    placeholder="Contoh: Bintang & Dimas"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sie. Kebersihan</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.sieKebersihan}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, sieKebersihan: e.target.value })
                    }
                    placeholder="Contoh: Gilang & Hanifah"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sie. Keagamaan</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.sieKeagamaan}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, sieKeagamaan: e.target.value })
                    }
                    placeholder="Contoh: Moh. Fadli & Syafiqah"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sie. Kreativitas</label>
                  <input
                    type="text"
                    value={strukturOrganisasi.sieKreativitas}
                    onChange={(e) =>
                      setStrukturOrganisasi({ ...strukturOrganisasi, sieKreativitas: e.target.value })
                    }
                    placeholder="Contoh: Aisyah & Alif"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditStrukturModalOpen(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded shadow-sm"
                >
                  Simpan Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 8: EDIT DENAH TEMPAT DUDUK MEJA SISWA                           */}
      {/* ===================================================================== */}
      {isEditDenahModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Edit2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  Atur & Edit Posisi Meja Siswa (Meja 1 - 20)
                </h3>
              </div>
              <button
                onClick={() => setIsEditDenahModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditDenahModalOpen(false);
              }}
              className="space-y-4"
            >
              <p className="text-xs text-slate-500">
                Pilih atau ketik nama siswa untuk menempati masing-masing nomor meja kelas:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[55vh] overflow-y-auto p-1">
                {Array.from({ length: 20 }, (_, idx) => {
                  const currentVal = denahMejaSiswa[idx] || (students[idx] ? students[idx].nama : '');
                  return (
                    <div key={idx} className="p-2 border border-slate-200 rounded-lg bg-slate-50">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Meja {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDenahMejaSiswa((prev) => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        placeholder={`Siswa ${idx + 1}`}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-medium"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    const autoNames = students.map((s) => s.nama);
                    setDenahMejaSiswa(autoNames);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 font-semibold border rounded-lg"
                >
                  Urutkan Sesuai Daftar Siswa
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditDenahModalOpen(false)}
                    className="px-4 py-2 border rounded font-bold text-slate-700 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-sm text-xs"
                  >
                    Simpan Denah Meja
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
