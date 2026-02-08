import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorGlow = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Use MotionValues for smooth performance without re-renders
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth lag effect
    const springConfig = { damping: 25, stiffness: 120 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    // Second layer with different physics for depth
    const springX2 = useSpring(cursorX, { damping: 40, stiffness: 80 });
    const springY2 = useSpring(cursorY, { damping: 40, stiffness: 80 });

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 200); // Center the 400px blob
            cursorY.set(e.clientY - 200);
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', moveCursor);
        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, [cursorX, cursorY]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Primary Glow */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-emerald-500/20 blur-[100px] mix-blend-screen"
                style={{
                    x: springX,
                    y: springY,
                }}
            />

            {/* Secondary Lagging Glow */}
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full bg-teal-500/20 blur-[80px] mix-blend-screen"
                style={{
                    x: springX2,
                    y: springY2,
                }}
            />

            {/* Decorative Static Orbs for Ambient Light */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        </div>
    );
};

export default CursorGlow;
