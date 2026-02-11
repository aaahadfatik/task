"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Button>

      <Card className="overflow-hidden border-border/60 bg-card/80 shadow-lg">
        <CardContent className="grid gap-8 p-6 lg:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-background">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{product.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-amber-400" />
                {product.rating.toFixed(1)} rating
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold">{product.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-2xl font-semibold">${product.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date added</p>
                <p className="text-base font-medium">
                  {format(parseISO(product.dateAdded), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => toggleFavorite(product.id)}
                variant={favorite ? "default" : "outline"}
                className="gap-2"
                aria-pressed={favorite}
              >
                <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
                {favorite ? "Favorited" : "Add to favorites"}
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/">Browse more</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/70">
        <CardContent className="grid gap-6 p-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Stock status</p>
            <p className="text-lg font-semibold">In Stock</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Brand</p>
            <p className="text-lg font-semibold">{product.brand ?? "Studio"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="text-lg font-semibold">{product.category}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
