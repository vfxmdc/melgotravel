'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './GlassContent.module.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollSequenceA: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef({ frame: 0 });

  const frameCount = 101;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const stickyEl = stickyRef.current;

    if (!canvas || !container || !stickyEl) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const render = () => {
      const frameIndex = Math.round(currentFrame.current.frame);
      let img = imagesRef.current[frameIndex];

      if (!img || !img.complete || !img.naturalWidth) {
        let found = false;
        for (let dist = 1; dist < frameCount; dist++) {
          const prevIdx = frameIndex - dist;
          const nextIdx = frameIndex + dist;

          if (
            prevIdx >= 0 &&
            imagesRef.current[prevIdx] &&
            imagesRef.current[prevIdx].complete &&
            imagesRef.current[prevIdx].naturalWidth
          ) {
            img = imagesRef.current[prevIdx];
            found = true;
            break;
          }
          if (
            nextIdx < frameCount &&
            imagesRef.current[nextIdx] &&
            imagesRef.current[nextIdx].complete &&
            imagesRef.current[nextIdx].naturalWidth
          ) {
            img = imagesRef.current[nextIdx];
            found = true;
            break;
          }
        }
        if (!found) return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      render();
    };

    resizeCanvas();

    // 1. Immediately load frame 0
    const firstImg = new Image();
    const firstPadded = String(0).padStart(6, '0');
    firstImg.src = encodeURI(`/images/vid3frames/frame_${firstPadded}.webp`);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      render();
    };

    // Helper to load a batch of image indexes with a concurrency limit
    const loadBatch = async (indices: number[], concurrencyLimit = 4) => {
      let index = 0;
      const loadNext = async (): Promise<void> => {
        if (index >= indices.length) return;
        const i = indices[index++];

        await new Promise<void>((resolve) => {
          const img = new Image();
          const padded = String(i).padStart(6, '0');
          img.src = encodeURI(`/images/vid3frames/frame_${padded}.webp`);
          img.onload = () => {
            imagesRef.current[i] = img;
            const activeFrame = Math.round(currentFrame.current.frame);
            if (activeFrame === i || (i === 0 && activeFrame === 0)) {
              render();
            }
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
        });

        return loadNext();
      };

      const workers = Array.from(
        { length: Math.min(concurrencyLimit, indices.length) },
        loadNext
      );
      await Promise.all(workers);
    };

    // 2. Start progressive loading immediately
    const skeletonIndices: number[] = [];
    const remainingIndices: number[] = [];

    for (let i = 1; i < frameCount; i++) {
      if (i % 3 === 0) {
        skeletonIndices.push(i);
      } else {
        remainingIndices.push(i);
      }
    }

    loadBatch(skeletonIndices, 4).then(() => {
      loadBatch(remainingIndices, 2);
    });

    window.addEventListener('resize', resizeCanvas);

    // Use ScrollTrigger pin instead of CSS sticky - works with Lenis
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyEl,
      pinSpacing: false,
    });

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

      const totalUnits = contentRefs.current.length + 0.2;
      const startPos = (index + 0.1) * (1 / totalUnits);
      const endPos = (index + 0.9) * (1 / totalUnits);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: `${startPos * 100}% top`,
          end: `${(startPos + 0.08) * 100}% top`,
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(
        el,
        { opacity: 0, x: index % 2 === 0 ? 50 : -50 },
        { opacity: 1, x: 0 }
      );

      const words = el.querySelectorAll('.word');
      tl.fromTo(
        words,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        '<'
      );

      gsap.to(el, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: container,
          start: `${(endPos - 0.08) * 100}% top`,
          end: `${endPos * 100}% top`,
          scrub: 1,
        },
      });
    });

    return () => {
      pinTrigger.kill();
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
        height: typeof window !== 'undefined' && window.innerWidth <= 768 ? '400vh' : '800vh',
        zIndex: 1,
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'relative',
          width: '100%',
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
            <span className={styles.premiumBadge}>Discovery</span>
            <h2 className={styles.title}>{splitText("The Beauty of Tunisia")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              اكتشف سحر تونس بشواطئها الذهبية ومنتجعاتها الفاخرة وأجوائها المتوسطية الرائعة
            </p>
          </div>

          {/* Card 2: Mid Left */}
          <div
            ref={el => { contentRefs.current[1] = el; }}
            className={`${styles.contentCard} ${styles.midLeft}`}
          >
            <span className={styles.premiumBadge}>Magic</span>
            <h2 className={styles.title}>{splitText("Experience Egypt")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              استكشف حضارة تمتد لآلاف السنين، من الأهرامات العظيمة إلى شواطئ البحر الأحمر الساحرة
            </p>
          </div>

          {/* Card 3: Bottom Right */}
          <div
            ref={el => { contentRefs.current[2] = el; }}
            className={`${styles.contentCard} ${styles.bottomRight}`}
          >
            <span className={styles.premiumBadge}>Istanbul</span>
            <h2 className={styles.title}>{splitText("Discover Istanbul")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              استمتع بسحر إسطنبول حيث يلتقي الشرق بالغرب، واكتشف المعالم التاريخية والأسواق الشهيرة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollSequenceA;