
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Trash2, FileSpreadsheet } from "lucide-react";
import { convertExcelToPdf } from './actions';

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
          Convert to PDF
        </>
      )}
    </Button>
  );
}

export default function ExcelToPdfPage() {
  const [state, formAction] = useFormState(convertExcelToPdf, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       const acceptedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
       ];
      if (acceptedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Please upload a .xlsx file." });
        handleClear();
      }
    }
  };
  
  const handleDownload = () => {
    if (!state.pdfDataUri || !selectedFile) return;
    const link = document.createElement("a");
    link.href = state.pdfDataUri;
    const newName = selectedFile.name.replace(/\.xlsx?$/, '.pdf');
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        <h1 className="text-4xl font-bold font-headline">Excel to PDF Converter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Convert your .xlsx files to PDF documents. Note: This feature is in beta and provides a sample output.
        </p>
      </div>

      <Card className="max-w-xl mx-auto">
        <form action={formAction}>
            <CardHeader>
                <CardTitle>Upload Excel File</CardTitle>
                <CardDescription>Select the .xlsx file you want to convert.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">{selectedFile ? `Selected: ${selectedFile.name}` : "Click to browse or drag and drop an Excel file"}</p>
                         <p className="text-xs text-muted-foreground">.xlsx files only</p>
                    </label>
                    <Input
                        ref={fileInputRef}
                        id="file-upload"
                        name="doc"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

    