
'use server';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

interface PdfEditorState {
  fileDataUri?: string;
  fileName?: string;
  error?: string;
}

// Helper function to parse page ranges like "1, 3-5, 8"
function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const ranges = rangeStr.split(',');

  for (const range of ranges) {
    const trimmedRange = range.trim();
    if (trimmedRange.includes('-')) {
      const [start, end] = trimmedRange.split('-').map(s => parseInt(s.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= maxPages) {
            pages.add(i - 1); // convert to 0-based index
          }
        }
      }
    } else {
      const pageNum = parseInt(trimmedRange, 10);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= maxPages) {
        pages.add(pageNum - 1); // convert to 0-based index
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

// Helper function to parse a page order like "3,1,2,4"
function parsePageOrder(orderStr: string, maxPages: number): number[] | { error: string } {
    const pages = orderStr.split(',').map(s => parseInt(s.trim(), 10));
    const seen = new Set<number>();

    if (pages.some(p => isNaN(p) || p <= 0 || p > maxPages)) {
        return { error: `Invalid page number found. Please only use numbers between 1 and ${maxPages}.` };
    }
    
    for (const page of pages) {
        if (seen.has(page)) {
            return { error: `Page number ${page} is duplicated in the order.` };
        }
        seen.add(page);
    }
    
    // Optional: Check if all pages are included. For rearranging, they should be.
    // if (seen.size !== maxPages) {
    //     return { error: `You must include all ${maxPages} page numbers in the new order.` };
    // }
    
    return pages.map(p => p - 1); // convert to 0-based index
}


export async function processPdf(prevState: any, formData: FormData): Promise<PdfEditorState> {
  const file = formData.get("pdf") as File;
  const operation = formData.get("operation") as "split" | "rotate" | "extract" | "password" | "watermark" | "rearrange" | "unlock";
  
  if (!file || file.size === 0) {
    return { error: "Please select a PDF file." };
  }
  if (file.type !== 'application/pdf') {
    return { error: "Invalid file type. Please upload a PDF." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (operation === 'unlock') {
        const password = formData.get("password") as string;
        if (!password) {
            return { error: "Please provide the password to unlock the PDF." };
        }
        try {
            const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
            const pdfBytes = await pdfDoc.save();
             return {
                fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
                fileName: `unlocked-${file.name}`
            };
        } catch (e: any) {
             if (e.message.includes('password')) {
                return { error: "Incorrect password. Failed to unlock the PDF." };
            }
            throw e; // Re-throw other errors
        }
    }
    
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (operation === 'rearrange') {
        const pageOrderInput = formData.get("pageOrder") as string;
        if (!pageOrderInput) {
            return { error: "Please provide the new page order." };
        }
        const pagesToProcess = parsePageOrder(pageOrderInput, pageCount);
        if ('error' in pagesToProcess) {
            return { error: pagesToProcess.error };
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdfDoc, pagesToProcess);
        copiedPages.forEach(page => newDoc.addPage(page));
        
        const pdfBytes = await newDoc.save();
        return {
            fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
            fileName: `rearranged-${file.name}`
        };
    }

    if (operation === 'rotate') {
      const rotation = parseInt(formData.get("rotation") as string, 10);
      pdfDoc.getPages().forEach(page => page.setRotation(degrees(rotation)));
      const pdfBytes = await pdfDoc.save();
      return {
        fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
        fileName: `rotated-${file.name}`
      };
    }

    if (operation === 'extract' || operation === 'split') {
        const pagesInput = (operation === 'extract' 
            ? formData.get("pagesToExtract") 
            : formData.get("pagesToSplit")) as string;

        if (!pagesInput) {
            return { error: "Please provide page numbers or ranges." };
        }
        
        const pagesToProcess = parsePageRanges(pagesInput, pageCount);

      if (pagesToProcess.length === 0) {
        return { error: "Please enter valid page numbers to process." };
      }
      
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(pdfDoc, pagesToProcess);
      copiedPages.forEach(page => newDoc.addPage(page));
      
      const pdfBytes = await newDoc.save();
      const actionName = operation === 'extract' ? 'extracted' : 'split';
      return {
        fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
        fileName: `${actionName}-${file.name}`
      };
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
