"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Calendar, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import styles from './journal.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function JournalPage() {
    const { t } = useLanguage();
    const [entries, setEntries] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEntry, setCurrentEntry] = useState('');
    const [currentMood, setCurrentMood] = useState('neutral');

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('moodmate_journal');
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    const saveEntry = () => {
        if (!currentEntry.trim()) return;

        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            text: currentEntry,
            mood: currentMood,
            // Simulated AI Insight
            insight: currentEntry.length > 50 ? "You seem to be reflecting deeply. Keep exploring these feelings." : "Short and sweet."
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem('moodmate_journal', JSON.stringify(updated));
        setCurrentEntry('');
        setIsEditing(false);
    };

    const deleteEntry = (id) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        localStorage.setItem('moodmate_journal', JSON.stringify(updated));
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className="container flex-between">
                    <Link href="/" className="btn-ghost">← Home</Link>
                    <h2>{t('journal.title')}</h2>
                    <button className="btn-primary" onClick={() => setIsEditing(true)}>
                        <Plus size={18} /> {t('journal.newEntry')}
                    </button>
                </div>
            </header>

            <main className="container" style={{ paddingBottom: '2rem' }}>
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel"
                            style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}
                        >
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <h3>{t('journal.newEntry')}</h3>
                                <select
                                    value={currentMood}
                                    onChange={(e) => setCurrentMood(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="happy">{t('moods.happy')}</option>
                                    <option value="neutral">{t('moods.neutral')}</option>
                                    <option value="sad">{t('moods.sad')}</option>
                                    <option value="anxious">{t('moods.anxious')}</option>
                                    <option value="calm">{t('moods.calm')}</option>
                                </select>
                            </div>

                            <textarea
                                className={styles.textarea}
                                placeholder={t('journal.placeholder')}
                                value={currentEntry}
                                onChange={(e) => setCurrentEntry(e.target.value)}
                                autoFocus
                            />

                            <div className={styles.actions}>
                                <button className="btn-ghost" onClick={() => setIsEditing(false)}>{t('journal.cancel')}</button>
                                <button className="btn-primary" onClick={saveEntry}>
                                    <Save size={18} /> {t('journal.save')}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.grid}
                        >
                            {entries.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-dim)', padding: '4rem' }}>
                                    <Book size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>{t('journal.empty')}</p>
                                </div>
                            ) : (
                                entries.map(entry => (
                                    <div key={entry.id} className={`${styles.card} glass-panel`}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.date}><Calendar size={14} /> {entry.date}</span>
                                            <span className={styles.moodTag} data-mood={entry.mood}>{t(`moods.${entry.mood}`) || entry.mood}</span>
                                        </div>
                                        <p className={styles.cardText}>{entry.text}</p>
                                        <div className={styles.cardFooter}>
                                            <span className={styles.insight}>{t('journal.insight_prefix')} {entry.insight}</span>
                                            <button className={styles.deleteBtn} onClick={() => deleteEntry(entry.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
