import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileName, classification, qualityReport, analytics, unstructuredAnalysis } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY environment variable is not configured.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are Agent 7: AI Reporting Assistant.
Synthesize the pipeline results for file "${fileName}" (${classification} dataset):

--- QUALITY AUDIT ---
${JSON.stringify(qualityReport || {})}

--- ANALYTICS METRICS ---
${JSON.stringify(analytics || {})}

--- UNSTRUCTURED FINDINGS ---
${JSON.stringify(unstructuredAnalysis || {})}

Task:
Produce a structured executive report distinguishing clearly between:
1. Observed Facts (exact file properties and initial state).
2. Calculated Metrics (verified statistical totals, means, ranges, clean row counts).
3. AI Interpretations & Recommendations (strategic insight, future actions).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            observedFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            calculatedMetrics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            aiRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            executiveSummaryMarkdown: { type: Type.STRING },
          },
          required: ['headline', 'observedFacts', 'calculatedMetrics', 'aiRecommendations', 'executiveSummaryMarkdown'],
        },
      },
    });

    const jsonStr = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, report: result });
  } catch (error) {
    console.error('AI Reporting Assistant Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
