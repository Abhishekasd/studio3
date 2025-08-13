
"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FilePlus2, Loader2, X, Trash2, File as FileIcon } from "lucide-react";
import { PDFDocument } from 'pdf-lib';

async function mergePdfs(prevState: any, formData: FormData): Promise<{ mergedPdfDataUri?: string; error?: string }> {
  'use server';
  
  const files = formData.getAll("pdfs") as File[];

  if (files.length < 2) {
    return { error: "Please select at least two PDF files to merge." };
  }

  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfDataUri = `data:application/pdf;base64,${Buffer.from(mergedPdfBytes).toString('base64')}`;
    
    return { mergedPdfDataUri };
  } catch (err: any) {
    console.error("Failed to merge PDFs:", err);
    return { error: `An error occurred during merging: ${err.message}` };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Merging...
        </>
      ) : (
        <>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Merge PDFs
        </>
      )}
    </Button>
  );
}

export default function PdfMergerPage() {
  const [state, formAction] = useFormState(mergePdfs, {});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if(pdfFiles.length !== newFiles.length){
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
      }
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }
  
  const handleDownload = () => {
    if (!state.mergedPdfDataUri) return;
    const link = document.createElement("a");
    link.href = state.mergedPdfDataUri;
    link.download = "merged.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useState(() => {
    if (state.error) {
       toast({ variant: "destructive", title: "Merge Failed", description: state.error });
    }
    if (state.mergedPdfDataUri) {
         toast({ title: "Merge Successful!", description: "Your PDF has been merged and is ready for download." });
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF Merger</h1>
        <p className="text-muted-foreground text-lg">Combine multiple PDF files into one.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form action={formAction}>
            <CardHeader>
                <CardTitle>Upload PDFs</CardTitle>
                <CardDescription>Select the PDF files you want to merge. The order shown below is the order they will be merged in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Click to browse or drag and drop PDFs</p>
                    </label>
                    <Input
                        id="file-upload"
                        name="pdfs"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="application/pdf"
                        multiple
                    />
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Selected Files ({selectedFiles.length}):</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2 rounded-md border p-2">
                        {selectedFiles.map((file, index) => (
                           <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm">
                               <div className="flex items-center gap-2 truncate">
                                  <FileIcon className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{file.name}</span>
                               </div>
                               <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeFile(index)}>
                                   <X className="h-4 w-4"/>
                               </Button>
                           </div>
                        ))}
                    </div>
                  </div>
                )}
                
                {selectedFiles.length > 1 && (
                     <SubmitButton />
                )}
                
                {state.mergedPdfDataUri && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download Merged PDF
                    </Button>
                )}
                 {selectedFiles.length > 0 && (
                    <Button onClick={() => setSelectedFiles([])} variant="outline" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All Files
                    </Button>
                )}

            </CardContent>
        </form>
      </Card>
    </div>
  );
}
