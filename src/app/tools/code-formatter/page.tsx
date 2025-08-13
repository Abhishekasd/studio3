
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
import * as prettierPluginHtml from "prettier/plugins/html";
import * as prettierPluginCss from "prettier/plugins/postcss";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type ParserType = "json" | "html" | "css" | "javascript";

const parsers: Record<ParserType, any> = {
  json: { parser: "json", plugins: [prettierPluginBabel, prettierPluginEstree] },
  html: { parser: "html", plugins: [prettierPluginHtml] },
  css: { parser: "css", plugins: [prettierPluginCss] },
  javascript: { parser: "babel", plugins: [prettierPluginBabel, prettierPluginEstree] },
}

export default function CodeFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<ParserType>("json");
  const { toast } = useToast();

  const handleFormat = async () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please paste some code to format." });
      return;
    }
    try {
      const { parser, plugins } = parsers[language];
      const formatted = await format(input, {
        parser,
        plugins,
        // Prettier options
        semi: true,
        singleQuote: true,
        tabWidth: 2,
      });
      setOutput(formatted);
      toast({
        title: "Code Formatted",
        description: `Your ${language.toUpperCase()} has been successfully formatted.`,
      });
    } catch (error: any) {
      setOutput(`// Formatting Error:\n// ${error.message}\n\n${input}`);
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: `Could not parse the ${language.toUpperCase()} data. Please check for syntax errors.`,
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
        <h1 className="text-4xl font-bold font-headline">Code Formatter</h1>
        <p className="text-muted-foreground text-lg">Easily format, validate, and beautify your code.</p>
      </div>

      <Card className="max-w-6xl mx-auto">
        <CardHeader>
            <CardTitle>Formatter</CardTitle>
            <CardDescription>Select a language, paste your code, and click format.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
                <div className='space-y-4'>
                    <div className="grid gap-2">
                        <Label>Language</Label>
                        <Select value={language} onValueChange={(v) => setLanguage(v as ParserType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select language..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="css">CSS</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Paste your ${language.toUpperCase()} here...`}
                    className="min-h-[400px] font-mono text-sm resize-y"
                    />
                </div>
                <div className='space-y-4'>
                    <div className='h-9'></div>
                     <Textarea
                    value={output}
                    readOnly
                    placeholder="Formatted code will appear here..."
                    className="min-h-[400px] font-mono text-sm resize-y bg-muted"
                    />
                </div>
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
