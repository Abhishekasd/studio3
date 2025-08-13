"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw } from "lucide-react";

export default function UuidGeneratorPage() {
  const [uuid, setUuid] = useState('');
  const { toast } = useToast();

  const generateUuid = () => {
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
  };
  
  // Generate a UUID on initial component mount
  useEffect(() => {
    generateUuid();
  }, []);

  const handleCopy = () => {
    if (!uuid) return;
    navigator.clipboard.writeText(uuid);
    toast({ title: "UUID Copied to clipboard!" });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">UUID Generator</h1>
        <p className="text-muted-foreground text-lg">Generate universally unique identifiers (v4).</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generated UUID</CardTitle>
          <CardDescription>A new version 4 UUID is generated for you below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="uuid-output">UUID</Label>
            <Input id="uuid-output" value={uuid} readOnly className="font-mono text-center text-lg h-12" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={generateUuid} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate New UUID
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!uuid} className="flex-1">
              <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
