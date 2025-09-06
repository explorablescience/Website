import styles from './Section.module.css'

export default function Article(props: { children: React.ReactNode; title: string, subtitle: string }) {
    return (
        <article className={styles.general_relativityArticle}>
            <div className={`${styles["article-head"]}`}>
                <hr className={`${styles["article-hr-title-start1"]}`} />
                <hr className={`${styles["article-hr-title-start2"]}`} />
                <h1 className={`${styles["article-title"]}`}>{props.title}</h1>
                <hr className={`${styles["article-hr-title-between"]}`} />
                <h1 className={`${styles["article-subtitle"]}`}>{props.subtitle}</h1>
                <hr className={`${styles["article-hr-title-end1"]}`} />
                <hr className={`${styles["article-hr-title-end2"]}`} />
            </div>

            <div className={`${styles["article-container"]}`}>
                {props.children}
            </div>
        </article>
    );
}
