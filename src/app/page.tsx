import { BenchmarksSection } from "@/components/landing/benchmarks-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { IndustryMarquee } from "@/components/landing/industry-marquee";
import { ReportPreviewSection } from "@/components/landing/report-preview-section";
import { ResourcesSection } from "@/components/landing/resources-section";
import { ResultsSection } from "@/components/landing/results-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function HomePage() {
  return (
    <div className="lp-font min-h-screen bg-white">
      <SiteHeader />
      <HeroSection />
      <IndustryMarquee />
      <FeaturesSection />
      <ReportPreviewSection />
      <BenchmarksSection />
      <ResultsSection />
      <ResourcesSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
