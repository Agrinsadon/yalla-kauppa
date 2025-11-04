'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './WeeklyOffers.module.css';

type Offer = {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  originalPrice: string;
  discount: string;
  validUntil: string;
  ctaLabel: string;
  href: string;
};

const createPlaceholderImage = (label: string, color: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.85" />
          <stop offset="100%" stop-color="${color}" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" rx="32" fill="url(#grad)" />
      <text x="50%" y="54%" font-family="Inter, 'SF Pro Text', system-ui" font-size="64" font-weight="700" text-anchor="middle" fill="#ffffff" opacity="0.85">
        ${label}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const offers: Offer[] = [
  {
    id: 'fresh-basket',
    title: 'Viikon vihannesvalikoima',
    imageSrc: '/landingpage.jpg',
    imageAlt: 'Tuoreita vihanneksia ja hedelmiä koriin koottuna',
    price: '14,90 €',
    originalPrice: '19,90 €',
    discount: '-25%',
    validUntil: 'Voimassa 4.–10.11.',
    ctaLabel: 'Katso',
    href: '/tarjoukset#fresh-basket',
  },
  {
    id: 'alibaba-favorites',
    title: 'Alibaba suosikit',
    imageSrc: '/alibaba.png',
    imageAlt: 'Alibaba brändin tuotteita hyllyllä',
    price: '8,50 €',
    originalPrice: '11,90 €',
    discount: '-29%',
    validUntil: 'Voimassa 4.–10.11.',
    ctaLabel: 'Katso',
    href: '/tarjoukset#alibaba',
  },
  {
    id: 'asia-express',
    title: 'Asia Express ateriapaketti',
    imageSrc: '/asia_express_food.png',
    imageAlt: 'Aasialainen ateriapaketti tarjoiltuna kulhossa',
    price: '5,90 €',
    originalPrice: '7,90 €',
    discount: '-25%',
    validUntil: 'Voimassa 4.–10.11.',
    ctaLabel: 'Katso',
    href: '/tarjoukset#asia-express',
  },
  {
    id: 'coffee-club',
    title: 'Paahtimon kahvipavut',
    imageSrc: createPlaceholderImage('Paahdetut pavut', '#6366F1'),
    imageAlt: 'Tuoreita kahvipapuja säiliössä',
    price: '11,40 €',
    originalPrice: '15,20 €',
    discount: '-25%',
    validUntil: 'Voimassa 4.–10.11.',
    ctaLabel: 'Katso',
    href: '/tarjoukset#coffee',
  },
];

type OfferCardProps = {
  offer: Offer;
};

function OfferCard({ offer }: OfferCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article
      className={styles.card}
      role="group"
      aria-label={`${offer.title}, alennus ${offer.discount}`}
    >
      <div className={styles.imageWrapper}>
        {!imageLoaded && <div className={styles.imageSkeleton} aria-hidden="true" />}
        <Image
          src={offer.imageSrc}
          alt={offer.imageAlt}
          fill
          priority={false}
          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 320px"
          className={`${styles.image} ${imageLoaded ? styles.imageVisible : ''}`}
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <span className={styles.discountBadge} aria-hidden="true">
          {offer.discount}
        </span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{offer.title}</h3>
        <div className={styles.priceRow}>
          <p className={styles.currentPrice}>{offer.price}</p>
          <p className={styles.originalPrice} aria-label={`Normaalihinta ${offer.originalPrice}`}>
            {offer.originalPrice}
          </p>
        </div>
        <p className={styles.validity}>{offer.validUntil}</p>
      </div>
    </article>
  );
}

export default function WeeklyOffers() {
  const carouselId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = offers.length;

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

  const indicatorLabel = useMemo(
    () => `Kortti ${activeIndex + 1} / ${cardCount}`,
    [activeIndex, cardCount],
  );

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
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
