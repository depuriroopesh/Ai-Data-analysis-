import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { rawText, fileName } = await req.json();

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

    const prompt = `You are Agent 3: Unstructured Data Processor.
Analyze the following unstructured document text from file "${fileName}":

--- DOCUMENT TEXT ---
${rawText ? String(rawText).slice(0, 4000) : ''}
--- END DOCUMENT TEXT ---

Task:
1. Provide a concise executive summary of the document.
2. Determine overall sentiment ("positive", "negative", "neutral", or "mixed").
3. Identify 3-5 core themes.
4. Extract key entities (names, organizations, products, dates, monetary amounts).
5. Parse the document into a structured tabular dataset (array of key-value rows, e.g. ticket_id, customer, agent, issue, resolution_amount, status).
6. Note any ambiguous or unverified extractions requiring user review.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            themes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  sentiment: { type: Type.STRING },
                },
                required: ['name', 'category'],
              },
            },
            extractedColumns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            extractedTable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ID: { type: Type.STRING },
                  Customer: { type: Type.STRING },
                  Agent: { type: Type.STRING },
                  Category: { type: Type.STRING },
                  Amount: { type: Type.STRING },
                  Status: { type: Type.STRING },
                  Summary: { type: Type.STRING },
                },
              },
            },
            ambiguousItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'sentiment', 'themes', 'entities', 'extractedColumns', 'extractedTable'],
        },
      },
    });

    const jsonStr = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, analysis: result });
  } catch (error) {
    console.error('Unstructured AI Processor Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
