import { useEffect } from "react";

/**
 * Hook to determine if an element is visible in the viewport.
 * @param ref Reference to the HTML element to observe
 * @param onChangeVisibility Callback function called with the visibility state (true if visible, false otherwise)
 */
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
