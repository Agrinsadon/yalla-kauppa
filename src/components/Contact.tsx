import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="yhteystiedot" className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.infoColumn}>
            <div>
              <p className={styles.kicker}>Ota yhteyttä</p>
            </div>
            <p className={styles.description}>
              Yalla Kauppa on markkinahenkinen kohtaamispaikka, jossa tarjoamme tuoreita
              tuotteita, paikallista palvelua ja apua arjen asioihin. Kerro meille
              tarpeesi – oli kyseessä tilaus, yhteistyö tai myymäläkokemus – niin ohjaamme
              viestisi oikealle henkilölle.
            </p>
            <hr className={styles.divider} />
            <ul className={styles.quickInfo}>
              <li>Voi tehdä reklamaation vaivattomasti tämän lomakkeen kautta</li>
              <li>Vastaamme useimmiten saman päivän aikana</li>
              <li>Asiakaspalvelu palvelee suoraan myymälästä käsin</li>
            </ul>
          </div>

          <div className={styles.formColumn} aria-labelledby="contact-form-heading">
            <form className={styles.form}>
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
              <button type="submit" className={styles.submitButton}>
                Lähetä viesti
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
