import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SnakeGame.scss';

// Import logo images
import googleLogo from '../assets/logos/google.png';
import appleLogo from '../assets/logos/apple.jpg';
import metaLogo from '../assets/logos/meta.png';
import amazonLogo from '../assets/logos/amazon.png';
import microsoftLogo from '../assets/logos/microsoft.png';
import teslaLogo from '../assets/logos/tesla.png';
import trumpLogo from '../assets/logos/trump.png';
import arcadeImage from '../assets/images/arcade.png';

const GRID_SIZE = 15; // Reduced grid for cleaner gameplay
const CELL_SIZE = 18; // Cell size
const FOOD_SIZE = 26; // Food/logo size
const INITIAL_SPEED = 150;

const FOOD_ITEMS = [
    {
        name: 'Google',
        image: googleLogo,
        className: 'logo-google',
    },
    {
        name: 'Apple',
        image: appleLogo,
        className: 'logo-apple',
    },
    {
        name: 'Meta',
        image: metaLogo,
        className: 'logo-meta',
    },
    {
        name: 'Amazon',
        image: amazonLogo,
        className: 'logo-amazon',
    },
    {
        name: 'Microsoft',
        image: microsoftLogo,
        className: 'logo-microsoft',
    },
    {
        name: 'Tesla',
        image: teslaLogo,
        className: 'logo-tesla',
    },
    {
        name: 'TRUMP 🎁',
        image: trumpLogo,
        className: 'logo-trump',
        isBonus: true
    },
];


const SnakeGame = ({ onClose }) => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [food, setFood] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [countdown, setCountdown] = useState(3); // 3-second countdown
    const [gameStarted, setGameStarted] = useState(false);
    const directionRef = useRef({ x: 1, y: 0 });
    const gameLoopRef = useRef(null);

    // Generate random food position
    const generateFood = useCallback(() => {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
            type: FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)]
        };
        setFood(newFood);
    }, []);

    // Initialize food
    useEffect(() => {
        generateFood();
    }, [generateFood]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !gameStarted) {
            setGameStarted(true);
        }
    }, [countdown, gameStarted]);

    // Handle keyboard input
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === ' ') {
            if (gameStarted) {
                setIsPaused(prev => !prev);
            }
            return;
        }

        if (gameOver || !gameStarted) return;

        const keyMap = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 },
            'w': { x: 0, y: -1 },
            's': { x: 0, y: 1 },
            'a': { x: -1, y: 0 },
            'd': { x: 1, y: 0 },
        };

        const newDirection = keyMap[e.key];
        if (newDirection) {
            // Prevent reversing direction
            if (
                newDirection.x !== -directionRef.current.x ||
                newDirection.y !== -directionRef.current.y
            ) {
                directionRef.current = newDirection;
                setDirection(newDirection);
            }
        }
    }, [gameOver, gameStarted, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Game loop
    useEffect(() => {
        if (gameOver || isPaused || !gameStarted) return;

        gameLoopRef.current = setInterval(() => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const newHead = {
                    x: head.x + directionRef.current.x,
                    y: head.y + directionRef.current.y
                };

                // Check wall collision
                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check self collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food collision
                if (food && newHead.x === food.x && newHead.y === food.y) {
                    // Bonus points for Trump!
                    const points = food.type.isBonus ? 50 : 10;
                    setScore(prev => prev + points);
                    generateFood();
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                return newSnake;
            });
        }, INITIAL_SPEED);

        return () => clearInterval(gameLoopRef.current);
    }, [gameOver, isPaused, gameStarted, food, generateFood]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 1, y: 0 });
        directionRef.current = { x: 1, y: 0 };
        setScore(0);
        setGameOver(false);
        setIsPaused(false);
        setCountdown(3);
        setGameStarted(false);
        generateFood();
    };

    return (
        <div className="snake-game-overlay retro" onClick={onClose}>
            <div className="arcade-cabinet" onClick={(e) => e.stopPropagation()}>
                <img src={arcadeImage} alt="Arcade Cabinet" className="arcade-background" />

                {/* Compact game UI positioned on arcade screen */}
                <div className="arcade-screen-content">
                    {/* Minimal header */}
                    <div className="game-header-minimal">
                        <h2 className="retro-title-small">LINUX vs GAFA</h2>
                        <span className="score-minimal">SCORE: {score.toString().padStart(4, '0')}</span>
                    </div>

                    {/* Game status overlay */}
                    <div className="game-status-overlay">
                        {!gameStarted && countdown > 0 ? (
                            <div className="countdown">
                                <p className="countdown-number">{countdown}</p>
                            </div>
                        ) : gameOver ? (
                            <div className="game-over retro">
                                <p className="retro-text">GAME OVER!</p>
                                <p className="retro-text">SCORE: {score}</p>
                                <button className="retro-btn" onClick={resetGame}>REPLAY</button>
                            </div>
                        ) : isPaused ? (
                            <p className="retro-text pause-text">⏸ PAUSED</p>
                        ) : null}
                    </div>

                    {/* Game board */}
                    <div className="game-board retro-board">
                        {/* Render snake */}
                        {snake.map((segment, index) => (
                            <div
                                key={index}
                                className={`snake-segment retro-snake ${index === 0 ? 'head' : ''}`}
                                style={{
                                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                                    width: `${(1 / GRID_SIZE) * 100}%`,
                                    height: `${(1 / GRID_SIZE) * 100}%`,
                                }}
                            >
                                {index === 0 && <span className="penguin-pixel">🐧</span>}
                            </div>
                        ))}

                        {/* Render food */}
                        {food && (
                            <div
                                className={`food retro-food ${food.type.className}`}
                                style={{
                                    left: `${(food.x / GRID_SIZE) * 100}%`,
                                    top: `${(food.y / GRID_SIZE) * 100}%`,
                                    width: `${(1.4 / GRID_SIZE) * 100}%`,
                                    height: `${(1.4 / GRID_SIZE) * 100}%`,
                                    transform: 'translate(-20%, -20%)',
                                }}
                                title={food.type.name}
                            >
                                <img
                                    src={food.type.image}
                                    alt={food.type.name}
                                    className="logo-image"
                                />
                            </div>
                        )}
                    </div>

                    {/* Minimal controls hint */}
                    {gameStarted && !gameOver && !isPaused && (
                        <div className="controls-hint">
                            <span>←→↑↓</span> <span>SPC</span> <span>ESC</span>
                        </div>
                    )}
                </div>

                {/* Close button positioned on cabinet */}
                <button className="close-btn-arcade" onClick={onClose}>✕</button>
            </div>
        </div>
    );
};

export default SnakeGame;
