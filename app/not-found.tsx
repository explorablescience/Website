'use client'

import Header from './components/header/header'
import Button from './components/ui/buttons/button'
import styles from './error.module.css'
import { inter } from './fonts'
import HeaderAnimation from './components/header/header_animation'

export default function NotFound() {
    return <>
        <HeaderAnimation small />

        <Header>
            <div className={`${styles.content} ${inter.className}`}>
                <p>Oops! This page wasn&apos;t found.</p>
            </div>

            <div className={styles.buttons}>
                <Button content='Go Home' link='/' size='standard' />
            </div>
        </Header>
    </>
}