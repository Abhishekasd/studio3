import {
  type LucideIcon,
  CaseSensitive,
  FileImage,
  FileJson2,
  FileText,
  Search,
  Wrench,
  Calculator,
  ScanSearch,
  Palette,
  Code2,
  Type,
  Heading1,
  QrCode,
  ALargeSmall,
  Link2,
  ListRestart,
} from "lucide-react";

export interface Tool {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: "Text" | "Image" | "Coding" | "SEO" | "Utility";
}

export interface ToolCategory {
  id: "text" | "image" | "coding" | "seo" | "utility";
  name: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
}

export const tools: Tool[] = [
  {
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs in your text.",
    href: "/tools/word-counter",
    icon: Type,
    category: "Text",
  },
  {
    name: "Case Converter",
    description: "Convert text between different letter cases like uppercase, lowercase, and more.",
    href: "/tools/case-converter",
    icon: ALargeSmall,
    category: "Text",
  },
  {
    name: "Slug Generator",
    description: "Create search-engine friendly URL slugs from your text.",
    href: "/tools/slug-generator",
    icon: Link2,
    category: "Text",
  },
    {
    name: "Palindrome Checker",
    description: "Check if a word, phrase, or number is a palindrome.",
    href: "/tools/palindrome-checker",
    icon: ListRestart,
    category: "Text",
  },
  {
    name: "Image Converter",
    description: "Convert images from PNG to JPG format quickly and easily.",
    href: "/tools/image-converter",
    icon: FileImage,
    category: "Image",
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes for URLs, text, and other data instantly.",
    href: "/tools/qr-code-generator",
    icon: QrCode,
    category: "Image",
  },
  {
    name: "JSON Formatter",
    description: "Format and validate your JSON data to make it readable and error-free.",
    href: "/tools/json-formatter",
    icon: FileJson2,
    category: "Coding",
  },
  {
    name: "Meta Tag Generator",
    description: "Generate SEO-friendly meta tags for your web pages using AI.",
    href: "/tools/meta-tag-generator",
    icon: Heading1,
    category: "SEO",
  },
];

export const toolCategories: Omit<ToolCategory, 'tools'>[] = [
    {
      id: "text",
      name: "Text Tools",
      description: "Manipulate and analyze text.",
      icon: FileText,
    },
    {
      id: "image",
      name: "Image Tools",
      description: "Convert, resize, and optimize images.",
      icon: Palette,
    },
    {
      id: "coding",
      name: "Developer Tools",
      description: "Format code, test regex, and more.",
      icon: Code2,
    },
    {
      id: "seo",
      name: "SEO Tools",
      description: "Optimize your site for search engines.",
      icon: ScanSearch,
    },
    {
      id: "utility",
      name: "Utilities",
      description: "Handy tools for everyday tasks.",
      icon: Wrench,
    },
];

export const toolsByCategory = toolCategories.map(category => ({
    ...category,
    tools: tools.filter(tool => tool.category === category.name.replace(' Tools', ''))
}));
