'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';
import Beams from '../Beams/Beams';

const features = [
  {
    title: "أفضل الأسعار",
    description: "نقدم أفضل الأسعار التنافسية التي تناسب جميع الميزانيات.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    )
  },
  {
    title: "الأفضل في خدمات الحج و العمرة",
    description: "خدمات متكاملة لتنظيم رحلات الحج والعمرة بأفضل جودة وراحة.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  },
  {
    title: "حجوزات فنادق و تذاكر طيران و الباخرة",
    description: "نقوم بحجز الفنادق، تذاكر الطيران، والرحلات البحرية بكل سهولة وموثوقية.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    title: "تقديم ملف الفيزا لمختلف الرحلات",
    description: "مساعدة في تجهيز وتقديم ملفات التأشيرة لجميع أنواع الرحلات.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    )
  },
  {
    title: "دعم ومتابعة قبل وأثناء الرحلة",
    description: "فريقنا معك دائماً لضمان راحتك قبل وأثناء الرحلة.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="10" r="1" />
      </svg>
    )
  },
  {
    title: "برامج سياحية متنوعة تناسب الجميع",
    description: "برامج سياحية مختارة بعناية لتناسب جميع الأذواق.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const titleVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08
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
    <section ref={ref} className={styles.whyChooseUsSection}>
      <div className={styles.backgroundContainer}>
        <Beams
          beamWidth={1.5}
          beamHeight={25}
          beamNumber={32}
          lightColor="#f20b0b"
          speed={1.8}
          noiseIntensity={0.75}
          scale={0.32}
          rotation={10}
        />
      </div>
      <motion.div
        className={styles.header}
        variants={titleVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <span className={styles.subtitle}>Trusted Travel Partner</span>
        <h2 className={styles.title}>Why Choose Melgo Travel?</h2>
        <p className={styles.introText}>
          نقدم لكم خدمات سفر استثنائية بمعايير عالية لضمان تجربة سفر تتجاوز توقعاتكم.
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className={styles.card}
            variants={cardVariants}
          >
            <div className={styles.iconWrapper}>
              {feature.icon}
            </div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDescription}>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
