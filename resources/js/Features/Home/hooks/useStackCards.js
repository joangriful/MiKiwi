import { useEffect, useRef } from 'react';

export default function useStackCards(stackItemsRef, stackContainerRef) {
    useEffect(() => {
        const stackItems = stackItemsRef.current;
        if (stackItems.length === 0) return;

        const config = {
            perspective: 1600,
            rotationX: 7,
            scaleStep: 0.038,
            minScale: 0.84,
            translateYStep: 30,
            translateZStep: -70,
            opacityStep: 0.85,
            minOpacity: 0.05,
            blurStep: 2.8,
            maxBlur: 11,
            brightnessStep: 0.06,
            minBrightness: 0.75,
            saturationStep: 0.12,
            minSaturation: 0.55,
            shadowIntensity: 0.35,
            lerpFactorBase: 0.09,
            lerpFactorFast: 0.16,
            lerpFactorSlow: 0.04,
        };

        let states = null;
        const adaptiveLerp = (current, target, baseFactor) => {
            const distance = Math.abs(target - current);
            let factor = distance > 50 ? config.lerpFactorSlow : distance > 10 ? baseFactor : config.lerpFactorFast;
            return current + (target - current) * Math.min(factor, 0.2);
        };

        const tick = () => {
            const stackItems = stackItemsRef.current.filter(Boolean);
            if (stackItems.length === 0) {
                requestAnimationFrame(tick);
                return;
            }

            if (!states || states.length !== stackItems.length) {
                states = stackItems.map(() => ({
                    current: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 },
                    target: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 }
                }));
            }

            const windowHeight = window.innerHeight;
            const depths = new Array(stackItems.length).fill(0);

            for (let i = stackItems.length - 1; i >= 0; i--) {
                const card = stackItems[i];
                let overlappingRectTop = windowHeight;
                if (i < stackItems.length - 1) {
                    overlappingRectTop = stackItems[i + 1].getBoundingClientRect().top;
                }
                const overlapProgress = Math.max(0, Math.min(1, 1 - (overlappingRectTop / windowHeight)));
                let neighborDepth = i < stackItems.length - 1 ? depths[i + 1] : 0;
                depths[i] = overlapProgress + neighborDepth;
            }

            stackItems.forEach((card, i) => {
                const c = states[i].current;
                const t = states[i].target;
                const depth = depths[i];

                if (depth > 0.01) {
                    const effectiveDepth = Math.min(depth, 5);
                    t.scale = Math.max(config.minScale, 1 - (effectiveDepth * config.scaleStep));
                    t.opacity = Math.max(config.minOpacity, 1 - (effectiveDepth * config.opacityStep));
                    t.blur = Math.min(effectiveDepth * config.blurStep, config.maxBlur);
                    t.brightness = Math.max(config.minBrightness, 1 - (effectiveDepth * config.brightnessStep));
                    t.saturation = Math.max(config.minSaturation, 1 - (effectiveDepth * config.saturationStep));
                    t.imageScale = 1 + (effectiveDepth * 0.02);
                    t.translateY = -effectiveDepth * config.translateYStep;
                    t.translateZ = effectiveDepth * config.translateZStep;
                    t.rotateX = effectiveDepth * config.rotationX;
                    t.shadow = Math.min(effectiveDepth * config.shadowIntensity, 0.65);
                } else {
                    t.scale = 1; t.opacity = 1; t.blur = 0; t.brightness = 1; t.saturation = 1;
                    t.translateY = 0; t.translateZ = 0; t.rotateX = 0; t.imageScale = 1; t.shadow = 0;
                }

                const bf = config.lerpFactorBase;
                c.scale = adaptiveLerp(c.scale, t.scale, bf);
                c.opacity = adaptiveLerp(c.opacity, t.opacity, bf);
                c.blur = adaptiveLerp(c.blur, t.blur, bf);
                c.brightness = adaptiveLerp(c.brightness, t.brightness, bf);
                c.saturation = adaptiveLerp(c.saturation, t.saturation, bf);
                c.translateY = adaptiveLerp(c.translateY, t.translateY, bf);
                c.translateZ = adaptiveLerp(c.translateZ, t.translateZ, bf);
                c.rotateX = adaptiveLerp(c.rotateX, t.rotateX, bf);
                c.imageScale = adaptiveLerp(c.imageScale, t.imageScale, bf);
                c.shadow = adaptiveLerp(c.shadow, t.shadow, bf);

                const transform = `perspective(${config.perspective}px) translateY(${c.translateY.toFixed(1)}px) translateZ(${c.translateZ.toFixed(1)}px) rotateX(${c.rotateX.toFixed(2)}deg) scale(${c.scale.toFixed(4)})`;
                card.style.transform = transform;
                card.style.opacity = c.opacity.toFixed(3);
                card.style.zIndex = 100 + i;

                let filters = [];
                if (c.blur > 0.3) filters.push(`blur(${c.blur.toFixed(1)}px)`);
                if (c.brightness < 0.98) filters.push(`brightness(${c.brightness.toFixed(2)})`);
                if (c.saturation < 0.98) filters.push(`saturate(${c.saturation.toFixed(2)})`);
                card.style.filter = filters.length ? filters.join(' ') : 'none';

                const collectionCard = card.querySelector('.collection-card');
                if (collectionCard && c.shadow > 0.01) {
                    collectionCard.style.boxShadow = `
                        0 ${(20 + c.shadow * 35).toFixed(1)}px ${(45 + c.shadow * 45).toFixed(1)}px rgba(34, 43, 36, ${(c.shadow * 0.15).toFixed(3)}),
                        0 ${(6 + c.shadow * 10).toFixed(1)}px ${(18 + c.shadow * 18).toFixed(1)}px rgba(34, 43, 36, ${(c.shadow * 0.1).toFixed(3)})
                    `;
                }

                const img = card.querySelector('.card-image');
                if (img) {
                    const rect = card.getBoundingClientRect();
                    const cardProgress = 1 - (rect.top / windowHeight);
                    const parallaxOffset = (Math.max(0, Math.min(1, cardProgress)) - 0.5) * 100;
                    img.style.transform = `translateY(${parallaxOffset}px) scale(${c.imageScale})`;
                }
            });

            requestAnimationFrame(tick);
        };

        const stackContainer = stackContainerRef.current;
        if (stackContainer) {
            stackContainer.style.perspective = `${config.perspective}px`;
            stackContainer.style.perspectiveOrigin = 'center top';
            stackContainer.style.transformStyle = 'preserve-3d';
        }

        const animationId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationId);
    }, [stackItemsRef, stackContainerRef]);
}
