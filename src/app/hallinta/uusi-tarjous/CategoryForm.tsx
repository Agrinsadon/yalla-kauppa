'use client';

import { useActionState } from 'react';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';

type CategoryFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const initialState: ActionState = { success: false };

export default function CategoryForm({ action }: CategoryFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form className={styles.panel} action={formAction}>
      <h2 className={styles.sectionTitle}>Luo uusi kategoria</h2>
      <div className={styles.fieldGroup}>
        <label htmlFor="categoryTitle" className={styles.label}>
          Kategorian nimi
        </label>
        <input id="categoryTitle" name="categoryTitle" className={styles.input} required />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="categoryDescription" className={styles.label}>
          Kuvaus
        </label>
        <textarea
          id="categoryDescription"
          name="categoryDescription"
          className={styles.textarea}
          rows={2}
          required
        />
      </div>
      {state.message && (
        <p className={state.success ? styles.success : styles.error}>{state.message}</p>
      )}
      <div className={styles.actionsRow}>
        <button type="submit" className={styles.primaryButton}>
          Tallenna kategoria
        </button>
      </div>
    </form>
  );
}
