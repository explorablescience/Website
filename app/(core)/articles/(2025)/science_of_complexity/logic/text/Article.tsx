import { JSX } from 'react';
import './Article.css'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import logError from '../api_manager';
import { idFromTitle } from '../utils';

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className="error-simulation">
        <p>Something went very wrong in the article.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

export function Article(props: { children: React.ReactNode }) {
    return (
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <article className="article">
                {props.children}
            </article>
        </ErrorBoundary>
    );
}

export function Part(props: { title: string, children: React.ReactNode, className?: string, hideTitle?: boolean }) {
    return (
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <section className={`part-upper ${props.className}`} id={idFromTitle(props.title)}>
                {props.hideTitle == null ? <h1 className="part-title">{props.title}</h1> : <></>}
                <div className="part-content">
                    {props.children}
                </div>
            </section>
        </ErrorBoundary>
    );
}

export function Section(props: { title?: string, children: React.ReactNode }) {
    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <section id={idFromTitle(props.title ? props.title : "")}>
                {props.title && <h2 className="section-title">{props.title}</h2>}
                {props.children}
            </section>
        </ErrorBoundary>
    </>;
}

export function Paragraph(props: JSX.IntrinsicElements["p"]) {
    return <div className="paragraph">
        {props.children}
    </div>
}
