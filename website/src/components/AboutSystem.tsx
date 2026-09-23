import { 
  Terminal, 
  Cpu, 
  Activity, 
  Award, 
  HardDrive,
  CheckCircle,
  Settings,
  ShieldCheck
} from 'lucide-react';

export function AboutSystem() {
  const firmwareLogs = [
    {
      version: 'v1.0.0',
      name: 'KITCHEN INSTALLATIONS',
      date: 'MAR 2022 - MAY 2025',
      details: [
        'Director and kitchen installer at Triple Purple Ltd in York.',
        'Delivered 50+ installations from brief to handover.',
        'Zero formal complaints.'
      ]
    },
    {
      version: 'v2.0.0',
      name: 'IT FIELD WORK',
      date: 'MAY 2025',
      details: [
        'Installed point-of-sale and network equipment for the Costa Coffee rollout with Cerco IT.',
        'Verified installs and escalated exceptions with written handovers.'
      ]
    },
    {
      version: 'v3.0.0',
      name: 'AWS RE/START',
      date: 'JUN - SEP 2025',
      details: [
        'Completed hands-on AWS training with Primed Talent UK.',
        'Covered Linux administration, networking, security and core AWS services.'
      ]
    },
    {
      version: 'v4.0.0',
      name: 'CLOUD PROJECTS & CERTIFICATIONS',
      date: 'SEP 2025 - PRESENT',
      details: [
        'Deployed and documented projects on AWS and Kubernetes.',
        'Passed HashiCorp Terraform Associate (Sep 2026) and KCNA (Aug 2026).',
        'Looking for a first commercial cloud support or operations role.'
      ]
    }
  ];

  const metrics = [
    { label: 'Installations', value: '50+', icon: <Activity className="w-4 h-4 text-accentCyan" /> },
    { label: 'Formal complaints', value: '0', icon: <Settings className="w-4 h-4 text-accentPurple" /> },
    { label: 'Certifications', value: '5', icon: <Award className="w-4 h-4 text-[#ff6b35]" /> },
    { label: 'AWS re/Start', value: 'Graduate', icon: <ShieldCheck className="w-4 h-4 text-green-400" /> }
  ];

  return (
    <section id="diagnostics" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5 relative">
      
      {/* Title Header */}
      <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// SYSTEM DIAGNOSTICS</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Core Infrastructure</h2>
        </div>
        <div className="font-mono text-xs text-textMuted uppercase flex items-center justify-center lg:justify-end gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-xl self-center lg:self-auto">
          <Terminal className="w-4 h-4 text-accentCyan" />
          <span>STATUS: ALL_SYSTEMS_OPERATIONAL</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Column 1: Firmware Upgrade Log (Creator Origin) */}
        <div className="lg:col-span-2 rounded-3xl glass-card border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentPurple" />
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <HardDrive className="w-5 h-5 text-accentPurple" />
              <h3 className="text-lg font-bold text-textPrimary uppercase font-mono tracking-wide">// SYSTEM_FIRMWARE_UPGRADES</h3>
            </div>
            
            <div className="space-y-6">
              {firmwareLogs.map((log, idx) => (
                <div key={idx} className="relative pl-6 border-l border-white/10 group">
                  {/* Indicator Dot */}
                  <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-accentPurple transition-colors duration-300 border border-bgPrimary" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2 font-mono">
                    <span className="text-xs text-accentPurple font-bold uppercase tracking-wider">{log.version} · {log.name}</span>
                    <span className="text-[10px] text-textMuted">{log.date}</span>
                  </div>
                  
                  <ul className="text-xs text-textSecondary space-y-1 pl-4 list-disc text-left">
                    {log.details.map((detail, index) => (
                      <li key={index} className="leading-relaxed">{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: AWS & Cloud-Native Certifications & Analytics */}
        <div className="flex flex-col gap-6">
          
          {/* Subcard 1: Certified Credentials */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-accentCyan" />
                <h3 className="text-lg font-bold text-textPrimary uppercase font-mono tracking-wide">// CERTIFIED_CREDENTIALS</h3>
              </div>
              
              <div className="space-y-3 font-mono">
                <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between text-left hover:border-accentCyan/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-textPrimary font-semibold">HashiCorp Certified</span>
                    <span className="text-[9px] text-accentCyan uppercase">Terraform Associate (004) [Sep 2026]</span>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00FFD1] shrink-0 ml-2" />
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between text-left hover:border-accentCyan/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-textPrimary font-semibold">Kubernetes &amp; Cloud Native</span>
                    <span className="text-[9px] text-accentCyan uppercase">KCNA · CNCF / Linux Foundation [Aug 2026]</span>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00FFD1] shrink-0 ml-2" />
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between text-left hover:border-accentCyan/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-textPrimary font-semibold">Docker Foundations</span>
                    <span className="text-[9px] text-accentCyan uppercase">May 2026</span>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00FFD1] shrink-0 ml-2" />
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between text-left hover:border-accentCyan/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-textPrimary font-semibold">AWS Solutions Architect Associate</span>
                    <span className="text-[9px] text-accentCyan uppercase">Apr 2026</span>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00FFD1] shrink-0 ml-2" />
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between text-left hover:border-accentCyan/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-textPrimary font-semibold">AWS Cloud Practitioner</span>
                    <span className="text-[9px] text-accentCyan uppercase">Mar 2025</span>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00FFD1] shrink-0 ml-2" />
                </div>

                <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between text-left hover:border-accentCyan/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-textPrimary font-semibold">AWS re/Start Graduate</span>
                    <span className="text-[9px] text-accentCyan uppercase">Jun–Sep 2025</span>
                  </div>
                  <CheckCircle className="w-4.5 h-4.5 text-[#00FFD1] shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Subcard 2: System Analytics */}
          <div className="rounded-3xl glass-card border border-white/5 p-6 relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentOrange" />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-accentOrange" />
                <h3 className="text-lg font-bold text-textPrimary uppercase font-mono tracking-wide">// INFRA_METRICS</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric, i) => (
                  <div key={i} className="p-3 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono text-textMuted uppercase tracking-wider">{metric.label}</span>
                      {metric.icon}
                    </div>
                    <span className="text-base font-mono font-bold text-textPrimary">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-[9px] font-mono text-textMuted uppercase text-center mt-3 pt-3 border-t border-white/5">
              Figures from Cornel's work history and certifications
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
