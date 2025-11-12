import type { OfferRail, StoreOffer, WeeklyOffer } from '@/types/offers';
import { getSupabaseClient } from './supabaseClient';

type OfferRailRow = {
  id: string;
  title: string;
  description: string;
  offers: {
    id: string;
    product: string;
    description: string;
    image_src: string;
    image_alt: string;
    price: string;
    original_price: string;
    location: string;
    badge?: string | null;
    sort_order?: number | null;
    starts_at?: string | null;
    ends_at?: string | null;
  }[];
  sort_order?: number | null;
};

type WeeklyOfferRow = {
  id: string;
  title: string;
  location: string;
  image_src?: string | null;
  image_alt?: string | null;
  image_gallery?: { src: string; alt: string }[] | null;
  price: string;
  original_price: string;
  discount: string;
  valid_until: string;
  href: string;
  sort_order?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
};

function mapStoreOffer(row: OfferRailRow['offers'][number]): StoreOffer {
  return {
    id: row.id,
    product: row.product,
    description: row.description,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    price: row.price,
    originalPrice: row.original_price,
    location: row.location,
    badge: row.badge ?? undefined,
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
  };
}

function mapWeeklyOffer(row: WeeklyOfferRow): WeeklyOffer {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    imageSrc: row.image_src ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    imageGallery: Array.isArray(row.image_gallery) ? row.image_gallery : undefined,
    price: row.price,
    originalPrice: row.original_price,
    discount: row.discount,
    validUntil: row.valid_until,
    href: row.href,
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
  };
}

type FetchOfferRailsOptions = {
  includeEmpty?: boolean;
};

export async function fetchOfferRails(
  options: FetchOfferRailsOptions = {},
): Promise<OfferRail[]> {
  const { includeEmpty = false } = options;
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('offer_rails')
    .select(
      'id, title, description, sort_order, offers:offer_items(id, product, description, image_src, image_alt, price, original_price, location, badge, sort_order, starts_at, ends_at)',
    )
    .order('sort_order', { ascending: true });

  if (error || !data) {
    if (error?.code === 'PGRST205') {
      console.warn(
        'Supabase: offer_rails view puuttuu. Luo taulu offer_rails ja offer_items README-ohjeen mukaan.',
      );
    } else {
      console.error('Supabase offer_rails error', error);
    }
    return [];
  }

  const mapped = (data as OfferRailRow[])
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      offers: (row.offers ?? [])
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map(mapStoreOffer),
    }));

  return includeEmpty ? mapped : mapped.filter((rail) => rail.offers.length > 0);
}

export async function fetchWeeklyOffers(): Promise<WeeklyOffer[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('weekly_offers')
    .select(
      'id, title, location, image_src, image_alt, image_gallery, price, original_price, discount, valid_until, href, sort_order, starts_at, ends_at',
    )
    .order('sort_order', { ascending: true });

  if (error || !data) {
    if (error?.code === 'PGRST205') {
      console.warn(
        "Supabase: weekly_offers-taulu puuttuu. Luo taulu tai näkymä nimeltä 'weekly_offers' README:n mukaisesti.",
      );
    } else {
      console.error('Supabase weekly_offers error', error);
    }
    return [];
  }

  return (data as WeeklyOfferRow[]).map(mapWeeklyOffer);
}
