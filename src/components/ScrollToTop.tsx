'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const scrollToHash = (hash: string) => {
  const targetId = hash.replace('#', '');
  if (!targetId) {
    return;
  }

  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    setTimeout(() => {
      const retryEl = document.getElementById(targetId);
      if (retryEl) {
        retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
};

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const { hash } = window.location;

    if (hash) {
      requestAnimationFrame(() => scrollToHash(hash));
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        scrollToHash(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}
