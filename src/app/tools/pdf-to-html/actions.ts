
'use server';

import pdf from 'pdf-parse';

interface PdfToHtmlState {
  htmlContent?: string;
  error?: string;
}

// NOTE: True PDF-to-HTML is incredibly complex.
// This implementation extracts text and wraps it in a basic HTML structure as a placeholder.
export async function convertPdfToHtml(prevState: any, formData: FormData): Promise<PdfToHtmlState> {
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
    const textContent = data.text;
    
    // Basic HTML structure with extracted text
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name}</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 2em; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <h1>Extracted Content from ${file.name}</h1>
    <pre>${textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;
    
    return { htmlContent };
  } catch (err: any) {
    console.error("Failed to process PDF for HTML conversion:", err);
    return { error: `An error occurred while processing the PDF: ${err.message}` };
  }
}
