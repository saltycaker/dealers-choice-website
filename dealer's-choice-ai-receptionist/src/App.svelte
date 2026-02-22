<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Send, User, Bot, Loader2, X, MessageSquare, Mail, MapPin, ChevronRight, Mic, MicOff, Zap } from 'lucide-svelte';
  import { GoogleGenAI } from "@google/genai";
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

  // --- State ---
  let currentPage = $state<Page>('home');
  let isChatOpen = $state(false);
  let mousePos = $state({ x: 0, y: 0 });

  let messages = $state<Message[]>([
    { id: '1', role: 'model', text: "Hello! I'm your Dealer's Choice assistant. How can I help you today?", timestamp: new Date() }
  ]);
  let input = $state('');
  let isLoading = $state(false);
  let showLeadForm = $state(false);
  let isListening = $state(false);
  let scrollRef = $state<HTMLDivElement | null>(null);

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  $effect(() => {
    if (messages || isLoading) {
      tick().then(() => {
        if (scrollRef) {
          scrollRef.scrollTop = scrollRef.scrollHeight;
        }
      });
    }
  });

  async function handleSend(text: string = input) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    messages = [...messages, userMsg];
    input = '';
    isLoading = true;

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
      messages = [...messages, modelMsg];

      const lowerText = text.toLowerCase();
      if (lowerText.includes('demo') || lowerText.includes('pricing') || lowerText.includes('contact') || lowerText.includes('hire') || lowerText.includes('buy')) {
        setTimeout(() => showLeadForm = true, 1500);
      }

    } catch (error) {
      console.error("Chat error:", error);
      messages = [...messages, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having some trouble connecting right now. Please try again later.", 
        timestamp: new Date() 
      }];
    } finally {
      isLoading = false;
    }
  }

  function toggleVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      isListening = false;
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => isListening = true;
      recognition.onend = () => isListening = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        input = transcript;
        handleSend(transcript);
      };
      recognition.start();
    }
  }

  function onNavigate(p: Page) {
    currentPage = p;
    window.scrollTo(0, 0);
  }

  // Lead Form State
  let leadName = $state('');
  let leadEmail = $state('');
  let leadInquiry = $state('');
  let isSubmitting = $state(false);
  let isSuccess = $state(false);

  async function handleLeadSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: leadName, email: leadEmail, inquiry: leadInquiry })
      });
      if (res.ok) {
        isSuccess = true;
        setTimeout(() => {
          showLeadForm = false;
          isSuccess = false;
          leadName = '';
          leadEmail = '';
          leadInquiry = '';
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      isSubmitting = false;
    }
  }

  const productTitles: Record<string, string> = {
    'stack': 'THE STACK',
    'croupier': 'THE CROUPIER',
    'house-edge': 'THE HOUSE EDGE'
  };

  const productDescs: Record<string, string> = {
    'stack': 'Automated candidate outreach at scale',
    'croupier': 'AI-powered candidate discovery and ranking',
    'house-edge': 'Competitive intelligence for talent acquisition'
  };
</script>

<div class="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
  <!-- Background Elements -->
  <div 
    class="fixed h-[500px] aspect-square rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-10 blur-[120px] pointer-events-none z-0 transition-transform duration-300 ease-out"
    style="left: {mousePos.x}px; top: {mousePos.y}px; transform: translate(-50%, -50%)"
  ></div>
  <div class="fixed inset-0 grid-pattern pointer-events-none z-0"></div>

  <div class="relative z-10">
    {#if currentPage === 'home'}
      <!-- Hero -->
      <section class="min-h-screen flex flex-col justify-center px-10 relative">
        <nav class="absolute top-0 left-0 w-full p-10 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em]">
          <button class="font-black text-lg tracking-tighter italic cursor-pointer bg-transparent border-none text-white p-0" onclick={() => onNavigate('home')}>
            Dealer's <span class="text-indigo-500">choicE</span>
          </button>
          <div class="hidden md:flex gap-10">
            <a href="#work" class="hover:text-indigo-400 transition-colors">Work</a>
            <a href="#process" class="hover:text-indigo-400 transition-colors">Process</a>
            <a href="#tech" class="hover:text-indigo-400 transition-colors">Stack</a>
          </div>
          <button 
            onclick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            class="bg-white text-black px-6 py-2 font-bold hover:bg-indigo-500 hover:text-white transition-all"
          >
            START RECRUITING
          </button>
        </nav>

        <div class="max-w-6xl">
          <h1 class="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] tracking-tighter uppercase">
            Automated <br /> 
            <span class="text-outline hover:text-white transition-all duration-700">Recruitment.</span>
          </h1>
          <div class="mt-10 flex flex-col md:flex-row gap-10 items-start">
            <p class="max-w-md text-zinc-400 text-lg leading-relaxed">
              Making smart hiring decisions simple, fast, and automatic by handling sourcing, outreach, and follow-ups in one system.
            </p>
            <div class="font-mono text-[10px] flex flex-col gap-2 border-l border-indigo-500 pl-6 uppercase tracking-widest">
              <span class="text-zinc-500">STATUS: AVAILABLE</span>
              <span class="text-zinc-500">LOC: 37.7749° N, 122.4194° W</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Work Grid -->
      <section id="work" class="py-32 px-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex justify-between items-end mb-16">
            <h2 class="text-5xl font-black italic uppercase tracking-tighter">FEATURED<br/><span class="text-indigo-500">SOFTWARE</span></h2>
            <span class="font-mono text-[10px] text-zinc-500 pb-2 uppercase tracking-widest">VIEW ALL / 3</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onclick={() => onNavigate('stack')}
              class="relative group overflow-hidden bg-zinc-900/40 border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all cursor-pointer text-left"
            >
              <div class="h-full flex flex-col justify-between relative z-10">
                <div>
                  <h3 class="text-2xl font-bold mb-2">The Stack</h3>
                  <p class="font-mono text-[10px] text-indigo-400 uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    The Stack is a software developed to automate the outreaching process instead of spending valuable time writing and sending emails.
                  </p>
                </div>
                <div class="mt-20 h-32 w-full bg-gradient-to-br from-white/5 to-transparent rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"></div>
              </div>
            </button>

            <button 
              onclick={() => onNavigate('croupier')}
              class="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-zinc-900/40 border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all cursor-pointer text-left"
            >
              <div class="h-full flex flex-col justify-between relative z-10">
                <div>
                  <h3 class="text-2xl font-bold mb-2">The Croupier</h3>
                  <p class="font-mono text-[10px] text-indigo-400 uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    The Croupier is a software developed to automate the recruitment process instead of spending weeks searching.
                  </p>
                </div>
                <div class="mt-20 h-32 w-full bg-gradient-to-br from-white/5 to-transparent rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"></div>
              </div>
            </button>

            <button 
              onclick={() => onNavigate('house-edge')}
              class="relative group overflow-hidden bg-zinc-900/40 border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all cursor-pointer text-left"
            >
              <div class="h-full flex flex-col justify-between relative z-10">
                <div>
                  <h3 class="text-2xl font-bold mb-2">The House Edge</h3>
                  <p class="font-mono text-[10px] text-indigo-400 uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    The House Edge is a software developed to monitor competitor job postings and track hiring patterns.
                  </p>
                </div>
                <div class="mt-20 h-32 w-full bg-gradient-to-br from-white/5 to-transparent rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"></div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- Process -->
      <section id="process" class="py-32 bg-white text-black">
        <div class="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 class="text-6xl font-black tracking-tighter leading-none uppercase">HOW WE <br/> BUILD <span class="text-zinc-400 italic">DIFFERENTLY</span>.</h2>
            <p class="mt-8 text-xl text-zinc-600">Standard methods take too long which could result in missing deadlines and wasted funds.</p>
          </div>
          <div class="flex flex-col gap-12">
            <div class="border-b border-black/10 pb-6 group cursor-default">
              <span class="font-mono text-[10px] text-indigo-600 uppercase tracking-widest">Strategy</span>
              <div class="flex justify-between items-center mt-2">
                <h4 class="text-2xl font-bold group-hover:translate-x-4 transition-transform duration-500">
                  Our software first seeks your ideal qualifications, then searches and ranks profiles which reach your system automatically.
                </h4>
                <div class="h-2 w-2 bg-black rounded-full scale-0 group-hover:scale-150 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-32 px-10 text-center">
        <h2 class="text-[clamp(2rem,10vw,6rem)] font-black tracking-tighter leading-none mb-8 uppercase">READY TO RECRUIT<br/>SMARTER?</h2>
        <div class="flex justify-center gap-6 flex-wrap">
          <button 
            onclick={() => isChatOpen = true}
            class="bg-white text-black px-10 py-4 font-bold text-xl hover:bg-indigo-500 hover:text-white transition-all uppercase"
          >
            BOOK A DEMO
          </button>
          <button 
            onclick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            class="border-2 border-white px-10 py-4 font-bold text-xl hover:bg-white hover:text-black transition-all uppercase"
          >
            VIEW PRODUCTS
          </button>
        </div>
      </section>
    {:else if currentPage === 'stack' || currentPage === 'croupier' || currentPage === 'house-edge'}
      <div class="min-h-screen">
        <nav class="p-10 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] border-b border-white/10">
          <button class="font-black text-lg tracking-tighter italic cursor-pointer bg-transparent border-none text-white p-0" onclick={() => onNavigate('home')}>
            ← Back to <span class="text-indigo-500">Home</span>
          </button>
        </nav>

        <section class="py-32 px-10">
          <div class="max-w-5xl mx-auto">
            <div class="flex items-center gap-4 mb-6">
              <h1 class="text-7xl font-black tracking-tighter uppercase">{productTitles[currentPage]}</h1>
              {#if currentPage === 'stack' || currentPage === 'house-edge'}
                <span class="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">STILL IN BETA</span>
              {/if}
            </div>
            <p class="text-2xl text-zinc-400 mb-12">{productDescs[currentPage]}</p>

            <div class="bg-zinc-900/40 border border-white/10 rounded-3xl p-12 mb-12">
              <h3 class="text-3xl font-bold mb-6">What it does</h3>
              <p class="text-zinc-300 text-lg leading-relaxed">
                {#if currentPage === 'stack'}
                  The Stack (currently in beta) automates your entire outreach process. Instead of spending hours writing and sending individual emails, Stack generates personalized messages and sends them to qualified candidates automatically.
                {:else if currentPage === 'croupier'}
                  The Croupier searches and ranks LinkedIn profiles in minutes instead of weeks. Define your ideal candidate specifications and let AI find and score the best matches.
                {:else if currentPage === 'house-edge'}
                  House Edge (currently in beta) monitors competitor job postings, tracks hiring patterns, and provides real-time salary intelligence. Stay ahead of the competition.
                {/if}
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
              <div class="bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
                <h4 class="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-tight">Features</h4>
                <ul class="space-y-3 text-zinc-300 text-sm">
                  <li>✓ AI-powered generation</li>
                  <li>✓ Automatic contact finding</li>
                  <li>✓ Personalized outreach at scale</li>
                  <li>✓ Response tracking</li>
                </ul>
              </div>
              <div class="bg-zinc-900/40 border border-white/10 rounded-3xl p-8">
                <h4 class="text-xl font-bold mb-4 text-indigo-400 uppercase tracking-tight">Pricing</h4>
                <div class="text-5xl font-black mb-2">
                  {currentPage === 'stack' ? '$199' : currentPage === 'croupier' ? '$399' : '$149'}
                  <span class="text-2xl text-zinc-500">/mo</span>
                </div>
                <p class="text-zinc-400 text-sm">Full access + Support</p>
              </div>
            </div>

            <div class="bg-black/50 border-2 border-indigo-500 rounded-[32px] p-10">
              <h3 class="text-2xl font-bold mb-6 text-center uppercase tracking-tight">Get Access</h3>
              <div class="space-y-4">
                <button 
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg uppercase tracking-tight"
                  onclick={() => alert(`Opening Stripe checkout for ${currentPage}...`)}
                >
                  Pay with Card - {currentPage === 'stack' ? '$199' : currentPage === 'croupier' ? '$399' : '$149'}/month
                </button>
                
                <div class="text-center text-zinc-500 text-sm font-mono uppercase tracking-widest">or</div>
                
                <button 
                  class="w-full bg-indigo-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:bg-indigo-700 transition-all uppercase tracking-tight"
                  onclick={() => alert(`Opening Coinbase checkout for ${currentPage}...`)}
                >
                  Pay with Crypto - {currentPage === 'stack' ? '$199' : currentPage === 'croupier' ? '$399' : '$149'}/month
                </button>
                
                <div class="border-t border-zinc-800 my-6"></div>
                
                <div class="text-center text-zinc-400 text-sm mb-3 font-mono uppercase tracking-widest">Already have an access token?</div>
                <div class="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="DEALERS-XXXX-XXXX" 
                    class="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-indigo-500 outline-none"
                  />
                  <button 
                    class="bg-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-700 transition-all uppercase text-xs tracking-widest"
                    onclick={() => alert('Validating token...')}
                  >
                    Validate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    {:else if currentPage === 'privacy' || currentPage === 'terms'}
      <div class="min-h-screen">
        <nav class="p-10 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] border-b border-white/10">
          <button class="font-black text-lg tracking-tighter italic cursor-pointer bg-transparent border-none text-white p-0" onclick={() => onNavigate('home')}>
            ← Back to <span class="text-indigo-500">Home</span>
          </button>
        </nav>
        <section class="py-32 px-10">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-5xl font-black mb-8 uppercase tracking-tighter">{currentPage === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h2>
            <div class="space-y-6 text-zinc-400 leading-relaxed">
              <p>Standard legal information for Dealer's Choice Systems.</p>
              <h3 class="text-2xl font-bold text-white mt-8 mb-4">Section 1</h3>
              <p>We take your data seriously and follow all industry standards for automated recruitment systems.</p>
            </div>
          </div>
        </section>
      </div>
    {/if}
  </div>

  <!-- Chat Widget -->
  {#if !isChatOpen}
    <button
      onclick={() => isChatOpen = true}
      class="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-50 group"
    >
      <MessageSquare class="w-8 h-8 group-hover:scale-110 transition-transform" />
    </button>
  {:else}
    <div
      class="fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#0f0f0f] rounded-[32px] shadow-2xl flex flex-col z-50 overflow-hidden border border-white/10"
    >
      <!-- Header -->
      <div class="bg-zinc-900 p-6 text-white flex items-center justify-between border-b border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Bot class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="font-bold text-sm tracking-tight">Dealer's Choice AI</h3>
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Receptionist</span>
            </div>
          </div>
        </div>
        <button onclick={() => isChatOpen = false} class="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <X class="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      <!-- Messages -->
      <div bind:this={scrollRef} class="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0a0a] no-scrollbar">
        {#each messages as msg (msg.id)}
          <div class={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
            <div class={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-indigo-600/20 text-indigo-400"
            )}>
              {#if msg.role === 'user'}
                <User class="w-4 h-4" />
              {:else}
                <Bot class="w-4 h-4" />
              {/if}
            </div>
            <div class={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-zinc-900 border border-white/5 shadow-sm rounded-tl-none"
            )}>
              <div class="prose prose-invert prose-sm max-w-none">
                {msg.text}
              </div>
            </div>
          </div>
        {/each}
        {#if isLoading}
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Bot class="w-4 h-4" />
            </div>
            <div class="bg-zinc-900 border border-white/5 p-4 rounded-2xl rounded-tl-none">
              <Loader2 class="w-4 h-4 animate-spin text-indigo-400" />
            </div>
          </div>
        {/if}

        {#if showLeadForm}
          <div class="bg-indigo-600/5 p-6 rounded-3xl border border-indigo-500/20 shadow-sm">
            {#if isSuccess}
              <div class="text-center py-4">
                <div class="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap class="w-6 h-6" />
                </div>
                <h4 class="font-bold text-white mb-1 uppercase tracking-tight">Success!</h4>
                <p class="text-zinc-500 text-[10px] uppercase tracking-widest">We'll be in touch shortly.</p>
              </div>
            {:else}
              <form onsubmit={handleLeadSubmit} class="space-y-4">
                <div class="flex items-center gap-2 mb-2">
                  <Zap class="w-4 h-4 text-indigo-400" />
                  <h4 class="font-bold text-xs text-white uppercase tracking-widest">Request a Demo</h4>
                </div>
                <input
                  required
                  type="text"
                  placeholder="Name"
                  bind:value={leadName}
                  class="w-full p-3 rounded-xl border border-white/10 text-sm focus:ring-1 focus:ring-indigo-500 bg-zinc-900 text-white placeholder:text-zinc-600"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  bind:value={leadEmail}
                  class="w-full p-3 rounded-xl border border-white/10 text-sm focus:ring-1 focus:ring-indigo-500 bg-zinc-900 text-white placeholder:text-zinc-600"
                />
                <textarea
                  placeholder="Inquiry"
                  bind:value={leadInquiry}
                  class="w-full p-3 rounded-xl border border-white/10 text-sm focus:ring-1 focus:ring-indigo-500 bg-zinc-900 text-white placeholder:text-zinc-600 h-20 resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {isSubmitting ? "Sending..." : "Submit Request"}
                </button>
              </form>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Suggestions -->
      {#if !isLoading && messages.length < 5 && !showLeadForm}
        <div class="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#0a0a0a]">
          {#each SUGGESTIONS as s}
            <button
              onclick={() => handleSend(s)}
              class="whitespace-nowrap px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 transition-all uppercase tracking-widest"
            >
              {s}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Input -->
      <div class="p-6 bg-[#0a0a0a] border-t border-white/5">
        <div class="flex items-center gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-all">
          <input
            type="text"
            bind:value={input}
            onkeydown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-white placeholder:text-zinc-600"
          />
          <button 
            onclick={toggleVoice}
            class={cn(
              "p-2 rounded-xl transition-colors",
              isListening ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-zinc-500"
            )}
          >
            {#if isListening}
              <MicOff class="w-5 h-5" />
            {:else}
              <Mic class="w-5 h-5" />
            {/if}
          </button>
          <button
            onclick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            class="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <footer class="py-16 px-10 border-t border-white/10 relative z-10">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">© 2026 Dealer's Choice. All rights reserved.</div>
      <div class="flex gap-8 font-mono text-[10px] uppercase tracking-widest">
        <button onclick={() => onNavigate('privacy')} class="hover:text-indigo-400 transition-colors">Privacy</button>
        <button onclick={() => onNavigate('terms')} class="hover:text-indigo-400 transition-colors">Terms</button>
        <a href="mailto:bernardliatme@outlook.com" class="hover:text-indigo-400 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
</div>

<style>
  .grid-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .text-outline {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
    color: transparent;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
