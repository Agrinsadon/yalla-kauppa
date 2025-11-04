'use client';

import Image from 'next/image';
import styles from './BrandRibbon.module.css';

const partnerLogos = [
  { name: 'Abido', src: '/abido.png.jpeg' },
  { name: 'Ahmad Tea', src: '/ahmadtea.png' },
  { name: 'Alibaba', src: '/alibaba.png' },
  { name: 'Ashoka', src: '/ashoka.png' },
  { name: 'Asian Choice', src: '/asianchoice.png' },
  { name: 'Beno', src: '/beno.jpeg' },
  { name: 'Besler', src: '/beslerlogo.png.webp' },
  { name: 'Bonemer', src: '/bonemer.jpg' },
  { name: 'Chtoura Garden', src: '/chtouragarden.jpeg' },
  { name: 'Coldalex', src: '/coldalex.png.jpeg' },
  { name: 'Destan', src: '/destan.png.webp' },
  { name: 'DSD', src: '/dsd-logo.png' },
  { name: 'Durra', src: '/durra.png' },
  { name: 'Elburg', src: '/elburg.jpeg' },
  { name: 'Eti', src: '/eti.png' },
  { name: 'Gulcan', src: '/gulcan.png' },
  { name: 'Haribo', src: '/haribo.png.webp' },
  { name: 'Humza', src: '/humza.png.webp' },
  { name: 'Itikat', src: '/itikat.png' },
  { name: 'Jaunpils', src: '/jaunpils.jpg' },
  { name: 'Jona', src: '/jona.png' },
  { name: 'Mahmood Tea', src: '/mahmoodtea.jpg' },
  { name: 'MBM', src: '/mbm.png' },
  { name: 'Nongshim', src: '/nongshim.png' },
  { name: 'Pasfrost', src: '/pasfrost.png' },
  { name: 'Qibbla', src: '/qibbla.png' },
  { name: 'Qualiko', src: '/qualiko.png' },
  { name: 'Salliselta', src: '/salliselta.png' },
  { name: 'Samyang', src: '/samyang.png' },
  { name: 'Seara', src: '/seara.png' },
  { name: 'Taj Foods', src: '/taj-foods.png' },
  { name: 'Tat', src: '/tat.png' },
  { name: 'Top Choice', src: '/topchoice.png' },
  { name: 'TRS', src: '/trslogo.png' },
  { name: 'Yörem', src: '/yörem.png.webp' },
  { name: 'Zeeba', src: '/zeeba.jpeg' },
];

export default function BrandRibbon() {
  return (
    <section
      className={styles.wrapper}
      aria-labelledby="partners-heading"
    >
      <div className={styles.sectionHeader}>
        <h2 id="partners-heading" className={styles.sectionTitle}>
          Yhteistyökumppanit &amp; brändit
        </h2>
      </div>
      <div className={styles.carouselWrapperInline}>
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
      </div>
    </section>
  );
}
