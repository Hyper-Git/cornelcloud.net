// Writes dist/projects/<slug>/index.html for each project after `vite build`.
//
// Link-preview crawlers (LinkedIn, Slack, WhatsApp, X) read the Open Graph
// tags in the raw HTML and never run JavaScript, so every project that should
// get its own preview card needs its own static HTML file. People who open the
// link are sent straight on to that project on the main page.
//
// CloudFront serves /projects/<slug> from /projects/<slug>/index.html through
// the rewrite function in terraform/cloudfront.tf.

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://cornelcloud.net';
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// slug = the project block's id in src/components/Projects.tsx
const projects = [
  {
    slug: 'ansible-automation-lab',
    title: 'Ansible Automation Lab: Terraform, AWX & Vault',
    description:
      'Terraform provisions an EC2 server, an idempotent Ansible role configures and hardens it, AWX runs it with role-based access, and HashiCorp Vault enforces least privilege.',
  },
  {
    slug: 'trades-job-tracker',
    title: 'Trades Job Tracker on Kubernetes',
    description:
      'A job-status app for trades businesses on a local Kubernetes cluster: hardened images, Ingress routing, health probes and a tested self-healing demo.',
  },
  {
    slug: 'pinnacle',
    title: 'Pinnacle: Multi-AZ AWS Environment',
    description:
      'A Multi-AZ AWS environment built with Terraform: load balancer, Auto Scaling, RDS PostgreSQL Multi-AZ and CloudWatch alarms into SNS, proven with a CPU stress test.',
  },
  {
    slug: 'cornelcloud-net',
    title: 'cornelcloud.net: Live Cloud Portfolio',
    description:
      'This site: S3 and CloudFront, a rate-limited API, an AI chatbot on Bedrock, budget alerts and security headers, all deployed with Terraform through CI.',
  },
  {
    slug: 'cost-optimisation-dashboard',
    title: 'AWS Cost Optimisation Dashboard',
    description:
      'A serverless dashboard that pulls AWS Cost Explorer data through Lambda and API Gateway and charts spend by service and region.',
  },
];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const page = ({ slug, title, description }) => {
  const url = `${SITE}/projects/${slug}`;
  const image = `${SITE}/og/projects/${slug}.png`;
  const target = `/#${slug}`;
  const t = esc(`${title} | Cornel Bacanu`);
  const d = esc(description);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${url}" />
    <meta name="theme-color" content="#050505" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="cornelcloud" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="640" />
    <meta property="og:image:alt" content="${esc(title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${image}" />
    <script>location.replace(${JSON.stringify(target)});</script>
    <style>body{background:#050505;color:#e8eaed;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#00d4ff}</style>
  </head>
  <body>
    <p><a href="${target}">View ${esc(title)} on cornelcloud.net</a></p>
  </body>
</html>
`;
};

for (const p of projects) {
  if (!existsSync(join(dist, '..', 'public', 'og', 'projects', `${p.slug}.png`))) {
    throw new Error(`Missing preview image public/og/projects/${p.slug}.png`);
  }
  const out = join(dist, 'projects', p.slug, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(p));
}

console.log(`project-pages: wrote ${projects.length} share pages to dist/projects/`);
