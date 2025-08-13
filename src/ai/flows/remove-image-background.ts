'use server';

/**
 * @fileOverview An AI agent for removing image backgrounds.
 *
 * - removeImageBackground - A function that handles the background removal process.
 * - RemoveImageBackgroundInput - The input type for the function.
 * - RemoveImageBackgroundOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RemoveImageBackgroundInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the subject, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveImageBackgroundInput = z.infer<typeof RemoveImageBackgroundInputSchema>;

const RemoveImageBackgroundOutputSchema = z.object({
  processedImageDataUri: z.string().describe("The processed image with the background removed, as a data URI."),
});
export type RemoveImageBackgroundOutput = z.infer<typeof RemoveImageBackgroundOutputSchema>;

export async function removeImageBackground(input: RemoveImageBackgroundInput): Promise<RemoveImageBackgroundOutput> {
  return removeImageBackgroundFlow(input);
}

const removeImageBackgroundFlow = ai.defineFlow(
  {
    name: 'removeImageBackgroundFlow',
    inputSchema: RemoveImageBackgroundInputSchema,
    outputSchema: RemoveImageBackgroundOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.REMOVAL_AI_API_KEY;
    if (!apiKey) {
      throw new Error("REMOVAL_AI_API_KEY is not configured.");
    }
    
    // Convert data URI to Blob
    const fetchResponse = await fetch(input.imageDataUri);
    const blob = await fetchResponse.blob();

    const formData = new FormData();
    formData.append('image_file', blob);

    const response = await fetch('https://api.removal.ai/3.0/remove', {
      method: 'POST',
      headers: {
        'Rm-Token': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.statusText} - ${errorText}`);
    }

    const resultBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(resultBuffer).toString('base64');
    const mimeType = response.headers.get('Content-Type') || 'image/png';
    
    return {
      processedImageDataUri: `data:${mimeType};base64,${base64Image}`,
    };
  }
);
