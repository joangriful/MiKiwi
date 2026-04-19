import { useEffect } from 'react';

export default function useStackCards(stackItemsRef, stackContainerRef) {
    useEffect(() => {
        const stackItems = stackItemsRef.current;
        if (stackItems.length === 0) {
            return undefined;
        }

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
            const factor = distance > 50
                ? config.lerpFactorSlow
                : distance > 10
                    ? baseFactor
                    : config.lerpFactorFast;

            return current + (target - current) * Math.min(factor, 0.2);
        };

        let frameId = 0;

        const tick = () => {
            const currentItems = stackItemsRef.current.filter(Boolean);
            if (currentItems.length === 0) {
                frameId = requestAnimationFrame(tick);
                return;
            }

            if (!states || states.length !== currentItems.length) {
                states = currentItems.map(() => ({
                    current: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 },
                    target: { scale: 1, opacity: 1, blur: 0, brightness: 1, saturation: 1, translateY: 0, translateZ: 0, rotateX: 0, imageScale: 1, shadow: 0 },
                }));
            }

            const windowHeight = window.innerHeight;
            const depths = new Array(currentItems.length).fill(0);

            for (let index = currentItems.length - 1; index >= 0; index -= 1) {
                let overlappingRectTop = windowHeight;
                if (index < currentItems.length - 1) {
                    overlappingRectTop = currentItems[index + 1].getBoundingClientRect().top;
                }

                const overlapProgress = Math.max(0, Math.min(1, 1 - (overlappingRectTop / windowHeight)));
                const neighborDepth = index < currentItems.length - 1 ? depths[index + 1] : 0;
                depths[index] = overlapProgress + neighborDepth;
            }

            currentItems.forEach((card, index) => {
                const currentState = states[index].current;
                const targetState = states[index].target;
                const depth = depths[index];

                if (depth > 0.01) {
                    const effectiveDepth = Math.min(depth, 5);
                    targetState.scale = Math.max(config.minScale, 1 - (effectiveDepth * config.scaleStep));
                    targetState.opacity = Math.max(config.minOpacity, 1 - (effectiveDepth * config.opacityStep));
                    targetState.blur = Math.min(effectiveDepth * config.blurStep, config.maxBlur);
                    targetState.brightness = Math.max(config.minBrightness, 1 - (effectiveDepth * config.brightnessStep));
                    targetState.saturation = Math.max(config.minSaturation, 1 - (effectiveDepth * config.saturationStep));
                    targetState.imageScale = 1 + (effectiveDepth * 0.02);
                    targetState.translateY = -effectiveDepth * config.translateYStep;
                    targetState.translateZ = effectiveDepth * config.translateZStep;
                    targetState.rotateX = effectiveDepth * config.rotationX;
                    targetState.shadow = Math.min(effectiveDepth * config.shadowIntensity, 0.65);
                } else {
                    targetState.scale = 1;
                    targetState.opacity = 1;
                    targetState.blur = 0;
                    targetState.brightness = 1;
                    targetState.saturation = 1;
                    targetState.translateY = 0;
                    targetState.translateZ = 0;
                    targetState.rotateX = 0;
                    targetState.imageScale = 1;
                    targetState.shadow = 0;
                }

                const baseFactor = config.lerpFactorBase;
                currentState.scale = adaptiveLerp(currentState.scale, targetState.scale, baseFactor);
                currentState.opacity = adaptiveLerp(currentState.opacity, targetState.opacity, baseFactor);
                currentState.blur = adaptiveLerp(currentState.blur, targetState.blur, baseFactor);
                currentState.brightness = adaptiveLerp(currentState.brightness, targetState.brightness, baseFactor);
                currentState.saturation = adaptiveLerp(currentState.saturation, targetState.saturation, baseFactor);
                currentState.translateY = adaptiveLerp(currentState.translateY, targetState.translateY, baseFactor);
                currentState.translateZ = adaptiveLerp(currentState.translateZ, targetState.translateZ, baseFactor);
                currentState.rotateX = adaptiveLerp(currentState.rotateX, targetState.rotateX, baseFactor);
                currentState.imageScale = adaptiveLerp(currentState.imageScale, targetState.imageScale, baseFactor);
                currentState.shadow = adaptiveLerp(currentState.shadow, targetState.shadow, baseFactor);

                card.style.transform = `perspective(${config.perspective}px) translateY(${currentState.translateY.toFixed(1)}px) translateZ(${currentState.translateZ.toFixed(1)}px) rotateX(${currentState.rotateX.toFixed(2)}deg) scale(${currentState.scale.toFixed(4)})`;
                card.style.opacity = currentState.opacity.toFixed(3);
                card.style.zIndex = 100 + index;

                const filters = [];
                if (currentState.blur > 0.3) {
                    filters.push(`blur(${currentState.blur.toFixed(1)}px)`);
                }
                if (currentState.brightness < 0.98) {
                    filters.push(`brightness(${currentState.brightness.toFixed(2)})`);
                }
                if (currentState.saturation < 0.98) {
                    filters.push(`saturate(${currentState.saturation.toFixed(2)})`);
                }
                card.style.filter = filters.length ? filters.join(' ') : 'none';

                const collectionCard = card.querySelector('[data-stack-card-surface]');
                if (collectionCard && currentState.shadow > 0.01) {
                    collectionCard.style.boxShadow = `
                        0 ${(20 + currentState.shadow * 35).toFixed(1)}px ${(45 + currentState.shadow * 45).toFixed(1)}px rgba(34, 43, 36, ${(currentState.shadow * 0.15).toFixed(3)}),
                        0 ${(6 + currentState.shadow * 10).toFixed(1)}px ${(18 + currentState.shadow * 18).toFixed(1)}px rgba(34, 43, 36, ${(currentState.shadow * 0.1).toFixed(3)})
                    `;
                }

                const image = card.querySelector('[data-stack-card-image]');
                if (image) {
                    const rect = card.getBoundingClientRect();
                    const cardProgress = 1 - (rect.top / windowHeight);
                    const parallaxOffset = (Math.max(0, Math.min(1, cardProgress)) - 0.5) * 100;
                    image.style.transform = `translateY(${parallaxOffset}px) scale(${currentState.imageScale})`;
                }
            });

            frameId = requestAnimationFrame(tick);
        };

        const stackContainer = stackContainerRef.current;
        if (stackContainer) {
            stackContainer.style.perspective = `${config.perspective}px`;
            stackContainer.style.perspectiveOrigin = 'center top';
            stackContainer.style.transformStyle = 'preserve-3d';
        }

        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [stackItemsRef, stackContainerRef]);
}
