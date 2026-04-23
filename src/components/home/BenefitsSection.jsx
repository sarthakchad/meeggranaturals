import { motion } from "framer-motion";
import { Leaf, DollarSign, Users, ShieldCheck } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";

const benefits = [
  { icon: Leaf, title: "Natural Ingredients", description: "Clean formulations with plant-based actives. No harsh chemicals, no compromises.", bg: "bg-emerald-100", color: "text-emerald-600" },
  { icon: DollarSign, title: "Affordable for All", description: "Premium quality doesn't have to cost a fortune. Self-care should be accessible.", bg: "bg-amber-100", color: "text-amber-600" },
  { icon: Users, title: "For Everyone", description: "Designed for all genders and ages — teens, women, and men. Real products for real people.", bg: "bg-sky-100", color: "text-sky-600" },
  { icon: ShieldCheck, title: "Dermatologist Tested", description: "Every product is tested and approved. Safe for sensitive skin and daily use.", bg: "bg-violet-100", color: "text-violet-600" },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader eyebrow="Why Naturals" title="What Sets Us Apart" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
              <div className={`w-14 h-14 mx-auto mb-5 rounded-full ${benefit.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${benefit.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl mb-3">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
