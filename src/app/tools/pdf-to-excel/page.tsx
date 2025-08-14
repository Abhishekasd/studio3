
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Trash2, FileSpreadsheet } from "lucide-react";
import { convertPdfToExcel } from './actions';

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
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Convert to Excel
        </>
      )}
    </Button>
  );
}

export default function PdfToExcelPage() {
  const [state, formAction] = useFormState(convertPdfToExcel, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
        handleClear();
      }
    }
  };
  
  const handleDownload = () => {
    if (!state.textData || !selectedFile) return;

    // This creates a plain text file. A true .xlsx would require a library like 'exceljs'.
    const blob = new Blob([state.textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const newName = selectedFile.name.replace(/\.pdf$/i, '.txt');
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded as .txt", description: "True table-aware .xlsx conversion coming soon!" });
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    formAction({});
  }

  useEffect(() => {
    if (state?.error) {
       toast({ variant: "destructive", title: "Conversion Failed", description: state.error });
    }
    if (state?.textData) {
         toast({ title: "Conversion Successful!", description: "Your document's text is ready for download." });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF to Excel Converter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Convert your PDF to an Excel document. Note: This feature is in beta and extracts text only.
        </p>
      </div>

      <Card className="max-w-xl mx-auto">
        <form action={formAction}>
            <CardHeader>
                <CardTitle>Upload PDF</CardTitle>
                <CardDescription>Select the PDF file you want to convert to an Excel-compatible format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">{selectedFile ? `Selected: ${selectedFile.name}` : "Click to browse or drag and drop a PDF"}</p>
                    </label>
                    <Input
                        ref={fileInputRef}
                        id="file-upload"
                        name="pdf"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="application/pdf"
                        required
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
                
                {state.textData && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full" type="button">
                        <Download className="mr-2 h-4 w-4" /> Download as Text
                    </Button>
                )}
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
