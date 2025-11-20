import type { OfferRail, StoreOffer } from '@/types/offers';
import { getSupabaseAdminClient, getSupabaseClient } from './supabaseClient';

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

function todayIsoDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function normalizeDate(value?: string | null) {
  return value ? value.slice(0, 10) : null; // yyyy-mm-dd
}

function parseLocations(raw?: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter((entry): entry is string => entry.length > 0);
    }
  } catch (error) {
    // Treat value as a simple string when JSON parsing fails
  }

  const fallback = raw.toString().trim();
  return fallback ? [fallback] : [];
}

export async function purgeExpiredOffers() {
  const admin = getSupabaseAdminClient();
  if (!admin) return;

  const cutoff = todayIsoDate();
  const { error } = await admin.from('offer_items').delete().lt('ends_at', cutoff);
  if (error) {
    const message =
      (error as { message?: string })?.message || 'Supabase purgeExpiredOffers operation failed';
    throw new Error(message);
  }
}

function isOfferActive(row: OfferRailRow['offers'][number]) {
  const end = normalizeDate(row.ends_at);
  const today = todayIsoDate();

  if (end && end < today) return false;
  return true;
}

function mapStoreOffer(row: OfferRailRow['offers'][number]): StoreOffer {
  const locations = parseLocations(row.location);
  const locationLabel =
    locations.length === 0
      ? ''
      : locations.includes('Kaikki myymälät')
        ? 'Kaikki myymälät'
        : locations.join(', ');

  return {
    id: row.id,
    product: row.product,
    description: row.description,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    price: row.price,
    originalPrice: row.original_price,
    location: locationLabel,
    locations,
    badge: row.badge ?? undefined,
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
  };
}

export async function fetchLatestOffers(limit: number = 5): Promise<StoreOffer[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  await purgeExpiredOffers();

  // Order by id when created_at column is not available in schema
  const { data, error } = await supabase
    .from('offer_items')
    .select(
      'id, product, description, image_src, image_alt, price, original_price, location, badge, starts_at, ends_at'
    )
    .order('id', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('Supabase fetchLatestOffers warning:', (error as any)?.message);
    return [];
  }

  return (data ?? []).filter(isOfferActive).map(mapStoreOffer);
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

  await purgeExpiredOffers();

  const { data, error } = await supabase
    .from('offer_rails')
    .select(
      'id, title, description, sort_order, offers:offer_items(id, product, description, image_src, image_alt, price, original_price, location, badge, sort_order, starts_at, ends_at)',
    )
    .order('sort_order', { ascending: true });

  if (error || !data) {
    const msg = (error as any)?.message || '';
    if ((error as any)?.code === 'PGRST205') {
      console.warn(
        'Supabase: offer_rails view puuttuu. Luo taulu offer_rails ja offer_items README-ohjeen mukaan.',
      );
    } else if (/fetch failed/i.test(msg)) {
      console.warn(
        'Supabase: verkko- tai konfiguraatiovirhe (fetch failed). Tarkista:\n' +
          '- NEXT_PUBLIC_SUPABASE_URL (sisältää https:// ja ilman loppuslaashia)\n' +
          '- NEXT_PUBLIC_SUPABASE_ANON_KEY on oikea\n' +
          '- Internet-yhteys / palomuuri / VPN / välityspalvelin\n' +
          '- Kehitysympäristön kellonaika on oikein',
      );
    } else {
      console.error('Supabase offer_rails error', error);
    }
    return [];
  }

  const mapped = (data as OfferRailRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    offers: (row.offers ?? [])
      .filter(isOfferActive)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(mapStoreOffer),
  }));

  return includeEmpty ? mapped : mapped.filter((rail) => rail.offers.length > 0);
}
