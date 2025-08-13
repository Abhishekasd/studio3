"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from 'lucide-react';

// --- Conversion Data and Logic ---

type Unit = {
  label: string;
  value: string;
};

type UnitCategory = {
  name: string;
  units: Unit[];
  baseUnit: string;
  conversionFactors: Record<string, number>;
};

const conversionData: Record<string, UnitCategory> = {
  length: {
    name: 'Length',
    units: [
      { label: 'Meters', value: 'm' },
      { label: 'Kilometers', value: 'km' },
      { label: 'Centimeters', value: 'cm' },
      { label: 'Millimeters', value: 'mm' },
      { label: 'Miles', value: 'mi' },
      { label: 'Yards', value: 'yd' },
      { label: 'Feet', value: 'ft' },
      { label: 'Inches', value: 'in' },
    ],
    baseUnit: 'm',
    conversionFactors: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.34,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    },
  },
  weight: {
    name: 'Weight',
    units: [
      { label: 'Kilograms', value: 'kg' },
      { label: 'Grams', value: 'g' },
      { label: 'Milligrams', value: 'mg' },
      { label: 'Pounds', value: 'lb' },
      { label: 'Ounces', value: 'oz' },
    ],
    baseUnit: 'kg',
    conversionFactors: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.453592,
      oz: 0.0283495,
    },
  },
  temperature: {
    name: 'Temperature',
    units: [
      { label: 'Celsius', value: 'c' },
      { label: 'Fahrenheit', value: 'f' },
      { label: 'Kelvin', value: 'k' },
    ],
    baseUnit: 'c',
    conversionFactors: {}, // Special handling for temperature
  },
};

// --- Component ---

export default function UnitConverterPage() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('1');
  
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const defaultUnits = conversionData[newCategory].units;
    setFromUnit(defaultUnits[0].value);
    setToUnit(defaultUnits[1].value);
    setInputValue('1');
  };

  const convertUnits = (value: number, from: string, to: string, cat: string) => {
    if (isNaN(value)) return '';

    if (cat === 'temperature') {
      if (from === to) return value;
      let celsius: number;
      // Convert input to Celsius first
      if (from === 'f') celsius = (value - 32) * 5 / 9;
      else if (from === 'k') celsius = value - 273.15;
      else celsius = value;

      // Convert from Celsius to target unit
      if (to === 'f') return (celsius * 9 / 5) + 32;
      if (to === 'k') return celsius + 273.15;
      return celsius; // to Celsius
    } else {
      const categoryData = conversionData[cat];
      const fromFactor = categoryData.conversionFactors[from];
      const toFactor = categoryData.conversionFactors[to];
      const baseValue = value * fromFactor;
      return baseValue / toFactor;
    }
  };
  
  const outputValue = useMemo(() => {
    const result = convertUnits(parseFloat(inputValue), fromUnit, toUnit, category);
    return typeof result === 'number' ? parseFloat(result.toPrecision(6)) : '';
  }, [inputValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };
  
  const currentUnits = conversionData[category].units;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Unit Converter</h1>
        <p className="text-muted-foreground text-lg">Convert length, weight, temperature, and more.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Converter</CardTitle>
          <CardDescription>Select a category and units to convert.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(conversionData).map((key) => (
                  <SelectItem key={key} value={key}>
                    {conversionData[key].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* From */}
            <div className="grid gap-2 w-full">
              <Label htmlFor="from-value">From</Label>
              <Input id="from-value" type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="pt-6">
              <Button variant="ghost" size="icon" onClick={swapUnits} aria-label="Swap units">
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* To */}
            <div className="grid gap-2 w-full">
              <Label htmlFor="to-value">To</Label>
              <Input id="to-value" readOnly value={outputValue} className="bg-muted font-bold" />
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
