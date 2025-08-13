"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateMetaTags, type GenerateMetaTagsOutput } from "@/ai/flows/generate-meta-tags";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters.").max(70, "Title must be 70 characters or less."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(160, "Description must be 160 characters or less."),
  keywords: z.string().min(3, "Please provide at least one keyword."),
});

type FormValues = z.infer<typeof formSchema>;

const initialState: GenerateMetaTagsOutput & { error?: string } = {
  metaTags: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Meta Tags
        </>
      )}
    </Button>
  );
}

export function MetaTagGeneratorClient() {
  const [state, formAction] = useFormState(generateMetaTags, initialState);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
    },
  });

  const handleFormAction = async (formData: FormData) => {
    const values = Object.fromEntries(formData.entries());
    const result = await generateMetaTags(values as any);
    if(result.metaTags) {
      // Simple parsing to update preview
      const titleMatch = result.metaTags.match(/<title>(.*?)<\/title>/);
      const descMatch = result.metaTags.match(/<meta name="description" content="(.*?)"/);
      setGeneratedTitle(titleMatch ? titleMatch[1] : form.getValues("title"));
      setGeneratedDescription(descMatch ? descMatch[1] : form.getValues("description"));
    }
    formAction(values as any);
  };
  
  const copyToClipboard = () => {
    if (state.metaTags) {
      navigator.clipboard.writeText(state.metaTags);
      toast({
        title: "Copied to clipboard!",
        description: "Meta tags have been copied successfully.",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate SEO Meta Tags</CardTitle>
          <CardDescription>
            Enter details about your webpage, and our AI will generate optimized meta tags for you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action={handleFormAction}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Best SEO Tools for 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A short, compelling description of your page content." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., seo, marketing, tools, analysis" {...field} />
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

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Google Preview</CardTitle>
            <CardDescription>This is how your page might appear in Google search results.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
                <p className="text-blue-800 text-lg truncate dark:text-blue-400">{generatedTitle || "Your Awesome Page Title"}</p>
                <p className="text-green-700 text-sm truncate dark:text-green-400">https://yourwebsite.com/your-page</p>
                <p className="text-gray-600 text-sm dark:text-gray-400">{generatedDescription || "This is a preview of how your page description will look. Make it catchy and informative to attract clicks."}</p>
            </div>
          </CardContent>
        </Card>
        
        {state.metaTags && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Tags</CardTitle>
                <CardDescription>Copy these tags into the `&lt;head&gt;` of your HTML.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-5 w-5" />
                <span className="sr-only">Copy</span>
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                <code>{state.metaTags}</code>
              </pre>
            </CardContent>
          </Card>
        )}
        {state.error && (
            <div className="text-destructive text-sm font-medium">{state.error}</div>
        )}
      </div>
    </div>
  );
}
