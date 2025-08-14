
'use server';

import { PDFDocument, degrees } from 'pdf-lib';

interface OrganizePdfState {
  fileDataUri?: string;
  fileName?: string;
  error?: string;
}

export async function organizePdf(prevState: any, formData: FormData): Promise<OrganizePdfState> {
  const file = formData.get("pdf") as File;
  const operation = formData.get("operation") as "split" | "rotate" | "extract";
  
  if (!file || file.size === 0) {
    return { error: "Please select a PDF file." };
  }
  if (file.type !== 'application/pdf') {
    return { error: "Invalid file type. Please upload a PDF." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (operation === 'rotate') {
      const rotation = parseInt(formData.get("rotation") as string, 10);
      pdfDoc.getPages().forEach(page => page.setRotation(degrees(rotation)));
      const pdfBytes = await pdfDoc.save();
      return {
        fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
        fileName: `rotated-${file.name}`
      };
    }

    if (operation === 'extract') {
      const pagesToExtract = (formData.get("pagesToExtract") as string)
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n > 0 && n <= pageCount)
        .map(n => n - 1); // convert to 0-based index

      if (pagesToExtract.length === 0) {
        return { error: "Please enter valid page numbers to extract." };
      }
      
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(pdfDoc, pagesToExtract);
      copiedPages.forEach(page => newDoc.addPage(page));
      
      const pdfBytes = await newDoc.save();
      return {
        fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
        fileName: `extracted-${file.name}`
      };
    }
    
    if (operation === 'split') {
        const splitType = formData.get('splitType') as 'all' | 'ranges';

        if (splitType === 'all') {
            // This is a placeholder. For a real app, you'd generate a ZIP file.
            // For now, we'll just return the first page as a demo.
            const newDoc = await PDFDocument.create();
            const [firstPage] = await newDoc.copyPages(pdfDoc, [0]);
            newDoc.addPage(firstPage);
            const pdfBytes = await newDoc.save();
            return { 
                error: "Splitting into individual pages currently returns the first page only. Full ZIP functionality coming soon!",
                fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
                fileName: `split-page-1-${file.name}`
            };
        }
        // Add range splitting logic here if needed in future
    }


    return { error: "Invalid operation specified." };
  } catch (err: any) {
    console.error("Failed to organize PDF:", err);
    return { error: `An error occurred during processing: ${err.message}` };
  }
}
