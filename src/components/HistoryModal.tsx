import React, { useState } from 'react';
import {
  FileText,
  Trash2,
  Download,
  Calendar,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SavedModul } from '../types/modul';
import { exportToWordDoc } from '../utils/exporter';

interface HistoryModalProps {
  savedModuls: SavedModul[];
  onSelectModul: (modul: SavedModul) => void;
  onDeleteModul: (id: string) => void;
  onNewModul: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  savedModuls,
  onSelectModul,
  onDeleteModul,
  onNewModul,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedModuls.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.faseKelas.toLowerCase().includes(q) ||
      (m.model && m.model.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-sky-600" />
              <span>Arsip Modul Ajar Tersimpan</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Daftar seluruh Modul Ajar dan RPP yang pernah Anda susun dengan Sat-Set di peramban ini.
            </p>
          </div>

          <button
            onClick={onNewModul}
            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs sm:text-sm shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Buat Modul Baru</span>
          </button>
        </div>

        {/* Search input */}
        <div className="mt-5 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan topik, mata pelajaran, fase/kelas, atau model pembelajaran..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* List of Moduls */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                {searchTerm ? 'Tidak ada modul ajar yang cocok dengan kata kunci pencarian.' : 'Belum ada modul ajar tersimpan di arsip.'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan menu &quot;Buat Baru&quot; untuk menyusun modul ajar pertama Anda.
              </p>
            </div>
          ) : (
            filtered.map((modul) => (
              <div
                key={modul.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all gap-4 bg-white"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {modul.subject}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {modul.faseKelas}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {modul.model}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {modul.title}
                  </h3>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(modul.updatedAt || modul.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                    </span>
                    {modul.schoolInfo?.namaSekolah && (
                      <span>• {modul.schoolInfo.namaSekolah}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => exportToWordDoc(modul.title, modul.markdownContent, { ...modul.schoolInfo, docType: modul.docType })}
                    title="Unduh langsung file Word (.doc)"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteModul(modul.id)}
                    title="Hapus dari arsip"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectModul(modul)}
                    className="inline-flex items-center space-x-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
