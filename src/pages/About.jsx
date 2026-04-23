
import { motion } from "framer-motion";
import { images } from "@/lib/imageAssets";
import { Leaf, Heart, Users, Sparkles } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";

const values = [
  { icon: Leaf, title: "Natural First", description: "We source plant-based, clean ingredients. No sulfates, parabens, or harsh chemicals. Ever." },
  { icon: Heart, title: "Accessible Self-Care", description: "Premium formulations at prices that don't break the bank. Because self-care is a right, not a luxury." },
  { icon: Users, title: "For Everyone", description: "Our products are designed for all genders, ages, and skin types. No gatekeeping in beauty." },
  { icon: Sparkles, title: "Real Results", description: "Dermatologist-tested, community-proven. We focus on what actually works, backed by science." },
];

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.productsFlatlay} alt="Our products" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[11px] uppercase tracking-ultra-wide text-muted-foreground mb-6">Our Story</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6">Beauty Should Be <span className="italic">Honest</span></h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">We started Naturals with a simple belief: everyone deserves access to clean, effective skincare and haircare — without paying luxury prices or compromising on quality.</p>
          </motion.div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="relative">
              <img src={images.heroPortrait} alt="Real people" className="rounded-sm w-full aspect-[4/5] object-cover" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-sm overflow-hidden border-4 border-background shadow-lg hidden md:block">
                <img src={images.maleSkincare} alt="Inclusive beauty" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[11px] uppercase tracking-ultra-wide text-primary mb-4">The Beginning</p>
            <h2 className="font-display text-3xl md:text-4xl font-light mb-6">Born from Frustration, Built with Care</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>We were tired of the skincare industry's empty promises: overpriced products with ingredients we couldn't pronounce, marketed exclusively to one demographic.</p>
              <p>So we built Naturals — a brand that strips away the pretense and focuses on what matters: natural, effective formulations that work for real people living real lives.</p>
              <p>From teens navigating their first skincare routine to men discovering self-care, to women seeking affordable quality — we're here for all of them.</p>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader eyebrow="What We Stand For" title="Our Values" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => { const Icon = v.icon; return (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-background p-8 rounded-sm border border-border text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" strokeWidth={1.5} /></div>
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[{ image: images.teenPortrait, label: "Teens" }, { image: images.heroPortrait, label: "Women" }, { image: images.maleSkincare, label: "Men" }].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative aspect-[3/4] rounded-sm overflow-hidden">
              <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-[11px] uppercase tracking-ultra-wide text-background/60 mb-1">Made For</p>
                <h3 className="font-display text-3xl text-background">{item.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
