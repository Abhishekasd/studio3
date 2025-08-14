
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Download, Loader2, Trash2, X, FileImage, VideoOff } from "lucide-react";
import Image from 'next/image';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export default function ScanToPdfPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        // Stop camera stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImages(prev => [...prev, dataUrl]);
         toast({ title: "Image Captured!", description: `You have captured ${capturedImages.length + 1} image(s).` });
      }
    }
  };
  
  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  }

  const generatePdf = async () => {
    if (capturedImages.length === 0) {
      toast({ variant: 'destructive', title: 'No Images Captured', description: 'Please capture at least one image before generating a PDF.' });
      return;
    }
    setIsConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const imageDataUri of capturedImages) {
        const jpgImageBytes = await fetch(imageDataUri).then(res => res.arrayBuffer());
        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
        const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
        page.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scanned-document-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({ title: "PDF Generated!", description: "Your scanned document has been downloaded." });

    } catch (error) {
       toast({ variant: 'destructive', title: 'PDF Generation Failed', description: 'An unexpected error occurred.' });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Scan Document to PDF</h1>
        <p className="text-muted-foreground text-lg">Use your device's camera to scan and create a PDF.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Camera Scanner</CardTitle>
          <CardDescription>Point your camera at a document and capture pages to build your PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative border-2 border-dashed rounded-lg p-2 bg-muted">
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4 rounded-md">
                    <VideoOff className="h-16 w-16 mb-4"/>
                    <p className="text-xl font-bold">Camera Access Denied</p>
                    <p className="text-center text-sm">Please enable camera permissions in your browser settings to use this tool.</p>
                </div>
            )}
             {hasCameraPermission === null && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4 rounded-md">
                    <Loader2 className="h-16 w-16 mb-4 animate-spin"/>
                    <p className="text-xl font-bold">Requesting Camera...</p>
                </div>
            )}
          </div>

          <Button onClick={handleCapture} disabled={!hasCameraPermission}>
            <Camera className="mr-2 h-4 w-4" /> Capture Page
          </Button>
          
          {capturedImages.length > 0 && (
            <div className="space-y-4">
                <Separator />
                <h3 className="font-semibold text-lg">Captured Pages ({capturedImages.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {capturedImages.map((src, index) => (
                        <div key={index} className="relative group border rounded-lg overflow-hidden">
                            <Image src={src} alt={`Captured page ${index + 1}`} width={150} height={200} className="w-full h-auto" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setCapturedImages([])} variant="outline">
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All
                    </Button>
                    <Button onClick={generatePdf} disabled={isConverting} className="flex-grow">
                        {isConverting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {isConverting ? 'Generating PDF...' : 'Generate & Download PDF'}
                    </Button>
                </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
