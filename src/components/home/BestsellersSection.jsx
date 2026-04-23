import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductCard from "../shared/ProductCard";
import SectionHeader from "../shared/SectionHeader";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BestsellersSection() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: () => base44.entities.Product.filter({ is_bestseller: true }, "-rating", 8),
  });
  if (isLoading) return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-secondary rounded-sm" /><div className="mt-4 h-4 bg-secondary rounded w-3/4" /></div>)}
      </div>
    </section>
  );
  if (products.length === 0) return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader eyebrow="Most Loved" title="Bestsellers" subtitle="Add products via the Admin panel to see them here." />
    </section>
  );
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader eyebrow="Most Loved" title="Bestsellers" subtitle="The products our community can't stop talking about" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {products.slice(0, 8).map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
      </div>
      <div className="mt-14 text-center">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm uppercase tracking-editorial text-foreground hover:text-primary transition-colors border-b border-foreground/20 pb-1">
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
