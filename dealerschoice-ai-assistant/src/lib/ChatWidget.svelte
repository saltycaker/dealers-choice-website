<script lang="ts">
  import { onMount } from 'svelte';

  type Message = {
    role: 'user' | 'assistant';
    text: string;
  };

  let isOpen = false;
  let messages: Message[] = [];
  let inputMessage = '';
  let isLoading = false;
  let chatContainer: HTMLDivElement;

  onMount(() => {
    // Welcome message
    messages = [{
      role: 'assistant',
      text: 'Hi! 👋 I\'m your AI assistant for Dealer\'s Choice Systems. How can I help you today?'
    }];
  });

  function toggleChat() {
    isOpen = !isOpen;
  }

  async function sendMessage() {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    inputMessage = '';

    // Add user message
    messages = [...messages, { role: 'user', text: userMessage }];
    isLoading = true;

    // Scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 10);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(0, -1) // Don't include the message we just added
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      messages = [...messages, { role: 'assistant', text: data.text }];

      // Scroll to bottom
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 10);

    } catch (error) {
      console.error('Chat error:', error);
      messages = [...messages, { 
        role: 'assistant', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }];
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<!-- Chat Button -->
<button class="chat-button" on:click={toggleChat} class:open={isOpen}>
  {#if isOpen}
    ✕
  {:else}
    💬
  {/if}
</button>

<!-- Chat Window -->
{#if isOpen}
  <div class="chat-window">
    <div class="chat-header">
      <div>
        <h3>AI Assistant</h3>
        <p>Ask me anything about Dealer's Choice</p>
      </div>
      <button class="close-btn" on:click={toggleChat}>✕</button>
    </div>

    <div class="chat-messages" bind:this={chatContainer}>
      {#each messages as message}
        <div class="message {message.role}">
          <div class="message-content">
            {message.text}
          </div>
        </div>
      {/each}

      {#if isLoading}
        <div class="message assistant">
          <div class="message-content loading">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="chat-input">
      <input
        type="text"
        bind:value={inputMessage}
        on:keypress={handleKeyPress}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button on:click={sendMessage} disabled={isLoading || !inputMessage.trim()}>
        Send
      </button>
    </div>
  </div>
{/if}

<style>
  .chat-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
    transition: all 0.3s;
    z-index: 1000;
  }

  .chat-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 50px rgba(99, 102, 241, 0.6);
  }

  .chat-button.open {
    background: rgba(255, 255, 255, 0.2);
  }

  .chat-window {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 400px;
    max-width: calc(100vw - 60px);
    height: 600px;
    max-height: calc(100vh - 140px);
    background: rgba(10, 10, 26, 0.95);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(99, 102, 241, 0.3);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    z-index: 999;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chat-header {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    padding: 20px;
    border-radius: 18px 18px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 1.3em;
    color: white;
  }

  .chat-header p {
    margin: 5px 0 0 0;
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.8);
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .chat-messages::-webkit-scrollbar {
    width: 8px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.5);
    border-radius: 10px;
  }

  .message {
    display: flex;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message.user {
    justify-content: flex-end;
  }

  .message-content {
    max-width: 75%;
    padding: 12px 16px;
    border-radius: 15px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message.user .message-content {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    border-bottom-right-radius: 5px;
  }

  .message.assistant .message-content {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    border-bottom-left-radius: 5px;
  }

  .message-content.loading {
    padding: 20px;
  }

  .typing-indicator {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    animation: bounce 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }

  .chat-input {
    padding: 20px;
    border-top: 1px solid rgba(99, 102, 241, 0.2);
    display: flex;
    gap: 10px;
  }

  .chat-input input {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    color: white;
    font-size: 14px;
    transition: all 0.3s;
  }

  .chat-input input:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.15);
  }

  .chat-input input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .chat-input button {
    padding: 12px 24px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .chat-input button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
  }

  .chat-input button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .chat-window {
      width: calc(100vw - 40px);
      height: calc(100vh - 120px);
      right: 20px;
      bottom: 90px;
    }

    .chat-button {
      right: 20px;
      bottom: 20px;
    }
  }
</style>
