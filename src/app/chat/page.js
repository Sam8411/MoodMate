"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import styles from './chat.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function ChatPage() {
    const { t, lang } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const messagesEndRef = useRef(null);

    // Initialize greeting on load or lang change
    useEffect(() => {
        setMessages([
            { id: 1, sender: 'bot', text: t('welcome'), emotion: 'neutral' }
        ]);
    }, [lang]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const analyzeEmotion = (text) => {
        const lower = text.toLowerCase();
        // Crisis Check (Simple multilingual approximate check - ideally would be more robust)
        const crisisKeywords = ['suicide', 'die', 'kill', 'hurt', 'end it', 'मरना', 'आत्महत्या', 'చనిపోవాలని'];
        if (crisisKeywords.some(k => lower.includes(k))) return 'crisis';

        if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('दुखी') || lower.includes('విచారం')) return 'sad';
        if (lower.includes('happy') || lower.includes('great') || lower.includes('good') || lower.includes('खुश') || lower.includes('సంతోషం')) return 'happy';
        if (lower.includes('anxious') || lower.includes('nervous') || lower.includes('scared') || lower.includes('तनाव') || lower.includes('ఆందోళన')) return 'anxious';
        return 'listening';
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Analyze logic
        const emotion = analyzeEmotion(userMsg.text);
        setCurrentEmotion(emotion === 'crisis' ? 'sad' : emotion);

        // Get responses based on current language
        const responses = translations[lang]?.chat?.bot_responses || translations['en'].chat.bot_responses;

        if (emotion === 'crisis') {
            setTimeout(() => {
                const crisisMsg = {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: responses.crisis || "Please seek help.",
                    emotion: 'sad'
                };
                setMessages(prev => [...prev, crisisMsg]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        setTimeout(() => {
            const patterns = responses[emotion] || responses.default;
            const responseText = patterns[Math.floor(Math.random() * patterns.length)];

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: responseText,
                emotion: emotion
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className="btn-ghost" style={{ position: 'absolute', left: 20 }}>
                    ← Back
                </Link>
                <div className={styles.avatarWrapper}>
                    <Avatar emotion={currentEmotion} />
                </div>
                <div className={styles.status}>
                    <h3>MoodMate</h3>
                    <span className="text-sm" style={{ color: 'var(--success)' }}>● {t('chat.online')}</span>
                </div>
            </header>

            <div className={styles.chatArea}>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.message} ${msg.sender === 'user' ? styles.userMsg : styles.botMsg}`}
                    >
                        {msg.text}
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${styles.message} ${styles.botMsg}`}
                    >
                        <span className={styles.dot}>.</span>
                        <span className={styles.dot}>.</span>
                        <span className={styles.dot}>.</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <div className="glass-panel" style={{ display: 'flex', padding: 10, width: '100%', maxWidth: 800 }}>
                    <button
                        className="btn-ghost"
                        onClick={() => {
                            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                const recognition = new SpeechRecognition();
                                // Set recognition language based on current app language
                                recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';
                                recognition.start();
                                recognition.onresult = (event) => {
                                    const transcript = event.results[0][0].transcript;
                                    setInput(transcript);
                                };
                            } else {
                                alert(t('chat.mic_error'));
                            }
                        }}
                    >
                        <Mic size={20} />
                    </button>
                    <input
                        className={styles.input}
                        placeholder={t('chat.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="btn-primary"
                        style={{ borderRadius: '50%', padding: 12, width: 48, height: 48 }}
                        onClick={handleSend}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
