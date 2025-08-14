
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Trash2, Edit } from "lucide-react";
import { inspectPdfForm, fillPdfForm, FormFieldInfo } from './actions';

function InspectSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Inspecting...
        </>
      ) : (
        <>
          <Edit className="mr-2 h-4 w-4" />
          Inspect & Load Form
        </>
      )}
    </Button>
  );
}

function FillSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Filling PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Fill & Download PDF
        </>
      )}
    </Button>
  );
}


export default function PdfFormFillerPage() {
  const [inspectState, inspectAction] = useFormState(inspectPdfForm, {});
  const [fillState, fillAction] = useFormState(fillPdfForm, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (inspectState?.error) {
       toast({ variant: "destructive", title: "Inspection Failed", description: inspectState.error });
    }
     if (inspectState?.fields && inspectState.fields.length === 0) {
       toast({ variant: "destructive", title: "No Fields Found", description: "This PDF does not appear to contain any fillable form fields." });
    }
  }, [inspectState, toast]);

  useEffect(() => {
    if (fillState?.error) {
       toast({ variant: "destructive", title: "Filling Failed", description: fillState.error });
    }
    if (fillState?.filledPdfDataUri) {
         toast({ title: "PDF Filled Successfully!", description: "Your document is ready for download." });
         handleDownload(fillState.filledPdfDataUri);
    }
  }, [fillState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        // Clear previous state
        inspectAction(new FormData());
        fillAction(new FormData());
      } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
        handleClear();
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    inspectAction(new FormData());
    fillAction(new FormData());
  };

  const handleDownload = (uri: string) => {
    if (!uri || !selectedFile) return;
    const link = document.createElement("a");
    link.href = uri;
    link.download = `filled-${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const renderField = (field: FormFieldInfo) => {
    const { name, type, options } = field;
    switch (type) {
      case 'text':
        return (
          <div key={name} className="grid gap-2">
            <Label htmlFor={name}>{name}</Label>
            <Input id={name} name={name} />
          </div>
        );
      case 'checkbox':
        return (
             <div key={name} className="flex items-center space-x-2">
                <Checkbox id={name} name={name} />
                <Label htmlFor={name} className="font-normal">{name}</Label>
            </div>
        )
      case 'radio':
        return (
          <div key={name} className="grid gap-2">
             <Label>{name}</Label>
            <RadioGroup name={name}>
                {options?.map(opt => (
                    <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`${name}-${opt}`} />
                        <Label htmlFor={`${name}-${opt}`} className="font-normal">{opt}</Label>
                    </div>
                ))}
            </RadioGroup>
          </div>
        )
       case 'dropdown':
        return (
            <div key={name} className="grid gap-2">
                <Label htmlFor={name}>{name}</Label>
                <Select name={name}>
                    <SelectTrigger id={name}>
                        <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        )
      default:
        return <p key={name} className="text-sm text-muted-foreground">Unsupported field: {name} ({type})</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF Form Filler</h1>
        <p className="text-muted-foreground text-lg">Easily fill out your PDF forms online.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle>1. Upload Your PDF</CardTitle>
            <CardDescription>Select a PDF with form fields to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={inspectAction}>
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
                    <div className="flex gap-2 mt-4">
                        <InspectSubmitButton />
                         <Button onClick={handleClear} variant="outline" type="button">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear File
                        </Button>
                    </div>
                )}
            </form>
        </CardContent>
        
        {inspectState.fields && inspectState.fields.length > 0 && (
            <>
                <CardHeader className="border-t">
                    <CardTitle>2. Fill Out The Form</CardTitle>
                    <CardDescription>The fields from your PDF are shown below. Fill them out and click download.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={fillAction} className="space-y-4">
                        <input type="hidden" name="pdfDataUri" value={inspectState.pdfDataUri} />
                        {inspectState.fields.map(renderField)}
                        <FillSubmitButton />
                    </form>
                </CardContent>
            </>
        )}
      </Card>
    </div>
  );
}
