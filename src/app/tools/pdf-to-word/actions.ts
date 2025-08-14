
'use server';

import pdf from 'pdf-parse';

interface PdfToWordState {
  textData?: string;
  error?: string;
}

// NOTE: True PDF-to-DOCX is incredibly complex.
// This implementation extracts text as a placeholder for a full conversion service.
export async function convertPdfToWord(prevState: any, formData: FormData): Promise<PdfToWordState> {
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
    
    return { textData: data.text };
  } catch (err: any) {
    console.error("Failed to process PDF for Word conversion:", err);
    return { error: `An error occurred while processing the PDF: ${err.message}` };
  }
}
