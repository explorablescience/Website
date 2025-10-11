import { JSX } from 'react';
import styles from './Article.module.css'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import { idFromTitle } from '../utils';
import page_styles from '../../page.module.css'
import errorStyles from '../simulations/SimulationError.module.css';
import { onReactError } from '@/app/api/client/logger';

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={errorStyles['error-simulation']}>
        <p>Something went very wrong in the article.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

export function Article(props: JSX.IntrinsicElements["article"]) {
    return (
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={onReactError}>
            <article className={`${styles.article} ${page_styles['science_of_complexity']}`} {...props}>
                {props.children}
            </article>
        </ErrorBoundary>
    );
}

export function Part(props: { title: string, children: React.ReactNode, className?: string, hideTitle?: boolean }) {
    return (
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={onReactError}>
            <section className={`${styles['part-upper']} ${props.className}`} id={idFromTitle(props.title)}>
                {props.hideTitle == null ? <h1 className={styles['part-title']}>{props.title}</h1> : <></>}
                <div className={styles['part-content']}>
                    {props.children}
                </div>
            </section>
        </ErrorBoundary>
    );
}

export function Section(props: { title?: string, children: React.ReactNode }) {
    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={onReactError}>
            <section id={idFromTitle(props.title ? props.title : "")}>
                {props.title && <h2 className={styles['section-title']}>{props.title}</h2>}
                {props.children}
            </section>
        </ErrorBoundary>
    </>;
}

export function Paragraph(props: JSX.IntrinsicElements["p"]) {
    return <div className={styles.paragraph}>
        {props.children}
    </div>
}
