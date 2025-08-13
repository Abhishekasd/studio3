
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/tool-registry";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.href} className="flex">
      <Card className="flex flex-col w-full hover:shadow-lg hover:border-primary transition-all duration-300">
        <CardHeader className="flex-grow">
          <div className="flex items-center gap-4 mb-2">
            <tool.icon className="w-8 h-8 text-primary" />
            <CardTitle>{tool.name}</CardTitle>
          </div>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <div className="p-6 pt-0 mt-auto">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:text-primary">
            Try tool <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}
