import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatbotArena from './components/ChatbotArena';
import './App.scss';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const scrollRef = useRef(null);

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

    // GSAP Animations
    const tl = gsap.timeline();

    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
      delay: 0.2
    })
      .to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=1")
      .to(scrollRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");

    // Scroll Animations for content sections
    gsap.utils.toArray('.content-section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="main-container" ref={containerRef}>
      <div className="content-left">
        <section className="hero-section">
          <h1 ref={titleRef}>AVENIRD</h1>
          <p ref={textRef}>
            Le Village Numérique Résistant. <br />
            Comment les établissements scolaires peuvent tenir tête aux Big Tech ?
            Une démarche pour un Numérique Inclusif, Responsable et Durable.
          </p>
          <div className="scroll-indicator" ref={scrollRef}>
            Scroll to explore
          </div>
        </section>

        <section className="content-section">
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
        </section>

        <section className="content-section">
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
        </section>

        <section className="content-section">
          <ChatbotArena />
        </section>

        <section className="content-section" style={{ paddingBottom: '20vh' }}>
          <h2>Rejoignez le mouvement</h2>
          <p>
            Ensemble, expérimentons, partageons et transformons les pratiques pour construire un numérique éducatif plus autonome.
          </p>
        </section>
      </div>

      <div className="sidebar-right">
        <div className="menu-btn">
          <span></span>
        </div>
        <div className="logo">NIRD 2025</div>
      </div>
    </div>
  );
}

export default App;
