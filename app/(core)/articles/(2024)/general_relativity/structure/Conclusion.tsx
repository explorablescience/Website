import styles from './Section.module.css'

export default function Conclusion(props: { children?: React.ReactNode }) {
    return (
        <>
            <div className={styles.conclusion}>
                {props.children}

                <div className={styles.credits}>
                    ©2023 MecanicaScience - Written by <b>Maxime Dherbecourt</b>
                </div>
            </div>
        </>
    )
}