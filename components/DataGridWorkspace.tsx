'use client';

import React, { useState } from 'react';
import { SharedFile } from '../lib/types';
import {
  Table as TableIcon,
  Filter,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

interface DataGridWorkspaceProps {
  file: SharedFile;
  onCleanStructuredData: () => void;
  onProcessUnstructuredData: () => void;
  isProcessing: boolean;
}

export const DataGridWorkspace: React.FC<DataGridWorkspaceProps> = ({
  file,
  onCleanStructuredData,
  onProcessUnstructuredData,
  isProcessing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const rows = file.structuredRows || (file.unstructuredAnalysis?.extractedTable ?? []);
  const columns = file.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);

  const filteredRows = rows.filter((r) => {
    if (!searchTerm) return true;
    return Object.values(r).some((val) =>
      String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {file.classification === 'structured' ? 'Structured Dataset Grid' : 'Document Content & Extracted Table'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {rows.length} total rows parsed · {columns.length} columns detected
          </p>
        </div>

        <div className="flex items-center gap-3">
          {file.classification === 'structured' ? (
            <button
              onClick={onCleanStructuredData}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>{isProcessing ? 'Cleaning Data...' : 'Run Auto Data Cleaning (Agent 2)'}</span>
            </button>
          ) : (
            <button
              onClick={onProcessUnstructuredData}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isProcessing ? 'Extracting Text...' : 'Extract Entities to Table (Agent 3)'}</span>
            </button>
          )}
        </div>
      </div>

      {file.classification === 'unstructured' && file.unstructuredAnalysis && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Summary & Sentiment Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Semantic Summary & Sentiment
            </h3>
            <p className="mt-2 text-xs text-slate-700 leading-relaxed font-sans">
              {file.unstructuredAnalysis.summary}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">Overall Sentiment:</span>
              <span className="font-bold text-blue-700 capitalize">
                {file.unstructuredAnalysis.sentiment}
              </span>
            </div>
          </div>

          {/* Extracted Themes */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Extracted Themes & Topics
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {file.unstructuredAnalysis.themes.map((theme, i) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Extracted Entities */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Key Extracted Entities
            </h3>
            <div className="mt-2 max-h-36 overflow-y-auto space-y-1.5">
              {file.unstructuredAnalysis.entities.map((entity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none"
                >
                  <span className="font-semibold text-slate-900">{entity.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {entity.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Table Spreadsheet Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table Search Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search data records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="text-xs font-mono text-slate-500">
            Showing <strong className="text-slate-900">{filteredRows.length}</strong> of {rows.length} rows
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="max-h-[500px] overflow-auto">
          {columns.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <FileText className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs font-medium">No tabular dataset generated yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Run Agent 3 (Unstructured Processor) or Agent 2 (Structured Cleaner) to parse data.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-mono text-[11px] uppercase tracking-wider z-10">
                <tr>
                  <th className="w-12 border-b border-r border-slate-200 p-2.5 text-center font-bold text-slate-400">
                    #
                  </th>
                  {columns.map((col) => (
                    <th key={col} className="border-b border-r border-slate-200 p-2.5 font-bold whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="w-12 border-r border-slate-200 p-2.5 text-center font-mono text-[11px] text-slate-400 bg-slate-50">
                      {rIdx + 1}
                    </td>
                    {columns.map((col) => {
                      const val = row[col];
                      const isNull = val === null || val === undefined || val === '';
                      return (
                        <td
                          key={col}
                          className={`border-r border-slate-200 p-2.5 whitespace-nowrap ${
                            isNull
                              ? 'bg-amber-50/50 text-amber-700 font-mono text-[11px] italic'
                              : typeof val === 'number'
                              ? 'font-mono text-slate-900'
                              : 'text-slate-800'
                          }`}
                        >
                          {isNull ? 'NULL' : String(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
