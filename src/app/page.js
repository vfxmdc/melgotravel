'use client';

import styles from './page.module.scss';
import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import dynamic from 'next/dynamic';
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import PillNav from '../components/PillNav/PillNav';
import PageTransition from '../components/PageTransition';

// Lazy load components for better performance
const ScrollSequence = dynamic(() => import('@/components/ScrollSequence'), { ssr: false });
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

const navItems = [
  { label: 'Home', href: 'home' },
  { label: 'Services', href: 'services' },
  { label: 'Booking', href: '/book' },
  { label: 'About', href: 'about' },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);

  useEffect(() => {
    document.body.classList.add('loading-screen-active');
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

      // Store lenis on window so we can reset scroll position on page change
      window.__lenis = lenis;

      setTimeout(() => {
        setIsLoading(false);
        document.body.classList.remove('loading-screen-active');
        document.body.style.cursor = 'default';
        window.scrollTo(0, 0);
      }, 1100);
    })();
  }, []);

  const handleNavigate = useCallback((page) => {
    if (page === activePage || isTransitioning) return;

    setTransitionTarget(page);
    setIsTransitioning(true);

    // Scroll to top first, then swap content after scroll completes
    // This prevents the user from seeing the bottom of the new page
    setTimeout(() => {
      // Reset scroll position BEFORE rendering new content
      window.scrollTo(0, 0);
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
      // Use requestAnimationFrame to ensure scroll reset is painted before content swap
      requestAnimationFrame(() => {
        setActivePage(page);
      });
    }, 500);
  }, [activePage, isTransitioning]);

  // Listen for navigation events from the Menu component
  useEffect(() => {
    const handler = (e) => {
      const page = e.detail?.page;
      if (page) {
        handleNavigate(page);
      }
    };
    window.addEventListener('melgo-navigate', handler);
    return () => window.removeEventListener('melgo-navigate', handler);
  }, [handleNavigate]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setTransitionTarget(null);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Landing />
            <ScrollSequence />
            <Description />
            <OurBranches />
            <PopularDestinations />
            <Contact />
          </>
        );
      case 'services':
        return (
          <>
            <ScrollSequenceB />
            <WhyChooseUs />
            <TravelPackages />
            <Projects />
            <TravelProcess />
            <ScrollSequenceA />
            <Contact />
          </>
        );
      case 'about':
        return (
          <>
            <TravelStats />
            <Testimonials />
            <FAQ />
            <CTABanner />
            <Newsletter />
            <SlidingImages />
            <Contact />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main className={styles.main}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isTransitioning && (
          <PageTransition
            key={transitionTarget}
            targetPage={transitionTarget}
            onComplete={handleTransitionComplete}
          />
        )}
      </AnimatePresence>

      <PillNav
        logo="/images/favicon.ico"
        logoAlt="Melgo Travel"
        items={navItems}
        activeHref={activePage}
        onNavigate={handleNavigate}
        ease="power3.easeOut"
        baseColor="rgba(255,255,255,0.7)"
        pillColor="#ef4444"
        hoveredPillTextColor="#ffffff"
        initialLoadAnimation={true}
      />

      {renderPage()}
    </main>
  );
}