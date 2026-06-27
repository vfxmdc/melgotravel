'use client';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './style.module.scss';
import DarkVeil from '../DarkVeil/DarkVeil';

const faqs = [
  {
    question: "كيف يمكنني حجز رحلة؟",
    answer: "عملية الحجز سهلة وميسرة. يمكنك البدء بتعبئة نموذج الاستفسار عبر موقعنا أو التواصل معنا عبر الواتساب. سيقوم فريقنا بمساعدتك في اختيار وتصميم رحلتك المثالية."
  },
  {
    question: "هل يمكنني تخصيص الباقات السياحية؟",
    answer: "بالتأكيد. جميع رحلاتنا يمكن تخصيصها بالكامل لتناسب احتياجاتكم. نحن نقدم مرونة عالية في اختيار الفنادق والمزارات السياحية والجولات الميدانية."
  },
  {
    question: "هل تتوفر خدمات للحج والعمرة؟",
    answer: "نعم، نقدم برامج متميزة للحج والعمرة مع إقامة مريحة في فنادق قريبة من الحرم المكي والمسجد النبوي، مع توفير كافة سبل الراحة والطمأنينة."
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقبل مجموعة واسعة من طرق الدفع الآمنة، بما في ذلك البطاقات الائتمانية، التحويلات البنكية، وبوابات الدفع الإلكترونية المعتمدة."
  },
  {
    question: "هل تقدمون دعمًا أثناء الرحلة؟",
    answer: "نعم، فريق Melgo Travel متاح لدعمكم ومتابعتكم طوال فترة الرحلة لضمان سير الأمور بسلاسة ومعالجة أي استفسارات أو احتياجات قد تطرأ."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const titleVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    <section ref={ref} className={styles.faqSection}>
      <DarkVeil
        hueShift={243}
        noiseIntensity={0}
        scanlineIntensity={0.93}
        speed={1.2}
        scanlineFrequency={1.5}
        warpAmount={0}
      />
      <div className={styles.container}>
        <motion.div 
          className={styles.sidebar}
          variants={titleVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <span className={styles.subtitle}>Help Center</span>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.description}>
            Have queries about planning your next holiday? Here are quick answers to our most popular inquiries.
          </p>
        </motion.div>

        <div className={styles.accordionContainer}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                onClick={() => toggleAccordion(idx)}
              >
                <div className={styles.questionRow}>
                  <h3 className={styles.question}>{faq.question}</h3>
                  <div className={styles.iconContainer}>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className={styles.arrowIcon}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                      className={styles.answerRow}
                    >
                      <p className={styles.answer}>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
