'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';
import DarkVeil from '../DarkVeil/DarkVeil';

const testimonials = [
  {
    name: "Khireddine Lilia",
    country: "Algeria",
    rating: 5,
    initials: "KL",
    text: "شكراعلى استقبالكم وحسن معاملتكم, مشاء الله على خدمتكم الله يبارك لكم في عملكم الرحمة على والديكم"
  },
  {
    name: "Behaz said",
    country: "Algeria",
    rating: 5,
    initials: "BS",
    text: "كل الشكر و التقدير لطاقم الوكالة حسن استقبال وتوجيه , مشاء الله بالتوفيق "
  },
  {
    name: "Soltani Amina",
    country: "Algeria",
    rating: 5,
    initials: "SA",
    text: "وكالة في القمة اللهم بارك ,استقبال مميز وتسهيلات للزبائن مشكورين على مجهوداتكم"
  }
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const titleVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const gridVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <section ref={ref} className={styles.testimonialsSection}>
      <DarkVeil
        hueShift={243}
        noiseIntensity={0}
        scanlineIntensity={0.93}
        speed={1.2}
        scanlineFrequency={1.5}
        warpAmount={0}
      />
      <motion.div
        className={styles.header}
        variants={titleVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <span className={styles.subtitle}>Client Feedback</span>
        <h2 className={styles.title}>Guest Testimonials</h2>
        <p className={styles.introText}>
          Read about the unique experiences and journeys of our discerning guests worldwide.
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={gridVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {testimonials.map((test, i) => (
          <motion.div
            key={i}
            className={styles.card}
            variants={cardVariants}
          >
            <div className={styles.quoteIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(69, 92, 233, 0.15)" strokeWidth="2.5">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v4c0 1.25.75 2 2 2h4c0 4-4 6-4 6M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v4c0 1.25.75 2 2 2h4c0 4-4 6-4 6" />
              </svg>
            </div>

            <p className={styles.reviewText}>"{test.text}"</p>

            <div className={styles.ratingStars}>
              {[...Array(test.rating)].map((_, idx) => (
                <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="#E8A900" stroke="#E8A900">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <div className={styles.userProfile}>
              <div className={styles.avatarInitials}>
                <span>{test.initials}</span>
              </div>
              <div className={styles.metaInfo}>
                <h4 className={styles.userName}>{test.name}</h4>
                <span className={styles.userCountry}>{test.country}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
