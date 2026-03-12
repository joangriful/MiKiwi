import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal Component
 * Wraps content with a subtle fade-and-slide animation that triggers when scrolled into view.
 */
const ScrollReveal = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 30,
    className = ""
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
            x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Smooth cubic bezier
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
