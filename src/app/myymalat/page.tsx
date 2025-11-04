import { Metadata } from 'next';
import { stores } from '@/data/stores';
import StoreCard from '@/components/StoreCard';
import styles from './page.module.css';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Myymälät - Yalla Kauppa',
  description: 'Löydä lähin Yalla-myymäläsi. Tutustu sijainteihin, aukioloajoihin ja reittiohjeisiin.',
};

export default function MyymalatPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Löydä lähin Yalla-myymäläsi</h1>
          <p className={styles.subtitle}>
            Tervetuloa viiteen Yalla-myymälään Helsingissä ja Vantaalla. 
            Löydä meidät helposti ja nauti laadukkaista tuotteista lähelläsi.
          </p>
        </div>
      </section>

      <section className={styles.storesSection}>
        <div className={styles.storesGrid}>
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>
      <Contact />
    </div>
  );
}

