
"use client";

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Trash2, FileImage } from "lucide-react";
import { convertPdfToImages } from './actions';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
          <FileImage className="mr-2 h-4 w-4" />
          Convert to Images
        </>
      )}
    </Button>
  );
}

export default function PdfToImagePage() {
  const [state, formAction] = useFormState(convertPdfToImages, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       if(file.type === 'application/pdf') {
         setSelectedFile(file);
         formAction({}); 
       } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
        handleClear();
       }
    }
  };
  
  const handleDownload = async (imageUrl: string, pageNum: number) => {
    try {
        toast({title: 'Preparing Download...', description: 'Your image will begin downloading shortly.'});
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const format = state.format || 'jpg';
        const baseName = state.fileName || 'page';
        link.download = `${baseName}-page-${pageNum}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        toast({variant: 'destructive', title: 'Download Failed', description: 'Could not download the image.'})
    }
  };

  const handleDownloadAll = () => {
    if(!state.images) return;
    toast({title: "Downloading All", description: "Your images will be downloaded shortly."});
    state.images.forEach((img, i) => {
        // Adding a small delay between downloads to prevent browser blocking popups
        setTimeout(() => handleDownload(img, i + 1), i * 300);
    });
  }
  
  const handleClear = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    formAction({}); // clear state
  }

  useEffect(() => {
    if (state?.error) {
       toast({ variant: "destructive", title: "Conversion Failed", description: state.error });
    }
    if (state?.images) {
         toast({ title: "Conversion Successful!", description: `Your PDF has been converted into ${state.images.length} image(s). This is a demo; images are placeholders.` });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF to Image Converter</h1>
        <p className="text-muted-foreground text-lg">Convert each page of a PDF into JPG, PNG, or WEBP images.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <form action={formAction}>
          <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
              <CardDescription>Upload your file, choose an image format, and convert. Note: This is a demo feature and will show placeholder images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">{selectedFile ? `Selected: ${selectedFile.name}` : "Click to browse or drag and drop a PDF"}</p>
                  </label>
                  <Input
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
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="format">Image Format</Label>
                        <Select name="format" defaultValue="jpg">
                            <SelectTrigger id="format">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jpg">JPG</SelectItem>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="webp">WEBP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <SubmitButton />
                         <Button onClick={handleClear} variant="outline" type="button">
                            <Trash2 className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </div>
                </div>
              )}
              
              {state.images && state.images.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                      <h3 className="text-lg font-semibold text-center">Generated Images ({state.images.length})</h3>
                      <Button onClick={handleDownloadAll} variant="secondary" className="w-full" type="button">
                            <Download className="mr-2 h-4 w-4" /> Download All
                      </Button>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
                          {state.images.map((src, index) => (
                              <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm">
                                  <Image src={src} alt={`Page ${index + 1}`} width={200} height={280} className="w-full h-auto" />
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button size="sm" onClick={() => handleDownload(src, index + 1)} type="button">
                                          <Download className="mr-2 h-4 w-4"/> Page {index+1}
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
