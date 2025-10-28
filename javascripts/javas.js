// Extracted script from main.html
// Wrapped in DOMContentLoaded to ensure elements exist before querying
document.addEventListener('DOMContentLoaded', () => {
  // ====== i18n (TH/EN) minimal ======
  const i18n = {
    en:{
  user_dashboard:"User Dashboard",admin_console:"Admin Console",certificates:"Certificates",eligible_hint:"Request a certificate when progress reaches 100%.",status:"Status",all_status:"All status",all_statuses:"All status",pending:"Pending Review",approved:"Approved",rejected:"Not Approved",all_types:"All types",name:"Name",project:"Project",date:"Date",length:"Length",action:"Action",upload_slip:"Upload Slip",drop_or_browse:"Drop JPG/PNG (≤ 10MB) or click to browse",cancel:"Cancel",confirm:"Confirm",request_certificate:"Request Certificate",download_pdf:"Download PDF",contact_support:"Contact Support",slip_not_uploaded:"Slip: Not uploaded",slip_uploaded:"Slip: Uploaded",slip_verified:"Slip: Verified",free:"Free",general:"General",special:"Special",unsupported_format:"Unsupported file format",file_too_large:"File is too large (max 10MB)",approve:"Approve",not_approve:"Not Approve",action:"Action"
    },
    th:{
  user_dashboard:"แดชบอร์ดผู้ใช้",admin_console:"คอนโซลผู้ดูแล",certificates:"ใบรับรอง",eligible_hint:"ขอใบรับรองได้เมื่อความคืบหน้า 100%",status:"สถานะ",all_status:"ทุกสถานะ",all_statuses:"ทุกสถานะ",pending:"รอตรวจสอบ",approved:"อนุมัติแล้ว",rejected:"ไม่อนุมัติ",all_types:"ทุกประเภท",name:"ชื่อ",project:"โครงการ",date:"วันที่",length:"ระยะเวลา",action:"การทำงาน",upload_slip:"อัปโหลดสลิป",drop_or_browse:"ลากไฟล์ JPG/PNG (≤ 10MB) หรือคลิกเพื่อเลือก",cancel:"ยกเลิก",confirm:"ยืนยัน",request_certificate:"ขอใบรับรอง",download_pdf:"ดาวน์โหลด PDF",contact_support:"ติดต่อเจ้าหน้าที่",slip_not_uploaded:"สลิป: ยังไม่อัปโหลด",slip_uploaded:"สลิป: อัปโหลดแล้ว",slip_verified:"สลิป: ตรวจผ่าน",free:"ฟรี",general:"ทั่วไป",special:"พิเศษ",unsupported_format:"รูปแบบไฟล์ไม่รองรับ",file_too_large:"ไฟล์ใหญ่เกินไป (สูงสุด 10MB)",approve:"อนุมัติ",not_approve:"ไม่อนุมัติ",action:"การทำงาน"
    }
  };
  let lang = 'en';
  function t(key){return (i18n[lang] && i18n[lang][key]) || key}
  function applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent = t(el.dataset.i18n)});
  }

  // ====== Demo Data ======
  const projects = [
    {id:'P-1001', name:'Foundations of Design', type:'Free', progress:100, length:20, requiresSlip:false},
    {id:'P-1002', name:'Advanced UX Workshop', type:'General', progress:100, length:30, requiresSlip:true},
    {id:'P-2001', name:'Enterprise Leadership', type:'Special', progress:100, length:40, requiresSlip:true}
  ];

  const requests = [
    {id:'R-001', name:'Anya Chai', project:'Foundations of Design', date:'2025-10-01', length:20, status:'Approved'},
    {id:'R-002', name:'Niran Boon', project:'Advanced UX Workshop', date:'2025-10-05', length:30, status:'Pending'},
    {id:'R-003', name:'Mali Bee', project:'Enterprise Leadership', date:'2025-10-07', length:40, status:'Pending'}
  ];

  // ====== Tabs ======
  const userView = document.getElementById('userView');
  const adminView = document.getElementById('adminView');
  const tabUser = document.getElementById('tabUser');
  const tabAdmin = document.getElementById('tabAdmin');
  tabUser.addEventListener('click',()=>{tabUser.classList.add('active');tabAdmin.classList.remove('active');userView.hidden=false;adminView.hidden=true});
  tabAdmin.addEventListener('click',()=>{tabAdmin.classList.add('active');tabUser.classList.remove('active');userView.hidden=true;adminView.hidden=false});

  // ====== Language Switch ======
  const langTH = document.getElementById('langTH');
  const langEN = document.getElementById('langEN');
  function setLang(newLang){
    lang=newLang;applyI18n();
    langTH.classList.toggle('active',lang==='th');
    langEN.classList.toggle('active',lang==='en');
  }
  langTH.addEventListener('click',()=>setLang('th'));
  langEN.addEventListener('click',()=>setLang('en'));
  applyI18n();

  // ====== Render Projects (User) ======
  const projWrap = document.getElementById('projects');
  const statusList = document.getElementById('statusList');

  function renderProjects(){
    projWrap.innerHTML='';
    projects.forEach(p=>{
      const card=document.createElement('div');card.className='card stack';
      const typeLabel = lang==='th' ? (p.type==='Free'?t('free'):p.type==='General'?t('general'):t('special')) : p.type;
      // build DOM safely (avoid injecting raw innerHTML with data)
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
      reqBtn.textContent = t('request_certificate');
      actionsRow.appendChild(detailsBtn); actionsRow.appendChild(reqBtn);

      bodyStack.appendChild(metaRow);
      bodyStack.appendChild(progress);
      bodyStack.appendChild(slipRow);
      bodyStack.appendChild(actionsRow);

      card.appendChild(header); card.appendChild(bodyStack);
      projWrap.appendChild(card);

      // slip state
      if(p.type==='General' || (p.type==='Special')){
        const slipLabel = document.createElement('span'); slipLabel.className='muted'; slipLabel.id = `slipLabel-${p.id}`; slipLabel.textContent = t('slip_not_uploaded');
        const uploadBtn = document.createElement('button'); uploadBtn.className='btn'; uploadBtn.type='button'; uploadBtn.id = `btnUpload-${p.id}`; uploadBtn.textContent = t('upload_slip');
        const elig = document.createElement('span'); elig.className='pill pending'; elig.id = `elig-${p.id}`; elig.textContent = t('pending');
        slipRow.appendChild(slipLabel); slipRow.appendChild(uploadBtn); slipRow.appendChild(elig);
        uploadBtn.addEventListener('click',()=>openUploadModal(p.id));
      } else {
        const ok = document.createElement('span'); ok.className='pill ok'; ok.textContent = t('approved'); slipRow.appendChild(ok);
      }

      // request action
      reqBtn.addEventListener('click',()=>handleRequest(p));
      if(p.type==='Special'){
        // require manual approval → change text and style
        reqBtn.disabled = false; reqBtn.textContent = t('contact_support'); reqBtn.classList.remove('primary');
      }
    })
  }

  function addStatusItem(item){
    const el = document.createElement('div');
    el.className='card row';
    const badgeClass = item.status==='Approved'?'pill ok':(item.status==='Not Approved'?'pill bad':'pill pending');
    const left = document.createElement('div'); left.className='stack';
    const strong = document.createElement('strong'); strong.textContent = item.project;
    const meta = document.createElement('span'); meta.className='muted'; meta.textContent = `${item.date} • ID: ${item.id}`;
    left.appendChild(strong); left.appendChild(meta);
    const right = document.createElement('div'); right.className='row'; right.style.gap='8px';
    const statusSpan = document.createElement('span'); statusSpan.className = badgeClass; statusSpan.textContent = t(item.status==='Approved'?'approved':item.status==='Not Approved'?'rejected':'pending');
    right.appendChild(statusSpan);
    if(item.status==='Approved'){
      const dl = document.createElement('button'); dl.className='btn'; dl.setAttribute('aria-label','Download PDF'); dl.textContent = t('download_pdf'); right.appendChild(dl);
    }
    el.appendChild(left); el.appendChild(right);
    statusList.prepend(el);
  }

  function handleRequest(p){
    // For demo, if General requires slip → ensure verified flag
    if((p.type==='General') && !p.__slipVerified){
      alert((lang==='th')? 'กรุณาอัปโหลดสลิปและผ่านการตรวจสอบก่อน' : 'Please upload slip and pass verification first.');
      return;
    }
    if(p.type==='Special'){
      alert((lang==='th')? 'โครงการพิเศษ: กรุณาติดต่อเจ้าหน้าที่' : 'Special project: Please contact support.');
      return;
    }
    // Simulate approve instantly
    const today = new Date().toISOString().slice(0,10);
    addStatusItem({id:'C-'+Math.floor(Math.random()*10000), project:p.name, date:today, status:'Approved'});
  }

  // ====== Upload Slip + OCR (simulated) ======
  const uploadModal = document.getElementById('uploadModal');
  const dropzone = document.getElementById('dropzone');
  const slipInput = document.getElementById('slipInput');
  const slipPreview = document.getElementById('slipPreview');
  const slipThumb = document.getElementById('slipThumb');
  const slipMeta = document.getElementById('slipMeta');
  const ocrStatus = document.getElementById('ocrStatus');
  const confirmUpload = document.getElementById('confirmUpload');
  let currentProjectId = null, selectedFile=null, selectedFileUrl=null;

  function openUploadModal(projectId){
    currentProjectId = projectId; selectedFile=null; confirmUpload.disabled=true;
    slipPreview.hidden=true; ocrStatus.textContent='OCR: Pending';
    uploadModal.showModal();
    // focus management: focus close/cancel button
    const cancelBtn = uploadModal.querySelector('button[value="cancel"]'); if(cancelBtn) cancelBtn.focus();
  }

  function cleanupSelected(){
    if(selectedFileUrl){ URL.revokeObjectURL(selectedFileUrl); selectedFileUrl = null; }
    selectedFile = null; slipPreview.hidden=true; slipThumb.src=''; slipMeta.textContent='—';
  }

  function handleFiles(file){
    if(!file) return; const max = 10*1024*1024; // 10MB
    if(!['image/jpeg','image/png'].includes(file.type)) return alert(t('unsupported_format'));
    if(file.size>max) return alert(t('file_too_large'));
    // revoke previous URL if any
    if(selectedFileUrl){ URL.revokeObjectURL(selectedFileUrl); selectedFileUrl = null; }
    selectedFile=file; const url = URL.createObjectURL(file); selectedFileUrl = url;
    slipThumb.src=url; slipPreview.hidden=false; slipMeta.textContent=`${file.name} • ${(file.size/1024/1024).toFixed(2)}MB`;
    // Simulate OCR check
    ocrStatus.textContent='OCR: Checking…';
    setTimeout(()=>{ ocrStatus.textContent='OCR: Passed'; confirmUpload.disabled=false; }, 800);
  }

  dropzone.addEventListener('click',()=>slipInput.click());
  dropzone.addEventListener('dragover',e=>{e.preventDefault(); dropzone.style.background='#F0F8FF'});
  dropzone.addEventListener('dragleave',()=>{dropzone.style.background='#fff'});
  dropzone.addEventListener('drop',e=>{e.preventDefault(); dropzone.style.background='#fff'; handleFiles(e.dataTransfer.files[0]);});
  slipInput.addEventListener('change',e=>handleFiles(e.target.files[0]));

  const cancelBtn = uploadModal.querySelector('button[value="cancel"]');
  if(cancelBtn){
    cancelBtn.addEventListener('click',()=>{ cleanupSelected(); uploadModal.close(); currentProjectId=null; });
  }

  confirmUpload.addEventListener('click',()=>{
    if(!currentProjectId||!selectedFile) return;
    const label = document.getElementById(`slipLabel-${currentProjectId}`);
    const elig = document.getElementById(`elig-${currentProjectId}`);
    if(label){ label.textContent = t('slip_verified'); }
    if(elig){ elig.className='pill ok'; elig.textContent=t('approved'); }
    const p = projects.find(x=>x.id===currentProjectId); if(p) p.__slipVerified=true;
    // cleanup and close modal
    cleanupSelected(); currentProjectId = null; uploadModal.close();
  });

  // ====== Admin Table ======
  const requestRows = document.getElementById('requestRows');
  const selectAll = document.getElementById('selectAll');
  const bulkApprove = document.getElementById('bulkApprove');
  const bulkReject = document.getElementById('bulkReject');
  const filterStatus = document.getElementById('filterStatus');
  const filterType = document.getElementById('filterType');
  const sortBy = document.getElementById('sortBy');
  const search = document.getElementById('search');

  function renderRequests(){
    let rows = [...requests];
    // filter
    const fs=filterStatus.value, ft=filterType.value.toLowerCase();
    if(fs) rows = rows.filter(r=>r.status===fs);
    if(ft) rows = rows.filter(r=>r.project.toLowerCase().includes(ft));
    // search (include id, name, project, date, length)
    const q = search.value.trim().toLowerCase();
    if(q) rows = rows.filter(r=>{
      const lengthStr = r.length ? (String(r.length) + 'h') : '';
      const hay = (r.id + ' ' + r.name + ' ' + r.project + ' ' + r.date + ' ' + r.length + ' ' + lengthStr).toLowerCase();
      return hay.includes(q);
    });
    // sort
    const s = sortBy.value;
    rows.sort((a,b)=>{
      if(s==='name_az') return a.name.localeCompare(b.name);
      if(s==='name_za') return b.name.localeCompare(a.name);
      if(s==='date_asc') return a.date.localeCompare(b.date);
      if(s==='date_desc') return b.date.localeCompare(a.date);
      return 0;
    });

    requestRows.innerHTML='';
    rows.forEach(r=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="rowCheck" data-id="${r.id}"/></td>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.project}</td>
        <td>${r.date}</td>
        <td>${r.length}h</td>
        <td><span class="pill ${r.status==='Approved'?'ok':r.status==='Not Approved'?'bad':'pending'}">${t(r.status==='Approved'?'approved':r.status==='Not Approved'?'rejected':'pending')}</span></td>
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
  }

  function updateBulkState(){
    const any = [...document.querySelectorAll('.rowCheck')].some(cb=>cb.checked);
    bulkApprove.disabled = !any; bulkReject.disabled = !any;
    // reset selectAll based on rows
    const all = document.querySelectorAll('.rowCheck');
    selectAll.checked = all.length && [...all].every(cb=>cb.checked);
  }

  selectAll.addEventListener('change',()=>{
    document.querySelectorAll('.rowCheck').forEach(cb=>cb.checked=selectAll.checked);
    updateBulkState();
  });

  document.addEventListener('change',e=>{
    if(e.target.matches('.rowCheck')) updateBulkState();
    if(e.target.matches('.actionSelect')){
      const id=e.target.dataset.id; const val=e.target.value; const r=requests.find(x=>x.id===id);
      if(r){ r.status = val; renderRequests(); }
    }
  });

  function bulkUpdate(status){
    document.querySelectorAll('.rowCheck:checked').forEach(cb=>{
      const id = cb.dataset.id; const r = requests.find(x=>x.id===id); if(r) r.status = status;
    });
    renderRequests();
  }
  bulkApprove.addEventListener('click',()=>bulkUpdate('Approved'));
  bulkReject.addEventListener('click',()=>bulkUpdate('Not Approved'));

  [filterStatus, filterType, sortBy, search].forEach(el=>el.addEventListener('input',renderRequests));

  // ====== Init ======
  renderProjects();
  renderRequests();

});
