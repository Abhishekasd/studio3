
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2, Wand2 } from "lucide-react";
import { format } from "prettier/standalone";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleFormat = async () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please paste some JSON to format." });
      return;
    }
    try {
      const formatted = await format(input, {
        parser: "json",
        plugins: [prettierPluginBabel, prettierPluginEstree],
        // Prettier options
        semi: false,
        singleQuote: false,
        tabWidth: 2,
      });
      setOutput(formatted);
      toast({
        title: "JSON Formatted",
        description: `Your JSON has been successfully formatted.`,
      });
    } catch (error: any) {
      setOutput(`// Formatting Error:\n// ${error.message}\n\n${input}`);
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: `Could not parse the JSON data. Please check for syntax errors.`,
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };
  
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">JSON Formatter</h1>
        <p className="text-muted-foreground text-lg">Easily format, validate, and beautify your JSON data.</p>
      </div>

      <Card className="max-w-6xl mx-auto">
        <CardHeader>
            <CardTitle>JSON Formatter & Validator</CardTitle>
            <CardDescription>Paste your JSON code below and click format.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
                <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your JSON here...`}
                className="min-h-[400px] font-mono text-sm resize-y"
                />
                <Textarea
                value={output}
                readOnly
                placeholder="Formatted JSON will appear here..."
                className="min-h-[400px] font-mono text-sm resize-y bg-muted"
                />
            </div>
             <div className="flex flex-wrap gap-2 mt-4 justify-end">
                <Button variant="outline" onClick={handleCopy} disabled={!output}>
                <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={!input}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button onClick={handleFormat} disabled={!input}>
                <Wand2 className="mr-2 h-4 w-4" /> Format
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
