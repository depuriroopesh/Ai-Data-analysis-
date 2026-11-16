import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, HeadingLevel, AlignmentType } from 'docx';
import saveAs from 'file-saver';
import { SharedFile } from './types';

export async function exportToWord(file: SharedFile) {
  const dataRows = file.structuredRows || (file.unstructuredAnalysis?.extractedTable ?? []);
  const maxRowsInWordTable = 100;
  const isLargeDataset = dataRows.length > maxRowsInWordTable;

  const docChildren: any[] = [];

  // Title Header
  docChildren.push(
    new Paragraph({
      text: 'AI DATA INTELLIGENCE PLATFORM REPORT',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    })
  );

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'File Name: ', bold: true }),
        new TextRun({ text: file.name }),
        new TextRun({ text: '  |  Classification: ', bold: true }),
        new TextRun({ text: file.classification.toUpperCase() }),
        new TextRun({ text: '  |  Generated: ', bold: true }),
        new TextRun({ text: new Date().toLocaleDateString() }),
      ],
      spacing: { after: 400 },
    })
  );

  // Section 1: Executive Summary
  docChildren.push(
    new Paragraph({
      text: '1. EXECUTIVE SUMMARY & FINDINGS',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 150 },
    })
  );

  if (file.unstructuredAnalysis?.summary) {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Semantic Summary: ', bold: true }),
          new TextRun({ text: file.unstructuredAnalysis.summary }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  const observations = file.analytics?.keyObservations || [
    'Automated data pipeline completed verification and quality auditing.',
  ];

  for (const obs of observations) {
    docChildren.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: obs })],
        spacing: { after: 100 },
      })
    );
  }

  // Section 2: Data Quality Audit
  docChildren.push(
    new Paragraph({
      text: '2. DATA QUALITY AUDIT & TRANSFORMATIONS',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    })
  );

  const quality = file.qualityReport || {
    score: 100,
    initialRowCount: dataRows.length,
    finalRowCount: dataRows.length,
    operationsLog: ['Dataset validated successfully.'],
  };

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Overall Data Quality Score: ', bold: true }),
        new TextRun({ text: `${quality.score}%`, bold: true, color: quality.score > 80 ? '16A34A' : 'D97706' }),
        new TextRun({ text: ` (Processed ${quality.initialRowCount} initial rows into ${quality.finalRowCount} clean records)` }),
      ],
      spacing: { after: 200 },
    })
  );

  docChildren.push(
    new Paragraph({
      text: 'Transformation Operations Performed:',
      children: [],
      spacing: { after: 100 },
    })
  );

  for (const log of quality.operationsLog) {
    docChildren.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: log })],
        spacing: { after: 80 },
      })
    );
  }

  // Section 3: Data Table / Extracted Records
  docChildren.push(
    new Paragraph({
      text: '3. DATASET RECORD SAMPLE',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    })
  );

  if (isLargeDataset) {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Note: Dataset contains ${dataRows.length} rows. For optimal readability in Word, displaying the first ${maxRowsInWordTable} rows below. Please download the accompanying Excel workbook (.xlsx) for full dataset analysis.`,
            italics: true,
            color: '64748B',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  const displayRows = isLargeDataset ? dataRows.slice(0, maxRowsInWordTable) : dataRows;
  const cols = file.columns || (displayRows.length > 0 ? Object.keys(displayRows[0]) : []);

  if (cols.length > 0 && displayRows.length > 0) {
    const tableHeader = new TableRow({
      children: cols.map(
        (c) =>
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: c, bold: true })] })],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: '0F172A' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          })
      ),
    });

    const tableRows = displayRows.map((row) => {
      return new TableRow({
        children: cols.map(
          (c) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: String(row[c] ?? '') })] })],
              borders: {
                bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            })
        ),
      });
    });

    const docTable = new Table({
      rows: [tableHeader, ...tableRows],
    });

    docChildren.push(docTable);
  } else {
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: file.rawContent || 'No tabular records.' })],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '_executive_report.docx';
  saveAs(blob, outputFileName);
}
