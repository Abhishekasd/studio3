"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2 } from "lucide-react";

type CaseType = "lowercase" | "UPPERCASE" | "Sentence case" | "Title Case" | "camelCase" | "PascalCase" | "snake_case" | "kebab-case";

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const toCamelCase = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  };

  const toPascalCase = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str.replace(/\s+/g, '_').toLowerCase();
  };

  const toKebabCase = (str: string) => {
    return str.replace(/\s+/g, '-').toLowerCase();
  };
  
  const handleConvert = (caseType: CaseType) => {
    if (!inputText.trim()) {
      toast({ title: "Input is empty", description: "Please enter some text to convert." });
      return;
    }

    let result = '';
    switch (caseType) {
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'UPPERCASE':
        result = inputText.toUpperCase();
        break;
      case 'Sentence case':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'Title Case':
        result = inputText.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'camelCase':
        result = toCamelCase(inputText);
        break;
      case 'PascalCase':
        result = toPascalCase(inputText);
        break;
      case 'snake_case':
        result = toSnakeCase(inputText);
        break;
      case 'kebab-case':
        result = toKebabCase(inputText);
        break;
    }
    setOutputText(result);
    toast({ title: "Text Converted!", description: `Successfully converted to ${caseType}.` });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    toast({ title: "Copied to clipboard!" });
  };
  
  const caseButtons: CaseType[] = ["lowercase", "UPPERCASE", "Sentence case", "Title Case", "camelCase", "PascalCase", "snake_case", "kebab-case"];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Case Converter</h1>
        <p className="text-muted-foreground text-lg">Change text to uppercase, lowercase, and more.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter the text you want to convert.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[300px] resize-y"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Your converted text will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Result..."
              className="min-h-[300px] resize-y bg-muted"
            />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conversion Options</CardTitle>
          <CardDescription>Select a case to convert your text to.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
            {caseButtons.map(caseType => (
                <Button key={caseType} onClick={() => handleConvert(caseType)} disabled={!inputText}>{caseType}</Button>
            ))}
        </CardContent>
      </Card>
       <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button variant="outline" onClick={handleCopy} disabled={!outputText}>
              <Copy className="mr-2 h-4 w-4" /> Copy Output
            </Button>
            <Button variant="destructive" onClick={handleClear} disabled={!inputText && !outputText}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
        </div>
    </div>
  );
}
