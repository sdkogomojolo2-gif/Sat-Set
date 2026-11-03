export type DocumentType = 
  | 'MODUL_AJAR' 
  | 'ATP'
  | 'PROTA' 
  | 'PROMES' 
  | 'KKTP'
  | 'SAMPUL'
  | 'JURNAL'
  | 'MODUL_P5' 
  | 'BANK_SOAL' 
  | 'SLIDE_AJAR'
  | 'SAMPUL_KELAS'
  | 'DATA_SISWA'
  | 'ABSEN_KELAS'
  | 'DAFTAR_NILAI'
  | 'JADWAL_KELAS'
  | 'STRUKTUR_KELAS'
  | 'DENAH_KELAS'
  | 'INVENTARIS_KELAS'
  | 'MUTASI_SISWA'
  | 'SURAT_PINDAH';

export interface SchoolTeacherProfile {
  namaSekolah: string;
  npsn: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  statusSekolah: 'Negeri' | 'Swasta';
  akreditasi: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
  alamatSekolah: string;
  kelurahanDesa: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  teleponEmail: string;
  logoSekolahUrl?: string;
  dinasPendidikan: string;
  cabangDinas?: string;
  
  // Kepala Sekolah
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  pangkatGolonganKepsek?: string;

  // Guru Pengampu
  namaGuru: string;
  nipGuru: string;
  nuptkGuru?: string;
  mataPelajaranGuru: string;
  faseKelasDiampu: string;
  noHpGuru?: string;

  // Pengawas Pembina
  pengawasSekolah: string;
  nipPengawas: string;
}

export interface ModulParams {
  mataPelajaran: string;
  faseKelas: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  pertemuanKe: string;
  topikMateri: string;
  alokasiWaktu: string;
  modelPembelajaran: string;
  pendekatan: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  dinasPendidikan: string;
  cabangDinas?: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  pengawasSekolah?: string;
  nipPengawas?: string;
  kotaKabupaten: string;
  profilPancasila: string[];
  targetPesertaDidik: string;
  jumlahSiswa: string;
  saranaPrasarana: string;
  catatanKhusus: string;
  formatDinasType?: 'STANDAR_LENGKAP' | 'SUPERVISI_PENGAWAS';
  capaianPembelajaran?: string;
  tujuanPembelajaran?: string;
}

export interface ProtaParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  tahunAjaran: string;
  alokasiJPTotal?: string;
  alokasiTotalJP?: string;
  daftarMateriPokok?: string;
  lingkupMateriUtama?: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
  tanggalTandaTangan?: string;
  peranGuru?: 'Guru Kelas' | 'Guru Mata Pelajaran';
}

export interface PromesParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  tahunAjaran: string;
  semester: '1 Tahun (Juli - Juni)' | 'Ganjil' | 'Genap';
  alokasiJPTotal?: string;
  alokasiTotalJP?: string;
  daftarMateriPokok?: string;
  lingkupMateri?: string;
  distribusiMingguan?: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
  tanggalTandaTangan?: string;
  peranGuru?: 'Guru Kelas' | 'Guru Mata Pelajaran';
}

export interface ProtaPromesParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap' | 'Keduanya';
  alokasiJPTotal: string;
  daftarMateriPokok: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
}

export interface P5Params {
  temaP5: string;
  subTemaJudul: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  fase: string;
  alokasiWaktuProjek: string;
  dimensiSasaran: string[];
  isMadrasahPPRA?: boolean;
  nilaiPPRA?: string[];
  targetHasilKarya: string;
  namaSekolah: string;
  namaGuruKoordinator: string;
  nipGuru: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
}

export interface BankSoalParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  topikMateri: string;
  jenisAsesmen: 'Asesmen Formatif' | 'Sumatif Tengah Semester (STS)' | 'Sumatif Akhir Semester (SAS)' | 'Simulasi ANBK HOTS';
  jumlahSoalPG: number;
  jumlahSoalKompleks: number;
  jumlahSoalMenjodohkan: number;
  jumlahSoalUraian: number;
  namaSekolah: string;
  namaGuru: string;
  kotaKabupaten: string;
}

export interface SlideAjarParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  topikMateri: string;
  jumlahSlide: number;
  namaGuru: string;
  namaSekolah: string;
}

export interface AtpParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  tahunAjaran: string;
  capaianPembelajaran: string;
  elemenCp: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
  tanggalTandaTangan?: string;
  peranGuru?: 'Guru Kelas' | 'Guru Mata Pelajaran';
}

export interface KktpParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  lingkupMateri: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
  tanggalTandaTangan?: string;
  peranGuru?: 'Guru Kelas' | 'Guru Mata Pelajaran';
}

export interface SampulParams {
  namaSekolah: string;
  dinasPendidikan: string;
  faseKelas: string;
  tahunAjaran: string;
  namaGuru: string;
  nipGuru: string;
  daftarIsiPerangkat: string[];
}

export interface JurnalParams {
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  faseKelas: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  bulan: string;
  namaGuru: string;
  nipGuru: string;
  namaSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kotaKabupaten: string;
}

export interface JurnalMateriItem {
  id: string;
  no: number;
  hariTanggal: string;
  jamKe: string;
  materiPokokTP: string;
  kegiatanKBM: string;
  asesmen: string;
  status: 'akan_diajarkan' | 'sudah_diajarkan';
  refleksi: string;
}

export interface SavedModul {
  id: string;
  title: string;
  subject: string;
  faseKelas: string;
  docType: DocumentType;
  jenjang?: 'SD' | 'SMP' | 'SMA' | 'SMK';
  model?: string;
  markdownContent: string;
  createdAt: string;
  updatedAt: string;
  schoolInfo?: Partial<SchoolTeacherProfile>;
}

export interface PresetItem {
  id: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  label: string;
  mataPelajaran: string;
  faseKelas: string;
  topikMateri: string;
  alokasiWaktu: string;
  modelPembelajaran: string;
  profilPancasila: string[];
  deskripsi: string;
}

export interface UserSubscription {
  planType: 'FREE' | 'GURU_PRO' | 'SEKOLAH';
  planName: string;
  licenseKey?: string;
  activatedAt?: string;
  expiresAt?: string;
  isLifetime?: boolean;
  schoolName?: string;
}

export type TeacherLevel = 'SD' | 'SMP';

export type UserStatusAktivasi = 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_PERSETUJUAN' | 'AKTIF' | 'NONAKTIF';
export type PaketLangganan = 'SEMESTER' | 'TAHUNAN';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'GURU_SD' | 'GURU_SMP';
  teacherLevel: TeacherLevel;
  nip?: string;
  nuptk?: string;
  kelasYangDiajar: string;
  faseTerkunci: string;
  namaSekolah?: string;
  npsn?: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
  kelasDiampu?: string;
  mataPelajaran?: string;
  loginMethod?: 'GOOGLE' | 'EMAIL' | 'DEMO' | 'ADMIN';
  createdAt: string;

  // Status Aktivasi & Pembayaran
  statusAktivasi?: UserStatusAktivasi;
  paketDipilih?: PaketLangganan;
  hargaPaket?: number;
  nomorWA?: string;
  buktiTransferUrl?: string;
  tanggalTransfer?: string;
  tanggalAktivasi?: string;
  isAdmin?: boolean;
}

