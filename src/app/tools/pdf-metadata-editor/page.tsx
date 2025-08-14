
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Trash2, Edit, Save, Info } from "lucide-react";
import { inspectPdfMetadata, updatePdfMetadata } from './actions';
import { Textarea } from '@/components/ui/textarea';

function InspectSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Reading Metadata...
        </>
      ) : (
        <>
          <Info className="mr-2 h-4 w-4" />
          Inspect & Edit Metadata
        </>
      )}
    </Button>
  );
}

function UpdateSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save & Download PDF
        </>
      )}
    </Button>
  );
}

export default function PdfMetadataEditorPage() {
  const [inspectState, inspectAction] = useFormState(inspectPdfMetadata, {});
  const [updateState, updateAction] = useFormState(updatePdfMetadata, {});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (inspectState?.error) {
       toast({ variant: "destructive", title: "Inspection Failed", description: inspectState.error });
    }
    if (inspectState?.metadata) {
        toast({ title: "Metadata Loaded", description: "You can now edit the metadata fields below." });
    }
  }, [inspectState, toast]);

  useEffect(() => {
    if (updateState?.error) {
       toast({ variant: "destructive", title: "Update Failed", description: updateState.error });
    }
    if (updateState?.updatedPdfDataUri) {
         toast({ title: "PDF Updated Successfully!", description: "Your document is ready for download." });
         handleDownload(updateState.updatedPdfDataUri);
    }
  }, [updateState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        inspectAction(new FormData());
        updateAction(new FormData());
      } else {
        toast({ variant: "destructive", title: "Invalid File Type", description: "Only PDF files are accepted." });
        handleClear();
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    inspectAction(new FormData());
    updateAction(new FormData());
  };

  const handleDownload = (uri: string) => {
    const fileName = inspectState.fileName || 'edited.pdf';
    const link = document.createElement("a");
    link.href = uri;
    link.download = `metadata-updated-${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString();
    } catch {
        return 'Invalid Date';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF Metadata Editor</h1>
        <p className="text-muted-foreground text-lg">View and edit the metadata of your PDF files.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>1. Upload PDF</CardTitle>
            <CardDescription>Select a PDF file to view and edit its metadata properties.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={inspectAction}>
                 <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">{selectedFile ? `Selected: ${selectedFile.name}` : "Click to browse or drag and drop a PDF"}</p>
                    </label>
                    <Input
                        ref={fileInputRef}
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
                    <div className="flex gap-2 mt-4">
                        <InspectSubmitButton />
                         <Button onClick={handleClear} variant="outline" type="button">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear File
                        </Button>
                    </div>
                )}
            </form>
        </CardContent>
        
        {inspectState.metadata && (
            <>
                <CardHeader className="border-t">
                    <CardTitle>2. Edit Metadata</CardTitle>
                    <CardDescription>Update the fields below and click save to apply the changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateAction} className="space-y-4">
                        <input type="hidden" name="pdfDataUri" value={inspectState.pdfDataUri} />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={inspectState.metadata.title} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" defaultValue={inspectState.metadata.author} />
                            </div>
                        </div>

                         <div className="grid gap-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" defaultValue={inspectState.metadata.subject} />
                        </div>
                        
                         <div className="grid gap-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Textarea id="keywords" name="keywords" defaultValue={inspectState.metadata.keywords} placeholder="Comma-separated keywords" className="resize-y" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="creator">Creator</Label>
                                <Input id="creator" name="creator" defaultValue={inspectState.metadata.creator} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="producer">Producer (Read-only)</Label>
                                <Input id="producer" name="producer" defaultValue={inspectState.metadata.producer} readOnly className="bg-muted"/>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="grid gap-2">
                                <Label>Creation Date</Label>
                                <Input defaultValue={formatDate(inspectState.metadata.creationDate)} readOnly className="bg-muted"/>
                            </div>
                             <div className="grid gap-2">
                                <Label>Modification Date</Label>
                                <Input defaultValue={formatDate(inspectState.metadata.modificationDate)} readOnly className="bg-muted"/>
                            </div>
                        </div>

                        <UpdateSubmitButton />
                    </form>
                </CardContent>
            </>
        )}
      </Card>
    </div>
  );
}
