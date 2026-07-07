'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';
import Rounded from '../../common/RoundedButton';
import Beams from '../Beams/Beams';

const packages = [
  {
    title: "Saudi Arabia Package",
    location: "Makkah & Madinah",
    duration: "Spiritual Journey",
    rating: "5.0",
    reviews: "124",
    price: "299999,00 DZD",
    image: "/images/mekka.jfif",
    features: ["Diwan Ajyad Hotel – Makkah", "Abraj Al Hossam Hotel – Madinah", "إقامة مريحة وخدمات عالية الجودة", "رحلة إيمانية مميزة"]
  },
  {
    title: "Tunisia Package",
    location: "Tunisia",
    duration: "Discover The Beauty",
    rating: "4.9",
    reviews: "98",
    price: "47000,00 DZD",
    image: "/images/sidi-bou-said.jfif",
    features: ["Sol Palmeras", "El Kanta", "Hannibal Hotel", "شواطئ ذهبية ومنتجعات فاخرة"]
  },
  {
    title: "Egypt Package",
    location: "Egypt",
    duration: "Experience The Magic",
    rating: "4.9",
    reviews: "156",
    price: "230000,00 DZD",
    image: "/images/cairo.jfif",
    features: ["Rihanna Royal Beach Resort", "Stay Inn Pyramids Hotel", "الأهرامات والبحر الأحمر", "تجربة سياحية فريدة"]
  },
  {
    title: "Turkey Package",
    location: "Istanbul",
    duration: "Discover The Charm",
    rating: "4.8",
    reviews: "112",
    price: "130000,00 DZD",
    image: "/images/istanbul.jfif",
    features: ["Budo Hotel Istanbul", "Klas Hotel Istanbul", "Trend Hotel Istanbul", "سحر إسطنبول حيث يلتقي الشرق بالغرب"]
  }
];


export default function TravelPackages() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const titleVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    initial: { y: 60, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <section id="travel-packages" ref={ref} className={styles.packagesSection}>
      <div className={styles.backgroundContainer}>
        <Beams />
      </div>

      <motion.div
        className={styles.header}
        variants={titleVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <span className={styles.subtitle}>Travel Packages</span>
        <h2 className={styles.title}>Featured Travel Packages</h2>
        <p className={styles.introText}>
          استمتع بأفضل الباقات السياحية المصممة بعناية مع إقامة فندقية مميزة وخدمات عالية الجودة.
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {packages.map((pkg, i) => (
          <motion.div key={i} className={styles.card} variants={cardVariants}>
            <div className={styles.imageWrapper}>
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                className={styles.image}
              />
            </div>

            <div className={styles.info}>
              <span className={styles.location}>{pkg.location}</span>
              <h3 className={styles.packageName}>{pkg.title}</h3>

              <ul className={styles.featuresList}>
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.cardFooter}>
                <span className={styles.priceValue}>{pkg.price}</span>

                <Rounded
                  className={styles.bookBtn}
                  backgroundColor="#ef4444"
                  onClick={() => { }}
                >
                  <p>Book Now</p>
                </Rounded>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}