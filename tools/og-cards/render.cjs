// Renders 1280x640 project preview cards (GitHub social preview + site og:image)
// in the same style as the Ansible lab card, so every project card matches.
//
// Usage, from this folder:
//   npm install --no-save playwright @fontsource/inter
//   node render.cjs                 # writes out/<slug>.png for every entry in cards.json
// Then copy the PNG to website/public/og/projects/<slug>.png and add the
// project to website/scripts/project-pages.mjs. Box text shrinks to fit.
const {chromium}=require('playwright'); const path=require('path');
const F='file://'+path.dirname(require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff2'))+'/';
const cards=require(path.join(__dirname,'cards.json'));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const html=c=>`<html><head><style>
@font-face{font-family:Inter;src:url('${F}inter-latin-400-normal.woff2');font-weight:400}
@font-face{font-family:Inter;src:url('${F}inter-latin-500-normal.woff2');font-weight:500}
@font-face{font-family:Inter;src:url('${F}inter-latin-600-normal.woff2');font-weight:600}
@font-face{font-family:Inter;src:url('${F}inter-latin-700-normal.woff2');font-weight:700}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:640px;position:relative;overflow:hidden;font-family:Inter;color:#f0f3f6;
 background-color:#0d1117;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:40px 40px}
.bar{position:absolute;top:0;left:0;right:0;height:7px;background:#2dd4bf}
.repo{position:absolute;left:80px;top:70px;font-family:'DejaVu Sans Mono';font-size:25px;color:#8b949e;letter-spacing:.5px}
h1{position:absolute;left:78px;top:118px;font-size:${c.titleSize||74}px;font-weight:700;letter-spacing:-1.5px;white-space:nowrap}
.tag{position:absolute;left:80px;top:213px;font-size:29px;color:#8b949e}
.flow{position:absolute;left:80px;top:300px;display:flex;align-items:center}
.box{width:252px;height:150px;border-radius:14px;background:#161b22;border:1.5px solid #30363d;padding:24px 23px}
.acc{width:37px;height:4px;background:#2dd4bf;margin-bottom:20px}
.bt{font-size:${c.boxSize||36}px;font-weight:700;white-space:nowrap;line-height:1.1;overflow:hidden}
.bs{font-size:21px;color:#8b949e;margin-top:12px;white-space:nowrap;overflow:hidden}
.arr{width:32px;display:flex;justify-content:center;color:#2dd4bf;font-size:24px}
.arr svg{width:28px;height:14px}
.foot{position:absolute;left:80px;right:80px;top:548px;display:flex;justify-content:space-between;font-size:26px;color:#8b949e}
.foot b{color:#2dd4bf;font-weight:600}
.dot{margin:0 14px}
</style></head><body><div class="bar"></div>
<div class="repo">${esc(c.repo)}</div><h1>${esc(c.title)}</h1><div class="tag">${esc(c.tagline)}</div>
<div class="flow">${c.boxes.map((b,i)=>(i?'<div class="arr"><svg viewBox="0 0 28 14"><path d="M0 7h22" stroke="#2dd4bf" stroke-width="2.5"/><path d="M19 2l7 5-7 5z" fill="#2dd4bf"/></svg></div>':'')+`<div class="box"><div class="acc"></div><div class="bt">${esc(b[0])}</div><div class="bs">${esc(b[1])}</div></div>`).join('')}</div>
<div class="foot"><span>${c.footer.map(esc).join('<span class="dot">·</span>')}</span><b>cornelcloud.net</b></div></body></html>`;
(async()=>{require('fs').mkdirSync(path.join(__dirname,'out'),{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:640}});
for(const c of cards){const fs=require('fs');const hp=path.join(__dirname,'out',c.slug+'.html');fs.writeFileSync(hp,html(c));await p.goto('file://'+hp);await p.evaluate(()=>document.fonts.ready);
 // Shrink box titles/subtitles uniformly per card until every one fits inside its box padding
 await p.evaluate(()=>{for(const cls of ['bt','bs']){const els=[...document.querySelectorAll('.'+cls)];
   let size=parseFloat(getComputedStyle(els[0]).fontSize);
   while(size>14&&els.some(e=>e.scrollWidth>e.clientWidth)){size-=1;els.forEach(e=>e.style.fontSize=size+'px');}}});
 const sizes=await p.evaluate(()=>['bt','bs'].map(c=>getComputedStyle(document.querySelector('.'+c)).fontSize));await p.waitForTimeout(150);
 const over=await p.evaluate(()=>[...document.querySelectorAll('h1,.bt,.bs,.foot,.tag')].filter(e=>e.scrollWidth>e.clientWidth+1||e.getBoundingClientRect().right>1200.5).map(e=>e.className||e.tagName));
 await p.screenshot({path:path.join(__dirname,'out',c.slug+'.png')});console.log(c.slug,'overflow:',JSON.stringify(over),'sizes:',sizes.join('/'));}
await b.close();})();
