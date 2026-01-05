"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import styles from './kids.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function KidsPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('stories');

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className="btn-ghost" style={{ fontSize: '1.2rem' }}>🏡 Home</Link>
                <h1 style={{ color: '#ff7043', fontFamily: 'Comic Sans MS, cursive' }}>{t('kids.title')}</h1>
                <div style={{ width: 60 }}></div>
            </header>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'stories' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('stories')}
                >
                    <BookOpen /> {t('kids.tab_stories')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'games' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('games')}
                >
                    <Gamepad2 /> {t('kids.tab_games')}
                </button>
            </div>

            <main className="container" style={{ paddingBottom: '3rem' }}>
                {activeTab === 'stories' && (
                    <div className={styles.grid}>
                        {(t('kids.stories') || []).map((story, i) => (
                            <StoryCard key={i} story={story} t={t} />
                        ))}
                    </div>
                )}

                {activeTab === 'games' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <MemoryGame t={t} />
                        <hr style={{ borderColor: 'var(--border)', opacity: 0.3 }} />
                        <TicTacToe t={t} />
                    </div>
                )}
            </main>
        </div>
    );
}

function StoryCard({ story, t }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel"
            style={{
                padding: '2rem',
                borderTop: `6px solid ${story.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <div>
                <span
                    style={{
                        background: story.color,
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                    }}
                >
                    {story.category}
                </span>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{story.title}</h3>
            </div>

            <div style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                {expanded ? story.content : (story.content.substring(0, 100) + '...')}
            </div>

            <button
                onClick={() => setExpanded(!expanded)}
                className="btn-ghost"
                style={{ alignSelf: 'start', padding: 0, textDecoration: 'underline', color: 'var(--primary)' }}
            >
                {expanded ? t('kids.read_less') : t('kids.read_more')}
            </button>
        </motion.div>
    );
}

function MemoryGame({ t }) {
    const [cards, setCards] = useState([
        { id: 1, emoji: '🦁', flipped: false },
        { id: 2, emoji: '🦁', flipped: false },
        { id: 3, emoji: '🐼', flipped: false },
        { id: 4, emoji: '🐼', flipped: false },
        { id: 5, emoji: '🐸', flipped: false },
        { id: 6, emoji: '🐸', flipped: false },
    ].sort(() => Math.random() - 0.5));

    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);

    const handleFlip = (id) => {
        if (flipped.length === 2) return;
        if (solved.includes(id)) return;

        setFlipped([...flipped, id]);

        const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
        setCards(newCards);

        if (flipped.length === 1) {
            const firstId = flipped[0];
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === id);

            if (firstCard.emoji === secondCard.emoji) {
                setSolved([...solved, firstId, id]);
                setFlipped([]);
            } else {
                setTimeout(() => {
                    setCards(cards.map(c => (c.id === firstId || c.id === id) && !solved.includes(c.id) ? { ...c, flipped: false } : c));
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '2rem' }}>{t('kids.game_title')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '1rem', justifyContent: 'center' }}>
                {cards.map(card => (
                    <motion.div
                        key={card.id}
                        onClick={() => handleFlip(card.id)}
                        animate={{ rotateY: card.flipped || solved.includes(card.id) ? 180 : 0 }}
                        style={{
                            width: 100,
                            height: 100,
                            background: card.flipped || solved.includes(card.id) ? 'white' : '#ffcc80',
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{ transform: 'rotateY(180deg)' }}>
                            {(card.flipped || solved.includes(card.id)) ? card.emoji : '❓'}
                        </div>
                    </motion.div>
                ))}
            </div>
            {solved.length === cards.length && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>{t('kids.win_title')}</h2>
                    <button className="btn-primary" onClick={() => window.location.reload()}>{t('kids.play_again')}</button>
                </div>
            )}
        </div>
    );
}

function TicTacToe({ t }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i) => {
        if (calculateWinner(board) || board[i]) return;
        const nextBoard = board.slice();
        nextBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(nextBoard);
        setXIsNext(!xIsNext);
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(Boolean);

    return (
        <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('kids.tictactoe_title')}</h3>
            <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {winner ? (t('kids.winner') + winner) : isDraw ? t('kids.draw') : ((xIsNext ? 'X' : 'O') + t('kids.turn'))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '10px', justifyContent: 'center' }}>
                {board.map((square, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        className="glass-panel"
                        style={{
                            width: 80, height: 80, fontSize: '2rem', fontWeight: 'bold',
                            background: square === 'X' ? '#e3f2fd' : square === 'O' ? '#fbe9e7' : 'rgba(255,255,255,0.5)',
                            color: square === 'X' ? '#1976d2' : '#d84315',
                            border: 'none', cursor: 'pointer', borderRadius: 12
                        }}
                    >
                        {square}
                    </button>
                ))}
            </div>
            {(winner || isDraw) && (
                <button
                    className="btn-primary"
                    style={{ marginTop: '1.5rem' }}
                    onClick={() => setBoard(Array(9).fill(null))}
                >
                    {t('kids.play_again')}
                </button>
            )}
        </div>
    );
}
