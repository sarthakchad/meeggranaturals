import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import SectionHeader from "../components/shared/SectionHeader";

export default function Wishlist() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["wishlistItems"], queryFn: () => base44.entities.WishlistItem.list() });

  const removeItem = async (id) => {
    await base44.entities.WishlistItem.delete(id);
    queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
    toast.success("Removed from wishlist");
  };

  const addToCart = async (item) => {
    const existing = await base44.entities.CartItem.filter({ product_id: item.product_id });
    if (existing.length > 0) { await base44.entities.CartItem.update(existing[0].id, { quantity: (existing[0].quantity || 1) + 1 }); }
    else { await base44.entities.CartItem.create({ product_id: item.product_id, product_name: item.product_name, product_image: item.product_image, price: item.price, quantity: 1 }); }
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    toast.success("Added to bag");
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Your Collection" title="Wishlist" subtitle="Products you're loving" />
        {isLoading ? <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-secondary rounded-sm animate-pulse" />)}</div>
        : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-border mx-auto mb-4" strokeWidth={1} />
            <p className="font-display text-2xl mb-2">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Save products you love for later</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-sm">
                {item.product_image && <Link to={`/product/${item.product_id}`}><img src={item.product_image} alt={item.product_name} className="w-20 h-24 object-cover rounded-sm" /></Link>}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`} className="text-sm font-medium hover:text-primary transition-colors">{item.product_name}</Link>
                  <p className="text-sm text-muted-foreground mt-1">₹{item.price?.toFixed(2)}</p>
                </div>
                <button onClick={() => addToCart(item)} className="p-2.5 bg-foreground text-background rounded-sm hover:bg-foreground/90 transition-colors"><ShoppingBag className="w-4 h-4" strokeWidth={1.5} /></button>
                <button onClick={() => removeItem(item.id)} className="p-2.5 border border-border rounded-sm hover:bg-secondary transition-colors"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
