'use server';

/**
 * @fileOverview An AI agent for checking text plagiarism.
 *
 * - checkPlagiarism - A function that handles the plagiarism checking process.
 * - CheckPlagiarismInput - The input type for the function.
 * - CheckPlagiarismOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckPlagiarismInputSchema = z.object({
  text: z.string().describe("The text content to check for plagiarism."),
});
export type CheckPlagiarismInput = z.infer<typeof CheckPlagiarismInputSchema>;

const SourceSchema = z.object({
    url: z.string().url().describe("The URL of the matched source."),
    title: z.string().optional().describe("The title of the source page."),
    matchPercentage: z.number().min(0).max(100).describe("The percentage of text that matches this source."),
});

const CheckPlagiarismOutputSchema = z.object({
  plagiarismPercentage: z.number().min(0).max(100).describe("The overall plagiarism percentage."),
  sources: z.array(SourceSchema).describe("A list of sources that contain similar text."),
});
export type CheckPlagiarismOutput = z.infer<typeof CheckPlagiarismOutputSchema>;

// This is a placeholder implementation.
// In a real application, you would call a service like Copyleaks API here.
async function fakePlagiarismCheck(text: string): Promise<CheckPlagiarismOutput> {
    const apiKey = process.env.COPYLEAKS_API_KEY;
    
    if (!apiKey) {
        // Return a mock response if no API key is provided.
        // This allows the UI to be tested without a real API key.
        console.warn("COPYLEAKS_API_KEY not found. Returning mock data.");
        
        const hasPlagiarism = text.toLowerCase().includes("plagiarism");
        
        if (hasPlagiarism) {
            return {
                plagiarismPercentage: 27,
                sources: [
                    { url: "https://en.wikipedia.org/wiki/Plagiarism", title: "Plagiarism - Wikipedia", matchPercentage: 15 },
                    { url: "https://www.grammarly.com/plagiarism-checker", title: "Free Plagiarism Checker", matchPercentage: 12 },
                ],
            };
        } else {
             return {
                plagiarismPercentage: 3,
                sources: [
                     { url: "https://www.random.org", title: "A somewhat related source", matchPercentage: 3 },
                ],
            };
        }
    }

    // Replace this with the actual API call to Copyleaks or another service
    const response = await fetch('https://api.copyleaks.com/v3/scans/submit/text', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            properties: {
                sandbox: true, // Use sandbox for testing
                webhooks: {
                    status: 'https://your-server.com/webhook/{STATUS}'
                }
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Copyleaks API Error: ${errorData.message}`);
    }
    
    // In a real implementation, you would need to handle the webhook
    // to get the final result when the scan is complete.
    // For this example, we'll continue with the mock response logic.
    return {
        plagiarismPercentage: 0,
        sources: [],
    };
}


const checkPlagiarismFlow = ai.defineFlow(
  {
    name: 'checkPlagiarismFlow',
    inputSchema: CheckPlagiarismInputSchema,
    outputSchema: CheckPlagiarismOutputSchema,
  },
  async ({ text }) => {
    // In a real scenario, you'd make an API call to a plagiarism service.
    // Since we don't have a live API, we'll use a mock function.
    return await fakePlagiarismCheck(text);
  }
);


export async function checkPlagiarism(input: CheckPlagiarismInput): Promise<CheckPlagiarismOutput> {
  return checkPlagiarismFlow(input);
}
