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
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

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
        offer.locations
          .filter((location) => location && location !== 'Kaikki myymälät')
          .forEach((location) => storeSet.add(location));
      });
    });
    return Array.from(storeSet)
      .sort((a, b) => a.localeCompare(b, 'fi'))
      .map((store) => ({
        id: store,
        label: store.replace('Yalla Kauppa ', '').replace('Yalla ', ''),
      }));
  }, [rails]);

  const toggleStore = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId],
    );
  };

  const filteredRails = useMemo(() => {
    if (selectedStores.length === 0) return rails;
    return rails
      .map((rail) => ({
        ...rail,
        offers: rail.offers.filter((offer) => {
          if (offer.locations.includes('Kaikki myymälät')) {
            return true;
          }
          return selectedStores.some((store) => offer.locations.includes(store));
        }),
      }))
      .filter((rail) => rail.offers.length > 0);
  }, [rails, selectedStores]);

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
          className={`${styles.storeLink} ${selectedStores.length === 0 ? styles.storeLinkActive : ''}`}
          onClick={() => setSelectedStores([])}
          aria-pressed={selectedStores.length === 0}
        >
          Kaikki myymälät
        </button>
        {storeItems.map((store) => {
          const isActive = selectedStores.includes(store.id);
          return (
            <button
              key={store.id}
              type="button"
              className={`${styles.storeLink} ${isActive ? styles.storeLinkActive : ''}`}
              onClick={() => toggleStore(store.id)}
              aria-pressed={isActive}
            >
              {store.label}
            </button>
          );
        })}
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
