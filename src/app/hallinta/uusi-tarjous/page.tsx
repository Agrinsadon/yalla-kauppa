import { createHash } from 'crypto';
import { Buffer } from 'node:buffer';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Metadata } from 'next';
import { fetchOfferRails } from '@/lib/offers';
import { getSupabaseAdminClient } from '@/lib/supabaseClient';
import OfferForm from './OfferForm';
import LoginForm from './LoginForm';
import CategoryForm from './CategoryForm';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Lisää tarjous - Yalla Kauppa',
};

const SESSION_COOKIE = 'yk-admin-session';

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function getAdminCredentials() {
  const username = process.env.OFFER_ADMIN_USERNAME;
  const password = process.env.OFFER_ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

function buildSessionToken(username: string, password: string) {
  return createHash('sha256').update(`${username}:${password}`).digest('hex');
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 32);
}

async function hasValidSession(store: CookieStore) {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const expected = buildSessionToken(creds.username, creds.password);
  const existing = store.get(SESSION_COOKIE)?.value;
  return existing === expected;
}

const loginAction = async (_state: ActionState, formData: FormData): Promise<ActionState> => {
  'use server';

  const creds = getAdminCredentials();
  if (!creds) {
    return { success: false, message: 'Ympäristömuuttujat puuttuvat' };
  }

  const username = formData.get('username')?.toString().trim();
  const password = formData.get('password')?.toString().trim();

  if (username !== creds.username || password !== creds.password) {
    return { success: false, message: 'Virheellinen käyttäjätunnus tai salasana' };
  }

  const store = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  store.set(SESSION_COOKIE, buildSessionToken(creds.username, creds.password), {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  revalidatePath('/hallinta/uusi-tarjous');
  return { success: true, message: 'Kirjautuminen onnistui' };
};

const logoutAction = async () => {
  'use server';
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  revalidatePath('/hallinta/uusi-tarjous');
};

const createCategoryAction = async (
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  'use server';

  const store = await cookies();
  if (!(await hasValidSession(store))) {
    return { success: false, message: 'Kirjaudu ensin sisään' };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { success: false, message: 'Supabase ei ole konfiguroitu' };
  }

  const title = formData.get('categoryTitle')?.toString().trim();
  const description = formData.get('categoryDescription')?.toString().trim();

  if (!title || !description) {
    return { success: false, message: 'Täytä nimi ja kuvaus' };
  }

  const baseSlug = slugify(title);
  const id = `${baseSlug}-${Date.now().toString(36)}`;

  const { error } = await supabase.from('offer_rails').insert({
    id,
    title,
    description,
  });

  if (error) {
    console.error('Supabase create category error', error);
    return { success: false, message: 'Kategorian luonti epäonnistui' };
  }

  revalidatePath('/hallinta/uusi-tarjous');
  revalidatePath('/tarjoukset');
  return { success: true, message: 'Kategoria lisätty' };
};

const createOfferAction = async (_state: ActionState, formData: FormData): Promise<ActionState> => {
  'use server';

  const store = await cookies();
  if (!(await hasValidSession(store))) {
    return { success: false, message: 'Kirjaudu ensin sisään' };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { success: false, message: 'Supabase ei ole konfiguroitu' };
  }

  const product = formData.get('product')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const imageMode = (formData.get('imageMode')?.toString() as 'upload' | 'url') ?? 'upload';
  const imageSrcInput = formData.get('imageSrc')?.toString().trim();
  const imageFile = formData.get('imageFile');
  const imageAlt = formData.get('imageAlt')?.toString().trim();
  const price = formData.get('price')?.toString().trim();
  const originalPrice = formData.get('originalPrice')?.toString().trim();
  const location = formData.get('location')?.toString().trim();
  const badge = formData.get('badge')?.toString().trim();
  const categoryId = formData.get('categoryId')?.toString().trim();
  const startsAt = formData.get('startsAt')?.toString() || null;
  const endsAt = formData.get('endsAt')?.toString() || null;

  if (!product || !description || !imageAlt || !price || !originalPrice || !location || !categoryId) {
    return { success: false, message: 'Täytä kaikki pakolliset kentät' };
  }

  if (startsAt && endsAt && startsAt > endsAt) {
    return { success: false, message: 'Alkupäivän tulee olla ennen loppupäivää' };
  }

  let resolvedImageSrc = imageSrcInput ?? '';
  if (imageMode === 'upload') {
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return { success: false, message: 'Valitse kuvatiedosto' };
    }
    if (imageFile.size > 1.5 * 1024 * 1024) {
      return { success: false, message: 'Kuvan maksimikoko on 1.5 Mt' };
    }
    const mime = imageFile.type || 'image/jpeg';
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    resolvedImageSrc = `data:${mime};base64,${buffer.toString('base64')}`;
  } else if (!resolvedImageSrc) {
    return { success: false, message: 'Anna kuvan URL-osoite' };
  }

  const payload = {
    rail_id: categoryId,
    product,
    description,
    image_src: resolvedImageSrc,
    image_alt: imageAlt,
    price,
    original_price: originalPrice,
    location,
    badge: badge || null,
    starts_at: startsAt,
    ends_at: endsAt,
  };

  const { error } = await supabase.from('offer_items').insert(payload);
  if (error) {
    console.error('Supabase insert error', error);
    return { success: false, message: 'Tallennus epäonnistui' };
  }

  revalidatePath('/tarjoukset');
  return { success: true, message: 'Tarjous lisätty' };
};

export default async function NewOfferPage() {
  const store = await cookies();
  const creds = getAdminCredentials();
  const authenticated = creds ? await hasValidSession(store) : false;
  const rails = authenticated ? await fetchOfferRails({ includeEmpty: true }) : [];

  return (
    <div className={styles.wrapper}>
      {!creds ? (
        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Aseta hallintapaneelin tunnukset</h2>
          <p className={styles.authNote}>
            Lisää ympäristömuuttujat <code>OFFER_ADMIN_USERNAME</code> ja <code>OFFER_ADMIN_PASSWORD</code>{' '}
            sekä palvelinpuolen avain <code>SUPABASE_SERVICE_ROLE_KEY</code> . Tämän jälkeen voit kirjautua sisään.
          </p>
        </div>
      ) : authenticated ? (
        <>
          <CategoryForm action={createCategoryAction} />
          <OfferForm rails={rails} action={createOfferAction} />
          <div className={styles.logoutRow}>
            <form action={logoutAction}>
              <button type="submit" className={styles.secondaryButton}>
                Kirjaudu ulos
              </button>
            </form>
          </div>
        </>
      ) : (
        <LoginForm action={loginAction} />
      )}
    </div>
  );
}
