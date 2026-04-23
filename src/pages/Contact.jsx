import { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Mail, MessageSquare, Clock } from "lucide-react";
import SectionHeader from "../components/shared/SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is your return policy?", a: "We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, contact us for a full refund or exchange." },
  { q: "Are your products suitable for sensitive skin?", a: "Yes! All our products are dermatologist-tested, hypoallergenic, and free from harsh chemicals. We recommend patch-testing any new product." },
  { q: "Do you offer international shipping?", a: "Currently we ship within India. International shipping is coming soon — subscribe to our newsletter for updates!" },
  { q: "Are your products tested on animals?", a: "Absolutely not. Naturals is proudly cruelty-free. We never test on animals and never will." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout." },
  { q: "Can men use your skincare products?", a: "Yes! Our products are formulated for all genders. Skin is skin — our formulations work regardless of gender." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    await base44.entities.ContactMessage.create(form);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Get in Touch" title="We'd Love to Hear From You" subtitle="Questions, feedback, or just want to say hi? We're here for you." />
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-medium mb-2 block">Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required /></div>
                <div><label className="text-sm font-medium mb-2 block">Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="your@email.com" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required /></div>
              </div>
              <div><label className="text-sm font-medium mb-2 block">Subject</label><input value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} placeholder="What's this about?" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" /></div>
              <div><label className="text-sm font-medium mb-2 block">Message</label><textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Tell us what's on your mind..." rows={6} className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" required /></div>
              <button type="submit" disabled={submitting} className="px-8 py-3.5 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm">{submitting ? "Sending..." : "Send Message"}</button>
            </form>
            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              {[{icon: Mail, label: "Email", info: "hello@naturals.com"},{icon: MessageSquare, label: "Live Chat", info: "Mon-Fri, 9am-5pm"},{icon: Clock, label: "Response Time", info: "Within 24 hours"}].map(({icon: Icon, label, info}) => (
                <div key={label} className="flex items-start gap-3"><Icon className="w-5 h-5 text-primary mt-0.5" strokeWidth={1.5} /><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{info}</p></div></div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="font-display text-2xl mb-6">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
