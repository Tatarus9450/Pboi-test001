// admin.js - Admin Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
  const TEMPLATE_OPTIONS = ['A Template', 'Super Learn Template', 'I wanna sleep Template'];

  // ====== i18n via shared javascripts/lang.js ======
  // Use the shared Lang module when available.
  if(window.Lang && typeof window.Lang.init === 'function'){
    window.Lang.init();
  }
  function t(key){ return (window.Lang && window.Lang.t(key)) || key; }

  // ====== Load requests from localStorage or fallback ======
  let requests = [];
  function withTemplate(r){
    if(!r) return r;
    if(!r.template || !TEMPLATE_OPTIONS.includes(r.template)){
      r.template = TEMPLATE_OPTIONS[0];
    }
    return r;
  }

  function loadRequests(){
    try{
      const raw = localStorage.getItem('requests');
      if(raw){
        requests = JSON.parse(raw).map(withTemplate);
      } else {
        requests = [
          {id:'R-001', name:'Anya Chai', project:'Foundations of Design', template:TEMPLATE_OPTIONS[0], date:'2025-10-01', length:20, status:'Approved'},
          {id:'R-002', name:'Niran Boon', project:'Advanced UX Workshop', template:TEMPLATE_OPTIONS[1], date:'2025-10-05', length:30, status:'Pending'},
          {id:'R-003', name:'Mali Bee', project:'Enterprise Leadership', template:TEMPLATE_OPTIONS[2], date:'2025-10-07', length:40, status:'Pending'}
        ];
        localStorage.setItem('requests', JSON.stringify(requests));
      }
    }catch(e){
      console.error('loadRequests', e);
      requests = [];
    }
  }
  function saveRequests(){ try{ localStorage.setItem('requests', JSON.stringify(requests)); }catch(e){ console.error('saveRequests', e); } }

  // ====== Elements ======
  const requestRows = document.getElementById('requestRows');
  const selectAll = document.getElementById('selectAll');
  const bulkApprove = document.getElementById('bulkApprove');
  const bulkDelete = document.getElementById('bulkDelete');
  const setAllPending = document.getElementById('setAllPending');
  const bulkReject = document.getElementById('bulkReject');
  const filterStatus = document.getElementById('filterStatus');
  const filterType = document.getElementById('filterType');
  const sortBy = document.getElementById('sortBy');
  const search = document.getElementById('search');

  // ====== Render requests ======
  function renderRequests(){
    let rows = [...requests];
    const fs = filterStatus ? filterStatus.value : '';
    const ft = filterType ? filterType.value.toLowerCase() : '';
    if(fs) rows = rows.filter(r=>r.status===fs);
    if(ft) rows = rows.filter(r=> r.project.toLowerCase().includes(ft) || (r.name && r.name.toLowerCase().includes(ft)) );
    const q = search ? search.value.trim().toLowerCase() : '';
    if(q) rows = rows.filter(r=>{
      const lengthStr = r.length ? (String(r.length) + 'h') : '';
      const hay = (r.id + ' ' + r.name + ' ' + r.project + ' ' + (r.template || '') + ' ' + r.date + ' ' + r.length + ' ' + lengthStr).toLowerCase();
      return hay.includes(q);
    });
    const s = sortBy ? sortBy.value : '';
    rows.sort((a,b)=>{ if(s==='name_az') return a.name.localeCompare(b.name); if(s==='name_za') return b.name.localeCompare(a.name); if(s==='date_asc') return a.date.localeCompare(b.date); if(s==='date_desc') return b.date.localeCompare(a.date); return 0; });
    requestRows.innerHTML='';
    rows.forEach(r=>{
      const tr=document.createElement('tr');
      const templateOptions = TEMPLATE_OPTIONS.map(option=>`<option value="${option}" ${r.template===option?'selected':''}>${option}</option>`).join('');
      tr.innerHTML = `
        <td><input type="checkbox" class="rowCheck" data-id="${r.id}"/></td>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.project}</td>
        <td>
          <select class="select templateSelect" data-id="${r.id}">
            ${templateOptions}
          </select>
        </td>
        <td>${r.date}</td>
        <td>${r.length}h</td>
        <td class="status-cell"><span class="pill ${r.status==='Approved'?'ok':r.status==='Not Approved'?'bad':'pending'}">${t(r.status==='Approved'?'approved':r.status==='Not Approved'?'rejected':'pending')}</span></td>
        <td>
          <select class="select actionSelect" data-id="${r.id}">
            <option value="" selected disabled>${t('action')}</option>
            <option value="Approved">${t('approve')}</option>
            <option value="Not Approved">${t('not_approve')}</option>
          </select>
        </td>`;
      requestRows.appendChild(tr);
    });
    updateBulkState();
    updateDeleteState();
  }

  function updateBulkState(){
    const any = [...document.querySelectorAll('.rowCheck')].some(cb=>cb.checked);
    bulkApprove.disabled = !any;
    bulkReject.disabled = !any;
    if(setAllPending) setAllPending.disabled = !any;
    const all = document.querySelectorAll('.rowCheck');
    selectAll.checked = all.length && [...all].every(cb=>cb.checked);
  }

  // enable/disable the Delete button alongside other bulk controls
  function updateDeleteState(){ const any = [...document.querySelectorAll('.rowCheck')].some(cb=>cb.checked); if(bulkDelete) bulkDelete.disabled = !any; }

  // ====== Events ======
  selectAll.addEventListener('change', ()=>{ document.querySelectorAll('.rowCheck').forEach(cb=>cb.checked=selectAll.checked); updateBulkState(); updateDeleteState(); });
  document.addEventListener('change', e=>{
    if(e.target.matches('.rowCheck')) {
      updateBulkState();
      updateDeleteState();
    }
    if(e.target.matches('.actionSelect')){
      const id=e.target.dataset.id;
      const val=e.target.value;
      const r = requests.find(x=>x.id===id);
      if(r){
        r.status = val;
        saveRequests();
        renderRequests();
      }
    }
    if(e.target.matches('.templateSelect')){
      const id = e.target.dataset.id;
      const val = e.target.value;
      const r = requests.find(x=>x.id===id);
      if(r && TEMPLATE_OPTIONS.includes(val)){
        r.template = val;
        saveRequests();
      }
    }
  });
  function bulkUpdate(status){ document.querySelectorAll('.rowCheck:checked').forEach(cb=>{ const id = cb.dataset.id; const r = requests.find(x=>x.id===id); if(r) r.status = status; }); saveRequests(); renderRequests(); }
  bulkApprove.addEventListener('click', ()=>bulkUpdate('Approved'));
  bulkReject.addEventListener('click', ()=>bulkUpdate('Not Approved'));
  if(bulkDelete){ bulkDelete.addEventListener('click', ()=>{
    const checked = [...document.querySelectorAll('.rowCheck:checked')].map(cb=>cb.dataset.id);
    if(!checked.length) return;
    // confirm deletion
    if(!confirm('Delete selected requests? This cannot be undone.')) return;
    requests = requests.filter(r=> !checked.includes(r.id));
    saveRequests();
    renderRequests();
  }); }
  if(setAllPending){ setAllPending.addEventListener('click', ()=>bulkUpdate('Pending')); }
  [filterStatus, filterType, sortBy, search].forEach(el=>{ if(el) el.addEventListener('input', renderRequests); });

  // header tabs: go back to user page
  const tabUser = document.getElementById('tabUser');
  const tabAdmin = document.getElementById('tabAdmin');
  if(tabUser) tabUser.addEventListener('click', ()=>{ window.location.href = 'main.html'; });

  // ====== language switch (use shared Lang) ======
  const langTH = document.getElementById('langTH');
  const langEN = document.getElementById('langEN');
  if(window.Lang){
    if(langTH) langTH.addEventListener('click', ()=> window.Lang.setLang('th'));
    if(langEN) langEN.addEventListener('click', ()=> window.Lang.setLang('en'));
    // initialize button states
    if(langTH) langTH.classList.toggle('active', window.Lang.getLang() === 'th');
    if(langEN) langEN.classList.toggle('active', window.Lang.getLang() === 'en');
    if(langTH) langTH.setAttribute('aria-pressed', String(window.Lang.getLang() === 'th'));
    if(langEN) langEN.setAttribute('aria-pressed', String(window.Lang.getLang() === 'en'));
  }

  // ====== Init ======
  loadRequests();
  renderRequests();
});
