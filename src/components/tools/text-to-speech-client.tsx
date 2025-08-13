"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateSpeech, type GenerateSpeechOutput } from "@/ai/flows/text-to-speech";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Volume2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  text: z.string().min(1, "Please enter some text to convert.").max(1000, "Text is limited to 1000 characters."),
  voice: z.string().default("Algenib"),
});

type FormValues = z.infer<typeof formSchema>;

const initialState: GenerateSpeechOutput & { error?: string } = {
  audioDataUri: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Audio...
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-4 w-4" />
          Generate Speech
        </>
      )}
    </Button>
  );
}

export function TextToSpeechClient() {
  const [state, formAction] = useFormState(generateSpeech, initialState);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "Hello, world! Welcome to MultiToolVerse. I can convert your text into speech.",
      voice: "Algenib",
    },
  });

  const handleDownload = () => {
    if (state.audioDataUri) {
      const link = document.createElement("a");
      link.href = state.audioDataUri;
      link.download = "speech.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        variant: "destructive",
        title: "No audio to download",
        description: "Please generate the audio first.",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Text-to-Speech</CardTitle>
        <CardDescription>
          Enter your text, choose a voice, and let our AI generate natural-sounding speech for you.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type or paste your text here..."
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Algenib">Algenib (Male)</SelectItem>
                      <SelectItem value="Achernar">Achernar (Male)</SelectItem>
                      <SelectItem value="Sirius">Sirius (Female)</SelectItem>
                      <SelectItem value="Vega">Vega (Female)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
      
      {state.audioDataUri && (
        <CardContent className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-center">Generated Audio</h3>
          <audio controls src={state.audioDataUri} className="w-full">
            Your browser does not support the audio element.
          </audio>
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download WAV
          </Button>
        </CardContent>
      )}
      {state.error && (
          <CardFooter>
            <div className="text-destructive text-sm font-medium">{state.error}</div>
          </CardFooter>
      )}
    </Card>
  );
}
