
'use server';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface HtmlToPdfState {
    pdfDataUri?: string;
    error?: string;
    fileName?: string;
}

// NOTE: True HTML-to-PDF is incredibly complex and requires a headless browser.
// This is a placeholder that creates a sample PDF acknowledging the request.
export async function convertHtmlToPdf(prevState: any, formData: FormData): Promise<HtmlToPdfState> {
  const url = formData.get("url") as string;

  if (!url || !url.trim()) {
    return { error: "Please enter a valid URL." };
  }
  
  let validUrl: URL;
  try {
    validUrl = new URL(url);
  } catch (_) {
    return { error: "The provided URL is not valid. Please include http:// or https://" };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    page.drawText('HTML to PDF Conversion (Beta)', {
      x: 50,
      y: height - 50,
      font,
      size: 24,
      color: rgb(0.1, 0.5, 0.9)
    });

    page.drawText(`Successfully received URL:`, {
      x: 50,
      y: height - 100,
      font,
      size: 14,
    });
     page.drawText(validUrl.href, {
      x: 50,
      y: height - 120,
      font,
      size: 12,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    page.drawText('Full, high-fidelity conversion is coming soon!', {
      x: 50,
      y: height - 160,
      font,
      size: 12,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();
    const pdfDataUri = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
    const fileName = `${validUrl.hostname}.pdf`;
    
    return { pdfDataUri, fileName };
    
  } catch (err: any) {
    console.error("Failed to process file:", err);
    return { error: `An error occurred during conversion: ${err.message}` };
  }
}
