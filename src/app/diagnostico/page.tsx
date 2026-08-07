import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { DiagnosticForm } from "@/components/diagnostico/diagnostic-form";

export default function DiagnosticoPage() {
  return (
    <div className="ds-landing-page min-h-screen bg-[#f1f5f9]">
      <SiteHeader />
      <main className="px-[clamp(1rem,4vw,3rem)] py-8 md:py-12">
        <DiagnosticForm />
      </main>
      <SiteFooter />
    </div>
  );
}
