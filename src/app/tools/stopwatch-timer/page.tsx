
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { Separator } from '@/components/ui/separator';

export default function StopwatchTimerPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  
  const handleLap = () => {
    if (isRunning) {
        setLaps(prevLaps => [...prevLaps, time]);
    }
  }

  const formatTime = (time: number) => {
    const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Stopwatch</h1>
        <p className="text-muted-foreground text-lg">Measure time with precision.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Stopwatch</CardTitle>
          <CardDescription className="text-center">A simple and elegant stopwatch.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-7xl font-mono font-bold tracking-widest p-4 rounded-lg bg-muted w-full text-center">
            {formatTime(time)}
          </div>
          
          <div className="flex w-full justify-center gap-4">
            <Button onClick={handleReset} variant="outline" className="w-24">
              <RotateCcw className="h-5 w-5 mr-2" /> Reset
            </Button>
            <Button onClick={handleStartPause} className="w-32 text-lg">
              {isRunning ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
             <Button onClick={handleLap} variant="outline" className="w-24" disabled={!isRunning}>
              <Flag className="h-5 w-5 mr-2" /> Lap
            </Button>
          </div>

          {laps.length > 0 && (
            <div className="w-full space-y-2 pt-4">
                <Separator />
                <h3 className="text-center font-semibold text-muted-foreground">Laps</h3>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-2">
                    {laps.map((lap, index) => {
                        const previousLap = index > 0 ? laps[index - 1] : 0;
                        const lapTime = lap - previousLap;
                        return (
                             <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md text-sm font-mono">
                                <span>Lap {index + 1}</span>
                                <span>+ {formatTime(lapTime)}</span>
                                <span>{formatTime(lap)}</span>
                            </div>
                        )
                    }).reverse()}
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
