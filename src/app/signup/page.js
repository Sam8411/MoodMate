"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, Chrome, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import styles from './signup.module.css';

export default function SignupPage() {
    const { t } = useLanguage();
    const { emailSignup, googleLogin } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await emailSignup(email, password, name);
            window.location.href = '/';
        } catch (err) {
            setError(err.message || 'Failed to sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            window.location.href = '/';
        } catch (err) {
            setError('Google sign-in failed.');
        }
    };

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '400px', padding: '3rem', position: 'relative' }}
            >
                <Link href="/" className="btn-ghost" style={{ position: 'absolute', top: 20, left: 20, padding: 5 }}>
                    <ArrowLeft size={20} />
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('signup.title')}</h1>
                    <p style={{ color: 'var(--text-dim)' }}>{t('signup.subtitle')}</p>
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.inputGroup}>
                        <User size={20} className={styles.icon} />
                        <input
                            type="text"
                            placeholder={t('signup.name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <Mail size={20} className={styles.icon} />
                        <input
                            type="email"
                            placeholder={t('signup.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <Lock size={20} className={styles.icon} />
                        <input
                            type="password"
                            placeholder={t('signup.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
                        {isLoading ? '...' : t('signup.signup')}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <button
                    className="btn-ghost"
                    onClick={handleGoogleLogin}
                    style={{ width: '100%', border: '1px solid var(--border)', justifyContent: 'center' }}
                >
                    <Chrome size={20} style={{ marginRight: 10 }} />
                    {t('signup.google')}
                </button>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    {t('signup.footer').split('?')[0]}? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{t('signup.footer').split('?').pop()}</Link>
                </p>
            </motion.div>
        </div>
    );
}
