import { WhatsappGeneratorApp } from "@/components/tools/whatsapp/whatsapp-generator-app";
import { WhatsappGuide } from "@/components/tools/whatsapp/whatsapp-guide";
import { WhatsappHero } from "@/components/tools/whatsapp/whatsapp-hero";

export function WhatsappLanding() {
  return (
    <div className="-mt-[4.25rem] bg-[#f7f6f4] pt-[4.25rem] text-[#16161c]">
      <WhatsappHero />
      <WhatsappGeneratorApp />
      <WhatsappGuide />
    </div>
  );
}
