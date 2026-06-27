'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';

const steps = [
  {
    number: "01",
    title: "أخبرنا بوجهتك",
    description: "شاركنا وجهتك المفضلة ومواعيدك وميزانيتك مع فريقنا المتخصص."
  },
  {
    number: "02",
    title: "احصل على العرض",
    description: "نقدم لك أفضل العروض الفندقية والسياحية المناسبة لاحتياجاتك."
  },
  {
    number: "03",
    title: "أكد حجزك",
    description: "وافق على العرض وأكد حجزك بكل سهولة وأمان."
  },
  {
    number: "04",
    title: "استمتع برحلتك",
    description: "انطلق في رحلتك مع دعمنا المتواصل قبل وأثناء السفر."
  }
];

export default function TravelProcess() {
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
        staggerChildren: 0.15
      }
    }
  };

  const stepVariants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <section ref={ref} className={styles.processSection}>
      <motion.div 
        className={styles.header}
        variants={titleVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <span className={styles.subtitle}>كيف نعمل</span>
        <h2 className={styles.title}>Your Travel Process</h2>
        <p className={styles.introText}>
          عملية حجز سلسة ومريحة مصممة لتحقيق رحلة أحلامك.
        </p>
      </motion.div>

      <motion.div 
        className={styles.stepsContainer}
        variants={containerVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {steps.map((step, i) => (
          <motion.div 
            key={i} 
            className={styles.stepCard}
            variants={stepVariants}
          >
            <div className={styles.stepTop}>
              <div className={styles.numberWrapper}>
                <span>{step.number}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={styles.connectorLine}>
                  <motion.div 
                    className={styles.connectorProgress}
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "100%" } : { width: "0%" }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
            
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
