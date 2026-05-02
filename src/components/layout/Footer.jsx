import { Link } from "react-router-dom";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await base44.entities.NewsletterSubscriber.create({ email });
    toast.success("Welcome to the Meegra Naturals family!");
    setEmail(""); setSubmitting(false);
  };
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-display text-2xl tracking-editorial mb-4">MEEGRA NATURALS</h2>
            <p className="text-sm text-background/60 leading-relaxed">Honest skincare and haircare for real people. Natural ingredients, affordable prices, visible results.</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-ultra-wide mb-6 text-background/40">Shop</h3>
            <div className="flex flex-col gap-3">
              <Link to="/shop?category=skincare" className="text-sm text-background/70 hover:text-background transition-colors">Skincare</Link>
              <Link to="/shop?category=haircare" className="text-sm text-background/70 hover:text-background transition-colors">Haircare</Link>
              <Link to="/shop?category=combo" className="text-sm text-background/70 hover:text-background transition-colors">Combos & Kits</Link>
              <Link to="/shop" className="text-sm text-background/70 hover:text-background transition-colors">All Products</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-ultra-wide mb-6 text-background/40">Help</h3>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-background/70 hover:text-background transition-colors">Our Story</Link>
              <Link to="/contact" className="text-sm text-background/70 hover:text-background transition-colors">Contact Us</Link>
              <Link to="/admin/products" className="text-sm text-background/70 hover:text-background transition-colors">Admin Panel</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-ultra-wide mb-6 text-background/40">Stay Connected</h3>
            <p className="text-sm text-background/60 mb-4">Get exclusive offers and skincare tips.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 bg-background/10 border border-background/20 rounded-sm px-4 py-2.5 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-background/40" />
              <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"><ArrowRight className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© {new Date().getFullYear()} Meegra Naturals. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Sulfate-Free","Paraben-Free","Cruelty-Free"].map((b, i) => (
              <span key={b} className="text-xs text-background/40">{i > 0 && <span className="mr-6">·</span>}{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
