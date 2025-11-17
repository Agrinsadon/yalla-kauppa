import styles from './Contact.module.css';
import ContactFormClient from './ContactFormClient';
import { sendContactEmail } from '@/app/actions/contactActions';

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
              Yalla Kauppa on luotettava ja helposti lähestyttävä toimija, joka kuuntelee asiakkaitaan ja kumppaneitaan. Ota yhteyttä kaikissa kauppaamme, palveluihin tai yhteistyöhön liittyvissä asioissa – autamme mielellämme.
Voit myös antaa palautetta tai tehdä reklamaation vaivattomasti tämän lomakkeen kautta.
            </p>
            <hr className={styles.divider} />
            <ul className={styles.quickInfo}>
              <li>Voit tehdä reklamaation vaivattomasti tämän lomakkeen kautta</li>
              <li>Vastaamme useimmiten saman päivän aikana</li>
              <li>Asiakaspalvelu palvelee suoraan myymälästä käsin</li>
            </ul>
          </div>

          <div className={styles.formColumn} aria-labelledby="contact-form-heading">
            <ContactFormClient action={sendContactEmail} />
          </div>
        </div>
      </div>
    </section>
  );
}
