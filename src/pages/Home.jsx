import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import BestsellersSection from "../components/home/BestsellersSection";
import ConcernSection from "../components/home/ConcernSection";
import BenefitsSection from "../components/home/BenefitsSection";
import CatalogSection from "../components/home/CatalogSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import NewsletterSection from "../components/home/NewsletterSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <BestsellersSection />
      <ConcernSection />
      <CatalogSection />
      <BenefitsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
