'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import type { OfferRail } from '@/types/offers';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';
import { stores } from '@/data/stores';

type OfferFormProps = {
  rails: OfferRail[];
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const initialState: ActionState = { success: false };
const ALL_STORES_VALUE = '__ALL_STORES__';
const ALL_STORES_LABEL = 'Kaikki myymälät';

export default function OfferForm({ rails, action }: OfferFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const noCategories = rails.length === 0;
  const [priceValue, setPriceValue] = useState<string>('');
  const [badgeValue, setBadgeValue] = useState<string>('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setImageMode('upload');
      setPriceValue('');
      setBadgeValue('');
      setSelectedStores([]);
    }
  }, [state.success]);

  const toggleStoreSelection = (value: string) => {
    setSelectedStores((prev) => {
      if (value === ALL_STORES_VALUE) {
        return prev.includes(ALL_STORES_VALUE) ? [] : [ALL_STORES_VALUE];
      }

      const withoutAll = prev.filter((item) => item !== ALL_STORES_VALUE);
      if (withoutAll.includes(value)) {
        return withoutAll.filter((item) => item !== value);
      }
      return [...withoutAll, value];
    });
  };

  const storesDisabled = selectedStores.includes(ALL_STORES_VALUE);

  const checkboxClass = (value: string) =>
    selectedStores.includes(value)
      ? `${styles.checkboxPill} ${styles.checkboxPillActive}`
      : styles.checkboxPill;

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
    <form ref={formRef} className={styles.panel} action={formAction}>
      <h2 className={styles.sectionTitle}>Lisää uusi tarjous</h2>
      {noCategories && (
        <p className={styles.error}>
          Yhtään kategoriaa ei löytynyt.
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
          <span className={styles.label}>Myymälät</span>
          <p className={styles.helperText}>
            Valitse yksi tai useampi myymälä. Voit myös valita "Kaikki myymälät" jos tarjous koskee kaikkia.
          </p>
          <div className={styles.checkboxGroup}>
            <label className={checkboxClass(ALL_STORES_VALUE)}>
              <input
                type="checkbox"
                name="location"
                value={ALL_STORES_VALUE}
                checked={selectedStores.includes(ALL_STORES_VALUE)}
                onChange={() => toggleStoreSelection(ALL_STORES_VALUE)}
              />
              <span className={styles.checkboxLabelText}>{ALL_STORES_LABEL}</span>
            </label>
            {stores.map((store) => (
              <label key={store.id} className={checkboxClass(store.name)}>
                <input
                  type="checkbox"
                  name="location"
                  value={store.name}
                  checked={selectedStores.includes(store.name)}
                  disabled={storesDisabled}
                  onChange={() => toggleStoreSelection(store.name)}
                />
                <span className={styles.checkboxLabelText}>{store.name}</span>
              </label>
            ))}
          </div>
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
            Kuvan vaihtoehtoinen teksti (valinnainen)
          </label>
          <input id="imageAlt" name="imageAlt" className={styles.input} />
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
