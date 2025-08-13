"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Copy, Trash2, Wand2 } from "lucide-react";

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleFormat = () => {
    try {
      if (!jsonInput.trim()) {
        setIsValid(null);
        toast({ title: "Input is empty", description: "Please paste some JSON to format." });
        return;
      }
      const parsedJson = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsedJson, null, 2));
      setIsValid(true);
      toast({
        title: "JSON Formatted",
        description: "Your JSON data has been successfully formatted.",
      });
    } catch (error) {
      setIsValid(false);
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: "Could not parse the JSON data. Please check for syntax errors.",
      });
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setIsValid(null);
  };
  
  const handleCopy = () => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">JSON Formatter & Validator</h1>
        <p className="text-muted-foreground text-lg">Easily format, validate, and beautify your JSON data.</p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>JSON Editor</CardTitle>
          <CardDescription>Paste your JSON code below. It will be validated and formatted automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "key": "value" }'
              className="min-h-[400px] font-mono text-sm resize-y"
            />
            {isValid === true && (
              <CheckCircle className="absolute top-3 right-3 h-6 w-6 text-green-500" />
            )}
            {isValid === false && (
              <XCircle className="absolute top-3 right-3 h-6 w-6 text-red-500" />
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-end">
            <Button variant="outline" onClick={handleCopy} disabled={!jsonInput}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!jsonInput}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
            <Button onClick={handleFormat} disabled={!jsonInput}>
              <Wand2 className="mr-2 h-4 w-4" /> Format
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
