import { ProductsPage } from "@/components/products/products-page";
import { fetchCategories, fetchProducts, withDateAddedList } from "@/lib/products";

export default async function Home() {
  const [productResponse, categories] = await Promise.all([
    fetchProducts(100),
    fetchCategories()
  ]);
  const baseDate = new Date();
  const products = withDateAddedList(productResponse.products, baseDate);

  return <ProductsPage initialProducts={products} initialCategories={categories} />;
}
