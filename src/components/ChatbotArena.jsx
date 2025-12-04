import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReactMarkdown from 'react-markdown';
import './ChatbotArena.scss';

gsap.registerPlugin(ScrollTrigger);

const API_KEY = "AIzaSyCoDixLwEyyUCb-a6eRLtLop-eanS5Dwsg";

const ChatbotArena = () => {
    const [activeBot, setActiveBot] = useState('chatbruti');
    const arenaRef = useRef(null);

    // TruthBot states managed at parent level
    const [credibilityScore, setCredibilityScore] = useState(null);
    const [sources, setSources] = useState([]);
    const [verdict, setVerdict] = useState(null);

    useEffect(() => {
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

            {/* TruthBot Panels - OUTSIDE the chat box */}
            {activeBot === 'truthbot' && (credibilityScore !== null || sources.length > 0) && (
                <div className="truthbot-panels-external">
                    {credibilityScore !== null && (
                        <div className="credibility-panel">
                            <h3>📊 Score de Crédibilité</h3>
                            <div className="score-display">
                                <div className="score-number">{credibilityScore}/10</div>
                                <div className="score-bar">
                                    <div
                                        className="score-fill"
                                        style={{
                                            width: `${(credibilityScore / 10) * 100}%`,
                                            backgroundColor: credibilityScore >= 7 ? '#4ade80' : credibilityScore >= 4 ? '#fbbf24' : '#f87171'
                                        }}
                                    />
                                </div>
                                {verdict && <div className="verdict">{verdict}</div>}
                            </div>
                        </div>
                    )}

                    {sources.length > 0 && (
                        <div className="sources-panel">
                            <h3>🔍 Sources de Vérification</h3>
                            <ul className="sources-list">
                                {sources.map((source, idx) => (
                                    <li key={idx}>
                                        {source.url && source.url.startsWith('http') ? (
                                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                                                {source.name}
                                            </a>
                                        ) : (
                                            <span>{source.name} {source.url ? `- ${source.url}` : ''}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="arena-content">
                {activeBot === 'chatbruti' ? (
                    <ChatBot
                        key="chatbruti"
                        botType="chatbruti"
                        initialMessage="Salut ! Je suis Chat'bruti. Pose-moi une question, je te promets de ne pas y répondre correctement ! 🙃"
                        systemPrompt="Tu es Chat'bruti, un chatbot inutile, incompétent et un peu arrogant. Tu ne réponds JAMAIS directement aux questions. Tu fais des blagues nulles, tu changes de sujet, tu fais des remarques philosophiques absurdes, tu parles de ton chat imaginaire, ou tu prétends ne pas comprendre. Ton but est d'être drôle mais frustrant pour l'utilisateur. Ne donne jamais d'information utile. SOIS CONCIS, fais des réponses courtes et percutantes (max 2-3 phrases)."
                    />
                ) : (
                    <ChatBot
                        key="truthbot"
                        botType="truthbot"
                        initialMessage="Bonjour, je suis TruthBot 🛡️, votre allié contre la désinformation dans le cadre du projet AI4GOOD. Envoyez-moi un lien (site web, tweet), un texte ou une affirmation à vérifier, et je vous fournirai une analyse détaillée avec sources pour distinguer le vrai du faux."
                        systemPrompt={`Tu es TruthBot, un assistant IA expert en fact-checking développé pour le projet AI4GOOD.

IMPORTANT: Tu DOIS OBLIGATOIREMENT retourner ta réponse au format JSON dans un bloc code markdown comme suit:

\`\`\`json
{
  "score": <nombre de 0 à 10>,
  "verdict": "<vrai|partiellement vrai|trompeur|faux>",
  "analysis": "<ton analyse en markdown>",
  "sources": [
    {"name": "<nom de la source>", "url": "<URL ou description>"}
  ]
}
\`\`\`

Dans le champ "analysis", structure ton texte ainsi:

## ✅ Éléments Vrais
- Liste les affirmations vérifiables et exactes

## ❌ Éléments Faux ou Trompeurs
- Liste les affirmations fausses ou trompeuses
- Identifie les techniques de manipulation

## � Recommandations
- Conseils pour développer l'esprit critique

Sois pédagogique et précis.`}
                        setCredibilityScore={setCredibilityScore}
                        setSources={setSources}
                        setVerdict={setVerdict}
                    />
                )}
            </div>
        </div>
    );
};

const ChatBot = ({ botType, initialMessage, systemPrompt, setCredibilityScore, setSources, setVerdict }) => {
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

    useEffect(() => {
        localStorage.setItem(`avenird_chat_${botType}`, JSON.stringify(messages));
    }, [messages, botType]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput('');
        setLoading(true);

        const newHistory = [...messages, { role: 'user', parts: [{ text: userText }] }];
        setMessages(newHistory);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

            const historyForGemini = newHistory.filter((msg, index) => {
                if (index === 0 && msg.role === 'model') return false;
                return true;
            }).map(m => ({
                role: m.role === 'bot' ? 'model' : m.role,
                parts: m.parts
            }));

            const chat = model.startChat({
                history: historyForGemini.slice(0, -1),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(`${systemPrompt}\n\nUser message: ${userText}`);
            const response = await result.response;
            const text = response.text();

            if (botType === 'truthbot' && setCredibilityScore && setSources && setVerdict) {
                try {
                    const jsonMatch = text.match(/```json\s*\n?([\s\S]*?)\n?```/);
                    if (jsonMatch) {
                        const jsonText = jsonMatch[1];
                        const data = JSON.parse(jsonText);

                        if (data.score !== undefined) setCredibilityScore(data.score);
                        if (data.verdict) setVerdict(data.verdict);
                        if (data.sources && Array.isArray(data.sources)) setSources(data.sources);

                        setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.analysis || text }] }]);
                    } else {
                        setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
                    }
                } catch (parseError) {
                    console.error("JSON parse error:", parseError);
                    setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
            }
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
                            <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
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
                    placeholder={botType === 'chatbruti' ? "Pose une question stupide..." : "Collez un texte, URL ou tweet à vérifier..."}
                />
                <button onClick={handleSend} disabled={loading}>Envoyer</button>
            </div>
            <div className="clear-chat">
                <button onClick={() => {
                    localStorage.removeItem(`avenird_chat_${botType}`);
                    setMessages([{ role: 'model', parts: [{ text: initialMessage }] }]);
                    if (botType === 'truthbot' && setCredibilityScore && setSources && setVerdict) {
                        setCredibilityScore(null);
                        setSources([]);
                        setVerdict(null);
                    }
                }} style={{ fontSize: '0.8rem', opacity: 0.7, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
                    Effacer la conversation
                </button>
            </div>
        </div>
    );
};

export default ChatbotArena;
