"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download } from "lucide-react";
import Image from 'next/image';

type ImageFormat = "jpeg" | "png" | "webp" | "gif";
const supportedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>("jpeg");
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && supportedFormats.includes(file.type)) {
      setSelectedFile(file);
      setConvertedUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => setOriginalUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a PNG, JPG, WEBP, or GIF file.",
      });
      setSelectedFile(null);
      setOriginalUrl(null);
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
          if (outputFormat === 'jpeg' || outputFormat === 'webp') {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const convertedDataUrl = canvas.toDataURL(`image/${outputFormat}`);
          setConvertedUrl(convertedDataUrl);
          toast({
            title: "Conversion Successful",
            description: `Your image has been converted to ${outputFormat.toUpperCase()}.`,
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
    const oldExtension = selectedFile.name.split('.').pop();
    link.download = selectedFile.name.replace(new RegExp(`\\.${oldExtension}$`), `.${outputFormat}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Image Converter</h1>
        <p className="text-muted-foreground text-lg">Convert images between JPG, PNG, WEBP, and GIF formats.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Image Conversion</CardTitle>
          <CardDescription>Upload your image and choose the format to convert to.</CardDescription>
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
              accept={supportedFormats.join(',')}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
             {originalUrl && (
                <div className="space-y-2">
                    <h3 className="text-center font-semibold">Original</h3>
                    <div className="flex justify-center border rounded-lg p-2">
                      <Image src={originalUrl} alt="Original image" width={300} height={200} className="rounded-md object-contain max-h-[200px]" />
                    </div>
                </div>
              )}
             {convertedUrl && (
                <div className="space-y-2">
                    <h3 className="text-center font-semibold">Converted</h3>
                    <div className="flex justify-center border rounded-lg p-2">
                        <Image src={convertedUrl} alt="Converted image" width={300} height={200} className="rounded-md object-contain max-h-[200px]" />
                    </div>
                </div>
              )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
              <Select onValueChange={(v) => setOutputFormat(v as ImageFormat)} defaultValue={outputFormat}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Convert to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleConvert} disabled={!selectedFile || isConverting} className="flex-grow">
                {isConverting ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
              </Button>
          </div>

          {convertedUrl && (
            <Button onClick={handleDownload} variant="secondary" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
