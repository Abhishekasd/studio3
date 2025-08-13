"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Wand2 } from "lucide-react";

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function LoremIpsumGeneratorPage() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [generatedText, setGeneratedText] = useState("");
  const { toast } = useToast();

  const generateText = () => {
    if (count <= 0) {
      toast({ variant: "destructive", title: "Invalid number", description: "Please enter a number greater than 0." });
      return;
    }

    let result = "";
    const words = loremIpsumText.split(" ");
    const sentences = loremIpsumText.split(/(?<=[.?!])\s+/);

    switch (type) {
      case "paragraphs":
        result = Array(count).fill(loremIpsumText).join("\n\n");
        break;
      case "sentences":
        result = Array(count).fill(0).map((_, i) => sentences[i % sentences.length]).join(" ");
        break;
      case "words":
        result = Array(count).fill(0).map((_, i) => words[i % words.length]).join(" ");
        break;
    }
    
    setGeneratedText(result);
    toast({ title: "Text Generated", description: `Generated ${count} ${type}.` });
  };
  
  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground text-lg">Generate placeholder text for your designs.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Generator Options</CardTitle>
          <CardDescription>Specify what you want to generate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="grid gap-2 flex-grow">
              <Label htmlFor="count">Number</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10)))}
                min="1"
              />
            </div>
            <div className="grid gap-2 w-full sm:w-[200px]">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="words">Words</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generateText} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" /> Generate
          </Button>
        </CardContent>
      </Card>
      
      {generatedText && (
        <Card className="max-w-3xl mx-auto mt-8">
          <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle>Generated Text</CardTitle>
                <CardDescription>Here is your generated Lorem Ipsum text.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedText}
              readOnly
              className="min-h-[200px] resize-y bg-muted"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
