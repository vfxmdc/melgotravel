'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';
import Rounded from '../../common/RoundedButton';
import DarkVeil from '../DarkVeil/DarkVeil';

export default function CTABanner() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contentVariants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <section ref={ref} className={styles.ctaSection}>
      <DarkVeil
        hueShift={243}
        noiseIntensity={0}
        scanlineIntensity={0.93}
        speed={1.2}
        scanlineFrequency={1.5}
        warpAmount={0}
      />
      <motion.div 
        className={styles.bannerContainer}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >

        <motion.div 
          className={styles.content}
          variants={contentVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <span className={styles.tagline}>Start Planning</span>
          <h2 className={styles.headline}>Ready For Your Next Adventure?</h2>
          <p className={styles.description}>
            Let our travel experts create a personalized journey you'll never forget.
          </p>
          <div className={styles.buttonsGroup}>
            <Rounded 
              className={styles.primaryBtn} 
              backgroundColor="#ef4444"
              onClick={() => router.push('/book')}
            >
              <p>Get Free Consultation</p>
            </Rounded>
            <Rounded className={styles.secondaryBtn} backgroundColor="#ef4444">
              <p className={styles.darkText}>Contact Us</p>
            </Rounded>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
