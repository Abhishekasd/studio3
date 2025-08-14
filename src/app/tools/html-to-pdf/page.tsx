
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Trash2, Link as LinkIcon } from "lucide-react";
import { convertHtmlToPdf } from './actions';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Converting...
        </>
      ) : (
        <>
          <LinkIcon className="mr-2 h-4 w-4" />
          Convert to PDF
        </>
      )}
    </Button>
  );
}

export default function HtmlToPdfPage() {
  const [state, formAction] = useFormState(convertHtmlToPdf, {});
  const [url, setUrl] = useState('');
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleDownload = () => {
    if (!state.pdfDataUri) return;
    const link = document.createElement("a");
    link.href = state.pdfDataUri;
    link.download = state.fileName || "webpage.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleClear = () => {
    setUrl('');
    formRef.current?.reset();
    formAction({}); // Clear state
  }

  useEffect(() => {
    if (state?.error) {
       toast({ variant: "destructive", title: "Conversion Failed", description: state.error });
    }
    if (state?.pdfDataUri) {
         toast({ title: "Conversion Successful!", description: "Your PDF is ready for download." });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">HTML to PDF Converter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Enter a URL to convert a live webpage into a PDF document. Note: This feature is in beta.
        </p>
      </div>

      <Card className="max-w-xl mx-auto">
        <form action={formAction} ref={formRef}>
            <CardHeader>
                <CardTitle>Enter Webpage URL</CardTitle>
                <CardDescription>Provide the full URL of the webpage you want to convert.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>
                
                <div className="flex gap-2">
                    <SubmitButton />
                    <Button onClick={handleClear} variant="outline" type="button" disabled={!url}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
                
                {state.pdfDataUri && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full" type="button">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                )}
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
