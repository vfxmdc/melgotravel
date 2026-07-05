'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './PillNav.css';

const PillNav = ({
  logo = '/logo.png',
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor = 'rgba(255,255,255,0.7)',
  pillColor = '#ef4444',
  hoveredPillTextColor = '#ffffff',
  pillTextColor,
  onNavigate,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null); // Ref for navigation bar container

  // Reset hovered styles for all items when activeHref triggers
  useEffect(() => {
    items.forEach((item, i) => {
      const tl = tlRefs.current[i];
      if (!tl) return;
      activeTweenRefs.current[i]?.kill();
      tl.progress(0);
    });
  }, [activeHref, items]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        
        // Prevent layout calculation if element is hidden/not ready
        if (w === 0 || h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => { });
    }

    // Set layout measurement points to handle settling after compilation and imports
    const t1 = setTimeout(layout, 150);
    const t2 = setTimeout(layout, 600);
    const t3 = setTimeout(layout, 1500);

    if (initialLoadAnimation) {
      const navEl = navRef.current;
      if (navEl) {
        gsap.set(navEl, { y: -30, opacity: 0, scale: 0.95 });
        gsap.to(navEl, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 1.2,
          ease: 'power3.out'
        });
      }
    }

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = i => {
    // Skip hover animation on the active pill
    if (items[i] && items[i].href === activeHref) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    // Skip hover animation on the active pill
    if (items[i] && items[i].href === activeHref) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleClick = (e, item) => {
    if (item.href.startsWith('/')) {
      // Allow default browser routing for paths starting with '/'
      return;
    }
    e.preventDefault();
    if (onNavigate) {
      onNavigate(item.href);
    }
  };

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor
  };

  return (
    <div className="pill-nav-container">
      <nav ref={navRef} className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        <a
          className="pill-logo"
          href="#"
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          onClick={(e) => handleClick(e, { href: 'home' })}
          ref={el => { logoRef.current = el; }}
        >
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </a>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                <a
                  role="menuitem"
                  href={item.href.startsWith('/') ? item.href : '#'}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  onClick={(e) => handleClick(e, item)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default PillNav;
