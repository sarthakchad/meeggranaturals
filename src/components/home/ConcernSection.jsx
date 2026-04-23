import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeader from "../shared/SectionHeader";
import { Droplets, Sun, Wind, Scissors, Sparkles, ShieldCheck, Flower2, Waves } from "lucide-react";

const concerns = [
  { label: "Acne", value: "acne", icon: Sparkles, color: "bg-rose-100 text-rose-500" },
  { label: "Dryness", value: "dryness", icon: Droplets, color: "bg-sky-100 text-sky-500" },
  { label: "Hair Fall", value: "hair_fall", icon: Wind, color: "bg-violet-100 text-violet-500" },
  { label: "Dark Spots", value: "dark_spots", icon: Sun, color: "bg-amber-100 text-amber-600" },
  { label: "Dandruff", value: "dandruff", icon: Flower2, color: "bg-emerald-100 text-emerald-600" },
  { label: "Frizz", value: "frizz", icon: Waves, color: "bg-teal-100 text-teal-600" },
  { label: "Sensitivity", value: "sensitivity", icon: ShieldCheck, color: "bg-orange-100 text-orange-500" },
  { label: "Aging", value: "aging", icon: Scissors, color: "bg-fuchsia-100 text-fuchsia-500" },
];

export default function ConcernSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Targeted Solutions" title="Shop by Concern" subtitle="Find products specifically formulated for your unique needs" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {concerns.map((concern, i) => {
            const Icon = concern.icon;
            return (
              <motion.div key={concern.value} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Link to={`/shop?concern=${concern.value}`} className="group flex flex-col items-center gap-4 p-8 bg-background rounded-sm border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-300">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${concern.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium">{concern.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
