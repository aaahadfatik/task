"use client";

import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  return (
    <Card className="group overflow-hidden border-border/60 bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavorite(product.id)}
          className={cn(
            "absolute right-3 top-3 rounded-full bg-background/80 shadow-sm backdrop-blur hover:bg-background",
            favorite && "text-primary"
          )}
        >
          <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{product.category}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-amber-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>
        <CardTitle className="text-lg">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">${product.price}</p>
          <p className="text-xs text-muted-foreground">
            Added {format(parseISO(product.dateAdded), "MMM d, yyyy")}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href={`/products/${product.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
