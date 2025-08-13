import { TextToSpeechClient } from "@/components/tools/text-to-speech-client";

export const metadata = {
  title: "Text to Speech Converter | MultiToolVerse",
  description: "Convert written text into natural-sounding speech with our AI-powered TTS tool. Choose from various voices and download the audio as a WAV file.",
};

export default function TextToSpeechPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">AI Text-to-Speech Converter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Bring your text to life. Generate high-quality audio from text in seconds with our advanced AI voices.
        </p>
      </div>
      <TextToSpeechClient />
    </div>
  );
}
