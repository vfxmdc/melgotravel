'use client';
import { usePathname, useRouter } from 'next/navigation';
import Magnetic from '../../common/Magnetic';
import Menu from '../Menu/Menu';
import styles from './style.module.scss';

export default function index() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className={styles.header}>
            <Magnetic>
                <div onClick={() => router.push('/')} className={styles.logo}>
                    <p className={styles.copyright}>©</p>
                    <div className={styles.name}>
                        <p className={styles.brand}>Melgo</p>
                        <p className={styles.category}>Travel</p>
                    </div>
                </div>
            </Magnetic>
            <Menu />
        </div>
    )
}
