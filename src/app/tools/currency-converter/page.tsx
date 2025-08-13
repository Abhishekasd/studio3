"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Loader2 } from 'lucide-react';

const API_URL = "https://api.frankfurter.app";

interface Currencies {
  [key: string]: string;
}

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState<Currencies>({});
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch(`${API_URL}/currencies`);
        if (!res.ok) throw new Error("Failed to fetch currencies.");
        const data = await res.json();
        setCurrencies(data);
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrencies();
  }, [toast]);

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
        toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid number."});
        return;
    }
    if (fromCurrency === toCurrency) {
        setConvertedAmount(amount);
        return;
    }
    setIsConverting(true);
    try {
        const res = await fetch(`${API_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
        if (!res.ok) throw new Error("Failed to fetch exchange rate.");
        const data = await res.json();
        setConvertedAmount(data.rates[toCurrency].toFixed(4));
    } catch(error: any) {
        toast({ variant: "destructive", title: "Conversion Failed", description: error.message });
    } finally {
        setIsConverting(false);
    }
  };
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount || '1');
    setConvertedAmount(amount);
  }

  const currencyOptions = useMemo(() => Object.entries(currencies).map(([code, name]) => ({
      value: code,
      label: `${code} - ${name}`
  })), [currencies]);

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Currency Converter</h1>
        <p className="text-muted-foreground text-lg">Get real-time exchange rates.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
          <CardDescription>Enter an amount and select your currencies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1.00" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="grid gap-2 w-full">
              <Label htmlFor="from-currency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">
                <Button variant="ghost" size="icon" onClick={handleSwap}>
                    <ArrowRightLeft className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="to-currency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleConvert} disabled={isConverting || isLoading} className="w-full">
              {isConverting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {isConverting ? 'Converting...' : 'Convert'}
          </Button>

          {convertedAmount && (
            <div className="text-center pt-4 border-t">
                <p className="text-muted-foreground">{amount} {currencies[fromCurrency]} equals</p>
                <p className="text-4xl font-bold text-primary">{convertedAmount} <span className="text-2xl">{currencies[toCurrency]}</span></p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
