// user.js - User Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
  // ====== i18n ======
  const i18n = {
    en:{user_dashboard:"User Dashboard",admin_console:"Admin Console",certificates:"Certificates",eligible_hint:"Request a certificate when progress reaches 100%.",status:"Status",all_status:"All status",all_statuses:"All status",pending:"Pending Review",approved:"Approved",rejected:"Not Approved",all_types:"All types",name:"Name",project:"Project",date:"Date",length:"Length",action:"Action",upload_slip:"Upload Slip",drop_or_browse:"Drop JPG/PNG (≤ 10MB) or click to browse",cancel:"Cancel",confirm:"Confirm",request_certificate:"Request Certificate",download_pdf:"Download PDF",contact_support:"Contact Support",sent_to_admin:"Request sent to admin",slip_not_uploaded:"Slip: Not uploaded",slip_uploaded:"Slip: Uploaded",slip_verified:"Slip: Verified",free:"Free",general:"General",special:"Special",unsupported_format:"Unsupported file format",file_too_large:"File is too large (max 10MB)",approve:"Approve",not_approve:"Not Approve",action:"Action"},
    th:{user_dashboard:"แดชบอร์ดผู้ใช้",admin_console:"คอนโซลผู้ดูแล",certificates:"ใบรับรอง",eligible_hint:"ขอใบรับรองได้เมื่อความคืบหน้า 100%",status:"สถานะ",all_status:"ทุกสถานะ",all_statuses:"ทุกสถานะ",pending:"รอตรวจสอบ",approved:"อนุมัติแล้ว",rejected:"ไม่อนุมัติ",all_types:"ทุกประเภท",name:"ชื่อ",project:"โครงการ",date:"วันที่",length:"ระยะเวลา",action:"การทำงาน",upload_slip:"อัปโหลดสลิป",drop_or_browse:"ลากไฟล์ JPG/PNG (≤ 10MB) หรือคลิกเพื่อเลือก",cancel:"ยกเลิก",confirm:"ยืนยัน",request_certificate:"ขอใบรับรอง",download_pdf:"ดาวน์โหลด PDF",contact_support:"ติดต่อเจ้าหน้าที่",sent_to_admin:"ได้ส่งเรื่องไปที่ Admin แล้ว",slip_not_uploaded:"สลิป: ยังไม่อัปโหลด",slip_uploaded:"สลิป: อัปโหลดแล้ว",slip_verified:"สลิป: ตรวจผ่าน",free:"ฟรี",general:"ทั่วไป",special:"พิเศษ",unsupported_format:"รูปแบบไฟล์ไม่รองรับ",file_too_large:"ไฟล์ใหญ่เกินไป (สูงสุด 10MB)",approve:"อนุมัติ",not_approve:"ไม่อนุมัติ",action:"การทำงาน"}
  };
  let lang = localStorage.getItem('lang') || 'en';
  function t(key){return (i18n[lang] && i18n[lang][key]) || key}
  function applyI18n(){document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent = t(el.dataset.i18n)})}

  // ====== Demo Data (projects local) ======
  const projects = [
    {id:'P-1001', name:'Foundations of Design', type:'Free', progress:100, length:20, requiresSlip:false},
    {id:'P-1002', name:'Advanced UX Workshop', type:'General', progress:100, length:30, requiresSlip:true},
    {id:'P-2001', name:'Enterprise Leadership', type:'Special', progress:100, length:40, requiresSlip:true}
  ];

  // ====== Header tabs / language ======
  const tabUser = document.getElementById('tabUser');
  const tabAdmin = document.getElementById('tabAdmin');
  const langTH = document.getElementById('langTH');
  const langEN = document.getElementById('langEN');
  function setLang(newLang){ lang=newLang; localStorage.setItem('lang',lang); applyI18n(); langTH.classList.toggle('active',lang==='th'); langEN.classList.toggle('active',lang==='en'); }
  langTH.addEventListener('click',()=>setLang('th'));
  langEN.addEventListener('click',()=>setLang('en'));
  applyI18n();

  // Admin link: navigate to admin.html
  if(tabAdmin) tabAdmin.addEventListener('click', ()=>{ window.location.href = 'admin.html'; });

  // ====== UI helpers ======
  function showToast(message, ms = 3000){ try{ const toast = document.createElement('div'); toast.textContent = message; Object.assign(toast.style, {position:'fixed', right:'20px', bottom:'20px', background:'rgba(26,32,44,0.95)', color:'#fff', padding:'10px 14px', borderRadius:'8px', boxShadow:'0 6px 20px rgba(0,0,0,.12)', zIndex:9999, opacity:'0', transition:'opacity 200ms, transform 200ms', transform:'translateY(8px)'}); document.body.appendChild(toast); requestAnimationFrame(()=>{ toast.style.opacity='1'; toast.style.transform='translateY(0)'; }); setTimeout(()=>{ toast.style.opacity='0'; toast.style.transform='translateY(8px)'; toast.addEventListener('transitionend', ()=> toast.remove(), {once:true}); }, ms);}catch(e){console.warn(e);} }

  // ====== Render Projects ======
  const projWrap = document.getElementById('projects');
  function renderProjects(){ projWrap.innerHTML=''; projects.forEach(p=>{
      const card=document.createElement('div');card.className='card stack';
      const typeLabel = lang==='th' ? (p.type==='Free'?t('free'):p.type==='General'?t('general'):t('special')) : p.type;
      const header = document.createElement('div'); header.className='row';
      const h3 = document.createElement('h3'); h3.textContent = p.name;
      const badge = document.createElement('span'); badge.className='badge'; badge.textContent = typeLabel;
      header.appendChild(h3); header.appendChild(badge);
      const bodyStack = document.createElement('div'); bodyStack.className='stack';
      const metaRow = document.createElement('div'); metaRow.className='row'; metaRow.style.gap='8px';
      const len = document.createElement('span'); len.className='muted'; len.textContent = `${p.length}h`;
      const idspan = document.createElement('span'); idspan.className='muted'; idspan.textContent = `ID: ${p.id}`;
      metaRow.appendChild(len); metaRow.appendChild(idspan);
      const progress = document.createElement('div'); progress.className='progress'; progress.setAttribute('aria-label','Progress');
      const bar = document.createElement('div'); bar.className='bar'; bar.style.width = `${p.progress}%`;
      progress.appendChild(bar);
      const slipRow = document.createElement('div'); slipRow.className='row wrap'; slipRow.id = `slipState-${p.id}`;
      const actionsRow = document.createElement('div'); actionsRow.className='row'; actionsRow.style.gap='8px'; actionsRow.style.justifyContent='flex-end';
      const detailsBtn = document.createElement('button'); detailsBtn.className='btn ghost'; detailsBtn.type='button'; detailsBtn.textContent='Details';
      const reqBtn = document.createElement('button'); reqBtn.className='btn primary'; reqBtn.id = `req-${p.id}`; reqBtn.type='button'; reqBtn.disabled = p.progress!==100;
      const forceContact = (p.type === 'Special') || (p.id === 'P-1002');
      reqBtn.textContent = forceContact ? t('contact_support') : t('request_certificate');
      if (forceContact){ reqBtn.disabled = false; reqBtn.classList.remove('primary'); }
      actionsRow.appendChild(detailsBtn); actionsRow.appendChild(reqBtn);
      bodyStack.appendChild(metaRow); bodyStack.appendChild(progress); bodyStack.appendChild(slipRow); bodyStack.appendChild(actionsRow);
      card.appendChild(header); card.appendChild(bodyStack); projWrap.appendChild(card);
      if(p.type==='General' || p.type==='Special'){ const slipLabel = document.createElement('span'); slipLabel.className='muted'; slipLabel.id = `slipLabel-${p.id}`; slipLabel.textContent = t('slip_not_uploaded'); const uploadBtn = document.createElement('button'); uploadBtn.className='btn'; uploadBtn.type='button'; uploadBtn.id = `btnUpload-${p.id}`; uploadBtn.textContent = t('upload_slip'); const elig = document.createElement('span'); elig.className='pill pending'; elig.id = `elig-${p.id}`; elig.textContent = t('pending'); slipRow.appendChild(slipLabel); slipRow.appendChild(uploadBtn); slipRow.appendChild(elig); uploadBtn.addEventListener('click',()=>openUploadModal(p.id)); } else { const ok = document.createElement('span'); ok.className='pill ok'; ok.textContent = t('approved'); slipRow.appendChild(ok); }
      reqBtn.addEventListener('click',()=>{ if(forceContact) createAdminRequestFromProject(p); else handleRequest(p); });
    }); }

  // ====== handle request (user) ======
  function handleRequest(p){ if((p.type==='General') && !p.__slipVerified){ alert((lang==='th')? 'กรุณาอัปโหลดสลิปและผ่านการตรวจสอบก่อน' : 'Please upload slip and pass verification first.'); return; } if(p.type==='Special'){ alert((lang==='th')? 'โครงการพิเศษ: กรุณาติดต่อเจ้าหน้าที่' : 'Special project: Please contact support.'); return; } const today = new Date().toISOString().slice(0,10); addStatusItem({id:'C-'+Math.floor(Math.random()*10000), project:p.name, date:today, status:'Approved'}); }

  function addStatusItem(item){ const statusList = document.getElementById('statusList'); const el = document.createElement('div'); el.className='card row'; const badgeClass = item.status==='Approved'?'pill ok':(item.status==='Not Approved'?'pill bad':'pill pending'); const left = document.createElement('div'); left.className='stack'; const strong = document.createElement('strong'); strong.textContent = item.project; const meta = document.createElement('span'); meta.className='muted'; meta.textContent = `${item.date} • ID: ${item.id}`; left.appendChild(strong); left.appendChild(meta); const right = document.createElement('div'); right.className='row'; right.style.gap='8px'; const statusSpan = document.createElement('span'); statusSpan.className = badgeClass; statusSpan.textContent = t(item.status==='Approved'?'approved':item.status==='Not Approved'?'rejected':'pending'); right.appendChild(statusSpan); if(item.status==='Approved'){ const dl = document.createElement('button'); dl.className='btn'; dl.setAttribute('aria-label','Download PDF'); dl.textContent = t('download_pdf'); right.appendChild(dl); } el.appendChild(left); el.appendChild(right); statusList.prepend(el); }

  // ====== Upload modal logic (user) ======
  const uploadModal = document.getElementById('uploadModal');
  const dropzone = document.getElementById('dropzone');
  const slipInput = document.getElementById('slipInput');
  const slipPreview = document.getElementById('slipPreview');
  const slipThumb = document.getElementById('slipThumb');
  const slipMeta = document.getElementById('slipMeta');
  const ocrStatus = document.getElementById('ocrStatus');
  const confirmUpload = document.getElementById('confirmUpload');
  let currentProjectId = null, selectedFile=null, selectedFileUrl=null;
  function openUploadModal(projectId){ currentProjectId = projectId; selectedFile=null; confirmUpload.disabled=true; slipPreview.hidden=true; ocrStatus.textContent='OCR: Pending'; uploadModal.showModal(); const cancelBtn = uploadModal.querySelector('button[value="cancel"]'); if(cancelBtn) cancelBtn.focus(); }
  function cleanupSelected(){ if(selectedFileUrl){ URL.revokeObjectURL(selectedFileUrl); selectedFileUrl = null; } selectedFile = null; slipPreview.hidden=true; slipThumb.src=''; slipMeta.textContent='—'; }
  function handleFiles(file){ if(!file) return; const max = 10*1024*1024; if(!['image/jpeg','image/png'].includes(file.type)) return alert(t('unsupported_format')); if(file.size>max) return alert(t('file_too_large')); if(selectedFileUrl){ URL.revokeObjectURL(selectedFileUrl); selectedFileUrl = null; } selectedFile=file; const url = URL.createObjectURL(file); selectedFileUrl = url; slipThumb.src=url; slipPreview.hidden=false; slipMeta.textContent=`${file.name} • ${(file.size/1024/1024).toFixed(2)}MB`; ocrStatus.textContent='OCR: Checking…'; setTimeout(()=>{ ocrStatus.textContent='OCR: Passed'; confirmUpload.disabled=false; }, 800); }
  dropzone.addEventListener('click',()=>slipInput.click()); dropzone.addEventListener('dragover',e=>{e.preventDefault(); dropzone.style.background='#F0F8FF'}); dropzone.addEventListener('dragleave',()=>{dropzone.style.background='#fff'}); dropzone.addEventListener('drop',e=>{e.preventDefault(); dropzone.style.background='#fff'; handleFiles(e.dataTransfer.files[0]);}); slipInput.addEventListener('change',e=>handleFiles(e.target.files[0]));
  const cancelBtn = uploadModal.querySelector('button[value="cancel"]'); if(cancelBtn){ cancelBtn.addEventListener('click',()=>{ cleanupSelected(); uploadModal.close(); currentProjectId=null; }); }
  confirmUpload.addEventListener('click',()=>{ if(!currentProjectId||!selectedFile) return; const label = document.getElementById(`slipLabel-${currentProjectId}`); const elig = document.getElementById(`elig-${currentProjectId}`); if(label){ label.textContent = t('slip_verified'); } if(elig){ elig.className='pill ok'; elig.textContent=t('approved'); } const p = projects.find(x=>x.id===currentProjectId); if(p) p.__slipVerified=true; cleanupSelected(); currentProjectId = null; uploadModal.close(); });

  // ====== Create admin request via localStorage ======
  function createAdminRequestFromProject(project){
    const today = new Date().toISOString().slice(0,10);
    const newReq = { id: 'R-P-' + Date.now(), name: project.name, project: `${project.name} — ${project.id} (${project.type})`, date: today, length: project.length, status: 'Pending' };
    try{
      const raw = localStorage.getItem('requests');
      const list = raw ? JSON.parse(raw) : [];
      list.push(newReq);
      localStorage.setItem('requests', JSON.stringify(list));
      showToast(t('sent_to_admin'));
    }catch(e){ console.error('failed to save request', e); }
  }

  // ====== Init ======
  renderProjects();
});
