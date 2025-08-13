"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw } from "lucide-react";

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const generatePassword = () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        variant: "destructive",
        title: "No character types selected",
        description: "Please select at least one character type to generate a password.",
      });
      return;
    }

    let charSet = "";
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charSet.length;
      newPassword += charSet[randomIndex];
    }
    setPassword(newPassword);
    toast({
      title: "Password Generated!",
      description: "A new secure password has been generated.",
    });
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({ title: "Password Copied!" });
  };
  
  // Generate a password on initial load
  useState(() => {
    generatePassword();
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Password Generator</h1>
        <p className="text-muted-foreground text-lg">Create secure, random passwords for your accounts.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generated Password</CardTitle>
          <CardDescription>Use the options below to customize and generate a new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input
              readOnly
              value={password}
              className="pr-12 text-lg font-mono h-12 text-center"
              placeholder="Your password will appear here"
            />
            <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2" onClick={handleCopy} disabled={!password}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-6">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="length">Password Length</Label>
                <span className="font-bold text-lg">{length}</span>
              </div>
              <Slider
                id="length"
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
                <Label htmlFor="uppercase" className="cursor-pointer">ABC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
                <Label htmlFor="lowercase" className="cursor-pointer">abc</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
                <Label htmlFor="numbers" className="cursor-pointer">123</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
                <Label htmlFor="symbols" className="cursor-pointer">#$&</Label>
              </div>
            </div>
            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
