import { Store } from '@/data/stores';
import { MapPin, Clock, Phone } from 'lucide-react';
import styles from './StoreCard.module.css';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  const fullAddress = `${store.address}, ${store.postalCode} ${store.city}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const sanitizedPhone = store.phone ? store.phone.replace(/\s+/g, '') : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{store.name}</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <MapPin className={styles.icon} size={24} />
            </div>
            <div>
              <p className={styles.label}>Sijainti</p>
              <p className={styles.value}>{store.address}</p>
              <p className={styles.value}>{store.postalCode} {store.city}</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <Clock className={styles.icon} size={24} />
            </div>
            <div>
              <p className={styles.label}>Aukioloajat</p>
              {store.openingHours.weekdays && (
                <p className={styles.value}>{store.openingHours.weekdays}</p>
              )}
              {store.openingHours.weekends && (
                <p className={styles.value}>{store.openingHours.weekends}</p>
              )}
            </div>
          </div>
          {(store.phone || store.email) && (
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Phone className={styles.icon} size={24} />
              </div>
              <div>
                <p className={styles.label}>Yhteystiedot</p>
                {store.phone && (
                  <p className={styles.value}>
                    <a href={`tel:${sanitizedPhone}`} className={styles.link}>
                      {store.phone}
                    </a>
                  </p>
                )}
                {store.email && (
                  <p className={styles.value}>
                    <a href={`mailto:${store.email}`} className={styles.link}>
                      {store.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.routeButton}
        >
          <MapPin size={18} />
          Reittiohjeet
        </a>
      </div>
    </div>
  );
}
