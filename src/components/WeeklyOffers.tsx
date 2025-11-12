'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './WeeklyOffers.module.css';

type OfferImage = {
  src: string;
  alt: string;
};

type Offer = {
  id: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  imageGallery?: OfferImage[];
  price: string;
  originalPrice: string;
  discount: string;
  validUntil: string;
  href: string;
};

const offers: Offer[] = [
  {
    id: 'meat-poultry',
    title: 'Liha & kana',
    imageSrc: '/liha.jpg',
    imageAlt: 'Valikoima tuoreita liha- ja kanatuotteita',
    price: '24,90 €',
    originalPrice: '32,50 €',
    discount: '-23%',
    validUntil: 'Voimassa 4.–10.11.',
    href: '/tarjoukset#liha',
  },
  {
    id: 'veg-herbs',
    title: 'Vihannekset & yrtit',
    imageSrc: '/yrtit.jpg',
    imageAlt: 'Vihanneksia ja yrttejä korissa',
    price: '12,50 €',
    originalPrice: '16,90 €',
    discount: '-26%',
    validUntil: 'Voimassa 4.–10.11.',
    href: '/tarjoukset#vihannekset',
  },
  {
    id: 'fruits',
    title: 'Hedelmät',
    imageGallery: [
      { src: '/hedelmät.jpg', alt: 'Klassisia hedelmiä vadilla' },
      { src: '/hedelmät2.jpg', alt: 'Trooppisia hedelmiä pöydällä' },
    ],
    price: '9,20 €',
    originalPrice: '12,40 €',
    discount: '-26%',
    validUntil: 'Voimassa 4.–10.11.',
    href: '/tarjoukset#hedelmat',
  },
  {
    id: 'other-essentials',
    title: 'Muut arjen suosikit',
    imageSrc: '/muut.jpg',
    imageAlt: 'Kattaus erilaisia arjen ruokatuotteita',
    price: '6,90 €',
    originalPrice: '9,20 €',
    discount: '-25%',
    validUntil: 'Voimassa 4.–10.11.',
    href: '/tarjoukset#muut',
  },
];

type OfferCardProps = {
  offer: Offer;
};

function OfferCard({ offer }: OfferCardProps) {
  const totalImages = offer.imageGallery ? offer.imageGallery.length : 1;
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const handleImageLoaded = () => {
    setImagesLoaded((count) => count + 1);
  };

  const allImagesLoaded = imagesLoaded >= totalImages;

  return (
    <article
      className={styles.card}
      role="group"
      aria-label={`${offer.title}, alennus ${offer.discount}`}
    >
      <div className={`${styles.imageWrapper} ${offer.imageGallery ? styles.imageWrapperMulti : ''}`}>
        {!allImagesLoaded && <div className={styles.imageSkeleton} aria-hidden="true" />}
        {offer.imageGallery ? (
          <div className={styles.imageGrid} role="presentation">
            {offer.imageGallery.map((img) => (
              <div key={img.src} className={styles.imageCell}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 320px"
                  className={`${styles.image} ${allImagesLoaded ? styles.imageVisible : ''}`}
                  onLoadingComplete={handleImageLoaded}
                />
              </div>
            ))}
          </div>
        ) : (
          offer.imageSrc && (
            <Image
              src={offer.imageSrc}
              alt={offer.imageAlt ?? ''}
              fill
              priority={false}
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 320px"
              className={`${styles.image} ${allImagesLoaded ? styles.imageVisible : ''}`}
              onLoadingComplete={handleImageLoaded}
            />
          )
        )}
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
