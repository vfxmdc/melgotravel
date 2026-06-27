'use client';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import styles from './style.module.scss';
import Image from 'next/image';

const slider1 = [
    { src: "images (1).png" },
    { src: "images (2).png" },
    { src: "images (3).png" },
    { src: "images (4).png" },
    { src: "images (5).png" },
    { src: "images (6).png" },
    { src: "images (7).png" },
    { src: "images (8).png" },
    { src: "images (9).png" }
];

const slider2 = [
    { src: "images (10).png" },
    { src: "images (11).png" },
    { src: "images (12).png" },
    { src: "images (13).png" },
    { src: "images (14).png" },
    { src: "images (15).png" },
    { src: "images.jfif" },
    { src: "images.png" }
];

export default function SlidingImages() {
    const firstRowPart1 = useRef(null);
    const firstRowPart2 = useRef(null);
    const secondRowPart1 = useRef(null);
    const secondRowPart2 = useRef(null);
    
    const xPercent = useRef(0);
    const direction = useRef(-1);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Scroll influence
        gsap.to({}, {
            scrollTrigger: {
                trigger: document.documentElement,
                scrub: 0.25,
                start: 0,
                end: window.innerHeight,
                onUpdate: (e) => {
                    direction.current = e.direction * -1;
                }
            }
        });

        const animate = () => {
            if (xPercent.current < -100) {
                xPercent.current = 0;
            } else if (xPercent.current > 0) {
                xPercent.current = -100;
            }

            // Move first slider in one direction
            gsap.set(firstRowPart1.current, { xPercent: xPercent.current });
            gsap.set(firstRowPart2.current, { xPercent: xPercent.current });

            // Move second slider in opposite direction (optional, but looks better for logo strips)
            gsap.set(secondRowPart1.current, { xPercent: -xPercent.current - 100 });
            gsap.set(secondRowPart2.current, { xPercent: -xPercent.current - 100 });

            xPercent.current += 0.03 * direction.current;
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, []);

    const renderImages = (images) => (
        images.map((img, i) => (
            <div key={`img-${i}`} className={styles.project}>
                <div className={styles.imageContainer}>
                    <Image
                        fill={true}
                        alt={"logo"}
                        src={`/images/slider/${img.src}`}
                    />
                </div>
            </div>
        ))
    );

    return (
        <div className={styles.slidingImages}>
            <div className={styles.sliderContainer}>
                <div className={styles.slider}>
                    <div ref={firstRowPart1} className={styles.row}>
                        {renderImages(slider1)}
                    </div>
                    <div ref={firstRowPart2} className={styles.row}>
                        {renderImages(slider1)}
                    </div>
                </div>
            </div>

            <div className={styles.sliderContainer}>
                <div className={styles.slider}>
                    <div ref={secondRowPart1} className={styles.row}>
                        {renderImages(slider2)}
                    </div>
                    <div ref={secondRowPart2} className={styles.row}>
                        {renderImages(slider2)}
                    </div>
                </div>
            </div>
        </div>
    );
}


