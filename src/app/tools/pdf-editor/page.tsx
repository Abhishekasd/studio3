
import { PdfEditorClient } from '@/components/tools/pdf-editor-client';

export default function PdfEditorPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">PDF Editor</h1>
        <p className="text-muted-foreground text-lg">Organize, secure, and modify your PDF files with ease.</p>
      </div>
      <PdfEditorClient />
    </div>
  );
}
