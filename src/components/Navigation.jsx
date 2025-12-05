import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Navigation.scss';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const linksRef = useRef([]);

    // Reset refs on render to avoid duplicates
    linksRef.current = [];

    const addToRefs = (el) => {
        if (el && !linksRef.current.includes(el)) {
            linksRef.current.push(el);
        }
    };

    useEffect(() => {
        if (isOpen) {
            gsap.to(menuRef.current, { x: '0%', duration: 0.8, ease: 'power3.out' });
            gsap.fromTo(linksRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
            );
        } else {
            gsap.to(menuRef.current, { x: '100%', duration: 0.8, ease: 'power3.inOut' });
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLinkClick = (id) => {
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <button className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span className="line"></span>
                <span className="line"></span>
            </button>

            <div className="navigation-overlay" ref={menuRef}>
                <nav className="nav-links">
                    <a onClick={() => handleLinkClick('hero')} ref={addToRefs}>Accueil</a>
                    <a onClick={() => handleLinkClick('demarche')} ref={addToRefs}>La Démarche</a>
                    <a onClick={() => handleLinkClick('piliers')} ref={addToRefs}>Les Piliers</a>
                    <a onClick={() => handleLinkClick('chatbot')} ref={addToRefs}>L'Arène</a>
                    <a onClick={() => handleLinkClick('rejoindre')} ref={addToRefs}>Rejoindre</a>
                </nav>
                <div className="nav-footer">
                    <p>Avenird © 2025</p>
                </div>
            </div>
        </>
    );
};

export default Navigation;
