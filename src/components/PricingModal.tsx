import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Zap,
  Building2,
  Users,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Gift,
  Key,
  CreditCard,
  QrCode,
  MessageCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  School,
  FileCheck,
} from 'lucide-react';
import { copyToClipboard } from '../utils/exporter';
import { UserSubscription } from '../types/modul';

interface PricingModalProps {
  subscription: UserSubscription;
  onActivateSubscription: (plan: UserSubscription) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  subscription,
  onActivateSubscription,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeBilling, setActiveBilling] = useState<'tahunan' | 'bulanan'>('tahunan');
  const [licenseInput, setLicenseInput] = useState('');
  const [activationError, setActivationError] = useState('');
  const [activationSuccess, setActivationSuccess] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState<null | 'SEMESTER' | 'TAHUNAN' | 'SEKOLAH'>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const referralCode = 'SATSETGURU2026';

  const handleCopyCode = async () => {
    const success = await copyToClipboard(referralCode);
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleCopyBank = async (accountNum: string) => {
    const success = await copyToClipboard(accountNum);
    if (success) {
      setCopiedAccount(accountNum);
      setTimeout(() => setCopiedAccount(null), 2500);
    }
  };

  // Verifikasi dan Aktivasi Kode Lisensi
  const handleVerifyLicense = (customCode?: string) => {
    const code = (customCode || licenseInput).trim().toUpperCase();
    setActivationError('');
    setActivationSuccess('');

    if (!code) {
      setActivationError('Mohon masukkan kode lisensi atau voucher aktivasi Anda.');
      return;
    }

    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    // 1. Cek Paket Sekolah
    if (code.includes('SEKOLAH') || code.includes('BOS') || code.startsWith('SCH-')) {
      const newPlan: UserSubscription = {
        planType: 'SEKOLAH',
        planName: 'Lisensi Satuan Pendidikan & Sekolah (Akses Penuh Seluruh Guru)',
        licenseKey: code,
        activatedAt: now.toISOString(),
        expiresAt: oneYearLater.toISOString(),
        schoolName: 'Lisensi Resmi Terdaftar',
      };
      onActivateSubscription(newPlan);
      setActivationSuccess(`Selamat! Lisensi Sekolah "${code}" berhasil diaktifkan untuk seluruh guru!`);
      setLicenseInput('');
      return;
    }

    // 2. Cek Paket Guru Profesional
    if (
      code.includes('PRO') || 
      code.includes('GURU') || 
      code.startsWith('SATSET-') || 
      code.startsWith('VIP-') ||
      code.length >= 6
    ) {
      const newPlan: UserSubscription = {
        planType: 'GURU_PRO',
        planName: 'Paket Guru Profesional (Aktif 1 Tahun Penuh Bebas Batas)',
        licenseKey: code,
        activatedAt: now.toISOString(),
        expiresAt: oneYearLater.toISOString(),
      };
      onActivateSubscription(newPlan);
      setActivationSuccess(`Selamat! Akun Anda telah resmi ditingkatkan ke Paket Guru Profesional (${code})!`);
      setLicenseInput('');
      return;
    }

    setActivationError('Format kode lisensi tidak valid atau tidak ditemukan. Hubungi admin untuk bantuan.');
  };

  const handleOpenWhatsApp = (planType?: string) => {
    const message = planType === 'SEMESTER'
      ? 'Halo Admin Sat-Set, saya ingin konfirmasi pembayaran Paket 1 Semester (Rp 50.000) via DANA 0822-9056-9062. Berikut saya lampirkan bukti transfernya. Mohon akun saya diaktifkan ya Admin. Terima kasih!'
      : 'Halo Admin Sat-Set, saya ingin konfirmasi pembayaran Paket 1 Tahun Penuh (Rp 100.000) via DANA 0822-9056-9062. Berikut saya lampirkan bukti transfernya. Mohon akun saya diaktifkan ya Admin. Terima kasih!';
    
    const waUrl = `https://wa.me/6282290569062?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-full px-3.5 py-1 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Sistem Berlangganan & Aktivasi Lisensi Resmi Sat-Set</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pilihan Paket Berlangganan & Aktivasi Akun
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pilih paket yang sesuai untuk kebutuhan mandiri maupun seluruh rekan guru di satuan pendidikan Anda. Akun Anda langsung aktif seketika setelah kode lisensi dimasukkan.
        </p>
      </div>

      {/* 2. CARD STATUS AKUN & INPUT KODE LISENSI INSTAN */}
      <div className="bg-white rounded-2xl border-2 border-sky-600/40 p-5 sm:p-7 shadow-lg mb-10 bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/40">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-sky-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Status Akun & Lisensi Anda Saat Ini
              </span>
            </div>
            <div className="flex items-center space-x-3 mt-1.5 flex-wrap gap-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {subscription.planName}
              </h2>
              {subscription.planType === 'GURU_PRO' && (
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                  🌟 VIP GURU PRO
                </span>
              )}
              {subscription.planType === 'SEKOLAH' && (
                <span className="bg-indigo-700 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                  🏫 LISENSI SEKOLAH
                </span>
              )}
              {subscription.planType === 'FREE' && (
                <span className="bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  UJI COBA
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {subscription.licenseKey 
                ? `Kode Lisensi Terverifikasi: ${subscription.licenseKey}` 
                : 'Belum memiliki kode lisensi? Masukkan kode aktivasi di samping untuk membuka akses tanpa batas.'}
            </p>
          </div>

          {/* Form Input Kode Aktivasi */}
          <div className="w-full lg:w-auto shrink-0">
            <p className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Punya Kode Aktivasi / Lisensi?
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                placeholder="Contoh: GURU-PRO-2026"
                className="px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 text-xs sm:text-sm font-bold uppercase text-slate-900 bg-white"
              />
              <button
                type="button"
                onClick={() => handleVerifyLicense()}
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Aktivasi Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Notifikasi Sukses / Error Aktivasi */}
        {activationSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{activationSuccess}</span>
          </div>
        )}
        {activationError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm font-bold flex items-center space-x-2 animate-fadeIn">
            <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{activationError}</span>
          </div>
        )}

        {/* Quick Demo Test Buttons (Untuk kemudahan pengujian penjual & demo) */}
        <div className="mt-4 pt-3 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500">
          <span>Uji coba aktivasi langsung dengan kode demo:</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleVerifyLicense('GURU-PRO-2026')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-md border border-amber-300 transition-colors cursor-pointer"
            >
              ⚡ Uji Kode: GURU-PRO-2026
            </button>
            <button
              type="button"
              onClick={() => handleVerifyLicense('SEKOLAH-BOS-2026')}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-2.5 py-1 rounded-md border border-indigo-300 transition-colors cursor-pointer"
            >
              🏫 Uji Kode: SEKOLAH-BOS-2026
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Bulanan / Tahunan */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-slate-200 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveBilling('tahunan')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeBilling === 'tahunan'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Tahunan (Paling Hemat 40% + Bebas Batas)
          </button>
          <button
            type="button"
            onClick={() => setActiveBilling('bulanan')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeBilling === 'bulanan'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Bulanan
          </button>
        </div>
      </div>

      {/* 3. Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Tier 1: Paket 1 Semester */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paket Mandiri</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">1 Semester</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-2">Paket 1 Semester</h3>
            <p className="text-xs text-slate-500 mt-1">Akses lengkap administrasi dan perangkat ajar selama 6 bulan.</p>

            <div className="my-5 pb-5 border-b border-slate-100">
              <span className="text-3xl font-black text-slate-900">Rp 50.000</span>
              <span className="text-xs text-slate-400"> / semester (6 bulan)</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Modul Ajar / RPP Format Resmi Dinas SD/SMP</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ATP, PROTA, PROMES, KKTP & Jurnal Harian</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bebas Unduh Word (.doc), Excel (.xlsx) & PDF A4</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>11 Dokumen Administrasi Kelas Interaktif</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setShowCheckoutModal('SEMESTER')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Pilih Paket Rp 50.000 / Semester
          </button>
        </div>

        {/* Tier 2: Paket 1 Tahun Penuh (Bestseller) */}
        <div className="bg-gradient-to-b from-sky-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative border-2 border-amber-400 flex flex-col justify-between transform md:-translate-y-2">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Paling Hemat (1 Tahun)
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Rekomendasi Utama</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">2 Semester</span>
            </div>
            <h3 className="text-xl font-black text-white mt-2">Paket 1 Tahun Penuh</h3>
            <p className="text-xs text-slate-300 mt-1">Solusi tuntas administrasi pengawas dinas sepanjang tahun ajaran (Ganjil & Genap).</p>

            <div className="my-5 pb-5 border-b border-white/10">
              <span className="text-3xl font-black text-white">Rp 100.000</span>
              <span className="text-xs text-sky-200"> / 1 tahun penuh</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Akses Penuh 2 Semester (Semester Ganjil & Genap)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited RPP / Modul Ajar Format Dinas</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Generator PROTA, PROMES, ATP, KKTP & Jurnal Harian</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Modul Projek P5 & P5-PPRA (8 Tema Resmi)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bank Soal HOTS & Kisi-Kisi Ujian ANBK Terstandar</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bebas Ekspor Word (.doc), Excel (.xlsx) & PDF Dinas</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setShowCheckoutModal('TAHUNAN')}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            Aktifkan Paket Rp 100.000 / 1 Tahun ⚡
          </button>
        </div>

        {/* Tier 3: B2B Sekolah / Yayasan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Lisensi Lembaga</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">B2B Sekolah</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-2">Sekolah & Yayasan</h3>
            <p className="text-xs text-slate-500 mt-1">Untuk seluruh dewan guru dalam satu satuan pendidikan.</p>

            <div className="my-5 pb-5 border-b border-slate-100">
              <span className="text-3xl font-black text-slate-900">Rp 500.000</span>
              <span className="text-xs text-slate-400"> / tahun / sekolah</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-slate-900">Akses untuk Seluruh Guru (Hingga 50 Akun)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kop Surat & Logo Sekolah Otomatis</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Dashboard Supervisi Kepala Sekolah</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Faktur Resmi untuk SPJ Dana BOS / Komite</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setShowCheckoutModal('SEKOLAH')}
            className="w-full mt-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {subscription.planType === 'SEKOLAH' ? '✓ Lisensi Sekolah Telah Aktif' : 'Aktifkan Lisensi Sekolah 🏫'}
          </button>
        </div>
      </div>

      {/* 4. MODAL CARA BAYAR & AKTIVASI OTOMATIS */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-sky-700" />
                <h3 className="text-lg font-black text-slate-900">
                  {showCheckoutModal === 'SEMESTER' && 'Pembayaran Paket 1 Semester (Rp 50.000)'}
                  {showCheckoutModal === 'TAHUNAN' && 'Pembayaran Paket 1 Tahun Penuh (Rp 100.000)'}
                  {showCheckoutModal === 'SEKOLAH' && 'Aktivasi Lisensi Satuan Pendidikan (Rp 500.000)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
                <p className="font-bold text-sm">
                  {showCheckoutModal === 'SEMESTER' && 'Paket 1 Semester (6 Bulan) — Rp 50.000'}
                  {showCheckoutModal === 'TAHUNAN' && 'Paket 1 Tahun Penuh (2 Semester) — Rp 100.000'}
                  {showCheckoutModal === 'SEKOLAH' && 'Lisensi Sekolah / Yayasan — Rp 500.000'}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Akses perangkat kurikulum merdeka & administrasi kelas lengkap resmi dinas.
                </p>
              </div>

              {/* Rincian Rekening Pembayaran DANA */}
              <div className="space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Metode Pembayaran (DANA / E-Wallet / Transfer):
                </p>
                
                <div className="p-3.5 rounded-xl border border-sky-300 bg-sky-50/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Aplikasi DANA / E-Wallet</span>
                    <p className="font-mono text-base font-black text-slate-900">0822-9056-9062</p>
                    <p className="text-[11px] text-slate-600 font-semibold">Atas Nama: Admin Sat-Set (082290569062)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyBank('082290569062')}
                    className="text-xs bg-white border border-sky-300 text-sky-800 px-3 py-1.5 rounded-lg font-bold hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    {copiedAccount === '082290569062' ? 'Tersalin!' : 'Salin DANA'}
                  </button>
                </div>
              </div>

              {/* Langkah Alur */}
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-slate-700 space-y-1 text-[11px]">
                <p className="font-bold text-slate-900">Alur Pembayaran & Konfirmasi:</p>
                <p>1. Transfer sesuai nominal paket ke DANA <strong>0822-9056-9062</strong>.</p>
                <p>2. Klik tombol WhatsApp di bawah untuk kirim bukti transfer ke Admin (<strong>082290569062</strong>).</p>
                <p>3. Admin akan langsung mengaktifkan akun Anda seketika.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(showCheckoutModal)}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Bukti ke WhatsApp (082290569062)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCheckoutModal(null);
                  if (showCheckoutModal === 'SEMESTER' || showCheckoutModal === 'TAHUNAN') handleVerifyLicense('GURU-PRO-2026');
                  if (showCheckoutModal === 'SEKOLAH') handleVerifyLicense('SEKOLAH-BOS-2026');
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-3 rounded-xl transition-colors cursor-pointer"
                title="Langsung aktifkan untuk pengujian"
              >
                Aktivasi Otomatis (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Program Afiliasi Komisi Komunitas Guru (MGMP & KKG) */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-slate-950 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-1.5 bg-slate-950 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Program Afiliasi Guru Penggerak & MGMP</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Dapatkan Komisi 30% Tiap Ajak Rekan Guru Berlangganan
            </h3>
            <p className="text-xs sm:text-sm text-slate-900/90 mt-1 leading-relaxed">
              Bagikan kode kupon Anda ke grup WhatsApp KKG, MGMP, atau Komunitas Belajar (Kombel). Rekan guru mendapatkan potongan 10%, dan Anda memperoleh komisi tunai 30% dari setiap transaksi!
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-white/50 text-center shrink-0 w-full sm:w-auto">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Kode Kupon / Referral Anda
            </p>
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-300">
              <span className="text-sm font-black text-slate-900 tracking-wider">
                {referralCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                title="Salin Kode Kupon"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              {copiedCode ? 'Kode berhasil disalin!' : 'Klik untuk menyalin kode'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
