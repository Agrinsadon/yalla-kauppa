import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Metadata } from 'next';
import { fetchOfferRails } from '@/lib/offers';
import { getSupabaseAdminClient } from '@/lib/supabaseClient';
import OfferForm from './OfferForm';
import LoginForm from './LoginForm';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Lisää tarjous - Yalla Kauppa',
};

const SESSION_COOKIE = 'yk-admin-session';

type CookieStore = ReturnType<typeof cookies>;

function getAdminCredentials() {
  const username = process.env.OFFER_ADMIN_USERNAME;
  const password = process.env.OFFER_ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

function buildSessionToken(username: string, password: string) {
  return createHash('sha256').update(`${username}:${password}`).digest('hex');
}

function hasValidSession(store: CookieStore) {
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

  const store = cookies();
  store.set(SESSION_COOKIE, buildSessionToken(creds.username, creds.password), {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  revalidatePath('/hallinta/uusi-tarjous');
  return { success: true, message: 'Kirjautuminen onnistui' };
};

const logoutAction = async () => {
  'use server';
  const store = cookies();
  store.delete(SESSION_COOKIE);
  revalidatePath('/hallinta/uusi-tarjous');
};

const createOfferAction = async (_state: ActionState, formData: FormData): Promise<ActionState> => {
  'use server';

  const store = cookies();
  if (!hasValidSession(store)) {
    return { success: false, message: 'Kirjaudu ensin sisään' };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { success: false, message: 'Supabase ei ole konfiguroitu' };
  }

  const product = formData.get('product')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const imageSrc = formData.get('imageSrc')?.toString().trim();
  const imageAlt = formData.get('imageAlt')?.toString().trim();
  const price = formData.get('price')?.toString().trim();
  const originalPrice = formData.get('originalPrice')?.toString().trim();
  const location = formData.get('location')?.toString().trim();
  const badge = formData.get('badge')?.toString().trim();
  const categoryId = formData.get('categoryId')?.toString().trim();
  const startsAt = formData.get('startsAt')?.toString() || null;
  const endsAt = formData.get('endsAt')?.toString() || null;

  if (!product || !description || !imageSrc || !imageAlt || !price || !originalPrice || !location || !categoryId) {
    return { success: false, message: 'Täytä kaikki pakolliset kentät' };
  }

  if (startsAt && endsAt && startsAt > endsAt) {
    return { success: false, message: 'Alkupäivän tulee olla ennen loppupäivää' };
  }

  const payload = {
    rail_id: categoryId,
    product,
    description,
    image_src: imageSrc,
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
  const store = cookies();
  const creds = getAdminCredentials();
  const authenticated = store && hasValidSession(store);
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
