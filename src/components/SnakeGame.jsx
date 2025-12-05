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

const GRID_SIZE = 20; // Reduced to fit on screen
const CELL_SIZE = 18; // Snake cell size
const FOOD_SIZE = 26; // Food/logo size (bigger for visibility)
const INITIAL_SPEED = 120;

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
            <div className="snake-game-container retro" onClick={(e) => e.stopPropagation()}>
                <div className="game-header retro">
                    <h2 className="retro-title">🐧 LINUX vs GAFA 🐧</h2>
                    <div className="game-info">
                        <span className="score retro-text">SCORE: {score.toString().padStart(4, '0')}</span>
                        <button className="close-btn retro-btn" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="game-instructions retro">
                    {!gameStarted && countdown > 0 ? (
                        <div className="countdown">
                            <p className="countdown-number">{countdown}</p>
                            <p className="countdown-text">GET READY!</p>
                        </div>
                    ) : gameOver ? (
                        <div className="game-over retro">
                            <p className="retro-text">GAME OVER!</p>
                            <p className="retro-text">FINAL SCORE: {score}</p>
                            <button className="retro-btn" onClick={resetGame}>PLAY AGAIN</button>
                        </div>
                    ) : isPaused ? (
                        <p className="retro-text">⏸ PAUSED - PRESS SPACE</p>
                    ) : (
                        <p className="retro-text">ARROWS/WASD • SPACE=PAUSE • ESC=QUIT</p>
                    )}
                </div>

                <div
                    className="game-board retro-board"
                    style={{
                        width: GRID_SIZE * CELL_SIZE,
                        height: GRID_SIZE * CELL_SIZE,
                    }}
                >
                    {/* Render snake */}
                    {snake.map((segment, index) => (
                        <div
                            key={index}
                            className={`snake-segment retro-snake ${index === 0 ? 'head' : ''}`}
                            style={{
                                left: segment.x * CELL_SIZE,
                                top: segment.y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
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
                                left: food.x * CELL_SIZE - (FOOD_SIZE - CELL_SIZE) / 2,
                                top: food.y * CELL_SIZE - (FOOD_SIZE - CELL_SIZE) / 2,
                                width: FOOD_SIZE,
                                height: FOOD_SIZE,
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

                <div className="game-footer retro">
                    <p className="retro-text">TUX DEVOURS BIG TECH!</p>
                    <div className="retro-legends">
                        {FOOD_ITEMS.map((item, idx) => (
                            <span key={idx} className="legend-item" style={{ color: item.color }}>
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakeGame;
