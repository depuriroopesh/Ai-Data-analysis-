'use client';

import React, { useState } from 'react';
import { SharedFile } from '../lib/types';
import { exportToExcel } from '../lib/export-xlsx';
import { exportToWord } from '../lib/export-docx';
import {
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ExportHubViewProps {
  file: SharedFile;
}

export const ExportHubView: React.FC<ExportHubViewProps> = ({ file }) => {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  const dataRows = file.structuredRows || (file.unstructuredAnalysis?.extractedTable ?? []);
  const isLargeDataset = dataRows.length > 100;

  const handleExcelExport = () => {
    setIsExportingExcel(true);
    try {
      exportToExcel(file);
    } catch (err) {
      console.error('Excel export error:', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleWordExport = async () => {
    setIsExportingWord(true);
    try {
      await exportToWord(file);
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Title */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Customer-Selectable Export Hub
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Generate client-side Excel workbooks (.xlsx) and Word executive reports (.docx) for file <strong className="text-slate-900 font-mono">{file.name}</strong>.
        </p>
      </div>

      {/* Export Options Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Option A: Excel Workbook */}
        <div className="flex flex-col justify-between rounded-xl border border-emerald-200 bg-emerald-50/20 p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 font-mono">
                OPTION A (.XLSX)
              </span>
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Excel Workbook (.xlsx)
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Full structured workbook containing multi-tab breakdown:
            </p>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-700 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Worksheet 1: Cleaned_Data / Extracted_Data</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Worksheet 2: Data_Quality_Report</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Worksheet 3: Analysis_Summary</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleExcelExport}
            disabled={isExportingExcel}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>{isExportingExcel ? 'Generating Workbook...' : 'Download Excel Package (.xlsx)'}</span>
          </button>
        </div>

        {/* Option B: Word Executive Document */}
        <div className="flex flex-col justify-between rounded-xl border border-blue-200 bg-blue-50/20 p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FileText className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 font-mono">
                OPTION B (.DOCX)
              </span>
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Word Executive Document (.docx)
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Formally styled Microsoft Word executive summary report:
            </p>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-700 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                <span>Section 1: Executive Summary & Semantic Findings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                <span>Section 2: Quality Audit Score & Transformation Log</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                <span>Section 3: Record Sample & Structured Table</span>
              </li>
            </ul>

            {isLargeDataset && (
              <div className="mt-3 rounded-md bg-amber-50 p-2.5 border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800 font-sans">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Large Dataset Notice: Dataset exceeds 100 rows ({dataRows.length} rows). Word table will include the first 100 sample records. Use Excel export alongside Word for complete dataset inspection.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleWordExport}
            disabled={isExportingWord}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>{isExportingWord ? 'Generating Document...' : 'Download Word Report (.docx)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
