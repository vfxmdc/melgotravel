'use client';

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import dynamic from 'next/dynamic';
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import ScrollSequence from '@/components/ScrollSequence';

// Lazy load below-the-fold components for better performance
const Description = dynamic(() => import('../components/Description'), { ssr: false });
const OurBranches = dynamic(() => import('../components/Our branches'), { ssr: false });
const PopularDestinations = dynamic(() => import('../components/PopularDestinations'), { ssr: false });
const ScrollSequenceB = dynamic(() => import('@/components/ScrollSequenceB'), { ssr: false });
const WhyChooseUs = dynamic(() => import('../components/WhyChooseUs'), { ssr: false });
const TravelPackages = dynamic(() => import('../components/TravelPackages'), { ssr: false });
const Projects = dynamic(() => import('../components/Projects'), { ssr: false });
const TravelProcess = dynamic(() => import('../components/TravelProcess'), { ssr: false });
const ScrollSequenceA = dynamic(() => import('@/components/ScrollSequenceA'), { ssr: false });
const TravelStats = dynamic(() => import('../components/TravelStats'), { ssr: false });
const Testimonials = dynamic(() => import('../components/Testimonials'), { ssr: false });
const FAQ = dynamic(() => import('../components/FAQ'), { ssr: false });
const CTABanner = dynamic(() => import('../components/CTABanner'), { ssr: false });
const Newsletter = dynamic(() => import('../components/Newsletter'), { ssr: false });
const SlidingImages = dynamic(() => import('../components/SlidingImages'), { ssr: false });
const Contact = dynamic(() => import('../components/Contact'), { ssr: false });

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const Lenis = (await import('lenis')).default;
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = 'default';
        window.scrollTo(0, 0);
      }, 1000);
    })();
  }, []);

  return (
    <main className={styles.main}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      <Landing />

      <ScrollSequence />

      <Description />
      <OurBranches />
      <PopularDestinations />

      <ScrollSequenceB />


      <WhyChooseUs />
      <TravelPackages />
      <Projects />
      <TravelProcess />

      <ScrollSequenceA />

      <TravelStats />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Newsletter />
      <SlidingImages />
      <Contact />
    </main>
  );
}