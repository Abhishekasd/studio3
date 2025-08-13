import { PlagiarismCheckerClient } from "@/components/tools/plagiarism-checker-client";

export const metadata = {
  title: "AI Plagiarism Checker | MultiToolVerse",
  description: "Check your text for plagiarism against billions of web pages and academic papers with our advanced AI tool.",
};

export default function PlagiarismCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">AI Plagiarism Checker</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ensure originality and academic integrity. Paste your text below to scan for potential plagiarism.
        </p>
      </div>
      <PlagiarismCheckerClient />
    </div>
  );
}
