'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './WeeklyOffers.module.css';
import type { WeeklyOffer } from '@/types/offers';
import OfferCard from '@/components/OfferCard';

type OfferCardProps = {
  offer: WeeklyOffer;
};

// Replace local card with shared OfferCard from tarjoukset to keep identical UI
function OfferCardWrapper({ offer }: OfferCardProps) {
  // Map WeeklyOffer -> StoreOffer shape minimally used by OfferCard
  const mapped = {
    id: offer.id,
    product: offer.title,
    description: offer.description || '',
    imageSrc: offer.imageSrc ?? '',
    imageAlt: offer.imageAlt ?? '',
    price: offer.price,
    originalPrice: offer.originalPrice,
    location: offer.location,
    locations:
      offer.locations && offer.locations.length > 0
        ? offer.locations
        : offer.location
          ? [offer.location]
          : [],
    badge: offer.discount,
    startsAt: offer.startsAt,
    endsAt: offer.endsAt,
  } as const;

  return <OfferCard offer={mapped as any} />;
}

type WeeklyOffersProps = {
  offers?: WeeklyOffer[];
};

export default function WeeklyOffers({ offers = [] }: WeeklyOffersProps) {
  const carouselId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeOffers = offers.length > 0 ? offers : [];
  const cardCount = safeOffers.length;

  const handleScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    children.forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - container.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let animationFrame = 0;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(handleScrollPosition);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScrollPosition]);

  const indicatorLabel = useMemo(() => {
    if (cardCount === 0) return 'Ei voimassa olevia tarjouksia';
    return `Kortti ${activeIndex + 1} / ${cardCount}`;
  }, [activeIndex, cardCount]);

  return (
    <section
      className={styles.section}
      aria-labelledby={`${carouselId}-heading`}
      role="region"
      aria-roledescription="carousel"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h2 id={`${carouselId}-heading`} className={styles.title}>
              Tämän viikon tarjoukset
            </h2>
            <p className={styles.subtitle}>Päivitämme tarjoukset viikoittain.</p>
          </div>
          <div className={styles.actions}>
            <Link
              href="/tarjoukset"
              className={styles.primaryAction}
              aria-label="Katso kaikki tarjoukset"
            >
              Katso kaikki tarjoukset
            </Link>
          </div>
        </header>

        {safeOffers.length === 0 ? (
          <p className={styles.emptyState}>Uusia viikkotarjouksia ei juuri nyt – palaa pian!</p>
        ) : (
          <div
            className={styles.carouselWrapper}
            tabIndex={0}
            aria-label={indicatorLabel}
          >
            <div
              id={carouselId}
              className={styles.carousel}
              ref={containerRef}
              role="group"
              aria-label="Tarjouskortit"
            >
              {safeOffers.map((offer) => (
                <OfferCardWrapper key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
