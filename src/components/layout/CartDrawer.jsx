import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: cartItems = [] } = useQuery({ queryKey: ["cartItems"], queryFn: () => base44.entities.CartItem.list() });

  const updateQuantity = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) { await base44.entities.CartItem.delete(item.id); }
    else { await base44.entities.CartItem.update(item.id, { quantity: newQty }); }
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
  };

  const removeItem = async (id) => {
    await base44.entities.CartItem.delete(id);
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3"><ShoppingBag className="w-5 h-5" strokeWidth={1.5} /><span className="font-display text-xl tracking-editorial">YOUR BAG</span></div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" strokeWidth={1.5} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-border mb-4" strokeWidth={1} />
              <p className="font-display text-xl mb-2">Your bag is empty</p>
              <p className="text-sm text-muted-foreground">Discover our curated collection</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-20 h-24 object-cover rounded-sm" />}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.product_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">₹{item.price?.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(item, -1)} className="w-7 h-7 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm w-6 text-center">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item, 1)} className="w-7 h-7 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl">₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Shipping calculated at checkout</p>
            <button onClick={() => { onClose(); navigate("/checkout"); }} className="w-full py-3.5 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
