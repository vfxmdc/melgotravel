import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Menu.css";

const clipPath = {
    init: "inset(0% 0% 0% 0%)",
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
};

export default function Menu() {
    const [buttonText, setButtonText] = useState("Menu");

    // References for elements we want to animate
    const menuRef = useRef(null);
    const navRef = useRef(null);
    const buttonRef = useRef(null);
    const pagesRef = useRef([]);
    const infoRef = useRef([]);
    const titleRef = useRef([]);
    const mediaRef = useRef(null);
    const tlMenuRef = useRef(null);
    const isEnabledRef = useRef(false);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Initial State Setup
        gsap.set(menuRef.current, { pointerEvents: "none", clipPath: clipPath.bottom });
        gsap.set(pagesRef.current, { yPercent: 200, autoAlpha: 0 });
        gsap.set(infoRef.current, { yPercent: 100, autoAlpha: 0 });
        gsap.set(titleRef.current, { yPercent: 100, rotateY: 20, scale: 0.2 });
        gsap.set(mediaRef.current, { clipPath: clipPath.top });
        gsap.set(navRef.current, { scale: 1 });

        // Inner Menu Items Timeline
        const tl = gsap.timeline({
            paused: true,
            defaults: { duration: 1.2, ease: "expo.inOut" },
        });

        tl.to(pagesRef.current, { yPercent: 0, autoAlpha: 1, stagger: 0.032 }, 0.2)
            .to(infoRef.current, { yPercent: 0, autoAlpha: 1, stagger: 0.032 }, 0.2)
            .to(titleRef.current, { yPercent: 0, rotateY: 0, scale: 1, stagger: 0.032 }, 0)
            .to(mediaRef.current, { clipPath: clipPath.init }, 0);

        tlMenuRef.current = tl;

        return () => {
            tl.kill();
        };
    }, []);

    const toggleMenu = () => {
        const isEnabled = isEnabledRef.current;

        if (!isEnabled) {
            // Open Menu
            gsap.to(menuRef.current, {
                duration: 1,
                pointerEvents: "auto",
                clipPath: clipPath.init,
                ease: "expo.inOut",
            });

            animateButton("Close");
            tlMenuRef.current?.play();
        } else {
            // Close Menu
            gsap.to(menuRef.current, {
                duration: 0.8,
                clipPath: clipPath.top,
                ease: "expo.inOut",
                onComplete: () => {
                    gsap.set(menuRef.current, {
                        pointerEvents: "none",
                        clipPath: clipPath.bottom,
                    });
                },
            });

            animateButton("Menu");
            tlMenuRef.current?.reverse();
        }

        isEnabledRef.current = !isEnabled;
    };

    const animateButton = (text) => {
        gsap.timeline()
            .to(buttonRef.current, {
                duration: 0.4,
                autoAlpha: 0,
                x: 20,
                onComplete: () => setButtonText(text),
            })
            .to(buttonRef.current, {
                duration: 0.4,
                autoAlpha: 1,
                x: 0,
            });
    };

    const handlePageClick = (page) => {
        // Close menu first
        if (isEnabledRef.current) {
            toggleMenu();
        }

        // Dispatch custom event for page navigation
        if (page === "Book Your Trip") {
            window.location.href = "/book";
            return;
        }

        const pageMap = {
            "Home": "home",
            "Services": "services",
            "About": "about",
        };

        const target = pageMap[page];
        if (target) {
            // Dispatch custom event that page.js listens to
            window.dispatchEvent(new CustomEvent('melgo-navigate', { detail: { page: target } }));
        }
    };

    return (
        <>
            {/* Absolute positioned Navigation Wrapper */}
            <div className="nav" ref={navRef}>
                <div className="nav_menu_button" ref={buttonRef} onClick={toggleMenu}>
                    <div className="nav_menu_button_text">
                        <span>{buttonText}</span>
                    </div>
                    <div className="nav_menu_button_circle"></div>
                </div>
            </div>

            {/* Hidden Fullscreen Menu Reveal */}
            <div className="menu" ref={menuRef}>
                <div className="menu_wrapper">
                    <div className="menu_row1">
                        <div className="menu_row">
                            <div className="menu_row_pages">
                                {["Home", "Services", "About", "Book Your Trip"].map((page, i) => (
                                    <a
                                        href="#"
                                        className="menu_link_h2"
                                        key={page}
                                        ref={(el) => (pagesRef.current[i] = el)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageClick(page);
                                        }}
                                    >
                                        {page}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="menu_row_info">
                            <div className="menu_row_info_location">
                                {["MelGo Travel", "  05 Route de biskra, Batna, Algeria"].map(
                                    (text, i) => (
                                        <span key={i} ref={(el) => (infoRef.current[i] = el)}>
                                            {text}
                                        </span>
                                    )
                                )}
                            </div>

                            <div className="menu_row_info_social">
                                {["Instagram", "Linkedin", "Facebook", "Twitter"].map(
                                    (social, i) => (
                                        <a href="#" className="menu_link_span" key={social} ref={(el) => (infoRef.current[i + 4] = el)}>
                                            {social}
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="menu_row">
                        <div className="menu_row_media" ref={mediaRef}>
                            <video
                                src="/images/Airplane_flying_through_clouds_202606162032.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="menu_row_title">
                            {["M", "E", "L", "G", "O"].map((letter, i) => (
                                <h1 key={i} ref={(el) => (titleRef.current[i] = el)}>
                                    {letter}
                                </h1>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
