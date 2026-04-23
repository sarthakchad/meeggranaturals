import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { images } from "@/lib/imageAssets";
import SectionHeader from "../shared/SectionHeader";

const categories = [
  { title: "Skincare", description: "Cleansers, serums, moisturizers & more", image: images.creamTexture, link: "/shop?category=skincare" },
  { title: "Haircare", description: "Shampoos, oils, masks & treatments", image: images.hairTexture, link: "/shop?category=haircare" },
  { title: "Combos & Kits", description: "Curated routines for complete care", image: images.productsFlatlay, link: "/shop?category=combo" },
];

export default function CategorySection() {
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader eyebrow="Shop by Category" title="Find Your Ritual" subtitle="Curated collections for every part of your self-care journey" />
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
            <Link to={cat.link} className="group block relative aspect-[4/5] overflow-hidden rounded-sm">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl text-background mb-1">{cat.title}</h3>
                <p className="text-sm text-background/70 mb-4">{cat.description}</p>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-background/80 group-hover:text-background transition-colors">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
