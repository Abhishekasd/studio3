
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileImage, Loader2, Trash2 } from "lucide-react";
import { PDFDocument, PDFImage } from 'pdf-lib';
import Image from 'next/image';

const supportedFormats = ["image/png"];

export default function PngToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && supportedFormats.includes(file.type)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setOriginalUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a PNG file.",
      });
      setSelectedFile(null);
      setOriginalUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || !originalUrl) return;

    setIsConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const pngImageBytes = await fetch(originalUrl).then(res => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const newName = selectedFile.name.replace(/\.png$/, '.pdf');
      link.download = newName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion Successful",
        description: "Your PDF has been downloaded.",
      });

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "An unexpected error occurred during conversion.",
      });
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    setOriginalUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PNG to PDF Converter</h1>
        <p className="text-muted-foreground text-lg">Convert your PNG images into PDF documents.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Upload PNG</CardTitle>
          <CardDescription>Select the PNG file you want to convert.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!originalUrl && (
             <div 
                className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={triggerFileSelect}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Click or drag file to this area to upload</p>
                 <p className="text-xs text-muted-foreground">PNG files only</p>
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={supportedFormats.join(',')}
                />
              </div>
          )}

          {originalUrl && selectedFile && (
            <div className="space-y-4">
              <div className="flex justify-center border rounded-lg p-2 min-h-[250px] items-center bg-muted/20">
                <Image src={originalUrl} alt={selectedFile.name} width={400} height={250} className="rounded-md object-contain max-h-[250px]" />
              </div>
              <p className="text-center text-sm text-muted-foreground truncate">
                {selectedFile.name}
              </p>
              <div className="flex gap-2">
                 <Button onClick={handleClear} variant="outline" type="button" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
                <Button onClick={handleConvert} disabled={isConverting} className="w-full">
                  {isConverting ? (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                     <Download className="mr-2 h-4 w-4" />
                  )}
                  {isConverting ? 'Converting...' : 'Convert & Download'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
