
"use client";

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Trash2, Layers, RotateCw, Scissors, Lock, Shuffle, Unlock, Hash, BadgePercent, TextQuote, Combine } from "lucide-react";
import { processPdf } from './actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Operation = "split" | "rotate" | "extract" | "rearrange" | "add-page-numbers" | "watermark" | "password" | "unlock" | "header-footer" | "flatten";

function SubmitButton({ operation }: { operation: Operation }) {
  const { pending } = useFormStatus();
  const icons = {
      split: <Layers className="mr-2 h-4 w-4" />,
      rotate: <RotateCw className="mr-2 h-4 w-4" />,
      extract: <Scissors className="mr-2 h-4 w-4" />,
      password: <Lock className="mr-2 h-4 w-4" />,
      watermark: <BadgePercent className="mr-2 h-4 w-4" />,
      rearrange: <Shuffle className="mr-2 h-4 w-4" />,
      unlock: <Unlock className="mr-2 h-4 w-4" />,
      'add-page-numbers': <Hash className="mr-2 h-4 w-4" />,
      'header-footer': <TextQuote className="mr-2 h-4 w-4" />,
      flatten: <Combine className="mr-2 h-4 w-4" />,
  }
  const text = {
      split: 'Split PDF',
      rotate: 'Rotate PDF',
      extract: 'Extract Pages',
      password: 'Add Password',
      watermark: 'Add Watermark',
      rearrange: 'Rearrange PDF',
      unlock: 'Unlock PDF',
      'add-page-numbers': 'Add Page Numbers',
      'header-footer': 'Add Header/Footer',
      flatten: 'Flatten PDF',
  }
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {icons[operation]}
          {text[operation]}
        </>
      )}
    </Button>
  );
}

