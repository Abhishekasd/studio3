
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Percent, Calendar } from 'lucide-react';

interface LoanResult {
  monthlyPayment: string;
  totalPayment: string;
  totalInterest: string;
}

const COLORS = ['#0088FE', '#FF8042']; // Blue for Principal, Orange for Interest

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('5');
  const [result, setResult] = useState<LoanResult | null>(null);
  const { toast } = useToast();

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const termMonths = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || principal <= 0 || isNaN(rate) || rate < 0 || isNaN(termMonths) || termMonths <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter valid, positive numbers for all fields.",
      });
      return;
    }
    
    if(rate === 0) {
        const monthly = principal / termMonths;
        setResult({
            monthlyPayment: monthly.toFixed(2),
            totalPayment: principal.toFixed(2),
            totalInterest: '0.00'
        });
        return;
    }

    const monthlyPayment = (principal * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    });

     toast({
        title: "Calculation Complete",
        description: "Your loan details have been calculated.",
      });
  };

  const handleClear = () => {
    setLoanAmount('10000');
    setInterestRate('5');
    setLoanTerm('5');
    setResult(null);
  }

  const chartData = result ? [
    { name: 'Principal', value: parseFloat(loanAmount) },
    { name: 'Total Interest', value: parseFloat(result.totalInterest) }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Loan Calculator</h1>
        <p className="text-muted-foreground text-lg">Estimate your monthly loan payments.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>Enter your loan information to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="loan-amount">Loan Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="loan-amount" type="number" placeholder="e.g., 25000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="pl-9" />
              </div>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="interest-rate" type="number" placeholder="e.g., 5.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="pl-9" />
              </div>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="loan-term">Loan Term (Years)</Label>
               <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="loan-term" type="number" placeholder="e.g., 30" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
                <Button onClick={calculateLoan} className="flex-grow">Calculate</Button>
                <Button onClick={handleClear} variant="outline">Clear</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Your estimated loan breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center">
                {result ? (
                    <div className="w-full text-center space-y-4">
                        <div>
                            <p className="text-muted-foreground text-sm">Monthly Payment</p>
                            <p className="text-4xl font-bold text-primary">${result.monthlyPayment}</p>
                        </div>
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm pt-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-muted-foreground">Total Principal</p>
                                <p className="font-semibold">${parseFloat(loanAmount).toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-muted-foreground">Total Interest</p>
                                <p className="font-semibold">${parseFloat(result.totalInterest).toLocaleString()}</p>
                            </div>
                        </div>
                         <div className="p-3 bg-muted rounded-lg">
                                <p className="text-muted-foreground">Total Payment</p>
                                <p className="font-semibold text-lg">${parseFloat(result.totalPayment).toLocaleString()}</p>
                            </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <p>Your results will be displayed here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
