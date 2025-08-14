
'use server';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

interface PdfEditorState {
  fileDataUri?: string;
  fileName?: string;
  error?: string;
}

export async function processPdf(prevState: any, formData: FormData): Promise<PdfEditorState> {
  const file = formData.get("pdf") as File;
  const operation = formData.get("operation") as "split" | "rotate" | "extract" | "password" | "watermark";
  
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
    }

    if(operation === 'password') {
        const password = formData.get('password') as string;
        if (!password) {
            return { error: 'Password cannot be empty.'}
        }
        pdfDoc.encrypt({
            userPassword: password,
            ownerPassword: password,
            permissions: {},
        });
        const pdfBytes = await pdfDoc.save();
        return {
            fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
            fileName: `protected-${file.name}`
        };
    }

    if(operation === 'watermark') {
        const watermarkText = formData.get('watermarkText') as string;
        if (!watermarkText) {
            return { error: 'Watermark text cannot be empty.'}
        }
        
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawText(watermarkText, {
                x: width / 2 - 150,
                y: height / 2,
                font,
                size: 50,
                color: rgb(0.75, 0.75, 0.75),
                opacity: 0.5,
                rotate: degrees(45),
            });
        }
        
        const pdfBytes = await pdfDoc.save();
        return {
            fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
            fileName: `watermarked-${file.name}`
        };
    }


    return { error: "Invalid operation specified." };
  } catch (err: any) {
    console.error("Failed to organize PDF:", err);
    return { error: `An error occurred during processing: ${err.message}` };
  }
}
