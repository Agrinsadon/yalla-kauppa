'use client';

import { BadgeCheck, ChefHat, Salad, Users } from 'lucide-react';
import styles from './About.module.css';

export default function About() {
  const stats = [
    { 
      value: '2016', 
      label: 'Perustettu',
    },
    { 
      value: '5', 
      label: 'Myymälää',
    },
    { 
      value: '1000+', 
      label: 'Tuotetta',
    },
  ];

  const features = [
    {
      icon: <BadgeCheck size={40} />,
      title: 'HALAL TUOTTEET',
      description: 'Laaja valikoima sertifioituja halal-tuotteita',
    },
    {
      icon: <ChefHat size={40} />,
      title: 'TUOREET LEIVÄT',
      description: 'Päivittäin tuoreet leivät kaikkiin myymäliin',
    },
    {
      icon: <Salad size={40} />,
      title: 'TUOREET VIHANNEKSET',
      description: 'Valikoimassamme on päivittäin tuoreita vihanneksia ja hedelmiä',
    },
    {
      icon: <Users size={40} />,
      title: 'PERHEYRITYS',
      description: 'Yalla on perheyritys, joka jakaa arvoja ja rakastaa asiakkaitaan',
    },
  ];

  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.header}>
            <h2 className={styles.title}>Meistä</h2>
            <div className={styles.subtitle}>
              <p>
                Yalla on vuonna 2016 perustettu perheyritys, joka on kasvanut
                luotettavaksi ruokakaupaksi tuoreiden ja laadukkaiden
                tuotteidensa ansiosta. Uskomme, että hyvä ruoka tekee arjesta
                paremman, ja siksi panostamme aina tuoreuteen, makuun ja
                palveluun.
              </p>
              <p>
                Valikoimastamme löydät päivittäin tuoretta lihaa, sesongin
                vihanneksia ja hedelmiä, sekä vaihtuvan valikoiman eksoottisia
                tuotteita eri puolilta maailmaa. Tarjoamme myös tuoretta leipää,
                mausteita ja muita herkkuja, jotka tekevät ruoanlaitosta
                inspiroivaa.
              </p>
              <p>
                Yallassa yhdistyvät laatu, ystävällinen palvelu ja yhteisöllinen
                tunnelma – juuri kuten hyvässä ruokakaupassa kuuluukin.
              </p>
            </div>
          </div>

          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.features}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
