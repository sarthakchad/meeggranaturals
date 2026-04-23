import { motion } from "framer-motion";
import { images } from "@/lib/imageAssets";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";

const steps = [
  { step: "01", title: "Cleanse", description: "Start fresh. Remove impurities without stripping your skin.", image: images.faceWash, badge: "bg-sky-500" },
  { step: "02", title: "Treat", description: "Target your specific concerns with our concentrated serums.", image: images.productBottle, badge: "bg-violet-500" },
  { step: "03", title: "Hydrate", description: "Lock in moisture for all-day softness and protection.", image: images.moisturizer, badge: "bg-emerald-500" },
  { step: "04", title: "Protect", description: "Shield your skin from UV damage with our lightweight SPF.", image: images.sunscreen, badge: "bg-amber-500" },
];

export default function RoutineSection() {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader eyebrow="Your Daily Ritual" title="Build Your Routine" subtitle="A simple 4-step routine for radiant skin, morning and night" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary/30 mb-5">
              <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4">
                <span className={`font-mono text-[10px] tracking-ultra-wide text-white ${s.badge} px-3 py-1.5 rounded-sm`}>STEP {s.step}</span>
              </div>
            </div>
            <h3 className="font-display text-2xl mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm uppercase tracking-editorial text-foreground hover:text-primary transition-colors border-b border-foreground/20 pb-1">
          Shop The Routine <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
