'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import styles from './style.module.scss';
import Rounded from '../../common/RoundedButton';
import DotField from './DotField';

const destinations = [
  {
    name: "Algeria",
    country: "Algeria",
    description: "اكتشف جمال الجزائر من الصحراء الكبرى إلى السواحل المتوسطية، مع مواقع تاريخية وطبيعة متنوعة وتجارب سياحية فريدة.",
    price: "",
    image: "/images/destiny/Algiers.jfif"
  },
  {
    name: "Sousse & Hammamet",
    country: "Tunisia",
    description: "استمتع بأجمل الشواطئ المتوسطية والمنتجعات الفاخرة والأجواء التونسية الأصيلة المناسبة لجميع أفراد العائلة.",
    price: "",
    image: "/images/destiny/Tunis.jfif"
  },
  {
    name: "Makkah & Madinah",
    country: "Saudi Arabia",
    description: "رحلات مميزة إلى مكة المكرمة والمدينة المنورة مع أفضل خدمات الإقامة والتنقل لتجربة روحانية متكاملة.",
    price: "",
    image: "/images/destiny/makkah.jfif"
  },

  // Middle East

  {
    name: "Dubai",
    country: "United Arab Emirates",
    description: "اكتشف دبي بما تضمه من معالم عالمية، مراكز تسوق فاخرة، وتجارب ترفيهية تناسب جميع الأذواق.",
    price: "",
    image: "/images/destiny/dubai.jfif"
  },

  // Africa

  {
    name: "Cairo & Sharm El Sheikh",
    country: "Egypt",
    description: "اجمع بين عراقة الحضارة المصرية وروعة المنتجعات الساحلية والشواطئ الخلابة على البحر الأحمر.",
    price: "",
    image: "/images/destiny/egypt.jfif"
  },
  {
    name: "Zanzibar",
    country: "Tanzania",
    description: "وجهة استوائية ساحرة تتميز بالمياه الفيروزية والشواطئ البيضاء والأجواء الهادئة المثالية للاسترخاء.",
    price: "",
    image: "/images/destiny/zanzi.jfif"
  },

  // Europe

  {
    name: "Istanbul",
    country: "Turkey",
    description: "استمتع بسحر إسطنبول حيث يلتقي التاريخ العريق بالحياة العصرية والأسواق التقليدية الشهيرة.",
    price: "",
    image: "/images/destiny/ista.jfif"
  },
  {
    name: "Moscow & Saint Petersburg",
    country: "Russia",
    description: "اكتشف روعة المدن الروسية التاريخية ومعالمها الثقافية الفريدة وهندستها المعمارية المبهرة.",
    price: "",
    image: "/images/destiny/moscow.jfif"
  },
  {
    name: "Rome & Venice",
    country: "Italy",
    description: "استمتع بأجواء إيطاليا الساحرة بين التاريخ العريق والفنون الراقية والمأكولات العالمية الشهيرة.",
    price: "",
    image: "/images/destiny/ita.jfif"
  },

  // Asia

  {
    name: "Bali",
    country: "Indonesia",
    description: "جنة استوائية تجمع بين الشواطئ الخلابة والطبيعة الساحرة والثقافة المحلية الغنية.",
    price: "",
    image: "/images/destiny/bali.jfif"
  },
  {
    name: "Kuala Lumpur & Langkawi",
    country: "Malaysia",
    description: "استكشف ماليزيا بين المدن الحديثة والجزر الاستوائية والطبيعة المذهلة والتجارب المتنوعة.",
    price: "",
    image: "/images/destiny/mala.jfif"
  },
  {
    name: "Hanoi & Ha Long Bay",
    country: "Vietnam",
    description: "اكتشف سحر فيتنام من المدن التاريخية إلى المناظر الطبيعية الخلابة والخليج الشهير عالمياً.",
    price: "",
    image: "/images/destiny/vietnam.jfif"
  }
];


export default function PopularDestinations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const titleVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const gridVariants = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.1 }
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

  const scrollToPackages = () => {
    const el = document.getElementById('travel-packages');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={ref} className={styles.destinationsSection}>
      <div className={styles.backgroundContainer}>
        <DotField
          dotRadius={1.2}
          dotSpacing={22}
          cursorRadius={400}
          bulgeStrength={50}
          glowRadius={300}
          gradientFrom="rgba(239, 68, 68, 0.5)"
          gradientTo="rgba(239, 68, 68, 0.1)"
          glowColor="rgba(239, 68, 68, 0.15)"
        />
      </div>

      <motion.div
        className={styles.header}
        variants={titleVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <span className={styles.subtitle}>Featured Hotels</span>
        <h2 className={styles.title}>Our Destinations</h2>
        <p className={styles.introText}>
          فنادق ومنتجعات مختارة بعناية في أفضل الوجهات السياحية لضمان تجربة إقامة مميزة ومريحة.
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={gridVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {destinations.map((dest, i) => (
          <motion.div key={i} className={styles.card} variants={cardVariants}>
            <div className={styles.imageWrapper}>
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className={styles.image}
              />
            </div>

            <div className={styles.info}>
              <span className={styles.country}>{dest.country}</span>
              <h3 className={styles.name}>{dest.name}</h3>
              <p className={styles.description}>{dest.description}</p>

              <div className={styles.footer}>
                <Rounded
                  className={styles.exploreBtn}
                  backgroundColor="#ef4444"
                  onClick={scrollToPackages}
                >
                  <p>Explore</p>
                </Rounded>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}