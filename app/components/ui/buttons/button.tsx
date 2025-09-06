'use client'

import Link from 'next/link';
import styles from './button.module.css';

/**
 * Button component. It can have two types of actions: link or onClick action.
 * It can also have two sizes: standard or large.
 * @param props
 * @param props.content Text content of the button
 * @param props.link Link to redirect to
 * @param props.action Action to execute when the button is clicked
 * @param props.padding Padding between the icon and the text (default: 0)
 */
export default function Button(props: { content: string, link?: string, action?: React.MouseEventHandler<HTMLDivElement>, padding?: string, size: 'standard' | 'large' }) {
    const core = <div className={styles.content + ' ' + styles['content-' + props.size]}>
        <span className={styles.circle} aria-hidden="true">
            <span className={styles.icon + " " + styles.arrow}></span>
        </span>
        <span className={styles["button-text"]}>
            {props.padding && <span style={{ display: 'inline', marginLeft: props.padding + 'px' }} />}
            {props.content}
        </span>
    </div>

    return (<>
        {props.link && <Link href={props.link} className={styles.container}>
            {core}
        </Link>}
        {props.action && <div onClick={props.action} className={styles.container}>
            {core}
        </div>}
    </>)
}
