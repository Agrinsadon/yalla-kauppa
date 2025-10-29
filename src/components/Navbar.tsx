'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/yalla.png"
            alt="Yalla Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Koti</Link>
          </li>
          <li>
            <Link href="/myymalat">Myymälät</Link>
          </li>
          <li>
            <Link href="/tarjoukset">Tarjoukset</Link>
          </li>
          <li>
            <Link href="/meista">Meistä</Link>
          </li>
          <li>
            <Link href="/yhteystiedot">Yhteystiedot</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

