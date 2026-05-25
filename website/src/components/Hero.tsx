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
  'system: initializing cornelcloud core v4.2.1...',
  'system: establishing secure transport to aws [eu-west-1]...',
  'system: loading bedrock ai orchestration profiles...',
  'system: cloud infrastructure link online. secure connection verified.'
];

const sandboxLogs = [
  'command: exec init_sandbox --region eu-west-1',
  '[IAC]   generating dynamic cloudformation templates...',
  '[AWS]   s3 bucket created: sandbox-384920-telemetry',
  '[AWS]   lambda function instantiated: sandbox-processor',
  '[AWS]   vpc subnets configured & gateway linked.',
  '[OK]    isolated cloud sandbox initialized in 840ms.'
];

const iacLogs = [
  'command: exec run_iac_scan --path ./terraform',
  '[SCAN]  checking 18 resource definitions for drift...',
  '[SCAN]  validating iam policies & security groups...',
  '[WARN]  iam_policy.lambda_exec permissions optimized (resolved)',
  '[OK]    0 security vulnerabilities found.',
  '[OK]    tfsec score: 100/100 (compliance validated)'
];

const aiLogs = [
  'command: exec optimize_prompt_chain --model claude-3-5-sonnet',
  '[LLM]   parsing prompt tokens... (4,290 input tokens detected)',
  '[COMP]  detecting redundant system instructions...',
  '[COMP]  compressing context via semantic truncation...',
  '[OK]    prompt optimized. tokens reduced by 34% (saved ~$0.04/run).'
];

export function Hero() {
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [cpuLoad, setCpuLoad] = useState(24);
  const [latency, setLatency] = useState(12);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulate changing stats
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setCpuLoad((prev) => {
        const next = prev + Math.floor(Math.random() * 7) - 3;
        return Math.max(10, Math.min(85, next));
      });
      setLatency((prev) => {
        const next = prev + Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(20, next));
      });
    }, 1500);

    return () => clearInterval(statsInterval);
  }, []);

  const triggerCommand = (command: string, logArray: string[]) => {
    if (activeCommand) return; // Wait for active command
    setActiveCommand(command);
    setLogs((prev) => [...prev, `> booting ${command.toLowerCase()}...`]);

    let i = 0;
    const interval = setInterval(() => {
      if (i < logArray.length) {
        setLogs((prev) => [...prev, logArray[i]]);
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
          AVAILABLE FOR CLOUD &amp; AI ENGINEERING ROLES · UK / REMOTE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-textPrimary leading-[1.1] mb-6 font-sans"
        >
          Building Intelligent Cloud Systems <br />
          <span className="text-gradient">For The AI Era</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-base font-mono text-textSecondary uppercase tracking-[0.25em] mb-10 flex flex-wrap justify-center gap-x-4 gap-y-2"
        >
          <span>Cloud Engineer</span>
          <span className="text-accentCyan/40">•</span>
          <span>AI Systems Builder</span>
          <span className="text-accentCyan/40">•</span>
          <span>Automation Architect</span>
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
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-accentCyan" /> {latency}ms</span>
            <span className="hidden sm:inline">AWS: eu-west-1</span>
          </div>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[300px] h-[340px] md:h-[300px]">
          
          {/* Main Console Log Window (75% width) */}
          <div className="col-span-1 md:col-span-3 p-4 flex flex-col bg-[#050507] overflow-y-auto font-mono text-[11px] md:text-xs text-textSecondary border-b md:border-b-0 md:border-r border-white/5 select-text text-left">
            <div className="flex-1 space-y-1">
              {logs.map((log, idx) => {
                let colorClass = 'text-textSecondary';
                if (log.startsWith('system:')) colorClass = 'text-accentCyan/80 font-bold';
                else if (log.startsWith('>')) colorClass = 'text-textPrimary font-bold border-l-2 border-accentCyan pl-1.5';
                else if (log.startsWith('command:')) colorClass = 'text-[#ffffff]/90 font-semibold';
                else if (log.startsWith('[OK]')) colorClass = 'text-[#00FFD1]';
                else if (log.startsWith('[WARN]')) colorClass = 'text-accentOrange';
                else if (log.startsWith('[IAC]') || log.startsWith('[LLM]') || log.startsWith('[COMP]')) colorClass = 'text-accentPurple/80';
                
                return (
                  <div key={idx} className={`${colorClass} leading-relaxed`}>
                    {log}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
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
                onClick={() => triggerCommand('PROMPT_OPTIMIZE', aiLogs)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 ${
                  activeCommand === 'PROMPT_OPTIMIZE'
                    ? 'bg-[#ff6b35]/10 border-[#ff6b35] text-[#ff6b35]'
                    : 'bg-white/5 border-white/5 text-textPrimary hover:border-[#ff6b35]/30 hover:bg-[#ff6b35]/5'
                } ${activeCommand !== null && activeCommand !== 'PROMPT_OPTIMIZE' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6b35]" />
                  OPTIMIZE_AI
                </div>
                <Play className="w-2.5 h-2.5 opacity-60" />
              </button>
            </div>

            <div className="mt-4 md:mt-0 font-mono text-[10px] text-textMuted uppercase flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-400 animate-pulse" />
              TELEMETRY: ONLINE
            </div>
          </div>

        </div>

        {/* HUD Stats Footer */}
        <div className="bg-[#050507] border-t border-white/5 p-4 grid grid-cols-3 gap-4 text-center font-mono text-[10px] md:text-[11px] select-none">
          <div className="flex flex-col items-center justify-center border-r border-white/5">
            <span className="text-textMuted uppercase tracking-wider mb-1">CPU Load</span>
            <div className="flex items-center gap-2">
              <span className="text-textPrimary font-bold">{cpuLoad}%</span>
              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                <div 
                  className="bg-accentCyan h-full transition-all duration-500 ease-out" 
                  style={{ width: `${cpuLoad}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-white/5">
            <span className="text-textMuted uppercase tracking-wider mb-1">AI Node Status</span>
            <span className="text-[#00FFD1] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FFD1]" /> BEDROCK_OK
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-textMuted uppercase tracking-wider mb-1">IaC Verification</span>
            <span className="text-accentCyan font-bold uppercase tracking-wide">SECURE</span>
          </div>
        </div>
      </motion.div>
      
    </section>
  );
}
