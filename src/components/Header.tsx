import React from 'react';
import { Zap, BookOpen, FileText, History, HelpCircle, Sparkles, Printer, UserCheck, RefreshCw, LogIn, BookMarked } from 'lucide-react';
import { UserAccount } from '../types/modul';

interface HeaderProps {
  activeTab: 'generator' | 'viewer' | 'history';
  setActiveTab: (tab: 'generator' | 'viewer' | 'history') => void;
  onOpenGuideline: () => void;
  savedCount: number;
  hasActiveModul: boolean;
  onQuickPrint?: () => void;
  currentUser?: UserAccount;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuideline,
  savedCount,
  hasActiveModul,
  onQuickPrint,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-sky-700 via-indigo-700 to-blue-800 bg-clip-text text-transparent">
                  Sat-Set
                </span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Generator Modul Ajar & RPP Profesional Siap Cetak
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'generator'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Buat Baru</span>
            </button>

            <button
              onClick={() => setActiveTab('viewer')}
              disabled={!hasActiveModul}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                !hasActiveModul
                  ? 'text-slate-300 cursor-not-allowed'
                  : activeTab === 'viewer'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Lihat Dokumen</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4 text-indigo-500" />
              <span>Arsip</span>
              {savedCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenGuideline}
              title="Buku Petunjuk Aplikasi & Panduan Solusi Kesulitan"
              className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <BookMarked className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline font-semibold">Buku Petunjuk</span>
            </button>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ml-1 border cursor-pointer ${
                  currentUser?.isLoggedIn
                    ? currentUser.teacherLevel === 'SD'
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                }`}
                title="Kelola Akun Guru & Jenjang"
              >
                {currentUser?.isLoggedIn ? (
                  <>
                    <span className="text-sm">
                      {currentUser.teacherLevel === 'SD' ? '🎒' : '📐'}
                    </span>
                    <div className="text-left hidden sm:block">
                      <div className="leading-tight">
                        Guru {currentUser.teacherLevel}
                      </div>
                      <div className="text-[9px] font-normal opacity-80 truncate max-w-[100px]">
                        {currentUser.name}
                      </div>
                    </div>
                    <RefreshCw className="w-3 h-3 ml-0.5 opacity-60" />
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk Akun</span>
                  </>
                )}
              </button>
            )}

            {hasActiveModul && onQuickPrint && (
              <button
                onClick={onQuickPrint}
                className="hidden lg:flex items-center space-x-1.5 ml-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak A4</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
