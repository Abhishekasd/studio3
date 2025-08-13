"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { removeImageBackground } from '@/ai/flows/remove-image-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Sparkles, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";

const supportedFormats = ["image/jpeg", "image/png", "image/webp"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Removing Background...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Remove Background
        </>
      )}
    </Button>
  );
}

export function ImageBackgroundRemoverClient() {
  const [state, formAction] = useFormState(removeImageBackground, {});
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && supportedFormats.includes(file.type)) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setOriginalUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a JPG, PNG, or WEBP file.",
      });
      setOriginalFile(null);
      setOriginalUrl(null);
    }
  };

  const handleFormAction = async (formData: FormData) => {
    if (!originalUrl) return;
    const data = { imageDataUri: originalUrl };
    const result = await removeImageBackground(data);
    if(result.error) {
       toast({ variant: "destructive", title: "An Error Occurred", description: result.error });
    } else {
       toast({ title: "Background Removed!", description: "Your image is ready to download." });
    }
    formAction(data as any);
  };
  
  const handleDownload = () => {
    if (!state.processedImageDataUri) return;
    const link = document.createElement("a");
    link.href = state.processedImageDataUri;
    link.download = "background-removed.png"; // removal.ai returns png
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    formAction({}); // Clear state
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <form action={handleFormAction}>
        <CardHeader>
          <CardTitle>Upload Your Image</CardTitle>
          <CardDescription>Upload an image to automatically remove the background.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!originalUrl && (
            <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Click to browse or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
              </label>
              <Input
                id="file-upload"
                name="image"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={supportedFormats.join(',')}
              />
            </div>
          )}

          {originalUrl && (
            <>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold">Original</h3>
                  <div className="flex justify-center border rounded-lg p-2 min-h-[250px] items-center bg-muted/20">
                    <Image src={originalUrl} alt="Original" width={300} height={250} className="rounded-md object-contain max-h-[250px]" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold">Result</h3>
                  <div className="flex justify-center border rounded-lg p-2 min-h-[250px] items-center bg-grid-pattern">
                    {state.processedImageDataUri ? (
                      <Image src={state.processedImageDataUri} alt="Background removed" width={300} height={250} className="rounded-md object-contain max-h-[250px]" />
                    ) : (
                      <div className="text-muted-foreground flex flex-col items-center justify-center h-full">
                        <ImageIcon className="h-10 w-10 mb-2"/>
                        <p>Your result will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                 <Button onClick={handleClear} variant="outline" type="button">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
                <SubmitButton />
              </div>

              {state.processedImageDataUri && (
                <Button onClick={handleDownload} variant="secondary" className="w-full" type="button">
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </Button>
              )}
            </>
          )}

        </CardContent>
      </form>
    </Card>
  );
}
