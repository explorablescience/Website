'use client'

import { useEffect } from "react";

export function useInterval(callback: () => void, deltaTime: number) {
    useEffect(() => {
        const id = setInterval(() => {
            callback();
        }, deltaTime);

        return () => clearInterval(id);
    }, [callback, deltaTime]);
}

export function useIsVisible(ref: React.RefObject<HTMLElement | null>, onChangeVisibility: (isVisible: boolean) => void) {
    useEffect(() => {
        // If no ref, return
        if (!ref.current) return;

        // Create an IntersectionObserver to observe the ref's visibility
        const observer = new IntersectionObserver(([entry]) => {
            onChangeVisibility(entry.isIntersecting);
        });

        // Start observing the element
        observer.observe(ref.current);

        // Cleanup the observer when the component unmounts or ref changes
        return () => {
            observer.disconnect();
        };
    }, [onChangeVisibility, ref]);
}

export function idFromTitle(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-");
}
