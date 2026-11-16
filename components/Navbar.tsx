'use client';

import React from 'react';
import { Database, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUploadClick: () => void;
  onSeedDemoClick: () => void;
  liveSyncStatus: 'synced' | 'syncing' | 'error';
  fileCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onUploadClick,
  onSeedDemoClick,
  liveSyncStatus,
  fileCount,
}) => {
  const navItems = [
    { id: 'pipeline', label: 'Agent Pipeline' },
    { id: 'grid', label: 'Data Workspace' },
    { id: 'analytics', label: 'Analytics & Charts' },
    { id: 'report', label: 'Quality & Reports' },
    { id: 'export', label: 'Export Hub' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            RealTime Data AI
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === item.id
                ? 'bg-slate-100 font-semibold text-slate-900 shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Actions & Real-Time Sync Status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          <span className={`h-2 w-2 rounded-full ${
            liveSyncStatus === 'synced'
              ? 'bg-emerald-500'
              : liveSyncStatus === 'syncing'
              ? 'bg-amber-500 animate-pulse'
              : 'bg-rose-500'
          }`} />
          <span className="font-mono text-slate-700">
            {liveSyncStatus === 'synced' ? 'Live Cloud Sync' : 'Syncing...'} ({fileCount} files)
          </span>
        </div>

        <button
          onClick={onSeedDemoClick}
          className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs whitespace-nowrap shrink-0"
          title="Seed sample structured & unstructured datasets"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Seed Demo Files
        </button>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap shrink-0"
        >
          <Layers className="h-4 w-4" />
          Upload File
        </button>
      </div>
    </header>
  );
};
