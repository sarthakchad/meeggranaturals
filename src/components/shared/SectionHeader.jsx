import { motion } from "framer-motion";
export default function SectionHeader({ eyebrow, title, subtitle, align = "center" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={`mb-12 ${alignClass}`}>
      {eyebrow && <p className="text-[11px] uppercase tracking-ultra-wide text-muted-foreground mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}
