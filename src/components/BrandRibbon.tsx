'use client';

import Image from 'next/image';
import styles from './BrandRibbon.module.css';

const createLogo = (label: string, background: string, foreground: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
      <defs>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background}"/>
          <stop offset="100%" stop-color="${background}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="80" rx="12" fill="url(#glow)"/>
      <text x="50%" y="55%" text-anchor="middle" fill="${foreground}" font-family="Montserrat, Arial, sans-serif" font-size="28" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

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
