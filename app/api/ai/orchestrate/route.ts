import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, rawContentSample } = await req.json();

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

    const prompt = `You are Agent 1: Master AI Orchestrator for an enterprise data platform.
Inspect the following file metadata and sample content:
File Name: ${fileName}
File Type: ${fileType}
Sample Content (first 1000 characters):
${rawContentSample ? String(rawContentSample).slice(0, 1000) : 'None provided'}

Task:
1. Classify the file as either "structured" (tabular CSV, Excel, structured JSON) or "unstructured" (text, PDF, support logs, semi-structured documents).
2. Detail the execution plan across the multi-agent system.
3. Provide a reasoning explanation for the classification.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: {
              type: Type.STRING,
              description: 'MUST be "structured" or "unstructured"',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0 and 1',
            },
            reasoning: {
              type: Type.STRING,
              description: 'Explanation for why this data was classified as structured or unstructured',
            },
            assignedPipeline: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of agent module names assigned to process this dataset',
            },
          },
          required: ['classification', 'confidence', 'reasoning', 'assignedPipeline'],
        },
      },
    });

    const jsonStr = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Orchestrator AI Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
