'use client';

import { useEffect } from 'react';
import TravelInquiry from '@/components/TravelInquiry';
import Contact from '@/components/Contact';
import styles from './page.module.scss';

export default function BookPage() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      new LocomotiveScroll();
    })();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.inquiryWrapper}>
        <TravelInquiry />
      </div>
      <Contact />
    </main>
  );
}
