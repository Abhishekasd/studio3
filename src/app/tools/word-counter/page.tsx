"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Stats {
  words: number;
  characters: number;
  sentences: number;
  paragraphs: number;
}

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats: Stats = useMemo(() => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return { words: 0, characters: 0, sentences: 0, paragraphs: 0 };
    }

    const words = trimmedText.split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const sentences = (trimmedText.match(/[.!?]+(?:\s+|$)/g) || []).length;
    const paragraphs = trimmedText.split(/\n+/).filter(p => p.trim() !== '').length;

    return { words, characters, sentences, paragraphs };
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  const statItems = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Word & Character Counter</h1>
        <p className="text-muted-foreground text-lg">Instantly get statistics for your text.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your Text</CardTitle>
              <CardDescription>Paste your text below to see the stats.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="min-h-[400px] resize-y"
              />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={handleClear} disabled={!text}>
                  Clear Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Real-time analysis of your text.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {statItems.map(item => (
                  <div key={item.label} className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
