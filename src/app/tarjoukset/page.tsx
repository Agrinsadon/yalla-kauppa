import { Metadata } from 'next';
import styles from './page.module.css';

const offers = [
  {
    id: 'fresh-produce',
    title: 'Tuoretuotteet -20%',
    description: 'Kauden parhaat hedelmät ja vihannekset suoraan tuottajilta.',
    validUntil: 'Voimassa tällä viikolla',
  },
  {
    id: 'local-bakery',
    title: 'Lähileipomon herkut 3 kpl / 10€',
    description: 'Valitse suosikkisi artesaanileivistä, pullista ja croissanteista.',
    validUntil: 'Voimassa sunnuntaihin asti',
  },
  {
    id: 'coffee-tea',
    title: 'Kahvit ja teet -15%',
    description: 'Laaja valikoima tummapaahtoisia kahveja ja laadukkaita teelaatuja.',
    validUntil: 'Voimassa 30.4. asti',
  },
];

export const metadata: Metadata = {
  title: 'Tarjoukset - Yalla Kauppa',
  description: 'Tutustu Yalla Kaupan ajankohtaisiin tarjouksiin ja löydä parhaat löydöt.',
};

export default function TarjouksetPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Ajankohtaiset tarjoukset</h1>
          <p className={styles.subtitle}>
            Poimi parhaat tarjoukset arjen ruokaostoksiin ja hemmottele itseäsi sesongin herkuilla.
          </p>
        </div>
      </section>

      <section className={styles.offersSection}>
        <div className={styles.offersGrid}>
          {offers.map((offer) => (
            <article key={offer.id} className={styles.offerCard}>
              <h2 className={styles.offerTitle}>{offer.title}</h2>
              <p className={styles.offerDescription}>{offer.description}</p>
              <p className={styles.offerValidity}>{offer.validUntil}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
