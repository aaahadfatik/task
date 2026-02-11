"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays, FilterX, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { ProductsChart } from "@/components/products/products-chart";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { CategoryOption } from "@/lib/products";
import type { Product } from "@/lib/types";

const ITEMS_PER_PAGE = 10;
const LazyCalendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  { ssr: false }
);

type ProductsPageProps = {
  initialProducts: Product[];
  initialCategories: CategoryOption[];
};

export function ProductsPage({ initialProducts, initialCategories }: ProductsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<CategoryOption[]>(initialCategories);
  const [error] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [initialized, setInitialized] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 350);
  const lastQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialized) return;
    const q = searchParams.get("q") ?? "";
    const categoryParam = searchParams.get("category") ?? "all";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const pageParam = searchParams.get("page");

    setSearch(q);
    setCategory(categoryParam);
    if (fromParam || toParam) {
      setDateRange({
        from: fromParam ? parseISO(fromParam) : undefined,
        to: toParam ? parseISO(toParam) : undefined
      });
    }
    if (pageParam && Number.isFinite(Number(pageParam))) {
      setPage(Math.max(1, Number(pageParam)));
    }
    setInitialized(true);
  }, [initialized, searchParams]);

  // Intentional: we only hydrate state from URL once on mount to avoid feedback loops.

  useEffect(() => {
    if (!initialized) return;
    setPage(1);
  }, [debouncedSearch, category, dateRange?.from, dateRange?.to, initialized]);

  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
    if (category !== "all") params.set("category", category);
    if (dateRange?.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    const current = typeof window !== "undefined" ? window.location.search.slice(1) : "";
    if (query !== current) {
      lastQueryRef.current = query;
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    }
  }, [debouncedSearch, category, dateRange, page, initialized, router]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = normalizedSearch
        ? product.title.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesCategory = category === "all" ? true : product.category === category;
      const matchesDateRange = (() => {
        if (!dateRange?.from || !dateRange?.to) return true;
        const date = parseISO(product.dateAdded);
        return date >= dateRange.from && date <= dateRange.to;
      })();

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [products, debouncedSearch, category, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
      : format(dateRange.from, "MMM d, yyyy")
    : "Select range";

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Product Library
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Curate the newest arrivals</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Filter by category, search by name, or narrow by when a product joined the catalog.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Active filters
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors">
              {category === "all" ? "All categories" : category}
            </span>
            <span className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors">
              {debouncedSearch ? `Search: ${debouncedSearch}` : "No search"}
            </span>
            <span className="rounded-full border border-border/70 bg-background px-3 py-1 transition-colors">
              {dateRange?.from ? dateLabel : "Any date"}
            </span>
          </div>
        </div>
      </section>

      {!error && products.length > 0 && <ProductsChart products={products} />}

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="pl-9"
              aria-label="Search products"
            />
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className={cn(!dateRange?.from && "text-muted-foreground")}>
                    {dateLabel}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col gap-3 p-4">
                  {calendarOpen && (
                    <LazyCalendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                      onDayMouseEnter={(day) => setHoveredDate(day)}
                      onDayMouseLeave={() => setHoveredDate(null)}
                    />
                  )}
                  <div className="rounded-lg border border-border/60 bg-background p-3 text-sm shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Preview
                    </p>
                    <p className="mt-1 text-sm">
                      {hoveredDate
                        ? format(hoveredDate, "EEEE, MMMM d, yyyy")
                        : "Hover a date to preview"}
                    </p>
                  </div>
                  {dateRange?.from && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-muted-foreground"
                      onClick={() => setDateRange(undefined)}
                    >
                      <FilterX className="mr-2 h-4 w-4" />
                      Clear date filter
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setDateRange(undefined);
                    }}
                  >
                    Reset filters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all filters and start fresh</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-6 text-sm text-destructive">
            {error}. Please refresh and try again.
          </CardContent>
        </Card>
      )}

      {!error && (
        <section className="space-y-6">
          {filteredProducts.length === 0 ? (
            <Card className="border-border/60 bg-card/80">
              <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                <p className="text-lg font-semibold">No products match these filters.</p>
                <p className="text-sm text-muted-foreground">
                  Adjust your search or broaden the date range to see more items.
                </p>
                <Button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setDateRange(undefined);
                  }}
                >
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
