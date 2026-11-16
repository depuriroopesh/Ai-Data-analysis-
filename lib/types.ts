export type FileClassification = 'structured' | 'unstructured';
export type FileType = 'csv' | 'xlsx' | 'json' | 'pdf' | 'txt';
export type FileProcessingStatus = 'raw' | 'cleaning' | 'cleaned' | 'analyzed' | 'error';

export interface UnstructuredEntity {
  name: string;
  category: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
}

export interface ExtractedTabularRow {
  [key: string]: string | number | boolean | null;
}

export interface UnstructuredAnalysis {
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  themes: string[];
  entities: UnstructuredEntity[];
  extractedTable?: ExtractedTabularRow[];
  extractedColumns?: string[];
  ambiguousItems?: string[];
}

export interface DataQualityReport {
  initialRowCount: number;
  finalRowCount: number;
  missingValuesFound: number;
  missingValuesFixed: number;
  duplicatesFound: number;
  duplicatesRemoved: number;
  inconsistentDatesFixed: number;
  score: number; // 0 to 100
  operationsLog: string[];
  warnings: string[];
}

export interface ColumnMetric {
  name: string;
  type: 'numeric' | 'categorical' | 'date';
  count: number;
  nullCount: number;
  uniqueCount: number;
  // Numeric properties
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  sum?: number;
  // Categorical top values
  topValues?: { value: string; count: number }[];
}

export interface GroupAnalysisResult {
  groupColumn: string;
  metricColumn: string;
  data: { group: string; val: number; count: number }[];
}

export interface AnalyticsSummary {
  columnMetrics: ColumnMetric[];
  groupAnalysis: GroupAnalysisResult[];
  keyObservations: string[];
  recommendedCharts: {
    title: string;
    type: 'bar' | 'line' | 'scatter' | 'pie';
    xAxis: string;
    yAxis: string;
  }[];
}

export interface AgentStep {
  id: string;
  agentName: string;
  agentRole: 'orchestrator' | 'cleaner' | 'processor' | 'analyst' | 'visualizer' | 'quality_checker' | 'reporter';
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  classification: FileClassification;
  status: FileProcessingStatus;
  uploadedAt: string;
  uploaderName: string;
  rawContent: string;
  structuredRows?: Record<string, any>[];
  columns?: string[];
  unstructuredAnalysis?: UnstructuredAnalysis;
  qualityReport?: DataQualityReport;
  analytics?: AnalyticsSummary;
  agentSteps?: AgentStep[];
  isSample?: boolean;
}
