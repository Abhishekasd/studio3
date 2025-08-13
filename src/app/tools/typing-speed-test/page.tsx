
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Practice makes perfect, so keep typing and improve your speed and accuracy. Remember to take breaks and stretch your fingers.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. It involves tasks such as analysis, generating algorithms, profiling algorithms' accuracy and resource consumption, and the implementation of algorithms in a chosen programming language.",
  "The sun is a star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process. It is by far the most important source of energy for life on Earth.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them. To die—to sleep, No more;",
  "A journey of a thousand miles begins with a single step. This ancient proverb reminds us that great things are achieved through small, consistent efforts. Every expert was once a beginner. Keep learning and growing every day.",
];

const GAME_DURATION_SECONDS = 60;

export default function TypingSpeedTestPage() {
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [results, setResults] = useState<{ wpm: number; accuracy: number; } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const startNewTest = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setTextToType(sampleTexts[randomIndex]);
    setUserInput('');
    setTimeLeft(GAME_DURATION_SECONDS);
    setIsTestRunning(false);
    setResults(null);
    if(timerRef.current) clearInterval(timerRef.current);
    inputRef.current?.focus();
  };
  
  useEffect(() => {
    startNewTest();
  }, []);

  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestRunning) {
      endTest();
    }
    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestRunning, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (timeLeft === 0) return;

    if (!isTestRunning && value.length > 0) {
      setIsTestRunning(true);
    }
    
    if (value.length > textToType.length) return;

    setUserInput(value);
    
    if (value.length === textToType.length) {
        endTest();
    }
  };

  const endTest = () => {
    setIsTestRunning(false);
    if(timerRef.current) clearInterval(timerRef.current);
    
    const typedWords = userInput.trim().split(/\s+/).filter(Boolean);
    const correctWords = typedWords.filter((word, index) => {
        const originalWord = textToType.trim().split(/\s+/)[index];
        return originalWord === word;
    });

    const wordsTypedCount = userInput.length / 5;
    const timeElapsedMinutes = (GAME_DURATION_SECONDS - timeLeft) / 60;
    const wpm = timeElapsedMinutes > 0 ? Math.round(wordsTypedCount / timeElapsedMinutes) : 0;
    
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === textToType[i]) {
            correctChars++;
        }
    }
    const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;

    setResults({ wpm, accuracy });
  };
  
  const getCharClass = (charIndex: number) => {
    if (charIndex >= userInput.length) return "text-muted-foreground/80";
    if (userInput[charIndex] === textToType[charIndex]) return "text-foreground";
    return "text-destructive bg-destructive/20";
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Typing Speed Test</h1>
        <p className="text-muted-foreground text-lg">How fast can you type? Test your WPM and accuracy.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <div className="flex justify-between items-center">
                 <CardTitle>Test your speed</CardTitle>
                 <div className="text-2xl font-bold font-mono bg-primary text-primary-foreground rounded-md px-4 py-1">
                    {timeLeft}s
                 </div>
            </div>
            <CardDescription>Type the text below as quickly and accurately as you can.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-md text-xl font-mono tracking-wider leading-relaxed max-h-48 overflow-y-auto">
            {textToType.split('').map((char, index) => (
                <span key={index} className={cn('transition-colors duration-150', getCharClass(index))}>
                    {char}
                </span>
            ))}
          </div>

          <Input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here to begin the test..."
            className="w-full p-4 text-xl font-mono"
            disabled={timeLeft === 0 || results !== null}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <Button onClick={startNewTest} variant="secondary" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Test
          </Button>

          {results && (
            <div className="pt-6 border-t">
              <h3 className="text-center text-2xl font-bold mb-4">Your Results</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-4xl font-bold text-primary">{results.wpm}</p>
                  <p className="text-sm text-muted-foreground">Words Per Minute (WPM)</p>
                </div>
                 <div className="p-4 bg-muted rounded-lg">
                  <p className="text-4xl font-bold text-primary">{results.accuracy}%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
