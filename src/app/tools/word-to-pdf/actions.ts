
'use server';

import type { Buffer } from 'buffer';

// Lazily import docx-pdf to handle environments where it might fail
let docx: ((buffer: Buffer, callback: (err: any, result: Buffer | null) => void) => void) | null = null;
try {
    docx = require('docx-pdf');
} catch (e) {
    console.error("Could not load docx-pdf library. The Word to PDF tool may not be available in this environment.", e);
}


export async function convertWordToPdf(prevState: any, formData: FormData): Promise<{ pdfDataUri?: string; error?: string }> {
  if (!docx) {
    return { error: "The converter is not available in this build environment due to incompatible dependencies. This feature often works best in a local development setup." };
  }

  const file = formData.get("doc") as File;

  if (!file || file.size === 0) {
    return { error: "Please select a Word document to convert." };
  }
  
  const acceptedTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!acceptedTypes.includes(file.type)) {
     return { error: "Invalid file type. Please upload a .doc or .docx file." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve) => {
        docx!(buffer, (err, result) => {
            if (err) {
                console.error("Conversion error:", err);
                resolve({ error: "Failed to convert the document. It might be corrupted or in an unsupported format." });
            } else if (result) {
                 const pdfDataUri = `data:application/pdf;base64,${result.toString('base64')}`;
                 resolve({ pdfDataUri });
            } else {
                 resolve({ error: "Conversion resulted in an empty file." });
            }
        });
    });
    
  } catch (err: any) {
    console.error("Failed to process file:", err);
    return { error: `An error occurred during conversion: ${err.message}` };
  }
}
