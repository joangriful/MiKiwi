/* @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useDeferredThreeScene from '@/Features/Configurator/hooks/useDeferredThreeScene';

function setupMatchMedia(initialMatches) {
    let matches = initialMatches;
    const listeners = new Set();

    const mediaQuery = {
        media: '(max-width: 1024px)',
        get matches() {
            return matches;
        },
        addEventListener: (_eventName, listener) => {
            listeners.add(listener);
        },
        removeEventListener: (_eventName, listener) => {
            listeners.delete(listener);
        },
        addListener: (listener) => {
            listeners.add(listener);
        },
        removeListener: (listener) => {
            listeners.delete(listener);
        },
    };

    window.matchMedia = vi.fn(() => mediaQuery);

    return {
        emit(nextMatch) {
            matches = nextMatch;
            const event = { matches: nextMatch, media: mediaQuery.media };

            listeners.forEach((listener) => listener(event));
        },
    };
}

describe('useDeferredThreeScene', () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
    });

    it('defers scene render on mobile until user enables it', () => {
        setupMatchMedia(true);

        const { result } = renderHook(() => useDeferredThreeScene());

        expect(result.current.shouldShowGate).toBe(true);
        expect(result.current.shouldRenderScene).toBe(false);

        act(() => {
            result.current.enableScene();
        });

        expect(result.current.shouldShowGate).toBe(false);
        expect(result.current.shouldRenderScene).toBe(true);
    });

    it('renders scene directly on desktop', () => {
        setupMatchMedia(false);

        const { result } = renderHook(() => useDeferredThreeScene());

        expect(result.current.shouldShowGate).toBe(false);
        expect(result.current.shouldRenderScene).toBe(true);
    });

    it('auto-enables scene when viewport changes from mobile to desktop', () => {
        const viewport = setupMatchMedia(true);
        const { result } = renderHook(() => useDeferredThreeScene());

        expect(result.current.shouldShowGate).toBe(true);

        act(() => {
            viewport.emit(false);
        });

        expect(result.current.shouldShowGate).toBe(false);
        expect(result.current.shouldRenderScene).toBe(true);
    });
});
