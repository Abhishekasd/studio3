"use client";

import { useFormState, useFormStatus } from "react-dom";
import { checkPlagiarism, type CheckPlagiarismOutput } from "@/ai/flows/plagiarism-checker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ScanText, ExternalLink, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const formSchema = z.object({
  text: z.string().min(100, "Please enter at least 100 characters to check for plagiarism.").max(10000, "Text is limited to 10,000 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const initialState: CheckPlagiarismOutput = {
  plagiarismPercentage: 0,
  sources: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking...
        </>
      ) : (
        <>
          <ScanText className="mr-2 h-4 w-4" />
          Check for Plagiarism
        </>
      )}
    </Button>
  );
}

export function PlagiarismCheckerClient() {
  const [state, formAction] = useFormState(checkPlagiarism, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const getRiskColor = (percentage: number) => {
    if (percentage > 25) return "bg-destructive";
    if (percentage > 10) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const hasChecked = state.sources && state.sources.length > 0 || state.plagiarismPercentage > 0;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Plagiarism Checker</CardTitle>
          <CardDescription>
            Paste your text below to scan it for potential plagiarism against online sources.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action={formAction}>
            <CardContent>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your essay, article, or any text here..."
                        className="resize-y min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>The results of the plagiarism scan will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasChecked ? (
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Plagiarism Risk</h3>
                     <span className="font-bold text-lg">{state.plagiarismPercentage}%</span>
                  </div>
                  <Progress value={state.plagiarismPercentage} className={`h-3 ${getRiskColor(state.plagiarismPercentage)}`} />
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Matched Sources</h3>
                    {state.sources.length > 0 ? (
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {state.sources.map((source, index) => (
                                <div key={index} className="p-3 bg-muted/50 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium truncate text-sm">{source.title || new URL(source.url).hostname}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-sm text-destructive font-semibold">
                                               <span>{source.matchPercentage}%</span>
                                               <Percent className="h-3 w-3" />
                                            </div>
                                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                                <Link href={source.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No matched sources found. The text appears to be original.</p>
                    )}
                </div>
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-10">
              <p>Your report will be displayed here after you run a check.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
