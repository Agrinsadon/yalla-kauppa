'use client';

import Image from 'next/image';
import styles from './BrandRibbon.module.css';

const partnerLogos = [
  {
    name: 'Alibaba',
    src: '/alibaba.png',
  },
  {
    name: 'Asia express',
    src: "/asia_express_food.png",
  },
  {
    name: 'DSD',
    src: "/dsd-logo.png",
  },
  {
    name: 'Beno',
    src: "/beno.jpeg",
  },
  {
    name: 'Salliselta',
    src: "/salliselta.png"
  },
  {
    name: 'Mehran',
    src: "/images.png",
  },
];

export default function BrandRibbon() {
  return (
    <section className={styles.wrapper} aria-label="Kumppanibrändit">
      <div className={styles.carousel}>
        <div className={styles.track}>
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <div className={styles.logoItem} key={`${logo.name}-${index}`}>
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                className={styles.logoImage}
                width={200}
                height={80}
                loading="lazy"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
