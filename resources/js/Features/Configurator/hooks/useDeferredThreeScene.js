import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_MAX_WIDTH = 1024;

function matchesDeferredViewport(maxWidth) {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }

    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
}

export default function useDeferredThreeScene({ maxWidth = DEFAULT_MAX_WIDTH } = {}) {
    const [requiresExplicitStart, setRequiresExplicitStart] = useState(() => matchesDeferredViewport(maxWidth));
    const [isSceneEnabled, setIsSceneEnabled] = useState(() => !matchesDeferredViewport(maxWidth));

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return undefined;
        }

        const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

        const handleChange = (event) => {
            setRequiresExplicitStart(event.matches);

            if (!event.matches) {
                setIsSceneEnabled(true);
            }
        };

        setRequiresExplicitStart(mediaQuery.matches);

        if (!mediaQuery.matches) {
            setIsSceneEnabled(true);
        }

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange);

            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }

        mediaQuery.addListener(handleChange);

        return () => {
            mediaQuery.removeListener(handleChange);
        };
    }, [maxWidth]);

    const enableScene = useCallback(() => {
        setIsSceneEnabled(true);
    }, []);

    const shouldShowGate = useMemo(
        () => requiresExplicitStart && !isSceneEnabled,
        [requiresExplicitStart, isSceneEnabled],
    );

    const shouldRenderScene = useMemo(
        () => !shouldShowGate,
        [shouldShowGate],
    );

    return {
        shouldRenderScene,
        shouldShowGate,
        enableScene,
    };
}
