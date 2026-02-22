import Link from 'next/link'
import Image from 'next/image'
import styles from './navbar.module.css'

export default function Navbar({small}: { small?: boolean }) {
    return <>
        <nav className={styles.nav}>
            <div className={styles.navbar}>
                <div className={styles.logo}>
                    <Link href="/">
                        <Image src='/imgs/logo.png' alt="ExplorableScience logo" height={50} width={50} priority />
                    </Link>
                    <Link href="/" className={styles.explorablescience}>
                        <p>ExplorableScience</p>
                    </Link>
                </div>

                <div className={styles.links}>
                    <Link href="/articles">
                        <p>Articles</p>
                    </Link>
                    <Link href="/simulations">
                        <p>Simulations</p>
                    </Link>
                    <Link href="https://mdherbecourt.dev" target="_blank" rel="noopener noreferrer">
                        <p>About Me</p>
                    </Link>
                </div>
            </div>

            <div className={`${styles.navbarBackground} ${small ? styles.navbarBackgroundSmall : ''}`}>
            </div>
        </nav>
    </>
}