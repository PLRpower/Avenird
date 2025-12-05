import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../App.scss';

// --- CUSTOM ANNOYING INPUTS ---

const PhoneInput = ({ value, onChange, disabled }) => {
    const [currentNum, setCurrentNum] = useState(0);
    const [speed, setSpeed] = useState(100); // ms
    const [parts, setParts] = useState([]);
    const [isRunning, setIsRunning] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (disabled) return;
        if (isRunning && parts.length < 5) {
            intervalRef.current = setInterval(() => {
                setCurrentNum(prev => (prev + 1) % 100);
            }, speed);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, speed, parts.length, disabled]);

    const handleStop = (e) => {
        e.preventDefault();
        if (parts.length < 5) {
            const formatted = currentNum.toString().padStart(2, '0');
            const newParts = [...parts, formatted];
            setParts(newParts);
            onChange({ target: { name: 'telephone', value: newParts.join(' ') } });

            // Reset for next number if not done
            if (newParts.length < 5) {
                setCurrentNum(0);
            } else {
                setIsRunning(false);
            }
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        setParts([]);
        onChange({ target: { name: 'telephone', value: '' } });
        setIsRunning(true);
    };

    const changeSpeed = (e, delta) => {
        e.preventDefault();
        setSpeed(prev => Math.max(10, Math.min(2000, prev + delta)));
    };

    if (disabled) return <input type="text" value={value} disabled className="tech-input" />;

    return (
        <div className="annoying-input-container">
            <div className="phone-display">
                {parts.map((p, i) => <span key={i} className="phone-part">{p}</span>)}
                {parts.length < 5 && <span className="phone-part active">{currentNum.toString().padStart(2, '0')}</span>}
                {Array.from({ length: 4 - parts.length }).map((_, i) => <span key={i} className="phone-part placeholder">__</span>)}
            </div>

            {parts.length < 5 ? (
                <div className="controls">
                    <button onClick={(e) => changeSpeed(e, 50)} className="control-btn">Slower</button>
                    <button onClick={handleStop} className="control-btn action">CAPTURE</button>
                    <button onClick={(e) => changeSpeed(e, -50)} className="control-btn">Faster</button>
                </div>
            ) : (
                <div className="controls">
                    <span style={{ color: 'lime' }}>COMPLETED</span>
                    <button onClick={handleReset} className="control-btn danger">RESET</button>
                </div>
            )}
            <div className="speed-indicator">Speed: {speed}ms</div>
        </div>
    );
};

