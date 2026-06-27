'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './GlassContent.module.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef({ frame: 0 });

  const frameCount = 71;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const render = () => {
      const img =
        imagesRef.current[Math.round(currentFrame.current.frame)];

      if (!img) return;
      if (!img.complete) return;
      if (!img.naturalWidth) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShiftX =
        (canvas.width - img.width * ratio) / 2;

      const centerShiftY =
        (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      render();
    };

    resizeCanvas();

    let loaded = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();

      const padded = String(i).padStart(6, '0');

      img.src = encodeURI(`/images/vid1frames/frame_${padded}.webp`);

      img.onload = () => {
        loaded++;
        imagesRef.current[i] = img;
        if (i === 0) {
          render();
        }
      };
    }

    window.addEventListener('resize', resizeCanvas);

    const tween = gsap.to(currentFrame.current, {
      frame: frameCount - 1,
      ease: 'none',
      snap: 'frame',

      onUpdate: render,

      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Content Animations
    contentRefs.current.forEach((el, index) => {
      if (!el) return;

      // Calculate more generous positions to make cards last longer
      const totalUnits = contentRefs.current.length + 0.2;
      const startPos = (index + 0.1) * (1 / totalUnits);
      const endPos = (index + 0.9) * (1 / totalUnits);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: `${startPos * 100}% top`,
          end: `${(startPos + 0.08) * 100}% top`,
          scrub: 1,
          toggleActions: "play reverse play reverse"
        }
      });

      tl.fromTo(el,
        { opacity: 0, x: index % 2 === 0 ? 50 : -50 },
        { opacity: 1, x: 0 }
      );

      // Scroll Float Effect for Title Words
      const words = el.querySelectorAll('.word');
      tl.fromTo(words,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        "<"
      );

      gsap.to(el, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: container,
          start: `${(endPos - 0.08) * 100}% top`,
          end: `${endPos * 100}% top`,
          scrub: 1,
        }
      });
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const splitText = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.25em' }}>
        {word}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '1000vh',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />

        <div className={styles.overlay}>
          {/* Card 1: Top Right */}
          <div
            ref={el => { contentRefs.current[0] = el; }}
            className={`${styles.contentCard} ${styles.topRight}`}
          >
            <span className={styles.premiumBadge}>Premium</span>
            <h2 className={styles.title}>{splitText("Spiritual Journey")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              استمتع برحلة إيمانية مميزة إلى الأراضي المقدسة مع إقامة مريحة وخدمات عالية الجودة
            </p>
          </div>

          {/* Card 2: Mid Left */}
          <div
            ref={el => { contentRefs.current[1] = el; }}
            className={`${styles.contentCard} ${styles.midLeft}`}
          >
            <span className={styles.premiumBadge}>Makkah</span>
            <h2 className={styles.title}>{splitText("Omrah & Hadj")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              انطلق في رحلة إيمانية لا تُنسى إلى مكة المكرمة، وأدِّ مناسك العمرة والحج بكل راحة وطمأنينة مع إقامة مميزة وخدمات متكاملة
            </p>
          </div>

          {/* Card 3: Bottom Right */}
          <div
            ref={el => { contentRefs.current[2] = el; }}
            className={`${styles.contentCard} ${styles.bottomRight}`}
          >
            <span className={styles.premiumBadge}>Holy Destination</span>
            <h2 className={styles.title}>{splitText("The Light of Madinah")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              عِش لحظات من السكينة والروحانية في المدينة المنورة، وزُر المسجد النبوي الشريف واستمتع بإقامة راقية وخدمات متكاملة طوال رحلتك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ScrollSequence;