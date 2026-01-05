"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon, Wind, Brain } from 'lucide-react';
import Link from 'next/link';
import styles from './music.module.css';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const TRACKS = {
    sad: [
        { title: "Gentle Rain", artist: "Nature Sounds", duration: "3:00", color: "#90caf9" },
        { title: "Piano Comfort", artist: "MoodMate", duration: "4:20", color: "#b39ddb" },
        { title: "Ocean Waves", artist: "Nature Sounds", duration: "5:15", color: "#80deea" }
    ],
    stressed: [
        { title: "Deep Om", artist: "Meditation", duration: "10:00", color: "#ef9a9a" },
        { title: "Forest Walk", artist: "Nature Sounds", duration: "6:45", color: "#a5d6a7" }
    ],
    happy: [
        { title: "Sunny Day", artist: "Upbeat Trio", duration: "2:50", color: "#fff59d" },
        { title: "Morning Energy", artist: "MoodMate", duration: "3:30", color: "#ffe082" }
    ],
    default: [
        { title: "Ambient Flow", artist: "MoodMate", duration: "4:00", color: "#e0e0e0" }
    ]
};

function MusicContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const mood = searchParams.get('mood') || 'default';

    const [activeTab, setActiveTab] = useState('music');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);

    const playlist = TRACKS[mood] || TRACKS.default;
    const track = playlist[currentTrack] || playlist[0];

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
        setIsPlaying(true);
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className="btn-ghost" style={{ justifySelf: 'start' }}>← Home</Link>
                <h2>{t('music.title')}</h2>
                <div style={{ width: 60 }}></div>
            </header>

            <div className={styles.tabs} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    className={`${styles.tab} ${activeTab === 'music' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('music')}
                >
                    <MusicIcon size={18} /> {t('music.therapy')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'breath' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('breath')}
                >
                    <Wind size={18} /> {t('music.breath')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'meditation' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('meditation')}
                >
                    <Brain size={18} /> {t('music.meditation')}
                </button>
            </div>

            <div className={styles.content}>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%', maxWidth: '600px' }}
                >
                    {activeTab === 'music' && (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div className={styles.albumArt} style={{ background: track.color }}>
                                <MusicIcon size={64} color="rgba(255,255,255,0.8)" />
                            </div>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{track.title}</h3>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{track.artist}</p>

                            <div className={styles.controls}>
                                <button className="btn-ghost" onClick={prevTrack}><SkipBack size={24} /></button>
                                <button
                                    className="btn-primary"
                                    style={{ borderRadius: '50%', width: 64, height: 64, padding: 0, justifyContent: 'center' }}
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
                                </button>
                                <button className="btn-ghost" onClick={nextTrack}><SkipForward size={24} /></button>
                            </div>

                            <div className={styles.playlist}>
                                <h4 style={{ textAlign: 'left', marginBottom: '1rem', marginTop: '2rem' }}>Up Next</h4>
                                {playlist.map((t, i) => (
                                    <div
                                        key={i}
                                        className={styles.trackItem}
                                        onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                                        style={{ fontWeight: currentTrack === i ? 700 : 400 }}
                                    >
                                        <span>{i + 1}. {t.title}</span>
                                        <span>{t.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'breath' && <BreathingExercise t={t} />}

                    {activeTab === 'meditation' && <MeditationTimer t={t} />}

                </motion.div>
            </div>
        </div>
    );
}

function BreathingExercise({ t }) {
    const [step, setStep] = useState('inhale'); // inhale, hold, exhale

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => {
                if (s === 'inhale') return 'hold';
                if (s === 'hold') return 'exhale';
                return 'inhale';
            });
        }, 4000); // 4-4-4 breathing
        return () => clearInterval(interval);
    }, []);

    // Helper to get raw key for visual logic
    const getInstruction = (currentStep) => {
        return t(`music.breathing.instruction_${currentStep}`);
    };

    const getLabel = (currentStep) => {
        return t(`music.breathing.${currentStep}`);
    };

    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', minHeight: 450, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '2rem' }}>{t('music.breathing.title')}</h3>
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Outer Ring */}
                <motion.div
                    animate={{
                        scale: step === 'inhale' ? 1.2 : step === 'exhale' ? 0.8 : 1.2,
                        opacity: 0.3
                    }}
                    transition={{ duration: 4, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                    }}
                />

                {/* Core Circle */}
                <motion.div
                    animate={{
                        scale: step === 'inhale' ? 1.5 : step === 'exhale' ? 1 : 1.5,
                        opacity: step === 'hold' ? 0.8 : 1
                    }}
                    transition={{ duration: 4, ease: "linear" }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'var(--secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        boxShadow: '0 0 30px rgba(0,0,0,0.1)',
                        zIndex: 2
                    }}
                >
                    {getLabel(step)}
                </motion.div>
            </div>

            <motion.p
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: 'var(--text-dim)', marginTop: '3rem', fontSize: '1.2rem' }}
            >
                {getInstruction(step)}
            </motion.p>
        </div>
    );
}

function MeditationTimer({ t }) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(3); // Default 3 mins

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startTimer = () => {
        setTimeLeft(duration * 60);
        setIsActive(true);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', minHeight: 450, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('music.meditate.title')}</h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>{t('music.meditate.focus')}</p>

            {!isActive && timeLeft === 0 ? (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    {[1, 3, 5, 10].map(m => (
                        <button
                            key={m}
                            onClick={() => setDuration(m)}
                            className={`btn-ghost ${duration === m ? 'btn-primary' : ''}`}
                            style={{
                                background: duration === m ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                                color: duration === m ? 'white' : 'inherit'
                            }}
                        >
                            {m} {t('music.meditate.minutes')}
                        </button>
                    ))}
                </div>
            ) : null}

            <div style={{
                fontSize: '4rem',
                fontWeight: '200',
                fontVariantNumeric: 'tabular-nums',
                margin: '2rem 0',
                color: 'var(--text-main)'
            }}>
                {timeLeft > 0 ? formatTime(timeLeft) : `${duration}:00`}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {!isActive && timeLeft === 0 && (
                    <button className="btn-primary" onClick={startTimer} style={{ minWidth: 150 }}>
                        <Play size={18} style={{ marginRight: 8 }} /> {t('music.meditate.start')}
                    </button>
                )}

                {isActive && (
                    <button className="btn-primary" onClick={() => setIsActive(false)} style={{ background: '#ef5350' }}>
                        <Pause size={18} /> {t('music.meditate.stop')}
                    </button>
                )}

                {(isActive || timeLeft > 0) && (
                    <button className="btn-ghost" onClick={resetTimer}>
                        {t('music.meditate.reset')}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function MusicPage() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
            <MusicContent />
        </Suspense>
    );
}
