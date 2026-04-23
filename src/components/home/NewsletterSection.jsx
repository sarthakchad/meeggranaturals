import { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { images } from "@/lib/imageAssets";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await base44.entities.NewsletterSubscriber.create({ email });
    toast.success("Welcome! Check your inbox for 10% off.");
    setEmail(""); setSubmitting(false);
  };
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={images.naturalIngredient} alt="Natural ingredients" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative z-10 max-w-xl mx-auto text-center px-6">
        <p className="text-[11px] uppercase tracking-ultra-wide text-muted-foreground mb-4">Join the Community</p>
        <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide mb-4">Get 10% Off Your First Order</h2>
        <p className="text-sm text-muted-foreground mb-8">Subscribe for exclusive offers, skincare tips, and early access to new launches.</p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 bg-background border border-border rounded-sm px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required />
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm whitespace-nowrap">
            {submitting ? "..." : "Subscribe"}
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground/60 mt-4">No spam, unsubscribe anytime. We respect your privacy.</p>
      </motion.div>
    </section>
  );
}
