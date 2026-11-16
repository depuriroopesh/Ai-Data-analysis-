import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParseResult {
  structuredRows?: Record<string, any>[];
  columns?: string[];
  rawText: string;
  isStructured: boolean;
}

export function parseFileContent(content: string | ArrayBuffer, fileName: string): ParseResult {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (extension === 'csv') {
    const text = typeof content === 'string' ? content : new TextDecoder().decode(content);
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const columns = parsed.meta.fields || (parsed.data.length > 0 ? Object.keys(parsed.data[0] as object) : []);
    return {
      structuredRows: parsed.data as Record<string, any>[],
      columns,
      rawText: text,
      isStructured: true,
    };
  }

  if (extension === 'json') {
    const text = typeof content === 'string' ? content : new TextDecoder().decode(content);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        const columns = Object.keys(parsed[0]);
        return {
          structuredRows: parsed,
          columns,
          rawText: text,
          isStructured: true,
        };
      }
    } catch {
      // Fallback to unstructured text if JSON parsing fails or isn't tabular
    }
    return {
      rawText: text,
      isStructured: false,
    };
  }

  if (extension === 'xlsx' || extension === 'xls') {
    try {
      const workbook = XLSX.read(content, { type: typeof content === 'string' ? 'string' : 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: null });
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        structuredRows: rows,
        columns,
        rawText: `[Excel Sheet: ${firstSheetName}] ${rows.length} rows loaded.`,
        isStructured: true,
      };
    } catch {
      return {
        rawText: typeof content === 'string' ? content : 'Binary Excel Content',
        isStructured: false,
      };
    }
  }

  // PDF or Plain text files
  const text = typeof content === 'string' ? content : new TextDecoder().decode(content);
  return {
    rawText: text,
    isStructured: false,
  };
}
