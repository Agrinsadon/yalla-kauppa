'use client';

import { useActionState, useState } from 'react';
import type { OfferRail } from '@/types/offers';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';
import { stores } from '@/data/stores';

type OfferFormProps = {
  rails: OfferRail[];
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const initialState: ActionState = { success: false };

export default function OfferForm({ rails, action }: OfferFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const noCategories = rails.length === 0;
  const [priceValue, setPriceValue] = useState<string>('');
  const [badgeValue, setBadgeValue] = useState<string>('');

  const computeBadgeFromPrice = (price: number): string => {
    if (Number.isNaN(price) || price <= 0) return '';
    let percent = 5;
    if (price < 5) percent = 5;
    else if (price < 10) percent = 10;
    else if (price < 20) percent = 15;
    else if (price < 50) percent = 20;
    else percent = 25;
    return `-${percent}%`;
  };

  return (
    <form className={styles.panel} action={formAction}>
      <h2 className={styles.sectionTitle}>Lisää uusi tarjous</h2>
      {noCategories && (
        <p className={styles.error}>
          Yhtään kategoriaa ei löytynyt. Lisää kategoria Supabasen <code>offer_rails</code> tauluun ennen ensimmäistä tarjousta.
        </p>
      )}
      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="product" className={styles.label}>
            Tuotteen nimi
          </label>
          <input id="product" name="product" className={styles.input} required />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="location" className={styles.label}>
            Myymälä / sijainti
          </label>
          <select id="location" name="location" className={styles.select} required>
            <option value="">Valitse myymälä</option>
            {stores.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="description" className={styles.label}>
          Kuvaus
        </label>
        <textarea id="description" name="description" className={styles.textarea} rows={3} required />
      </div>

      <div className={styles.fieldGroup}>
        <span className={styles.label}>Kuvan lähde</span>
        <div className={styles.toggleGroup}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="imageMode"
              value="upload"
              checked={imageMode === 'upload'}
              onChange={() => setImageMode('upload')}
            />
            <span>Lisää tiedostosta</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="imageMode"
              value="url"
              checked={imageMode === 'url'}
              onChange={() => setImageMode('url')}
            />
            <span>Käytä URL-osoitetta</span>
          </label>
        </div>
      </div>

      {imageMode === 'upload' ? (
        <div className={styles.fieldGroup}>
          <label htmlFor="imageFile" className={styles.label}>
            Kuva (JPEG, PNG, max 1.5 Mt)
          </label>
          <input
            id="imageFile"
            name="imageFile"
            className={styles.input}
            type="file"
            accept="image/*"
            required
          />
        </div>
      ) : (
        <div className={styles.fieldGroup}>
          <label htmlFor="imageSrc" className={styles.label}>
            Kuvan URL
          </label>
          <input
            id="imageSrc"
            name="imageSrc"
            className={styles.input}
            type="url"
            placeholder="https://..."
            required
          />
        </div>
      )}

      <div className={styles.fieldGroup}>
          <label htmlFor="imageAlt" className={styles.label}>
            Kuvan vaihtoehtoinen teksti
          </label>
          <input id="imageAlt" name="imageAlt" className={styles.input} required />
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="originalPrice" className={styles.label}>
            Normaalihinta
          </label>
          <input id="originalPrice" name="originalPrice" className={styles.input} required />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="price" className={styles.label}>
            Tarjoushinta
          </label>
          <input
            id="price"
            name="price"
            className={styles.input}
            type="number"
            step="0.01"
            min="0"
            value={priceValue}
            onChange={(e) => {
              const v = e.target.value;
              setPriceValue(v);
              const num = parseFloat(v.replace(',', '.'));
              setBadgeValue(computeBadgeFromPrice(num));
            }}
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="badge" className={styles.label}>
            Badge (automaattinen)
          </label>
          <input
            id="badge"
            name="badge"
            className={styles.input}
            value={badgeValue}
            readOnly
            title="Lasketaan automaattisesti hinnan perusteella"
            placeholder="-"
          />
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="startsAt" className={styles.label}>
            Alkupäivä
          </label>
          <input id="startsAt" name="startsAt" className={styles.input} type="date" />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="endsAt" className={styles.label}>
            Loppupäivä
          </label>
          <input id="endsAt" name="endsAt" className={styles.input} type="date" />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="categoryId" className={styles.label}>
            Kategoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={styles.select}
            required
            disabled={noCategories}
          >
            <option value="">{noCategories ? 'Luo kategoria Supabaseden puolella' : 'Valitse kategoria'}</option>
            {rails.map((rail) => (
              <option key={rail.id} value={rail.id}>
                {rail.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.message && (
        <p className={state.success ? styles.success : styles.error}>{state.message}</p>
      )}

      <div className={styles.actionsRow}>
        <button type="submit" className={styles.primaryButton} disabled={noCategories}>
          Tallenna tarjous
        </button>
      </div>
    </form>
  );
}
