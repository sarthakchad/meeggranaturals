import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const queryClient = useQueryClient();

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["wishlistItems"],
    queryFn: () => base44.entities.WishlistItem.list(),
  });

  const isWishlisted = wishlistItems.some((w) => w.product_id === product.id);

  const addToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const existingItems = await base44.entities.CartItem.filter({ product_id: product.id });
    if (existingItems.length > 0) {
      await base44.entities.CartItem.update(existingItems[0].id, { quantity: (existingItems[0].quantity || 1) + 1 });
    } else {
      await base44.entities.CartItem.create({ product_id: product.id, product_name: product.name, product_image: product.image_url, price: product.price, quantity: 1 });
    }
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    toast.success("Added to bag");
  };

  const toggleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
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
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary/30">
          {!imageLoaded && !imageError && <div className="absolute inset-0 bg-secondary/50 animate-pulse" />}
          <img src={product.image_url} alt={product.name} loading="lazy" decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`}
            onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_bestseller && <span className="px-2.5 py-1 bg-foreground text-background text-[10px] uppercase tracking-ultra-wide">Bestseller</span>}
            {product.is_new && <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] uppercase tracking-ultra-wide">New</span>}
            {product.original_price && product.original_price > product.price && (
              <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] uppercase tracking-ultra-wide">
                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={toggleWishlist} className="w-9 h-9 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors">
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} strokeWidth={1.5} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <button onClick={addToCart} className="w-full py-2.5 bg-foreground/90 backdrop-blur-sm text-background text-xs uppercase tracking-editorial flex items-center justify-center gap-2 hover:bg-foreground transition-colors rounded-sm">
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />Add to Bag
            </button>
          </div>
        </div>
        <div className="mt-4">
          {product.tags && product.tags.length > 0 && <p className="text-[10px] uppercase tracking-ultra-wide text-muted-foreground mb-1">{product.tags[0]}</p>}
          <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm">₹{product.price?.toFixed(2)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-muted-foreground line-through">₹{product.original_price?.toFixed(2)}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs text-muted-foreground">{product.rating} ({product.review_count || 0})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
