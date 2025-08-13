
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#ffffff");
  const [r, setR] = useState("255");
  const [g, setG] = useState("255");
  const [b, setB] = useState("255");
  const { toast } = useToast();

  const isValidHex = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  const isValidRgb = (value: string) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHex(newHex);
    if (isValidHex(newHex)) {
      const { r, g, b } = hexToRgb(newHex);
      setR(r.toString());
      setG(g.toString());
      setB(b.toString());
    }
  };
  
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const setters = { r: setR, g: setG, b: setB };
    setters[channel](value);

    const currentR = channel === 'r' ? value : r;
    const currentG = channel === 'g' ? value : g;
    const currentB = channel === 'b' ? value : b;

    if (isValidRgb(currentR) && isValidRgb(currentG) && isValidRgb(currentB)) {
      const newHex = rgbToHex(parseInt(currentR), parseInt(currentG), parseInt(currentB));
      setHex(newHex);
    }
  };

  const hexToRgb = (hexColor: string) => {
    let hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `Copied ${label}!` });
  };
  
  const formattedRgb = useMemo(() => `rgb(${r}, ${g}, ${b})`, [r,g,b]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Color Code Converter</h1>
        <p className="text-muted-foreground text-lg">Convert between HEX and RGB color formats.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Color Converter</CardTitle>
          <CardDescription>Enter a color in either HEX or RGB format to convert it.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-center">
          <div className="w-full h-48 rounded-lg border" style={{ backgroundColor: isValidHex(hex) ? hex : 'transparent' }} />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="hex-input">HEX</Label>
              <div className="flex items-center gap-2">
                <Input id="hex-input" value={hex} onChange={handleHexChange} className="font-mono" />
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(hex, "HEX")}>
                    <Copy className="h-4 w-4"/>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="r-input">R</Label>
                <Input id="r-input" type="number" min="0" max="255" value={r} onChange={(e) => handleRgbChange('r', e.target.value)} className="font-mono" />
              </div>
              <div>
                <Label htmlFor="g-input">G</Label>
                <Input id="g-input" type="number" min="0" max="255" value={g} onChange={(e) => handleRgbChange('g', e.target.value)} className="font-mono" />
              </div>
              <div>
                <Label htmlFor="b-input">B</Label>
                <Input id="b-input" type="number" min="0" max="255" value={b} onChange={(e) => handleRgbChange('b', e.target.value)} className="font-mono" />
              </div>
            </div>
             <div className="flex items-center gap-2">
                <Input readOnly value={formattedRgb} className="font-mono bg-muted"/>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formattedRgb, "RGB")}>
                    <Copy className="h-4 w-4"/>
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
