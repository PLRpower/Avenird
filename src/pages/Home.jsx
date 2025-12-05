import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatbotArena from '../components/ChatbotArena';
import demarcheImg from '../assets/images/demarche.png';
import pillarsImg from '../assets/images/pillars.png';
import joinImg from '../assets/images/join.png';
import '../App.scss';

gsap.registerPlugin(ScrollTrigger);

function Home() {
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
                    <h1 ref={titleRef}>AVENIRD</h1>
                    <p ref={textRef}>
                        Le Village Numérique Résistant. <br />
                        Comment les établissements scolaires peuvent tenir tête aux Big Tech ?
                        Une démarche pour un Numérique Inclusif, Responsable et Durable.
                    </p>
                    <div className="scroll-indicator" ref={scrollRef}>
                        Scroll to explore
                    </div>
                    <div className="logo-hero">NIRD 2025</div>
                </section>

                <section className="content-section section-dark" id="demarche">
                    <div className="section-content-wrapper">
                        <div className="text-col">
                            <h2>La Démarche</h2>
                            <p>
                                Face à ce Goliath numérique, l'École peut devenir un village résistant, ingénieux, autonome et créatif.
                                C'est précisément l'ambition de la démarche NIRD : permettre aux établissements scolaires d'adopter progressivement
                                un Numérique Inclusif, Responsable et Durable.
                            </p>
                            <p>
                                En redonnant du pouvoir d'agir aux équipes éducatives et en renforçant leur autonomie technologique,
                                nous construisons ensemble l'avenir de l'éducation numérique.
                            </p>
                        </div>
                        <div className="image-col">
                            <img src={demarcheImg} alt="La démarche NIRD" />
                        </div>
                    </div>
                </section>

                <section className="content-section section-light" id="piliers">
                    <div className="section-content-wrapper reverse">
                        <div className="image-col">
                            <img src={pillarsImg} alt="Les piliers" />
                        </div>
                        <div className="text-col">
                            <h2>Les Piliers</h2>
                            <p>
                                <strong>Inclusif :</strong> Pour que le numérique soit accessible à tous, sans discrimination.
                            </p>
                            <p>
                                <strong>Responsable :</strong> Pour un usage éthique et conscient des technologies.
                            </p>
                            <p>
                                <strong>Durable :</strong> Pour lutter contre l'obsolescence programmée et réduire l'empreinte écologique.
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
                            <h2>Rejoignez le mouvement</h2>
                            <p>
                                Ensemble, expérimentons, partageons et transformons les pratiques pour construire un numérique éducatif plus autonome.
                            </p>
                        </div>
                        <div className="image-col">
                            <img src={joinImg} alt="Rejoignez-nous" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
