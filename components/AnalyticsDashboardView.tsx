'use client';

import React, { useState } from 'react';
import { SharedFile } from '../lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Calculator,
  PieChart as PieIcon,
  Sparkles,
  Layers
} from 'lucide-react';

interface AnalyticsDashboardViewProps {
  file: SharedFile;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({ file }) => {
  const analytics = file.analytics;
  const rows = file.structuredRows || (file.unstructuredAnalysis?.extractedTable ?? []);

  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  if (!analytics || analytics.columnMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <BarChart3 className="h-10 w-10 text-slate-300 mb-2" />
        <p className="text-sm font-semibold text-slate-700">No Analytics Calculated Yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Execute the Agent Pipeline to compute statistical metrics and dynamic charts.
        </p>
      </div>
    );
  }

  const numericMetrics = analytics.columnMetrics.filter((m) => m.type === 'numeric');
  const groupResult = analytics.groupAnalysis[0];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Total Records
            </span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {rows.length.toLocaleString()}
          </p>
          <span className="mt-1 text-[11px] text-slate-500">
            Parsed rows in dataset
          </span>
        </div>

        {numericMetrics.slice(0, 3).map((metric, idx) => (
          <div key={metric.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-mono font-bold uppercase tracking-wider truncate">
                {metric.name} Sum
              </span>
              <Calculator className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold font-mono text-slate-900">
              {metric.sum?.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Avg: {metric.mean}</span>
              <span>·</span>
              <span>Med: {metric.median}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Chart Card */}
      {groupResult && groupResult.data.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {groupResult.metricColumn} Breakdown by {groupResult.groupColumn}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Agent 5 Visualizer: Dynamically computed from verified row calculations.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setSelectedChartType('bar')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedChartType === 'bar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setSelectedChartType('line')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedChartType === 'line' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trend Line
              </button>
              <button
                onClick={() => setSelectedChartType('pie')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedChartType === 'pie' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pie Distribution
              </button>
            </div>
          </div>

          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {selectedChartType === 'bar' ? (
                <BarChart data={groupResult.data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Bar dataKey="val" fill="#2563EB" radius={[4, 4, 0, 0]} name={groupResult.metricColumn} />
                </BarChart>
              ) : selectedChartType === 'line' ? (
                <LineChart data={groupResult.data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name={groupResult.metricColumn} />
                </LineChart>
              ) : (
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Pie
                    data={groupResult.data}
                    dataKey="val"
                    nameKey="group"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name }) => name || ''}
                  >
                    {groupResult.data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Analyst Key Observations */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Agent 4 Analytical Observations (Plain-Language Insights)
          </h3>
        </div>

        <ul className="mt-4 space-y-2 text-xs text-slate-700 font-sans">
          {analytics.keyObservations.map((obs, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-bold text-blue-600 font-mono mt-0.5">•</span>
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
