
'use strict';
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validURL=s=>typeof s==='string'&&/^https:\/\/[^\s"<>]+$/i.test(s)?s:'';
const labels={blocked:'ติดข้อจำกัด',pending:'งานค้าง',needs_review:'รอตรวจยืนยัน',done:'ดำเนินการแล้ว'};
const kinds={hosting:'โฮสติ้ง',automation:'ซิงค์/อัตโนมัติ',permissions:'สิทธิ์ GitHub',rename:'ชื่อและลิงก์',review:'PR / Review',qa:'QA / ทดสอบ',migration:'ย้ายงาน',translation:'งานแปล ROM',milestone:'Milestone',deployment:'เว็บ/Deploy',external_source:'เว็บภายนอก',content:'ข้อมูล',archive:'Archive'};
let audit=null,filter='unresolved',project='all',query='',identityFilter='all';
const counts=()=>{let x={};for(const r of audit?.records||[])x[r.state]=(x[r.state]||0)+1;return x};
function anchors(){return document.querySelector('[data-view="status"]')}
function evidence(r){const u=validURL(r.evidence_url);return u?'<a class="audit-source" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">หลักฐาน: '+esc(r.evidence_label||'ดู GitHub')+' ↗</a>':''}
function task(r){return '<details id="audit-'+esc(r.id)+'" class="audit-task '+esc(r.state)+'"><summary>'+
 '<span class="audit-state '+esc(r.state)+'">'+esc(labels[r.state]||r.state)+'</span>'+
 '<span class="audit-task-main"><strong>'+esc(r.title)+'</strong><small>'+esc(r.project)+' · '+esc(kinds[r.kind]||r.kind)+'</small></span><span class="audit-chevron">⌄</span></summary>'+
 '<div class="audit-detail"><div><b>สาเหตุ / เหตุผลที่ยังทำไม่ได้</b><p>'+esc(r.cause)+'</p></div>'+
 '<div><b>ขั้นตอนต่อไป</b><p>'+esc(r.next)+'</p></div>'+
 '<div class="audit-evidence">'+evidence(r)+'<span>ตรวจสอบ: '+esc(audit.checked_at)+' · '+esc(r.verification||'manual')+'</span></div></div></details>'}
function buildFilters(){if(!$('auditFilters'))return;const n=counts();let controls=[
 ['unresolved','ค้างทั้งหมด', (n.blocked||0)+(n.pending||0)+(n.needs_review||0)],
 ['blocked','ติดข้อจำกัด',n.blocked||0],['pending','ค้างทำต่อ',n.pending||0],
 ['needs_review','รอตรวจหลักฐาน',n.needs_review||0],['done','ทำจริงแล้ว',n.done||0],
 ['all','ทุกสถานะ',(audit.records||[]).length]];
 $('auditFilters').innerHTML=controls.map(([value,label,count])=>'<button class="audit-tab '+(filter===value?'selected':'')+'" data-audit-filter="'+value+'">'+esc(label)+' <span>'+count+'</span></button>').join('');
 $('auditFilters').querySelectorAll('[data-audit-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.auditFilter;render()});
}
function buildProjects(){const select=$('auditProject');if(!select||!audit)return;const prev=project,names=[...new Set(audit.records.map(x=>x.project))].sort((a,b)=>a.localeCompare(b,'th'));
 select.innerHTML='<option value="all">ทุกโครงการ</option>'+names.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');
 if(names.includes(prev))select.value=prev;else{project='all';select.value='all'}
}
function render(){
 if(!audit)return;
 const n=counts(),remain=(n.blocked||0)+(n.pending||0)+(n.needs_review||0);
 if($('auditMetrics'))$('auditMetrics').innerHTML=[
 [remain,'รายการที่ยังไม่ปิด','unresolved'],[n.blocked||0,'ติดข้อจำกัด','blocked'],
 [n.pending||0,'รอดำเนินการ','pending'],[n.needs_review||0,'ต้องตรวจจริง','needs_review'],
 [n.done||0,'ยืนยันเสร็จแล้ว','done']
 ].map(([a,b,c])=>'<div class="audit-stat '+c+'"><strong>'+a+'</strong><span>'+b+'</span></div>').join('');
 if($('statusNavCount'))$('statusNavCount').textContent=remain;
 if($('homeAuditCount'))$('homeAuditCount').textContent=remain+' รายการค้าง · '+(n.blocked||0)+' ติดข้อจำกัด';
 buildFilters();buildProjects();
 let list=audit.records.filter(r=>(filter==='all'||(filter==='unresolved'?r.state!=='done':r.state===filter))&&(project==='all'||r.project===project)&&(!query||[r.title,r.project,r.cause,r.next].join(' ').toLowerCase().includes(query)));
 const order={blocked:0,pending:1,needs_review:2,done:3};list.sort((a,b)=>order[a.state]-order[b.state]||a.project.localeCompare(b.project,'th'));
 if($('auditCount'))$('auditCount').textContent=list.length+' รายการ · ตรวจหลักฐานล่าสุด '+audit.checked_at;
 if($('auditList'))$('auditList').innerHTML=list.length?list.map(task).join(''):'<div class="notice">ไม่มีรายการในตัวกรองนี้</div>';
 identityRender();
}
function identityRender(){
 if(!audit||!$('identityList'))return;
 const labels={real_rename:'เปลี่ยนชื่อบน GitHub จริง',display_alias:'ชื่อใน Atlas เท่านั้น',actual_archive:'Archive บน GitHub จริง',same:'ใช้ชื่อ GitHub เดิม'};
 let list=audit.identities.filter(x=>identityFilter==='all'||(identityFilter==='actual'?['real_rename','actual_archive'].includes(x.kind):x.kind==='display_alias'));
 $('identityList').innerHTML=list.map(x=>{
 const actual=['real_rename','actual_archive'].includes(x.kind),label=labels[x.kind]||'ไม่ทราบ',u=validURL(x.url);
 return '<article class="identity-record"><div class="identity-state '+(actual?'actual':'alias')+'">'+esc(label)+'</div>'+
 '<strong>'+esc(x.display_name)+'</strong><div class="identity-repo">GitHub จริง: <code>'+esc(x.github_name)+'</code></div>'+
 '<p>'+esc(x.explanation)+'</p>'+(u?'<a class="audit-source" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">ตรวจชื่อ Repository จริง ↗</a>':'')+'</article>'
 }).join('');
 document.querySelectorAll('[data-identity-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.identityFilter===identityFilter));
}
function decorateSites(){
 if(!audit)return;
 document.querySelectorAll('[data-app-audit-ref]').forEach(card=>{
 const id=card.dataset.appAuditRef;let r=audit.records.find(v=>v.id===id);if(!r)return;
 card.querySelector('.site-audit-note')?.remove();
 const note=document.createElement('div');note.className='site-audit-note '+r.state;
 note.innerHTML='<span class="audit-state '+r.state+'">'+esc(labels[r.state])+'</span><span>'+esc(r.title)+'</span>'+
 '<button type="button" data-open-audit="'+esc(id)+'">ดูสาเหตุ ↗</button>';
 card.appendChild(note);
 });
}
function focusRecord(id){
 anchors()?.click();
 filter='all';project='all';query='';if($('auditSearch'))$('auditSearch').value='';
 render();
 const el=document.getElementById('audit-'+id);if(el){el.open=true;el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('flash-audit');setTimeout(()=>el.classList.remove('flash-audit'),2500)}
}
async function load(){
 try{
 const response=await fetch('data/status-audit.json?t='+Date.now(),{cache:'no-store'});
 if(!response.ok)throw Error('HTTP '+response.status);
 const data=await response.json();
 if(data.schema_version!==1||!Array.isArray(data.records)||!Array.isArray(data.identities))throw Error('ไม่พบ audit schema');
 audit=data;render();decorateSites();if($('auditFreshness'))$('auditFreshness').textContent='ข้อมูลตรวจเมื่อ '+data.checked_at+' · เป็นบันทึกหลักฐาน ไม่ใช่สถานะ GitHub สด';
 }catch(e){if($('auditList'))$('auditList').innerHTML='<div class="notice">ไม่สามารถโหลดรายการงานค้าง: '+esc(e.message)+'</div>'}
}
$('auditProject')?.addEventListener('change',e=>{project=e.target.value;render()});
$('auditSearch')?.addEventListener('input',e=>{query=e.target.value.toLowerCase();render()});
document.querySelectorAll('[data-identity-filter]').forEach(b=>b.addEventListener('click',()=>{identityFilter=b.dataset.identityFilter;identityRender()}));
document.addEventListener('click',e=>{const b=e.target.closest('[data-open-audit]');if(b)focusRecord(b.dataset.openAudit)});
document.addEventListener('atlas:pages-rendered',decorateSites);
load();
})();
