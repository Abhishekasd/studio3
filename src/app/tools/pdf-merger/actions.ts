
'use server';

import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(prevState: any, formData: FormData): Promise<{ mergedPdfDataUri?: string; error?: string }> {
  const files = formData.getAll("pdfs") as File[];

  if (files.length < 2) {
    return { error: "Please select at least two PDF files to merge." };
  }

  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfDataUri = `data:application/pdf;base64,${Buffer.from(mergedPdfBytes).toString('base64')}`;
    
    return { mergedPdfDataUri };
  } catch (err: any) {
    console.error("Failed to merge PDFs:", err);
    return { error: `An error occurred during merging: ${err.message}` };
  }
}
