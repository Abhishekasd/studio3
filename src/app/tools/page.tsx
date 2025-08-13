"use client";

import { useState } from "react";
import ToolCard from "@/components/tool-card";
import { tools as allTools, toolCategories } from "@/lib/tool-registry";
import type { Tool } from "@/lib/tool-registry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredTools: Tool[] = allTools
    .filter((tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((tool) =>
      activeCategory === "All" ? true : tool.category === activeCategory
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
              variant={activeCategory === category.name.replace(' Tools','') ? "default" : "outline"}
              onClick={() => setActiveCategory(category.name.replace(' Tools',''))}
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No tools found for your search.</p>
        </div>
      )}
    </div>
  );
}
