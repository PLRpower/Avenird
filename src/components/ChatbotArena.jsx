import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ChatbotArena.scss';

gsap.registerPlugin(ScrollTrigger);

const ChatbotArena = () => {
    const [activeBot, setActiveBot] = useState('chatbruti'); // 'chatbruti' or 'truthbot'
    const [apiKey, setApiKey] = useState('');
    const arenaRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(arenaRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: arenaRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    return (
        <div className="chatbot-arena-container" ref={arenaRef}>
            <div className="arena-header">
                <h2>L'Arène des Bots</h2>
                <p>Choisissez votre combattant : le Chat'bruti inutile ou le TruthBot éthique.</p>

                <div className="bot-selector">
                    <button
                        className={`selector-btn ${activeBot === 'chatbruti' ? 'active' : ''}`}
                        onClick={() => setActiveBot('chatbruti')}
                    >
                        Chat'bruti 🤪
                    </button>
                    <button
                        className={`selector-btn ${activeBot === 'truthbot' ? 'active' : ''}`}
                        onClick={() => setActiveBot('truthbot')}
                    >
                        TruthBot 🛡️
                    </button>
                </div>

                {activeBot === 'truthbot' && (
                    <div className="api-key-input">
                        <input
                            type="password"
                            placeholder="Entrez votre clé API Gemini (optionnel)"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <small>Nécessaire pour l'analyse IA réelle. Sinon, mode simulation.</small>
                    </div>
                )}
            </div>

            <div className="arena-content">
                {activeBot === 'chatbruti' ? (
                    <ChatBruti />
                ) : (
                    <TruthBot apiKey={apiKey} />
                )}
            </div>
        </div>
    );
};

const ChatBruti = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Salut ! Je suis Chat'bruti. Pose-moi une question, je te promets de ne pas y répondre correctement ! 🙃" }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate "thinking" time
        setTimeout(() => {
            const responses = [
                "C'est une excellente question, mais as-tu déjà pensé à la couleur du vent ?",
                "Je pourrais répondre, mais mon horoscope me l'interdit aujourd'hui.",
                "42. C'est toujours 42. Ou peut-être 43 si on compte la TVA.",
                "Ah, les humains et leurs questions... C'est mignon.",
                "J'ai demandé à mon chat, il a miaulé. Je pense que ça veut dire 'non'.",
                "Tu sais, la réponse est au fond de toi. Ou dans ton frigo.",
                "Error 404: Motivation not found.",
                "Je suis un modèle de langage entraîné sur des blagues Carambar. Désolé.",
                "Est-ce que cette question est bio ?",
                "Je préfère ne pas répondre sans la présence de mon avocat (qui est un ficus)."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { role: 'bot', content: randomResponse }]);
        }, 1000);
    };

    return (
        <div className="chat-interface chat-bruti">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        <div className="bubble">{msg.content}</div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pose une question stupide..."
                />
                <button onClick={handleSend}>Envoyer</button>
            </div>
        </div>
    );
};

const TruthBot = ({ apiKey }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Bonjour. Je suis TruthBot. Soumettez-moi une information, un tweet ou un texte, et j'analyserai sa fiabilité. 🛡️" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const analyzeWithGemini = async (text) => {
        if (!apiKey) {
            return "Mode Simulation : J'ai détecté plusieurs indicateurs de fiabilité douteuse dans ce texte. L'absence de sources citées et l'utilisation d'un langage émotionnel fort suggèrent qu'il faut être prudent. (Entrez une clé API pour une vraie analyse)";
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Tu es TruthBot, un assistant expert en fact-checking et éthique numérique. Analyse le texte suivant pour détecter de la désinformation potentielle, des biais ou des fausses nouvelles. Sois pédagogique, explique pourquoi c'est douteux ou fiable. Texte à analyser : "${text}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Erreur lors de la connexion à Gemini. Vérifiez votre clé API.";
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const analysis = await analyzeWithGemini(input);

        setMessages(prev => [...prev, { role: 'bot', content: analysis }]);
        setLoading(false);
    };

    return (
        <div className="chat-interface truth-bot">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        <div className="bubble">
                            {msg.role === 'bot' ? (
                                // Simple markdown rendering replacement for safety
                                msg.content.split('\n').map((line, i) => <p key={i}>{line}</p>)
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="message bot"><div className="bubble">Analyse en cours... 🔍</div></div>}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Collez un texte à vérifier..."
                />
                <button onClick={handleSend} disabled={loading}>Analyser</button>
            </div>
        </div>
    );
};

export default ChatbotArena;
