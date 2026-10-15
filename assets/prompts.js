'use strict';
(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=s=>typeof s==='string'&&/^https:\/\/[^\s<>"]+$/.test(s)?s:'';
const repoUrl=s=>typeof s==='string'&&/^rat12-web\/[a-z0-9_.-]+$/i.test(s)?'https://github.com/'+s:null;
const sourceDate='15 ต.ค. 2569',actualSteps=['PHONE-QA-001','M0-003'];
let registry=null,active=null,activeGame=null,liveReadme=null;
function boardItem(id){try{return window.AtlasBoard?.getItem?.(id)||null}catch{return null}}
function stepLabel(e){return actualSteps.includes(e.step_id)?'อ้างอิงรหัสงานในเอกสาร':'รหัสภารกิจแนะนำจาก Atlas · ต้องตรวจทะเบียนงานล่าสุด'}
function build(e){
 const board=boardItem(active?.id),repo=repoUrl(e.repository);
 const docs=(e.start_files||[]).map((p,i)=>(i+1)+'. '+p).join('\n')||'ไม่มีไฟล์ต้นทางที่ตรวจยืนยัน กรุณาขอลิงก์จากเจ้าของงาน';
 const game=activeGame?[
  'เกมย่อย: '+activeGame.name+' / '+activeGame.platform,
  'สถานะเกมที่แสดง: '+activeGame.status,
  'ขั้นตอนรายเกม: '+activeGame.next,
  'Source เกม: https://github.com/rat12-web/thai-rom-cloud/tree/main/games/'+activeGame.id
 ].join('\n'):'';
 return [
 'ดำเนินงานจาก GitHub โปรเจกต์เดิมต่อ ไม่สร้างโปรเจกต์ใหม่',
 '',
 'ชื่อโครงการ: '+e.title,
 'Repository: '+(e.repository||'ยังไม่มี GitHub Repository ที่ตรวจยืนยัน'),
 'GitHub URL: '+(repo||'ยังไม่ยืนยัน'),
 'ขั้นตอนเริ่มต้นที่แนะนำ: '+e.step_id+' ('+stepLabel(e)+')',
 'Snapshot ที่ตรวจเมื่อ: '+sourceDate,
 'สถานะตามเอกสารที่ตรวจ: '+e.status_snapshot,
 board?'สถานะใน Atlas ตอนกด: '+board.status.state+' / '+board.status.origin:'',
 game,
 '',
 'เริ่มอ่านจากจุดนี้ตามลำดับ:',
 docs,
 '',
 '1) Clone/เปิด Repository ที่ระบุ อ่าน README.md จริง (ถ้ามี), AGENTS, Handoff/STATUS, เอกสารตามรายการ แล้วตรวจ git status, current branch, SHA, Issues/PRs ที่เปิด อย่าสมมติว่า README ที่ Atlas เคยอ่านเป็นข้อมูลสด',
 '2) เทียบสถานะ GitHub ล่าสุดกับ Snapshot ของ Atlas และตรวจว่างานก่อนหน้านั้น merge/ทดสอบครบหรือยัง ถ้าเข้าถึง Private ไม่ได้ให้ระบุ blocker ไม่เดาเนื้อหา',
 '3) ตรวจ Step ID ใน README/AGENT_TASKS/Handoff: หากไม่มี ให้ถือ "'+e.step_id+'" เป็นชื่อแนะนำโดย Atlas เท่านั้น เลือกหนึ่ง task และกำหนด writer, ขอบเขตไฟล์และ acceptance ก่อนแก้',
 '',
 'งานถัดไป: '+(activeGame?.next||e.next_step),
 'ขอบเขตและหลักฐานที่ต้องเน้น: '+e.scope,
 'เกณฑ์ส่งมอบ:',
 ...(e.acceptance||[]).map((x,i)=>(i+1)+'. '+x),
 '',
 '4) ทดสอบกับเครื่องมือ/สิทธิ์ที่มีจริง ระบุ PASS / FAIL / NOT RUN และหลักฐาน; ห้ามอ้างว่า deploy / แปลครบเกม / QA ผ่าน หากยังไม่ได้ตรวจ',
 '5) รายงาน Commit SHA, branch, PR/issue, ไฟล์เปลี่ยน, blockers, งานถัดไป และอัปเดต Handoff/Status ใน Repo',
 '6) ห้ามเผย Private credentials, ข้อมูลบุคลากร, ROM/เสียงที่มีลิขสิทธิ์หรือบันทึก secrets; ห้าม Force push, Transfer, Archive โดยไม่มีคำสั่งเฉพาะ',
 '',
 liveReadme?.ok?'README ล่าสุดอ่านได้ในเบราว์เซอร์เมื่อ '+liveReadme.time+' · หัวข้อที่พบ:\n'+liveReadme.headings:
 'README สดยังไม่ได้รับการตรวจผ่านเบราว์เซอร์นี้ ให้ Agent เปิดอ่าน README ของ Repository โดยตรงก่อนเริ่ม',
 '',
 'ตอบครั้งแรกด้วย: จุดเริ่มต้นที่ตรวจแล้ว + Step ที่จะทำ + Files scope + blockers / สิทธิ์ที่ขาด'
 ].filter(Boolean).join('\n');
}
function close(){active=null;activeGame=null;liveReadme=null;$('promptModal').hidden=true;$('promptModal').innerHTML=''}
async function checkReadme(){
 const e=active?.entry,msg=$('promptReadmeState');
 if(!e?.repository||typeof github!=='function'){if(msg)msg.textContent='ไม่มี Repo/API ที่ตรวจได้';return}
 if(msg)msg.textContent='กำลังตรวจ README สดจาก GitHub...';
 try{
  const {data}=await github('/repos/'+e.repository+'/readme');
  if(!data?.content||data.encoding!=='base64')throw Error('README content unavailable');
  const content=new TextDecoder().decode(Uint8Array.from(atob(data.content.replace(/\s/g,'')),c=>c.charCodeAt(0)));
  const headings=[...content.matchAll(/^#{1,3}\s+(.+)$/gm)].slice(0,7).map(x=>'- '+x[1].trim()).join('\n')||'- อ่าน README ได้';
  liveReadme={ok:true,time:new Date().toLocaleString('th-TH'),headings};
  msg.textContent='✓ ตรวจ README สดได้แล้ว '+liveReadme.time+' · แสดงเฉพาะหัวข้อ; ไม่มีการเผยแพร่เนื้อหา README';
  $('promptText').value=build(e);
 }catch(err){liveReadme=null;msg.textContent='ยังอ่าน README สดไม่ได้: '+String(err.message||err)+' · ถ้า Private ให้เชื่อม GitHub Read-only หรือเปิดผ่าน Agent ที่มีสิทธิ์'}
}
function open(id,options={}){
 if(!registry||!registry.entries)return;
 const key=String(id||''),e=registry.entries[key];if(!e){if(typeof notify==='function')notify('ไม่พบทะเบียน Prompt สำหรับรายการนี้',true);return}
 active={id:key,entry:e};activeGame=options.gameId?{id:options.gameId,name:options.gameName||options.gameId,next:options.next||e.next_step,platform:options.platform||'ไม่ทราบ',status:options.status||'ไม่ยืนยัน'}:null;liveReadme=null;
 const url=repoUrl(e.repository),docs=(e.start_files||[]).filter(f=>/^[a-z0-9/_\-.]+$/i.test(f)),first=docs.length&&url?url+'/blob/main/'+docs[0]:null;
 $('promptModal').hidden=false;
 $('promptModal').innerHTML=
 '<div class="prompt-panel" role="dialog" aria-modal="true" aria-labelledby="promptTitle">'+
 '<div class="prompt-title-row"><div><small>NEXT AGENT HANDOFF</small><h2 id="promptTitle">'+esc(e.title)+'</h2><p>เริ่มที่ <b>'+esc(e.step_id)+'</b> · '+esc(stepLabel(e))+'</p></div><button id="promptClose" aria-label="ปิด">×</button></div>'+
 '<div class="prompt-tip"><strong>งานแนะนำ:</strong> '+esc(activeGame?.next||e.next_step)+'<div>สถานะอ้างอิง: '+esc(e.status_snapshot)+' · ตรวจเมื่อ '+sourceDate+'</div></div>'+
 '<div class="prompt-links">'+(url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">↗ Repository จริง</a>':'')+(first?'<a href="'+esc(first)+'" target="_blank" rel="noopener noreferrer">↗ ไฟล์เริ่มต้น</a>':'')+
 '<button id="promptCheckReadme">↻ ตรวจ README สด</button></div>'+
 '<p class="prompt-source" id="promptReadmeState">สำหรับ Private README จำเป็นต้องเชื่อม GitHub หรือใช้ Agent ที่มีสิทธิ์ · ชื่อขั้นตอนที่ไม่มีใน README เป็นข้อเสนอของ Atlas เท่านั้น</p>'+
 '<label for="promptText">Prompt ถัดไป (แก้ไขก่อนคัดลอกได้)</label><textarea id="promptText" rows="16" spellcheck="false"></textarea>'+
 '<div class="prompt-buttons"><button id="promptCopy" class="prompt-primary">⧉ คัดลอก Prompt</button><button id="promptReset">↺ คืนข้อความแนะนำ</button></div><div class="prompt-source" id="promptResult" role="status"></div></div>';
 $('promptText').value=build(e);
 $('promptClose').onclick=close;
 $('promptCheckReadme').onclick=checkReadme;
 $('promptReset').onclick=()=>$('promptText').value=build(e);
 $('promptCopy').onclick=async()=>{
  try{await navigator.clipboard.writeText($('promptText').value);$('promptResult').textContent='✓ คัดลอก Prompt แล้ว นำไปวางใน ChatGPT Work / Codex / Gemini / Claude ได้'}
  catch(err){$('promptText').select();$('promptResult').textContent='Clipboard ไม่พร้อม กรุณากด Ctrl+C ในช่องข้อความที่เลือกไว้'}
 };
 const repo=typeof repos!=='undefined'?repos.find(x=>String(x.id)===key):null;
 if(e.repository&&(repo?.private===false||(typeof token!=='undefined'&&Boolean(token))))checkReadme();
}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-prompt-id]');if(!btn)return;
 event.preventDefault();event.stopPropagation();
 open(btn.dataset.promptId,{gameId:btn.dataset.promptGame,gameName:btn.dataset.promptTitle,status:btn.dataset.promptStatus,next:btn.dataset.promptNext,platform:btn.dataset.promptPlatform});
});
$('promptModal')?.addEventListener('click',e=>{if(e.target===$('promptModal'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('promptModal')?.hidden)close()});
async function load(){
 try{const r=await fetch('data/next-prompts.json?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);
 registry=await r.json();if(registry.schema_version!==1||!registry.entries)throw Error('bad schema')}
 catch(err){if(typeof notify==='function')notify('โหลดทะเบียน Prompt ไม่สำเร็จ: '+err.message,true)}
}
window.AtlasPrompts={open,ready:()=>Boolean(registry),compose:id=>registry?.entries?.[String(id)]?build(registry.entries[String(id)]):''};
load();
})();