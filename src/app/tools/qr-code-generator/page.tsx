"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, QrCode } from "lucide-react";
import Image from 'next/image';

export default function QrCodeGeneratorPage() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Input is empty",
        description: "Please enter text or a URL to generate a QR code.",
      });
      return;
    }

    setIsGenerating(true);
    // Using a public API for QR code generation
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
    setQrCodeUrl(qrApiUrl);
    
    // Simulate generation time and show toast
    setTimeout(() => {
        setIsGenerating(false);
        toast({
          title: "QR Code Generated!",
          description: "Your QR code is ready to be downloaded.",
        });
    }, 500);
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    // We fetch the image and create a blob URL to enable proper naming of the downloaded file.
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }).catch(() => {
        toast({
            variant: "destructive",
            title: "Download failed",
            description: "Could not download the QR code image.",
        });
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">QR Code Generator</h1>
        <p className="text-muted-foreground text-lg">Create your own QR codes for free.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Enter Your Data</CardTitle>
          <CardDescription>Type in a URL, text, or any data you want to encode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="qr-data">Text or URL</Label>
            <Input 
              id="qr-data" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., https://www.example.com"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? "Generating..." : "Generate QR Code"}
            <QrCode className="ml-2 h-4 w-4" />
          </Button>

          {qrCodeUrl && !isGenerating && (
            <div className="space-y-4 text-center border-t pt-6">
              <h3 className="text-lg font-semibold">Your QR Code</h3>
              <div className="flex justify-center p-4 bg-muted rounded-lg">
                <Image src={qrCodeUrl} alt="Generated QR Code" width={250} height={250} className="rounded-md border shadow-md" />
              </div>
              <Button onClick={handleDownload} variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
