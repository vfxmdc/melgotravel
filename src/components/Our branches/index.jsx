'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import styles from './style.module.scss';
import GradientBlinds from './GradientBlinds';

const branches = [
    {
        name: "MELGO Batna - باتنة",
        address: "5 طريق بسكرة باتنة ",
        phones: ["+213 39 728 441"],
        email: "mvotours@gmail.com",
        image: "/images/branchement/batna.png"
    },
    {
        name: "MELGO Algiers - الجزائر",
        address: "حي اول نوفمبر بابا حسن",
        phones: ["0540000030", "0770554542"],
        email: "melgo16@melgo.net",
        image: "/images/branchement/alger.png"
    },
    {
        name: "MELGO Blida - البليدة",
        address: "حي المدراس 4 زعبانة",
        phones: ["0541150013", "0657476963"],
        email: "melgo09@melgo.net",
        image: "/images/branchement/blida.png"
    },
    {
        name: "MELGO Sétif - سطيف",
        address: "CENTRE VILLE, Sétif",
        phones: ["0657852540"],
        email: "melgo19@melgo.net",
        image: "/images/branchement/setif.png"
    },
    {
        name: "MELGO Biskra - بسكرة",
        address: "شارع الحكيم سعدان حي المصلى ",
        phones: ["0551919959", "0773839919"],
        email: "melgo07@melgo.net",
        image: "/images/branchement/biskra.png"
    },
    {
        name: "MELGO Khenchela - خنشلة",
        address: "نهج حفطاوي احمد ,حي اول نوفمبر",
        phones: ["0783377198", "0661935925"],
        email: "melgo40@melgo.net",
        image: "/images/branchement/khenchela.png"
    },
    {
        name: "MELGO Ain Mlila - عين مليلة",
        address: "مقابل البريد المركزي",
        phones: ["0550929605", "0770805692"],
        email: "melgo04@melgo.net",
        image: "/images/branchement/ain mlila.png"
    },
    {
        name: "MELGO Tebessa - تبسة",
        address: "Zone d'activité, Tebessa",
        phones: ["0657852540"],
        email: "melgo12@melgo.net",
        image: "/images/branchement/tebessa.png"
    }
];


export default function OurBranches() {
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

    return (
        <section ref={ref} className={styles.branchesSection}>
            <div className={styles.backgroundContainer}>
                <GradientBlinds
                    gradientColors={['#ff0000', '#000000']}
                    angle={302}
                    noise={0}
                    blindCount={51}
                    blindMinWidth={35}
                    spotlightRadius={0.5}
                    spotlightSoftness={1}
                    spotlightOpacity={1}
                    mouseDampening={0.3}
                    distortAmount={0}
                    shineDirection="right"
                    mixBlendMode="lighten"
                />
            </div>

            <motion.div
                className={styles.header}
                variants={titleVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                <span className={styles.subtitle}>Our Network</span>
                <h2 className={styles.title}>our branches فروعنا</h2>
                <p className={styles.introText}>
                    نحن متواجدون في جميع أنحاء الجزائر لخدمتكم بشكل أفضل وأسرع تفضلوا بزيارة أقرب فرع لكم
                </p>
            </motion.div>

            <motion.div
                className={styles.grid}
                variants={gridVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                {branches.map((branch, i) => (
                    <motion.div key={i} className={styles.card} variants={cardVariants}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={branch.image}
                                alt={branch.name}
                                fill
                                className={styles.image}
                            />
                        </div>

                        <div className={styles.info}>
                            <h3 className={styles.name}>{branch.name}</h3>
                            <p className={styles.address}>{branch.address}</p>

                            <div className={styles.contactDetails}>
                                <div className={styles.phones}>
                                    {branch.phones.map((phone, idx) => (
                                        <div key={idx} className={styles.contactItem}>
                                            <span className={styles.icon}>📞</span>
                                            <span className={styles.value}>{phone}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.email}>
                                    <div className={styles.contactItem}>
                                        <span className={styles.icon}>✉️</span>
                                        <span className={styles.value}>{branch.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}


