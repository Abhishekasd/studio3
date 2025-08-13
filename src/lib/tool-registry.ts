
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
  AudioLines
} from "lucide-react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
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
  Bot,
  AudioLines,
  // Add other icons here as needed
};

// Define interfaces for our data structures
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug?: string;
  href: string; // Corresponds to 'route' in Firestore
  icon: LucideIcon;
  ai_powered?: boolean;
  is_featured?: boolean;
  popularity_score?: number;
  created_at?: Date;
  last_updated?: Date;
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
  try {
    const toolsCollection = collection(db, "tools");
    const q = query(toolsCollection, orderBy("popularity_score", "desc"));
    const toolSnapshot = await getDocs(q);
    
    // Fetch categories once to map category name to slug
    const categories = await getToolCategories();
    const categorySlugMap = new Map(categories.map(c => [c.name, c.slug]));

    return toolSnapshot.docs.map(doc => {
      const data = doc.data();
      
      const toDate = (timestamp: any): Date | undefined => {
          if (timestamp instanceof Timestamp) {
              return timestamp.toDate();
          }
          return undefined;
      }

      return {
        id: doc.id,
        name: data.name || "Unnamed Tool",
        slug: data.slug || "",
        description: data.description || "",
        category: data.category || "General",
        categorySlug: categorySlugMap.get(data.category) || "general",
        href: data.route || `/tools/${data.slug}`,
        icon: iconMap[data.icon_name] || Wrench, // Fallback to a default icon
        ai_powered: data.ai_powered || false,
        is_featured: data.is_featured || false,
        popularity_score: data.popularity_score || 0,
        created_at: toDate(data.created_at),
        last_updated: toDate(data.last_updated),
      };
    });
  } catch (error) {
    console.error("Error fetching tools:", error);
    return []; // Return empty array on error
  }
}

// Function to fetch categories from Firestore
export async function getToolCategories(): Promise<ToolCategory[]> {
  try {
    const categoriesCollection = collection(db, "categories");
    const categorySnapshot = await getDocs(categoriesCollection);
    return categorySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Unnamed Category",
        slug: data.slug || "",
        description: data.description || "",
        icon: iconMap[data.icon_name] || Wrench, // Fallback to a default icon
      };
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return empty array on error
  }
}
