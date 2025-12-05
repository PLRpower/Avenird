import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatbotArena from '../components/ChatbotArena';
import SnakeGame from '../components/SnakeGame';
import demarcheImg from '../assets/images/demarche.png';
import pillarsImg from '../assets/images/pillars.png';
import joinImg from '../assets/images/join.png';
import '../App.scss';

gsap.registerPlugin(ScrollTrigger);

function Home() {
    const [showSnake, setShowSnake] = useState(false);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const scrollRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // GSAP Animations - Simplified
        const tl = gsap.timeline();

        // Animate Hero Section immediately
        tl.to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        })
            .to(textRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5")
            .to(scrollRef.current, {
                opacity: 1,
                duration: 0.8
            }, "-=0.3");

        // Simple fade-in for content sections on scroll
        const sections = gsap.utils.toArray('.content-section');

        sections.forEach(section => {
            const text = section.querySelector('.text-col');
            const image = section.querySelector('.image-col');

            if (text) {
                gsap.fromTo(text,
                    { autoAlpha: 0, x: -50 },
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                        }
                    }
                );
            }

            if (image) {
                gsap.fromTo(image,
                    { autoAlpha: 0, x: 50, scale: 0.95 },
                    {
                        autoAlpha: 1,
                        x: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                        }
                    }
                );
            }

            // Fallback for sections without columns (like Chatbot) or if we just want to animate the whole container
            if (!text && !image) {
                gsap.fromTo(section,
                    { autoAlpha: 0, y: 30 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                        }
                    }
                );
            }
        });

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        if (location.state && location.state.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }, [location]);

    return (
        <div className="main-container" ref={containerRef}>
            <div className="content-left">
                <section className="hero-section" id="hero">
                    <h1
                        ref={titleRef}
                        onClick={() => setShowSnake(true)}
                        style={{ cursor: 'pointer' }}
                        title="Cliquez pour jouer au Snake !"
                    >
                        AVENIRD
                    </h1>
                    <p ref={textRef}>
                        Face à la domination des géants du numérique, <br />
                        l'école peut reprendre son autonomie technologique et devenir un modèle de résistance numérique responsable.
                    </p>
                    <div className="scroll-indicator" ref={scrollRef}>
                        Scroll to explore
                    </div>
                    <div className="logo-hero">NIRD 2025</div>
                </section>

                <section className="content-section section-dark" id="demarche">
                    <div className="section-content-wrapper">
                        <div className="text-col">
                            <h2>Les Dangers de la Dépendance Numérique</h2>
                            <p>
                                Les établissements scolaires sont aujourd'hui piégés dans un écosystème numérique contrôlé par quelques géants technologiques.
                                Cette dépendance entraîne des <strong>coûts croissants</strong>, une <strong>obsolescence programmée</strong> du matériel,
                                et une <strong>perte d'autonomie</strong> dans les choix pédagogiques et techniques.
                            </p>
                            <p>
                                Les données des élèves et enseignants sont collectées massivement, les logiciels propriétaires imposent leurs formats,
                                et les équipements deviennent rapidement obsolètes, générant des tonnes de déchets électroniques.
                                Face à ce constat, une alternative existe.
                            </p>
                        </div>
                        <div className="image-col">
                            <img src={demarcheImg} alt="Les dangers de la dépendance numérique" />
                        </div>
                    </div>
                </section>

                <section className="content-section section-light" id="piliers">
                    <div className="section-content-wrapper reverse">
                        <div className="image-col">
                            <img src={pillarsImg} alt="NIRD" />
                        </div>
                        <div className="text-col">
                            <h2>NIRD : Un Organisme au Service de l'Autonomie Numérique</h2>
                            <p>
                                <strong>NIRD</strong> (Numérique Inclusif, Responsable et Durable) est une démarche qui accompagne les établissements scolaires
                                dans leur transition vers un numérique éthique et souverain. Notre mission : redonner du pouvoir d'agir aux équipes éducatives
                                en proposant des solutions concrètes et accessibles.
                            </p>
                            <p>
                                Nous croyons que l'école peut devenir un <strong>village numérique résistant</strong>, ingénieux et créatif,
                                capable de faire face aux géants de la tech tout en formant les citoyens numériques de demain.
                                NIRD propose une feuille de route progressive, adaptée aux réalités de chaque établissement.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="content-section section-dark" id="chatbot">
                    <ChatbotArena />
                </section>

                <section className="content-section section-red" id="rejoindre" style={{ paddingBottom: '10vh' }}>
                    <div className="section-content-wrapper">
                        <div className="text-col">
                            <h2>Les Solutions Concrètes de NIRD</h2>
                            <p>
                                NIRD propose d'adopter <strong>progressivement Linux comme socle technique</strong>, de privilégier les logiciels libres,
                                et de développer des projets de réemploi et reconditionnement du matériel avec la participation des élèves.
                                Cette approche permet de prolonger la durée de vie des ordinateurs, réduire les coûts et les déchets électroniques.
                            </p>
                            <p>
                                La démarche mobilise toute la communauté éducative : <strong>ateliers "Install Party"</strong> pour migrer vers des systèmes libres,
                                création d'ateliers de reconditionnement, catalogue d'alternatives libres, hébergement local des services,
                                <strong>formations courtes et ludiques</strong> ("1h pour passer ton PC sous Linux"), et documentation des réussites
                                pour inspirer d'autres établissements et influencer les politiques d'achats numériques responsables.
                            </p>
                        </div>
                        <div className="image-col">
                            <img src={joinImg} alt="Solutions NIRD" />
                        </div>
                    </div>
                </section>
            </div>

            {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
        </div>
    );
}

export default Home;
