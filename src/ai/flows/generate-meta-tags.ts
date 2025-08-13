'use server';

/**
 * @fileOverview An SEO meta tag generation AI agent.
 *
 * - generateMetaTags - A function that handles the meta tag generation process.
 * - GenerateMetaTagsInput - The input type for the generateMetaTags function.
 * - GenerateMetaTagsOutput - The return type for the generateMetaTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMetaTagsInputSchema = z.object({
  description: z.string().describe('A brief description of the web page content.'),
  keywords: z.string().describe('Comma-separated keywords related to the web page.'),
  title: z.string().describe('The title of the web page.'),
});

export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  metaTags: z.string().describe('SEO-optimized meta tags for the web page.'),
});

export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  return generateMetaTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMetaTagsPrompt',
  input: {schema: GenerateMetaTagsInputSchema},
  output: {schema: GenerateMetaTagsOutputSchema},
  prompt: `You are an SEO expert specializing in creating effective meta tags for web pages.

  Based on the provided description, keywords, and title, generate SEO-optimized meta tags for the web page.
  Ensure the meta tags are well-structured and include relevant information to improve search engine ranking.

  Description: {{{description}}}
  Keywords: {{{keywords}}}
  Title: {{{title}}}

  Return only the meta tags as a string.

  Example:
  <meta name="description" content="A brief description of the web page content.">
  <meta name="keywords" content="keywords related to the web page">
  <title>The title of the web page</title>`,
});

const generateMetaTagsFlow = ai.defineFlow(
  {
    name: 'generateMetaTagsFlow',
    inputSchema: GenerateMetaTagsInputSchema,
    outputSchema: GenerateMetaTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
