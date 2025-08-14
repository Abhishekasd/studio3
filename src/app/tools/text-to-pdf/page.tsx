
"use client";

import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, FileText, Trash2 } from "lucide-react";
import { convertTextToPdf } from './actions';

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
          <FileText className="mr-2 h-4 w-4" />
          Convert to PDF
        </>
      )}
    </Button>
  );
}

export default function TextToPdfPage() {
  const [state, formAction] = useFormState(convertTextToPdf, {});
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleDownload = () => {
    if (!state.pdfDataUri) {
        toast({variant: "destructive", title: "Conversion Failed", description: state.error || "No PDF data to download."});
        return;
    };
    const link = document.createElement("a");
    link.href = state.pdfDataUri;
    link.download = "text.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: "Your PDF has been created and is downloading." });
  };
  
  const handleClear = () => {
    formRef.current?.reset();
    formAction(undefined); // Clear form state
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Text to PDF Converter</h1>
        <p className="text-muted-foreground text-lg">Paste your text below to create a simple PDF document.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <form action={formAction} ref={formRef}>
            <CardHeader>
                <CardTitle>Your Text Content</CardTitle>
                <CardDescription>Enter the text you wish to convert into a PDF. Basic line breaks will be preserved.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    name="text"
                    placeholder="Type or paste your content here..."
                    className="min-h-[400px] resize-y font-mono text-sm"
                    required
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <SubmitButton />
                    <Button onClick={handleClear} variant="outline" type="button" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Clear
                    </Button>
                </div>
                 {state?.pdfDataUri && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full" type="button">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                )}
                {state?.error && (
                    <p className="text-sm text-destructive text-center">{state.error}</p>
                )}
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
