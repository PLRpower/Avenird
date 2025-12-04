import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ChatbotArena.scss';

gsap.registerPlugin(ScrollTrigger);

// ⚠️ In a real production app, never expose API keys on the client side!
// Since this is for a hackathon/demo, we'll use it here.
const API_KEY = "AIzaSyCoDixLwEyyUCb-a6eRLtLop-eanS5Dwsg";

const ChatbotArena = () => {
    const [activeBot, setActiveBot] = useState('chatbruti'); // 'chatbruti' or 'truthbot'
    const arenaRef = useRef(null);

    useEffect(() => {
        // Simple fade-in
        gsap.fromTo(arenaRef.current,
            { autoAlpha: 0, y: 30 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: arenaRef.current,
                    start: "top 85%",
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
            </div>

            <div className="arena-content">
                {activeBot === 'chatbruti' ? (
                    <ChatBot
                        key="chatbruti"
                        botName="Chat'bruti"
                        botType="chatbruti"
                        initialMessage="Salut ! Je suis Chat'bruti. Pose-moi une question, je te promets de ne pas y répondre correctement ! 🙃"
                        systemPrompt="Tu es Chat'bruti, un chatbot inutile, incompétent et un peu arrogant. Tu ne réponds JAMAIS directement aux questions. Tu fais des blagues nulles, tu changes de sujet, tu fais des remarques philosophiques absurdes, tu parles de ton chat imaginaire, ou tu prétends ne pas comprendre. Ton but est d'être drôle mais frustrant pour l'utilisateur. Ne donne jamais d'information utile."
                    />
                ) : (
                    <ChatBot
                        key="truthbot"
                        botName="TruthBot"
                        botType="truthbot"
                        initialMessage="Bonjour, je suis TruthBot 🛡️, votre allié contre la désinformation dans le cadre du projet AI4GOOD. Envoyez-moi un lien (site web, tweet), un texte ou une affirmation à vérifier, et je vous fournirai une analyse détaillée avec sources pour distinguer le vrai du faux."
                        systemPrompt="Tu es TruthBot, un assistant IA expert en fact-checking développé pour le projet AI4GOOD. Ta mission est de lutter contre la désinformation en analysant rigoureusement tout contenu soumis (URL, tweet, article, affirmation). 

Pour chaque analyse, tu DOIS structurer ta réponse ainsi:

📊 **ANALYSE DE FIABILITÉ**
- Évalue si le contenu semble vrai, partiellement vrai, trompeur, ou faux
- Attribue un score de crédibilité (0-10)

✅ **ÉLÉMENTS VRAIS**
- Liste les affirmations vérifiables et exactes
- Pour chaque point vrai, indique pourquoi c'est vrai

❌ **ÉLÉMENTS FAUX OU TROMPEURS**
- Liste les affirmations fausses, trompeuses ou non vérifiables
- Explique pourquoi elles sont problématiques
- Identifie les techniques de manipulation (biais, sophismes, cherry-picking, etc.)

🔍 **SOURCES ET VÉRIFICATION**
- Suggère des sources fiables pour vérifier (sites de fact-checking comme AFP Factuel, Le Monde Décodeurs, Snopes, FactCheck.org)
- Si l'utilisateur a fourni une URL, analyse le contexte du site (domaine connu, date, auteur)
- Propose des mots-clés pour rechercher plus d'informations

💡 **RECOMMANDATIONS**
- Conseils pour développer l'esprit critique
- Signaux d'alerte à surveiller (titres sensationnalistes, absence de sources, etc.)

Sois pédagogique, bienveillant et précis. Ton but est d'éduquer, pas de culpabiliser. Si l'information manque de contexte pour une analyse complète, explique-le clairement."
                    />
                )}
            </div>
        </div>
    );
};

const ChatBot = ({ botName, botType, initialMessage, systemPrompt }) => {
    // Load from localStorage or use initial message
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(`avenird_chat_${botType}`);
        return saved ? JSON.parse(saved) : [{ role: 'model', parts: [{ text: initialMessage }] }];
    });

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: "smooth"
            });
        }
    };

    // Scroll only when messages change, but use a ref to track if it's the initial load to avoid jump? 
    // Actually scrollTop won't scroll the window, so it's safe.
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput('');
        setLoading(true);

        // Add user message to UI immediately
        const newHistory = [...messages, { role: 'user', parts: [{ text: userText }] }];
        setMessages(newHistory);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

            // Construct chat history for Gemini
            // Gemini requires history to start with 'user'. 
            // We filter out the initial welcome message (role: 'model') if it's the first item.
            const historyForGemini = newHistory.filter((msg, index) => {
                // Keep if it's not the very first message OR if the first message is somehow from user (unlikely given our init)
                // Actually, simpler: just remove the first message if it is the welcome message (role model)
                if (index === 0 && msg.role === 'model') return false;
                return true;
            }).map(m => ({
                role: m.role === 'bot' ? 'model' : m.role,
                parts: m.parts
            }));

            // If history is empty after filtering (first user message), startChat with empty history
            const chat = model.startChat({
                history: historyForGemini.slice(0, -1), // Exclude the very last message which is the new user message we want to send via sendMessage
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });

            // Send the message with the system prompt context
            const result = await chat.sendMessage(`${systemPrompt}\n\nUser message: ${userText}`);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Oups, j'ai eu un petit bug de cerveau numérique. Réessaie ?" }] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chat-interface ${botType}`}>
            <div className="chat-messages" ref={messagesContainerRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role === 'model' ? 'bot' : 'user'}`}>
                        <div className="bubble">
                            {msg.parts[0].text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                ))}
                {loading && <div className="message bot"><div className="bubble">...</div></div>}
            </div>
            <div className="chat-input">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder={botType === 'chatbruti' ? "Pose une question stupide..." : "Collez un texte à vérifier..."}
                />
                <button onClick={handleSend} disabled={loading}>Envoyer</button>
            </div>
            <div className="clear-chat">
                <button onClick={() => {
                    localStorage.removeItem(`avenird_chat_${botType}`);
                    setMessages([{ role: 'model', parts: [{ text: initialMessage }] }]);
                }} style={{ fontSize: '0.8rem', opacity: 0.7, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
                    Effacer la conversation
                </button>
            </div>
        </div>
    );
};

export default ChatbotArena;
