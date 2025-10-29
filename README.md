# Certificate Platform Demo | แพลตฟอร์มจัดการใบรับรอง

An interactive prototype that simulates the full journey of requesting, reviewing, and delivering digital certificates.  
ต้นแบบเชิงโต้ตอบที่จำลองทุกขั้นตอนของการขอ ตรวจสอบ และมอบใบรับรองแบบดิจิทัล

---

## 🔍 Overview | ภาพรวม

- Two coordinated dashboards: **User** (`main.html`) and **Admin** (`admin.html`)  
  แดชบอร์ดทำงานคู่กัน 2 ฝั่ง: **ผู้ใช้** (`main.html`) และ **ผู้ดูแล** (`admin.html`)
- All data lives in `localStorage` under the `requests` key and is shared between tabs.  
  ข้อมูลทั้งหมดเก็บใน `localStorage` คีย์ `requests` และแชร์ข้ามแท็บได้
- Built with vanilla HTML/CSS/JS plus a lightweight i18n layer (`javascripts/lang.js`).  
  ใช้ HTML/CSS/JS ล้วน พร้อมระบบ i18n แบบเบา (`javascripts/lang.js`)
- Includes bilingual copy (EN/TH) and accessible labelling for screen readers.  
  รองรับ 2 ภาษา (EN/TH) และมีป้ายกำกับเพื่อการเข้าถึง

---

## 🧑‍💻 User Dashboard Highlights | ฟีเจอร์ฝั่งผู้ใช้

| Feature | รายละเอียด |
| ------- | --------- |
| Project cards | แสดงข้อมูลหลัก, ความคืบหน้า, และชื่อผู้ใช้ที่ดึงจากส่วนโปรไฟล์ |
| Slip workflow | โครงการที่ต้องชำระเงินสามารถอัปโหลดสลิป, ตรวจสอบจำลอง OCR, และปลดล็อกการส่งคำขอ |
| Request buttons | โครงการฟรี (`P-1001`) อนุมัติอัตโนมัติครั้งแรก พร้อมป้องกันการกดซ้ำทุกโครงการ |
| Contact Support | ใช้สำหรับโครงการพิเศษ เช่น `P-2001` และบันทึกเหตุผล `contact_support` |
| Status cards | สร้างทันทีหลังส่งคำขอ, อัปเดตเมื่อผู้ดูแลเปลี่ยนสถานะ, ปุ่มดาวน์โหลด PDF สว่างเฉพาะสถานะ "Approved" |
| Auto-sync | ฟัง `storage` event และ `visibilitychange` เพื่อรีเฟรชเมื่ออีกแท็บมีการแก้ไข |

---

## 🛠 Admin Dashboard Highlights | ฟีเจอร์ฝั่งผู้ดูแล

- **Template column** with dropdown options:
  - `A Template`
  - `Super Learn Template`
  - `I wanna sleep Template`
- **Status management**  
  Single-row pills, widened column, bulk approve/reject/pending, delete with confirmation.
- **Filters & search**  
  กรองสถานะ, ประเภทโครงการ, เรียงชื่อ/วันที่ และค้นหาแบบ fuzz โดยรวม ID, ชื่อ, โปรเจกต์, วันที่, ความยาวชั่วโมง, ชื่อเทมเพลต
- **Selection helpers**  
  Checkbox ทีละรายการ, select-all, ใช้ร่วมกับปุ่ม bulk ทั้งหมด
- **Localisation ready**  
  ทุกปุ่มและ tooltip เชื่อมกับ `data-i18n` เพื่อให้ Lang module ปรับข้อความอัตโนมัติ

---

## 🔁 Request Lifecycle | วงจรคำขอใบรับรอง

1. **User action**  
   - เรียนครบ 100% → ปุ่ม `Request Certificate` พร้อม  
   - โครงการทั่วไปต้องผ่านขั้นตอนอัปโหลดสลิปก่อน  
   - โครงการพิเศษใช้ `Contact Support`
2. **Submission guard**  
   - ระบบตรวจสอบคำขอเก่าด้วย `projectId` และ `name` → กันการส่งซ้ำ (พร้อม toast `already_submitted`)
