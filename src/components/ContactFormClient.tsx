'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Paperclip, Send, X } from 'lucide-react';
import type { ContactFormState } from '@/app/actions/contactActions';
import styles from './Contact.module.css';

type ContactFormClientProps = {
  action: (state: ContactFormState, formData: FormData) => Promise<ContactFormState>;
};

const initialState: ContactFormState = { success: false };
const defaultFileLabel = '';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submitButton} disabled={pending}>
      {pending ? 'Lähetetään...' : 'Lähetä viesti'}
      <Send size={18} />
    </button>
  );
}

export default function ContactFormClient({ action }: ContactFormClientProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [fileLabel, setFileLabel] = useState<string>(defaultFileLabel);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setFileLabel(defaultFileLabel);
    }
  }, [state.success]);

  return (
    <form ref={formRef} className={styles.form} action={formAction} encType="multipart/form-data">
      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>
          Nimi*
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Etunimi ja sukunimi"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>
          Sähköposti*
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="esimerkki@email.com"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          Viesti*
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Kerro tarkemmin, miten voimme auttaa"
          required
          className={`${styles.input} ${styles.textarea}`}
        />
      </div>

      <div className={styles.actionsRow}>
        <SubmitButton />
        <div className={styles.fileInputRow}>
          <label htmlFor="contact-attachment" className={styles.fileButton}>
            <Paperclip size={18} /> {fileLabel}
          </label>
          <input
            id="contact-attachment"
            name="attachment"
            type="file"
            className={styles.hiddenFile}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileLabel(file ? file.name : defaultFileLabel);
            }}
          />
          {fileLabel !== defaultFileLabel && (
            <button
              type="button"
              className={styles.clearFileButton}
              onClick={() => {
                const input = document.getElementById('contact-attachment') as HTMLInputElement | null;
                if (input) input.value = '';
                setFileLabel(defaultFileLabel);
              }}
              aria-label="Poista liite"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
