'use client'
import styles from './style.module.scss'
import { useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { slideUp } from './animation';
import { motion } from 'framer-motion';
import Rounded from '../../common/RoundedButton';

export default function Home() {
  const router = useRouter();

  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);

  const xPercent = useRef(0);
  const direction = useRef(-1);
  const animationFrame = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => {
          direction.current = e.direction * -1;
        }
      },
      x: "-500px",
    });

    const animate = () => {
      if (xPercent.current < -100) {
        xPercent.current = 0;
      } else if (xPercent.current > 0) {
        xPercent.current = -100;
      }

      gsap.set(firstText.current, { xPercent: xPercent.current });
      gsap.set(secondText.current, { xPercent: xPercent.current });

      xPercent.current += 0.1 * direction.current;

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <motion.main
      variants={slideUp}
      initial="initial"
      animate="enter"
      className={styles.landing}
    >
      <video
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/images/herovid.mp4" type="video/mp4" />
      </video>

      <div className={styles.sliderContainer}>
        <div ref={slider} className={styles.slider}>
          <p ref={firstText}> MELGO - TRAVEL AGENCY     </p>
          <p ref={secondText}> MELGO - TRAVEL AGENCY     </p>
        </div>
      </div>

      <div
        data-scroll
        data-scroll-speed={0.1}
        className={styles.description}
      >
        <div className={styles.ctaContainer}>
          <Rounded
            className={styles.secondaryBtn}
            backgroundColor="#ef4444"
            onClick={() => {
              router.push('/book');
            }}
          >
            <p className={styles.darkText}>Book Your Trip</p>
          </Rounded>

          <Rounded
            className={styles.primaryBtn}
            backgroundColor="#ef4444"
            onClick={() => {
              document.getElementById('travel-packages')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p>See my trips</p>
          </Rounded>
        </div>
      </div>
    </motion.main>
  );
}