import { formatISO } from "date-fns";
import { getDateAdded } from "@/lib/date-seed";
import type { ApiProduct, Product } from "@/lib/types";

const API_BASE = "https://dummyjson.com";

export async function fetchProducts(limit = 100) {
  const res = await fetch(`${API_BASE}/products?limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to load products");
  }
  const data = (await res.json()) as { products: ApiProduct[]; total: number };
  return data;
}

export type CategoryOption = { value: string; label: string };

function normalizeCategories(payload: unknown): CategoryOption[] {
  if (!Array.isArray(payload)) return [];
  if (payload.length === 0) return [];

  if (typeof payload[0] === "string") {
    return (payload as string[]).map((value) => ({ value, label: value }));
  }

  return (payload as Array<{ slug?: string; name?: string; url?: string }>).map(
    (item) => ({
      value: item.slug ?? item.name ?? item.url ?? "unknown",
      label: item.name ?? item.slug ?? item.url ?? "unknown"
    })
  );
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  const data = (await res.json()) as unknown;
  return normalizeCategories(data);
}

export async function fetchProductById(id: string | number) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load product");
  }
  return (await res.json()) as ApiProduct;
}

export function withDateAdded(product: ApiProduct, baseDate?: Date): Product {
  const date = getDateAdded(product.id, baseDate);
  return {
    ...product,
    dateAdded: formatISO(date)
  };
}

export function withDateAddedList(products: ApiProduct[], baseDate?: Date) {
  return products.map((product) => withDateAdded(product, baseDate));
}
