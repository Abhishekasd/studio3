
'use server';

/**
 * @fileOverview An AI agent for extracting text from scanned PDFs using OCR.
 *
 * - ocrPdf - A function that handles the OCR process.
 * - OcrPdfInput - The input type for the function.
 * - OcrPdfOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OcrPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type OcrPdfInput = z.infer<typeof OcrPdfInputSchema>;

const OcrPdfOutputSchema = z.object({
  extractedText: z.string().describe("The extracted text content from the PDF."),
});
export type OcrPdfOutput = z.infer<typeof OcrPdfOutputSchema>;


const ocrPdfFlow = ai.defineFlow(
  {
    name: 'ocrPdfFlow',
    inputSchema: OcrPdfInputSchema,
    outputSchema: OcrPdfOutputSchema,
  },
  async ({ pdfDataUri }) => {
    const llmResponse = await ai.generate({
      prompt: "Extract all text from the following document. Preserve line breaks and paragraph structure as best as possible.",
      history: [
        {
          role: 'user',
          content: [{ media: { url: pdfDataUri, contentType: 'application/pdf' } }],
        },
      ],
    });

    return {
      extractedText: llmResponse.text,
    };
  }
);

export async function ocrPdf(input: OcrPdfInput): Promise<OcrPdfOutput> {
  return ocrPdfFlow(input);
}
