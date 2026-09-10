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
  TrendingDown,
  Boxes,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Database,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function Projects() {
  // --- Project 1: Trades Job Tracker (Kubernetes) States ---
  const [k8sStage, setK8sStage] = useState<'quoted' | 'booked' | 'in_progress' | 'complete'>('in_progress');
  const [frontendPods, setFrontendPods] = useState<Array<{ id: string; name: string; status: 'Running' | 'Terminating' | 'ContainerCreating'; ready: string }>>([
    { id: 'pod-1', name: 'frontend-7d9b-a1', status: 'Running', ready: '1/1' },
    { id: 'pod-2', name: 'frontend-7d9b-b4', status: 'Running', ready: '1/1' },
  ]);
  const [k8sChaosRunning, setK8sChaosRunning] = useState(false);
  const [k8sLogs, setK8sLogs] = useState<string[]>([
    '[K8S] Cluster: docker-desktop-kind // Namespace: trades-job-tracker',
    '[INGRESS] Traefik routing: / -> frontend-svc:80 (2 Replicas healthy)',
    '[INGRESS] Traefik routing: /api -> backend-svc:3000 (1 Replica healthy)',
  ]);

  const simulateK8sCrash = () => {
    if (k8sChaosRunning) return;
    setK8sChaosRunning(true);
    setK8sLogs((prev) => [
      ...prev,
      '$ kubectl delete pod frontend-7d9b-a1 --now',
      '[CHAOS] frontend-7d9b-a1 marked Terminating. Traffic shifting to healthy replica...'
    ]);

    setFrontendPods([
      { id: 'pod-1', name: 'frontend-7d9b-a1', status: 'Terminating', ready: '0/1' },
      { id: 'pod-2', name: 'frontend-7d9b-b4', status: 'Running', ready: '1/1' }
    ]);

    setTimeout(() => {
      setK8sLogs((prev) => [
        ...prev,
        '[REPLICASET] deployment/frontend drift detected: desired=2, current=1',
        '[SCHEDULER] Assigning new pod frontend-7d9b-c8 to node-1...'
      ]);
      setFrontendPods([
        { id: 'pod-2', name: 'frontend-7d9b-b4', status: 'Running', ready: '1/1' },
        { id: 'pod-3', name: 'frontend-7d9b-c8', status: 'ContainerCreating', ready: '0/1' }
      ]);
    }, 1200);

    setTimeout(() => {
      setK8sLogs((prev) => [
        ...prev,
        '[KUBELET] Pulling image trades-job-tracker-frontend:1.0 (local)',
        '[PROBE] HTTP GET /healthz 200 OK -> Readiness Probe passed',
        '[OK] deployment/frontend self-healed to desired state (2/2 ready).'
      ]);
      setFrontendPods([
        { id: 'pod-2', name: 'frontend-7d9b-b4', status: 'Running', ready: '1/1' },
        { id: 'pod-3', name: 'frontend-7d9b-c8', status: 'Running', ready: '1/1' }
      ]);
      setK8sChaosRunning(false);
    }, 2800);
  };

  const resetK8sCluster = () => {
    setFrontendPods([
      { id: 'pod-1', name: 'frontend-7d9b-a1', status: 'Running', ready: '1/1' },
      { id: 'pod-2', name: 'frontend-7d9b-b4', status: 'Running', ready: '1/1' },
    ]);
    setK8sChaosRunning(false);
    setK8sStage('in_progress');
    setK8sLogs([
      '[K8S] Cluster: docker-desktop-kind // Namespace: trades-job-tracker',
      '[INGRESS] Traefik routing: / -> frontend-svc:80 (2 Replicas healthy)',
      '[INGRESS] Traefik routing: /api -> backend-svc:3000 (1 Replica healthy)',
    ]);
  };

  // --- Project 2: Zero-Trust Data Vault (KCNA) States ---
  const [vaultActionRunning, setVaultActionRunning] = useState(false);
  const [vaultPolicyStatus, setVaultPolicyStatus] = useState<'idle' | 'allowed' | 'denied'>('idle');
  const [storedSecretCount, setStoredSecretCount] = useState(4);
  const [vaultLogs, setVaultLogs] = useState<string[]>([
    '[K8S] Zero-Trust CNI active: Calico NetworkPolicy enforced',
    '[POLICY] db-network-policy: Ingress TCP:5432 allowed ONLY from {app: vault-api}',
    '[STORAGE] PVC bound: data-volume (10Gi ReadWriteOnce on hostpath)',
  ]);

  const runAuthorizedVaultStore = () => {
    if (vaultActionRunning) return;
    setVaultActionRunning(true);
    setVaultPolicyStatus('allowed');
    setVaultLogs((prev) => [
      ...prev,
      '$ curl -X POST http://api-service:80/data -d \'{"name":"salary_record"}\'',
      '[ROUTING] NodePort:8000 -> api-service:80 -> api-pod-replica-1',
      '[SECRET] Injecting base64 credentials from db-secret (DB_PASS: ********)...',
      '[NETPOL] Match label {app: vault-api} == allowed! Forwarding TCP 5432...',
      '[POSTGRES] INSERT INTO vault (name, secret) VALUES (\'salary_record\', ...) -> 200 OK',
      '[OK] Secret encrypted and persisted to PVC storage successfully.'
    ]);
    setStoredSecretCount((prev) => prev + 1);
    setTimeout(() => {
      setVaultActionRunning(false);
    }, 1200);
  };

  const runUnauthorizedRogueAttempt = () => {
    if (vaultActionRunning) return;
    setVaultActionRunning(true);
    setVaultPolicyStatus('denied');
    setVaultLogs((prev) => [
      ...prev,
      '$ kubectl exec -it rogue-pod -- nc -zv postgres-db 5432',
      '[TRAFFIC] Packet from pod {app: rogue-test} targeting postgres-db:5432',
      '[NETPOL] Evaluating db-network-policy ingress rules...',
      '[DENIED] CNI Drop: label {app: rogue-test} does NOT match {app: vault-api}',
      '[SEC_ALERT] Unauthorized lateral connection attempt blocked (Zero-Trust enforced).'
    ]);
    setTimeout(() => {
      setVaultActionRunning(false);
    }, 1200);
  };

  const resetVault = () => {
    setVaultActionRunning(false);
    setVaultPolicyStatus('idle');
    setStoredSecretCount(4);
    setVaultLogs([
      '[K8S] Zero-Trust CNI active: Calico NetworkPolicy enforced',
      '[POLICY] db-network-policy: Ingress TCP:5432 allowed ONLY from {app: vault-api}',
      '[STORAGE] PVC bound: data-volume (10Gi ReadWriteOnce on hostpath)',
    ]);
  };

  // --- Project 3: SA Workflow States ---
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

  // --- Project 4: AI Listing Generator States ---
  const [aiStep, setAiStep] = useState(0);

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

  // --- Project 5: HA AWS Infrastructure States ---
  const [deployState, setDeployState] = useState<'idle' | 'running' | 'done'>('idle');
  const [deployLogs, setDeployLogs] = useState<string[]>([]);

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

  // --- Project 6: cornelcloud.net States ---
  const [cdnStatus, setCdnStatus] = useState<'idle' | 'miss' | 'hit'>('idle');
  const [cdnLatency, setCdnLatency] = useState(0);

  const triggerCdnFetch = (type: 'hit' | 'miss') => {
    setCdnStatus(type);
    if (type === 'hit') {
      setCdnLatency(14);
    } else {
      setCdnLatency(180);
    }
  };

  // --- Project 7: Cost Optimization States ---
  const [costBudget, setCostBudget] = useState(300);

  return (
    <section id="projects" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
      
      {/* Title Header */}
      <div className="text-center mb-24">
        <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// PORTFOLIO</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Featured Systems</h2>
        <p className="text-textSecondary mt-4 max-w-xl mx-auto text-sm">
          A showcase of custom cloud platforms, Kubernetes orchestrations, serverless infrastructure, and autonomous AI pipelines.
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
              A Kubernetes-native microservices platform managing multi-stage trade business lifecycles (Quoted → Booked → In Progress → Complete). Implements Traefik Ingress routing, decoupled Nginx frontend and Express backend workloads, ConfigMap &amp; runtime Secret injection, and self-healing ReplicaSets with readiness and liveness health probes.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Cluster Workloads</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Traefik Ingress • Pod Deployments • Helm</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Resilience &amp; Config</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Self-Healing ReplicaSets • Probes • Secrets</p>
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

          {/* Interactive Widget Column */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[330px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-accentCyan" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">K8S_WORKLOAD_ORCHESTRATOR</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">DOCKER_DESKTOP_KIND</span>
            </div>

            {/* Lifecycle stages buttons */}
            <div className="flex items-center justify-between gap-1 my-1 p-1 bg-white/5 rounded-xl border border-white/5 select-none">
              {(['quoted', 'booked', 'in_progress', 'complete'] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setK8sStage(stage)}
                  className={`flex-1 py-1 px-1 rounded-lg text-[8px] font-mono uppercase font-semibold transition-all ${
                    k8sStage === stage
                      ? 'bg-accentCyan text-bgPrimary shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                      : 'text-textMuted hover:text-textPrimary'
                  }`}
                >
                  {stage.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Live Pods Status Grid */}
            <div className="grid grid-cols-3 gap-2 my-1">
              {frontendPods.map((pod) => (
                <div 
                  key={pod.id}
                  className={`p-2 rounded-xl border font-mono transition-all duration-300 flex flex-col justify-between text-left ${
                    pod.status === 'Running'
                      ? 'border-accentCyan/30 bg-accentCyan/5 text-textPrimary'
                      : pod.status === 'Terminating'
                        ? 'border-accentOrange/40 bg-accentOrange/10 text-accentOrange animate-pulse'
                        : 'border-accentPurple/40 bg-accentPurple/10 text-accentPurple animate-pulse'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-textMuted truncate">{pod.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${pod.status === 'Running' ? 'bg-[#00FFD1]' : 'bg-accentOrange'}`} />
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-[8px]">
                    <span className="font-bold">{pod.status}</span>
                    <span className="text-textMuted text-[7px]">{pod.ready}</span>
                  </div>
                </div>
              ))}
              
              {/* Backend Pod */}
              <div className="p-2 rounded-xl border border-white/10 bg-white/5 font-mono flex flex-col justify-between text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-textMuted truncate">backend-pod-01</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFD1]" />
                </div>
                <div className="mt-1 flex items-baseline justify-between text-[8px]">
                  <span className="font-bold text-accentPurple">Express API</span>
                  <span className="text-textMuted text-[7px]">1/1 Ready</span>
                </div>
              </div>
            </div>

            {/* Console output logs */}
            <div className="h-16 p-2 bg-[#050507] overflow-y-auto font-mono text-[8px] md:text-[9px] text-textSecondary text-left rounded-lg space-y-0.5 border border-white/5">
              {k8sLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={
                    log.startsWith('[OK]') ? 'text-[#00FFD1]' : 
                    log.startsWith('[CHAOS]') ? 'text-accentOrange' : 
                    log.startsWith('$') ? 'text-textPrimary font-bold' : 
                    log.startsWith('[REPLICASET]') ? 'text-accentCyan' : 
                    'text-textSecondary'
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
              <span className="font-mono text-[9px] text-textMuted uppercase flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#00FFD1]" />
                Ingress: Traefik (/ &amp; /api)
              </span>

              {k8sChaosRunning ? (
                <button 
                  disabled
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textMuted flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Self-Healing...
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={resetK8sCluster}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textPrimary hover:border-accentCyan/40"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={simulateK8sCrash}
                    className="px-2.5 py-1 rounded bg-accentCyan/10 border border-accentCyan/30 text-[9px] font-mono text-accentCyan font-bold hover:border-accentCyan/60 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-2.5 h-2.5" /> Kill Pod (Chaos)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Project 2: Zero-Trust Data Vault (KCNA) - EVEN (Details Right / Widget Left) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column (Right on Desktop) */}
          <div className="lg:order-2 space-y-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentPurple bg-accentPurple/10 border border-accentPurple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #02
              </span>
              <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">// ZERO-TRUST KUBERNETES &amp; PERSISTENCE</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight">
              The Zero-Trust Data Vault — KCNA Showcase
            </h3>
            
            <p className="text-sm text-textSecondary leading-relaxed">
              A cloud-native security and persistent storage platform demonstrating core Kubernetes &amp; Cloud Native Associate (KCNA) curriculum concepts. Features a stateless Python FastAPI application load-balanced across three replicas, stateful PostgreSQL storage with PersistentVolumeClaims (PVC), Base64 Secrets injection, and strict Zero-Trust NetworkPolicies enforcing least-privilege DB isolation.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">Security &amp; Policy</span>
                <p className="text-xs text-textPrimary font-mono mt-1">NetworkPolicies (Zero-Trust) • Secrets • RBAC</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-textMuted uppercase">State &amp; Resilience</span>
                <p className="text-xs text-textPrimary font-mono mt-1">Postgres PVC (10Gi) • 3x Replicas • NodePort</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/Hyper-Git/KCNA_project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-textPrimary hover:text-accentCyan transition-colors duration-200"
              >
                <Github className="w-4.5 h-4.5" />
                Inspect Repository
              </a>
            </div>
          </div>

          {/* Interactive Widget Column (Left on Desktop) */}
          <div className="lg:order-1 rounded-3xl glass-card border border-white/5 p-6 h-[330px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentPurple" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accentPurple" />
                <span className="font-mono text-[10px] text-textPrimary uppercase tracking-wider">ZERO_TRUST_SECURITY_CONSOLE</span>
              </div>
              <span className="text-[9px] font-mono text-textMuted uppercase">KCNA_SHOWCASE</span>
            </div>

            {/* Architecture Node Map */}
            <div className="grid grid-cols-3 gap-2 my-1 select-none">
              {/* Node 1: FastAPI Replicas */}
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 font-mono text-left">
                <div className="flex items-center justify-between text-[8px] text-textMuted">
                  <span>API WORKLOAD</span>
                  <span className="text-accentCyan font-bold">3x Pods</span>
                </div>
                <div className="text-[10px] font-bold text-textPrimary mt-1 flex items-center gap-1">
                  <Server className="w-3 h-3 text-accentCyan" />
                  FastAPI
                </div>
                <span className="text-[7px] text-accentCyan/80 font-mono block mt-1 truncate">
                  label: app=vault-api
                </span>
              </div>

              {/* Node 2: NetworkPolicy Guard */}
              <div className={`p-2.5 rounded-xl border font-mono text-left transition-all duration-300 ${
                vaultPolicyStatus === 'allowed'
                  ? 'border-[#00FFD1]/40 bg-[#00FFD1]/10 text-textPrimary'
                  : vaultPolicyStatus === 'denied'
                    ? 'border-accentOrange/40 bg-accentOrange/10 text-accentOrange animate-pulse'
                    : 'border-accentPurple/30 bg-accentPurple/5 text-textPrimary'
              }`}>
                <div className="flex items-center justify-between text-[8px] text-textMuted">
                  <span>ZERO-TRUST</span>
                  {vaultPolicyStatus === 'denied' ? (
                    <ShieldAlert className="w-3 h-3 text-accentOrange" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-accentPurple" />
                  )}
                </div>
                <div className="text-[10px] font-bold mt-1 truncate">
                  NetPolicy: 5432
                </div>
                <span className="text-[7px] font-mono block mt-1 text-textMuted">
                  {vaultPolicyStatus === 'denied' ? 'BLOCKED CNI' : 'Enforcing Ingress'}
                </span>
              </div>

              {/* Node 3: Stateful PostgreSQL PVC */}
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 font-mono text-left">
                <div className="flex items-center justify-between text-[8px] text-textMuted">
                  <span>STATEFUL DB</span>
                  <span className="text-[#00FFD1] font-bold">PVC 10Gi</span>
                </div>
                <div className="text-[10px] font-bold text-textPrimary mt-1 flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#ff6b35]" />
                  Postgres 15
                </div>
                <span className="text-[7px] text-textMuted font-mono block mt-1 truncate">
                  Secrets: {storedSecretCount} records
                </span>
              </div>
            </div>

            {/* Console output logs */}
            <div className="h-16 p-2 bg-[#050507] overflow-y-auto font-mono text-[8px] md:text-[9px] text-textSecondary text-left rounded-lg space-y-0.5 border border-white/5">
              {vaultLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={
                    log.startsWith('[OK]') ? 'text-[#00FFD1]' : 
                    log.startsWith('[DENIED]') || log.startsWith('[SEC_ALERT]') ? 'text-accentOrange font-bold' : 
                    log.startsWith('$') ? 'text-textPrimary font-bold' : 
                    log.startsWith('[NETPOL]') ? 'text-accentPurple' : 
                    'text-textSecondary'
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
              <span className="font-mono text-[9px] text-textMuted uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-accentPurple" />
                NetworkPolicy: Active
              </span>

              <div className="flex gap-2">
                <button 
                  onClick={resetVault}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-textPrimary hover:border-accentPurple/40"
                >
                  Reset
                </button>
                <button 
                  disabled={vaultActionRunning}
                  onClick={runUnauthorizedRogueAttempt}
                  className="px-2.5 py-1 rounded bg-accentOrange/10 border border-accentOrange/30 text-[9px] font-mono text-accentOrange font-bold hover:border-accentOrange/60 flex items-center gap-1"
                >
                  <AlertTriangle className="w-2.5 h-2.5" /> Rogue Test (Block)
                </button>
                <button 
                  disabled={vaultActionRunning}
                  onClick={runAuthorizedVaultStore}
                  className="px-2.5 py-1 rounded bg-accentPurple/10 border border-accentPurple/30 text-[9px] font-mono text-accentPurple font-bold hover:border-accentPurple/60 flex items-center gap-1"
                >
                  <Play className="w-2.5 h-2.5" /> Store Secret
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Project 3: SA Workflow - ODD (Details Left / Widget Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentPurple bg-accentPurple/10 border border-accentPurple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #03
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
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 ${
                workflowPhase === 'discovery' ? 'border-accentCyan bg-accentCyan/10 text-accentCyan scale-105' : 'border-white/5 bg-white/5 text-textMuted'
              }`}>
                <span className="text-[9px] font-mono font-bold">PHASE 01</span>
                <span className="text-[8px] font-mono uppercase">Discovery</span>
                <span className="text-[7px] font-mono text-textMuted">discovery-agent</span>
              </div>

              <span className="text-textMuted text-xs">→</span>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 ${
                workflowPhase === 'design' ? 'border-accentPurple bg-accentPurple/10 text-accentPurple scale-105' : 'border-white/5 bg-white/5 text-textMuted'
              }`}>
                <span className="text-[9px] font-mono font-bold">PHASE 02</span>
                <span className="text-[8px] font-mono uppercase">Design &amp; IaC</span>
                <span className="text-[7px] font-mono text-textMuted">{activeAgent && workflowPhase === 'design' ? activeAgent : 'iac / diagram'}</span>
              </div>

              <span className="text-textMuted text-xs">→</span>

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
                <div key={idx} className={log.startsWith('[SYSTEM]') ? 'text-accentCyan' : log.startsWith('>') ? 'text-textPrimary font-bold' : 'text-textSecondary'}>
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

        {/* ========================================================================= */}
        {/* Project 4: AI Listing Generator - EVEN (Details Right / Widget Left) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column (Right on Desktop) */}
          <div className="lg:order-2 space-y-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentPurple bg-accentPurple/10 border border-accentPurple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #04
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

          {/* Interactive Widget Column (Left on Desktop) */}
          <div className="lg:order-1 rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
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

        {/* ========================================================================= */}
        {/* Project 5: HA AWS Infrastructure - ODD (Details Left / Widget Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentCyan bg-accentCyan/10 border border-accentCyan/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #05
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
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
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

        {/* ========================================================================= */}
        {/* Project 6: Live Cloud Portfolio - EVEN (Details Right / Widget Left) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column (Right on Desktop) */}
          <div className="lg:order-2 space-y-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accentOrange bg-accentOrange/10 border border-accentOrange/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #06
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

          {/* Interactive Widget Column (Left on Desktop) */}
          <div className="lg:order-1 rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
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

        {/* ========================================================================= */}
        {/* Project 7: AWS Cost Optimization - ODD (Details Left / Widget Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Details Column */}
          <div className="space-y-6 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                System #07
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
          <div className="rounded-3xl glass-card border border-white/5 p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
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

      </div>
    </section>
  );
}
