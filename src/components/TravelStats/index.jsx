'use client';
import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import styles from './style.module.scss';
import DarkVeil from '../DarkVeil/DarkVeil';

function Counter({ value, suffix = "", duration = 2, delay = 0 }) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return Math.round(latest).toLocaleString() + suffix;
  });

  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      });
      return controls.stop;
    }
  }, [isInView, value, duration, delay]);

  return (
    <motion.span ref={ref}>{rounded}</motion.span>
  );
}

export default function TravelStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "عملاء سعداء",
      description: "عملاء استمتعوا بتجارب سفر استثنائية معنا."
    },
    {
      value: 120,
      suffix: "+",
      label: "وجهة سياحية",
      description: "وجهات مختارة بعناية حول العالم."
    },
    {
      value: 15,
      suffix: "",
      label: "سنة خبرة",
      description: "خبرة واحترافية في تنظيم الرحلات السياحية."
    },
    {
      value: 98,
      suffix: "%",
      label: "نسبة الرضا",
      label: "نسبة الرضا",
      description: "نلتزم بتقديم أفضل الخدمات لعملائنا."
    }
  ];

  return (
    <section ref={ref} className={styles.statsSection}>
      <DarkVeil
        hueShift={243}
        noiseIntensity={0}
        scanlineIntensity={0.93}
        speed={1.2}
        scanlineFrequency={1.5}
        warpAmount={0}
      />
      <div className={styles.container}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className={styles.statBox}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <h3 className={styles.number}>
              <Counter value={stat.value} suffix={stat.suffix} delay={0.2 + i * 0.05} />
            </h3>
            <h4 className={styles.label}>{stat.label}</h4>
            <p className={styles.description}>{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
