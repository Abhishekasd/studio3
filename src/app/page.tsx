import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toolCategories } from "@/lib/tool-registry";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 font-headline">
            Welcome to <span className="text-primary">MultiToolVerse</span>
          </h1>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Your all-in-one suite of online utilities. Convert, calculate, generate, and format with our powerful and easy-to-use tools.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/tools">
                Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
            A Universe of Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map((category) => (
              <Card key={category.id} className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <category.icon className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-card">
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
