"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

export default function PalindromeCheckerPage() {
  const [text, setText] = useState('');
  const [hasChecked, setHasChecked] = useState(false);

  const isPalindrome = useMemo(() => {
    if (!text.trim()) return null;
    // Sanitize the input by removing non-alphanumeric characters and converting to lower case
    const cleanText = text.toLowerCase().replace(/[\W_]/g, '');
    if (!cleanText) return null;
    const reversedText = cleanText.split('').reverse().join('');
    return cleanText === reversedText;
  }, [text]);

  const handleCheck = () => {
    if(text.trim()){
      setHasChecked(true);
    }
  };
  
  const handleClear = () => {
    setText('');
    setHasChecked(false);
  }

  const result = hasChecked ? isPalindrome : null;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Palindrome Checker</h1>
        <p className="text-muted-foreground text-lg">Check if a word or phrase reads the same forwards and backwards.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Text</CardTitle>
          <CardDescription>Type a word or phrase to see if it's a palindrome.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="text-input">Text</Label>
            <Input 
              id="text-input" 
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setHasChecked(false); // Reset result on change
              }}
              placeholder="e.g., A man, a plan, a canal: Panama"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCheck} disabled={!text.trim()} className="flex-1">
              Check
            </Button>
            <Button onClick={handleClear} variant="outline" disabled={!text.trim() && !hasChecked}>
              Clear
            </Button>
          </div>

          {result !== null && (
            <div className={`flex items-center justify-center p-4 rounded-lg ${result ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              {result ? (
                <Check className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              ) : (
                <X className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
              )}
              <p className={`font-medium ${result ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {result ? `"${text}" is a palindrome!` : `"${text}" is not a palindrome.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
