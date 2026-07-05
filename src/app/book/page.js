'use client';

import { useEffect } from 'react';
import TravelInquiry from '@/components/TravelInquiry';
import Contact from '@/components/Contact';
import styles from './page.module.scss';

export default function BookPage() {
  useEffect(() => {
    // Enable scrolling on this page
    document.body.style.overflowY = 'auto';
    document.body.style.cursor = 'default';

    let lenis;
    (async () => {
      const Lenis = (await import('lenis')).default;
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      if (lenis) lenis.destroy();
    };
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
