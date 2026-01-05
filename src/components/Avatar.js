"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Avatar({ emotion = 'neutral' }) {
    // Simple CSS-based face that changes based on emotion

    const variants = {
        neutral: {
            eyes: "scaleY(1)",
            mouth: "scaleY(0.2) rotate(0deg)",
            color: "#a5d6a7"
        },
        happy: {
            eyes: "scaleY(1.2)", // Wide eyes
            mouth: "scaleY(1) rotate(0deg) borderRadius(0 0 50% 50%)", // Smile
            path: "M 20 50 Q 50 70 80 50",
            color: "#ffe082"
        },
        sad: {
            eyes: "scaleY(0.8) rotate(-10deg)",
            mouth: "scaleY(1) rotate(0deg)", // Frown
            path: "M 20 60 Q 50 40 80 60",
            color: "#90caf9"
        },
        listening: {
            eyes: "scaleY(1)",
            mouth: "scaleY(0.5)",
            path: "M 30 55 Q 50 55 70 55", // Neutral mouth
            color: "#b39ddb"
        }
    };

    const current = variants[emotion] || variants.neutral;

    return (
        <motion.div
            animate={{ backgroundColor: current.color }}
            className="avatar-container"
            style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                margin: '0 auto'
            }}
        >
            {/* Eyes */}
            <div style={{ position: 'absolute', top: '35%', width: '100%', display: 'flex', justifyContent: 'space-around', padding: '0 25px' }}>
                <motion.div
                    animate={{ scaleY: emotion === 'happy' ? 1.2 : 1, rotate: emotion === 'sad' ? -10 : 0 }}
                    style={{ width: 12, height: 12, background: '#37474f', borderRadius: '50%' }}
                />
                <motion.div
                    animate={{ scaleY: emotion === 'happy' ? 1.2 : 1, rotate: emotion === 'sad' ? 10 : 0 }}
                    style={{ width: 12, height: 12, background: '#37474f', borderRadius: '50%' }}
                />
            </div>

            {/* Mouth (SVG for better curve control) */}
            <svg width="100" height="100" style={{ position: 'absolute', top: 0, left: 0 }}>
                <motion.path
                    d={current.path || "M 30 60 Q 50 70 70 60"} // Default Smile
                    fill="transparent"
                    stroke="#37474f"
                    strokeWidth="4"
                    strokeLinecap="round"
                    animate={{ d: current.path || "M 30 60 Q 50 70 70 60" }}
                />
            </svg>
        </motion.div>
    );
}
