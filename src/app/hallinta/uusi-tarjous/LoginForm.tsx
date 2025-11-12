'use client';

import { useActionState } from 'react';
import type { ActionState } from './actionTypes';
import styles from './page.module.css';

type LoginFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const initialState: ActionState = { success: false };

export default function LoginForm({ action }: LoginFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form className={styles.panel} action={formAction}>
      <h2 className={styles.sectionTitle}>Kirjaudu hallintaan</h2>
      <div className={styles.fieldGroup}>
        <label htmlFor="username" className={styles.label}>
          Käyttäjätunnus
        </label>
        <input
          id="username"
          name="username"
          className={styles.input}
          type="text"
          required
          placeholder="admin"
          autoComplete="username"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="password" className={styles.label}>
          Salasana
        </label>
        <input
          id="password"
          name="password"
          className={styles.input}
          type="password"
          required
          placeholder="••••••"
          autoComplete="current-password"
        />
      </div>
      {state.message && (
        <p className={state.success ? styles.success : styles.error}>{state.message}</p>
      )}
      <button type="submit" className={styles.primaryButton}>
        Kirjaudu sisään
      </button>
    </form>
  );
}
