"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ToolCard from "@/components/tool-card";
import { getTools, getToolCategories } from "@/lib/tool-registry";
import type { Tool, ToolCategory } from "@/lib/tool-registry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

function ToolsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [toolCategories, setToolCategories] = useState<ToolCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || "All");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [tools, categories] = await Promise.all([getTools(), getToolCategories()]);
      setAllTools(tools);
      setToolCategories(categories);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setActiveCategory(categoryParam || "All");
  }, [categoryParam]);

  const filteredTools: Tool[] = allTools
    .filter((tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((tool) =>
      activeCategory === "All" ? true : tool.categorySlug === activeCategory
    );
    
  // A new interface to handle categorySlug
  interface ExtendedTool extends Tool {
    categorySlug?: string;
  }
  const toolsWithCategorySlug: ExtendedTool[] = allTools.map(tool => {
      const category = toolCategories.find(c => c.name === tool.category);
      return { ...tool, categorySlug: category?.slug };
  });


  const finalFilteredTools: ExtendedTool[] = toolsWithCategorySlug
    .filter((tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((tool) =>
      activeCategory === "All" ? true : tool.categorySlug === activeCategory
    );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Tool-O-Pedia</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our comprehensive suite of tools designed to streamline your workflow and boost productivity.
        </p>
      </section>

      <div className="sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-4 mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a tool..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            onClick={() => setActiveCategory("All")}
          >
            All
          </Button>
          {toolCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? "default" : "outline"}
              onClick={() => setActiveCategory(category.slug)}
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
         <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">Loading tools...</p>
        </div>
      ) : finalFilteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {finalFilteredTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No tools found.</p>
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolsPageContent />
    </Suspense>
  );
}
