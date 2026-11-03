import React, { useState, useMemo } from 'react';
import {
  Printer,
  FileDown,
  Copy,
  Check,
  Edit3,
  Eye,
  Sparkles,
  Zap,
  RefreshCw,
  Send,
  Layers,
  ShieldCheck,
  Building2,
  FileText,
  Award,
  BookOpen,
  FileSpreadsheet,
} from 'lucide-react';
import { marked } from 'marked';
import {
  exportToWordDoc,
  exportToExcel,
  triggerPrint,
  copyToClipboard,
  stripMessyMarkdownSignatures,
  stripDuplicateHeaders,
} from '../utils/exporter';
import { SavedModul, SchoolTeacherProfile } from '../types/modul';

interface DocumentViewerProps {
  currentModul: SavedModul | null;
  onUpdateModul: (updatedContent: string) => void;
  onRefineModul: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onNewModul: () => void;
  schoolProfile?: SchoolTeacherProfile;
  onOpenProfile?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  currentModul,
  onUpdateModul,
  onRefineModul,
  isRefining,
  onNewModul,
  schoolProfile,
  onOpenProfile,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableText, setEditableText] = useState(currentModul?.markdownContent || '');
  const [copied, setCopied] = useState(false);
  const [highlightDiferensiasi, setHighlightDiferensiasi] = useState(true);
  const [highlight4C, setHighlight4C] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');

  // Keep editableText in sync with currentModul
  React.useEffect(() => {
    if (currentModul?.markdownContent) {
      setEditableText(currentModul.markdownContent);
    }
  }, [currentModul?.markdownContent]);

  // Configure marked parser with highlights
  const renderedHtml = useMemo(() => {
    if (!editableText) return '';

    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    let processedText = stripMessyMarkdownSignatures(editableText);
    processedText = stripDuplicateHeaders(processedText, currentModul?.docType);

    // Apply smart badges/highlights for Diferensiasi if enabled
    if (highlightDiferensiasi) {
      processedText = processedText
        .replace(
          /(Diferensiasi Konten)/gi,
          `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">⚡ $1</span>`
        )
        .replace(
          /(Diferensiasi Proses)/gi,
          `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">🔄 $1</span>`
        )
        .replace(
          /(Diferensiasi Produk)/gi,
          `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">📦 $1</span>`
        );
    }

    // Apply smart badges for 4C & Profil Pelajar Pancasila if enabled
    if (highlight4C) {
      processedText = processedText
        .replace(
          /\[(4C:[^\]]+)\]/gi,
          `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-xs mr-1">$1</span>`
        )
        .replace(
          /\[(Profil Pelajar Pancasila:[^\]]+)\]/gi,
          `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 shadow-xs mr-1">$1</span>`
        );
    }

    return marked.parse(processedText) as string;
  }, [editableText, highlightDiferensiasi, highlight4C, currentModul?.docType]);

  const handleCopy = async () => {
    const success = await copyToClipboard(editableText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportWord = () => {
    if (!currentModul) return;
    exportToWordDoc(
      `${currentModul.docType}_${currentModul.subject || 'MataPelajaran'}_${currentModul.title}`,
      editableText,
      {
        ...activeProfile,
        docType: currentModul.docType,
        faseKelas: schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1',
        mataPelajaran: currentModul.subject || schoolProfile?.mataPelajaranGuru || 'Bahasa Indonesia',
        semester: currentModul.model || 'Genap',
        tahunAjaran: '2024/2025',
      }
    );
  };

  const handleExportExcel = () => {
    if (!currentModul) return;
    exportToExcel(
      `${currentModul.docType}_${currentModul.subject || 'MataPelajaran'}_${currentModul.title}`,
      editableText,
      {
        ...activeProfile,
        docType: currentModul.docType,
        faseKelas: schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1',
        mataPelajaran: currentModul.subject || schoolProfile?.mataPelajaranGuru || 'Bahasa Indonesia',
        semester: currentModul.model || 'Genap',
        tahunAjaran: '2024/2025',
      }
    );
  };

  const handleSaveEdit = () => {
    onUpdateModul(editableText);
    setIsEditMode(false);
  };

  const handleQuickRefine = (instruction: string) => {
    onRefineModul(instruction);
  };

  const handleCustomRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onRefineModul(customPrompt);
    setCustomPrompt('');
  };

  if (!currentModul) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
          <Edit3 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Belum Ada Modul Ajar Aktif</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Silakan gunakan formulir generator Sat-Set untuk membuat RPP / Modul Ajar format dinas baru, atau pilih dari arsip.
        </p>
        <button
          onClick={onNewModul}
          className="mt-6 inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Buat Modul Ajar Baru</span>
        </button>
      </div>
    );
  }

  const activeProfile = schoolProfile || currentModul.schoolInfo;
  const school = activeProfile?.namaSekolah || 'SMP NEGERI 1 NUSANTARA';
  const npsn = activeProfile?.npsn || '20101234';
  const alamat = activeProfile?.alamatSekolah || 'Jalan Pendidikan No. 45';
  const dinas = activeProfile?.dinasPendidikan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';
  const cabang = activeProfile?.cabangDinas || '';
  const kota = activeProfile?.kotaKabupaten || 'Jakarta';
  const guru = activeProfile?.namaGuru || 'Fadli R., S.Pd., Gr.';
  const nipGuru = activeProfile?.nipGuru ? `NIP. ${activeProfile.nipGuru}` : 'NIP. ........................................';
  const kepsek = activeProfile?.kepalaSekolah || 'Dr. H. Sulaiman, M.Pd.';
  const nipKepsek = activeProfile?.nipKepalaSekolah ? `NIP. ${activeProfile.nipKepalaSekolah}` : 'NIP. ........................................';
  const pengawas = activeProfile?.pengawasSekolah || 'Dr. H. Subagyo, M.Pd.';
  const nipPengawas = activeProfile?.nipPengawas ? `NIP. ${activeProfile.nipPengawas}` : 'NIP. ........................................';

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Document Action Toolbar (Sticky on screen, hidden on print) */}
      <div className="no-print bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm sticky top-16 sm:top-20 z-30 mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode View/Edit & Quick Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setIsEditMode(false)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                !isEditMode ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tampilan Cetak Dinas</span>
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isEditMode ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Markdown</span>
            </button>
          </div>

          {!isEditMode && (
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200 text-xs">
              <button
                onClick={() => setHighlightDiferensiasi(!highlightDiferensiasi)}
                title="Sorot elemen diferensiasi konten & proses"
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md border font-medium transition-all cursor-pointer ${
                  highlightDiferensiasi
                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Sorot Diferensiasi</span>
              </button>

              <button
                onClick={() => setHighlight4C(!highlight4C)}
                title="Sorot indikator 4C & Dimensi Pancasila"
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md border font-medium transition-all cursor-pointer ${
                  highlight4C
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Badge 4C</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Export & Print Actions */}
        <div className="flex items-center space-x-2">
          {isEditMode ? (
            <button
              onClick={handleSaveEdit}
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                title="Salin isi dokumen ke clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>

              {/* Unduh Excel (.xlsx) khusus PROMES, PROTA, ATP, KKTP, & JURNAL */}
              {['PROMES', 'PROTA', 'ATP', 'KKTP', 'JURNAL'].includes(currentModul.docType) && (
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                  title="Unduh tabel matriks dalam format Microsoft Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              )}

              <button
                type="button"
                onClick={triggerPrint}
                className="flex items-center space-x-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Unduh / Simpan dokumen dalam format PDF atau cetak ke kertas A4"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Unduh PDF / Cetak</span>
              </button>

              <button
                type="button"
                onClick={handleExportWord}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Unduh format dokumen Microsoft Word (.doc) lengkap dengan Kop Dinas & Lembar Pengesahan"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Unduh Word Dinas (.doc)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Document Preview (Print-Ready Container) */}
      <div className="print-document-container bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-12 mb-8 transition-all">
        {isEditMode ? (
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Editor Teks Markdown Format Dinas
              </span>
              <span className="text-xs text-slate-400">
                Gunakan format Markdown untuk heading (#), tabel (|), dan bullet list (-)
              </span>
            </div>
            <textarea
              rows={35}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full font-serif text-xs sm:text-sm p-4 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-slate-50 text-slate-800 leading-relaxed resize-y"
            />
          </div>
        ) : (
          <div>
            {/* NO-PRINT SHORTCUT BAR: DATA SEKOLAH & TANDA TANGAN */}
            <div className="no-print bg-sky-50/70 border border-sky-200 rounded-lg px-3.5 py-2 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700 truncate">
                <Building2 className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="truncate">
                  Kop Surat & Lembar Pengesahan: <strong className="text-slate-900">{school}</strong> (Guru: {guru} | Kepsek: {kepsek})
                </span>
              </div>
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="inline-flex items-center space-x-1 text-sky-800 hover:text-sky-950 font-bold underline shrink-0 cursor-pointer"
                >
                  <span>Ubah Data Sekolah & Tanda Tangan</span>
                </button>
              )}
            </div>

            {/* KOP ATAU JUDUL DOKUMEN SESUAI FORMAT */}
            {currentModul?.docType === 'SAMPUL' ? (
              <div className="max-w-2xl mx-auto border-4 border-double border-blue-900 bg-white p-8 sm:p-12 text-center rounded-lg shadow-sm relative">
                {/* Logo Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      MM
                    </div>
                    <div className="leading-tight text-[10px] font-sans font-bold text-slate-800">
                      Merdeka<br />Mengajar
                    </div>
                  </div>

                  {/* Logo Tut Wuri Handayani Center */}
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center bg-blue-50 shadow-inner">
                    <div className="w-12 h-12 rounded-full bg-sky-600 border border-white flex items-center justify-center text-white font-serif font-black text-sm">
                      🎓
                    </div>
                  </div>

                  <div className="w-16"></div>
                </div>

                <p className="font-bold text-xs uppercase tracking-wider text-blue-900 font-sans">
                  KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
                </p>
                <h3 className="font-bold text-xs uppercase tracking-wide text-slate-800 mt-1 font-sans">
                  {dinas}
                </h3>
                <h2 className="font-extrabold text-base uppercase tracking-wide text-slate-950 mt-1 font-sans">
                  {school}
                </h2>

                <div className="my-8">
                  <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-950 leading-tight font-sans">
                    PERANGKAT PEMBELAJARAN<br />KURIKULUM MERDEKA
                  </h1>
                  <p className="font-bold text-base text-blue-800 mt-3 font-sans">
                    Kelas {schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1'}
                  </p>
                </div>

                {/* Teacher Identity */}
                <div className="text-left font-mono text-xs sm:text-sm max-w-sm mx-auto space-y-1 mb-6 font-semibold text-slate-900 border-t border-b border-slate-300 py-3">
                  <p>Nama Guru : {guru}</p>
                  <p>NIP &nbsp; &nbsp; &nbsp; : {nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
                </div>

                {/* Checklist Box */}
                <div className="border-2 border-slate-900 p-4 max-w-sm mx-auto text-left text-xs font-sans space-y-2 bg-slate-50/70">
                  <p className="font-bold uppercase tracking-wider text-[11px] text-slate-700 border-b border-slate-300 pb-1 mb-2">
                    Daftar Berkas Perangkat:
                  </p>
                  {[
                    'Kalender Pendidikan',
                    'Modul Ajar (MA)',
                    'Alur Tujuan Pembelajaran (ATP)',
                    'Program Semester (PROSEM)',
                    'Program Tahunan (PROTA)',
                    'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-blue-700 font-bold">✎</span>
                      <span className="text-slate-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-700 font-bold mt-8 uppercase tracking-widest font-sans">
                  Tahun Pelajaran 2024/2025
                </p>
              </div>
            ) : currentModul?.docType === 'PROTA' ? (
              <div className="mb-6">
                <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-base sm:text-lg tracking-wider uppercase bg-white">
                  PROGRAM TAHUNAN (PROTA)
                </div>
                <div className="mt-3 text-left font-bold text-xs sm:text-sm text-slate-900 space-y-1">
                  <p>Kelas &nbsp;: {schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1'}</p>
                  <p>Mapel : {currentModul.subject || schoolProfile?.mataPelajaranGuru || 'Bahasa Indonesia'}</p>
                </div>
              </div>
            ) : currentModul?.docType === 'PROMES' ? (
              <div className="mb-6">
                <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-base sm:text-lg tracking-wider uppercase bg-white">
                  PROGRAM SEMESTER (PROSEM)
                </div>
                <div className="mt-3 text-left font-bold text-xs sm:text-sm text-slate-900 space-y-1">
                  <p>Kelas &nbsp;: {schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1'}</p>
                  <p>Mapel : {(currentModul.subject || schoolProfile?.mataPelajaranGuru || 'PKN').toUpperCase()}</p>
                </div>
              </div>
            ) : currentModul?.docType === 'ATP' ? (
              <div className="mb-6">
                <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-base sm:text-lg tracking-wider uppercase bg-white">
                  ALUR TUJUAN PEMBELAJARAN (ATP)
                </div>
                <div className="mt-3 text-left font-mono text-xs sm:text-sm text-slate-900 space-y-1 font-semibold">
                  <div className="grid grid-cols-12 gap-2">
                    <span className="col-span-4 sm:col-span-3">Nama Penyusun</span>
                    <span className="col-span-8 sm:col-span-9">: {guru}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <span className="col-span-4 sm:col-span-3">NIP</span>
                    <span className="col-span-8 sm:col-span-9">: {nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <span className="col-span-4 sm:col-span-3">Kelas</span>
                    <span className="col-span-8 sm:col-span-9">: {schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1'}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <span className="col-span-4 sm:col-span-3">Mata Pelajaran</span>
                    <span className="col-span-8 sm:col-span-9">: {currentModul.subject || schoolProfile?.mataPelajaranGuru || 'Pendidikan Pancasila'}</span>
                  </div>
                </div>
              </div>
            ) : currentModul?.docType === 'KKTP' ? (
              <div className="mb-6">
                <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-base sm:text-lg tracking-wider uppercase bg-white">
                  KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN)
                </div>
                <div className="mt-3 text-left font-mono text-xs sm:text-sm text-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold">
                  <div>
                    <p>Nama Sekolah : {school}</p>
                    <p>Kelas &nbsp; &nbsp; &nbsp; &nbsp;: {schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1'}</p>
                  </div>
                  <div>
                    <p>Semester &nbsp; &nbsp; &nbsp; &nbsp;: {currentModul.model || 'Genap'}</p>
                    <p>Tahun Pelajaran : 2024/2025</p>
                  </div>
                </div>
              </div>
            ) : currentModul?.docType === 'JURNAL' ? (
              <div className="mb-6">
                <div className="border-2 border-slate-900 text-center py-2 px-4 font-black text-base sm:text-lg tracking-wider uppercase bg-white">
                  JURNAL HARIAN PEMBELAJARAN GURU
                </div>
                <div className="mt-3 text-left font-mono text-xs sm:text-sm text-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold">
                  <div>
                    <p>Nama Sekolah : {school}</p>
                    <p>Mata Pelajaran: {currentModul.subject || schoolProfile?.mataPelajaranGuru || 'Pendidikan Pancasila'}</p>
                    <p>Kelas / Fase : {schoolProfile?.faseKelasDiampu?.replace(/[^0-9IVX]/gi, '').trim() || '1'}</p>
                  </div>
                  <div>
                    <p>Nama Guru &nbsp; &nbsp;: {guru}</p>
                    <p>Semester &nbsp; &nbsp; : {currentModul.model || 'Ganjil'}</p>
                    <p>Tahun Pelajaran: 2024/2025</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center pb-4 mb-6 border-b-2 border-slate-900 relative">
                <div className="border-b border-slate-900 pb-3">
                  <p className="text-xs sm:text-sm uppercase tracking-widest font-bold text-slate-700">
                    PEMERINTAH DAERAH PROVINSI / KABUPATEN / KOTA
                  </p>
                  <h2 className="text-sm sm:text-base font-black uppercase text-slate-900 tracking-wide mt-0.5">
                    {dinas}
                  </h2>
                  {cabang && (
                    <p className="text-xs sm:text-sm font-bold uppercase text-slate-800">
                      {cabang}
                    </p>
                  )}
                  <h1 className="text-lg sm:text-xl font-extrabold uppercase text-slate-900 tracking-tight mt-1">
                    {school}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                    {alamat} | NPSN: {npsn} | Akreditasi: A
                  </p>
                  <p className="text-[10px] italic text-slate-500">
                    Dokumen Administrasi Perangkat Pembelajaran Terakreditasi Standar Dinas Pendidikan
                  </p>
                </div>
              </div>
            )}

            {/* Document Content Rendered from Markdown (Hidden on SAMPUL cover) */}
            {currentModul?.docType !== 'SAMPUL' && (
              <article
                className="document-content text-slate-800 text-sm leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            )}

            {/* LEMBAR PENGESAHAN RESMI DINAS (Dikecualikan untuk SAMPUL, BANK_SOAL, dan SLIDE_AJAR) */}
            {currentModul?.docType === 'SAMPUL' || currentModul?.docType === 'BANK_SOAL' || currentModul?.docType === 'SLIDE_AJAR' ? null : ['PROTA', 'PROMES', 'ATP', 'KKTP', 'JURNAL'].includes(currentModul?.docType) ? (
              <div className="mt-14 pt-4 text-xs sm:text-sm text-slate-900 break-inside-avoid">
                <div className="grid grid-cols-2 gap-16 text-center">
                  <div className="p-2">
                    <p className="font-semibold text-slate-900">Mengetahui</p>
                    <p className="font-bold text-slate-900 mt-0.5">Kepala Sekolah</p>
                    <div className="h-32 sm:h-36"></div>
                    <p className="font-bold underline uppercase text-slate-900 text-sm tracking-wide">{kepsek}</p>
                    <p className="text-slate-800 text-xs font-semibold mt-0.5">NIP : {nipKepsek.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
                  </div>

                  <div className="p-2">
                    <p className="font-bold text-slate-900">{currentModul?.docType === 'ATP' ? 'Guru Kelas / Penyusun' : 'Guru Kelas'}</p>
                    <p className="font-semibold text-slate-900 mt-0.5">&nbsp;</p>
                    <div className="h-32 sm:h-36"></div>
                    <p className="font-bold underline uppercase text-slate-900 text-sm tracking-wide">{guru}</p>
                    <p className="text-slate-800 text-xs font-semibold mt-0.5">NIP : {nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-14 pt-6 border-t-2 border-slate-300 text-xs sm:text-sm text-slate-900 break-inside-avoid">
                <div className="text-right text-xs mb-4 text-slate-700 font-bold">
                  {kota}, {currentDate}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="p-2">
                    <p className="text-xs text-slate-600">Mengetahui,</p>
                    <p className="font-bold text-slate-900 mt-0.5">Kepala {school}</p>
                    <div className="h-28 sm:h-32"></div>
                    <p className="font-bold underline uppercase text-slate-900">{kepsek}</p>
                    <p className="text-slate-600 text-xs">{nipKepsek}</p>
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-slate-600">Diverifikasi oleh:</p>
                    <p className="font-bold text-slate-900 mt-0.5">Pengawas Pembina Dinas</p>
                    <div className="h-28 sm:h-32"></div>
                    <p className="font-bold underline uppercase text-slate-900">{pengawas}</p>
                    <p className="text-slate-600 text-xs">{nipPengawas}</p>
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-slate-600">Disusun oleh:</p>
                    <p className="font-bold text-slate-900 mt-0.5">Guru Mata Pelajaran</p>
                    <div className="h-28 sm:h-32"></div>
                    <p className="font-bold underline uppercase text-slate-900">{guru}</p>
                    <p className="text-slate-600 text-xs">{nipGuru}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating / Bottom Refinement Assistant (Konsultan Edukasi AI Sat-Set) */}
      <div className="no-print bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            Konsultan Supervisi Dinas Sat-Set: Penyesuaian Administrasi RPP
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          Ingin menyesuaikan isi modul ajar agar sesuai catatan pengawas? Pilih opsi cepat di bawah atau tulis permintaan khusus Anda. AI akan memperbarui dokumen secara otomatis.
        </p>

        {/* Quick Refinement Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Lengkapi lembar kisi-kisi dan butir soal asesmen sumatif HOTS beserta rubrik penskoran')}
            className="text-xs bg-white/10 hover:bg-white/20 text-sky-200 border border-sky-400/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            📋 Lengkapi Kisi-Kisi Soal HOTS
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Perjelas program remedial dan pengayaan lengkap dengan kriteria batas KKTP')}
            className="text-xs bg-white/10 hover:bg-white/20 text-sky-200 border border-sky-400/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            🎯 Perkuat Remedial & Pengayaan
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Tambahkan lembar observasi sikap Profil Pelajar Pancasila per siswa')}
            className="text-xs bg-white/10 hover:bg-white/20 text-sky-200 border border-sky-400/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            ⭐ Tambah Ceklis Sikap Pancasila
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Perdalam diferensiasi proses dan sediakan pertanyaan penuntun pada lembar LKPD')}
            className="text-xs bg-white/10 hover:bg-white/20 text-sky-200 border border-sky-400/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            🛠️ Pertajam Instruksi LKPD
          </button>
        </div>

        {/* Custom Prompt Bar */}
        <form onSubmit={handleCustomRefineSubmit} className="flex gap-2">
          <input
            type="text"
            disabled={isRefining}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ketik instruksi perbaikan dinas (misal: 'Tambahkan studi kasus lokal', 'Ganti ke model PjBL')..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            type="submit"
            disabled={isRefining || !customPrompt.trim()}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 shadow-md"
          >
            {isRefining ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isRefining ? 'Memproses...' : 'Terapkan'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
