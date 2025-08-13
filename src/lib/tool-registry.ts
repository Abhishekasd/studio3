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
    id: "developer-tools",
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Tools for developers and programmers.",
    icon: Code2,
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
  {
    id: "converters",
    name: "Converters",
    slug: "converters",
    description: "Convert between different file formats and units.",
    icon: Wrench,
  },
];

const allTools: Tool[] = [
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    slug: "meta-tag-generator",
    description: "Generate SEO-optimized meta tags for your website using AI.",
    category: "AI Tools",
    categorySlug: "ai-tools",
    href: "/tools/meta-tag-generator",
    icon: ScanSearch,
    ai_powered: true,
    is_featured: true,
    popularity_score: 94,
    created_at: new Date("2024-07-31T12:00:00Z"),
    last_updated: new Date("2024-07-31T12:00:00Z"),
  },
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
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    description: "Generate placeholder text for your designs and mockups.",
    category: "Text Tools",
    categorySlug: "text-tools",
    href: "/tools/lorem-ipsum-generator",
    icon: BookText,
    popularity_score: 75,
    created_at: new Date("2024-07-23T12:00:00Z"),
    last_updated: new Date("2024-07-23T12:00:00Z"),
  },
  {
    id: "slug-generator",
    name: "Slug Generator",
    slug: "slug-generator",
    description: "Create clean, URL-friendly slugs from any text string.",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    href: "/tools/slug-generator",
    icon: Link2,
    popularity_score: 78,
    created_at: new Date("2024-07-22T12:00:00Z"),
    last_updated: new Date("2024-07-22T12:00:00Z"),
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate universally unique identifiers (UUIDs) instantly.",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    href: "/tools/uuid-generator",
    icon: KeyRound,
    popularity_score: 82,
    created_at: new Date("2024-07-21T12:00:00Z"),
    last_updated: new Date("2024-07-21T12:00:00Z"),
  },
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    description: "Create strong, secure, and random passwords for your accounts.",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    href: "/tools/password-generator",
    icon: Lock,
    is_featured: true,
    popularity_score: 95,
    created_at: new Date("2024-07-20T12:00:00Z"),
    last_updated: new Date("2024-07-20T12:00:00Z"),
  },
  {
    id: "palindrome-checker",
    name: "Palindrome Checker",
    slug: "palindrome-checker",
    description: "Check if a word, phrase, or number is a palindrome.",
    category: "Text Tools",
    categorySlug: "text-tools",
    href: "/tools/palindrome-checker",
    icon: ListRestart,
    popularity_score: 70,
    created_at: new Date("2024-07-19T12:00:00Z"),
    last_updated: new Date("2024-07-19T12:00:00Z"),
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, and beautify your JSON data with ease.",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    href: "/tools/json-formatter",
    icon: FileJson2,
    is_featured: true,
    popularity_score: 93,
    created_at: new Date("2024-07-18T12:00:00Z"),
    last_updated: new Date("2024-07-18T12:00:00Z"),
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Create custom QR codes for URLs, text, and more.",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    href: "/tools/qr-code-generator",
    icon: QrCode,
    popularity_score: 87,
    created_at: new Date("2024-07-30T10:00:00Z"),
    last_updated: new Date("2024-07-30T10:00:00Z"),
  },
  {
    id: "image-converter",
    name: "Image Converter",
    slug: "image-converter",
    description: "Convert images between JPG, PNG, WEBP, and other formats.",
    category: "Converters",
    categorySlug: "converters",
    href: "/tools/image-converter",
    icon: FileImage,
    is_featured: true,
    popularity_score: 91,
    created_at: new Date("2024-07-30T11:00:00Z"),
    last_updated: new Date("2024-07-30T11:00:00Z"),
  },
  {
    id: "color-converter",
    name: "Color Converter",
    slug: "color-converter",
    description: "Convert colors between HEX, RGB, and HSL formats.",
    category: "Converters",
    categorySlug: "converters",
    href: "/tools/color-converter",
    icon: Palette,
    popularity_score: 84,
    created_at: new Date("2024-07-30T12:00:00Z"),
    last_updated: new Date("2024-07-30T12:00:00Z"),
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
