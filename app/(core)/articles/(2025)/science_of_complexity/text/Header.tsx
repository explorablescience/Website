import { HeaderSimulation } from "../simulations/0_HeaderSimulation";
import styles from "./Header.module.css";

export function Header() {
    return <>
        <HeaderSimulation />
        <header className={styles['app-header']}>
            <div className={styles['header-content']}>
                <h1>THE SCIENCE OF<br />COMPLEXITY</h1>
                <p>LET'S START</p>
                <div className={styles['header-btn-action']} >
                    <a className={styles['header-btn-scroll']} style={{ cursor: 'pointer' }} onClick={() => {
                        window.scrollTo({
                            top: document.getElementById("introduction")?.offsetTop, behavior: 'smooth'
                        })
                    }}>
                        <div className={styles['header-btn-scroll-box']}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M11.9997 13.1716L7.04996     8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z" fill="rgba(200,200,200,1)">
                                </path>
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
        </header>
    </>
}