import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function CatalogSection() {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
        <p className="text-[11px] uppercase tracking-ultra-wide text-muted-foreground mb-3">Our Collection</p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">Brand Catalogue</h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">Explore our full range of natural skincare and haircare products.</p>
      </motion.div>
      <div className="flex flex-col items-center gap-4">
        <BookOpen className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
        <p className="text-sm text-muted-foreground">Catalogue coming soon.</p>
      </div>
    </section>
  );
}
