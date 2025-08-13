import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/generate-meta-tags.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/remove-image-background.ts';
import '@/ai/flows/plagiarism-checker.ts';
