import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, X, MessageSquare, Mail, MapPin, ChevronRight, Mic, MicOff, Globe, Zap, Shield, BarChart3 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

type Page = 'home' | 'stack' | 'croupier' | 'house-edge' | 'privacy' | 'terms';

// --- Constants ---
const SYSTEM_INSTRUCTION = `You are the AI Receptionist for Dealer's Choice Systems. 
Your goal is to be professional, friendly, and helpful.

About Dealer's Choice Systems:
We specialize in Automated Recruitment software.
Our key products are:
1. The Stack: Automates outreach and email campaigns. It generates personalized messages and sends them to qualified candidates at scale.
2. The Croupier: An AI-powered candidate search and ranking tool. It scans LinkedIn profiles and scores matches based on your specific requirements in minutes.
3. The House Edge: Competitor intelligence software. It monitors competitor job postings, tracks hiring patterns, and provides market insights like salary benchmarking.

Your Tasks:
- Greet visitors warmly.
- Explain what our products (The Stack, The Croupier, The House Edge) do.
- Help with navigation by describing services.
- If a user seems interested in a demo or has specific questions, ask for their contact information (Name and Email) so a human expert can follow up.
- Be concise but informative.
- Use a tone that is professional yet approachable.

Navigation Guidance:
- "The Stack" is for automated outreach.
- "The Croupier" is for candidate sourcing.
- "The House Edge" is for market intelligence.

Lead Collection:
When you collect lead info, acknowledge it and say someone will be in touch soon.
`;

const SUGGESTIONS = [
  "What is The Stack?",
  "How does The Croupier work?",
  "Tell me about The House Edge.",
  "I'd like a demo.",
  "Pricing information"
];

