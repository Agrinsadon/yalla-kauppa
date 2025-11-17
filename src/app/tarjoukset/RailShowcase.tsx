'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';
import type { OfferRail } from '@/types/offers';
import OfferCard from '@/components/OfferCard';

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

  // Päivämäärien muotoilu hoidetaan OfferCard-komponentissa
  const formatDate = (_?: string) => '';

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
            <h2 className={styles.railTitle}>{rail.title}</h2>
            <p className={styles.railDescription}>{rail.description}</p>
          </header>
          <div className={styles.railCarousel} role="region" aria-roledescription="carousel">
            {rail.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
