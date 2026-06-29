'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './GlassContent.module.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollSequenceB: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef({ frame: 0 });

  const frameCount = 69;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const render = () => {
      const frameIndex = Math.round(currentFrame.current.frame);
      let img = imagesRef.current[frameIndex];

      // Fallback search to find the closest loaded frame to prevent glitching/blank screen
      if (!img || !img.complete || !img.naturalWidth) {
        let found = false;
        // Search outwards from frameIndex to find any loaded frame
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
        if (!found) return; // Keep current screen or do nothing if absolute zero frames loaded
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
      // Limit DPR to 2 to improve performance on high-end / mobile Retina screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      render();
    };

    resizeCanvas();

    // 1. Immediately load frame 0 so the canvas has something to draw on mount
    const firstImg = new Image();
    const firstPadded = String(0).padStart(6, '0');
    firstImg.src = encodeURI(`/images/vid2frame/frame_${firstPadded}.webp`);
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
          img.src = encodeURI(`/images/vid2frame/frame_${padded}.webp`);
          img.onload = () => {
            imagesRef.current[i] = img;
            // Draw if this frame is currently active
            const activeFrame = Math.round(currentFrame.current.frame);
            if (activeFrame === i || (i === 0 && activeFrame === 0)) {
              render();
            }
            resolve();
          };
          img.onerror = () => {
            resolve(); // Don't block the queue on load error
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

    // 2. IntersectionObserver to trigger sequential & progressive downloading only when near the viewport
    let isObserverConnected = true;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Disconnect quickly to avoid duplicate invocations
        if (isObserverConnected) {
          isObserverConnected = false;
          observer.disconnect();
        }

        // Start progressive loading
        const skeletonIndices: number[] = [];
        const remainingIndices: number[] = [];

        // Distribute frames: Skeleton (every 3rd frame) and the rest
        for (let i = 1; i < frameCount; i++) {
          if (i % 3 === 0) {
            skeletonIndices.push(i);
          } else {
            remainingIndices.push(i);
          }
        }

        // Run skeleton loading (fast, max 4 concurrent requests)
        loadBatch(skeletonIndices, 4).then(() => {
          // Then run background fill-in loading (low overhead, max 2 concurrent requests)
          loadBatch(remainingIndices, 2);
        });
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '100% 0px 100% 0px', // Trigger when within 1 viewport height
    });

    observer.observe(container);

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

      // Scroll Float Effect
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
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      window.removeEventListener('resize', resizeCanvas);
      if (isObserverConnected) {
        observer.disconnect();
      }
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
        height: '800vh',
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
            <span className={styles.premiumBadge}>Partner</span>
            <h2 className={styles.title}>{splitText("Trusted Travel Partner")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              أفضل العروض والأسعار لحجز تذاكر الطيران وتنظيم رحلات سياحية مميزة
            </p>
          </div>

          {/* Card 2: Mid Left */}
          <div
            ref={el => { contentRefs.current[1] = el; }}
            className={`${styles.contentCard} ${styles.midLeft}`}
          >
            <span className={styles.premiumBadge}>Cruises</span>
            <h2 className={styles.title}>{splitText("Discover The Sea")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              نوفر لكم أفضل رحلات الكروز وخدمات النقل البحري نحو أجمل الوجهات، مع تجربة سفر راقية تجمع بين الراحة والفخامة
            </p>
          </div>

          {/* Card 3: Bottom Right */}
          <div
            ref={el => { contentRefs.current[2] = el; }}
            className={`${styles.contentCard} ${styles.bottomRight}`}
          >
            <span className={styles.premiumBadge}>Comfort</span>
            <h2 className={styles.title}>{splitText("Luxury Hotels")}</h2>
            <p className={`${styles.text} ${styles.shinyText}`}>
              نقدم لكم أفضل العروض الفندقية المختارة بعناية لتوفير الراحة والجودة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollSequenceB;