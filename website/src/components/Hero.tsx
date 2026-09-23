import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Globe, 
  Activity, 
  Play, 
  Server, 
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const initialLogs = [
  'system: cornelcloud portfolio ready',
  'system: AWS and Kubernetes projects documented',
  'system: looking for a first commercial cloud support role'
];

const sandboxLogs = [
  'command: review pinnacle',
  '[IAC]   Terraform configuration deployed on AWS',
  '[AWS]   load balancer, Auto Scaling and RDS PostgreSQL Multi-AZ configured',
  '[OK]    environment tested and torn down to save cost'
];

const iacLogs = [
  'command: review alert test',
  '[IAC]   CloudWatch alarms configured with SNS notifications',
  '[TEST]  CPU stress test run',
  '[OK]    alert chain tested'
];

const projectLogs = [
  'command: review trades job tracker',
  '[K8S]   job-status app deployed on a local Kubernetes cluster',
  '[TEST]  live pod deleted to test self-healing',
  '[OK]    replacement pod observed'
];

export function Hero() {
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const triggerCommand = (command: string, logArray: string[]) => {
    if (activeCommand) return; // Wait for active command
    setActiveCommand(command);
    setLogs((prev) => [...prev, `> booting ${command.toLowerCase()}...`]);

    let i = 0;
    const interval = setInterval(() => {
      if (i < logArray.length) {
        const nextLog = logArray[i];
        setLogs((prev) => [...prev, nextLog]);
        i++;
      } else {
        clearInterval(interval);
        setActiveCommand(null);
      }
    }, 250);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-6 md:px-16 overflow-hidden">
      
      {/* Background glow overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accentCyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accentPurple/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Overlay Line System */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Centered Typography */}
      <div className="max-w-4xl w-full text-center z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accentCyan/20 bg-accentCyan/5 text-xs text-accentCyan font-mono mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          SEEKING ENTRY-LEVEL CLOUD SUPPORT · YORK / LEEDS / UK REMOTE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-textPrimary leading-[1.1] mb-6 font-sans"
        >
          Learning Through Cloud Projects <br />
          <span className="text-gradient">Ready For Cloud Support</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-base font-mono text-textSecondary uppercase tracking-[0.25em] mb-10 flex flex-wrap justify-center gap-x-4 gap-y-2"
        >
          <span>Junior Cloud Support Engineer</span>
          <span className="text-accentCyan/40">•</span>
          <span>AWS re/Start Graduate</span>
          <span className="text-accentCyan/40">•</span>
          <span>Cloud Operations</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={() => scrollTo('skills')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-accentCyan to-accentPurple text-bgPrimary font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] interactive-hover"
          >
            Explore Systems
          </button>
          <button
            onClick={() => scrollTo('projects')}
            className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-accentCyan/40 hover:bg-accentCyan/5 text-textPrimary font-semibold text-sm transition-all duration-300 interactive-hover"
          >
            View Projects
          </button>
        </motion.div>
      </div>

      {/* Interactive OS Dashboard Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl glass-card glass-card-glow rounded-2xl overflow-hidden border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-10"
      >
        {/* Terminal Header Bar */}
        <div className="bg-[#0b0c10] px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="text-[10px] font-mono text-textMuted ml-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-accentCyan" />
              cornelcloud-core-shell v4.2.1
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-textMuted uppercase tracking-wider">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-accentCyan" /> York, UK</span>
            <span className="hidden sm:inline">AWS &amp; KUBERNETES PROJECTS</span>
          </div>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[300px] h-[340px] md:h-[300px]">
          
          {/* Main Console Log Window (75% width) */}
          <div 
            ref={terminalContainerRef}
            className="col-span-1 md:col-span-3 p-4 flex flex-col bg-[#050507] overflow-y-auto font-mono text-[11px] md:text-xs text-textSecondary border-b md:border-b-0 md:border-r border-white/5 select-text text-left"
          >
            <div className="flex-1 space-y-1">
              {logs.map((log, idx) => {
                let colorClass = 'text-textSecondary';
                if (log?.startsWith('system:')) colorClass = 'text-accentCyan/80 font-bold';
                else if (log?.startsWith('>')) colorClass = 'text-textPrimary font-bold border-l-2 border-accentCyan pl-1.5';
                else if (log?.startsWith('command:')) colorClass = 'text-[#ffffff]/90 font-semibold';
                else if (log?.startsWith('[OK]')) colorClass = 'text-[#00FFD1]';
                else if (log?.startsWith('[WARN]')) colorClass = 'text-accentOrange';
                else if (log?.startsWith('[IAC]') || log?.startsWith('[K8S]') || log?.startsWith('[TEST]')) colorClass = 'text-accentPurple/80';
                
                return (
                  <div key={idx} className={`${colorClass} leading-relaxed`}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Actions Panel (25% width) */}
          <div className="col-span-1 p-4 bg-[#0a0b0f] flex flex-col justify-between select-none">
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-textMuted uppercase tracking-widest border-b border-white/5 pb-2 mb-3 text-left">
                SYSTEM_TRIGGERS
              </div>
              
              <button
                disabled={activeCommand !== null}
                onClick={() => triggerCommand('INIT_SANDBOX', sandboxLogs)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 ${
                  activeCommand === 'INIT_SANDBOX'
                    ? 'bg-accentCyan/10 border-accentCyan text-accentCyan'
                    : 'bg-white/5 border-white/5 text-textPrimary hover:border-accentCyan/30 hover:bg-accentCyan/5'
                } ${activeCommand !== null && activeCommand !== 'INIT_SANDBOX' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Server className="w-3.5 h-3.5 text-accentCyan" />
                  INIT_SANDBOX
                </div>
                <Play className="w-2.5 h-2.5 opacity-60" />
              </button>

              <button
                disabled={activeCommand !== null}
                onClick={() => triggerCommand('RUN_IAC_SCAN', iacLogs)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 ${
                  activeCommand === 'RUN_IAC_SCAN'
                    ? 'bg-accentPurple/10 border-accentPurple text-accentPurple'
                    : 'bg-white/5 border-white/5 text-textPrimary hover:border-accentPurple/30 hover:bg-accentPurple/5'
                } ${activeCommand !== null && activeCommand !== 'RUN_IAC_SCAN' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-accentPurple" />
                  RUN_IAC_SCAN
                </div>
                <Play className="w-2.5 h-2.5 opacity-60" />
              </button>

              <button
                disabled={activeCommand !== null}
                onClick={() => triggerCommand('REVIEW_K8S_TEST', projectLogs)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 ${
                  activeCommand === 'REVIEW_K8S_TEST'
                    ? 'bg-[#ff6b35]/10 border-[#ff6b35] text-[#ff6b35]'
                    : 'bg-white/5 border-white/5 text-textPrimary hover:border-[#ff6b35]/30 hover:bg-[#ff6b35]/5'
                } ${activeCommand !== null && activeCommand !== 'REVIEW_K8S_TEST' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6b35]" />
                  REVIEW_K8S_TEST
                </div>
                <Play className="w-2.5 h-2.5 opacity-60" />
              </button>
            </div>

            <div className="mt-4 md:mt-0 font-mono text-[10px] text-textMuted uppercase flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-400 animate-pulse" />
              PROJECT NOTES: READY
            </div>
          </div>

        </div>

        {/* HUD Stats Footer */}
        <div className="bg-[#050507] border-t border-white/5 p-4 grid grid-cols-3 gap-4 text-center font-mono text-[10px] md:text-[11px] select-none">
          <div className="flex flex-col items-center justify-center border-r border-white/5">
            <span className="text-textMuted uppercase tracking-wider mb-1">AWS Project</span>
            <span className="text-textPrimary font-bold">DEPLOYED</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-white/5">
            <span className="text-textMuted uppercase tracking-wider mb-1">Kubernetes Project</span>
            <span className="text-[#00FFD1] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FFD1]" /> TESTED
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-textMuted uppercase tracking-wider mb-1">Terraform Associate</span>
            <span className="text-accentCyan font-bold uppercase tracking-wide">CERTIFIED</span>
          </div>
        </div>
      </motion.div>
      
    </section>
  );
}
