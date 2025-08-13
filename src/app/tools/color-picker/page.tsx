"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b };
};

// Helper function to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};


export default function ColorPickerPage() {
    const [color, setColor] = useState("#1a8fe3");
    const { toast } = useToast();

    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `Copied ${label} to clipboard!` });
    };

    const ColorValueDisplay = ({ label, value }: { label: string, value: string }) => (
        <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2">
                <Input readOnly value={value} className="font-mono bg-muted flex-grow" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(value, label)}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline">Color Picker</h1>
                <p className="text-muted-foreground text-lg">Pick a color and get its values in different formats.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Color Preview</CardTitle>
                        <CardDescription>Use the picker below to select a color.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="w-full h-56 rounded-lg border-4" style={{ backgroundColor: color, borderColor: color }} />
                        <Input
                            type="color"
                            value={color}
                            onChange={handleColorChange}
                            className="w-full h-12 p-1 cursor-pointer"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Color Values</CardTitle>
                        <CardDescription>The corresponding values for your selected color.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ColorValueDisplay label="HEX" value={color} />
                        <ColorValueDisplay label="RGB" value={rgbString} />
                        <ColorValueDisplay label="HSL" value={hslString} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
