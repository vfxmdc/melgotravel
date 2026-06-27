import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, opacity } from './animation';
import Rounded from '../../common/RoundedButton';
import GradientBlinds from './GradientBlinds';

export default function index() {

    const phrase = "Explore The World With Melgo Travel. Your Journey Starts Here.";
    const description = useRef(null);
    const isInView = useInView(description)
    return (
        <div ref={description} className={styles.description}>
            <div className={styles.backgroundContainer}>
                <GradientBlinds
                    gradientColors={['#ff0000', '#000000']}
                    angle={302}
                    noise={0}
                    blindCount={51}
                    blindMinWidth={35}
                    spotlightRadius={0.5}
                    spotlightSoftness={1}
                    spotlightOpacity={1}
                    mouseDampening={0.3}
                    distortAmount={0}
                    shineDirection="right"
                    mixBlendMode="lighten"
                />
            </div>
            <div className={styles.body}>
                <p>
                    {
                        phrase.split(" ").map((word, index) => {
                            return <span key={index} className={styles.mask}><motion.span variants={slideUp} custom={index} animate={isInView ? "open" : "closed"} key={index}>{word}</motion.span></span>
                        })
                    }
                </p>
                <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>في وكالتنا نؤمن أن السفر ليس مجرد انتقال من مكان إلى آخر، بل هو تجربة تصنع أجمل الذكريات. نقدم لكم أفضل العروض السياحية والفندقية المختارة بعناية لتوفير الراحة، الجودة، والأسعار المناسبة لعملائنا.</motion.p>
                <div data-scroll data-scroll-speed={0.1}>
                    <Rounded className={styles.button}>
                        <p>Explore More</p>
                    </Rounded>
                </div>
            </div>
        </div>
    )
}
