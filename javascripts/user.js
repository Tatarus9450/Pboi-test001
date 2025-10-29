// user.js - User Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
  // ====== i18n via shared javascripts/lang.js ======
  // Lang provides: Lang.init(), Lang.setLang(code), Lang.getLang(), Lang.t(key), Lang.applyI18n()
  if(window.Lang && typeof window.Lang.init === 'function'){
    window.Lang.init();
  }
  function t(key){ return (window.Lang && window.Lang.t(key)) || key; }
  function getLang(){ return (window.Lang && window.Lang.getLang && window.Lang.getLang()) || 'en'; }

  // ====== Demo Data (projects local) ======
  const projects = [
    {id:'P-1001', name:'Foundations of Design', type:'Free', progress:100, length:20, requiresSlip:false},
    {id:'P-1002', name:'Advanced UX Workshop', type:'General', progress:100, length:30, requiresSlip:true},
    {id:'P-2001', name:'Enterprise Leadership', type:'Special', progress:100, length:40, requiresSlip:true}
  ];

  // Current logged-in user (for prototype/demo). Replace with real auth source as needed.
  const currentUserName = 'Talu Khulapwan';

  // ====== Header tabs / language ======
  const tabUser = document.getElementById('tabUser');
  const tabAdmin = document.getElementById('tabAdmin');
  const langTH = document.getElementById('langTH');
  const langEN = document.getElementById('langEN');
  // wire page tab to admin page (keep existing behavior)
  if(tabAdmin) tabAdmin.addEventListener('click', ()=>{ window.location.href = 'admin.html'; });
  // wire language buttons to shared Lang
  if(window.Lang){
    if(langTH) langTH.addEventListener('click', ()=> window.Lang.setLang('th'));
    if(langEN) langEN.addEventListener('click', ()=> window.Lang.setLang('en'));
    // ensure visual states are correct
    if(langTH) { langTH.classList.toggle('active', window.Lang.getLang() === 'th'); langTH.setAttribute('aria-pressed', String(window.Lang.getLang() === 'th')); }
    if(langEN) { langEN.classList.toggle('active', window.Lang.getLang() === 'en'); langEN.setAttribute('aria-pressed', String(window.Lang.getLang() === 'en')); }
  }

  // ====== UI helpers ======
  function showToast(message, ms = 3000){ try{ const toast = document.createElement('div'); toast.textContent = message; Object.assign(toast.style, {position:'fixed', right:'20px', bottom:'20px', background:'rgba(26,32,44,0.95)', color:'#fff', padding:'10px 14px', borderRadius:'8px', boxShadow:'0 6px 20px rgba(0,0,0,.12)', zIndex:9999, opacity:'0', transition:'opacity 200ms, transform 200ms', transform:'translateY(8px)'}); document.body.appendChild(toast); requestAnimationFrame(()=>{ toast.style.opacity='1'; toast.style.transform='translateY(0)'; }); setTimeout(()=>{ toast.style.opacity='0'; toast.style.transform='translateY(8px)'; toast.addEventListener('transitionend', ()=> toast.remove(), {once:true}); }, ms);}catch(e){console.warn(e);} }

  // ====== Render Projects ======
  const projWrap = document.getElementById('projects');
  function renderProjects(){ projWrap.innerHTML=''; projects.forEach(p=>{
      const card=document.createElement('div');card.className='card stack';
  const curLang = getLang();
  const typeLabel = curLang === 'th' ? (p.type === 'Free' ? t('free') : p.type === 'General' ? t('general') : t('special')) : p.type;
  const header = document.createElement('div'); header.className='row';
  // left side: title + username stacked vertically
  const titleStack = document.createElement('div'); titleStack.className = 'stack';
  const h3 = document.createElement('h3'); h3.textContent = p.name;
  // show user name under project title (per request)
  const nameLine = document.createElement('div'); nameLine.className = 'muted'; nameLine.style.marginLeft = '0'; nameLine.style.fontSize = '14px'; nameLine.textContent = `${t('name')}: ${currentUserName}`;
  titleStack.appendChild(h3);
  titleStack.appendChild(nameLine);
  const badge = document.createElement('span'); badge.className='badge'; badge.textContent = typeLabel;
  header.appendChild(titleStack); header.appendChild(badge);
      const bodyStack = document.createElement('div'); bodyStack.className='stack';
      const metaRow = document.createElement('div'); metaRow.className='row'; metaRow.style.gap='8px';
  const len = document.createElement('span'); len.className='muted'; len.textContent = `${p.length}${t('hours_suffix')}`;
  const idspan = document.createElement('span'); idspan.className='muted'; idspan.textContent = `${t('id_label')}: ${p.id}`;
      metaRow.appendChild(len); metaRow.appendChild(idspan);
      const progress = document.createElement('div'); progress.className='progress'; progress.setAttribute('aria-label','Progress');
      const bar = document.createElement('div'); bar.className='bar'; bar.style.width = `${p.progress}%`;
      progress.appendChild(bar);
      const slipRow = document.createElement('div'); slipRow.className='row wrap'; slipRow.id = `slipState-${p.id}`;
      const actionsRow = document.createElement('div'); actionsRow.className='row'; actionsRow.style.gap='8px'; actionsRow.style.justifyContent='flex-end';
  const detailsBtn = document.createElement('button'); detailsBtn.className='btn ghost'; detailsBtn.type='button'; detailsBtn.textContent=t('details');
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
  function handleRequest(p){ const cur = getLang(); if((p.type==='General') && !p.__slipVerified){ alert((cur==='th')? 'กรุณาอัปโหลดสลิปและผ่านการตรวจสอบก่อน' : 'Please upload slip and pass verification first.'); return; } if(p.type==='Special'){ alert((cur==='th')? 'โครงการพิเศษ: กรุณาติดต่อเจ้าหน้าที่' : 'Special project: Please contact support.'); return; } const today = new Date().toISOString().slice(0,10); addStatusItem({id:'C-'+Math.floor(Math.random()*10000), project:p.name, date:today, status:'Approved'}); }

  function addStatusItem(item){
    const statusList = document.getElementById('statusList');
    const el = document.createElement('div'); el.className='card row';
    const badgeClass = item.status==='Approved' ? 'pill ok' : (item.status==='Not Approved' ? 'pill bad' : 'pill pending');
    const left = document.createElement('div'); left.className='stack';
    const strong = document.createElement('strong'); strong.textContent = item.project;
    const meta = document.createElement('span'); meta.className='muted'; meta.textContent = `${item.date} • ${t('id_label')}: ${item.id}`;
    left.appendChild(strong); left.appendChild(meta);
    const right = document.createElement('div'); right.className='row'; right.style.gap='8px';
    const statusSpan = document.createElement('span'); statusSpan.className = badgeClass; statusSpan.textContent = t(item.status==='Approved'?'approved':item.status==='Not Approved'?'rejected':'pending');
    right.appendChild(statusSpan);
    if(item.status==='Approved'){
      const dl = document.createElement('button'); dl.className='btn'; dl.setAttribute('aria-label', t('download_pdf')); dl.textContent = t('download_pdf'); right.appendChild(dl);
    }
    el.appendChild(left); el.appendChild(right); statusList.prepend(el);
  }

  // ====== Upload modal logic (user) ======
  const uploadModal = document.getElementById('uploadModal');
  const dropzone = document.getElementById('dropzone');
  const slipInput = document.getElementById('slipInput');
  const slipPreview = document.getElementById('slipPreview');
  const slipThumb = document.getElementById('slipThumb');
  if(slipThumb) slipThumb.alt = t('slip_preview_alt');
  const slipMeta = document.getElementById('slipMeta');
  const ocrStatus = document.getElementById('ocrStatus');
  const confirmUpload = document.getElementById('confirmUpload');
  let currentProjectId = null, selectedFile=null, selectedFileUrl=null;
  function openUploadModal(projectId){ currentProjectId = projectId; selectedFile=null; confirmUpload.disabled=true; slipPreview.hidden=true; ocrStatus.textContent = t('ocr_pending'); // localized
    // update slip preview alt for accessibility
    if(slipThumb) slipThumb.alt = t('slip_preview_alt');
    uploadModal.showModal(); const cancelBtn = uploadModal.querySelector('button[value="cancel"]'); if(cancelBtn) cancelBtn.focus(); }
  function cleanupSelected(){ if(selectedFileUrl){ URL.revokeObjectURL(selectedFileUrl); selectedFileUrl = null; } selectedFile = null; slipPreview.hidden=true; slipThumb.src=''; slipMeta.textContent='—'; }
  function handleFiles(file){ if(!file) return; const max = 10*1024*1024; if(!['image/jpeg','image/png'].includes(file.type)) return alert(t('unsupported_format')); if(file.size>max) return alert(t('file_too_large')); if(selectedFileUrl){ URL.revokeObjectURL(selectedFileUrl); selectedFileUrl = null; } selectedFile=file; const url = URL.createObjectURL(file); selectedFileUrl = url; slipThumb.src=url; slipPreview.hidden=false; slipMeta.textContent=`${file.name} • ${(file.size/1024/1024).toFixed(2)}MB`; ocrStatus.textContent = t('ocr_checking'); setTimeout(()=>{ ocrStatus.textContent = t('ocr_passed'); confirmUpload.disabled=false; }, 800); }
  dropzone.addEventListener('click',()=>slipInput.click()); dropzone.addEventListener('dragover',e=>{e.preventDefault(); dropzone.style.background='#F0F8FF'}); dropzone.addEventListener('dragleave',()=>{dropzone.style.background='#fff'}); dropzone.addEventListener('drop',e=>{e.preventDefault(); dropzone.style.background='#fff'; handleFiles(e.dataTransfer.files[0]);}); slipInput.addEventListener('change',e=>handleFiles(e.target.files[0]));
  const cancelBtn = uploadModal.querySelector('button[value="cancel"]'); if(cancelBtn){ cancelBtn.addEventListener('click',()=>{ cleanupSelected(); uploadModal.close(); currentProjectId=null; }); }
  confirmUpload.addEventListener('click',()=>{ if(!currentProjectId||!selectedFile) return; const label = document.getElementById(`slipLabel-${currentProjectId}`); const elig = document.getElementById(`elig-${currentProjectId}`); if(label){ label.textContent = t('slip_verified'); } if(elig){ elig.className='pill ok'; elig.textContent=t('approved'); } const p = projects.find(x=>x.id===currentProjectId); if(p) p.__slipVerified=true; cleanupSelected(); currentProjectId = null; uploadModal.close(); });

  // ====== Create admin request via localStorage ======
  function createAdminRequestFromProject(project){
    const today = new Date().toISOString().slice(0,10);
    // send the real user name to admin instead of project name
    const newReq = { id: 'R-P-' + Date.now(), name: currentUserName, project: `${project.name} — ${project.id} (${project.type})`, date: today, length: project.length, status: 'Pending' };
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
