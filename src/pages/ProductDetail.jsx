import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDetails from "../components/product/ProductDetails";
import ProductReviews from "../components/product/ProductReviews";
import ProductCard from "../components/shared/ProductCard";
import SectionHeader from "../components/shared/SectionHeader";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => { const products = await base44.entities.Product.filter({ id }); return products[0]; },
  });
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["relatedProducts", product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product.category }, "-rating", 5),
    enabled: !!product?.category,
  });

  if (isLoading) return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-secondary rounded-sm" />
        <div className="space-y-4"><div className="h-4 bg-secondary rounded w-1/4" /><div className="h-8 bg-secondary rounded w-3/4" /><div className="h-6 bg-secondary rounded w-1/3" /><div className="h-20 bg-secondary rounded" /></div>
      </div>
    </div>
  );
  if (!product) return <div className="pt-24 pb-20 text-center"><p className="font-display text-2xl">Product not found</p></div>;

  const galleryImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);
  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ProductGallery images={galleryImages} name={product.name} />
          <div><ProductInfo product={product} /><ProductDetails product={product} /></div>
        </div>
        <div className="mt-16"><ProductReviews productId={product.id} /></div>
        {related.length > 0 && (
          <div className="mt-20">
            <SectionHeader eyebrow="You May Also Like" title="Related Products" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
