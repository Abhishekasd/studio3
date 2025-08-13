
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Percent } from "lucide-react";
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';

const supportedFormats = ["image/jpeg", "image/png", "image/webp"];

export default function ImageCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && supportedFormats.includes(file.type)) {
      setSelectedFile(file);
      setCompressedUrl(null);
      setOriginalSize(file.size);
      setCompressedSize(0);
      const reader = new FileReader();
      reader.onload = (e) => setOriginalUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a JPG, PNG, or WEBP file.",
      });
      setSelectedFile(null);
      setOriginalUrl(null);
    }
  };

  const handleCompress = () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedDataUrl = URL.createObjectURL(blob);
              setCompressedUrl(compressedDataUrl);
              setCompressedSize(blob.size);
              toast({
                title: "Compression Successful",
                description: `Image size reduced by ${(((originalSize - blob.size) / originalSize) * 100).toFixed(0)}%.`,
              });
            }
             setIsCompressing(false);
          }, selectedFile.type, quality);
        } else {
            setIsCompressing(false);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDownload = () => {
    if (!compressedUrl || !selectedFile) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    const oldExtension = selectedFile.name.split('.').pop();
    const newName = selectedFile.name.replace(new RegExp(`\\.${oldExtension}$`), `-compressed.${oldExtension}`);
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Image Compressor</h1>
        <p className="text-muted-foreground text-lg">Reduce image file sizes for faster web pages.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Compress Your Image</CardTitle>
          <CardDescription>Upload an image and adjust the quality to reduce its file size.</CardDescription>
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
          
          {originalUrl && (
             <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                           <h3 className="font-semibold">Original</h3>
                           <span className="text-muted-foreground">{formatSize(originalSize)}</span>
                        </div>
                        <div className="flex justify-center border rounded-lg p-2 min-h-[220px] items-center">
                          <Image src={originalUrl} alt="Original image" width={300} height={200} className="rounded-md object-contain max-h-[200px]" />
                        </div>
                    </div>
                     <div className="space-y-2">
                         <div className="flex justify-between items-center text-sm">
                           <h3 className="font-semibold">Compressed</h3>
                           {compressedSize > 0 && <span className="text-muted-foreground">{formatSize(compressedSize)}</span>}
                        </div>
                        <div className="flex justify-center border rounded-lg p-2 min-h-[220px] items-center">
                            {compressedUrl ? (
                                <Image src={compressedUrl} alt="Compressed image" width={300} height={200} className="rounded-md object-contain max-h-[200px]" />
                            ) : (
                                <div className="text-center text-muted-foreground p-8 flex flex-col justify-center items-center h-full">
                                    <Percent className="h-10 w-10"/>
                                    <p>Your compressed image will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="quality">Quality (0% - 100%)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            id="quality"
                            min={0}
                            max={1}
                            step={0.01}
                            value={[quality]}
                            onValueChange={(value) => setQuality(value[0])}
                        />
                        <span className="font-bold w-12 text-center">{Math.round(quality * 100)}%</span>
                    </div>
                </div>

                <Button onClick={handleCompress} disabled={isCompressing || !selectedFile} className="w-full">
                    {isCompressing ? "Compressing..." : "Compress Image"}
                </Button>
                {compressedUrl && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Compressed Image
                    </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
