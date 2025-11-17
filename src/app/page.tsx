import Hero from '@/components/Hero';
import BrandRibbon from '@/components/BrandRibbon';
import WeeklyOffers from '@/components/WeeklyOffers';
import About from '@/components/About';
import Contact from '@/components/Contact';
import { fetchLatestOffers } from '@/lib/offers';

function parsePrice(value?: string): number | null {
  if (!value) return null;
  // Normalize decimal separator and extract first numeric token
  const normalized = value.replace(',', '.');
  const match = normalized.match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number.parseFloat(match[1]) : null;
}

function computeDiscount(price?: string, original?: string): string | null {
  const p = parsePrice(price ?? '');
  const o = parsePrice(original ?? '');
  if (p == null || o == null || !isFinite(p) || !isFinite(o) || o <= 0 || p >= o) return null;
  const pct = Math.round((1 - p / o) * 100);
  return pct > 0 ? `-${pct}%` : null;
}

function formatValidUntil(endsAt?: string): string {
  if (!endsAt) return '';
  const d = new Date(endsAt);
  if (Number.isNaN(d.getTime())) return '';
  return `Voimassa ${d.toLocaleDateString('fi-FI')}`;
}

export default async function Home() {
  const latest = await fetchLatestOffers(5);

  const weeklyOffers = latest.map((o) => ({
    id: o.id,
    title: o.product,
    description: o.description,
    location: o.location,
    imageSrc: o.imageSrc,
    imageAlt: o.imageAlt,
    imageGallery: undefined,
    price: o.price,
    originalPrice: o.originalPrice,
    discount: o.badge ?? computeDiscount(o.price, o.originalPrice) ?? 'Tarjous',
    validUntil: formatValidUntil(o.endsAt),
    href: '/tarjoukset',
    startsAt: o.startsAt,
    endsAt: o.endsAt,
  }));

  return (
    <>
      <Hero />
      <BrandRibbon />
      <WeeklyOffers offers={weeklyOffers} />
      <About />
      <Contact />
    </>
  );
}