3. **Storage write**  
   - สร้าง/อัปเดตออบเจกต์คำขอ `{ id, name, project, projectId, date, length, status, template, reason }`
4. **Admin review**  
   - เปลี่ยนสถานะเป็น `Approved` / `Pending` / `Not Approved`, ปรับเทมเพลต, หรือลบรายการ
5. **Sync back to user**  
   - หน้าผู้ใช้รีเฟรช card → ปุ่มดาวน์โหลด `Test.pdf` สว่างเฉพาะเมื่อ `status === 'Approved'`
6. **Deletion handling**  
   - หากผู้ดูแลลบคำขอ → การ์ดสถานะฝั่งผู้ใช้หายไปในการรีเฟรชครั้งถัดไปโดยอัตโนมัติ

---

## 📁 Project Structure | โครงสร้างไฟล์

```
├── main.html               # User dashboard mock
├── admin.html              # Admin console mock
├── javascripts/
│   ├── user.js             # User-side logic, storage sync, guards
│   ├── admin.js            # Admin rendering, bulk actions, template select
│   └── lang.js             # Shared i18n + BroadcastChannel sync
├── Test.pdf                # Placeholder certificate for download button
└── README.md               # Current documentation
```

---

## 🚀 Getting Started | วิธีเปิดใช้งาน

1. Clone or download the repository.  
   โคลนหรือดาวน์โหลดโปรเจ็กต์
2. Open `main.html` in any modern browser.  
   เปิด `main.html` ด้วยเบราว์เซอร์สมัยใหม่
3. Use the **Admin Console** tab/button to jump to `admin.html`.  
   คลิกปุ่ม **Admin Console** เพื่อเปิด `admin.html`
4. Switch language with the 🇹🇭 / 🇬🇧 selectors.  
   เปลี่ยนภาษาได้ด้วยปุ่ม 🇹🇭 / 🇬🇧

> **Tip:** หากต้องการรีเซ็ตข้อมูล ทดสอบใหม่ทั้งหมด ให้ลบคีย์ `requests` และ `lang` จาก `localStorage` ของเบราว์เซอร์  
> **เคล็ดลับ:** Clear `requests` & `lang` from browser `localStorage` to reset the demo.

---

## 🧩 Internationalisation | ระบบหลายภาษา

- แปลข้อความผ่าน `data-i18n="<key>"` ใน HTML
- เพิ่มคำใหม่ที่ `javascripts/lang.js` ทั้งภาษาสากล (`en`) และภาษาไทย (`th`)
- ปุ่มภาษาเรียก `Lang.setLang('en' | 'th')` และใช้ BroadcastChannel แจ้งแท็บอื่น

ตัวอย่าง / Example:

```html
<span data-i18n="download_pdf">Download PDF</span>
```

```js
// lang.js
i18n.en.download_pdf = 'Download PDF';
i18n.th.download_pdf = 'ดาวน์โหลด PDF';
```

---

## 🧪 Testing Checklist | เช็กลิสต์ทดสอบ

- ✅ เปิด `main.html` → การ์ด `P-1001` สถานะ Approved ตั้งแต่แรก และปุ่มคำขอถูกปิด
- ✅ กด `Contact Support` ที่ `P-2001` → ปุ่มถูกปิด, สร้างการ์ดสถานะ Pending
- ✅ เปิด `admin.html` → รายการใหม่มี Template dropdown และ Status แสดงในบรรทัดเดียว
- ✅ เปลี่ยนสถานะเป็น `Approved` → กลับไปหน้า User ปุ่ม Download PDF สว่าง
- ✅ ลบคำขอจาก Admin → การ์ดสถานะฝั่งผู้ใช้หายหลังรีเฟรช/สลับแท็บ

---

## 📌 Notes & Ideas | หมายเหตุและแนวทางต่อยอด

- เชื่อมต่อกับจริงอาจย้ายจาก `localStorage` ไปยัง API/Backend
- สามารถต่อยอดด้วยระบบอัปโหลดไฟล์จริงและสั่งพิมพ์ PDF เฉพาะบุคคล
- เพิ่มบทบาทผู้ใช้หลายคนได้โดยผูกกับโปรไฟล์/อีเมลที่แตกต่างกัน

---

Happy hacking & ขอบคุณที่ลองใช้งาน! 🎉

