import React, { useState } from 'react';
import { Mail, Send, Terminal, ShieldAlert, Key } from 'lucide-react';

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusLogs, setStatusLogs] = useState<string[]>(['[PORT] Ready for TLS handshake']);
  const API_BASE = (window as any).__API_URL__ || 'https://vr03mmaz83.execute-api.eu-west-1.amazonaws.com';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('sending');
    setStatusLogs((prev) => [...prev, '> initializing secure payload routing...', '[OIDC] checking key signatures...']);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setFormState('success');
        setStatusLogs((prev) => [
          ...prev, 
          '[OK]   encryption keys matched.', 
          '[OK]   API Gateway received message payload.', 
          '[SES]  forwarded to inbox: contact@cornelcloud.net.',
          '[OK]   transmission complete.'
        ]);
        form.reset();
        setTimeout(() => {
          setFormState('idle');
          setStatusLogs(['[PORT] Ready for TLS handshake']);
        }, 8000);
      } else {
        throw new Error('API responded with error');
      }
    } catch (err) {
      setFormState('error');
      setStatusLogs((prev) => [...prev, '[ERR]  transit failed: API_DISCONNECTED.']);
      setTimeout(() => {
        setFormState('idle');
        setStatusLogs(['[PORT] Ready for TLS handshake']);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
      
      {/* Title Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// SECURE_TUNNEL</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Establish Connection</h2>
        <p className="text-textSecondary mt-4 max-w-xl mx-auto text-sm">
          Open to cloud engineering roles, freelance contracts, and systems architecture consultations. Initiates encryption transport.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-4xl mx-auto">
        
        {/* Left Side: Network Anchors */}
        <div className="p-8 rounded-3xl glass-card border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-accentCyan" />
              <h3 className="text-lg font-bold text-textPrimary font-mono tracking-wider uppercase">// DIRECT_LINK_NODES</h3>
            </div>
            
            <p className="text-xs text-textSecondary leading-relaxed">
              If you prefer traditional SMTP mail routing, click a connection node below. Access tokens are encrypted.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:contact@cornelcloud.net"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-accentCyan/30 transition-all duration-300"
              >
                <div className="p-2.5 rounded-lg bg-accentCyan/10 text-accentCyan">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[9px] text-textMuted uppercase tracking-wider">smtp.mail</p>
                  <p className="text-xs font-bold text-textPrimary">contact@cornelcloud.net</p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/cornel-bacanu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-accentCyan/30 transition-all duration-300"
              >
                <div className="p-2.5 rounded-lg bg-accentCyan/10 text-accentCyan">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[9px] text-textMuted uppercase tracking-wider">social.linkedin</p>
                  <p className="text-xs font-bold text-textPrimary">linkedin.com/in/cornel-bacanu</p>
                </div>
              </a>

              <a
                href="https://github.com/Hyper-Git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-accentCyan/30 transition-all duration-300"
              >
                <div className="p-2.5 rounded-lg bg-accentCyan/10 text-accentCyan">
                  <Github className="w-4 h-4" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[9px] text-textMuted uppercase tracking-wider">code.github</p>
                  <p className="text-xs font-bold text-textPrimary">github.com/Hyper-Git</p>
                </div>
              </a>
            </div>
          </div>
          
          {/* Transmission status logs (dynamic!) */}
          <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-left text-textMuted space-y-1 bg-[#050507] p-3 rounded-lg border border-white/5">
            <div className="text-accentCyan font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Transit logs:
            </div>
            {statusLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('[OK]') ? 'text-[#00FFD1]' : log.startsWith('[ERR]') ? 'text-red-400' : 'text-textMuted'}>
                {log}
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Transmission Terminal Input form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-[2rem] glass-card border border-white/5 space-y-6 relative text-left">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentPurple" />
          
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-5 h-5 text-accentPurple" />
            <h3 className="text-lg font-bold text-textPrimary font-mono tracking-wider uppercase">// DISPATCH_TRANSMISSION</h3>
          </div>

          {/* Name Field */}
          <div className="relative font-mono text-left">
            <div className="text-[9px] text-accentPurple uppercase tracking-wider mb-1">DATA_STREAM_01 / Sender Name</div>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full bg-[#050507] border border-white/15 focus:border-accentPurple rounded-lg px-3.5 py-2.5 text-xs text-textPrimary outline-none focus:shadow-[0_0_12px_rgba(124,58,237,0.15)] transition-all font-mono"
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Email Field */}
          <div className="relative font-mono text-left">
            <div className="text-[9px] text-accentPurple uppercase tracking-wider mb-1">DATA_STREAM_02 / Sender Email</div>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full bg-[#050507] border border-white/15 focus:border-accentPurple rounded-lg px-3.5 py-2.5 text-xs text-textPrimary outline-none focus:shadow-[0_0_12px_rgba(124,58,237,0.15)] transition-all font-mono"
              placeholder="e.g. johndoe@company.com"
            />
          </div>

          {/* Message Field */}
          <div className="relative font-mono text-left">
            <div className="text-[9px] text-accentPurple uppercase tracking-wider mb-1">DATA_STREAM_03 / Discovery Memo</div>
            <textarea
              name="message"
              id="message"
              rows={4}
              required
              className="w-full bg-[#050507] border border-white/15 focus:border-accentPurple rounded-lg px-3.5 py-2.5 text-xs text-textPrimary outline-none focus:shadow-[0_0_12px_rgba(124,58,237,0.15)] transition-all font-mono resize-none"
              placeholder="Detail your cloud infrastructure needs, freelance inquiries, or recruitment details..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState === 'sending' || formState === 'success'}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
              formState === 'sending'
                ? 'bg-white/5 text-textMuted border border-white/15 cursor-not-allowed'
                : formState === 'success'
                  ? 'bg-[#00FFD1]/10 border border-[#00FFD1] text-[#00FFD1] hover:shadow-[0_0_20px_rgba(0,255,209,0.25)] font-bold'
                  : formState === 'error'
                    ? 'bg-red-950/20 border border-red-500 text-red-400 font-bold'
                    : 'bg-accentPurple/10 border border-accentPurple/25 text-accentPurple hover:border-accentPurple/60 hover:bg-accentPurple/20 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(124,58,237,0.25)] cursor-pointer'
            }`}
          >
            {formState === 'sending' ? (
              'TRANSMITTING_ENCRYPTED_PACKET...'
            ) : formState === 'success' ? (
              'TRANSMISSION SUCCESSFUL ✓'
            ) : formState === 'error' ? (
              <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> HANDSHAKE_FAILURE - RETRY</span>
            ) : (
              <>
                DISPATCH_PAYLOAD
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
