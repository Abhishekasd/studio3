
'use server';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// NOTE: True PowerPoint-to-PDF is incredibly complex.
// This is a placeholder that creates a sample PDF acknowledging the upload.
export async function convertPowerPointToPdf(prevState: any, formData: FormData): Promise<{ pdfDataUri?: string; error?: string }> {
  const file = formData.get("doc") as File;

  if (!file || file.size === 0) {
    return { error: "Please select a PowerPoint file to convert." };
  }
  
  const acceptedTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  if (!acceptedTypes.includes(file.type)) {
     return { error: "Invalid file type. Please upload a .pptx file." };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    page.drawText('PowerPoint to PDF Conversion (Beta)', {
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
    
    page.drawText('Full, high-fidelity conversion is coming soon!', {
      x: 50,
      y: height - 140,
      font,
      size: 12,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();
    const pdfDataUri = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
    
    return { pdfDataUri };
    
  } catch (err: any) {
    console.error("Failed to process file:", err);
    return { error: `An error occurred during conversion: ${err.message}` };
  }
}
