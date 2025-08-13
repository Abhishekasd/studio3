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
} from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";


// Mapping from string names to Lucide icon components
const iconMap: { [key: string]: LucideIcon } = {
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
  KeyRound,
  Paintbrush,
  BookText,
  Lock,
  // Add other icons here as needed
};

// Define interfaces for our data structures
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  href: string; // Corresponds to 'route' in Firestore
  icon: LucideIcon;
}

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

// Function to fetch tools from Firestore
export async function getTools(): Promise<Tool[]> {
  const toolsCollection = collection(db, "tools");
  const q = query(toolsCollection, orderBy("popularity_score", "desc"));
  const toolSnapshot = await getDocs(q);
  return toolSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: data.category,
      href: data.route,
      icon: iconMap[data.icon_name] || Wrench, // Fallback to a default icon
    };
  });
}

// Function to fetch categories from Firestore
export async function getToolCategories(): Promise<ToolCategory[]> {
  const categoriesCollection = collection(db, "categories");
  const categorySnapshot = await getDocs(categoriesCollection);
  return categorySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: iconMap[data.icon_name] || Wrench, // Fallback to a default icon
    };
  });
}
