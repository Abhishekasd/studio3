
"use client";

import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Trash2, FileText, Copy, Scan } from "lucide-react";
import { ocrPdf } from '@/ai/flows/pdf-ocr';
import { Textarea } from '@/components/ui/textarea';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Performing OCR...
        </>
      ) : (
        <>
          <Scan className="mr-2 h-4 w-4" />
          Extract Text with OCR
        </>
      )}
    </Button>
  );
}

export default function PdfOcrPage() {
  const [state, formAction] = useFormState(ocrPdf, { extractedText: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        
        // Convert file to data URI and submit form
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUri = e.target?.result as string;
            if (formRef.current) {
                const formData = new FormData(formRef.current);
                formData.set('pdfDataUri', dataUri);
                formAction(formData);
            }
        };
        reader.readAsDataURL(file);

      } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
        handleClear();
      }
    }
  };
  
  const handleFormAction = async (formData: FormData) => {
    if (!selectedFile) {
        toast({ variant: "destructive", title: "No File Selected", description: "Please choose a PDF file first." });
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        const newFormData = new FormData();
        newFormData.append('pdfDataUri', dataUri);
        formAction(newFormData);
    };
    reader.readAsDataURL(selectedFile);
  }

  const handleCopy = () => {
    if (state.extractedText) {
      navigator.clipboard.writeText(state.extractedText);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    formAction({ extractedText: "" } as any);
  };

  useEffect(() => {
    if (state?.error) {
       toast({ variant: "destructive", title: "Extraction Failed", description: state.error });
    }
    if (state?.extractedText) {
         toast({ title: "Extraction Successful!", description: "Text has been extracted from the PDF using OCR." });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF OCR Extractor</h1>
        <p className="text-muted-foreground text-lg">Extract text from scanned documents using AI.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <form action={handleFormAction} ref={formRef}>
                <CardHeader>
                    <CardTitle>Upload Scanned PDF</CardTitle>
                    <CardDescription>Select the scanned PDF you want to extract text from.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">{selectedFile ? `Selected: ${selectedFile.name}`: "Click to browse or drag and drop"}</p>
                        </label>
                        <Input
                            ref={fileInputRef}
                            id="file-upload"
                            name="pdf"
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            required
                            onChange={handleFileChange}
                        />
                         <input type="hidden" name="pdfDataUri" />
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
                </CardContent>
            </form>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>The text from your scanned PDF will appear below.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='relative'>
                    <Textarea
                        readOnly
                        value={state.extractedText || ""}
                        placeholder="Extracted text will be displayed here..."
                        className="min-h-[300px] resize-y"
                    />
                    {state.extractedText && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={handleCopy}
                            type="button"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
