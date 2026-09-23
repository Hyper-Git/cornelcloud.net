import { motion } from 'framer-motion';
import { Terminal, GitCommit, Layers, Cpu, Award } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  company: string;
  description: string;
  type: 'job' | 'cert' | 'progress';
  status?: string;
  statusType?: 'achieved' | 'progress';
  pinId: string;
}

const timelineData: TimelineItem[] = [
  {
    date: 'Sep 2025 — Present',
    title: 'Career Transition: Cloud Retraining',
    company: 'Portfolio projects and part-time installation work',
    description: 'Passed KCNA and HashiCorp Terraform Associate in 2026 alongside AWS certifications. Deployed and documented portfolio projects on AWS and Kubernetes while doing part-time installation work.',
    type: 'job',
    pinId: 'PIN_01_CLOUD'
  },
  {
    date: 'Jun 2025 — Sep 2025',
    title: 'AWS re/Start Trainee',
    company: 'Primed Talent UK',
    description: 'Completed a full-time, hands-on AWS programme covering Linux administration, networking, security and core AWS services.',
    type: 'job',
    pinId: 'PIN_02_RESTART'
  },
  {
    date: 'May 2025',
    title: 'IT Field Engineer (Contract)',
    company: 'Cerco IT · Costa Coffee rollout',
    description: 'Installed and commissioned point-of-sale and network equipment across North Yorkshire sites. Verified each install and escalated exceptions to central support with a written handover.',
    type: 'job',
    pinId: 'PIN_03_FIELD'
  },
  {
    date: 'Mar 2022 — May 2025',
    title: 'Director and Kitchen Installer',
    company: 'Triple Purple Ltd · York',
    description: 'Delivered 50+ installations from brief to handover with zero formal complaints.',
    type: 'job',
    pinId: 'PIN_04_DIRECTOR'
  },
  {
    date: 'Sep 2026',
    title: 'HashiCorp Terraform Associate',
    company: 'HashiCorp',
    description: 'Terraform Associate certification achieved.',
    type: 'cert',
    status: '✓ Achieved',
    statusType: 'achieved',
    pinId: 'PIN_05_TF'
  },
  {
    date: 'Aug 2026',
    title: 'Kubernetes and Cloud Native Associate (KCNA)',
    company: 'The Linux Foundation / CNCF',
    description: 'KCNA certification achieved.',
    type: 'cert',
    status: '✓ Achieved',
    statusType: 'achieved',
    pinId: 'PIN_06_KCNA'
  },
  {
    date: 'May 2026',
    title: 'Docker Foundations',
    company: 'Docker',
    description: 'Docker Foundations certification achieved.',
    type: 'cert',
    status: '✓ Achieved',
    statusType: 'achieved',
    pinId: 'PIN_07_DOCKER'
  },
  {
    date: 'Apr 2026',
    title: 'AWS Solutions Architect Associate',
    company: 'Amazon Web Services',
    description: 'AWS Solutions Architect Associate certification achieved.',
    type: 'cert',
    status: '✓ Achieved',
    statusType: 'achieved',
    pinId: 'PIN_08_SAA'
  },
  {
    date: 'Mar 2025',
    title: 'AWS Cloud Practitioner',
    company: 'Amazon Web Services',
    description: 'AWS Cloud Practitioner certification achieved.',
    type: 'cert',
    status: '✓ Achieved',
    statusType: 'achieved',
    pinId: 'PIN_09_CCP'
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
      
      {/* Section Header */}
      <div className="text-center mb-20">
        <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// SYSTEM_UPGRADE_PATH</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Experience &amp; Milestones</h2>
        <p className="text-textSecondary mt-4 max-w-xl mx-auto text-sm">
          A move from hands-on installation and IT field work into cloud support, backed by AWS training, certifications and deployed projects.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        
        {/* PCB Style Background Trace Grid */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accentCyan/30 via-accentPurple/30 to-accentOrange/10 -translate-x-1/2 z-0 hidden md:block" />
        
        <div className="space-y-16 relative z-10">
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div 
                key={index} 
                className={`relative flex flex-col md:flex-row items-start ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                
                {/* Circuit Node Pad (Timeline Dot) */}
                <div 
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-bgPrimary border-2 border-white/10 rounded-full flex items-center justify-center z-20 group"
                  style={{ top: '24px' }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    item.type === 'job' 
                      ? 'bg-accentCyan shadow-[0_0_10px_#00d4ff]' 
                      : item.type === 'cert' 
                        ? 'bg-accentPurple shadow-[0_0_10px_#7c3aed]' 
                        : 'bg-accentOrange shadow-[0_0_10px_#ff6b35]'
                  }`} />
                  
                  {/* Tiny tooltip label for PCB nodes */}
                  <span className="absolute hidden lg:group-hover:block px-2 py-0.5 rounded bg-bgSecondary border border-white/15 text-[8px] font-mono text-textMuted uppercase whitespace-nowrap -bottom-6 left-1/2 -translate-x-1/2">
                    {item.pinId}
                  </span>
                </div>

                {/* Left/Right Horizontal Trace Line (Only on Desktop) */}
                <div 
                  className={`hidden md:block absolute top-[35px] w-[50px] h-[1px] bg-white/10 z-0 ${
                    isLeft ? 'right-1/2 mr-3' : 'left-1/2 ml-3'
                  }`}
                />

                {/* Timeline Date Label */}
                <div className={`hidden md:block w-1/2 px-16 text-xs font-mono text-textMuted ${
                  isLeft ? 'text-left' : 'text-right'
                }`} style={{ paddingTop: '27px' }}>
                  <div className="flex items-center justify-start md:justify-end gap-2 text-[10px]">
                    {isLeft && <GitCommit className="w-3.5 h-3.5 text-accentCyan" />}
                    <span>{item.date}</span>
                    {!isLeft && <GitCommit className="w-3.5 h-3.5 text-accentCyan" />}
                  </div>
                </div>

                {/* Details Content Card */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="p-6 rounded-2xl glass-card glass-card-glow border border-white/5 relative group hover:border-white/10 transition-colors duration-300"
                  >
                    {/* Glowing schematic corner anchors */}
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-textMuted uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      [{item.pinId}]
                    </div>

                    <span className="block md:hidden text-[10px] font-mono text-accentCyan mb-2">
                      {item.date}
                    </span>
                    
                    <h3 className="text-base font-bold text-textPrimary mb-0.5">{item.title}</h3>
                    <h4 className="text-xs text-textSecondary font-mono tracking-wider flex items-center gap-1.5 mb-4">
                      {item.type === 'job' && <Cpu className="w-3.5 h-3.5 text-accentCyan" />}
                      {item.type === 'cert' && <Award className="w-3.5 h-3.5 text-accentPurple" />}
                      {item.type === 'progress' && <Layers className="w-3.5 h-3.5 text-accentOrange" />}
                      {item.company}
                    </h4>
                    
                    <p className="text-xs text-textSecondary leading-relaxed">
                      {item.description}
                    </p>

                    {item.status && (
                      <div className="mt-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                          item.statusType === 'achieved'
                            ? 'bg-[#00FFD1]/10 border border-[#00FFD1]/20 text-[#00FFD1]'
                            : 'bg-accentOrange/10 border border-accentOrange/20 text-accentOrange'
                        }`}>
                          <Terminal className="w-3 h-3" />
                          {item.status}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
