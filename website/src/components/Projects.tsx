import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Bot, 
  Cloud, 
  AreaChart, 
  Play, 
  RefreshCw, 
  GitBranch,
  TrendingDown
} from 'lucide-react';

function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function Projects() {
  // Widget States
  const [aiStep, setAiStep] = useState(0); // 0: idle, 1: upload, 2: bedrock, 3: completed
  const [deployState, setDeployState] = useState<'idle' | 'running' | 'done'>('idle');
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [cdnStatus, setCdnStatus] = useState<'idle' | 'miss' | 'hit'>('idle');
  const [cdnLatency, setCdnLatency] = useState(0);
  const [costBudget, setCostBudget] = useState(300);

  // SA Workflow Agentic Orchestrator states
  const [workflowPhase, setWorkflowPhase] = useState<'discovery' | 'design' | 'validation'>('discovery');
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>(['[SYSTEM] Orchestrator standby. Ready to initiate workflow.']);

  const runAgenticWorkflow = () => {
    if (workflowRunning) return;
    setWorkflowRunning(true);
    setWorkflowLogs(['[SYSTEM] Initializing SA Workflow pipeline...', '> booting principal-agent intake...']);
    setActiveAgent('principal-agent');

    const steps = [
      { phase: 'discovery', agent: 'discovery-agent', log: '[discovery-agent] Analyzing company brief & mapping stakeholders...', delay: 800 },
      { phase: 'discovery', agent: 'discovery-agent', log: '[discovery-agent] Generating discovery questions & requirements...', delay: 1600 },
      { phase: 'design', agent: 'design-agent', log: '[design-agent] Developing architectural options & trade-offs...', delay: 2400 },
      { phase: 'design', agent: 'iac-agent', log: '[iac-agent] Synthesizing modular Terraform configurations...', delay: 3200 },
      { phase: 'design', agent: 'diagram-agent', log: '[diagram-agent] Rendering architecture layout diagram...', delay: 4000 },
      { phase: 'validation', agent: 'security-validator', log: '[security-validator] Performing compliance gap analysis (PCI DSS)...', delay: 4800 },
      { phase: 'validation', agent: 'cost-validator', log: '[cost-validator] Fetching live pricing metrics from AWS Pricing API...', delay: 5600 },
      { phase: 'validation', agent: 'red-team-cto', log: '[red-team-cto] Formulating CTO challenge Q&A preparation...', delay: 6400 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setWorkflowPhase(step.phase as any);
        setActiveAgent(step.agent);
        setWorkflowLogs((prev) => [...prev, step.log]);
      }, step.delay);
    });

    setTimeout(() => {
      setWorkflowRunning(false);
      setActiveAgent(null);
      setWorkflowLogs((prev) => [...prev, '[SYSTEM] Workflow complete. All deliverables generated successfully.']);
    }, 7200);
  };

  const resetAgenticWorkflow = () => {
    setWorkflowPhase('discovery');
    setWorkflowRunning(false);
    setActiveAgent(null);
    setWorkflowLogs(['[SYSTEM] Orchestrator standby. Ready to initiate workflow.']);
  };

  // Trigger AI Listing generator simulation
  const runAiPipeline = () => {
    if (aiStep > 0) return;
    setAiStep(1);
    setTimeout(() => {
      setAiStep(2);
      setTimeout(() => {
        setAiStep(3);
      }, 1500);
    }, 1000);
  };

  const resetAiPipeline = () => {
    setAiStep(0);
  };

  // Trigger Terraform Deployment simulator
  const runTerraformDeploy = () => {
    if (deployState === 'running') return;
    setDeployState('running');
    setDeployLogs(['$ git push origin main', '[CI/CD] workflow queued...']);
    
    const logs = [
      '[OIDC]   assumed aws deployment role...',
      '[IAC]    terraform init & select workspace...',
      '[IAC]    terraform apply -auto-approve...',
      '[IAC]    updating multi-az alb listener rules...',
      '[OK]     12 resources deployed successfully!'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        const nextLog = logs[i];
        setDeployLogs((prev) => [...prev, nextLog]);
        i++;
      } else {
        clearInterval(interval);
        setDeployState('done');
      }
    }, 350);
  };

  const resetDeploy = () => {
    setDeployState('idle');
    setDeployLogs([]);
  };

  // Trigger CDN hit/miss simulator
  const triggerCdnFetch = (type: 'hit' | 'miss') => {
    setCdnStatus(type);
    if (type === 'hit') {
      setCdnLatency(14);
    } else {
      setCdnLatency(180);
    }
  };

  return (
    <section id="projects" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
      
      {/* Title Header */}
      <div className="text-center mb-24">
        <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// PORTFOLIO</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Featured Systems</h2>
        <p className="text-textSecondary mt-4 max-w-xl mx-auto text-sm">
          A showcase of custom cloud platforms, serverless structures, and AI execution pipelines. Alternating grids demonstrate live mechanics.
        </p>
      </div>

      <div className="space-y-32">

        {/* Project 1: AI Listing Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentPurple bg-accentPurple/10 border border-accentPurple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #01
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// AI SYSTEMS ORCHESTRATION</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              AI Product Listing Generator
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              Hackathon build utilizing AWS Bedrock (Claude 3.5 Sonnet) to analyze raw product images and automatically generate high-converting SEO marketing listings. Serverless backends run FastAPI inside containers deployed via AWS Lambda.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Core Tech</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Bedrock • Lambda • FastAPI</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">IaC Infrastructure</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Terraform • AWS S3 • CDN</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Codebase
              </a>
            </div>
          </div>

          {/* Interactive Widget Column */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentPurple" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accentPurple" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">AI_PIPELINE_ORCHESTRATOR</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">v1.0.4</span>
            </div>

            {/* Visual Steps container */}
            <div className="flex-1 flex items-center justify-between px-6 relative">
              {/* Connector lines background */}
              <div className="absolute left-10 right-10 top-1/2 h-[1px] bg-white/5 -translate-y-1/2 z-0" />
              {aiStep >= 1 && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: aiStep === 1 ? '50%' : '100%' }}
                  className="absolute left-10 top-1/2 h-[1px] bg-gradient-to-r from-accentCyan to-accentPurple -translate-y-1/2 z-0"
                />
              )}

              {/* Node 1: S3 Upload */}
              <div className="z-10 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs transition-colors duration-300 ${
                  aiStep >= 1 ? 'border-accentCyan bg-accentCyan/10 text-accentCyan' : 'border-white/10 bg-bgSecondary text-textMuted'
                }`}>S3</div>
                <span className="text-[9px] font-mono text-textMuted uppercase">Product Image</span>
              </div>

              {/* Node 2: Lambda API */}
              <div className="z-10 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs transition-colors duration-300 ${
                  aiStep >= 2 ? 'border-accentCyan bg-accentCyan/10 text-accentCyan' : 'border-white/10 bg-bgSecondary text-textMuted'
                }`}>λ</div>
                <span className="text-[9px] font-mono text-textMuted uppercase">FastAPI Processing</span>
              </div>

              {/* Node 3: Bedrock Claude */}
              <div className="z-10 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs transition-colors duration-300 ${
                  aiStep >= 3 ? 'border-accentPurple bg-accentPurple/10 text-accentPurple' : 'border-white/10 bg-bgSecondary text-textMuted'
                }`}><Bot className="w-4.5 h-4.5" /></div>
                <span className="text-[9px] font-mono text-textMuted uppercase">Claude Sonnet</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <span className="font-mono text-[9px] text-textMuted">
                {aiStep === 0 && 'STATUS: STANDBY'}
                {aiStep === 1 && 'STATUS: STREAMING_IMAGE_TO_S3'}
                {aiStep === 2 && 'STATUS: COMPILING_LLM_PROMPTS'}
                {aiStep === 3 && 'STATUS: listing_generation_complete.xml'}
              </span>

              {aiStep === 3 ? (
                <button 
                  onClick={resetAiPipeline}
                  className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textPrimary hover:border-accentPurple/40"
                >
                  Reset Flow
                </button>
              ) : (
                <button 
                  disabled={aiStep > 0}
                  onClick={runAiPipeline}
                  className="px-3 py-1 rounded bg-accentPurple/10 border border-accentPurple/20 text-[9px] font-mono text-accentPurple font-bold hover:border-accentPurple/50 disabled:opacity-50 flex items-center gap-1"
                >
                  <Play className="w-2.5 h-2.5" /> Trigger AI Pipeline
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project 2: HA AWS Infrastructure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Interactive Widget Column (Left on Desktop) */}
          <div className="lg:order-2 space-y-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentCyan bg-accentCyan/10 border border-accentCyan/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #02
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// AUTOMATED CLOUD ARCHITECTURE</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              Pinnacle — Highly Available Infrastructure
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              Production VPC architecture spread across multiple Availability Zones in `eu-west-1`. Incorporates Application Load Balancers (ALB), Auto Scaling groups targeting EC2 fleets, Aurora PostgreSQL DB clusters, and IAM configurations. Deployments are fully automated via Terraform module stacks and secure GitHub Actions OIDC integration.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Network Security</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Multi-AZ Subnets • SSM Access</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Secrets Telemetry</span>
                <p className="text-xs text-textPrimary font-mono mt-1">KMS Encryption • Secrets Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git/pinnacle"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Modules
              </a>
            </div>
          </div>

          {/* Interactive Widget Column */}
          <div className="lg:order-1 rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accentCyan" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">IAC_DEPLOYMENT_CONSOLE</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">SSH: SECURE</span>
            </div>

            <div className="flex-1 p-3 bg-[#050507] overflow-y-auto font-mono text-[9px] md:text-[10px] text-textSecondary text-left my-3 space-y-1 rounded-lg">
              {deployLogs.length === 0 ? (
                <div className="text-textMuted text-center py-8">
                  Click 'Run Deployment Pipeline' to simulate Terraform IaC logs
                </div>
              ) : (
                deployLogs.map((log, idx) => (
                  <div key={idx} className={log?.startsWith('[OK]') ? 'text-[#00FFD1]' : log?.startsWith('$') ? 'text-textPrimary font-bold' : 'text-textSecondary'}>
                    {log}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <span className="font-mono text-[9px] text-textMuted">
                {deployState === 'idle' && 'PIPELINE: STANDBY'}
                {deployState === 'running' && 'PIPELINE: EXECUTING_TERRAFORM'}
                {deployState === 'done' && 'PIPELINE: COMPLIANT'}
              </span>

              {deployState === 'done' ? (
                <button 
                  onClick={resetDeploy}
                  className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textPrimary hover:border-accentCyan/40"
                >
                  Reset Log
                </button>
              ) : (
                <button 
                  disabled={deployState === 'running'}
                  onClick={runTerraformDeploy}
                  className="px-3 py-1 rounded bg-accentCyan/10 border border-accentCyan/20 text-[9px] font-mono text-accentCyan font-bold hover:border-accentCyan/50 disabled:opacity-50 flex items-center gap-1"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${deployState === 'running' ? 'animate-spin' : ''}`} /> Run Deployment Pipeline
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project 3: Live Cloud Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentOrange bg-accentOrange/10 border border-accentOrange/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #03
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// SERVERLESS INFRASTRUCTURE</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              cornelcloud.net — Live Cloud Portfolio
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              This exact environment. Runs completely serverless using an S3 bucket configuration for asset files, accelerated globally via Amazon CloudFront. Custom Lambda routing channels respond to dynamic contact form posts and feed dialogue threads to the AWS Bedrock chatbot instance.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Edge Networks</span>
                <p className="text-xs text-textPrimary font-mono mt-1">CloudFront CDN • Route 53</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">SSL Certificates</span>
                <p className="text-xs text-textPrimary font-mono mt-1">AWS ACM Validation</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Repository
              </a>
              <a
                href="https://cornelcloud.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-textSecondary hover:text-accentCyan transition-colors duration-200"
              >
                <ExternalLink className="w-4.5 h-4.5" />
                Live Link
              </a>
            </div>
          </div>

          {/* Interactive Widget Column */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentOrange" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-accentOrange" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">CDN_CACHE_DIAGNOSTICS</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">EDGE_TEST</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-4 font-mono">
              <div className="flex gap-4">
                <button
                  onClick={() => triggerCdnFetch('hit')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center w-24 text-center transition-all ${
                    cdnStatus === 'hit' ? 'bg-[#00FFD1]/10 border-[#00FFD1] text-[#00FFD1]' : 'border-white/5 bg-white/5 hover:border-accentCyan/30 text-textSecondary'
                  }`}
                >
                  <span className="text-xs font-bold">EDGE HIT</span>
                  <span className="text-[9px] text-textMuted mt-1">14ms latency</span>
                </button>

                <button
                  onClick={() => triggerCdnFetch('miss')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center w-24 text-center transition-all ${
                    cdnStatus === 'miss' ? 'bg-accentOrange/10 border-accentOrange text-accentOrange' : 'border-white/5 bg-white/5 hover:border-accentOrange/30 text-textSecondary'
                  }`}
                >
                  <span className="text-xs font-bold">ORIGIN MISS</span>
                  <span className="text-[9px] text-textMuted mt-1">180ms latency</span>
                </button>
              </div>

              <div className="text-[10px] text-textSecondary h-4 text-center">
                {cdnStatus === 'hit' && '🟢 Served from London edge node (HTTPS Edge Cache hit)'}
                {cdnStatus === 'miss' && '🟡 Fetched from s3 origin bucket in eu-west-1 (Miss)'}
                {cdnStatus === 'idle' && 'Select query pathway to simulate HTTP request routing'}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <span className="font-mono text-[9px] text-textMuted uppercase">
                latency: {cdnLatency > 0 ? `${cdnLatency}ms` : 'STANDBY'}
              </span>
              <span className="font-mono text-[9px] text-textMuted uppercase">
                Cache-Control: public, max-age=31536000
              </span>
            </div>
          </div>
        </div>

        {/* Project 4: AWS Cost Optimization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column (Left on Desktop) */}
          <div className="lg:order-2 space-y-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #04
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// BILLING TELEMETRY &amp; MONITORING</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              AWS Cost Optimization Dashboard
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              Real-time spend aggregation giving small businesses clarity over cloud accounts. Lambda functions schedule daily pulls from the AWS Cost Explorer API, indexing logs inside DynamoDB. Simple dashboard filters display anomalies and project billing projections.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Data Fetcher</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Cost Explorer API • JSON Parsing</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Database Storage</span>
                <p className="text-xs text-textPrimary font-mono mt-1">DynamoDB • Dynamo Streams</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git/Cost-Optimization-Dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Repository
              </a>
            </div>
          </div>

          {/* Interactive Widget Column */}
          <div className="lg:order-1 rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-green-400" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <AreaChart className="w-4 h-4 text-green-400" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">COST_OPTIMIZATION_CALCULATOR</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">API: ONLINE</span>
            </div>

            <div className="flex-1 flex flex-col justify-center font-mono space-y-4 px-2">
              <div className="text-left space-y-1">
                <span className="text-[9px] text-textMuted uppercase tracking-wider">Estimated Monthly AWS Spend</span>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-textPrimary">${costBudget}</span>
                  <span className="text-xs text-green-400 font-bold flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Optimized Spend: ${Math.floor(costBudget * 0.66)}
                  </span>
                </div>
              </div>

              {/* Slider UI */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[9px] text-textMuted uppercase">
                  <span>Min ($50)</span>
                  <span>Max ($1000)</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  value={costBudget} 
                  onChange={(e) => setCostBudget(Number(e.target.value))}
                  className="w-full accent-[#22c55e] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-left">
              <span className="font-mono text-[9px] text-textMuted uppercase">
                Estimated savings: 34% via automated resource cleanup
              </span>
              <span className="font-mono text-[9px] text-green-400 font-bold uppercase">
                Saved: ${Math.floor(costBudget * 0.34)} / mo
              </span>
            </div>
          </div>
        </div>

        {/* Project 5: SA Workflow Agentic Orchestration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentPurple bg-accentPurple/10 border border-accentPurple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #05
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// MULTI-AGENT ORCHESTRATION</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              SA Workflow — Claude Code Orchestrator
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              An autonomous multi-agent Solution Architect pipeline built with Claude Code subagents. Coordinates nine specialized AI agents to execute end-to-end customer engagements, spanning company discovery, diagram rendering, IaC code generation, GDPR security audits, and CTO Q&A validation reports with human checkpoints.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Agent Framework</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Claude Code • Subagent API • MCP</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Generated Outputs</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Terraform • Diagrams • ADR docs</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git/claude-code-sa-workflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Orchestration
              </a>
            </div>
          </div>

          {/* Interactive Widget Column */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[320px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentPurple" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accentPurple" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">AGENTIC_WORKFLOW_ORCHESTRATOR</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">CLAUDE_CODE_CLI</span>
            </div>

            {/* Workflow steps nodes visualization */}
            <div className="flex justify-between items-center px-4 my-2 select-none">
              {/* Phase 1: Discovery */}
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 ${
                workflowPhase === 'discovery' ? 'border-accentCyan bg-accentCyan/10 text-accentCyan scale-105' : 'border-white/5 bg-white/5 text-textMuted'
              }`}>
                <span className="text-[9px] font-mono font-bold">PHASE 01</span>
                <span className="text-[8px] font-mono uppercase">Discovery</span>
                <span className="text-[7px] font-mono text-textMuted">discovery-agent</span>
              </div>

              {/* Arrow */}
              <span className="text-textMuted text-xs">→</span>

              {/* Phase 2: Design */}
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 ${
                workflowPhase === 'design' ? 'border-accentPurple bg-accentPurple/10 text-accentPurple scale-105' : 'border-white/5 bg-white/5 text-textMuted'
              }`}>
                <span className="text-[9px] font-mono font-bold">PHASE 02</span>
                <span className="text-[8px] font-mono uppercase">Design &amp; IaC</span>
                <span className="text-[7px] font-mono text-textMuted">{activeAgent && workflowPhase === 'design' ? activeAgent : 'iac / diagram'}</span>
              </div>

              {/* Arrow */}
              <span className="text-textMuted text-xs">→</span>

              {/* Phase 3: Validation */}
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 ${
                workflowPhase === 'validation' ? 'border-accentOrange bg-accentOrange/10 text-accentOrange scale-105' : 'border-white/5 bg-white/5 text-textMuted'
              }`}>
                <span className="text-[9px] font-mono font-bold">PHASE 03</span>
                <span className="text-[8px] font-mono uppercase">Validation</span>
                <span className="text-[7px] font-mono text-textMuted">{activeAgent && workflowPhase === 'validation' ? activeAgent : 'security / cost'}</span>
              </div>
            </div>

            {/* Console output logs */}
            <div className="h-20 p-2.5 bg-[#050507] overflow-y-auto font-mono text-[8px] md:text-[9px] text-textSecondary text-left rounded-lg space-y-0.5 border border-white/5">
              {workflowLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('[SYSTEM]') ? 'text-accentCyan' : log.startsWith('>') ? 'text-textPrimary font-bold' : 'text-textMuted'}>
                  {log}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <span className="font-mono text-[9px] text-textMuted uppercase">
                Active Node: {activeAgent ? activeAgent.toUpperCase() : 'STANDBY'}
              </span>

              {workflowRunning ? (
                <button 
                  disabled
                  className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textMuted flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Executing Pipeline...
                </button>
              ) : (
                <div className="flex gap-2">
                  {workflowLogs.length > 1 && (
                    <button 
                      onClick={resetAgenticWorkflow}
                      className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textPrimary hover:border-accentPurple/40"
                    >
                      Reset
                    </button>
                  )}
                  <button 
                    onClick={runAgenticWorkflow}
                    className="px-3 py-1 rounded bg-accentPurple/10 border border-accentPurple/20 text-[9px] font-mono text-accentPurple font-bold hover:border-accentPurple/50 flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" /> Run SA Workflow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
