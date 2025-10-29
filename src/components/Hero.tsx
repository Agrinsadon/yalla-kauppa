'use client';

import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <h1 className={styles.title}>
              Tervetuloa Yalla-kauppaan
            </h1>
            <p className={styles.subtitle}>
              Suomen parhaat ruuat ja tuoreimmat tuotteet suoraan kotiovellesi. 
              Löydämme sinulle parhaat tuotteet parhaasta hinnasta.
            </p>
            <p className={styles.description}>
              Yalla on moderni ruokakauppa, joka tuo sinulle laadukkaita tuotteita 
              jokapäiväiseen käyttöön. Valikoimassamme on tuhansia tuotteita kaikille makuille.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryButton}>
                Selaa tuotteita
              </button>
              <button className={styles.secondaryButton}>
                Löydä myymälä
              </button>
            </div>
          </div>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src="/yalla.png"
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