export default function PdfEditorPage() {
  const [state, formAction] = useFormState(processPdf, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<Operation>("split");
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
  
  const handleDownload = () => {
    if (!state.fileDataUri) return;
    const link = document.createElement("a");
    link.href = state.fileDataUri;
    link.download = state.fileName || "processed.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    formAction({});
  }

  useEffect(() => {
    if (state?.error) {
       toast({ variant: "destructive", title: "Processing Failed", description: state.error });
    }
    if (state?.fileDataUri) {
         toast({ title: "Processing Successful!", description: "Your PDF is ready for download." });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF Editor</h1>
        <p className="text-muted-foreground text-lg">Organize, secure, and modify your PDF files with ease.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Edit Your PDF</CardTitle>
            <CardDescription>Upload your file, choose an operation, and process your PDF.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction}>
                 <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center mb-4">
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
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Operation)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                            <TabsTrigger value="split">Split</TabsTrigger>
                            <TabsTrigger value="rotate">Rotate</TabsTrigger>
                            <TabsTrigger value="extract">Extract</TabsTrigger>
                             <TabsTrigger value="rearrange">Rearrange</TabsTrigger>
                             <TabsTrigger value="add-page-numbers">Page #</TabsTrigger>
                            <TabsTrigger value="watermark">Watermark</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="unlock">Unlock</TabsTrigger>
                            <TabsTrigger value="header-footer">Header/Footer</TabsTrigger>
                            <TabsTrigger value="flatten">Flatten</TabsTrigger>
                        </TabsList>
                        <input type="hidden" name="operation" value={activeTab} />
                        
                        <TabsContent value="split" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                               <Label htmlFor="pagesToSplit">Pages to Split</Label>
                               <Input name="pagesToSplit" id="pagesToSplit" placeholder="e.g., 1-3, 5" required/>
                               <p className="text-xs text-muted-foreground">Enter page numbers or a range (e.g., 2-5) to create a new PDF from.</p>
                           </div>
                           <SubmitButton operation="split" />
                        </TabsContent>

                        <TabsContent value="rotate" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                                <Label htmlFor="rotation">Rotation Angle</Label>
                                <Select name="rotation" defaultValue="90">
                                    <SelectTrigger id="rotation">
                                        <SelectValue placeholder="Select angle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="90">90 degrees clockwise</SelectItem>
                                        <SelectItem value="180">180 degrees</SelectItem>
                                        <SelectItem value="270">270 degrees clockwise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                           <SubmitButton operation="rotate" />
                        </TabsContent>

                        <TabsContent value="extract" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                               <Label htmlFor="pagesToExtract">Pages to Extract</Label>
                               <Input name="pagesToExtract" id="pagesToExtract" placeholder="e.g., 1, 3-5, 8" required/>
                               <p className="text-xs text-muted-foreground">Enter page numbers or ranges, separated by commas.</p>
                           </div>
                            <SubmitButton operation="extract" />
                        </TabsContent>
                        
                        <TabsContent value="rearrange" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                               <Label htmlFor="pageOrder">New Page Order</Label>
                               <Input name="pageOrder" id="pageOrder" placeholder="e.g., 3, 1, 2, 4" required/>
                               <p className="text-xs text-muted-foreground">Enter all page numbers in the desired new order, separated by commas.</p>
                           </div>
                            <SubmitButton operation="rearrange" />
                        </TabsContent>

                         <TabsContent value="password" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                               <Label htmlFor="password">New Password</Label>
                               <Input name="password" id="password" type="password" placeholder="Enter a strong password" required/>
                               <p className="text-xs text-muted-foreground">The password will be required to open the PDF.</p>
                           </div>
                            <SubmitButton operation="password" />
                        </TabsContent>
                        
                        <TabsContent value="unlock" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                               <Label htmlFor="unlock-password">Current Password</Label>
                               <Input name="password" id="unlock-password" type="password" placeholder="Enter the current password" required/>
                               <p className="text-xs text-muted-foreground">The current password is required to remove encryption.</p>
                           </div>
                            <SubmitButton operation="unlock" />
                        </TabsContent>

                         <TabsContent value="watermark" className="space-y-4 pt-4">
                           <div className="grid gap-2">
                               <Label htmlFor="watermarkText">Watermark Text</Label>
                               <Input name="watermarkText" id="watermarkText" placeholder="e.g., CONFIDENTIAL" required/>
                               <p className="text-xs text-muted-foreground">This text will be diagonally overlaid on each page.</p>
                           </div>
                            <SubmitButton operation="watermark" />
                        </TabsContent>

                         <TabsContent value="add-page-numbers" className="space-y-4 pt-4">
                           <div className="text-center">
                             <p className="text-sm text-muted-foreground">Page numbers will be added to the bottom-center of each page.</p>
                           </div>
                            <SubmitButton operation="add-page-numbers" />
                        </TabsContent>
                        
                        <TabsContent value="header-footer" className="space-y-4 pt-4">
                            <div className='space-y-2'>
                                <Label>Header</Label>
                                <div className='grid grid-cols-3 gap-2'>
                                    <Input name="headerLeft" placeholder="Left" />
                                    <Input name="headerCenter" placeholder="Center" />
                                    <Input name="headerRight" placeholder="Right" />
                                </div>
                            </div>
                             <div className='space-y-2'>
                                <Label>Footer</Label>
                                <div className='grid grid-cols-3 gap-2'>
                                    <Input name="footerLeft" placeholder="Left" />
                                    <Input name="footerCenter" placeholder="Center" />
                                    <Input name="footerRight" placeholder="Right" />
                                </div>
                            </div>
                           <p className="text-xs text-muted-foreground text-center">Leave fields blank that you don't need.</p>
                           <SubmitButton operation="header-footer" />
                        </TabsContent>
                        
                        <TabsContent value="flatten" className="space-y-4 pt-4">
                           <div className="text-center">
                             <p className="text-sm text-muted-foreground">This will merge all form fields into the document, making them non-editable.</p>
                           </div>
                           <SubmitButton operation="flatten" />
                        </TabsContent>

                    </Tabs>
                )}
                
                {state.fileDataUri && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full mt-4" type="button">
                        <Download className="mr-2 h-4 w-4" /> Download Processed PDF
                    </Button>
                )}
                 {selectedFile && (
                    <Button onClick={handleClear} variant="outline" className="w-full mt-2" type="button">
                        <Trash2 className="mr-2 h-4 w-4" /> Clear File
                    </Button>
                )}

            </form>
        </CardContent>
      </Card>
    </div>
  );
}
