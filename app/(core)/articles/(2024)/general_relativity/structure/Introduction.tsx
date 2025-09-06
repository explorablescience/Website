import styles from './Section.module.css'

export default function Introduction(props: { children?: React.ReactNode }) {
    return (
        <div className={styles.introduction}>
            { props.children }
        </div>
    )
}