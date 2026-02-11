import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container py-20">
      <Card className="border-border/60 bg-card/80">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">Page not found</h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn’t exist. Head back to the product dashboard.
          </p>
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
