import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Send, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Handshake verified. I am Cornel's Cloud/AI Copilot. Ask me questions about his AWS architectures, Terraform IaC, or Python integrations." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const API_BASE = (window as any).__API_URL__ || 'https://vr03mmaz83.execute-api.eu-west-1.amazonaws.com';

  // Get or create unique session ID
  const sessionId = useRef<string>('');

  useEffect(() => {
    let storedId = sessionStorage.getItem('chatSessionId');
    if (!storedId) {
      storedId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('chatSessionId', storedId);
    }
    sessionId.current = storedId;
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text) return;

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionId.current
        })
      });

      if (!res.ok) throw new Error('API failure');
      
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.response || "No response received. Check API endpoint." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Error establishing API gateway uplink. Please verify connection and retry." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] hidden md:block">
      {/* Floating Toggle Button (CLI theme) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-bgSecondary border border-accentCyan/30 text-accentCyan flex items-center justify-center shadow-2xl hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300 interactive-hover"
      >
        {isOpen ? <X className="w-5 h-5 text-accentCyan" /> : <Terminal className="w-5.5 h-5.5 text-accentCyan" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-[380px] h-[480px] rounded-2xl glass-card border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden select-text text-left"
          >
            {/* Header */}
            <div className="p-3.5 bg-[#0b0c10] border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <h4 className="text-[10px] font-mono font-bold text-accentCyan uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  CORNELCLOUD_COPILOT v2.0
                </h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-textSecondary hover:text-accentCyan transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Outputs */}
            <div className="flex-1 p-4 bg-[#050507] overflow-y-auto space-y-4 font-mono text-xs select-text">
              {messages.map((msg, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-[10px] text-textMuted select-none">
                    {msg.sender === 'user' ? (
                      <span className="text-[#00FFD1] font-semibold">guest@client:~$</span>
                    ) : (
                      <span className="text-accentPurple font-semibold">copilot@aws:~$</span>
                    )}
                  </div>
                  <div className={`leading-relaxed pl-2 border-l ${
                    msg.sender === 'user' ? 'border-[#00FFD1]/20 text-textPrimary' : 'border-accentPurple/20 text-textSecondary'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {isTyping && (
                <div className="space-y-1">
                  <div className="text-[10px] text-textMuted select-none">
                    <span className="text-accentPurple font-semibold">copilot@aws:~$</span>
                  </div>
                  <div className="pl-2 border-l border-accentPurple/20 text-textSecondary flex items-center gap-1 text-[10px] animate-pulse">
                    <span>resolving pipeline prompts...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input shell prompt */}
            <div className="p-3 border-t border-white/5 bg-[#0b0c10] flex items-center gap-2 font-mono select-none">
              <ChevronRight className="w-4.5 h-4.5 text-accentCyan shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about S3, Terraform, etc..."
                className="flex-1 bg-transparent border-none text-xs text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-0 font-mono"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-1.5 rounded bg-accentCyan/10 border border-accentCyan/20 text-accentCyan hover:bg-accentCyan hover:text-bgPrimary transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
