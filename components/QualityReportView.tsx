'use client';

import React from 'react';
import { SharedFile } from '../lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ListChecks,
  Sparkles
} from 'lucide-react';

interface QualityReportViewProps {
  file: SharedFile;
}

export const QualityReportView: React.FC<QualityReportViewProps> = ({ file }) => {
  const quality = file.qualityReport || {
    score: 100,
    initialRowCount: 0,
    finalRowCount: 0,
    missingValuesFixed: 0,
    duplicatesRemoved: 0,
    inconsistentDatesFixed: 0,
    operationsLog: ['Dataset uploaded and awaiting processing.'],
    warnings: [],
  };

  const unstructured = file.unstructuredAnalysis;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Scorecard Header */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              Agent 6 Data Quality Score
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {quality.score}%
              </span>
              <span className={`text-xs font-semibold ${quality.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {quality.score >= 80 ? 'High Integrity' : 'Minor Defects Fixed'}
              </span>
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            quality.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">
            Row Conservation Audit
          </span>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Initial Input Rows:</span>
            <span className="font-bold text-slate-900">{quality.initialRowCount}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Clean Output Rows:</span>
            <span className="font-bold text-emerald-600">{quality.finalRowCount}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">
            Automated Corrections
          </span>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Missing Cells Fixed:</span>
            <span className="font-bold text-slate-900">{quality.missingValuesFixed}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Duplicates Removed:</span>
            <span className="font-bold text-slate-900">{quality.duplicatesRemoved}</span>
          </div>
        </div>
      </div>

      {/* Operations Log */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ListChecks className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Transformation & Verification Audit Log
          </h3>
        </div>

        <div className="mt-4 space-y-2 font-mono text-xs text-slate-700">
          {quality.operationsLog.map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-md bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent 7 Formal Synthesis */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileCheck className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Agent 7 Executive Synthesis (Observed vs Calculated vs AI)
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Observed Facts */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              1. Observed Facts
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-700 font-sans">
              <li>• File: {file.name} ({file.type.toUpperCase()})</li>
              <li>• Size: {(file.size / 1024).toFixed(1)} KB</li>
              <li>• Classification: {file.classification}</li>
              <li>• Uploaded: {new Date(file.uploadedAt).toLocaleString()}</li>
            </ul>
          </div>

          {/* Calculated Metrics */}
          <div className="rounded-lg bg-blue-50/50 p-4 border border-blue-200">
            <h4 className="text-xs font-bold text-blue-900 uppercase font-mono tracking-wider">
              2. Calculated Metrics
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs text-blue-900 font-sans">
              <li>• Validated Clean Rows: {quality.finalRowCount}</li>
              <li>• Quality Audit Rating: {quality.score}%</li>
              <li>• Data Corrections Applied: {quality.missingValuesFixed + quality.duplicatesRemoved}</li>
              {file.analytics?.columnMetrics[0] && (
                <li>• Key Sum ({file.analytics.columnMetrics[0].name}): {file.analytics.columnMetrics[0].sum}</li>
              )}
            </ul>
          </div>

          {/* AI Recommendations */}
          <div className="rounded-lg bg-purple-50/50 p-4 border border-purple-200">
            <h4 className="text-xs font-bold text-purple-900 uppercase font-mono tracking-wider">
              3. AI Strategic Interpretations
            </h4>
            <p className="mt-2 text-xs text-purple-900 leading-relaxed font-sans">
              {unstructured?.summary || 'Dataset maintains high structural consistency. Recommended for downstream BI dashboards and financial forecasting models.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
