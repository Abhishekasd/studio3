
'use server';

import pdf from 'pdf-parse';

interface PdfToTextState {
  extractedText?: string;
  error?: string;
}

export async function extractTextFromPdf(prevState: any, formData: FormData): Promise<PdfToTextState> {
  const file = formData.get("pdf") as File;

  if (!file || file.size === 0) {
    return { error: "Please select a PDF file." };
  }
  if (file.type !== 'application/pdf') {
    return { error: "Invalid file type. Please upload a PDF." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdf(buffer);
    
    return { extractedText: data.text };
  } catch (err: any) {
    console.error("Failed to extract text from PDF:", err);
    return { error: `An error occurred during text extraction: ${err.message}` };
  }
}
