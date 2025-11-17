'use client';

import { useActionState } from 'react';
import type { OfferRail } from '@/types/offers';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';

type ManageOffersProps = {
  rails: OfferRail[];
  deleteOfferAction: (state: ActionState, formData: FormData) => Promise<ActionState>;
  deleteCategoryAction: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const initialState: ActionState = { success: false };

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fi-FI');
}

export default function ManageOffers({
  rails,
  deleteOfferAction,
  deleteCategoryAction,
}: ManageOffersProps) {
  const [offerState, offerAction] = useActionState(deleteOfferAction, initialState);
  const [categoryState, categoryAction] = useActionState(deleteCategoryAction, initialState);

  return (
    <div className={styles.panel}>
      <h2 className={styles.sectionTitle}>Hallinnoi tarjouksia ja kategorioita</h2>
      <p className={styles.muted}>Poista yksittäisiä tarjouksia tai koko kategoria kerralla.</p>

      {offerState.message && (
        <p className={offerState.success ? styles.success : styles.error}>{offerState.message}</p>
      )}
      {categoryState.message && (
        <p className={categoryState.success ? styles.success : styles.error}>
          {categoryState.message}
        </p>
      )}

      {rails.length === 0 ? (
        <p className={styles.muted}>Ei vielä kategorioita tai tarjouksia poistettavaksi.</p>
      ) : (
        <div className={styles.manageList}>
          {rails.map((rail) => (
            <div key={rail.id} className={styles.manageCard}>
              <div className={styles.manageHeader}>
                <div className={styles.stack}>
                  <p className={styles.manageTitle}>{rail.title}</p>
                  <p className={styles.muted}>{rail.description}</p>
                </div>
                <form action={categoryAction} className={styles.inlineForm}>
                  <input type="hidden" name="categoryId" value={rail.id} />
                  <button type="submit" className={styles.dangerButton}>
                    Poista kategoria
                  </button>
                </form>
              </div>

              {rail.offers.length === 0 ? (
                <p className={styles.muted}>Ei tarjouksia tässä kategoriassa.</p>
              ) : (
                <ul className={styles.offerList}>
                  {rail.offers.map((offer) => (
                    <li key={offer.id} className={styles.offerRow}>
                      <div className={styles.stack}>
                        <p className={styles.offerTitle}>{offer.product}</p>
                        <p className={styles.muted}>
                          {offer.location}
                          {offer.endsAt ? ` • Loppuu ${formatDate(offer.endsAt)}` : ''}
                        </p>
                      </div>
                      <form action={offerAction} className={styles.inlineForm}>
                        <input type="hidden" name="offerId" value={offer.id} />
                        <button type="submit" className={styles.dangerGhostButton}>
                          Poista
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
