
"use client";

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Trash2, FileText, Copy } from "lucide-react";
import { extractTextFromPdf } from './actions';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Extracting...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Extract Text
        </>
      )}
    </Button>
  );
}

export default function PdfToTextPage() {
  const [state, formAction] = useFormState(extractTextFromPdf, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        // Automatically submit the form when a file is selected
        (event.target.form as HTMLFormElement).requestSubmit();
      } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
        handleClear();
      }
    }
  };

  const handleCopy = () => {
    if (state.extractedText) {
      navigator.clipboard.writeText(state.extractedText);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    formAction({});
  };

  useEffect(() => {
    if (state?.error) {
       toast({ variant: "destructive", title: "Extraction Failed", description: state.error });
    }
    if (state?.extractedText) {
         toast({ title: "Extraction Successful!", description: "Text has been extracted from the PDF." });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF to Text Extractor</h1>
        <p className="text-muted-foreground text-lg">Extract all text content from a PDF file.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle>Upload PDF</CardTitle>
                    <CardDescription>Select the PDF file you want to extract text from.</CardDescription>
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
                <CardDescription>The text from your PDF will appear below.</CardDescription>
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
