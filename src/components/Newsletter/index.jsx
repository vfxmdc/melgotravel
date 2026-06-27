'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';
import Rounded from '../../common/RoundedButton';
import DarkVeil from '../DarkVeil/DarkVeil';

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setSubscribed(true);
      setEmail("");
    }
  };

  const titleVariants = {
    initial: { y: 45, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    <section ref={ref} className={styles.newsletterSection}>
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
          className={styles.content}
          variants={titleVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <span className={styles.subtitle}>Newsletter</span>
          <h2 className={styles.title}>Ready For Your Next Adventure?</h2>
          <p className={styles.description}>
            دع فريق Melgo Travel يساعدك في التخطيط لرحلتك القادمة بكل سهولة وراحة. تواصل معنا الآن واحصل على أفضل العروض.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.hiddenSubmit} />
              </div>
              <Rounded 
                className={styles.subscribeBtn} 
                backgroundColor="#ef4444" 
                onClick={handleSubmit}
              >
                <p>Subscribe</p>
              </Rounded>
            </form>
          ) : (
            <motion.div 
              className={styles.successMessage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className={styles.successIcon}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Thank you! You have successfully subscribed to our newsletter.</span>
            </motion.div>
          )}

          <p className={styles.privacyNote}>
            We value your privacy. Unsubscribe at any time. View our <a href="#" className={styles.link}>Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
