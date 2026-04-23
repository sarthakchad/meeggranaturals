import { Star } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../shared/SectionHeader";

const testimonials = [
  { name: "Priya M.", age: "24", text: "I've struggled with acne for years. After 3 weeks with the Clarifying Serum, my skin has never looked clearer. And the price? Unbeatable.", rating: 5, product: "Clarifying Serum" },
  { name: "James K.", age: "29", text: "Finally a brand that doesn't make me feel weird about having a skincare routine. The moisturizer is lightweight and perfect for daily use.", rating: 5, product: "Daily Moisturizer" },
  { name: "Aisha R.", age: "17", text: "My mom got me the teen skincare kit and I'm obsessed! Everything smells amazing and my skin feels so soft.", rating: 5, product: "Teen Glow Kit" },
  { name: "Maria L.", age: "35", text: "The hair oil has transformed my dry, brittle hair. It's now shiny and healthy. I recommend it to everyone I know!", rating: 5, product: "Nourishing Hair Oil" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Real People, Real Results" title="What Our Community Says" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-background p-6 rounded-sm border border-border">
              <div className="flex gap-0.5 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />)}</div>
              <p className="text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">Age {t.age} · Verified Purchase</p>
                <p className="text-[10px] uppercase tracking-ultra-wide text-primary mt-1">{t.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
