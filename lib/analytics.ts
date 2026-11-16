import { AnalyticsSummary, ColumnMetric, GroupAnalysisResult } from './types';

export function calculateAnalytics(
  rows: Record<string, any>[],
  columns: string[]
): AnalyticsSummary {
  if (!rows || rows.length === 0) {
    return {
      columnMetrics: [],
      groupAnalysis: [],
      keyObservations: ['No records available for analytics calculation.'],
      recommendedCharts: [],
    };
  }

  const columnMetrics: ColumnMetric[] = [];
  let numericCol: string | null = null;
  let categoryCol: string | null = null;

  for (const col of columns) {
    const values = rows.map((r) => r[col]).filter((v) => v !== null && v !== undefined && v !== '');
    const nullCount = rows.length - values.length;

    // Check if column is numeric
    const numericValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));
    const isNumeric = numericValues.length > 0 && numericValues.length >= values.length * 0.8 && !col.toLowerCase().includes('id');

    if (isNumeric) {
      if (!numericCol) numericCol = col;
      const sorted = [...numericValues].sort((a, b) => a - b);
      const sum = sorted.reduce((acc, curr) => acc + curr, 0);
      const mean = Number((sum / sorted.length).toFixed(2));
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));

      columnMetrics.push({
        name: col,
        type: 'numeric',
        count: values.length,
        nullCount,
        uniqueCount: new Set(numericValues).size,
        min,
        max,
        mean,
        median,
        sum: Number(sum.toFixed(2)),
      });
    } else {
      // Categorical column
      if (!categoryCol && !col.toLowerCase().includes('id') && !col.toLowerCase().includes('date')) {
        categoryCol = col;
      }
      const valCounts: Record<string, number> = {};
      for (const v of values) {
        const str = String(v);
        valCounts[str] = (valCounts[str] || 0) + 1;
      }

      const topValues = Object.entries(valCounts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      columnMetrics.push({
        name: col,
        type: 'categorical',
        count: values.length,
        nullCount,
        uniqueCount: Object.keys(valCounts).length,
        topValues,
      });
    }
  }

  // Perform Grouped Analysis if we have both a category column and a numeric column
  const groupAnalysis: GroupAnalysisResult[] = [];
  if (categoryCol && numericCol) {
    const groupMap: Record<string, { sum: number; count: number }> = {};
    for (const row of rows) {
      const gVal = String(row[categoryCol] || 'Unassigned');
      const numVal = Number(row[numericCol]);
      if (!isNaN(numVal)) {
        if (!groupMap[gVal]) groupMap[gVal] = { sum: 0, count: 0 };
        groupMap[gVal].sum += numVal;
        groupMap[gVal].count += 1;
      }
    }

    const data = Object.entries(groupMap).map(([group, stats]) => ({
      group,
      val: Number(stats.sum.toFixed(2)),
      count: stats.count,
    })).sort((a, b) => b.val - a.val);

    groupAnalysis.push({
      groupColumn: categoryCol,
      metricColumn: numericCol,
      data,
    });
  }

  // Key Observations derived from actual metrics
  const keyObservations: string[] = [
    `Dataset contains ${rows.length} total records across ${columns.length} columns.`,
  ];

  if (numericCol && columnMetrics.find((m) => m.name === numericCol)) {
    const m = columnMetrics.find((m) => m.name === numericCol)!;
    keyObservations.push(
      `Primary metric '${m.name}' yielded a total sum of ${m.sum?.toLocaleString()} with an average of ${m.mean?.toLocaleString()} per record (Range: ${m.min} to ${m.max}).`
    );
  }

  if (groupAnalysis.length > 0) {
    const topGroup = groupAnalysis[0].data[0];
    if (topGroup) {
      keyObservations.push(
        `Group '${topGroup.group}' generated the highest ${groupAnalysis[0].metricColumn} total (${topGroup.val.toLocaleString()}) across ${topGroup.count} transactions.`
      );
    }
  }

  // Recommended Charts
  const recommendedCharts: AnalyticsSummary['recommendedCharts'] = [];
  if (categoryCol && numericCol) {
    recommendedCharts.push({
      title: `${numericCol} by ${categoryCol}`,
      type: 'bar',
      xAxis: categoryCol,
      yAxis: numericCol,
    });
  }

  const dateCol = columns.find((c) => c.toLowerCase().includes('date') || c.toLowerCase().includes('time'));
  if (dateCol && numericCol) {
    recommendedCharts.push({
      title: `${numericCol} Trend over ${dateCol}`,
      type: 'line',
      xAxis: dateCol,
      yAxis: numericCol,
    });
  }

  return {
    columnMetrics,
    groupAnalysis,
    keyObservations,
    recommendedCharts,
  };
}
