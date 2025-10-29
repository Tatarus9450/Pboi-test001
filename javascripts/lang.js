// lang.js — shared i18n and language state
(function(window){
  const i18n = {
    en:{user_dashboard:"User Dashboard",admin_console:"Admin Console",certificates:"Certificates",eligible_hint:"Request a certificate when progress reaches 100%.",status:"Status",all_status:"All status",all_statuses:"All status",pending:"Pending Review",approved:"Approved",rejected:"Not Approved",all_types:"All types",name:"Name",project:"Project",date:"Date",length:"Length",action:"Action",upload_slip:"Upload Slip",drop_or_browse:"Drop JPG/PNG (≤ 10MB) or click to browse",cancel:"Cancel",confirm:"Confirm",request_certificate:"Request Certificate",download_pdf:"Download PDF",contact_support:"Contact Support",sent_to_admin:"Request sent to admin",slip_not_uploaded:"Slip: Not uploaded",slip_uploaded:"Slip: Uploaded",slip_verified:"Slip: Verified",free:"Free",general:"General",special:"Special",unsupported_format:"Unsupported file format",file_too_large:"File is too large (max 10MB)",approve:"Approve",not_approve:"Not Approve",action:"Action"},
    th:{user_dashboard:"แดชบอร์ดผู้ใช้",admin_console:"คอนโซลผู้ดูแล",certificates:"ใบรับรอง",eligible_hint:"ขอใบรับรองได้เมื่อความคืบหน้า 100%",status:"สถานะ",all_status:"ทุกสถานะ",all_statuses:"ทุกสถานะ",pending:"รอตรวจสอบ",approved:"อนุมัติแล้ว",rejected:"ไม่อนุมัติ",all_types:"ทุกประเภท",name:"ชื่อ",project:"โครงการ",date:"วันที่",length:"ระยะเวลา",action:"การทำงาน",upload_slip:"อัปโหลดสลิป",drop_or_browse:"ลากไฟล์ JPG/PNG (≤ 10MB) หรือคลิกเพื่อเลือก",cancel:"ยกเลิก",confirm:"ยืนยัน",request_certificate:"ขอใบรับรอง",download_pdf:"ดาวน์โหลด PDF",contact_support:"ติดต่อเจ้าหน้าที่",sent_to_admin:"ได้ส่งเรื่องไปที่ Admin แล้ว",slip_not_uploaded:"สลิป: ยังไม่อัปโหลด",slip_uploaded:"สลิป: อัปโหลดแล้ว",slip_verified:"สลิป: ตรวจผ่าน",free:"ฟรี",general:"ทั่วไป",special:"พิเศษ",unsupported_format:"รูปแบบไฟล์ไม่รองรับ",file_too_large:"ไฟล์ใหญ่เกินไป (สูงสุด 10MB)",approve:"อนุมัติ",not_approve:"ไม่อนุมัติ",action:"การทำงาน"}
  };

  // Additional common keys used by user.js
  // (kept outside the main object for readability — merge into i18n if preferred)
  // We'll extend the i18n values below to ensure keys exist
  const extras = {
    en: {
      details: 'Details',
      id_label: 'ID',
      hours_suffix: 'h',
      ocr_pending: 'OCR: Pending',
      ocr_checking: 'OCR: Checking…',
      ocr_passed: 'OCR: Passed',
      slip_preview_alt: 'Slip preview'
    },
    th: {
      details: 'รายละเอียด',
      id_label: 'ID',
      hours_suffix: 'h',
      ocr_pending: 'OCR: รอการตรวจ',
      ocr_checking: 'OCR: กำลังตรวจ…',
      ocr_passed: 'OCR: ตรวจผ่าน',
      slip_preview_alt: 'ตัวอย่างสลิป'
    }
  };

  // merge extras into i18n
  Object.keys(extras).forEach(code=>{
    if(i18n[code]){
      Object.assign(i18n[code], extras[code]);
    } else {
      i18n[code] = Object.assign({}, extras[code]);
    }
  });

  // Additional admin keys
  const adminExtras = {
    en: {
      set_all_pending: 'Set to pending',
      search: 'Search',
      select_all: 'Select all'
    },
    th: {
      set_all_pending: 'ตั้งที่เลือกเป็นรอตรวจสอบ',
      search: 'ค้นหา',
      select_all: 'เลือกทั้งหมด'
    }
  };
  Object.keys(adminExtras).forEach(code=>{
    if(i18n[code]) Object.assign(i18n[code], adminExtras[code]); else i18n[code] = Object.assign({}, adminExtras[code]);
  });

  let lang = 'en';
  // Broadcast channel for multi-tab communication (reload other tabs on lang change)
  let bc = null;
  try{
    bc = new BroadcastChannel('lang_channel');
    bc.onmessage = (ev) => {
      try{
        const data = ev.data;
        if(!data) return;
        if(data.type === 'lang_change'){
          // another tab requested a language change — reload to pick up new lang
          if(data.lang && data.lang !== lang){
            lang = data.lang;
            save();
          }
          // reload to restart the page and re-initialize with new language
          try{ location.reload(); }catch(e){}
        }
      }catch(e){ console.warn('bc.onmessage failed', e); }
    };
  }catch(e){ /* BroadcastChannel not available; fallback to storage event below */ }

  function save(){ try{ localStorage.setItem('lang', lang); }catch(e){ console.warn('lang save failed', e); } }
  function load(){ try{ const raw = localStorage.getItem('lang'); if(raw) lang = raw; }catch(e){ console.warn('lang load failed', e); } }

  function t(key){ return (i18n[lang] && i18n[lang][key]) || key; }

  function applyI18n(root=document){
    try{
      root.querySelectorAll('[data-i18n]').forEach(el=>{
        const key = el.dataset.i18n;
        const val = t(key);
        const tag = (el.tagName || '').toUpperCase();
        // inputs/search boxes -> placeholder
        if(tag === 'INPUT'){
          const type = (el.type || '').toLowerCase();
          if(type === 'search' || type === 'text' || type === 'email' || type === 'tel'){
            el.placeholder = val;
          } else if(type === 'checkbox' || type === 'radio'){
            el.setAttribute('aria-label', val);
          } else {
            // fallback to value
            el.value = val;
          }
        } else if(tag === 'TEXTAREA'){
          el.placeholder = val;
        } else {
          // regular elements: set textContent
          el.textContent = val;
        }
        // if element has a title attribute, also translate it for accessibility
        if(el.hasAttribute('title')){
          el.setAttribute('title', val);
        }
      });
    }catch(e){ console.warn('applyI18n failed', e); }
  }


  function updateLangButtons(){ const langTH = document.getElementById('langTH'); const langEN = document.getElementById('langEN'); if(langTH){ langTH.classList.toggle('active', lang==='th'); langTH.setAttribute('aria-pressed', String(lang==='th')); } if(langEN){ langEN.classList.toggle('active', lang==='en'); langEN.setAttribute('aria-pressed', String(lang==='en')); } }

  function setLang(newLang){
    if(!newLang) return;
    if(newLang !== 'en' && newLang !== 'th') return;
    if(newLang === lang) return; // nothing to do
    lang = newLang;
    save();
    // notify other tabs (BroadcastChannel preferred)
    try{ if(bc) bc.postMessage({type:'lang_change', lang:newLang}); }catch(e){}
    // fallback: write a signal into localStorage to trigger storage event in other tabs
    try{ localStorage.setItem('lang_signal', String(Date.now())); }catch(e){}
    // apply immediately on this tab (optional) then restart to fully re-init
    try{ applyI18n(); updateLangButtons(); }catch(e){}
    // restart the current page so all code paths re-run with the new language
    try{ setTimeout(()=>{ location.reload(); }, 50); }catch(e){}
  }

  function init(){ load(); applyI18n(); updateLangButtons(); // wire buttons if present
    const langTH = document.getElementById('langTH');
    const langEN = document.getElementById('langEN');
    if(langTH) langTH.addEventListener('click', ()=> setLang('th'));
    if(langEN) langEN.addEventListener('click', ()=> setLang('en'));
  }

  // storage event listener as a fallback for tabs that don't support BroadcastChannel
  window.addEventListener('storage', (e) => {
    try{
      if(!e) return;
      if(e.key === 'lang_signal'){
        // another tab signaled a language change — reload to pick up the new language
        const newLang = localStorage.getItem('lang') || 'en';
        if(newLang !== lang){ lang = newLang; save(); }
        try{ location.reload(); }catch(err){}
      }
    }catch(err){ console.warn('storage listener failed', err); }
  });

  window.Lang = {
    init,
    setLang,
    getLang: ()=> lang,
    t,
    applyI18n
  };

})(window);
