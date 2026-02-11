import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/products/product-detail";
import { fetchProductById, withDateAdded } from "@/lib/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const product = await fetchProductById(id);
    const productWithDate = withDateAdded(product, new Date());
    return <ProductDetail product={productWithDate} />;
  } catch {
    return notFound();
  }
}
