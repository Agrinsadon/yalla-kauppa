import { Metadata } from 'next';
import { fetchOfferRails } from '@/lib/offers';
import styles from './page.module.css';
import RailShowcase from './RailShowcase';

type HeroHighlight = {
  id: string;
  label: string;
  value: string;
};

const heroHighlights: HeroHighlight[] = [
  { id: 'drop', label: 'Uudet tarjoukset', value: '2x viikossa' },
  { id: 'cards', label: 'Kortteja', value: '15+ tuotetta' },
  { id: 'availability', label: 'Saatavuus', value: 'Kaikki Yalla-myymälät' },
];

export const metadata: Metadata = {
  title: 'Tarjoukset - Yalla Kauppa',
  description: 'Tutustu Yalla Kaupan ajankohtaisiin tarjouksiin ja löydä parhaat löydöt.',
};

export default async function TarjouksetPage() {
  const offerRails = await fetchOfferRails({ includeEmpty: true });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Yalla Kauppa • Ajankohtaiset tarjoukset</p>
        <h1 className={styles.title}>Täydelliset tarjoukset jokaiseen ruokapöytään</h1>
        <p className={styles.subtitle}>
          Kuratoitu tarjouskokonaisuus, jossa jokainen kortti tuo esiin tuotteen kuvan, hinnat ja
          sijainnin. Inspiroidu ja nappaa suosikit saman tien.
        </p>
        <div className={styles.heroHighlights}>
          {heroHighlights.map((highlight) => (
            <div key={highlight.id} className={styles.highlightCard}>
              <p className={styles.highlightValue}>{highlight.value}</p>
              <p className={styles.highlightLabel}>{highlight.label}</p>
            </div>
          ))}
        </div>
      </section>

      {offerRails.length === 0 ? (
        <p className={styles.emptyState}>
          Tarjouksia ei ole vielä lisätty. Tulethan takaisin pian!
        </p>
      ) : (
        <RailShowcase rails={offerRails} />
      )}
    </div>
  );
}
