
'use server';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface TextToPdfState {
  pdfDataUri?: string;
  error?: string;
}

export async function convertTextToPdf(prevState: any, formData: FormData): Promise<TextToPdfState> {
  const text = formData.get("text") as string;

  if (!text || text.trim().length === 0) {
    return { error: "Please enter some text to convert." };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const pageMargin = 50;

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const usableWidth = width - 2 * pageMargin;
    let y = height - pageMargin;

    const paragraphs = text.split(/\n\s*\n/);

    for (const paragraph of paragraphs) {
      const lines = paragraph.split('\n');
      for (const line of lines) {
        let currentLine = line;
        while (currentLine.length > 0) {
          if (y < pageMargin) {
            page = pdfDoc.addPage();
            y = height - pageMargin;
          }

          let textWidth = font.widthOfTextAtSize(currentLine, fontSize);
          let breakIndex = currentLine.length;

          while (textWidth > usableWidth) {
            breakIndex = Math.floor(breakIndex * (usableWidth / textWidth));
            let potentialLine = currentLine.substring(0, breakIndex);
            let lastSpace = potentialLine.lastIndexOf(' ');
            
            if (lastSpace > 0) {
                breakIndex = lastSpace;
            }

            textWidth = font.widthOfTextAtSize(currentLine.substring(0, breakIndex), fontSize);
          }
          
          const textToDraw = currentLine.substring(0, breakIndex);
          page.drawText(textToDraw, {
            x: pageMargin,
            y,
            font,
            size: fontSize,
            color: rgb(0, 0, 0),
          });

          y -= fontSize * 1.4; // Line height
          currentLine = currentLine.substring(breakIndex).trim();
        }
      }
      y -= fontSize * 0.7; // Extra space for paragraph break
    }

    const pdfBytes = await pdfDoc.save();
    const pdfDataUri = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
    
    return { pdfDataUri };
    
  } catch (err: any) {
    console.error("Failed to create PDF from text:", err);
    return { error: `An error occurred during PDF creation: ${err.message}` };
  }
}
