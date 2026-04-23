import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { images } from "@/lib/imageAssets";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={images.heroSerum} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="text-[11px] uppercase tracking-ultra-wide text-muted-foreground mb-6">Natural · Affordable · For Everyone</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-wide">
              Your Skin, <span className="italic">Reimagined</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-md text-base leading-relaxed">
              Honest skincare and haircare crafted with natural ingredients. Real results for real people — teens, women, and men.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-all duration-300 rounded-sm">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-4 text-sm uppercase tracking-editorial text-foreground hover:text-primary transition-colors border border-foreground/20 rounded-sm">
                Our Story
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
              {["Sulfate-Free","Paraben-Free","Cruelty-Free"].map(b => (
                <div key={b} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" />{b}</div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="hidden lg:block">
            <div className="relative">
              <img src={images.heroPortrait} alt="Glowing natural skin" className="w-full max-w-md mx-auto rounded-sm object-cover aspect-[3/4]" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-sm overflow-hidden border-4 border-background shadow-lg">
                <img src={images.serumTexture} alt="Serum texture" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-foreground/20 relative">
          <motion.div className="w-px h-4 bg-foreground absolute top-0" animate={{ y: [0, 32, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </section>
  );
}
