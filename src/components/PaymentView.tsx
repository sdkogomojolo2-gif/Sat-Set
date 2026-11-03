import React, { useState } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  Upload,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Sparkles,
  ArrowRight,
  School,
  FileCheck2,
  Image as ImageIcon,
  KeyRound,
} from 'lucide-react';
import { UserAccount, PaketLangganan } from '../types/modul';
import { copyToClipboard } from '../utils/exporter';

interface PaymentViewProps {
  currentUser: UserAccount;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
}

const REGISTERED_USERS_KEY = 'satset_registered_teachers_v2';
const DANA_NUMBER = '082290569062';
const DANA_NUMBER_FORMATTED = '0822-9056-9062';
const ADMIN_WA_NUMBER = '6282290569062';

export const PaymentView: React.FC<PaymentViewProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenAdminPanel,
}) => {
  // Pilihan Paket: 'SEMESTER' (Rp 50.000) atau 'TAHUNAN' (Rp 100.000)
  const [selectedPlan, setSelectedPlan] = useState<PaketLangganan>(
    currentUser.paketDipilih || 'SEMESTER'
  );

  // Unggah foto bukti transfer (base64 string)
  const [buktiTransferPreview, setBuktiTransferPreview] = useState<string>(
    currentUser.buktiTransferUrl || ''
  );
  const [nomorWA, setNomorWA] = useState<string>(
    currentUser.nomorWA || ''
  );
  const [copiedDana, setCopiedDana] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Kode Aktivasi Instan (jika Admin memberi kode voucher)
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const harga = selectedPlan === 'SEMESTER' ? 50000 : 100000;
  const labelPaket = selectedPlan === 'SEMESTER' ? 'Paket 1 Semester (6 Bulan)' : 'Paket 1 Tahun Penuh (2 Semester)';

  const handleCopyDana = async () => {
    const success = await copyToClipboard(DANA_NUMBER);
    if (success) {
      setCopiedDana(true);
      setTimeout(() => setCopiedDana(false), 2500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorToast('Mohon pilih file gambar bukti transfer (JPG / PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorToast('Ukuran gambar terlalu besar (maksimal 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setBuktiTransferPreview(base64);
      setErrorToast('');
    };
    reader.readAsDataURL(file);
  };

  // Simpan data konfirmasi ke user akun dan list registered di localStorage
  const handleSavePaymentConfirmation = () => {
    setIsSaving(true);
    setErrorToast('');
    setSuccessToast('');

    const updated: UserAccount = {
      ...currentUser,
      statusAktivasi: 'MENUNGGU_PERSETUJUAN',
      paketDipilih: selectedPlan,
      hargaPaket: harga,
      nomorWA: nomorWA.trim() || currentUser.nomorWA,
      buktiTransferUrl: buktiTransferPreview,
      tanggalTransfer: new Date().toISOString(),
    };

    try {
      // Update data di localStorage registered users
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      if (raw) {
        const list: UserAccount[] = JSON.parse(raw);
        const updatedList = list.map((u) => (u.id === updated.id ? updated : u));
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error(e);
    }

    onUpdateUser(updated);
    setIsSaving(false);
    setSuccessToast('Bukti transfer berhasil disimpan! Silakan klik tombol hijau untuk mengirim konfirmasi langsung ke WhatsApp Admin.');
  };

  // Buka WhatsApp Otomatis ke nomor 082290569062
  const handleSendWhatsApp = () => {
    // Pastikan tersimpan dulu
    handleSavePaymentConfirmation();

    const text = `Halo Admin Sat-Set, saya telah mendaftar dan melakukan transfer pembayaran DANA untuk aktivasi akun:
• Nama Guru : ${currentUser.name}
• Email Akun : ${currentUser.email}
• Jenjang : Guru ${currentUser.teacherLevel} (${currentUser.kelasYangDiajar})
• Paket Dipilih : ${labelPaket} - Rp ${harga.toLocaleString('id-ID')}
• Metode Pembayaran : DANA (${DANA_NUMBER_FORMATTED})
• Nomor WA Saya : ${nomorWA || '-'}

Bukti transfer telah saya unggah di aplikasi dan saya lampirkan juga di pesan ini. Mohon akun saya segera diaktifkan ya Admin. Terima kasih banyak!`;

    const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Verifikasi Kode Lisensi Langsung
  const handleVerifyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (
      code === 'ADMIN' ||
      code === 'HANIN231221' ||
      code === 'SATSET50' ||
      code === 'SATSET100' ||
      code.startsWith('VIP') ||
      code.startsWith('PRO')
    ) {
      const updated: UserAccount = {
        ...currentUser,
        statusAktivasi: 'AKTIF',
        paketDipilih: selectedPlan,
        hargaPaket: harga,
        tanggalAktivasi: new Date().toISOString(),
      };
      // update storage
      try {
        const raw = localStorage.getItem(REGISTERED_USERS_KEY);
        if (raw) {
          const list: UserAccount[] = JSON.parse(raw);
          const updatedList = list.map((u) => (u.id === updated.id ? updated : u));
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));
        }
      } catch (err) {}
      onUpdateUser(updated);
    } else {
      setErrorToast('Kode aktivasi / voucher tidak valid.');
    }
  };

  const isMenungguPersetujuan = currentUser.statusAktivasi === 'MENUNGGU_PERSETUJUAN';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-slate-950 shadow-md">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
              Sat-Set <span className="text-amber-400">Kurikulum Merdeka</span>
            </h1>
            <p className="text-[11px] text-slate-400">Portal Aktivasi & Pembayaran Akun Guru</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Khusus Pemilik Aplikasi (Admin)"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Panel Admin</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 my-auto">
        {/* Welcome Greeting & Status Card */}
        <div className="bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full px-3 py-0.5 text-xs text-amber-300 font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pendaftaran Guru Berhasil</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Selamat Datang, Bapak/Ibu {currentUser.name}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Akun Anda telah terdaftar sebagai <strong>Guru {currentUser.teacherLevel}</strong> ({currentUser.kelasYangDiajar}). Selesaikan aktivasi paket untuk membuka seluruh fitur generator RPP, ATP, PROTA, PROMES, KKTP, Jurnal, dan Administrasi Kelas.
              </p>
            </div>

            {/* Status Badge */}
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Status Akun Saat Ini:
              </span>
              {isMenungguPersetujuan ? (
                <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Menunggu Verifikasi Admin</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/40 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Menunggu Pembayaran</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section: Pilih Paket Langganan */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
            <span>1. Pilih Paket Layanan Guru Sat-Set</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paket 1: Rp 50.000 / Semester */}
            <div
              onClick={() => setSelectedPlan('SEMESTER')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'SEMESTER'
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                  : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Paket 1 Semester
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    Rp 50.000 <span className="text-xs text-slate-400 font-normal">/ semester (6 bulan)</span>
                  </h4>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'SEMESTER'
                      ? 'border-amber-400 bg-amber-400 text-slate-950 font-black'
                      : 'border-slate-600'
                  }`}
                >
                  {selectedPlan === 'SEMESTER' && <Check className="w-4 h-4" />}
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Akses Penuh RPP / Modul Ajar Dinas SD/SMP</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Perangkat Lengkap: ATP, Prota, Promes, KKTP, Jurnal</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bebas Unduh Word Dinas (.doc) & Excel (.xlsx)</span>
                </li>
              </ul>
            </div>

            {/* Paket 2: Rp 100.000 / 1 Tahun Penuh */}
            <div
              onClick={() => setSelectedPlan('TAHUNAN')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'TAHUNAN'
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                  : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                Paling Hemat (1 Tahun)
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Paket 1 Tahun Ajaran Penuh
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    Rp 100.000 <span className="text-xs text-slate-400 font-normal">/ 1 tahun (2 semester)</span>
                  </h4>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'TAHUNAN'
                      ? 'border-amber-400 bg-amber-400 text-slate-950 font-black'
                      : 'border-slate-600'
                  }`}
                >
                  {selectedPlan === 'TAHUNAN' && <Check className="w-4 h-4" />}
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Semua Fitur Paket Semester (Semester Ganjil & Genap)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bank Soal HOTS, Kisi-kisi ANBK, & Modul Projek P5</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Akses Penuh Seluruh Administrasi Kelas (11 Dokumen)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section: Metode Pembayaran DANA */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-xl mb-8 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <span>2. Transfer Pembayaran Melalui DANA</span>
          </h3>

          <div className="bg-gradient-to-r from-sky-950/80 via-blue-900/60 to-slate-900 border border-sky-500/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                D
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block">
                  Aplikasi DANA / E-Wallet / Transfer
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider">
                  {DANA_NUMBER_FORMATTED}
                </span>
                <span className="text-xs text-slate-300 block mt-0.5">
                  Atas Nama: <strong>Admin Sat-Set ({DANA_NUMBER})</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyDana}
              className="inline-flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer shrink-0"
            >
              {copiedDana ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Nomor DANA Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Nomor DANA</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
            <span>Nominal Transfer Yang Dibayarkan:</span>
            <span className="text-base font-black text-amber-400">
              Rp {harga.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Section: Upload Bukti Transfer & WhatsApp Notification */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-xl mb-8 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <span>3. Unggah Foto Bukti Transfer & Kirim Konfirmasi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nomor WhatsApp Anda (Untuk Notifikasi Akun)
              </label>
              <input
                type="text"
                placeholder="Contoh: 081234567890"
                value={nomorWA}
                onChange={(e) => setNomorWA(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Pilih Foto Bukti Transfer (Screenshot / Struk DANA)
              </label>
              <label className="flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-amber-400 text-xs text-slate-300 font-semibold cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Pilih Foto dari Galeri / Dokumen</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Pratinjau Foto Bukti Transfer */}
          {buktiTransferPreview ? (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                <img
                  src={buktiTransferPreview}
                  alt="Bukti Transfer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Foto Bukti Transfer Siap Dikirim</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Foto bukti transfer telah terpasang. Klik tombol WhatsApp di bawah untuk membuka chat dan mengirim bukti langsung ke nomor Admin (<strong>082290569062</strong>).
                </p>
                <button
                  type="button"
                  onClick={() => setBuktiTransferPreview('')}
                  className="text-rose-400 hover:text-rose-300 underline font-semibold text-[11px] cursor-pointer"
                >
                  Hapus / Ganti Foto
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-600" />
              <span>Belum ada foto bukti transfer yang diunggah. Silakan unggah screenshot transfer Anda.</span>
            </div>
          )}

          {errorToast && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorToast}</span>
            </div>
          )}

          {successToast && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 text-xs sm:text-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Kirim Konfirmasi & Bukti ke WhatsApp (082290569062)</span>
            </button>

            <button
              type="button"
              onClick={handleSavePaymentConfirmation}
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-5 py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfirmasi'}</span>
            </button>
          </div>
        </div>

        {/* Kode Aktivasi Cepat / Voucher Admin */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowVoucherInput(!showVoucherInput)}
            className="text-xs text-slate-400 hover:text-amber-400 font-semibold underline transition-colors cursor-pointer"
          >
            Punya Kode Aktivasi / Lisensi dari Admin? Klik di sini
          </button>

          {showVoucherInput && (
            <form onSubmit={handleVerifyVoucher} className="mt-3 max-w-sm mx-auto flex items-center space-x-2">
              <input
                type="text"
                placeholder="Masukkan Kode Lisensi"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white uppercase tracking-wider focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs cursor-pointer"
              >
                Aktivasi
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Sat-Set Kurikulum Merdeka • Layanan Administrasi Guru Indonesia • WhatsApp: 0822-9056-9062</p>
      </footer>
    </div>
  );
};
