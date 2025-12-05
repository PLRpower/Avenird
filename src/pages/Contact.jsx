import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../App.scss';

const Contact = () => {
    const [activeSwitch, setActiveSwitch] = useState(null);
    const [unlockedElement, setUnlockedElement] = useState(null);
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

    // Generate switches
    const switchCount = 40;
    const switches = Array.from({ length: switchCount }, (_, i) => i);

    const fields = [
        { name: 'nom', label: 'Nom' },
        { name: 'prenom', label: 'Prénom' },
        { name: 'email', label: 'Email' },
        { name: 'telephone', label: 'Téléphone' },
        { name: 'adresse', label: 'Adresse' },
        { name: 'ville', label: 'Ville' },
        { name: 'sujet', label: 'Sujet' },
        { name: 'message', label: 'Message', type: 'textarea' }
    ];

    // All possible targets: fields + submit button
    const targets = [...fields.map(f => f.name), 'submit'];

    const handleSwitchChange = (index) => {
        setActiveSwitch(index);

        // Randomly unlock ONE element (field or submit button)
        const randomTarget = targets[Math.floor(Math.random() * targets.length)];
        setUnlockedElement(randomTarget);

        // Random Glitch Effect
        const colors = ['var(--color-primary)', 'var(--color-text)', '#ff0000', '#ffffff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Animate background or border flash
        gsap.to(containerRef.current, {
            backgroundColor: Math.random() > 0.7 ? 'var(--color-primary)' : 'var(--color-secondary)',
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to(containerRef.current, { backgroundColor: 'var(--color-secondary)', duration: 0.5 });
            }
        });

        // Shake the form slightly
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
                    <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.7 }}>
                        Sécurisation maximale. Veuillez activer le canal approprié pour transmettre vos données.
                    </p>

                    {/* Switches Grid */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '15px',
                        justifyContent: 'center',
                        marginBottom: '4rem',
                        padding: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        {switches.map((index) => (
                            <div key={index} className="tech-switch">
                                <input
                                    type="checkbox"
                                    id={`switch-${index}`}
                                    checked={activeSwitch === index}
                                    onChange={() => handleSwitchChange(index)}
                                />
                                <label htmlFor={`switch-${index}`}></label>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
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
                                    {isTextArea ? (
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

                /* Custom Switch Styling */
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
            `}</style>
        </div>
    );
};

export default Contact;