const Contact = () => {
    const [activeSwitch, setActiveSwitch] = useState(null);
    const [unlockedElement, setUnlockedElement] = useState(null);
    const [statusMessage, setStatusMessage] = useState("EN ATTENTE D'INITIALISATION...");
    const [switches, setSwitches] = useState(Array.from({ length: 40 }, (_, i) => i));

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        sujet: '',
        message: ''
    });

    const containerRef = useRef(null);
    const formRef = useRef(null);
    const messageRef = useRef(null);

    const fields = [
        { name: 'nom', label: 'Nom' },
        { name: 'prenom', label: 'Prénom' },
        { name: 'email', label: 'Email' },
        { name: 'telephone', label: 'Téléphone', component: 'phone' },
        { name: 'adresse', label: 'Adresse' },
        { name: 'ville', label: 'Ville' },
        { name: 'sujet', label: 'Sujet' },
        { name: 'message', label: 'Message', type: 'textarea' }
    ];

    const targets = [...fields.map(f => f.name), 'submit'];

    const handleSwitchChange = (index) => {
        setActiveSwitch(index);

        setSwitches(prevSwitches => {
            let newSwitches = [...prevSwitches];
            if (Math.random() > 0.7 && newSwitches.length > 10) {
                const toRemove = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < toRemove; i++) {
                    if (newSwitches.length > 10) {
                        const removeIdx = Math.floor(Math.random() * newSwitches.length);
                        newSwitches.splice(removeIdx, 1);
                    }
                }
            }
            if (Math.random() > 0.6 && newSwitches.length < 100) {
                const toAdd = Math.floor(Math.random() * 5) + 1;
                const maxId = Math.max(...newSwitches, 0);
                for (let i = 1; i <= toAdd; i++) {
                    newSwitches.push(maxId + i);
                }
            }
            return newSwitches.sort((a, b) => a - b);
        });

        const isSuccess = Math.random() > 0.3;

        if (isSuccess) {
            const randomTarget = targets[Math.floor(Math.random() * targets.length)];
            setUnlockedElement(randomTarget);

            if (randomTarget === 'submit') {
                setStatusMessage("⚠️ ALERTE : PROTOCOLE D'ENVOI ACTIVÉ. CONFIRMATION REQUISE.");
            } else {
                const fieldLabel = fields.find(f => f.name === randomTarget)?.label;
                setStatusMessage(`ACCÈS ACCORDÉ : CHAMP [${fieldLabel.toUpperCase()}] DÉVERROUILLÉ.`);
            }
            gsap.to(messageRef.current, { color: '#00ff00', duration: 0.2, yoyo: true, repeat: 1, clearProps: 'color' });

        } else {
            setUnlockedElement(null);
            const errorMessages = [
                "ERREUR 404 : CHAMP INTROUVABLE.",
                "ACCÈS REFUSÉ. TENTATIVE NON AUTORISÉE.",
                "INTERRUPTEUR DÉFECTUEUX. VEUILLEZ RÉESSAYER.",
                "CALIBRAGE ÉCHOUÉ. SYSTÈME INSTABLE.",
                "NON. JUSTE NON.",
                "ESSAYEZ ENCORE. (OU PAS)."
            ];
            setStatusMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
            gsap.to(messageRef.current, { color: '#ff0000', duration: 0.2, yoyo: true, repeat: 3, clearProps: 'color' });
        }

        gsap.to(containerRef.current, {
            backgroundColor: Math.random() > 0.8 ? '#4a0000' : (Math.random() > 0.8 ? '#00004a' : 'var(--color-secondary)'),
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to(containerRef.current, { backgroundColor: 'var(--color-secondary)', duration: 0.5 });
            }
        });

        gsap.fromTo(formRef.current,
            { x: -5 },
            { x: 5, duration: 0.05, repeat: 3, yoyo: true, clearProps: "x" }
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="main-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div
                ref={containerRef}
                className="content-section section-dark"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingTop: '100px',
                    transition: 'background-color 0.5s ease'
                }}
            >
                <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '2rem' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}>
                        Protocole de Contact
                    </h1>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.7 }}>
                        Sécurisation maximale. Veuillez activer le canal approprié pour transmettre vos données.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '15px',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        padding: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.2)',
                        minHeight: '150px'
                    }}>
                        {switches.map((id) => (
                            <div key={id} className="tech-switch">
                                <input
                                    type="checkbox"
                                    id={`switch-${id}`}
                                    checked={activeSwitch === id}
                                    onChange={() => handleSwitchChange(id)}
                                />
                                <label htmlFor={`switch-${id}`}></label>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginBottom: '2rem',
                        minHeight: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <p
                            ref={messageRef}
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '1.2rem',
                                padding: '10px 20px',
                                border: '1px dashed rgba(255,255,255,0.3)',
                                background: 'rgba(0,0,0,0.3)',
                                display: 'inline-block',
                                color: 'var(--color-text)'
                            }}
                        >
                            {statusMessage}
                        </p>
                    </div>

                    <form ref={formRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {fields.map((field) => {
                            const isUnlocked = unlockedElement === field.name;
                            const isTextArea = field.type === 'textarea';

                            return (
                                <div key={field.name} style={{
                                    gridColumn: isTextArea ? '1 / -1' : 'auto',
                                    opacity: isUnlocked ? 1 : 0.3,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontFamily: 'var(--font-title)',
                                        fontSize: '0.9rem',
                                        color: isUnlocked ? 'var(--color-primary)' : 'var(--color-text)'
                                    }}>
                                        {field.label} {isUnlocked ? '' : '🔒'}
                                    </label>

                                    {field.component === 'phone' ? (
                                        <PhoneInput
                                            value={formData[field.name]}
                                            onChange={handleInputChange}
                                            disabled={!isUnlocked}
                                        />
                                    ) : (
                                        isTextArea ? (
                                            <textarea
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                disabled={!isUnlocked}
                                                rows={4}
                                                className="tech-input"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                disabled={!isUnlocked}
                                                className="tech-input"
                                            />
                                        )
                                    )}
                                </div>
                            );
                        })}

                        <div style={{ gridColumn: '1 / -1', marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                disabled={unlockedElement !== 'submit'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Transmission réussie... peut-être.');
                                }}
                                style={{
                                    padding: '1rem 3rem',
                                    fontFamily: 'var(--font-title)',
                                    fontSize: '1.2rem',
                                    textTransform: 'uppercase',
                                    backgroundColor: unlockedElement === 'submit' ? 'var(--color-primary)' : 'transparent',
                                    color: unlockedElement === 'submit' ? 'white' : 'rgba(255,255,255,0.2)',
                                    border: '1px solid',
                                    borderColor: unlockedElement === 'submit' ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                    cursor: unlockedElement === 'submit' ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '2px'
                                }}
                            >
                                {unlockedElement === 'submit' ? 'INITIALISER LA TRANSMISSION' : 'TRANSMISSION VERROUILLÉE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .tech-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                    padding: 10px;
                    color: white;
                    font-family: var(--font-text);
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .tech-input:focus {
                    outline: none;
                    border-bottom-color: var(--color-primary);
                    background: rgba(255, 255, 255, 0.1);
                }
                .tech-input:disabled {
                    cursor: not-allowed;
                    border-bottom-style: dashed;
                }

                .tech-switch {
                    position: relative;
                    width: 40px;
                    height: 20px;
                }
                .tech-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .tech-switch label {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #1a1a1a;
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: .4s;
                }
                .tech-switch label:before {
                    position: absolute;
                    content: "";
                    height: 14px;
                    width: 14px;
                    left: 2px;
                    bottom: 2px;
                    background-color: rgba(255,255,255,0.5);
                    transition: .4s;
                }
                .tech-switch input:checked + label {
                    background-color: var(--color-primary);
                    border-color: var(--color-primary);
                    box-shadow: 0 0 10px var(--color-primary);
                }
                .tech-switch input:checked + label:before {
                    transform: translateX(20px);
                    background-color: white;
                }

                /* Annoying Inputs Styles */
                .annoying-input-container {
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 5px;
                }
                .phone-display {
                    display: flex;
                    gap: 10px;
                    font-family: monospace;
                    font-size: 1.5rem;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .phone-part {
                    padding: 5px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                }
                .phone-part.active {
                    background: var(--color-primary);
                    color: white;
                    animation: pulse 0.5s infinite alternate;
                }
                .controls {
                    display: flex;
                    gap: 5px;
                    justify-content: center;
                    align-items: center;
                }
                .control-btn {
                    padding: 5px 10px;
                    background: #333;
                    border: 1px solid #555;
                    color: white;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                .control-btn:hover { background: #444; }
                .control-btn.action { background: var(--color-primary); border-color: var(--color-primary); }
                .control-btn.danger { background: #ff4444; border-color: #ff0000; }
                
                .speed-indicator {
                    text-align: center;
                    font-size: 0.7rem;
                    opacity: 0.5;
                    margin-top: 5px;
                }

                @keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Contact;
