
'use server';

import { PDFDocument } from 'pdf-lib';

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
}

interface InspectState {
  metadata?: PdfMetadata;
  error?: string;
  pdfDataUri?: string;
  fileName?: string;
}

export async function inspectPdfMetadata(prevState: any, formData: FormData): Promise<InspectState> {
  const file = formData.get("pdf") as File;
  if (!file || file.type !== 'application/pdf') {
    return { error: "Please select a valid PDF file." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const metadata: PdfMetadata = {
      title: pdfDoc.getTitle(),
      author: pdfDoc.getAuthor(),
      subject: pdfDoc.getSubject(),
      keywords: pdfDoc.getKeywords(),
      creator: pdfDoc.getCreator(),
      producer: pdfDoc.getProducer(),
      creationDate: pdfDoc.getCreationDate()?.toISOString(),
      modificationDate: pdfDoc.getModificationDate()?.toISOString(),
    };

    const pdfDataUri = `data:application/pdf;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    return { metadata, pdfDataUri, fileName: file.name };

  } catch (err: any) {
    return { error: `Failed to inspect PDF: ${err.message}` };
  }
}


interface UpdateState {
    updatedPdfDataUri?: string;
    error?: string;
}

export async function updatePdfMetadata(prevState: any, formData: FormData): Promise<UpdateState> {
    const pdfDataUri = formData.get('pdfDataUri') as string;
    if (!pdfDataUri) {
        return { error: 'Original PDF data is missing.' };
    }
    
    try {
        const existingPdfBytes = await fetch(pdfDataUri).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Update metadata fields if they are present in the form
        const title = formData.get('title') as string;
        if (title) pdfDoc.setTitle(title);

        const author = formData.get('author') as string;
        if (author) pdfDoc.setAuthor(author);

        const subject = formData.get('subject') as string;
        if (subject) pdfDoc.setSubject(subject);
        
        const keywords = formData.get('keywords') as string;
        if (keywords) pdfDoc.setKeywords(keywords);

        const creator = formData.get('creator') as string;
        if (creator) pdfDoc.setCreator(creator);

        // We don't typically allow editing producer, creation, or modification date
        // as they are usually system-managed.

        const pdfBytes = await pdfDoc.save();
        return {
            updatedPdfDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`
        };

    } catch(err: any) {
        return { error: `Failed to update PDF metadata: ${err.message}` };
    }
}
