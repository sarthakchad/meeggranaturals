import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingBag, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: "", customer_email: "", customer_phone: "", shipping_address: "" });
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { data: cartItems = [] } = useQuery({ queryKey: ["cartItems"], queryFn: () => base44.entities.CartItem.list() });
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault(); setPlacing(true);
    await base44.entities.Order.create({ ...form, items: cartItems.map(item => ({ product_id: item.product_id, product_name: item.product_name, price: item.price, quantity: item.quantity || 1 })), subtotal, shipping, total, status: "confirmed" });
    for (const item of cartItems) { await base44.entities.CartItem.delete(item.id); }
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    setOrderPlaced(true); setPlacing(false);
  };

  if (orderPlaced) return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" strokeWidth={1} />
        <h1 className="font-display text-3xl mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your order. You'll receive a confirmation email shortly.</p>
        <button onClick={() => navigate("/shop")} className="px-8 py-3.5 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm">Continue Shopping</button>
      </motion.div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <ShoppingBag className="w-12 h-12 text-border mx-auto mb-4" strokeWidth={1} />
        <h1 className="font-display text-2xl mb-2">Your bag is empty</h1>
        <button onClick={() => navigate("/shop")} className="mt-4 px-6 py-3 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm">Shop Now</button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h1 className="font-display text-3xl md:text-4xl tracking-wide text-center mb-12">Checkout</h1>
        <div className="grid lg:grid-cols-5 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <h2 className="font-display text-xl mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-2 block">Full Name</label><input value={form.customer_name} onChange={(e) => setForm({...form, customer_name: e.target.value})} className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required /></div>
              <div><label className="text-sm font-medium mb-2 block">Email</label><input type="email" value={form.customer_email} onChange={(e) => setForm({...form, customer_email: e.target.value})} className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required /></div>
            </div>
            <div><label className="text-sm font-medium mb-2 block">Phone</label><input value={form.customer_phone} onChange={(e) => setForm({...form, customer_phone: e.target.value})} className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required /></div>
            <div><label className="text-sm font-medium mb-2 block">Shipping Address</label><textarea value={form.shipping_address} onChange={(e) => setForm({...form, shipping_address: e.target.value})} rows={3} className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" required /></div>
            <button type="submit" disabled={placing} className="w-full py-3.5 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm">{placing ? "Placing Order..." : `Place Order · ₹${total.toFixed(2)}`}</button>
          </form>
          <div className="lg:col-span-2">
            <div className="bg-secondary/30 p-6 rounded-sm">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-12 h-14 object-cover rounded-sm" />}
                    <div className="flex-1 min-w-0"><p className="text-sm truncate">{item.product_name}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</p></div>
                    <span className="text-sm">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
                <div className="flex justify-between font-display text-lg pt-2 border-t border-border"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
