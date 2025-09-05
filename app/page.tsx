'use client'

import ArticlesList from './(home)/articles/articles'
import SimulationsList from './(home)/simulations/simulations'
import Footer from './components/footer/footer'
import Header from './components/header/header'
import HeaderAnimation from './components/header/header_animation'
import Button from './components/ui/buttons/button'
import styles from './page.module.css'

export default function Home() {
    return <>
        <HeaderAnimation />

        <Header style={{ height: '115vh' }} showScrollButton>
            <div className={styles.buttons}>
                <Button content='Articles' action={() => {
                    window.scrollTo({
                        top: document.getElementById('articles')?.offsetTop, behavior: 'smooth'
                    })
                }} size='standard' />
                <Button content='&nbsp;&nbsp;&nbsp;Simulations&nbsp;&nbsp;&nbsp;' action={() => {
                    window.scrollTo({
                        top: document.getElementById('simulations')?.offsetTop, behavior: 'smooth'
                    })
                }} padding='25' size='standard' />
                <Button content='About me' link='/about' size='standard' />
            </div>
        </Header>

        <ArticlesList count={4} />
        <SimulationsList count={4} />

        <Footer />
    </>
}
