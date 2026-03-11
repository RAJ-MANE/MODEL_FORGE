import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
    onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
    // Remove overlay the instant the marquee scroll finishes
    useEffect(() => {
        const timer = setTimeout(onComplete, 5000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const textStyle: React.CSSProperties = {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(6rem, 20vw, 22rem)',
        fontWeight: 900,
        lineHeight: 0.9,
        letterSpacing: '-0.05em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        background: 'linear-gradient(90deg, #3b82f6 0%, #f8f8f8 15%, #f8f8f8 85%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    const marqueeText = 'Improvyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu';

    return (
        <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050505',
                overflow: 'hidden',
            }}
        >
            {/* Gradient orbs */}
            <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', top: '-20%', right: '-15%', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', bottom: '-15%', left: '-10%', filter: 'blur(100px)', pointerEvents: 'none' }} />

            {/* Marquee: 5 seconds, slow and readable */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 5.0, ease: 'linear' }}
                style={{ position: 'absolute', whiteSpace: 'nowrap', zIndex: 3 }}
            >
                <span style={textStyle}>
                    {marqueeText}
                </span>
            </motion.div>

            {/* Corner branding */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.2, duration: 0.6 }}
                style={{ position: 'absolute', top: 36, left: 36, fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: '#52525b', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                Improvyu™
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.2, duration: 0.6 }}
                style={{ position: 'absolute', top: 36, right: 36, fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: '#52525b', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                © {new Date().getFullYear()}
            </motion.div>
        </motion.div>
    );
};

export default IntroAnimation;
