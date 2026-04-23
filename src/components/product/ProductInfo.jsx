import { useState } from "react";
import { Star, Heart, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Leaf } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const queryClient = useQueryClient();
  const { data: wishlistItems = [] } = useQuery({ queryKey: ["wishlistItems"], queryFn: () => base44.entities.WishlistItem.list() });
  const isWishlisted = wishlistItems.some((w) => w.product_id === product.id);

  const addToCart = async () => {
    setAdding(true);
    const existing = await base44.entities.CartItem.filter({ product_id: product.id });
    if (existing.length > 0) {
      await base44.entities.CartItem.update(existing[0].id, { quantity: (existing[0].quantity || 1) + quantity });
    } else {
      await base44.entities.CartItem.create({ product_id: product.id, product_name: product.name, product_image: product.image_url, price: product.price, quantity });
    }
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    toast.success(`${product.name} added to bag`);
    setAdding(false);
  };

  const toggleWishlist = async () => {
    if (isWishlisted) {
      const item = wishlistItems.find((w) => w.product_id === product.id);
      if (item) { await base44.entities.WishlistItem.delete(item.id); toast.success("Removed from wishlist"); }
    } else {
      await base44.entities.WishlistItem.create({ product_id: product.id, product_name: product.name, product_image: product.image_url, price: product.price });
      toast.success("Added to wishlist");
    }
    queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
  };

  return (
    <div className="space-y-6">
      <div>
        {product.category && <p className="text-[11px] uppercase tracking-ultra-wide text-muted-foreground mb-2">{product.category}</p>}
        <h1 className="font-display text-3xl md:text-4xl font-light">{product.name}</h1>
        {product.rating && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? "fill-accent text-accent" : "text-border"}`} />)}</div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.review_count || 0} reviews)</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-3xl">₹{product.price?.toFixed(2)}</span>
        {product.original_price && product.original_price > product.price && (
          <>
            <span className="text-lg text-muted-foreground line-through">₹{product.original_price?.toFixed(2)}</span>
            <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-sm">
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
            </span>
          </>
        )}
      </div>
      {product.short_description && <p className="text-sm text-muted-foreground leading-relaxed">{product.short_description}</p>}
      {product.benefits && product.benefits.length > 0 && (
        <div className="space-y-2">
          {product.benefits.map((b, i) => <div key={i} className="flex items-start gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />{b}</div>)}
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-sm">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
          <span className="w-12 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
        <button onClick={addToCart} disabled={adding || product.stock_status === "out_of_stock"} className="flex-1 py-3.5 bg-foreground text-background text-sm uppercase tracking-editorial flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-50">
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />{adding ? "Adding..." : product.stock_status === "out_of_stock" ? "Out of Stock" : "Add to Bag"}
        </button>
        <button onClick={toggleWishlist} className="w-12 h-12 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors">
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} strokeWidth={1.5} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-2">
        {[{icon: Truck, label: "Free shipping over ₹999"},{icon: ShieldCheck, label: "Dermatologist tested"},{icon: Leaf, label: "Natural ingredients"}].map(({icon: Icon, label}) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center p-3 bg-secondary/30 rounded-sm">
            <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
