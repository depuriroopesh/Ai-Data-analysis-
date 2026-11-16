'use client';

import React from 'react';
import { SharedFile, AgentStep } from '../lib/types';
import {
  BrainCircuit,
  Filter,
  FileCode,
  LineChart,
  BarChart3,
  ShieldCheck,
  FileText,
  CheckCircle,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface AgentPipelineViewProps {
  file: SharedFile;
  onRunFullPipeline: () => void;
  isRunningPipeline: boolean;
}

export const AgentPipelineView: React.FC<AgentPipelineViewProps> = ({
  file,
  onRunFullPipeline,
  isRunningPipeline,
}) => {
  const agentModules = [
    {
      id: 'agent-1',
      number: '01',
      name: 'Master AI Orchestrator',
      role: 'orchestrator',
      icon: BrainCircuit,
      description: 'Inspects metadata/content, classifies data (Structured vs Unstructured), and assigns agent workflows.',
      trigger: 'On Upload / Trigger',
    },
    {
      id: 'agent-2',
      number: '02',
      name: 'Structured Data Cleaner',
      role: 'cleaner',
      icon: Filter,
      description: 'Parses tabular CSV/XLSX, fixes missing values, removes duplicates, and normalizes date formats.',
      trigger: 'Routed if Structured',
    },
    {
      id: 'agent-3',
      number: '03',
      name: 'Unstructured Data Processor',
      role: 'processor',
      icon: FileCode,
      description: 'Extracts entities, sentiment, themes, and parses documents into tabular CSV schemas.',
      trigger: 'Routed if Unstructured',
    },
    {
      id: 'agent-4',
      number: '04',
      name: 'AI Data Analyst',
      role: 'analyst',
      icon: LineChart,
      description: 'Calculates count, sum, mean, median, min, max, group aggregations, and quality stats.',
      trigger: 'Data Post-Cleaning',
    },
    {
      id: 'agent-5',
      number: '05',
      name: 'AI Data Visualizer',
      role: 'visualizer',
      icon: BarChart3,
      description: 'Generates verified bar charts, line trends, and interactive dashboards without fabricated values.',
      trigger: 'Post-Analytics',
    },
    {
      id: 'agent-6',
      number: '06',
      name: 'AI Data Quality Checker',
      role: 'quality_checker',
      icon: ShieldCheck,
      description: 'Audits row/column counts, validates transformations, and measures extraction accuracy.',
      trigger: 'Validation Audit',
    },
    {
      id: 'agent-7',
      number: '07',
      name: 'AI Reporting Assistant',
      role: 'reporter',
      icon: FileText,
      description: 'Synthesizes findings into formal reports distinguishing observed facts, metrics, and AI insights.',
      trigger: 'Final Reporting',
    },
  ];

  const getStepStatus = (agentId: string) => {
    if (file.status === 'analyzed') return 'completed';
    if (file.status === 'cleaning') {
      if (agentId === 'agent-1' || agentId === 'agent-2' || agentId === 'agent-3') return 'completed';
      if (agentId === 'agent-4' || agentId === 'agent-5') return 'running';
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
              ACTIVE FILE PIPELINE
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-700 capitalize font-mono">
              {file.classification} Dataset
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {file.name}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Multi-Agent Data Orchestrator status for real-time collaboration.
          </p>
        </div>

        <button
          onClick={onRunFullPipeline}
          disabled={isRunningPipeline}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs whitespace-nowrap shrink-0"
        >
          {isRunningPipeline ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              <span>Orchestrating Agents...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Execute Multi-Agent Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Agents Flow Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agentModules.map((module) => {
          const Icon = module.icon;
          const status = getStepStatus(module.id);
          const isCurrentActive =
            (file.classification === 'structured' && module.id === 'agent-3') ||
            (file.classification === 'unstructured' && module.id === 'agent-2');

          return (
            <div
              key={module.id}
              className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all ${
                isCurrentActive
                  ? 'opacity-40 bg-slate-50 border-slate-200'
                  : status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                  : status === 'running'
                  ? 'border-amber-300 bg-amber-50/30 shadow-xs'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {module.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      {module.trigger}
                    </span>
                  </div>

                  {status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Completed
                    </span>
                  ) : status === 'running' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                      <Clock className="h-3.5 w-3.5 animate-spin text-amber-600" /> Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">
                      Standby
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {module.name}
                    </h3>
                    {isCurrentActive && (
                      <span className="text-[10px] text-slate-400 italic">
                        (Bypassed for {file.classification} data)
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {module.description}
                </p>
              </div>

              {/* Action/Result Summary Footprint */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500">Agent Status</span>
                <span className="font-semibold text-slate-800">
                  {status === 'completed' ? 'Verified Output Ready' : 'Awaiting Execution'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classification Routing Logic Callout */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider font-mono">
            Orchestrator Routing Decision
          </h4>
          <p className="mt-1 text-xs text-blue-800 leading-relaxed">
            The Master Orchestrator detected file extension <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-900">{file.type}</code> and classified content as <strong className="capitalize">{file.classification} Data</strong>. Routing assigned to {file.classification === 'structured' ? 'Structured Data Cleaner (Agent 2)' : 'Unstructured Data Processor (Agent 3)'}.
          </p>
        </div>
      </div>
    </div>
  );
};
