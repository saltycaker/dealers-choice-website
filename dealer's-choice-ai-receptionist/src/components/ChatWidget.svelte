<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { Send, User, Bot, Loader2, X, MessageSquare, Mic, MicOff, Zap } from 'lucide-svelte';
  import SvelteMarkdown from 'svelte-markdown';

  export let isOpen = false;

  let messages = [
    { id: '1', role: 'model', text: "Hello! I'm your Dealer's Choice assistant. How can I help you today?", timestamp: new Date() }
  ];
  let input = '';
  let isLoading = false;
  let isListening = false;
  let scrollContainer;

  async function handleSend(text = input) {
    if (!text.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    messages = [...messages, userMsg];
    input = '';
    isLoading = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history: messages.slice(0, -1) // Send history excluding the current message
        })
      });
      const data = await response.json();
      
      messages = [...messages, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: data.text, 
        timestamp: new Date() 
      }];
    } catch (error) {
      console.error("Chat error:", error);
      messages = [...messages, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having trouble connecting. Please try again later.", 
        timestamp: new Date() 
      }];
    } finally {
      isLoading = false;
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }, 10);
  }

  function toggleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition is not supported in this browser.");
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => isListening = true;
    recognition.onend = () => isListening = false;
    recognition.onresult = (e) => {
      input = e.results[0][0].transcript;
      handleSend(input);
    };
    recognition.start();
  }
</script>

{#if !isOpen}
  <button
    transition:scale
    on:click={() => { isOpen = true; scrollToBottom(); }}
    class="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 z-50 group"
  >
    <MessageSquare size={32} class="group-hover:scale-110 transition-transform" />
  </button>
{:else}
  <div
    transition:fly={{ y: 100, duration: 400 }}
    class="fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#0f0f0f] rounded-[32px] shadow-2xl flex flex-col z-50 overflow-hidden border border-white/10"
  >
    <!-- Header -->
    <div class="bg-zinc-900 p-6 flex items-center justify-between border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
        <div>
          <h3 class="font-bold text-sm tracking-tight text-white">Dealer's Choice AI</h3>
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Receptionist</span>
          </div>
        </div>
      </div>
      <button on:click={() => isOpen = false} class="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400">
        <X size={20} />
      </button>
    </div>

    <!-- Messages -->
    <div bind:this={scrollContainer} class="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0a0a] no-scrollbar">
      {#each messages as msg (msg.id)}
        <div class="flex gap-3 {msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 {msg.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600/20 text-indigo-400'}">
            {#if msg.role === 'user'}<User size={16}/>{:else}<Bot size={16}/>{/if}
          </div>
          <div class="max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed {msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-white/5 shadow-sm rounded-tl-none text-zinc-300'}">
            <SvelteMarkdown source={msg.text} />
          </div>
        </div>
      {/each}
      {#if isLoading}
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div class="bg-zinc-900 border border-white/5 p-4 rounded-2xl rounded-tl-none">
            <Loader2 size={16} class="animate-spin text-indigo-400" />
          </div>
        </div>
      {/if}
    </div>

    <!-- Input -->
    <div class="p-6 bg-[#0a0a0a] border-t border-white/5">
      <div class="flex items-center gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-all">
        <input
          bind:value={input}
          on:keydown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          class="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-white placeholder:text-zinc-600"
        />
        <button on:click={toggleVoice} class="p-2 rounded-xl transition-colors {isListening ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-zinc-500'}">
          {#if isListening}<MicOff size={20}/>{:else}<Mic size={20}/>{/if}
        </button>
        <button 
          on:click={() => handleSend()} 
          disabled={!input.trim() || isLoading}
          class="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
