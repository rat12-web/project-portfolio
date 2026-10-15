'use strict';
(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"\'":'&#39;'}[c]));
const urlOk=v=>typeof v==='string'&&/^https:\/\/[^\s<>"']+$/i.test(v)?v:'';
const KEY='atlas-board-preferences-v1', UIKEY='atlas-board-ui-v1';
const names={active:'กำลังพัฒนา',live:'เว็บใช้งาน',planning:'วางแผน',blocked:'ติดปัญหา',paused:'พักงาน',archived:'Archived',unverified:'ยังไม่ยืนยัน'};
const ranks={active:0,live:1,planning:2,blocked:3,unverified:4,paused:5,archived:6};
const DEFAULT_UI={filter:'all',sort:'priority',compact:false,showArchived:false,showPaused:true,search:''};
function read(key,fallback){try{let obj=JSON.parse(localStorage.getItem(key)||'null');return obj&&typeof obj==='object'&&!Array.isArray(obj)?obj:fallback}catch{return fallback}}
let local=read(KEY,{}),ui={...DEFAULT_UI,...read(UIKEY,{})},control={},workspaces={},loading=false,editing=null;
function store(){localStorage.setItem(KEY,JSON.stringify(local))}
function uiStore(){localStorage.setItem(UIKEY,JSON.stringify(ui))}
function meta(id){return control[String(id)]||((typeof catalog!=='undefined')?catalog[String(id)]:{})||{}}
function override(id){return local[String(id)]||{}}
function prop(id,k){const ov=override(id);return Object.prototype.hasOwnProperty.call(ov,k)?ov[k]:meta(id)[k]}
function getRepo(id){return typeof repos!=='undefined'?repos.find(r=>r.id===Number(id)):undefined}
function getSite(id){const apps=[...(workspaces.pages||[]),...(workspaces.web_apps||[])];return apps.find(p=>p.repo_id===Number(id)&&urlOk(p.url))}
function signal(r){if(!r||r._stub||!r.pushed_at)return null;const t=Date.parse(r.pushed_at);if(!Number.isFinite(t))return null;return Math.max(0,Math.floor((Date.now()-t)/86400000))}
function derive(id,r,entry={}){
 const m=meta(id),ov=override(id);
 if(r?.archived||m.status==='archived')return {state:'archived',origin:'GitHub/ทะเบียน',why:'Repository เก็บถาวรแล้ว ไม่ใช่งานที่กำลังพัฒนา'};
 const os=ov.workflow_status||ov.status;if(os&&os!=='auto'&&names[os])return {state:os,origin:'ตั้งเอง · เบราว์เซอร์',why:'สถานะที่คุณเลือกเอง มีผลเฉพาะเบราว์เซอร์นี้'};
 const ms=m.workflow_status||m.status;
 if(ms==='paused')return {state:'paused',origin:'บันทึกบน GitHub',why:'สถานะพักงานที่บันทึกไว้ใน Atlas'};
 if(ms==='blocked')return {state:'blocked',origin:'ทะเบียนสถานะ',why:'มีงานติดปัญหาที่ระบุไว้ในทะเบียน'};
 if(ms==='live')return {state:'live',origin:'ทะเบียน Web App',why:'มีหน้าเว็บเผยแพร่ ไม่ใช่การรับรอง QA ทุกฟังก์ชัน'};
 if(ms&&ms!=='auto'&&names[ms])return {state:ms,origin:'ทะเบียนโครงการ',why:'สถานะตามข้อมูลโครงการที่บันทึกและตรวจล่าสุด'};
 const days=signal(r);
 if(days!==null&&days<=14)return {state:'active',origin:'ประเมินจาก GitHub',why:'มี Push จริงภายใน 14 วัน (ไม่ได้หมายความว่างานเสร็จ)'};
 return {state:'planning',origin:'ระบบประเมิน',why:days===null?'ยังไม่มีข้อมูลกิจกรรม GitHub ที่ตรวจยืนยันได้':'ไม่พบ Push ใน 14 วัน จัดเป็นรอตรวจ ไม่ใช่พักงานอัตโนมัติ'};
}
function makeItems(){
 let map=new Map();
 const candidates=[...(workspaces.pages||[]).map(x=>({...x,_type:'web'})),...(workspaces.web_apps||[]).map(x=>({...x,_type:'preview'})),...(workspaces.development||[]).map(x=>({...x,_type:'development',repo_id:x.root_repo_id}))];
 for(const a of candidates){const id=a.repo_id===null||a.repo_id===undefined?'site:'+a.id:String(a.repo_id),r=Number.isFinite(Number(a.repo_id))?getRepo(a.repo_id):null,m=Number.isFinite(Number(a.repo_id))?meta(a.repo_id):{};
 let obj=map.get(id)||{id,repoId:r?.id||(a.repo_id||null),r,name:m.title||a.title||r?.name||'โครงการ',types:[],links:[],categories:[],entries:[]};
 obj.entries.push(a);
 if(!obj.types.includes(a._type))obj.types.push(a._type);
 if(a.category&&!obj.categories.includes(a.category))obj.categories.push(a.category);
 if(urlOk(a.url)&&!obj.links.some(x=>x.url===a.url))obj.links.push({url:a.url,label:a._type==='preview'?'เปิดเว็บทดลอง':'เปิด Web App'});
 if(urlOk(a.site)&&!obj.links.some(x=>x.url===a.site))obj.links.push({url:a.site,label:'เปิดเว็บหลัก'});
 map.set(id,obj);
 }
 for(const r of typeof repos!=='undefined'?repos:[]){const id=String(r.id);if(!map.has(id)){map.set(id,{id,repoId:r.id,r,name:meta(id).title||r.name,types:['repository'],links:[],categories:[],entries:[]})}}
 return [...map.values()].map(obj=>{
 const r=obj.r||getRepo(obj.repoId),m=meta(obj.id),o=override(obj.id),status=derive(obj.id,r,obj),days=signal(r);
 return {...obj,r,m,o,status,days,title:prop(obj.id,'title')||obj.name||'โครงการ',next:prop(obj.id,'next')||'ตรวจงานถัดไปจากโครงการ',category:prop(obj.id,'category')||obj.categories[0]||'โครงการ',priority:Math.max(1,Math.min(5,Number(prop(obj.id,'priority')||3))),pin:Boolean(prop(obj.id,'pin')),origin:r?((r.private?'Private':'Public')+' Repository'):'ChatGPT Sites'};
 });
}
function link(url,title,className='board-link'){let u=urlOk(url);return u?'<a class="'+className+'" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(title)+'</a>':''}
function recency(item){return item.days===null?'ยังไม่ยืนยันเวลา Push':item.days===0?'Push วันนี้':item.days===1?'Push เมื่อวาน':'Push '+item.days+' วันที่แล้ว'}
function filterItems(items){
 const term=ui.search.toLowerCase().trim();
 let out=items.filter(x=>(ui.showArchived||x.status.state!=='archived')&&(ui.showPaused||x.status.state!=='paused')&&(ui.filter==='all'||x.status.state===ui.filter)&&(!term||[x.title,x.category,x.next,x.r?.full_name||'',...x.types].join(' ').toLowerCase().includes(term)));
 const activity=x=>x.r?.pushed_at?Date.parse(x.r.pushed_at):0;
 out.sort((a,b)=>{
  const ap=a.status.state==='archived'?7:(a.status.state==='paused'?6:0),bp=b.status.state==='archived'?7:(b.status.state==='paused'?6:0);
  if(ap!==bp)return ap-bp; // always put paused and archived last
  if(a.pin!==b.pin)return a.pin?-1:1;
  if(ui.sort==='recent')return activity(b)-activity(a)||a.title.localeCompare(b.title,'th');
  if(ui.sort==='name')return a.title.localeCompare(b.title,'th');
  if(ui.sort==='status'){let ds=ranks[a.status.state]-ranks[b.status.state];if(ds)return ds}
  return a.priority-b.priority||activity(b)-activity(a)||a.title.localeCompare(b.title,'th');
 });
 return out;
}
function card(x){
 const st=x.status.state,m=x.m,site=x.links[0],repoURL=x.r?.html_url||((x.repoId&&x.r)?'https://github.com/'+x.r.full_name:'');
 const statusLabel=names[st]||st;
 return '<article class="board-card '+esc(st)+(ui.compact?' compact':'')+'" data-board-card="'+esc(x.id)+'">'+
 '<div class="board-card-top"><span class="board-state '+esc(st)+'">'+esc(statusLabel)+'</span>'+
 '<div class="board-quick"><button type="button" title="'+(x.pin?'เลิกปักหมุด':'ปักหมุด')+'" data-b-pin="'+esc(x.id)+'" class="'+(x.pin?'pinned':'')+'">'+(x.pin?'★':'☆')+'</button>'+
 (st!=='archived'?'<button type="button" data-b-pause="'+esc(x.id)+'">'+(st==='paused'?'▶ เริ่มต่อ':'Ⅱ พักงาน')+'</button>':'')+
 '<button type="button" data-b-edit="'+esc(x.id)+'">⚙ แก้ไข</button></div></div>'+
 '<div class="board-name"><strong>'+esc(x.title)+'</strong><span>'+esc(x.category)+' · '+esc(x.origin)+'</span></div>'+
 '<div class="board-next">ถัดไป: '+esc(x.next)+'</div>'+
 '<div class="board-evidence"><span title="'+esc(x.status.why)+'">'+esc(x.status.origin)+' · '+esc(x.status.why)+'</span><small>'+esc(recency(x))+'</small></div>'+
 '<div class="board-bottom">'+(site?link(site.url,site.label,'board-main-link'):'<span class="board-no-site">ไม่มีเว็บหลักที่ยืนยัน</span>')+
 (repoURL?link(repoURL,'GitHub ↗'):'')+'</div></article>';
}
function statRow(items){let groups=['active','live','planning','blocked','paused'];return groups.map(s=>'<button type="button" class="board-stat '+s+(ui.filter===s?' selected':'')+'" data-b-filter="'+s+'"><strong>'+items.filter(x=>x.status.state===s).length+'</strong><span>'+names[s]+'</span></button>').join('')}
function render(){
 const target=$('boardCards');if(!target)return;const all=makeItems(),show=filterItems(all);
 $('boardStats').innerHTML=statRow(all);
 $('boardCount').textContent=show.length+' / '+all.length+' รายการ';
 $('boardStorage').textContent=Object.keys(local).length?'ปรับแต่งในเบราว์เซอร์ '+Object.keys(local).length+' โครงการ':'ใช้สถานะทะเบียน GitHub และกิจกรรมที่ตรวจได้';
 target.innerHTML=show.length?show.map(card).join(''):'<div class="empty">ไม่พบงานตามตัวกรองที่เลือก</div>';
 $('boardSort').value=ui.sort;$('boardFilter').value=ui.filter;$('boardSearch').value=ui.search;$('boardCompact').checked=ui.compact;$('boardShowArchived').checked=ui.showArchived;$('boardShowPaused').checked=ui.showPaused;
 document.querySelectorAll('[data-b-filter]').forEach(b=>b.onclick=()=>{ui.filter=ui.filter===b.dataset.bFilter?'all':b.dataset.bFilter;uiStore();render()});
 target.querySelectorAll('[data-b-pin]').forEach(b=>b.onclick=()=>{const id=b.dataset.bPin;const x=all.find(v=>v.id===id);if(!x)return;local[id]={...override(id),pin:!x.pin};store();render();feedback('อัปเดตปักหมุดในเบราว์เซอร์แล้ว')});
 target.querySelectorAll('[data-b-pause]').forEach(b=>b.onclick=()=>{const id=b.dataset.bPause,x=all.find(v=>v.id===id);if(!x)return;const old=local[id]||{};local[id]={...old,workflow_status:x.status.state==='paused'?'auto':'paused'};store();render();feedback(x.status.state==='paused'?'เริ่มงานต่อแล้ว (เฉพาะเบราว์เซอร์)':'พักงานแล้ว · ย้ายการ์ดลงด้านล่าง (เฉพาะเบราว์เซอร์)')});
 target.querySelectorAll('[data-b-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.bEdit));
}
function feedback(s,error=false){if(typeof notify==='function')notify(s,error);else{const x=$('boardFeedback');if(x)x.textContent=s}}
function localPatch(id,patch){
 const clean={...override(id)};
 for(const [k,v]of Object.entries(patch)){if(v===null||v===''||v==='auto')delete clean[k];else clean[k]=v}
 if(Object.keys(clean).length)local[id]=clean;else delete local[id];store();
 render();
 if(typeof render==='function'){} // board is self-contained
}
function edit(id){
 const item=makeItems().find(x=>x.id===id);if(!item)return;editing=id;const modal=$('boardModal');
 modal.hidden=false;
 const s=item.o.workflow_status||item.o.status||item.m.workflow_status||'auto';
 modal.innerHTML='<div class="board-dialog" role="dialog" aria-modal="true" aria-labelledby="boardEditTitle">'+
 '<div class="board-dialog-head"><div><small>EDIT PROJECT · '+esc(item.id)+'</small><h2 id="boardEditTitle">ปรับแต่ง '+esc(item.title)+'</h2></div><button type="button" id="boardClose" aria-label="ปิด">×</button></div>'+
 '<p class="board-caution">แก้ไขบนเบราว์เซอร์นี้ได้ทันที หรือเลือกบันทึกบน GitHub เพื่อใช้ร่วมกันหลายเครื่อง (ข้อมูลที่บันทึกจะอยู่ใน Repository Public)</p>'+
 '<div class="board-fields"><label>ชื่อแสดงผล<input class="field" id="boardTitleInput" maxlength="100" value="'+esc(item.title)+'"></label>'+
 '<label>สถานะ<select class="field" id="boardStateInput">'+Object.entries({auto:'ระบบจัดให้อัตโนมัติ',active:'กำลังพัฒนา',live:'เว็บใช้งาน',planning:'วางแผน',blocked:'ติดปัญหา',paused:'พักงาน'}).map(([v,t])=>'<option value="'+v+'"'+(s===v?' selected':'')+'>'+t+'</option>').join('')+'</select></label>'+
 '<label>ความสำคัญ<select class="field" id="boardPriorityInput">'+[1,2,3,4,5].map(v=>'<option value="'+v+'"'+(item.priority===v?' selected':'')+'>'+(v===1?'1 · สูงสุด':v===5?'5 · ต่ำ':'ระดับ '+v)+'</option>').join('')+'</select></label>'+
 '<label>หมวดงาน<input class="field" id="boardCategoryInput" maxlength="80" value="'+esc(item.category)+'"></label>'+
 '<label class="wide">สิ่งที่ต้องทำต่อ<textarea class="field" id="boardNextInput" maxlength="450" rows="3">'+esc(item.next)+'</textarea></label>'+
 '<label class="board-check wide"><input type="checkbox" id="boardPinInput" '+(item.pin?'checked':'')+'> ปักหมุดขึ้นก่อน (ในกลุ่มสถานะเดียวกัน)</label></div>'+
 '<div class="board-dialog-actions"><button class="board-primary" id="boardSaveLocal">บันทึกในเบราว์เซอร์</button>'+
 '<button class="board-secondary" id="boardSaveCloud">บันทึกบน GitHub</button>'+
 '<button class="board-danger" id="boardResetItem">คืนค่าของโครงการนี้</button></div>'+
 '<small class="board-warning">พักงานใน Atlas ไม่ได้หยุดเซิร์ฟเวอร์, Live, Agent หรือ GitHub Actions · การแก้ชื่อใน Atlas ไม่ใช่การ Rename Repository จริง</small><p class="board-dialog-result" id="boardSaveResult" role="status"></p></div>';
 $('boardClose').onclick=hideModal;
 modal.onclick=e=>{if(e.target===modal)hideModal()};
 $('boardResetItem').onclick=()=>{delete local[id];store();hideModal();render();feedback('คืนค่าตามข้อมูล Atlas แล้ว')};
 $('boardSaveLocal').onclick=()=>{const patch=formData(item);if(!patch)return;localPatch(id,patch);hideModal();feedback('บันทึกแล้วในเบราว์เซอร์นี้ · เปิดเว็บครั้งถัดไปยังคงค่าไว้')};
 $('boardSaveCloud').onclick=()=>saveCloud(item);
}
function hideModal(){editing=null;$('boardModal').hidden=true;$('boardModal').innerHTML=''}
function formData(item){
 let title=$('boardTitleInput').value.trim(),next=$('boardNextInput').value.trim(),cat=$('boardCategoryInput').value.trim();
 if(!title||!cat){$('boardSaveResult').textContent='กรุณาระบุชื่อและหมวดงาน';return null}
 if(/[<>]/.test(title+next+cat)){$('boardSaveResult').textContent='ไม่รองรับอักขระ HTML ในฟิลด์';return null}
 return {title,next,category:cat,priority:Number($('boardPriorityInput').value),workflow_status:$('boardStateInput').value,pin:$('boardPinInput').checked};
}
function utf8Base64(text){let raw=new TextEncoder().encode(text),chunks=[];for(let i=0;i<raw.length;i+=8192)chunks.push(String.fromCharCode(...raw.slice(i,i+8192)));return btoa(chunks.join(''))}
function parseB64(s){return new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)))}
async function saveCloud(item){
 const out=$('boardSaveResult'),button=$('boardSaveCloud'),patch=formData(item);if(!patch)return;
 if(!item.repoId){out.textContent='รายการเว็บ ChatGPT Sites ที่ไม่มี Repository เชื่อม สามารถปรับแต่งเฉพาะเบราว์เซอร์เท่านั้น';return}
 if(typeof token==='undefined'||!token){out.textContent='กรุณากดปุ่ม GitHub ด้านบนเพื่อเชื่อม Fine-grained Token สิทธิ์ Contents write ใน project-portfolio ก่อน';return}
 button.disabled=true;out.textContent='กำลังส่งข้อมูลไป GitHub...';
 try{
  const path='/repos/rat12-web/project-portfolio/contents/config/project-control.json';
  const {data}=await github(path,{},true);
  if(!data?.content||!data?.sha)throw Error('ไม่พบไฟล์ config สำหรับเขียน');
  const latest=JSON.parse(parseB64(data.content));
  if(!latest.projects?.[String(item.repoId)])throw Error('รายการนี้ยังไม่ได้ลงทะเบียนใน project-control.json');
  const old=latest.projects[String(item.repoId)];
  const changes={...patch};
  if(changes.workflow_status==='auto')changes.workflow_status='auto';
  if(changes.workflow_status==='paused'){
   changes.previous_status=old.status==='paused'?(old.previous_status||'active'):old.status;
   changes.status='paused';
  }else if(changes.workflow_status!=='auto'){
   changes.status=changes.workflow_status;changes.previous_status=null;
  }else if(old.status==='paused'){
   changes.status=old.previous_status||'active';changes.previous_status=null;
  }
  latest.projects[String(item.repoId)]={...old,...changes};
  latest.updated_at=new Date().toISOString();
  const body={message:'chore(atlas): update dashboard settings for '+item.repoId,branch:'main',sha:data.sha,content:utf8Base64(JSON.stringify(latest,null,2)+'\n')};
  await github(path,{method:'PUT',body:JSON.stringify(body)},true);
  control=latest.projects;
  if(typeof catalog!=='undefined')catalog=latest.projects;
  delete local[String(item.repoId)];store();hideModal();render();
  feedback('บันทึก GitHub สำเร็จ · ทุกเครื่องจะเห็นหลัง GitHub Pages Deploy ใหม่');
  document.dispatchEvent(new Event('atlas:repos-updated'));
 }catch(e){out.textContent='บันทึก GitHub ไม่สำเร็จ: '+e.message}finally{button.disabled=false}
}
function downloadSettings(){
 const body=JSON.stringify({schema:1,exported_at:new Date().toISOString(),preferences:local,ui},null,2);
 const blob=new Blob([body],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='project-atlas-my-settings.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)
}
function restoreSettings(file){
 if(!file||file.size>200000)return feedback('ไฟล์ไม่ถูกต้องหรือใหญ่เกินไป',true);
 const reader=new FileReader();reader.onload=()=>{try{
 const d=JSON.parse(reader.result);if(d.schema!==1||!d.preferences||typeof d.preferences!=='object'||Array.isArray(d.preferences))throw Error('รูปแบบไม่รองรับ');
 const safe={};for(const [id,v] of Object.entries(d.preferences)){if(!/^\d+$|^site:[a-z0-9-]+$/i.test(id)||typeof v!=='object'||v===null)continue;
 const item={};for(const k of ['title','next','category'])if(typeof v[k]==='string')item[k]=v[k].slice(0,k==='next'?450:100);
 if(typeof v.pin==='boolean')item.pin=v.pin;
 if(Number.isInteger(Number(v.priority))&&Number(v.priority)>=1&&Number(v.priority)<=5)item.priority=Number(v.priority);
 if(names[v.workflow_status]||v.workflow_status==='auto')item.workflow_status=v.workflow_status;
 safe[id]=item}
 local=safe;store();render();feedback('นำเข้าการตั้งค่าเบราว์เซอร์สำเร็จ');
 }catch(e){feedback('นำเข้าการตั้งค่าไม่ได้: '+e.message,true)}};reader.readAsText(file)
}
async function load(){
 if(loading)return;loading=true;
 try{
 const [cfg,ws]=await Promise.all([
 fetch('data/project-control.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(Error('control HTTP '+r.status))),
 fetch('data/workspaces.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(Error('workspaces HTTP '+r.status)))]);
 control=cfg.projects||{};workspaces=ws;render();
 }catch(e){if($('boardCards'))$('boardCards').innerHTML='<div class="notice">ไม่สามารถโหลดบอร์ด: '+esc(e.message)+'</div>'}finally{loading=false}
}
$('boardSearch')?.addEventListener('input',e=>{ui.search=e.target.value;uiStore();render()});
$('boardFilter')?.addEventListener('change',e=>{ui.filter=e.target.value;uiStore();render()});
$('boardSort')?.addEventListener('change',e=>{ui.sort=e.target.value;uiStore();render()});
$('boardCompact')?.addEventListener('change',e=>{ui.compact=e.target.checked;uiStore();render()});
$('boardShowPaused')?.addEventListener('change',e=>{ui.showPaused=e.target.checked;uiStore();render()});
$('boardShowArchived')?.addEventListener('change',e=>{ui.showArchived=e.target.checked;uiStore();render()});
$('boardResetAll')?.addEventListener('click',()=>{if(confirm('ล้างการปรับแต่งเฉพาะเบราว์เซอร์นี้ทั้งหมดหรือไม่?')){local={};ui={...DEFAULT_UI};store();uiStore();render();feedback('คืนค่าหน้าแรกแล้ว')}});
$('boardExport')?.addEventListener('click',downloadSettings);
$('boardImport')?.addEventListener('change',e=>{restoreSettings(e.target.files?.[0]);e.target.value=''});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('boardModal')?.hidden)hideModal()});
document.addEventListener('atlas:repos-updated',render);
window.AtlasBoard={render,statusForRepo:r=>{if(r?.archived)return'archived';const v=override(r.id).workflow_status||meta(r.id).workflow_status;if(v&&v!=='auto'&&names[v])return v;return null}};
load();
})();
