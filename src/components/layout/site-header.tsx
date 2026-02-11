"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";

export function SiteHeader() {
  const { count, hydrated } = useFavorites();

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Indigo Commerce</p>
              <p className="text-sm text-muted-foreground">Product management studio</p>
            </div>
          </Link>
          {hydrated && (
            <Badge variant="secondary" className="hidden items-center gap-1 md:inline-flex">
              <Heart className="h-3.5 w-3.5" />
              {count} favorites
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Spring 2026 drop
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
