import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './Navigation.scss';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const backdropRef = useRef(null);
    const linksRef = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

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
            gsap.to(backdropRef.current, { opacity: 1, duration: 0.8, display: 'block', ease: 'power3.out' });
            gsap.fromTo(linksRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
            );
        } else {
            gsap.to(menuRef.current, { x: '100%', duration: 0.8, ease: 'power3.inOut' });
            gsap.to(backdropRef.current, { opacity: 0, duration: 0.8, display: 'none', ease: 'power3.inOut' });
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLinkClick = (id) => {
        setIsOpen(false);

        if (id === 'contact') {
            navigate('/contact');
            return;
        }

        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <button className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span className="line"></span>
                <span className="line"></span>
            </button>

            <div className="navigation-backdrop" ref={backdropRef} onClick={() => setIsOpen(false)}></div>

            <div className="navigation-overlay" ref={menuRef}>
                <nav className="nav-links">
                    <a onClick={() => handleLinkClick('hero')} ref={addToRefs}>Accueil</a>
                    <a onClick={() => handleLinkClick('demarche')} ref={addToRefs}>La Démarche</a>
                    <a onClick={() => handleLinkClick('piliers')} ref={addToRefs}>Les Piliers</a>
                    <a onClick={() => handleLinkClick('chatbot')} ref={addToRefs}>L'Arène</a>
                    <a onClick={() => handleLinkClick('rejoindre')} ref={addToRefs}>Rejoindre</a>
                    <a onClick={() => handleLinkClick('contact')} ref={addToRefs}>Formulaire de contact</a>
                </nav>
                <div className="nav-footer">
                    <p>Avenird © 2025</p>
                </div>
            </div>
        </>
    );
};

export default Navigation;
