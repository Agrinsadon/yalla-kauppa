'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import styles from './page.module.css';
import type { OfferRail, StoreOffer } from '@/types/offers';

type RailShowcaseProps = {
  rails: OfferRail[];
};

export default function RailShowcase({ rails }: RailShowcaseProps) {
  const [activeRail, setActiveRail] = useState('all');
  const [activeStore, setActiveStore] = useState('all-stores');

  const navItems = useMemo(
    () => [
      { id: 'all', label: 'Kaikki' },
      ...rails.map((rail) => ({ id: rail.id, label: rail.title })),
    ],
    [rails],
  );

  const storeItems = useMemo(() => {
    const storeSet = new Set<string>();
    rails.forEach((rail) => {
      rail.offers.forEach((offer) => {
        storeSet.add(offer.location);
      });
    });
    return Array.from(storeSet).map((store) => ({
      id: store,
      label: store.replace('Yalla Kauppa ', ''),
    }));
  }, [rails]);

  const filteredRails = useMemo(() => {
    if (activeStore === 'all-stores') return rails;
    return rails
      .map((rail) => ({
        ...rail,
        offers: rail.offers.filter((offer) => offer.location === activeStore),
      }))
      .filter((rail) => rail.offers.length > 0);
  }, [activeStore, rails]);

  const visibleRails =
    activeRail === 'all'
      ? filteredRails
      : filteredRails.filter((rail) => rail.id === activeRail);

  const railsToRender = visibleRails.length > 0 ? visibleRails : filteredRails;

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('fi-FI');
  };

  return (
    <div className={styles.categoryShowcase}>
      <nav className={styles.storeNav} aria-label="Myymäläsuodatin">
        <button
          type="button"
          className={`${styles.storeLink} ${
            activeStore === 'all-stores' ? styles.storeLinkActive : ''
          }`}
          onClick={() => setActiveStore('all-stores')}
          aria-pressed={activeStore === 'all-stores'}
        >
          Kaikki myymälät
        </button>
        {storeItems.map((store) => (
          <button
            key={store.id}
            type="button"
            className={`${styles.storeLink} ${
              activeStore === store.id ? styles.storeLinkActive : ''
            }`}
            onClick={() => setActiveStore(store.id)}
            aria-pressed={activeStore === store.id}
          >
            {store.label}
          </button>
        ))}
      </nav>

      <nav id="tarjouskategoriat" className={styles.categoryNav} aria-label="Tarjouskategoriat">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.categoryLink} ${
              activeRail === item.id ? styles.categoryLinkActive : ''
            }`}
            onClick={() => setActiveRail(item.id)}
            aria-pressed={activeRail === item.id}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {railsToRender.map((rail) => (
        <section key={rail.id} id={rail.id} className={styles.railSection} aria-label={rail.title}>
          <header className={styles.railHeader}>
            <p className={styles.railEyebrow}>Viikkonosto</p>
            <h2 className={styles.railTitle}>{rail.title}</h2>
            <p className={styles.railDescription}>{rail.description}</p>
          </header>
          <div className={styles.railCarousel} role="region" aria-roledescription="carousel">
            {rail.offers.map((offer) => (
              <article key={offer.id} className={styles.offerCard}>
                <div className={styles.offerImageWrapper}>
                  <Image
                    src={offer.imageSrc}
                    alt={offer.imageAlt}
                    fill
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 320px"
                    className={styles.offerImage}
                  />
                  <span className={styles.locationBadge}>{offer.location}</span>
                  {offer.badge && <span className={styles.offerDiscount}>{offer.badge}</span>}
                </div>
                <div className={styles.offerCardBody}>
                  <p className={styles.offerProduct}>{offer.product}</p>
                  <p className={styles.offerDescription}>{offer.description}</p>
                  {(offer.startsAt || offer.endsAt) && (
                    <p className={styles.offerValidity}>
                      {offer.startsAt && offer.endsAt
                        ? `Voimassa ${formatDate(offer.startsAt)} – ${formatDate(offer.endsAt)}`
                        : `Voimassa ${formatDate(offer.startsAt || offer.endsAt)}`}
                    </p>
                  )}
                  <div className={styles.priceRow}>
                    <span className={styles.currentPrice}>{offer.price}</span>
                    <span
                      className={styles.originalPrice}
                      aria-label={`Normaalihinta ${offer.originalPrice}`}
                    >
                      {offer.originalPrice}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
