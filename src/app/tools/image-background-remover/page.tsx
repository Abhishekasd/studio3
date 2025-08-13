import { ImageBackgroundRemoverClient } from "@/components/tools/image-background-remover-client";

export const metadata = {
  title: "AI Image Background Remover | MultiToolVerse",
  description: "Automatically remove the background from any image with a single click using our powerful AI tool.",
};

export default function ImageBackgroundRemoverPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">AI Image Background Remover</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload an image and let our AI instantly remove the background for you. Perfect for product photos, portraits, and more.
        </p>
      </div>
      <ImageBackgroundRemoverClient />
    </div>
  );
}
