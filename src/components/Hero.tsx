'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <h1 className={styles.title}>
              Löydä laadukkaat elintarvikkeet ja ainutlaatuiset herkut
            </h1>
            <p className={styles.subtitle}>
              Löydä laaja valikoima erikoistuotteita ja viikon parhaat
              tarjoukset.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/tarjoukset" className={styles.primaryButton}>
                Selaa tarjouksia
              </Link>
              <Link href="/myymalat" className={styles.secondaryButton}>
                Löydä myymälä
              </Link>
            </div>
          </div>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src="/landingpage.jpg"
                alt="Yalla Kaupan tuotteita"
                width={600}
                height={600}
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
