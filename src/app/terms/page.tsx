export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="font-headline text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="mt-8">1. Agreement to Terms</h2>
        <p>
          By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the services.
        </p>

        <h2 className="mt-8">2. Privacy Policy</h2>
        <p>
          Please refer to our Privacy Policy for information on how we collect, use, and disclose information from our users. You acknowledge and agree that your use of the Services is subject to our Privacy Policy.
        </p>

        <h2 className="mt-8">3. Changes to Terms or Services</h2>
        <p>
          We may update the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the updated Terms on the Site or through other communications. It’s important that you review the Terms whenever we update them or you use the Services.
        </p>

        <h2 className="mt-8">4. Who May Use the Services</h2>
        <p>
          You may use the Services only if you are 13 years or older and are not barred from using the Services under applicable law.
        </p>

        <h2 className="mt-8">5. User Conduct</h2>
        <p>
          You agree not to use the Services to:
        </p>
        <ul>
          <li>Violate any law or regulation.</li>
          <li>Infringe the rights of any third party, including without limitation, intellectual property, privacy, or contractual rights.</li>
          <li>Transmit any viruses, malware, or other malicious code.</li>
          <li>Interfere with or disrupt the integrity or performance of the Services.</li>
        </ul>

        <h2 className="mt-8">6. Termination</h2>
        <p>
          We may terminate your access to and use of the Services, at our sole discretion, at any time and without notice to you.
        </p>
        
        <h2 className="mt-8">7. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at: contact@multitoolverse.com
        </p>
      </article>
    </div>
  );
}
