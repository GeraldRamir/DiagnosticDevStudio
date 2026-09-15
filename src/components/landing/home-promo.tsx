"use client";

import { HomePromoFeatures } from "@/components/landing/home-promo-features";
import { HomePromoInvite } from "@/components/landing/home-promo-invite";
import { HomePromoShowcase } from "@/components/landing/home-promo-showcase";
import { HomePromoStory } from "@/components/landing/home-promo-story";

export function HomePromo() {
  return (
    <div className="relative z-10 pb-20 md:pb-28">
      <HomePromoStory />
      <HomePromoShowcase />
      <HomePromoFeatures />
      <HomePromoInvite />
    </div>
  );
}
