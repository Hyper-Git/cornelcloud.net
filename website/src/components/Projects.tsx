import { useState } from 'react';
import { 
  ExternalLink,
  Cloud,
  AreaChart,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function Projects() {
  // --- Project 5: HA AWS Infrastructure States ---
  const [deployState, setDeployState] = useState<'idle' | 'running' | 'done'>('idle');
  const [deployLogs, setDeployLogs] = useState<string[]>([]);

  const runTerraformDeploy = () => {
    if (deployState === 'running') return;
    setDeployState('running');
    setDeployLogs(['[IAC] Reviewing Terraform deployment...']);
    
    const logs = [
      '[IAC]    Multi-AZ AWS environment configured...',
      '[AWS]    load balancer, Auto Scaling and RDS PostgreSQL Multi-AZ...',
      '[TEST]   CPU stress test run against CloudWatch alarm...',
      '[OK]     SNS alert chain verified; environment torn down to save cost.'
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

  return (
    <section id="projects" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
      
      {/* Title Header */}
      <div className="text-center mb-24">
        <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// PORTFOLIO</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Featured Systems</h2>
        <p className="text-textSecondary mt-4 max-w-xl mx-auto text-sm">
          Four deployed and tested projects covering AWS, Terraform, Kubernetes and cloud cost visibility.
        </p>
      </div>

      <div className="space-y-32">

        {/* ========================================================================= */}
        {/* Project 1: Trades Job Tracker (Kubernetes) - ODD (Details Left / Widget Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentCyan bg-accentCyan/10 border border-accentCyan/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #01
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// KUBERNETES WORKLOAD ORCHESTRATION</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              Trades Job Tracker — Kubernetes Platform
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              A job-status app for trades businesses deployed on a local Kubernetes cluster. I patched seven high-severity OpenSSL findings flagged by Docker Scout and tested self-healing by deleting a live pod.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Cluster Workloads</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Kubernetes Deployments • Services</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Resilience &amp; Config</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Docker Scout • Pod self-healing test</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git/trades-job-tracker-kubernetes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Repository
              </a>
            </div>
          </div>

          {/* Project notes in the original widget column */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">KUBERNETES_TEST_NOTES</span>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3 font-mono text-xs text-textSecondary">
              <span>Job-status app deployed on a local Kubernetes cluster</span>
              <span>Seven high-severity OpenSSL findings patched after Docker Scout review</span>
              <span>Self-healing tested by deleting a live pod</span>
            </div>
            <div className="border-t border-white/5 pt-3 font-mono text-[9px] text-textMuted">LOCAL CLUSTER · TESTED</div>
          </div>
        </div>

        {/* ========================================================================= */}
                {/* Project 5: HA AWS Infrastructure - ODD (Details Left / Widget Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentCyan bg-accentCyan/10 border border-accentCyan/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #02
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// MULTI-AZ AWS ENVIRONMENT</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              Pinnacle — Multi-AZ AWS Environment
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              A Multi-AZ AWS environment deployed with Terraform: load balancer, Auto Scaling, RDS PostgreSQL Multi-AZ and CloudWatch alarms into SNS. I ran a CPU stress test to prove the alert chain worked. The environment is torn down to save cost and rebuilds from code.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Network Security</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Multi-AZ • Load Balancing</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Monitoring</span>
                <p className="text-xs text-textPrimary font-mono mt-1">CloudWatch Alarms • SNS</p>
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
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accentCyan" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">IAC_DEPLOYMENT_CONSOLE</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">PROJECT LOG</span>
            </div>

            <div className="flex-1 p-3 bg-[#050507] overflow-y-auto font-mono text-[9px] md:text-[10px] text-textSecondary text-left my-3 space-y-1 rounded-lg">
              {deployLogs.length === 0 ? (
                <div className="text-textMuted text-center py-8">
                  Run the project log to review the tested Terraform deployment
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
                {deployState === 'done' && 'TEST: VERIFIED'}
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
                  <RefreshCw className={`w-2.5 h-2.5 ${deployState === 'running' ? 'animate-spin' : ''}`} /> Review Deployment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Project 6: Live Cloud Portfolio - EVEN (Details Right / Widget Left) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column (Right on Desktop) */}
          <div className="lg:order-2 space-y-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentOrange bg-accentOrange/10 border border-accentOrange/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #03
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// AWS WEBSITE DEPLOYMENT</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              cornelcloud.net — Live Cloud Portfolio
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              This portfolio website is hosted on AWS and deployed with Terraform.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Hosting</span>
                <p className="text-xs text-textPrimary font-mono mt-1">AWS Hosting</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Deployment</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Terraform Deployment</p>
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

          {/* Interactive Widget Column (Left on Desktop) */}
          <div className="lg:order-1 rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentOrange" />
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Cloud className="w-4 h-4 text-accentOrange" />
              <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">WEBSITE_DEPLOYMENT</span>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3 font-mono text-xs text-textSecondary">
              <span>AWS hosting</span>
              <span>Terraform deployment</span>
              <span>Portfolio of cloud projects and certifications</span>
            </div>
            <div className="border-t border-white/5 pt-3 font-mono text-[9px] text-textMuted">CORNELCLOUD.NET</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Project 7: AWS Cost Optimization - ODD (Details Left / Widget Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #04
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// BILLING TELEMETRY &amp; MONITORING</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              AWS Cost Optimisation Dashboard
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              A browser dashboard that uses Lambda and API Gateway to pull AWS Cost Explorer data.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Data Fetcher</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Cost Explorer • API Gateway</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Display</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Browser Dashboard</p>
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
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-green-400" />
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <AreaChart className="w-4 h-4 text-green-400" />
              <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">COST_EXPLORER_DASHBOARD</span>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3 font-mono text-xs text-textSecondary">
              <span>AWS Cost Explorer data</span>
              <span>Lambda and API Gateway</span>
              <span>Browser dashboard</span>
            </div>
            <div className="border-t border-white/5 pt-3 font-mono text-[9px] text-textMuted">PROJECT OVERVIEW</div>
          </div>
        </div>

      </div>
    </section>
  );
}
