
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Palette,
  Code2,
  ScanSearch,
  Wrench,
  CaseSensitive,
  FileImage,
  FileJson2,
  Search,
  Calculator,
  Type,
  Heading1,
  QrCode,
  ALargeSmall,
  Link2,
  ListRestart,
  KeyRound,
  Paintbrush,
  BookText,
  Lock,
  Bot,
  AudioLines,
  HeartPulse,
  Landmark,
} from "lucide-react";

// Define interfaces for our data structures
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  href: string;
  icon: LucideIcon;
  ai_powered?: boolean;
  is_featured?: boolean;
  popularity_score: number;
  created_at: Date;
  last_updated: Date;
}

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

const toolCategories: ToolCategory[] = [
  {
    id: "text-tools",
    name: "Text Tools",
    slug: "text-tools",
    description: "Tools for manipulating and analyzing text.",
    icon: FileText,
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    slug: "ai-tools",
    description: "Harness the power of AI with these smart tools.",
    icon: Bot,
  },
  {
    id: "calculators",
    name: "Calculators",
    slug: "calculators",
    description: "Perform various calculations for finance, health, and more.",
    icon: Calculator,
  },
];

const allTools: Tool[] = [
  {
    id: "text-to-speech",
    name: "Text-to-Speech Converter",
    slug: "text-to-speech",
    description: "Convert text into natural-sounding speech with our AI-powered TTS tool.",
    category: "AI Tools",
    categorySlug: "ai-tools",
    href: "/tools/text-to-speech",
    icon: AudioLines,
    ai_powered: true,
    is_featured: true,
    popularity_score: 90,
    created_at: new Date("2024-07-28T12:00:00Z"),
    last_updated: new Date("2024-07-28T12:00:00Z"),
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    slug: "bmi-calculator",
    description: "Check your Body Mass Index to assess your health.",
    category: "Calculators",
    categorySlug: "calculators",
    href: "/tools/bmi-calculator",
    icon: HeartPulse,
    popularity_score: 88,
    created_at: new Date("2024-07-27T12:00:00Z"),
    last_updated: new Date("2024-07-27T12:00:00Z"),
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    slug: "loan-calculator",
    description: "Estimate your monthly loan payments and total interest.",
    category: "Calculators",
    categorySlug: "calculators",
    href: "/tools/loan-calculator",
    icon: Landmark,
    is_featured: true,
    popularity_score: 92,
    created_at: new Date("2024-07-26T12:00:00Z"),
    last_updated: new Date("2024-07-26T12:00:00Z"),
  },
  {
    id: "case-converter",
    name: "Case Converter",
    slug: "case-converter",
    description: "Change text to uppercase, lowercase, title case, and more.",
    category: "Text Tools",
    categorySlug: "text-tools",
    href: "/tools/case-converter",
    icon: CaseSensitive,
    is_featured: true,
    popularity_score: 85,
    created_at: new Date("2024-07-25T12:00:00Z"),
    last_updated: new Date("2024-07-25T12:00:00Z"),
  },
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    description: "Count words, characters, sentences, and paragraphs in your text.",
    category: "Text Tools",
    categorySlug: "text-tools",
    href: "/tools/word-counter",
    icon: ALargeSmall,
    popularity_score: 80,
    created_at: new Date("2024-07-24T12:00:00Z"),
    last_updated: new Date("2024-07-24T12:00:00Z"),
  },
];

// Function to get tools (now from local array)
export async function getTools(): Promise<Tool[]> {
  // Sort by popularity score by default
  const sortedTools = allTools.sort((a, b) => b.popularity_score - a.popularity_score);
  return Promise.resolve(sortedTools);
}

// Function to get categories (now from local array)
export async function getToolCategories(): Promise<ToolCategory[]> {
  return Promise.resolve(toolCategories);
}
