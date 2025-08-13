
"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, Loader2, Trash2 } from "lucide-react";
import type { Buffer } from 'buffer';

// Lazily import docx-pdf to handle environments where it might fail
let docx: ((buffer: Buffer, callback: (err: any, result: Buffer | null) => void) => void) | null = null;
try {
  docx = require('docx-pdf');
} catch (e) {
  console.error("Could not load docx-pdf library. The Word to PDF tool may not be available.", e);
}


async function convertWordToPdf(prevState: any, formData: FormData): Promise<{ pdfDataUri?: string; error?: string }> {
  'use server';
  
  if (!docx) {
    return { error: "The converter is not available in this environment due to incompatible dependencies. This feature works best in a local development setup." };
  }

  const file = formData.get("doc") as File;

  if (!file || file.size === 0) {
    return { error: "Please select a Word document to convert." };
  }
  
  if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
     return { error: "Invalid file type. Please upload a .docx file." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve) => {
        docx!(buffer, (err, result) => {
            if (err) {
                console.error("Conversion error:", err);
                resolve({ error: "Failed to convert the document. It might be corrupted or in an unsupported format." });
            } else if (result) {
                 const pdfDataUri = `data:application/pdf;base64,${result.toString('base64')}`;
                 resolve({ pdfDataUri });
            } else {
                 resolve({ error: "Conversion resulted in an empty file." });
            }
        });
    });
    
  } catch (err: any) {
    console.error("Failed to process file:", err);
    return { error: `An error occurred during conversion: ${err.message}` };
  }
}

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

export default function WordToPdfPage() {
  const [state, formAction] = useFormState(convertWordToPdf, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };
  
  const handleDownload = () => {
    if (!state.pdfDataUri || !selectedFile) return;
    const link = document.createElement("a");
    link.href = state.pdfDataUri;
    const newName = selectedFile.name.replace(/\.docx$/, '.pdf');
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    if(document.getElementById('file-upload')) {
        (document.getElementById('file-upload') as HTMLInputElement).value = "";
    }
  }

  useState(() => {
    if (state.error) {
       toast({ variant: "destructive", title: "Conversion Failed", description: state.error });
    }
    if (state.pdfDataUri) {
         toast({ title: "Conversion Successful!", description: "Your PDF is ready for download." });
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Word to PDF Converter</h1>
        <p className="text-muted-foreground text-lg">Convert .docx files to PDF documents instantly.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <form action={formAction}>
            <CardHeader>
                <CardTitle>Upload Word Document</CardTitle>
                <CardDescription>Select the .docx file you want to convert.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">{selectedFile ? `Selected: ${selectedFile.name}`: "Click to browse or drag and drop"}</p>
                         <p className="text-xs text-muted-foreground">.docx files only</p>
                    </label>
                    <Input
                        id="file-upload"
                        name="doc"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                </div>
                
                {selectedFile && (
                    <div className="flex gap-2">
                        <SubmitButton />
                        <Button onClick={handleClear} variant="outline" type="button">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                )}
                
                {state.pdfDataUri && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                )}

            </CardContent>
        </form>
      </Card>
    </div>
  );
}
