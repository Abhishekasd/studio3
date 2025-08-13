import { MetaTagGeneratorClient } from "@/components/tools/meta-tag-generator-client";

export const metadata = {
  title: "AI Meta Tag Generator | MultiToolVerse",
  description: "Generate SEO-optimized meta tags for your website using our AI-powered tool. Improve your search engine ranking with perfectly crafted titles and descriptions.",
};

export default function MetaTagGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">AI Meta Tag Generator</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Craft perfect SEO meta tags in seconds. Let our AI help you create compelling titles and descriptions that rank.
        </p>
      </div>
      <MetaTagGeneratorClient />
    </div>
  );
}
