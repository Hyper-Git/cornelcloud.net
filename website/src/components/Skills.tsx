import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SkillsCloud } from '../canvas/SkillsCloud';
import { BentoGrid, BentoCard } from './BentoGrid';
import { useWebGL } from '../hooks/useWebGL';
import { Server, Cpu, Database, Activity, Globe, Award, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const skillDetails: Record<string, string> = {
  'AWS': 'Core AWS services used in training and portfolio projects.',
  'Terraform': 'Deployed AWS infrastructure from code; Terraform Associate certified.',
  'Linux': 'Linux administration covered during AWS re/Start.',
  'CloudWatch': 'Used alarms and metrics in the Pinnacle project.',
  'SNS': 'Configured notifications from CloudWatch alarms.',
  'EC2': 'Configured compute in AWS portfolio projects.',
  'S3': 'AWS storage used for this website.',
  'VPC': 'Configured AWS networking in portfolio projects.',
  'IAM': 'Configured AWS access controls.',
  'RDS': 'Used PostgreSQL Multi-AZ in the Pinnacle project.',
  'Route 53': 'AWS DNS service.',
  'API Gateway': 'Used with the Cost Optimisation Dashboard.',
  'DynamoDB': 'AWS database service.',
  'Kubernetes': 'Tested Deployments, Services, NetworkPolicies and RBAC on a local cluster.',
  'Docker': 'Used Docker and passed Docker Foundations.',
  'Git': 'Version control for portfolio projects.',
  'Networking': 'Covered during AWS re/Start and IT field work.',
  'DNS': 'Networking topic covered in cloud retraining.',
  'Troubleshooting': 'Worked from logs and metrics to investigate issues.',
  'Cost Explorer': 'Used in the AWS Cost Optimisation Dashboard.',
  'Terraform Associate': 'HashiCorp certification achieved in Sep 2026.',
  'KCNA': 'Kubernetes and Cloud Native Associate certification achieved in Aug 2026.'
};

export function Skills() {
  const isWebGLSupported = useWebGL();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillCategories = [
    {
      title: 'AWS Cloud Services',
      icon: <Server className="w-6 h-6 text-accentCyan" />,
      desc: 'Core AWS services used in training and portfolio projects.',
      tags: ['EC2', 'S3', 'VPC', 'IAM', 'RDS', 'Route 53', 'API Gateway', 'DynamoDB']
    },
    {
      title: 'Infrastructure as Code',
      icon: <Cpu className="w-6 h-6 text-accentPurple" />,
      desc: 'Deployed and tested AWS environments with Terraform.',
      tags: ['Terraform', 'Git']
    },
    {
      title: 'Monitoring & Support',
      icon: <Activity className="w-6 h-6 text-accentOrange" />,
      desc: 'Investigated issues from logs and metrics and tested alerting.',
      tags: ['CloudWatch', 'SNS', 'Troubleshooting', 'Cost Explorer']
    },
    {
      title: 'Linux & Networking',
      icon: <Globe className="w-6 h-6 text-green-400" />,
      desc: 'Linux administration, networking and DNS from AWS re/Start and field work.',
      tags: ['Linux', 'Networking', 'DNS']
    },
    {
      title: 'Containers',
      icon: <Database className="w-6 h-6 text-blue-400" />,
      desc: 'Operated and tested a trades job-status app on a local Kubernetes cluster.',
      tags: ['Docker', 'Kubernetes']
    },
    {
      title: 'Certifications',
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      desc: 'Completed AWS, Terraform, Kubernetes and Docker certifications.',
      tags: ['Terraform Associate ✓', 'KCNA ✓', 'Docker Foundations ✓', 'AWS Solutions Architect Associate ✓', 'AWS Cloud Practitioner ✓', 'AWS re/Start ✓']
    }
  ];

  return (
    <section id="skills" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-white/5">
      <div className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-accentCyan uppercase">// EXPERTISE</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-textPrimary">Technical Skills</h2>
        <p className="text-textSecondary mt-4 max-w-xl mx-auto text-sm">
          Skills developed through AWS re/Start, certifications and tested portfolio projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WebGL Skills Tag Cloud Card */}
        <div className="lg:col-span-1 rounded-3xl glass-card border border-white/5 p-6 h-[550px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-accentCyan" />
          
          <div>
            <span className="text-[10px] font-mono text-accentCyan tracking-wider uppercase">// INTERACTIVE LAB</span>
            <h3 className="text-lg font-bold text-textPrimary mt-1">3D Cloud Core</h3>
            <p className="text-xs text-textMuted mt-1">Drag mouse or scroll to rotate the skill node network.</p>
          </div>

          {/* R3F canvas cloud with DOM fallback */}
          <div className="w-full flex-1 relative flex items-center justify-center">
            {isWebGLSupported ? (
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Canvas camera={{ position: [0, 0, 6.0], fov: 60 }} dpr={[1, 1.5]}>
                  <ambientLight intensity={1.5} />
                  <pointLight position={[10, 10, 10]} />
                  <SkillsCloud onHoverSkill={setHoveredSkill} />
                </Canvas>
              </div>
            ) : (
              /* Fallback 2D grid */
              <div className="flex flex-wrap gap-2.5 justify-center p-4">
                {['AWS', 'Terraform', 'Linux', 'CloudWatch', 'SNS', 'EC2', 'S3', 'VPC', 'IAM', 'RDS', 'Docker', 'Kubernetes'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredSkill(tag)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-accentCyan/10 border border-accentCyan/20 text-xs font-mono text-accentCyan hover:border-accentCyan/50 cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Constellation Node Inspector */}
          <div className="min-h-[60px] font-mono text-[10px] text-textMuted flex flex-col justify-center border-t border-white/5 pt-4 text-left">
            <AnimatePresence mode="wait">
              {hoveredSkill ? (
                <motion.div
                  key={hoveredSkill}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1 text-xs"
                >
                  <div className="text-accentCyan font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-accentCyan" />
                    NODE_INSPECT: {hoveredSkill}
                  </div>
                  <div className="text-[10px] text-textSecondary leading-relaxed">
                    {skillDetails[hoveredSkill] || 'Certification completed.'}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center tracking-widest text-[9px] uppercase"
                >
                  Hover a constellation node to inspect telemetry
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Structured Skill Bento Cards */}
        <div className="lg:col-span-2">
          <BentoGrid className="grid-cols-1 md:grid-cols-2">
            {skillCategories.map((cat, i) => (
              <BentoCard key={i}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    {cat.icon}
                  </div>
                  <h4 className="text-sm font-bold text-textPrimary">{cat.title}</h4>
                </div>
                
                <p className="text-xs text-textSecondary mb-6 leading-relaxed flex-1">
                  {cat.desc}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      onMouseEnter={() => {
                        const cleanTag = tag.replace(' ✓', '').replace(' ↗', '');
                        setHoveredSkill(cleanTag);
                      }}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={`px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono transition-colors duration-300 hover:border-accentCyan/30 hover:text-accentCyan cursor-default ${
                        tag.includes('✓') 
                          ? 'text-green-400 font-semibold border-green-500/20 bg-green-500/5' 
                          : tag.includes('↗') 
                            ? 'text-accentOrange border-accentOrange/20 bg-accentOrange/5' 
                            : hoveredSkill === tag ? 'text-accentCyan border-accentCyan/30' : 'text-textSecondary'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>

      </div>
    </section>
  );
}
