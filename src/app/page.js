"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Heart, CloudLightning, Sun } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

const MOOD_DATA = [
  { id: 'happy', icon: Smile, color: '#81c784' },
  { id: 'sad', icon: CloudLightning, color: '#90a4ae' },
  { id: 'stressed', icon: Frown, color: '#e57373' },
  { id: 'calm', icon: Sun, color: '#fff176' },
  { id: 'loved', icon: Heart, color: '#f06292' },
  { id: 'anxious', icon: Meh, color: '#ffb74d' },
];

import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container flex-between">
          <div className={styles.logo}>
            <span role="img" aria-label="leaf">🌿</span> MoodMate
          </div>
          <nav className={styles.nav}>
            <Link href="/chat" className="btn-ghost">{t('nav.chat')}</Link>
            <Link href="/music" className="btn-ghost">{t('nav.music')}</Link>
            <Link href="/journal" className="btn-ghost">{t('nav.journal')}</Link>
            <Link href="/kids" className="btn-ghost" style={{ color: '#ffb74d' }}>{t('nav.kids')}</Link>

            {user ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{user.displayName?.split(' ')[0] || 'Friend'}</span>
                <button onClick={logout} className="btn-ghost" style={{ fontSize: '0.9rem' }}>Logout</button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary">{t('nav.signin')}</Link>
            )}

            {/* Language Switcher */}
            <div style={{ marginLeft: '1rem', position: 'relative', display: 'flex', gap: 5 }}>
              <button onClick={() => setLang('en')} className="btn-ghost" style={{ padding: 5, fontWeight: lang === 'en' ? 700 : 400 }}>EN</button>
              <button onClick={() => setLang('hi')} className="btn-ghost" style={{ padding: 5, fontWeight: lang === 'hi' ? 700 : 400 }}>HI</button>
              <button onClick={() => setLang('te')} className="btn-ghost" style={{ padding: 5, fontWeight: lang === 'te' ? 700 : 400 }}>TE</button>
            </div>
          </nav>
        </div>
      </header>

      <section className={`${styles.hero} container`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.heroContent}
        >
          <h1 className="heading-xl">{t('welcome')}</h1>
          <p className="text-lg" style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        <div className={styles.moodGrid}>
          {MOOD_DATA.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;

            return (
              <motion.button
                key={mood.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood.id)}
                className={`${styles.moodCard} glass-panel`}
                style={{
                  borderColor: isSelected ? mood.color : 'transparent',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--surface)'
                }}
              >
                <div
                  className={styles.iconWrapper}
                  style={{ backgroundColor: isSelected ? mood.color : '#f0f4f8', color: isSelected ? 'white' : mood.color }}
                >
                  <Icon size={32} />
                </div>
                <span className={styles.moodLabel}>{t(`moods.${mood.id}`)}</span>
              </motion.button>
            );
          })}
        </div>

        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={styles.recommendation}
          >
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem', width: '100%', textAlign: 'center' }}>
              <h3 className="text-lg" style={{ marginBottom: '1rem' }}>
                It sounds like you're feeling <strong>{t(`moods.${selectedMood}`)}</strong>.
              </h3>
              <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                Here is something that might help:
              </p>

              <div className={styles.actions}>
                <Link href="/chat?mode=support" className="btn-primary">
                  Chat with MoodMate
                </Link>
                <Link href="/music" className="btn-ghost" style={{ border: '1px solid var(--text-dim)' }}>
                  Listen to Calming Music
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
