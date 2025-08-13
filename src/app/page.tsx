
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getTools, getToolCategories, Tool } from "@/lib/tool-registry";
import { ArrowRight, Star, Bot, FileImage } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const allTools = await getTools();
  const toolCategories = await getToolCategories();

  // Logic to get featured and recently added tools
  const featuredTools = allTools.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0)).slice(0, 6);
  const recentlyAddedTools = allTools.sort((a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0)).slice(0, 6);

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Web Developer",
      quote: "MultiToolVerse has become my go-to for quick utilities. The JSON Formatter and Case Converter are lifesavers!",
      avatar: "https://placehold.co/100x100.png"
    },
    {
      name: "Samantha Lee",
      role: "Content Creator",
      quote: "The Slug Generator and Meta Tag Generator are essential parts of my workflow. So easy to use and completely free!",
      avatar: "https://placehold.co/100x100.png"
    },
    {
      name: "David Chen",
      role: "Student",
      quote: "I use the Palindrome Checker and Word Counter for my assignments all the time. It's fast, reliable, and has a clean interface.",
      avatar: "https://placehold.co/100x100.png"
    }
  ];
  
   const heroCategories = toolCategories.filter(c => ["text-tools", "developer-tools", "converters", "calculators", "ai-tools", "pdf-tools"].includes(c.slug));


  return (
    <div className="flex flex-col items-center">
      {/* 3D Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 font-headline">
            All-in-One <span className="text-primary">Multi-Tool</span> Hub
          </h1>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-muted-foreground mb-12">
            Explore our universe of tools. Convert, Create, Calculate, and Play — all in one place.
          </p>
          <div className="perspective-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {heroCategories.map((category) => (
              <Link key={category.id} href={`/tools?category=${category.slug}`}>
                 <div className="preserve-3d group">
                    <Card className="card-hover-effect h-full bg-background/50 backdrop-blur-sm border-white/20">
                      <CardHeader className="items-center text-center">
                        <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20">
                           <category.icon className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{category.name}</CardTitle>
                        <CardDescription className="text-base">{category.description}</CardDescription>
                      </CardHeader>
                    </Card>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
            Featured Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="h-full group transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl hover:border-primary">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <tool.icon className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

       {/* AI Tools Highlight Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-12 flex flex-col justify-center items-start min-h-[300px]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-headline text-white">Discover Our AI-Powered Tools</h2>
            <p className="max-w-lg text-white/80 md:text-lg mb-6">
              Supercharge your productivity with our suite of AI tools, from the AI Meta Tag Generator to our upcoming AI Resume Builder.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/tools?category=ai-tools">
                Explore AI Tools <Bot className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-headline">Trusted by Professionals</h2>
           <p className="text-muted-foreground text-lg text-center mb-12">100% Free & Secure</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={50} height={50} className="rounded-full" data-ai-hint="person portrait" />
                    <div className="ml-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"{testimonial.quote}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Tools Section (Carousel) can be added here once we have more tools */}

      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Ready to Boost Your Productivity?</h2>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-lg mb-8">
            Dive in and explore our collection of tools. No sign-up required for most features.
          </p>
          <Button asChild size="lg">
            <Link href="/tools">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Simple background pattern
const GridPattern = () => (
  <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
    <defs>
      <pattern id="grid-pattern" width="72" height="72" patternUnits="userSpaceOnUse" x="50%" y="50%">
        <path d="M.5 71.5V.5H71.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
  </svg>
);
