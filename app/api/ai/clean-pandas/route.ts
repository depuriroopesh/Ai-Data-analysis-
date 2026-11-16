import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { datasetSample, schemaInfo, userCommand } = await req.json();

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

    const prompt = `You are the AI Data Cleaner, a specialized agent within a multi-agent data processing pipeline.
Analyze the following dataset sample and user requirements:

Dataset Sample / Schema:
${JSON.stringify(datasetSample || schemaInfo || {})}

User Command:
${userCommand || 'Clean dataset: handle null values, standardize date formatting, strip text spaces, and remove exact duplicates.'}

Perform the following checks:
1. Null/Missing Values: Identify missing data and apply appropriate imputation (mean/median for numerical, mode/placeholder for categorical) or dropping strategies.
2. Inconsistent Formatting: Standardize date/time formats, text casing, and remove trailing spaces.
3. Duplicates: Identify and remove duplicate rows.
4. Outliers: Flag or cap extreme outliers if mathematically appropriate.

Output executable Python (Pandas) code inside the JSON response.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issues_detected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actions_taken: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            executable_code: {
              type: Type.STRING,
            },
          },
          required: ['issues_detected', 'actions_taken', 'executable_code'],
        },
      },
    });

    const jsonStr = (response.text ?? '{}').trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Data Cleaner Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
