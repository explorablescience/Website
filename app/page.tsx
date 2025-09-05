'use client'

import Header from './components/header/header'
import HeaderAnimation from './components/header/header_animation'
import Button from './components/ui/buttons/button'
import styles from './page.module.css'

export default function Home() {
    return <>
        <HeaderAnimation />

        <Header showScrollButton>
            <div className={styles.buttons}>
                <Button content='Articles' action={() => {
                    window.scrollTo({
                        top: document.getElementById('articles')?.offsetTop, behavior: 'smooth'
                    })
                }} size='standard' />
                <Button content='Simulations' action={() => {
                    window.scrollTo({
                        top: document.getElementById('simulations')?.offsetTop, behavior: 'smooth'
                    })
                }} padding='25' size='standard' />
                <Button content='About me' link='/about' size='standard' />
            </div>
        </Header>

        {/* <ArticlesList count={2} />
        <SimulationsList count={2} /> */}

        {/* <Footer /> */}
    </>
}