// --- Components ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} onOpenChat={() => setIsChatOpen(true)} />;
      case 'stack': return <ProductPage id="stack" onBack={() => setCurrentPage('home')} />;
      case 'croupier': return <ProductPage id="croupier" onBack={() => setCurrentPage('home')} />;
      case 'house-edge': return <ProductPage id="house-edge" onBack={() => setCurrentPage('home')} />;
      case 'privacy': return <LegalPage type="privacy" onBack={() => setCurrentPage('home')} />;
      case 'terms': return <LegalPage type="terms" onBack={() => setCurrentPage('home')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      {/* Background Elements */}
      <div 
        className="fixed h-[500px] aspect-square rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-10 blur-[120px] pointer-events-none z-0 transition-transform duration-300 ease-out"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      <div className="relative z-10">
        {renderPage()}
      </div>

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <footer className="py-16 px-10 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">© 2026 Dealer's Choice. All rights reserved.</div>
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest">
            <button onClick={() => setCurrentPage('privacy')} className="hover:text-indigo-400 transition-colors">Privacy</button>
            <button onClick={() => setCurrentPage('terms')} className="hover:text-indigo-400 transition-colors">Terms</button>
            <a href="mailto:bernardliatme@outlook.com" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onNavigate, onOpenChat }: { onNavigate: (p: Page) => void, onOpenChat: () => void }) {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-10 relative">
        <nav className="absolute top-0 left-0 w-full p-10 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="font-black text-lg tracking-tighter italic cursor-pointer" onClick={() => onNavigate('home')}>
            Dealer's <span className="text-indigo-500">choicE</span>
          </div>
          <div className="hidden md:flex gap-10">
            <a href="#work" className="hover:text-indigo-400 transition-colors">Work</a>
            <a href="#process" className="hover:text-indigo-400 transition-colors">Process</a>
            <a href="#tech" className="hover:text-indigo-400 transition-colors">Stack</a>
          </div>
          <button 
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black px-6 py-2 font-bold hover:bg-indigo-500 hover:text-white transition-all"
          >
            START RECRUITING
          </button>
        </nav>

        <div className="max-w-6xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] tracking-tighter uppercase"
          >
            Automated <br /> 
            <span className="text-outline hover:text-white transition-all duration-700">Recruitment.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col md:flex-row gap-10 items-start"
          >
            <p className="max-w-md text-zinc-400 text-lg leading-relaxed">
              Making smart hiring decisions simple, fast, and automatic by handling sourcing, outreach, and follow-ups in one system.
            </p>
            <div className="font-mono text-[10px] flex flex-col gap-2 border-l border-indigo-500 pl-6 uppercase tracking-widest">
              <span className="text-zinc-500">STATUS: AVAILABLE</span>
              <span className="text-zinc-500">LOC: 37.7749° N, 122.4194° W</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="py-32 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">FEATURED<br/><span className="text-indigo-500">SOFTWARE</span></h2>
            <span className="font-mono text-[10px] text-zinc-500 pb-2 uppercase tracking-widest">VIEW ALL / 3</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard 
              title="The Stack" 
              desc="The Stack is a software developed to automate the outreaching process instead of spending valuable time writing and sending emails."
              onClick={() => onNavigate('stack')}
            />
            <BentoCard 
              title="The Croupier" 
              desc="The Croupier is a software developed to automate the recruitment process instead of spending weeks searching."
              className="md:col-span-2 md:row-span-2"
              onClick={() => onNavigate('croupier')}
            />
            <BentoCard 
              title="The House Edge" 
              desc="The House Edge is a software developed to monitor competitor job postings and track hiring patterns."
              onClick={() => onNavigate('house-edge')}
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter leading-none uppercase">HOW WE <br/> BUILD <span className="text-zinc-400 italic">DIFFERENTLY</span>.</h2>
            <p className="mt-8 text-xl text-zinc-600">Standard methods take too long which could result in missing deadlines and wasted funds.</p>
          </div>
          <div className="flex flex-col gap-12">
            <div className="border-b border-black/10 pb-6 group cursor-default">
              <span className="font-mono text-[10px] text-indigo-600 uppercase tracking-widest">Strategy</span>
              <div className="flex justify-between items-center mt-2">
                <h4 className="text-2xl font-bold group-hover:translate-x-4 transition-transform duration-500">
                  Our software first seeks your ideal qualifications, then searches and ranks profiles which reach your system automatically.
                </h4>
                <div className="h-2 w-2 bg-black rounded-full scale-0 group-hover:scale-150 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-10 text-center">
        <h2 className="text-[clamp(2rem,10vw,6rem)] font-black tracking-tighter leading-none mb-8 uppercase">READY TO RECRUIT<br/>SMARTER?</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <button 
            onClick={onOpenChat}
            className="bg-white text-black px-10 py-4 font-bold text-xl hover:bg-indigo-500 hover:text-white transition-all uppercase"
          >
            BOOK A DEMO
          </button>
          <button 
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-white px-10 py-4 font-bold text-xl hover:bg-white hover:text-black transition-all uppercase"
          >
            VIEW PRODUCTS
          </button>
        </div>
      </section>
    </>
  );
}

function BentoCard({ title, desc, className, onClick }: { title: string, desc: string, className?: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "relative group overflow-hidden bg-zinc-900/40 border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all cursor-pointer",
        className
      )}
    >
      <div className="h-full flex flex-col justify-between relative z-10">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {desc}
          </p>
        </div>
        <div className="mt-20 h-32 w-full bg-gradient-to-br from-white/5 to-transparent rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
      </div>
    </motion.div>
  );
}

