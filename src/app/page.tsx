import { AiAccordionSection } from "@/components/landing/ai-accordion-section";
import { BentoDiagnosisSection } from "@/components/landing/bento-diagnosis-section";
import { FaqAnalyticsSection } from "@/components/landing/faq-analytics-section";
import { HeroSection } from "@/components/landing/hero-section";
import { ImpactStatsSection } from "@/components/landing/impact-stats-section";
import { LandingBanner } from "@/components/landing/landing-banner";
import { ReportHighlightSection } from "@/components/landing/report-highlight-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function HomePage() {
  return (
    <div className="ds-landing-page">
      <SiteHeader />

      <div className="bg-[color:var(--landing-shell)]">
        <HeroSection />
        <LandingBanner />
      </div>

      <main className="doodi-page w-full">
        <BentoDiagnosisSection />
        <AiAccordionSection />
        <ImpactStatsSection />
        <ReportHighlightSection />
        <FaqAnalyticsSection />
      </main>

      <SiteFooter />
    </div>
  );
}
