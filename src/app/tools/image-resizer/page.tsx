
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, AspectRatio } from "lucide-react";
import Image from 'next/image';

const supportedFormats = ["image/jpeg", "image/png", "image/webp"];

export default function ImageResizerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && supportedFormats.includes(file.type)) {
      setSelectedFile(file);
      setResizedUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalUrl(e.target?.result as string);
        const img = document.createElement('img');
        img.onload = () => {
          setWidth(img.width.toString());
          setHeight(img.height.toString());
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a PNG, JPG, or WEBP file.",
      });
      setSelectedFile(null);
      setOriginalUrl(null);
    }
  };

  const handleResize = () => {
    if (!selectedFile || !width || !height || +width <= 0 || +height <= 0) {
        toast({ variant: "destructive", title: "Invalid dimensions", description: "Please provide positive values for width and height." });
        return;
    }

    setIsResizing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resizedDataUrl = canvas.toDataURL(selectedFile.type);
          setResizedUrl(resizedDataUrl);
          toast({
            title: "Resize Successful",
            description: `Your image has been resized to ${width}x${height}.`,
          });
        }
        setIsResizing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDownload = () => {
    if (!resizedUrl || !selectedFile) return;
    const link = document.createElement("a");
    link.href = resizedUrl;
    const oldExtension = selectedFile.name.split('.').pop();
    const newName = selectedFile.name.replace(new RegExp(`\\.${oldExtension}$`), `-resized.${oldExtension}`);
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Image Resizer</h1>
        <p className="text-muted-foreground text-lg">Easily change the dimensions of your images.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Resize Your Image</CardTitle>
          <CardDescription>Upload an image and specify the new dimensions.</CardDescription>
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
                        <h3 className="text-center font-semibold">Original</h3>
                        <div className="flex justify-center border rounded-lg p-2">
                          <Image src={originalUrl} alt="Original image" width={300} height={200} className="rounded-md object-contain max-h-[200px]" />
                        </div>
                    </div>
                    {resizedUrl ? (
                         <div className="space-y-2">
                            <h3 className="text-center font-semibold">Resized</h3>
                            <div className="flex justify-center border rounded-lg p-2">
                                <Image src={resizedUrl} alt="Resized image" width={300} height={200} className="rounded-md object-contain max-h-[200px]" />
                            </div>
                        </div>
                    ) : (
                         <div className="space-y-2 text-center text-muted-foreground p-8 flex flex-col justify-center items-center h-full">
                            <AspectRatio className="h-10 w-10"/>
                            <p>Your resized image will appear here.</p>
                        </div>
                    )}
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g., 800" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 600" />
                    </div>
                </div>

                <Button onClick={handleResize} disabled={isResizing || !selectedFile} className="w-full">
                    {isResizing ? "Resizing..." : "Resize Image"}
                </Button>
                {resizedUrl && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Resized Image
                    </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
