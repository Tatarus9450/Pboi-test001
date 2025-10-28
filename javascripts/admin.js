// admin.js - Admin Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
  // ====== i18n (same keys as user.js) ======
  const i18n = {
    en:{user_dashboard:"User Dashboard",admin_console:"Admin Console",certificates:"Certificates",eligible_hint:"Request a certificate when progress reaches 100%.",status:"Status",all_status:"All status",all_statuses:"All status",pending:"Pending Review",approved:"Approved",rejected:"Not Approved",all_types:"All types",name:"Name",project:"Project",date:"Date",length:"Length",action:"Action",upload_slip:"Upload Slip",drop_or_browse:"Drop JPG/PNG (≤ 10MB) or click to browse",cancel:"Cancel",confirm:"Confirm",request_certificate:"Request Certificate",download_pdf:"Download PDF",contact_support:"Contact Support",sent_to_admin:"Request sent to admin",slip_not_uploaded:"Slip: Not uploaded",slip_uploaded:"Slip: Uploaded",slip_verified:"Slip: Verified",free:"Free",general:"General",special:"Special",unsupported_format:"Unsupported file format",file_too_large:"File is too large (max 10MB)",approve:"Approve",not_approve:"Not Approve",action:"Action"},
    th:{user_dashboard:"แดชบอร์ดผู้ใช้",admin_console:"คอนโซลผู้ดูแล",certificates:"ใบรับรอง",eligible_hint:"ขอใบรับรองได้เมื่อความคืบหน้า 100%",status:"สถานะ",all_status:"ทุกสถานะ",all_statuses:"ทุกสถานะ",pending:"รอตรวจสอบ",approved:"อนุมัติแล้ว",rejected:"ไม่อนุมัติ",all_types:"ทุกประเภท",name:"ชื่อ",project:"โครงการ",date:"วันที่",length:"ระยะเวลา",action:"การทำงาน",upload_slip:"อัปโหลดสลิป",drop_or_browse:"ลากไฟล์ JPG/PNG (≤ 10MB) หรือคลิกเพื่อเลือก",cancel:"ยกเลิก",confirm:"ยืนยัน",request_certificate:"ขอใบรับรอง",download_pdf:"ดาวน์โหลด PDF",contact_support:"ติดต่อเจ้าหน้าที่",sent_to_admin:"ได้ส่งเรื่องไปที่ Admin แล้ว",slip_not_uploaded:"สลิป: ยังไม่อัปโหลด",slip_uploaded:"สลิป: อัปโหลดแล้ว",slip_verified:"สลิป: ตรวจผ่าน",free:"ฟรี",general:"ทั่วไป",special:"พิเศษ",unsupported_format:"รูปแบบไฟล์ไม่รองรับ",file_too_large:"ไฟล์ใหญ่เกินไป (สูงสุด 10MB)",approve:"อนุมัติ",not_approve:"ไม่อนุมัติ",action:"การทำงาน"}
  };
  let lang = localStorage.getItem('lang') || 'en';
  function t(key){return (i18n[lang] && i18n[lang][key]) || key}
  function applyI18n(){document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent = t(el.dataset.i18n)})}
  applyI18n();

  // ====== Load requests from localStorage or fallback ======
  let requests = [];
  function loadRequests(){ try{ const raw = localStorage.getItem('requests'); if(raw){ requests = JSON.parse(raw); } else { requests = [ {id:'R-001', name:'Anya Chai', project:'Foundations of Design', date:'2025-10-01', length:20, status:'Approved'}, {id:'R-002', name:'Niran Boon', project:'Advanced UX Workshop', date:'2025-10-05', length:30, status:'Pending'}, {id:'R-003', name:'Mali Bee', project:'Enterprise Leadership', date:'2025-10-07', length:40, status:'Pending'} ]; localStorage.setItem('requests', JSON.stringify(requests)); } }catch(e){ console.error('loadRequests', e); requests = []; } }
  function saveRequests(){ try{ localStorage.setItem('requests', JSON.stringify(requests)); }catch(e){ console.error('saveRequests', e); } }

  // ====== Elements ======
  const requestRows = document.getElementById('requestRows');
  const selectAll = document.getElementById('selectAll');
  const bulkApprove = document.getElementById('bulkApprove');
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
    if(q) rows = rows.filter(r=>{ const lengthStr = r.length ? (String(r.length) + 'h') : ''; const hay = (r.id + ' ' + r.name + ' ' + r.project + ' ' + r.date + ' ' + r.length + ' ' + lengthStr).toLowerCase(); return hay.includes(q); });
    const s = sortBy ? sortBy.value : '';
    rows.sort((a,b)=>{ if(s==='name_az') return a.name.localeCompare(b.name); if(s==='name_za') return b.name.localeCompare(a.name); if(s==='date_asc') return a.date.localeCompare(b.date); if(s==='date_desc') return b.date.localeCompare(a.date); return 0; });
    requestRows.innerHTML='';
    rows.forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML = `
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
        </td>`; requestRows.appendChild(tr); }); updateBulkState(); }

  function updateBulkState(){ const any = [...document.querySelectorAll('.rowCheck')].some(cb=>cb.checked); bulkApprove.disabled = !any; bulkReject.disabled = !any; const all = document.querySelectorAll('.rowCheck'); selectAll.checked = all.length && [...all].every(cb=>cb.checked); }

  // ====== Events ======
  selectAll.addEventListener('change', ()=>{ document.querySelectorAll('.rowCheck').forEach(cb=>cb.checked=selectAll.checked); updateBulkState(); });
  document.addEventListener('change', e=>{ if(e.target.matches('.rowCheck')) updateBulkState(); if(e.target.matches('.actionSelect')){ const id=e.target.dataset.id; const val=e.target.value; const r = requests.find(x=>x.id===id); if(r){ r.status = val; saveRequests(); renderRequests(); } } });
  function bulkUpdate(status){ document.querySelectorAll('.rowCheck:checked').forEach(cb=>{ const id = cb.dataset.id; const r = requests.find(x=>x.id===id); if(r) r.status = status; }); saveRequests(); renderRequests(); }
  bulkApprove.addEventListener('click', ()=>bulkUpdate('Approved'));
  bulkReject.addEventListener('click', ()=>bulkUpdate('Not Approved'));
  if(setAllPending){ setAllPending.addEventListener('click', ()=>{ requests.forEach(r=>r.status='Pending'); saveRequests(); renderRequests(); }); }
  [filterStatus, filterType, sortBy, search].forEach(el=>{ if(el) el.addEventListener('input', renderRequests); });

  // header tabs: go back to user page
  const tabUser = document.getElementById('tabUser');
  const tabAdmin = document.getElementById('tabAdmin');
  if(tabUser) tabUser.addEventListener('click', ()=>{ window.location.href = 'main.html'; });

  // ====== language switch (same behavior as user.js) ======
  const langTH = document.getElementById('langTH');
  const langEN = document.getElementById('langEN');
  function setLang(newLang){ lang = newLang; localStorage.setItem('lang', lang); applyI18n(); if(langTH) langTH.classList.toggle('active', lang==='th'); if(langEN) langEN.classList.toggle('active', lang==='en'); if(langTH) langTH.setAttribute('aria-pressed', String(lang==='th')); if(langEN) langEN.setAttribute('aria-pressed', String(lang==='en')); }
  if(langTH) langTH.addEventListener('click', ()=> setLang('th'));
  if(langEN) langEN.addEventListener('click', ()=> setLang('en'));
  // initialize button states
  if(langTH) langTH.classList.toggle('active', lang==='th');
  if(langEN) langEN.classList.toggle('active', lang==='en');

  // ====== Init ======
  loadRequests();
  renderRequests();
});
