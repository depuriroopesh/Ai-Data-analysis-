'use client';

import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SharedFile, FileType } from '../lib/types';
import { SAMPLE_STRUCTURED_FILE, SAMPLE_UNSTRUCTURED_FILE } from '../lib/sample-data';
import { parseFileContent } from '../lib/parsers';
import { cleanStructuredData } from '../lib/cleaner';
import { calculateAnalytics } from '../lib/analytics';
import { Navbar } from '../components/Navbar';
import { FileLibrarySidebar } from '../components/FileLibrarySidebar';
import { AgentPipelineView } from '../components/AgentPipelineView';
import { DataGridWorkspace } from '../components/DataGridWorkspace';
import { AnalyticsDashboardView } from '../components/AnalyticsDashboardView';
import { QualityReportView } from '../components/QualityReportView';
import { ExportHubView } from '../components/ExportHubView';
import { VoiceCommandBar } from '../components/VoiceCommandBar';
import { exportToExcel } from '../lib/export-xlsx';
import { exportToWord } from '../lib/export-docx';

export default function PlatformPage() {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pipeline');
  const [liveSyncStatus, setLiveSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isProcessing, setIsProcessing] = useState(false);

  // Real-time Firestore Listener
  useEffect(() => {
    setLiveSyncStatus('syncing');
    const q = query(collection(db, 'shared_files'), orderBy('uploadedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedFiles: SharedFile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedFiles.push({
            id: docSnap.id,
            name: data.name || 'Untitled File',
            size: data.size || 0,
            type: (data.type as FileType) || 'csv',
            classification: data.classification || 'structured',
            status: data.status || 'raw',
            uploadedAt: data.uploadedAt || new Date().toISOString(),
            uploaderName: data.uploaderName || 'Anonymous',
            rawContent: data.rawContent || '',
            structuredRows: data.structuredRowsJson ? JSON.parse(data.structuredRowsJson) : data.structuredRows,
            columns: data.columnsJson ? JSON.parse(data.columnsJson) : data.columns,
            unstructuredAnalysis: data.unstructuredSummaryJson ? JSON.parse(data.unstructuredSummaryJson) : data.unstructuredAnalysis,
            qualityReport: data.qualityReportJson ? JSON.parse(data.qualityReportJson) : data.qualityReport,
            analytics: data.analyticsJson ? JSON.parse(data.analyticsJson) : data.analytics,
            isSample: data.isSample || false,
          });
        });

        setFiles(loadedFiles);
        setLiveSyncStatus('synced');

        // Auto select first file if none active
        if (loadedFiles.length > 0 && !activeFileId) {
          setActiveFileId(loadedFiles[0].id);
        }

        // If collection is completely empty, seed initial sample datasets
        if (loadedFiles.length === 0) {
          seedSampleFiles();
        }
      },
      (error) => {
        console.error('Firestore Real-Time Listener Error:', error);
        setLiveSyncStatus('error');
      }
    );

    return () => unsubscribe();
  }, []);

  // Seed sample files if database is empty
  const seedSampleFiles = async () => {
    try {
      setLiveSyncStatus('syncing');
      // Seed sample structured file
      const structuredParsed = parseFileContent(SAMPLE_STRUCTURED_FILE.rawContent, SAMPLE_STRUCTURED_FILE.name);
      const cleanedStruct = cleanStructuredData(structuredParsed.structuredRows || [], structuredParsed.columns || []);
      const analyticsStruct = calculateAnalytics(cleanedStruct.cleanedRows, structuredParsed.columns || []);

      await addDoc(collection(db, 'shared_files'), {
        ...SAMPLE_STRUCTURED_FILE,
        structuredRowsJson: JSON.stringify(cleanedStruct.cleanedRows),
        columnsJson: JSON.stringify(structuredParsed.columns),
        qualityReportJson: JSON.stringify(cleanedStruct.report),
        analyticsJson: JSON.stringify(analyticsStruct),
        status: 'analyzed',
      });

      // Seed sample unstructured file
      await addDoc(collection(db, 'shared_files'), {
        ...SAMPLE_UNSTRUCTURED_FILE,
        status: 'raw',
      });
    } catch (err) {
      console.error('Error seeding sample datasets:', err);
    }
  };

  const activeFile = files.find((f) => f.id === activeFileId) || files[0] || null;

  // File Upload Workflow (Automatic Saving to Global Library)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    try {
      setLiveSyncStatus('syncing');
      const text = await uploadedFile.text();
      const parseResult = parseFileContent(text, uploadedFile.name);

      const classification = parseResult.isStructured ? 'structured' : 'unstructured';
      const fileType = (uploadedFile.name.split('.').pop()?.toLowerCase() as FileType) || 'txt';

      const newDocData: any = {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: fileType,
        classification,
        status: 'raw',
        uploadedAt: new Date().toISOString(),
        uploaderName: 'Current User',
        rawContent: parseResult.rawText,
        isSample: false,
      };

      if (parseResult.structuredRows && parseResult.structuredRows.length > 0) {
        newDocData.structuredRowsJson = JSON.stringify(parseResult.structuredRows);
        newDocData.columnsJson = JSON.stringify(parseResult.columns || []);
      }

      const docRef = await addDoc(collection(db, 'shared_files'), newDocData);
      setActiveFileId(docRef.id);
      setActiveTab('pipeline');
    } catch (err) {
      console.error('File Upload Error:', err);
      alert('Failed to upload file. Please try again.');
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteDoc(doc(db, 'shared_files', fileId));
      if (activeFileId === fileId) {
        setActiveFileId(files.find((f) => f.id !== fileId)?.id || null);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  // Agent 2: Clean Structured Data
  const handleCleanStructuredData = async () => {
    if (!activeFile) return;
    setIsProcessing(true);
    try {
      const rows = activeFile.structuredRows || [];
      const cols = activeFile.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
      const { cleanedRows, report } = cleanStructuredData(rows, cols);
      const analytics = calculateAnalytics(cleanedRows, cols);

      await updateDoc(doc(db, 'shared_files', activeFile.id), {
        structuredRowsJson: JSON.stringify(cleanedRows),
        qualityReportJson: JSON.stringify(report),
        analyticsJson: JSON.stringify(analytics),
        status: 'analyzed',
      });
    } catch (err) {
      console.error('Error cleaning data:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Agent 3: Process Unstructured Data
  const handleProcessUnstructuredData = async () => {
    if (!activeFile) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/process-unstructured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: activeFile.rawContent,
          fileName: activeFile.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const analysis = data.analysis;
        const rows = analysis.extractedTable || [];
        const cols = analysis.extractedColumns || (rows.length > 0 ? Object.keys(rows[0]) : []);
        const analytics = calculateAnalytics(rows, cols);

        await updateDoc(doc(db, 'shared_files', activeFile.id), {
          unstructuredSummaryJson: JSON.stringify(analysis),
          structuredRowsJson: JSON.stringify(rows),
          columnsJson: JSON.stringify(cols),
          analyticsJson: JSON.stringify(analytics),
          status: 'analyzed',
        });
      }
    } catch (err) {
      console.error('Error processing unstructured data:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute Full 7-Agent Orchestrator Pipeline
  const handleRunFullPipeline = async () => {
    if (!activeFile) return;
    setIsProcessing(true);
    try {
      // Step 1: Call Master Orchestrator AI
      const orchRes = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: activeFile.name,
          fileType: activeFile.type,
          rawContentSample: activeFile.rawContent,
        }),
      });
      const orchData = await orchRes.json();

      // Step 2/3: Clean or Extract
      if (activeFile.classification === 'structured') {
        const rows = activeFile.structuredRows || [];
        const cols = activeFile.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
        const { cleanedRows, report } = cleanStructuredData(rows, cols);
        const analytics = calculateAnalytics(cleanedRows, cols);

        await updateDoc(doc(db, 'shared_files', activeFile.id), {
          structuredRowsJson: JSON.stringify(cleanedRows),
          qualityReportJson: JSON.stringify(report),
          analyticsJson: JSON.stringify(analytics),
          status: 'analyzed',
        });
      } else {
        await handleProcessUnstructuredData();
      }
    } catch (err) {
      console.error('Pipeline Execution Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Natural Language & Voice Command Router
  const handleVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    if (lower.includes('clean')) {
      handleCleanStructuredData();
      setActiveTab('grid');
    } else if (lower.includes('extract') || lower.includes('entities')) {
      handleProcessUnstructuredData();
      setActiveTab('grid');
    } else if (lower.includes('excel') || lower.includes('xlsx')) {
      if (activeFile) exportToExcel(activeFile);
      setActiveTab('export');
    } else if (lower.includes('word') || lower.includes('docx') || lower.includes('report')) {
      if (activeFile) exportToWord(activeFile);
      setActiveTab('export');
    } else if (lower.includes('chart') || lower.includes('analytics')) {
      setActiveTab('analytics');
    } else if (lower.includes('sample') || lower.includes('seed')) {
      seedSampleFiles();
    } else {
      handleRunFullPipeline();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden font-sans">
      {/* 3-Zone Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUploadClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.csv,.xlsx,.xls,.json,.pdf,.txt';
          input.onchange = (e) => handleFileUpload(e as any);
          input.click();
        }}
        onSeedDemoClick={seedSampleFiles}
        liveSyncStatus={liveSyncStatus}
        fileCount={files.length}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Global Shared File Library Drawer */}
        <FileLibrarySidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={(id) => setActiveFileId(id)}
          onDeleteFile={handleDeleteFile}
          onUploadFile={handleFileUpload}
          onSeedDemoData={seedSampleFiles}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto pb-24">
          {!activeFile ? (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center text-slate-400">
              <p className="text-sm font-semibold">No Shared File Selected</p>
              <p className="text-xs text-slate-500 mt-1">Select a file from the Shared File Library or upload a new one.</p>
            </div>
          ) : (
            <>
              {activeTab === 'pipeline' && (
                <AgentPipelineView
                  file={activeFile}
                  onRunFullPipeline={handleRunFullPipeline}
                  isRunningPipeline={isProcessing}
                />
              )}
              {activeTab === 'grid' && (
                <DataGridWorkspace
                  file={activeFile}
                  onCleanStructuredData={handleCleanStructuredData}
                  onProcessUnstructuredData={handleProcessUnstructuredData}
                  isProcessing={isProcessing}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsDashboardView file={activeFile} />
              )}
              {activeTab === 'report' && (
                <QualityReportView file={activeFile} />
              )}
              {activeTab === 'export' && (
                <ExportHubView file={activeFile} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Natural Language & Voice Command Bar */}
      <VoiceCommandBar
        onExecuteCommand={handleVoiceCommand}
        isProcessing={isProcessing}
      />
    </div>
  );
}
