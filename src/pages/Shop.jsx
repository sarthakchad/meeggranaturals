import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductCard from "../components/shared/ProductCard";
import FilterSidebar from "../components/shop/FilterSidebar";
import SectionHeader from "../components/shared/SectionHeader";
import { SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Shop() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [gridCols, setGridCols] = useState(3);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters = {};
    if (params.get("category")) newFilters.category = [params.get("category")];
    if (params.get("concern")) newFilters.concern = [params.get("concern")];
    if (Object.keys(newFilters).length > 0) setFilters(newFilters);
  }, []);

  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.Product.list("-created_date", 100) });

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.category?.length > 0) result = result.filter((p) => filters.category.includes(p.category));
    if (filters.concern?.length > 0) result = result.filter((p) => p.concerns?.some((c) => filters.concern.includes(c)));
    if (filters.skin_type?.length > 0) result = result.filter((p) => p.skin_types?.some((s) => filters.skin_type.includes(s) || s === "all"));
    if (filters.hair_type?.length > 0) result = result.filter((p) => p.hair_types?.some((h) => filters.hair_type.includes(h) || h === "all"));
    if (sortBy === "price_low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "newest") result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return result;
  }, [products, filters, sortBy]);

  const gridClass = gridCols === 2 ? "grid-cols-2" : gridCols === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Our Collection" title="Shop All Products" subtitle="Natural, effective skincare and haircare for everyone" />
        <div className="flex items-center justify-between mb-8 gap-4">
          <button onClick={() => setMobileFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm"><SlidersHorizontal className="w-4 h-4" />Filters</button>
          <div className="flex items-center gap-4 ml-auto">
            <p className="text-sm text-muted-foreground hidden sm:block">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</p>
            <div className="hidden lg:flex items-center gap-1 border border-border rounded-sm p-0.5">
              <button onClick={() => setGridCols(3)} className={`p-1.5 rounded-sm ${gridCols === 3 ? "bg-secondary" : ""}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setGridCols(4)} className={`p-1.5 rounded-sm ${gridCols === 4 ? "bg-secondary" : ""}`}><LayoutGrid className="w-4 h-4" /></button>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-10">
          <FilterSidebar filters={filters} onFilterChange={setFilters} mobileOpen={mobileFilters} onMobileClose={() => setMobileFilters(false)} />
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid ${gridClass} gap-x-6 gap-y-10`}>
                {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-secondary rounded-sm" /><div className="mt-4 h-4 bg-secondary rounded w-3/4" /></div>)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl mb-2">No products found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters or add products via the Admin panel</p>
              </div>
            ) : (
              <div className={`grid ${gridClass} gap-x-6 gap-y-10`}>
                {filteredProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
