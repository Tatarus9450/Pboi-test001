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

  const TEMPLATE_OPTIONS = ['A Template', 'Super Learn Template', 'I wanna sleep Template'];
  const statusList = document.getElementById('statusList');
  let currentUserName = 'User';
  let requestsCache = [];
  const requestButtons = new Map();

  function matchRequest(record, projectId, descriptor){
    if(!record) return false;
    if(record.name && record.name !== currentUserName) return false;
    if(record.projectId && projectId && record.projectId === projectId) return true;
    if(descriptor && record.project === descriptor) return true;
    return false;
  }

  function normalizeRequest(raw){
    if(!raw || typeof raw !== 'object') return null;
    const template = TEMPLATE_OPTIONS.includes(raw.template) ? raw.template : TEMPLATE_OPTIONS[0];
    const createdGuess = typeof raw.createdAt === 'number' ? raw.createdAt : (Date.parse(raw.date) || Date.now());
    return Object.assign({
      projectId: raw.projectId || null
    }, raw, {
      template,
      createdAt: createdGuess,
      lastUpdated: typeof raw.lastUpdated === 'number' ? raw.lastUpdated : createdGuess
    });
  }

  function loadRequestsFromStorage(){
    try{
      const raw = localStorage.getItem('requests');
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      if(!Array.isArray(parsed)) return [];
      const cleaned = parsed.map(normalizeRequest).filter(Boolean);
      return cleaned;
    }catch(e){
      console.error('loadRequestsFromStorage', e);
      return [];
    }
  }

  function ensureAutoApprovedRequest(list){
    const project = projects.find(p=>p.id === 'P-1001');
    if(!project) return {list, changed:false};
    const descriptor = `${project.name} — ${project.id} (${project.type})`;
    const exists = list.some(r => matchRequest(r, project.id, descriptor));
    if(exists) return {list, changed:false};
    const now = Date.now();
    const today = new Date(now).toISOString().slice(0,10);
    const entry = {
      id: 'R-AUTO-' + now,
      name: currentUserName,
      project: descriptor,
      projectId: project.id,
      date: today,
      length: project.length,
      status: 'Approved',
      template: TEMPLATE_OPTIONS[0],
      reason: 'auto_approved',
      createdAt: now,
      lastUpdated: now
    };
    return {list: [...list, entry], changed:true};
  }

  function saveRequestsToStorage(list){
    try{
      localStorage.setItem('requests', JSON.stringify(list));
    }catch(e){
      console.error('saveRequestsToStorage', e);
    }
  }

  function triggerPdfDownload(item){
    try{
      const safeName = (item.project || 'certificate').replace(/[^\w\-_. ]+/g, '').trim().replace(/\s+/g, '_').slice(0,50) + '.pdf';
      const link = document.createElement('a');
      link.href = 'Test.pdf';
      link.download = safeName;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }catch(e){
      console.warn('triggerPdfDownload failed', e);
      try{ window.open('Test.pdf', '_blank'); }catch(err){}
    }
  }

  function buildStatusCard(item){
    const el = document.createElement('div'); el.className='card row';
    const badgeClass = item.status==='Approved' ? 'pill ok' : (item.status==='Not Approved' ? 'pill bad' : 'pill pending');
    const left = document.createElement('div'); left.className='stack';
    const strong = document.createElement('strong'); strong.textContent = item.project;
    left.appendChild(strong);
    if(item.name){
      const nameLine = document.createElement('div'); nameLine.className = 'muted'; nameLine.style.fontSize = '14px'; nameLine.textContent = `${t('name')}: ${item.name}`;
      left.appendChild(nameLine);
    }
    const meta = document.createElement('span'); meta.className='muted'; const dateLabel = item.date || ''; meta.textContent = `${dateLabel}${dateLabel ? ' • ' : ''}${t('id_label')}: ${item.id}`;
    left.appendChild(meta);
    const right = document.createElement('div'); right.className='row'; right.style.gap='8px';
    const statusSpan = document.createElement('span'); statusSpan.className = badgeClass; const statusKey = item.status === 'Approved' ? 'approved' : item.status === 'Not Approved' ? 'rejected' : 'pending'; statusSpan.textContent = t(statusKey);
    right.appendChild(statusSpan);
    const dlBtn = document.createElement('button');
    dlBtn.className = 'btn';
    dlBtn.type = 'button';
    dlBtn.textContent = t('download_pdf');
    dlBtn.setAttribute('aria-label', t('download_pdf'));
    const canDownload = item.status === 'Approved';
    dlBtn.disabled = !canDownload;
    dlBtn.addEventListener('click', ()=>{ if(!dlBtn.disabled) triggerPdfDownload(item); });
    right.appendChild(dlBtn);
    el.appendChild(left); el.appendChild(right);
    return el;
  }

  function renderStatusList(){
    if(!statusList) return;
    statusList.innerHTML = '';
    const mine = requestsCache.filter(r => r && r.name === currentUserName);
    mine.sort((a,b)=> (b.createdAt || 0) - (a.createdAt || 0));
    mine.forEach(item => statusList.appendChild(buildStatusCard(item)));
  }

  function updateRequestButtons(){
    requestButtons.forEach((meta, projectId)=>{
      const hasRequest = requestsCache.some(r=>{
        const descriptor = meta.descriptor;
        return matchRequest(r, projectId, descriptor);
      });
      meta.button.disabled = hasRequest || meta.baseDisabled;
    });
  }

  function refreshRequests(){
    let list = loadRequestsFromStorage();
    const ensured = ensureAutoApprovedRequest(list);
    if(ensured.changed){
      saveRequestsToStorage(ensured.list);
      list = ensured.list;
    } else {
      list = ensured.list;
    }
    requestsCache = list;
    renderStatusList();
    updateRequestButtons();
  }

  // Current logged-in user (derive from profile pill on the page when possible)
  function parseNameFromEmail(email){
    if(!email) return 'User';
    // take local part
    const local = String(email).split('@')[0];
    // insert spaces for camelCase boundaries
    let s = local.replace(/([a-z])([A-Z])/g, '$1 $2');
    // replace common separators with space
    s = s.replace(/[._\-+]/g, ' ');
    // remove trailing numbers
    s = s.replace(/\d+/g, '');
    // collapse spaces
    s = s.replace(/\s+/g, ' ').trim();
    if(!s) return 'User';
    // title-case words
    return s.split(' ').map(w => w.length? (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : '').join(' ');
  }
  // attempt to read profile display (email or name) from header
  (function(){
    try{
      const profileEl = document.querySelector('.profile') || document.querySelector('.profile.pill');
      if(profileEl){
        const txt = profileEl.textContent.trim();
        if(txt.includes('@')){
          currentUserName = parseNameFromEmail(txt);
        } else if(txt.length){
          currentUserName = txt;
        }
      }
    }catch(e){ /* ignore and keep default */ }
  })();

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
  function renderProjects(){
    projWrap.innerHTML='';
    requestButtons.clear();
    projects.forEach(p=>{
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
      const reqBtn = document.createElement('button'); reqBtn.className='btn primary'; reqBtn.id = `req-${p.id}`; reqBtn.type='button';
      const forceContact = (p.type === 'Special') || (p.id === 'P-1002');
  reqBtn.textContent = forceContact ? t('contact_support') : t('request_certificate');
      const baseDisabled = forceContact ? false : (p.progress!==100);
      reqBtn.disabled = baseDisabled;
      if (forceContact){ reqBtn.classList.remove('primary'); }
      actionsRow.appendChild(detailsBtn); actionsRow.appendChild(reqBtn);
      bodyStack.appendChild(metaRow); bodyStack.appendChild(progress); bodyStack.appendChild(slipRow); bodyStack.appendChild(actionsRow);
      card.appendChild(header); card.appendChild(bodyStack); projWrap.appendChild(card);
  if(p.type==='General' || p.type==='Special'){ const slipLabel = document.createElement('span'); slipLabel.className='muted'; slipLabel.id = `slipLabel-${p.id}`; slipLabel.textContent = t('slip_not_uploaded'); const uploadBtn = document.createElement('button'); uploadBtn.className='btn'; uploadBtn.type='button'; uploadBtn.id = `btnUpload-${p.id}`; uploadBtn.textContent = t('upload_slip'); const elig = document.createElement('span'); elig.className='pill pending'; elig.id = `elig-${p.id}`; elig.textContent = t('pending'); slipRow.appendChild(slipLabel); slipRow.appendChild(uploadBtn); slipRow.appendChild(elig); uploadBtn.addEventListener('click',()=>openUploadModal(p.id)); } else { const ok = document.createElement('span'); ok.className='pill ok'; ok.textContent = t('approved'); slipRow.appendChild(ok); }
      reqBtn.addEventListener('click',()=>{ if(forceContact) submitRequestToAdmin(p, 'contact_support'); else handleCertificateRequest(p); });
      requestButtons.set(p.id, {button: reqBtn, descriptor: `${p.name} — ${p.id} (${p.type})`, baseDisabled});
    });
    updateRequestButtons();
  }

  // ====== handle request (user) ======
  function handleCertificateRequest(p){
    const cur = getLang();
    if((p.type==='General') && !p.__slipVerified){ alert((cur==='th')? 'กรุณาอัปโหลดสลิปและผ่านการตรวจสอบก่อน' : 'Please upload slip and pass verification first.'); return; }
    if(p.type==='Special'){ alert((cur==='th')? 'โครงการพิเศษ: กรุณาติดต่อเจ้าหน้าที่' : 'Special project: Please contact support.'); return; }
    submitRequestToAdmin(p, 'certificate');
  }

  function submitRequestToAdmin(project, reason){
    const today = new Date().toISOString().slice(0,10);
    const now = Date.now();
    const descriptor = `${project.name} — ${project.id} (${project.type})`;
    const list = loadRequestsFromStorage();
    const existingIdx = list.findIndex(r => matchRequest(r, project.id, descriptor));
    if(existingIdx >= 0){
      showToast(t('already_submitted'));
      updateRequestButtons();
      return;
    }
    list.push({
      id: 'R-P-' + now,
      name: currentUserName,
      project: descriptor,
      projectId: project.id,
      date: today,
      length: project.length,
      status: reason === 'contact_support' ? 'Pending' : 'Pending',
      template: TEMPLATE_OPTIONS[0],
      reason: reason || 'request',
      createdAt: now,
      lastUpdated: now
    });
    saveRequestsToStorage(list);
    refreshRequests();
    showToast(t('sent_to_admin'));
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

  // ====== cross-tab sync ======
  window.addEventListener('storage', (event) => {
    if(event && event.key === 'requests'){
      refreshRequests();
    }
  });
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) refreshRequests(); });

  // ====== Init ======
  renderProjects();
  refreshRequests();
});
