"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileImage, ArrowRight } from "lucide-react";
import Image from 'next/image';

export default function ImageConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/png") {
      setSelectedFile(file);
      setConvertedUrl(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a PNG file.",
      });
      setSelectedFile(null);
    }
  };

  const handleConvert = () => {
    if (!selectedFile) return;

    setIsConverting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF"; // Set background to white for transparency
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const jpgUrl = canvas.toDataURL("image/jpeg");
          setConvertedUrl(jpgUrl);
          toast({
            title: "Conversion Successful",
            description: "Your image has been converted to JPG.",
          });
        }
        setIsConverting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDownload = () => {
    if (!convertedUrl || !selectedFile) return;
    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = selectedFile.name.replace(/\.png$/, ".jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Image Converter</h1>
        <p className="text-muted-foreground text-lg">Convert PNG images to JPG on the client-side.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>PNG to JPG</CardTitle>
          <CardDescription>Upload your PNG file and convert it to a JPG file instantly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={triggerFileSelect}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "Click or drag file to this area to upload"}
            </p>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png"
            />
          </div>

          <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                  <FileImage className="w-6 h-6 text-red-500"/>
                  <span>PNG</span>
              </div>
              <ArrowRight className="w-8 h-8 text-muted-foreground"/>
              <div className="flex items-center gap-2 text-lg font-medium">
                  <FileImage className="w-6 h-6 text-blue-500"/>
                  <span>JPG</span>
              </div>
          </div>

          <Button onClick={handleConvert} disabled={!selectedFile || isConverting} className="w-full">
            {isConverting ? "Converting..." : "Convert to JPG"}
          </Button>

          {convertedUrl && (
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">Conversion Complete!</h3>
              <div className="flex justify-center">
                <Image src={convertedUrl} alt="Converted JPG" width={300} height={200} className="rounded-lg border shadow-md" />
              </div>
              <Button onClick={handleDownload} variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download JPG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
