'use client';

import Image from 'next/image';
import styles from '@/app/tarjoukset/page.module.css';
import type { StoreOffer } from '@/types/offers';

export type OfferCardProps = {
  offer: StoreOffer;
  showDescription?: boolean;
};

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fi-FI');
}

export default function OfferCard({ offer, showDescription = true }: OfferCardProps) {
  return (
    <article className={styles.offerCard}>
      <div className={styles.offerImageWrapper}>
        {offer.imageSrc ? (
          <Image
            src={offer.imageSrc}
            alt={offer.imageAlt}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 320px"
            className={styles.offerImage}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '220px',
              background: '#f2f2f2',
            }}
            aria-hidden="true"
          />
        )}
        <span className={styles.locationBadge}>{offer.location}</span>
        {offer.badge && <span className={styles.offerDiscount}>{offer.badge}</span>}
      </div>
      <div className={styles.offerCardBody}>
        <p className={styles.offerProduct}>{offer.product}</p>
        {showDescription && (
          <p className={styles.offerDescription}>{offer.description}</p>
        )}
        {offer.endsAt && (
          <p className={styles.offerValidity}>Voimassa {formatDate(offer.endsAt)} asti</p>
        )}
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>{offer.price} €</span>
          <span
            className={styles.originalPrice}
            aria-label={`Normaalihinta ${offer.originalPrice}`}
          >
            {offer.originalPrice} €
          </span>
        </div>
      </div>
    </article>
  );
}
