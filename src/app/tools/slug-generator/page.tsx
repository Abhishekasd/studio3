"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2, Wand2 } from "lucide-react";
import { Label } from '@/components/ui/label';

export default function SlugGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [slug, setSlug] = useState('');
  const { toast } = useToast();

  const generateSlug = () => {
    if (!inputText.trim()) {
      toast({ title: "Input is empty", description: "Please enter some text to generate a slug." });
      return;
    }

    const newSlug = inputText
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
      .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes

    setSlug(newSlug);
    toast({ title: "Slug Generated!", description: "Your URL-friendly slug is ready." });
  };

  const handleClear = () => {
    setInputText('');
    setSlug('');
  };

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Slug Generator</h1>
        <p className="text-muted-foreground text-lg">Create clean and SEO-friendly URL slugs.</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate a Slug</CardTitle>
          <CardDescription>Enter your page title or text to convert it into a URL-safe slug.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="input-text">Your Text</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., My Awesome Blog Post Title"
              className="min-h-[100px] resize-y"
            />
          </div>
          <Button onClick={generateSlug} disabled={!inputText} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" /> Generate Slug
          </Button>
          {slug && (
            <div className="grid gap-2">
              <Label htmlFor="slug-output">Generated Slug</Label>
              <div className="relative">
                <Input id="slug-output" value={slug} readOnly className="pr-10" />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardContent className="flex flex-wrap gap-2 justify-end pt-0">
           <Button variant="outline" onClick={handleClear} disabled={!inputText && !slug}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
