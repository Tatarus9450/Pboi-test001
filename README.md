# Certificate Platform | แพลตฟอร์มใบรับรอง 🎓

A web-based certificate management platform with User and Admin dashboards.  
เว็บแพลตฟอร์มสำหรับจัดการใบรับรอง พร้อมหน้าจอสำหรับผู้ใช้และผู้ดูแลระบบ

## Features | คุณสมบัติ

### User Dashboard | หน้าจอผู้ใช้ 👤
- View all available projects | ดูโครงการทั้งหมดที่มี
- Request certificates for completed projects | ขอใบรับรองสำหรับโครงการที่เรียนจบ
- Upload payment slips | อัปโหลดสลิปการชำระเงิน
- Contact support for special projects | ติดต่อเจ้าหน้าที่สำหรับโครงการพิเศษ
- Track certificate request status | ติดตามสถานะการขอใบรับรอง

### Admin Dashboard | หน้าจอผู้ดูแล 👨‍💼
- View all certificate requests | ดูคำขอใบรับรองทั้งหมด
- Filter by status and project type | กรองตามสถานะและประเภทโครงการ
- Search by name, ID, date, or length | ค้นหาตามชื่อ, รหัส, วันที่ หรือระยะเวลา
- Bulk approve/reject requests | อนุมัติ/ไม่อนุมัติคำขอแบบหลายรายการ
- Set all requests to pending status | ตั้งค่าทุกคำขอเป็นสถานะรอดำเนินการ

## Project Structure | โครงสร้างโปรเจค

\`\`\`
├── main.html           # User Dashboard | หน้าจอผู้ใช้
├── admin.html          # Admin Dashboard | หน้าจอผู้ดูแล
├── javascripts/
│   ├── user.js        # User Dashboard logic | ตรรกะหน้าจอผู้ใช้
│   └── admin.js       # Admin Dashboard logic | ตรรกะหน้าจอผู้ดูแล
└── README.md          # This file | ไฟล์นี้
\`\`\`

## Getting Started | เริ่มต้นใช้งาน

1. Open \`main.html\` in a web browser | เปิดไฟล์ \`main.html\` ในเว็บเบราว์เซอร์
2. To access admin features, click "Admin Console" | หากต้องการใช้งานฟีเจอร์ผู้ดูแล คลิก "คอนโซลผู้ดูแล"
3. Switch language using 🇹🇭/🇬🇧 buttons | เปลี่ยนภาษาโดยใช้ปุ่ม 🇹🇭/🇬🇧

## Features Documentation | เอกสารคุณสมบัติ

### Certificate Request Process | ขั้นตอนการขอใบรับรอง
1. Complete a project (100%) | เรียนโครงการให้จบ (100%)
2. For paid courses, upload payment slip | สำหรับคอร์สที่มีค่าใช้จ่าย อัปโหลดสลิปการชำระเงิน
3. Click "Request Certificate" | คลิก "ขอใบรับรอง"
4. Track status in your dashboard | ติดตามสถานะในหน้าจอของคุณ

### Special Projects | โครงการพิเศษ
- Use "Contact Support" for special projects | ใช้ "ติดต่อเจ้าหน้าที่" สำหรับโครงการพิเศษ
- Admin will receive your request automatically | ผู้ดูแลจะได้รับคำขอของคุณโดยอัตโนมัติ

### Admin Features | ฟีเจอร์ผู้ดูแล
- **Filters** | **ตัวกรอง**
  - Status: All, Pending, Approved, Not Approved | สถานะ: ทั้งหมด, รอตรวจสอบ, อนุมัติแล้ว, ไม่อนุมัติ
  - Type: All, Free, General, Special | ประเภท: ทั้งหมด, ฟรี, ทั่วไป, พิเศษ
- **Search** | **ค้นหา**
  - Supports partial text match | รองรับการค้นหาข้อความบางส่วน
  - Can search by length (e.g., "20h") | สามารถค้นหาด้วยระยะเวลา (เช่น "20h")
  - Can search by date (YYYY-MM-DD) | สามารถค้นหาด้วยวันที่ (ปปปป-ดด-วว)
- **Bulk Actions** | **การทำงานแบบหลายรายการ**
  - Select multiple requests | เลือกหลายคำขอ
  - Approve/reject in bulk | อนุมัติ/ไม่อนุมัติพร้อมกัน
  - Set all to pending status | ตั้งค่าทั้งหมดเป็นสถานะรอดำเนินการ

## Technical Notes | หมายเหตุทางเทคนิค

- Uses browser localStorage for data persistence | ใช้ localStorage ของเบราว์เซอร์ในการเก็บข้อมูล
- Supports Thai/English language switching | รองรับการสลับภาษาไทย/อังกฤษ
- Responsive design for all screen sizes | ออกแบบให้รองรับทุกขนาดหน้าจอ
- ARIA labels for accessibility | มีป้าย ARIA สำหรับการเข้าถึง

## Development | การพัฒนา

To modify the platform: | วิธีแก้ไขแพลตฟอร์ม:

1. Edit \`user.js\`/\`admin.js\` for logic changes | แก้ไขตรรกะที่ \`user.js\`/\`admin.js\`
2. Edit HTML files for layout changes | แก้ไขเลย์เอาต์ที่ไฟล์ HTML
3. Add new i18n keys for new text | เพิ่มคีย์ i18n สำหรับข้อความใหม่

### i18n Keys | คีย์ภาษา
Add new texts to both \`en\` and \`th\` objects: | เพิ่มข้อความใหม่ที่ออบเจกต์ \`en\` และ \`th\`:

\`\`\`javascript
const i18n = {
  en: { your_key: "English text" },
  th: { your_key: "ข้อความภาษาไทย" }
};
\`\`\`

Then use with \`data-i18n\` attribute: | จากนั้นใช้กับ attribute \`data-i18n\`:

\`\`\`html
<span data-i18n="your_key">English text</span>
\`\`\`
