
'use server';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface State {
  fileDataUri?: string;
  fileName?: string;
  error?: string;
}

// NOTE: True PDF-to-PowerPoint is incredibly complex.
// This is a placeholder that creates a sample PDF acknowledging the request.
export async function convertPdfToPowerpoint(prevState: any, formData: FormData): Promise<State> {
  const file = formData.get("pdf") as File;
  
  if (!file || file.size === 0) {
    return { error: "Please select a PDF file." };
  }
  if (file.type !== 'application/pdf') {
    return { error: "Invalid file type. Please upload a PDF." };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('PDF to PowerPoint Conversion (Beta)', {
      x: 50,
      y: height - 50,
      font,
      size: 24,
      color: rgb(0.82, 0.28, 0.14) // PowerPoint orange-red color
    });

    page.drawText(`Successfully received file: ${file.name}`, {
      x: 50,
      y: height - 100,
      font,
      size: 14,
    });
    
    page.drawText('Full, high-fidelity .pptx conversion is coming soon!', {
      x: 50,
      y: height - 140,
      font,
      size: 12,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();
    
    return { 
      fileDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`,
      fileName: `converted-sample-${file.name}`
    };

  } catch (err: any) {
    console.error("Failed to process file for pptx conversion:", err);
    return { error: `An error occurred during conversion: ${err.message}` };
  }
}
