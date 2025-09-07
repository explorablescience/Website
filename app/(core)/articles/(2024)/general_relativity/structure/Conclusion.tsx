import styles from './Section.module.css'

export default function Conclusion(props: { children?: React.ReactNode }) {
    return (
        <>
            <div className={styles.conclusion}>
                {props.children}

                <div style={{ height: '5rem' }}>
                </div>
            </div>
        </>
    )
}