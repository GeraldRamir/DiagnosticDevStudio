import { ArrowUpRight } from "lucide-react";
import { unstable_cache } from "next/cache";
import { Badge, LpButton, LpSection, Reveal, SectionTitle } from "@/components/landing/lp-ui";
import { BRAND_LINKS } from "@/lib/brand";
import { getStudioFeed, instagramConfigured } from "@/lib/instagram/graph";
import { lp } from "@/lib/landing-copy";

const getCachedStudioFeed = unstable_cache(
  async () => getStudioFeed(),
  ["studio-instagram-feed"],
  { revalidate: 600 },
);

export async function InstagramSection() {
  if (!instagramConfigured()) return null;

  let feed: Awaited<ReturnType<typeof getStudioFeed>> | null = null;
  try {
    feed = await getCachedStudioFeed();
  } catch {
    return null;
  }

  if (!feed.items.length) return null;

  const copy = lp.instagram;

  return (
    <LpSection id="instagram">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle
          badge={copy.badge}
          badgeTone="lilac"
          title={copy.title}
          subtitle={
            feed.followers != null
              ? copy.subtitleFollowers.replace("{count}", feed.followers.toLocaleString("es"))
              : copy.subtitle
          }
          align="left"
        />
        <Reveal delay={0.12}>
          <LpButton
            href={feed.profileUrl || BRAND_LINKS.instagram}
            variant="dark"
            icon={<ArrowUpRight className="size-4" />}
          >
            {copy.cta}
          </LpButton>
        </Reveal>
      </div>
      <p className="mt-4 text-sm text-[#7b7b87]">{copy.magnet}</p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {feed.items.slice(0, 6).map((item, index) => (
          <Reveal key={item.id} delay={index * 0.04}>
            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-card-hover group block overflow-hidden rounded-[1.25rem] bg-[#f7f4fb]"
            >
              <span className="relative block aspect-square overflow-hidden">
                {/* URLs firmadas de Instagram: img nativo, no el optimizer de Next */}
                <img
                  src={item.imageUrl}
                  alt=""
                  width={400}
                  height={400}
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5">
                  <Badge tone="dark">
                    {item.mediaType === "VIDEO"
                      ? copy.reel
                      : item.mediaType === "CAROUSEL_ALBUM"
                        ? copy.carousel
                        : copy.photo}
                  </Badge>
                </span>
              </span>
              <span className="block px-3 py-2.5 text-[0.75rem] leading-snug text-[#5b5b66] line-clamp-2">
                {item.caption || `@${feed.username}`}
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </LpSection>
  );
}
