import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Contact from './pages/Contact';
import './App.scss';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

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

      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
    </div>
  );
}

export default App;
