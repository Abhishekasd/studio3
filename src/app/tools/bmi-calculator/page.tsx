
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type UnitSystem = "metric" | "imperial";

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
}

export default function BmiCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const { toast } = useToast();

  const calculateBmi = () => {
    let heightMeters: number;
    let weightInKg: number;

    if (unitSystem === "metric") {
      if (!heightCm || !weightKg || +heightCm <= 0 || +weightKg <= 0) {
        toast({ variant: "destructive", title: "Invalid input", description: "Please enter positive values for height and weight." });
        return;
      }
      heightMeters = parseFloat(heightCm) / 100;
      weightInKg = parseFloat(weightKg);
    } else { // Imperial
      if (!heightFt || !heightIn || !weightLbs || (+heightFt <= 0 && +heightIn <= 0) || +weightLbs <= 0) {
        toast({ variant: "destructive", title: "Invalid input", description: "Please enter positive values for height and weight." });
        return;
      }
      const totalInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn);
      heightMeters = totalInches * 0.0254;
      weightInKg = parseFloat(weightLbs) * 0.453592;
    }

    if (isNaN(heightMeters) || isNaN(weightInKg) || heightMeters <= 0 || weightInKg <= 0) {
        toast({ variant: "destructive", title: "Calculation error", description: "Please check your inputs." });
        return;
    }

    const bmi = weightInKg / (heightMeters * heightMeters);
    setResult(getBmiResult(bmi));
  };
  
  const getBmiResult = (bmi: number): BmiResult => {
    if (bmi < 18.5) {
      return { bmi, category: "Underweight", color: "text-blue-400" };
    } else if (bmi >= 18.5 && bmi < 25) {
      return { bmi, category: "Normal weight", color: "text-green-400" };
    } else if (bmi >= 25 && bmi < 30) {
      return { bmi, category: "Overweight", color: "text-yellow-400" };
    } else {
      return { bmi, category: "Obesity", color: "text-red-400" };
    }
  };

  const handleClear = () => {
    setHeightCm("");
    setWeightKg("");
    setHeightFt("");
    setHeightIn("");
    setWeightLbs("");
    setResult(null);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">BMI Calculator</h1>
        <p className="text-muted-foreground text-lg">Check your Body Mass Index.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Enter Your Details</CardTitle>
          <CardDescription>Select your preferred unit system and enter your measurements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={unitSystem} onValueChange={(value) => setUnitSystem(value as UnitSystem)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metric">Metric (cm, kg)</TabsTrigger>
              <TabsTrigger value="imperial">Imperial (ft, in, lbs)</TabsTrigger>
            </TabsList>
            <TabsContent value="metric" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="height-cm">Height (cm)</Label>
                <Input id="height-cm" type="number" placeholder="e.g., 180" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight-kg">Weight (kg)</Label>
                <Input id="weight-kg" type="number" placeholder="e.g., 75" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="imperial" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height-ft">Height (ft)</Label>
                  <Input id="height-ft" type="number" placeholder="e.g., 5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height-in">Height (in)</Label>
                  <Input id="height-in" type="number" placeholder="e.g., 10" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                <Input id="weight-lbs" type="number" placeholder="e.g., 165" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2 mt-6">
            <Button onClick={calculateBmi} className="flex-grow">Calculate BMI</Button>
            <Button onClick={handleClear} variant="outline">Clear</Button>
          </div>

          {result && (
            <div className="mt-6 text-center bg-muted p-6 rounded-lg">
              <p className="text-muted-foreground text-sm">Your BMI is</p>
              <p className={`text-6xl font-bold ${result.color}`}>{result.bmi.toFixed(1)}</p>
              <p className={`text-xl font-semibold ${result.color}`}>{result.category}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

