import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatbotArena from '../components/ChatbotArena';
import SnakeGame from '../components/SnakeGame';
import demarcheImg from '../assets/images/demarche.png';

import joinImg from '../assets/images/join.png';
import linuxLogo from '../assets/images/linux.png';
import pensesImg from '../assets/images/img_tu_penses.png';
import franceImg from '../assets/images/france.png';
import '../App.scss';
import './_home-additions.scss';

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
                    <h1 ref={titleRef}>
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
                            <h2>Le Problème dans nos Universités</h2>
                            <p>
                                Les établissements scolaires et universitaires sont aujourd'hui piégés dans un écosystème numérique contrôlé par quelques géants technologiques.
                                Cette dépendance entraîne des <strong>coûts croissants</strong>, une <strong>obsolescence programmée</strong> du matériel,
                                et une <strong>perte d'autonomie</strong> dans les choix pédagogiques et techniques.
                            </p>
                            <p>
                                Les données des étudiants et chercheurs sont collectées massivement, les logiciels propriétaires imposent leurs formats,
                                et les équipements deviennent rapidement obsolètes, générant des tonnes de déchets électroniques.
                            </p>
                            <p>
                                <strong>Les conséquences sont multiples :</strong> budgets engloutis dans des licences onéreuses,
                                dépendance à des fournisseurs qui dictent leurs conditions, et exposition à des risques de sécurité.
                                Les universités perdent leur capacité à innover et à maîtriser leur propre savoir.
                            </p>
                        </div>
                        <div className="text-col">
                            <h2>Et en France ?</h2>
                            <p>
                                À l'échelle nationale, le constat est tout aussi alarmant. La <strong>souveraineté numérique</strong> de la France
                                est mise à mal par l'omniprésence des solutions extra-européennes dans nos administrations et nos services publics.
                            </p>
                            <p>
                                Malgré des initiatives encourageantes, le manque de <strong>volonté politique forte</strong> et de <strong>budgets dédiés</strong>
                                freine l'adoption massive de solutions libres et souveraines. Le "Cloud Souverain" reste encore trop souvent un vœu pieux
                                face à la puissance de frappe des GAFAM.
                            </p>
                            <p>
                                Il est urgent de repenser notre stratégie numérique nationale : investir dans des <strong>infrastructures publiques</strong>,
                                soutenir l'écosystème du logiciel libre français, et imposer des standards ouverts dans la commande publique
                                pour garantir notre indépendance technologique future.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="content-section section-light" id="piliers">
                    <div className="section-content-wrapper reverse">
                        <div className="image-col">
                            <img
                                src="https://img.linuxfr.org/img/68747470733a2f2f6e6972642e666f7267652e617070732e656475636174696f6e2e66722f696d672f6c6f676f2b7465787432303670782e706e67/logo+text206px.png"
                                alt="NIRD"
                                style={{ filter: 'grayscale(100%) opacity(0.7)' }}
                            />
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
                            </p>
                            <p>
                                NIRD propose une feuille de route progressive, adaptée aux réalités de chaque établissement :
                                <strong> migration progressive vers Linux</strong>, adoption de logiciels libres,
                                mise en place d'ateliers de reconditionnement avec les élèves, création de serveurs locaux pour l'hébergement de données,
                                et formations courtes et ludiques pour toute la communauté éducative.
                            </p>
                            <p>
                                Cette approche permet non seulement de <strong>réduire drastiquement les coûts</strong>, mais aussi de
                                <strong> prolonger la durée de vie du matériel</strong>, de limiter les déchets électroniques,
                                et surtout de <strong>redonner du sens</strong> à l'usage du numérique à l'école en impliquant activement les élèves
                                dans la compréhension et la maîtrise de leurs outils.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="content-section section-dark" id="ia-intro">
                    <div className="section-content-wrapper">
                        <div className="text-col">
                            <h2>L'Intelligence Artificielle : Comprendre Pour Mieux Choisir</h2>
                            <p>
                                L'intelligence artificielle transforme profondément notre rapport au numérique et à l'information.
                                Dans le contexte éducatif, il est crucial de <strong>comprendre les différences entre les modèles d'IA </strong>
                                et leurs implications en termes de confidentialité, de biais, et de dépendance technologique.
                            </p>
                            <p>
                                Les grands acteurs du marché (Google, OpenAI, Anthropic, Meta) proposent des solutions performantes,
                                mais souvent opaques et centralisées. Leurs modèles collectent massivement des données,
                                imposent leurs propres règles de modération, et créent une nouvelle forme de dépendance numérique.
                            </p>
                            <p>
                                Face à ces géants, des <strong>alternatives libres et transparentes</strong> émergent,
                                permettant aux établissements de garder le contrôle sur leurs données et leurs usages pédagogiques.
                                Testez et comparez ces différents modèles dans notre arène ci-dessous pour mieux comprendre leurs forces,
                                leurs faiblesses, et faire des choix éclairés.
                            </p>
                        </div>
                        <div className="image-col">
                            <img src={pensesImg} alt="Intelligence Artificielle" className="no-shadow" />
                        </div>
                    </div>
                </section>

                <section className="content-section section-dark" id="chatbot">
                    <ChatbotArena />
                </section>

                <section className="content-section section-red" id="linux-opensource">
                    <div className="section-content-wrapper">
                        <div className="text-col">
                            <h2>Linux et l'Open Source : La Liberté Technologique</h2>
                            <p>
                                <strong>Linux</strong> n'est pas qu'un simple système d'exploitation : c'est un symbole de liberté,
                                de collaboration et d'autonomie numérique. Créé par des milliers de développeurs à travers le monde,
                                Linux offre une alternative <strong>gratuite, stable, et sécurisée</strong> aux systèmes propriétaires.
                            </p>
                            <p>
                                En adoptant Linux et les logiciels libres, les établissements scolaires peuvent :
                            </p>
                            <ul>
                                <li><strong>Réduire drastiquement leurs coûts</strong> en éliminant les licences propriétaires</li>
                                <li><strong>Prolonger la durée de vie du matériel</strong> grâce à des systèmes légers et optimisés</li>
                                <li><strong>Garantir la confidentialité des données</strong> en évitant la collecte massive d'informations</li>
                                <li><strong>Personnaliser entièrement leur environnement</strong> selon leurs besoins pédagogiques</li>
                                <li><strong>Former les élèves à la maîtrise technique</strong> plutôt qu'à la simple consommation</li>
                            </ul>
                            <p>
                                NIRD propose des <strong>ateliers "Install Party"</strong> où élèves et enseignants apprennent ensemble
                                à installer Linux, des sessions de reconditionnement de matériel, et un catalogue d'alternatives libres
                                pour chaque usage (bureautique, création, communication...).
                            </p>
                            <p>
                                <strong>Cliquez sur le logo Tux</strong> pour découvrir un jeu rétro développé en open source,
                                symbole de créativité et d'autonomie numérique ! 🐧
                            </p>
                        </div>
                        <div className="image-col linux-logo-container">
                            <img
                                src={linuxLogo}
                                alt="Linux - Tux le pingouin"
                                className="linux-logo-interactive"
                                onClick={() => setShowSnake(true)}
                                title="Cliquez sur Tux pour jouer au Snake !"
                            />
                        </div>
                    </div>
                </section>

                <section className="content-section section-light" id="solutions-locales">
                    <div className="section-content-wrapper reverse">
                        <div className="image-col">
                            <img src={joinImg} alt="Solutions Locales NIRD" />
                        </div>
                        <div className="text-col">
                            <h2>Agir au Niveau Local</h2>
                            <p>
                                La transformation commence sur le terrain, dans chaque classe et chaque établissement.
                                NIRD accompagne les équipes éducatives pour mettre en place des solutions concrètes,
                                immédiates et visibles, transformant l'école en un véritable laboratoire d'indépendance technologique.
                            </p>
                            <p>
                                <strong>Nos actions de proximité :</strong>
                            </p>
                            <ul>
                                <li><strong>Ateliers "1h pour passer sous Linux"</strong> : Des sessions pratiques où élèves et professeurs apprennent à installer et maîtriser un système libre, démystifiant la technique.</li>
                                <li><strong>Clubs de Reconditionnement</strong> : Création d'espaces où le "vieux" matériel est réparé et optimisé, luttant contre l'obsolescence programmée et éduquant à l'écologie numérique.</li>
                                <li><strong>Hébergement Local & Nextcloud</strong> : Installation de serveurs au sein même de l'établissement pour garder les données scolaires "à la maison", sécurisées et accessibles.</li>
                                <li><strong>Substitution Logicielle</strong> : Remplacement progressif des outils propriétaires par des alternatives libres (LibreOffice, BigBlueButton, etc.) adaptées aux besoins pédagogiques.</li>
                            </ul>
                            <p>
                                Ces initiatives locales créent une dynamique vertueuse : elles redonnent du sens à l'outil informatique,
                                renforcent la cohésion de la communauté éducative et prouvent qu'une autre voie est possible, ici et maintenant.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="content-section section-red" id="solutions-nationales" style={{ paddingBottom: '10vh' }}>
                    <div className="section-content-wrapper">
                        <div className="text-col">
                            <h2>Agir au Niveau National</h2>
                            <p>
                                Au-delà des initiatives locales, un changement d'échelle est indispensable pour garantir l'indépendance technologique de la France.
                                NIRD milite pour une politique publique ambitieuse, capable de soutenir et de pérenniser les alternatives libres face aux géants du numérique.
                            </p>
                            <p>
                                <strong>Nos propositions pour la France :</strong>
                            </p>
                            <ul>
                                <li><strong>Budgets Fléchés "Open Source"</strong> : Allouer une part significative des fonds publics spécifiquement à la migration vers des solutions libres et à leur maintenance.</li>
                                <li><strong>Formation Initiale des Enseignants</strong> : Intégrer obligatoirement la culture du libre et la maîtrise des outils souverains dans le cursus des futurs professeurs.</li>
                                <li><strong>Commande Publique Responsable</strong> : Modifier les critères d'appels d'offres pour donner une priorité légale aux solutions ouvertes, interopérables et hébergées en France.</li>
                                <li><strong>Infrastructure Cloud Souveraine</strong> : Investir massivement dans un cloud éducatif national, public et auditable, véritable alternative aux suites GAFAM pour l'Éducation Nationale.</li>
                            </ul>
                            <p>
                                En adoptant cette stratégie, la France peut devenir un leader mondial du numérique éthique,
                                protégeant les données de ses citoyens et assurant son autonomie stratégique pour les décennies à venir. 🇫🇷
                            </p>
                        </div>
                        <div className="image-col">
                            <img
                                src={franceImg}
                                alt="Souveraineté Numérique Française"
                                className="no-shadow"
                                style={{ transform: 'scale(1.15)' }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
        </div>
    );
}

export default Home;
