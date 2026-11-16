'use client';

import React, { useState } from 'react';
import { SharedFile } from '../lib/types';
import {
  FileText,
  Table,
  UploadCloud,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

interface FileLibrarySidebarProps {
  files: SharedFile[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeedDemoData: () => void;
}

export const FileLibrarySidebar: React.FC<FileLibrarySidebarProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onDeleteFile,
  onUploadFile,
  onSeedDemoData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'structured' | 'unstructured'>('all');

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || f.classification === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Drawer Header */}
      <div className="flex flex-col gap-3 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold tracking-tight text-slate-900">
              Shared File Library
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {files.length}
          </span>
        </div>

        {/* Upload Drop Zone / Button */}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 p-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors">
          <UploadCloud className="h-4 w-4 text-blue-600" />
          <span>Upload CSV, XLSX, JSON, PDF, TXT</span>
          <input
            type="file"
            onChange={onUploadFile}
            accept=".csv,.xlsx,.xls,.json,.pdf,.txt"
            className="hidden"
          />
        </label>

        {/* Search & Segmented Filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search shared files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 rounded-md bg-slate-100 p-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 rounded-sm py-1 text-xs font-medium transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('structured')}
            className={`flex-1 rounded-sm py-1 text-xs font-medium transition-colors ${
              filterType === 'structured' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Structured
          </button>
          <button
            onClick={() => setFilterType('unstructured')}
            className={`flex-1 rounded-sm py-1 text-xs font-medium transition-colors ${
              filterType === 'unstructured' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unstructured
          </button>
        </div>
      </div>

      {/* Shared File List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
            <FileText className="h-8 w-8 text-slate-300" />
            <p className="text-xs font-medium">No files found matching criteria.</p>
            <button
              onClick={onSeedDemoData}
              className="mt-2 flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Seed Sample Files
            </button>
          </div>
        ) : (
          filteredFiles.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`group relative flex flex-col gap-1.5 rounded-lg border p-3 cursor-pointer transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {file.classification === 'structured' ? (
                      <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                    )}
                    <span className="truncate text-xs font-semibold text-slate-900">
                      {file.name}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                    title="Delete file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Unboxed Metadata (Zero Pill Rule) */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 uppercase tracking-wider">
                    {file.classification}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{formatFileSize(file.size)}</span>
                  <span>·</span>
                  <span>{new Date(file.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Processing Status & Chevron */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600 font-mono">
                    {file.status === 'analyzed' ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Analyzed
                      </span>
                    ) : file.status === 'cleaning' ? (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Clock className="h-3 w-3 animate-spin" /> Processing...
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Raw Upload</span>
                    )}
                  </div>

                  <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Analyze</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span>Global Real-Time Store</span>
        <span className="text-emerald-600 font-medium">Firestore Connected</span>
      </div>
    </aside>
  );
};
