"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import type { Product } from "@/lib/types";

export function FavoritesPanel({ products }: { products: Product[] }) {
  const { favorites } = useFavorites();
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Favorites
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Heart className="h-3.5 w-3.5" />
            {favorites.length} favorites
          </Badge>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
            Favorite items to build a quick-access list here.
          </div>
        ) : (
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-2">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.id}`}
                    className="block truncate text-sm font-semibold hover:text-primary"
                  >
                    {product.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">${product.price}</p>
                </div>
                <Button asChild size="sm" variant="ghost" className="shrink-0">
                  <Link href={`/products/${product.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
