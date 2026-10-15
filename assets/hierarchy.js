'use strict';
(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL=v=>typeof v==='string'&&/^https:\/\/[^\s]+$/i.test(v)?v:'';
const platforms=[['GBA','🟦'],['SNES','🟪'],['GB / GBC','🟩'],['PS1','🟧'],['Homebrew','⬡']];
const repos={
1391725161:'RetroThaiWorkbench',1396825920:'phangnga-live-queue',1411532824:'gov-exam-monitor',
1413883614:'ThaiROM-Studio-Cloud',1415242573:'thaipatch',1416744545:'lufia2-thai',
1416748319:'thai-rom-cloud',1418199034:'TYPEBEATS',1418448691:'rom2thai-hub-web',
1420054663:'phangnga-hr',1420128168:'Gecko-Offline',1420142917:'plaethai-bokduay-content-hub',
1420150047:'project-portfolio',1420200967:'digimon-world-android',1420204360:'exam-path-tracker'};
const archivedIds=new Set([1416744545]);
const repoURL=id=>repos[id]?'https://github.com/rat12-web/'+repos[id]:'';
const link=(url,label,cls='family-link')=>safeURL(url)?'<a class="'+cls+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>':'';
let state=null,gameData=null,activeFilter='all';
const gameCount=()=>Object.values(gameData||{}).reduce((n,a)=>n+a.length,0);
function statusKind(g){const x=(String(g.status||'')+' '+String(g.status_th||'')).toUpperCase();if(/BLOCK|DEFECT|ติดขัด|ผิดพลาด/.test(x))return'blocked';if(/REFERENCE|SYNTHETIC|ตัวอย่าง|อ้างอิง/.test(x))return'planning';return'active'}
function gamesFor(p){
 return (gameData?.[p]||[]).map(g=>{
 const url='https://github.com/rat12-web/thai-rom-cloud/tree/main/games/'+encodeURI(String(g.id||''));
 return '<article class="game-item"><div class="game-primary"><span class="game-icon" aria-hidden="true">▣</span><div><strong>'+esc(g.title||g.name||g.id)+'</strong><div class="game-status '+statusKind(g)+'">'+esc(g.status||g.status_th||'ยังไม่ยืนยัน')+'</div></div></div><div class="game-actions">'+link(url,'ไฟล์งาน ↗')+'</div><div class="game-next"><span>ขั้นตอนต่อไป:</span> '+esc(g.next||g.next_action_th||'รอการตรวจสอบ')+'</div></article>'
 }).join('')
}
function gameTree(){
 return '<div class="branch-head"><strong>เลือกแพลตฟอร์ม → เกมที่กำลังทำแพตช์</strong><span>'+gameCount()+' งาน · ไม่แสดง % ที่ไม่มีหลักฐาน</span></div><div class="console-stack">'+platforms.map(([p,icon])=>{
 const list=gameData?.[p]||[];
 return '<details class="console-group" data-console="'+esc(p)+'"><summary><span>'+icon+' '+esc(p)+'</span><span>'+list.length+' เกม <span class="chevron">⌄</span></span></summary><div class="console-games">'+(list.length?gamesFor(p):'<div class="source-note">ยังไม่มีรายการที่ยืนยัน</div>')+'</div></details>';
 }).join('')+'</div><div class="source-note">อ้างอิงข้อมูลรายเกมจาก RetroThaiCraft Status Mirror; ผลการแปลจริงต้องยืนยันจากหลักฐานและทดสอบใน Emulator</div>';
}
function subs(f){
 const children=(f.subprojects||[]).filter(s=>!archivedIds.has(s.repo_id)&&s.role!=='ส่วนแสดงผล Public — ไม่ใช่แหล่งต้นฉบับ');
 if(!children.length)return'';
 const active=children.filter(s=>!(/legacy|โค้ดต้นทางเดิม/i).test((s.role||'')+' '+(s.title||'')));
 const legacy=children.filter(s=>!active.includes(s));
 const item=s=>{
 const linkUrl=s.site||repoURL(s.repo_id)||(s.path&&f.root_repo_id?repoURL(f.root_repo_id)+'/blob/main/'+s.path:'');
 return '<div class="subrow"><div><strong>'+esc(s.title)+'</strong><small>'+esc(s.role||'งานย่อย')+'</small></div>'+link(linkUrl,'เปิด ↗')+'</div>'
 };
 return '<div class="branch-head"><strong>โมดูลและพื้นที่ทำงาน</strong><span>'+children.length+' รายการ</span></div><div class="subs">'+active.map(item).join('')+'</div>'+
 (legacy.length?'<details class="legacy-drawer"><summary>งานต้นทางเดิม / Legacy <span>'+legacy.length+' รายการ</span></summary><div class="subs">'+legacy.map(item).join('')+'</div></details>':'');
}
function family(f){
 const rom=f.id==='rom2thai',cat=f.id==='thaipatch';
 const n=(f.related_repo_ids||[]).filter(id=>!archivedIds.has(id)).length+1;
 const tags=rom?'PATCH PRODUCTION · '+gameCount()+' GAME TASKS':cat?'CATALOG / DISCOVERY':'PROJECT WORKSPACE · '+n+' REPOS';
 return '<article class="family-card family-'+esc(f.id)+'" data-family="'+esc(f.category)+'" data-family-key="'+esc(f.id)+'"><details class="family-root"><summary>'+
 '<span class="family-emoji" aria-hidden="true">'+esc(f.icon||'▣')+'</span>'+
 '<span class="family-identity"><strong>'+esc(f.title)+'</strong><small>'+esc(f.description||'')+'</small><span class="family-meta">'+esc(tags)+'</span></span>'+
 '<span class="family-chevron" aria-hidden="true">⌄</span></summary>'+
 '<div class="family-expanded"><div class="family-actions">'+
 (f.site?link(f.site,cat?'↗ เปิดเว็บ Catalog':rom?'↗ ดูสถานะงานแปล':'↗ เปิด Demo','family-primary'):'')+
 link(repoURL(f.root_repo_id),'⌘ เปิด Source Repository')+'</div>'+
 (rom?gameTree():'')+subs(f)+'</div></details></article>'
}
function renderPages(){
 const el=$('pagesGrid');if(!el||!state)return;
 const icon={catalog:'📚',status_mirror:'📊',control_center:'⌘'};
 el.innerHTML=(state.pages||[]).filter(p=>p.url).map(p=>
 '<article class="page-card"><div class="page-card-icon" aria-hidden="true">'+(icon[p.type]||'↗')+'</div>'+
 '<div class="page-kicker">'+esc(p.type==='catalog'?'PUBLIC CATALOG':p.type==='status_mirror'?'STATUS MIRROR':'MANAGEMENT UI')+'</div>'+
 '<h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p>'+
 '<div class="page-meta">'+esc(repos[p.repo_id]||'Unknown')+' · GitHub Pages · '+esc(p.owner_family)+'</div>'+
 '<div class="page-actions">'+link(p.url,'↗ เปิดเว็บไซต์จริง','action-primary')+link(repoURL(p.repo_id),'ดู Repository','action-muted')+'</div></article>'
 ).join('')||'<div class="notice">ยังไม่มีเว็บไซต์ที่ยืนยันลิงก์</div>';
}
function render(){
 const root=$('familyGrid');if(!state||!root)return;
 const prevOpen=[...root.querySelectorAll('.family-root[open]')].map(e=>e.closest('.family-card')?.dataset.familyKey);
 const prevConsole=[...root.querySelectorAll('.console-group[open]')].map(e=>e.dataset.console);
 const families=state.families.filter(f=>f.id!=='atlas'&&f.section!=='control_center');
 const filtered=families.filter(f=>activeFilter==='all'||f.category===activeFilter);
 root.innerHTML=filtered.map(family).join('')||'<div class="empty">ไม่พบโครงการในหมวดนี้</div>';
 root.querySelectorAll('.family-card').forEach(e=>{if(prevOpen.includes(e.dataset.familyKey))e.querySelector('.family-root').open=true});
 root.querySelectorAll('.console-group').forEach(e=>{if(prevConsole.includes(e.dataset.console))e.open=true});
 if($('familyCount'))$('familyCount').textContent=families.length+' กลุ่มโครงการ · '+gameCount()+' เกมที่ติดตาม';
}
function openFamily(id){
 document.querySelector('[data-view="overview"]')?.click();
 if(activeFilter!=='all'){document.querySelector('[data-family-filter="all"]')?.click()}
 const card=[...document.querySelectorAll('.family-card')].find(e=>e.dataset.familyKey===id);
 if(card){card.querySelector('.family-root').open=true;card.scrollIntoView({behavior:'smooth',block:'start'})}
}
async function live(){
 try{
 const url='https://raw.githubusercontent.com/rat12-web/rom2thai-hub-web/main/site/status.json?cache='+Date.now();
 const r=await fetch(url,{cache:'no-store'});
 if(!r.ok)throw Error('HTTP '+r.status);
 const d=await r.json();
 if(!Array.isArray(d.projects)||d.projects.length<8)throw Error('ข้อมูลสถานะไม่สมบูรณ์');
 const grouped=Object.fromEntries(platforms.map(([p])=>[p,[]]));
 for(const g of d.projects){
 const p=g.platform==='SNES'?'SNES':g.platform==='GB / GBC'?'GB / GBC':g.platform==='PS1'?'PS1':g.platform==='Homebrew'?'Homebrew':'GBA';
 grouped[p].push({id:g.id,title:g.name,status:g.status_th,next:g.next_action_th});
 }
 gameData=grouped;render();
 if($('sourceHealth'))$('sourceHealth').textContent='สถานะเกม: ซิงค์จาก RetroThaiCraft Hub · '+new Date().toLocaleTimeString('th-TH');
 }catch(e){if($('sourceHealth'))$('sourceHealth').textContent='สถานะเกม: ใช้ Snapshot สำรอง · '+esc(e.message)}
}
async function load(){
 try{const r=await fetch('data/workspaces.json?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);state=await r.json();gameData=state.rom_games||{};render();renderPages();await live()}
 catch(e){$('familyGrid').innerHTML='<div class="notice">โหลดโครงสร้างงานไม่ได้: '+esc(e.message)+'</div>'}
}
document.querySelectorAll('[data-family-filter]').forEach(b=>b.addEventListener('click',()=>{
 activeFilter=b.dataset.familyFilter;
 document.querySelectorAll('[data-family-filter]').forEach(x=>x.classList.toggle('selected',x===b));
 render();
}));
document.querySelectorAll('[data-jump-family]').forEach(b=>b.addEventListener('click',()=>openFamily(b.dataset.jumpFamily)));
$('showAllRepos')?.addEventListener('click',()=>document.querySelector('[data-view="repositories"]')?.click());
load();
setInterval(()=>{if(!document.hidden)live()},300000);
})();