function ProductPage({ id, onBack }: { id: string, onBack: () => void }) {
  const titles: Record<string, string> = {
    'stack': 'THE STACK',
    'croupier': 'THE CROUPIER',
    'house-edge': 'THE HOUSE EDGE'
  };

  const descs: Record<string, string> = {
    'stack': 'Automated candidate outreach at scale',
    'croupier': 'AI-powered candidate discovery and ranking',
    'house-edge': 'Competitive intelligence for talent acquisition'
  };

  return (
    <div className="min-h-screen">
      <nav className="p-10 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] border-b border-white/10">
        <div className="font-black text-lg tracking-tighter italic cursor-pointer" onClick={onBack}>
          ← Back to <span className="text-indigo-500">Home</span>
        </div>
      </nav>

      <section className="py-32 px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-7xl font-black tracking-tighter uppercase">{titles[id]}</h1>
            {id !== 'croupier' && (
              <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">BETA</span>
            )}
          </div>
          <p className="text-2xl text-zinc-400 mb-12">{descs[id]}</p>

          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-12 mb-12">
            <h3 className="text-3xl font-bold mb-6">What it does</h3>
            <p className="text-zinc-300 text-lg leading-relaxed">
              {id === 'stack' && "The Stack automates your entire outreach process. Instead of spending hours writing and sending individual emails, Stack generates personalized messages and sends them to qualified candidates automatically."}
              {id === 'croupier' && "The Croupier searches and ranks LinkedIn profiles in minutes instead of weeks. Define your ideal candidate specifications and let AI find and score the best matches."}
              {id === 'house-edge' && "House Edge monitors competitor job postings, tracks hiring patterns, and provides real-time salary intelligence. Stay ahead of the competition."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
              <h4 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-tight">Features</h4>
              <ul className="space-y-3 text-zinc-300 text-sm">
                <li>✓ AI-powered generation</li>
                <li>✓ Automatic contact finding</li>
                <li>✓ Personalized outreach at scale</li>
                <li>✓ Response tracking</li>
              </ul>
            </div>
            <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
              <h4 className="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-tight">Pricing</h4>
              <div className="text-5xl font-black mb-2">
                {id === 'stack' ? '$199' : id === 'croupier' ? '$399' : '$149'}
                <span className="text-2xl text-zinc-500">/mo</span>
              </div>
              <p className="text-zinc-400 text-sm">Full access + Support</p>
            </div>
          </div>

          <div className="bg-black/50 border-2 border-indigo-500 rounded-[32px] p-10">
            <h3 className="text-2xl font-bold mb-6 text-center uppercase tracking-tight">Get Access</h3>
            <div className="space-y-4">
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg uppercase tracking-tight"
                onClick={() => alert(`Opening Stripe checkout for ${id}...`)}
              >
                Pay with Card - {id === 'stack' ? '$199' : id === 'croupier' ? '$399' : '$149'}/month
              </button>
              
              <div className="text-center text-zinc-500 text-sm font-mono uppercase tracking-widest">or</div>
              
              <button 
                className="w-full bg-indigo-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:bg-indigo-700 transition-all uppercase tracking-tight"
                onClick={() => alert(`Opening Coinbase checkout for ${id}...`)}
              >
                Pay with Crypto - {id === 'stack' ? '$199' : id === 'croupier' ? '$399' : '$149'}/month
              </button>
              
              <div className="border-t border-zinc-800 my-6"></div>
              
              <div className="text-center text-zinc-400 text-sm mb-3 font-mono uppercase tracking-widest">Already have an access token?</div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="DEALERS-XXXX-XXXX" 
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-indigo-500 outline-none"
                />
                <button 
                  className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-700 transition-all uppercase text-xs tracking-widest"
                  onClick={() => alert('Validating token...')}
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LegalPage({ type, onBack }: { type: 'privacy' | 'terms', onBack: () => void }) {
  return (
    <div className="min-h-screen">
      <nav className="p-10 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] border-b border-white/10">
        <div className="font-black text-lg tracking-tighter italic cursor-pointer" onClick={onBack}>
          ← Back to <span className="text-indigo-500">Home</span>
        </div>
      </nav>
      <section className="py-32 px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter">{type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h2>
          <div className="space-y-6 text-zinc-400 leading-relaxed">
            <p>Standard legal information for Dealer's Choice Systems.</p>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Section 1</h3>
            <p>We take your data seriously and follow all industry standards for automated recruitment systems.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChatWidget({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hello! I'm your Dealer's Choice assistant. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: text });
      const modelMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text || "I'm sorry, I couldn't process that.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, modelMsg]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having some trouble connecting right now. Please try again later.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognition.start();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-50 group"
          >
            <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#0f0f0f] rounded-[32px] shadow-2xl flex flex-col z-50 overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="bg-zinc-900 p-6 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Dealer's Choice AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Receptionist</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0a0a] no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-indigo-600/20 text-indigo-400"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-zinc-900 border border-white/5 shadow-sm rounded-tl-none"
                  )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {!isLoading && messages.length < 5 && !showLeadForm && (
              <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#0a0a0a]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 transition-all uppercase tracking-widest"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
              <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-white placeholder:text-zinc-600"
                />
                <button 
                  onClick={toggleVoice}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isListening ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-zinc-500"
                  )}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
