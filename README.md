# Project Atlas Control Center

**เว็บไซต์หลัก:** https://rat12-web.github.io/project-portfolio/

ศูนย์ควบคุมโครงการทั้งหมดใน `rat12-web` พร้อมปุ่มไปยังเว็บที่ใช้งานจริง (หากมี), GitHub, Issues, Pull Requests, Actions, และ Workspace รายโครงการ

## สถานะล่าสุด

- GitHub: 13 Repository ที่ตรวจพบ (3 Public / 10 Private), ตามรายการ Repository ID ที่ใช้ติดตามแม้มีการย้ายชื่อหรือย้าย Owner
- เว็บไซต์หลักที่เชื่อมจากหน้าการ์ด: [ROM2THAI Hub](https://rat12-web.github.io/rom2thai-hub-web/), [ThaiPatch](https://rat12-web.github.io/thaipatch/), [Project Atlas](https://rat12-web.github.io/project-portfolio/)
- เว็บไซต์ที่มีสิทธิ์เจ้าของ: TYPEBEATS M3 และ ThaiROM Studio Cloud (ตาม README ของแต่ละโปรเจกต์)
- โปรเจกต์ที่ไม่มีเว็บเปิดแยกจะมี Workspace บน Atlas เอง ไม่ได้ทำเว็บปลอมหรือเปิดเนื้อหาของ Private Repository สู่สาธารณะ
- ผลทดสอบผ่านเว็บเบราว์เซอร์ 2026-10-15: การ์ดครบทั้ง 13, ปุ่มเว็บไซต์จริงของ ROM2THAI/ThaiPatch/TYPEBEATS ถูกต้อง, เปิด drawer, ลิงก์ Issues/PRs/Actions และฟอร์มยืนยันพักงานสำเร็จ **โดยไม่ได้กดบันทึกหรือเปลี่ยน Repository ใด**

## โครงสร้าง

- `index.html` — shell ของ Dashboard
- `assets/style.css` — UI แบบ Dark Navy / responsive
- `assets/app.js` — ดึง GitHub API, แสดง workspace, ควบคุมการแก้ไข
- `config/project-control.json` — ชื่อ/หมวด/สถานะเชิงบริหาร/ลิงก์หน้าเว็บที่ตั้งใจเผยแพร่ (ไม่ใส่ข้อมูลลับ)
- `config/owners.json` — บัญชีเจ้าของสำหรับ Public sync
- `data/public_snapshot.json` — GitHub Actions ดึงข้อมูล Public
- `.github/workflows/deploy-pages.yml` — ส่งออกเฉพาะไฟล์ public-safe ไป Pages
- `.github/workflows/sync-public.yml` — ดึง repo Public ทุก 30 นาที

## การควบคุมผ่าน UI

เปิดการ์ด → **จัดการ** → เชื่อม GitHub ด้วย Fine-grained PAT ผ่านหน้าเว็บ

| ปุ่ม | สิ่งที่เกิดจริง | สิทธิ์ GitHub |
| --- | --- | --- |
| พักงาน / ดำเนินงานต่อ | PUT อัปเดต `config/project-control.json` ใน `project-portfolio` พร้อม commit; เมื่อ Deploy เสร็จทุกคนเห็นสถานะใหม่ | Contents: write ของ `project-portfolio` |
| เปลี่ยนลิงก์หลัก | PUT อัปเดตลิงก์/ชื่อปุ่มใน `project-control.json` พร้อม commit | Contents: write ของ `project-portfolio` |
| เก็บถาวร / คืนสถานะ | PATCH `/repos/{owner}/{repo}` ด้วย `archived=true/false` เพื่อ Archive จริง | Administration: write ที่ Repository เป้าหมาย |
| ย้าย Repository | POST `/repos/{owner}/{repo}/transfer` แล้วตรวจ `202 Accepted` ซึ่งหมายถึงรับคำขอ มิใช่ย้ายเสร็จแล้ว; ผู้รับอาจต้องยอมรับ | Administration: write ที่ Repository เป้าหมาย |
| เปิดเว็บจริง | เปิด URL HTTPS ที่ยืนยันจากเอกสารโครงการ | ไม่ต้อง Token หากเว็บเป็น Public |

**ความสำคัญ:** การพักงานใน Atlas **ไม่หยุด** GitHub Actions, Live Stream, เซิร์ฟเวอร์, Agent หรือ CI ของโปรเจกต์อื่น. การ Archive บน GitHub ทำให้ Repository อ่านอย่างเดียว แต่ไม่ได้รับประกันว่าระบบที่ Deploy หรือเซิร์ฟเวอร์ภายนอกหยุดด้วย

การเปลี่ยนสถานะและลิงก์บน GitHub ทำงานเป็น API call และ commit จริงเมื่อผู้ใช้ยืนยัน และแสดง error เมื่อไม่มีสิทธิ์ **การเขียน/Archive/Transfer ยังไม่ได้ทดสอบแบบ end-to-end กับ Token เจ้าของ** เพราะไม่สร้าง/เก็บ Token แทนผู้ใช้และไม่ดำเนินการกับ Repository ใดโดยไม่ได้เลือกและยืนยัน

### ความปลอดภัย

- Fine-grained PAT ใส่ในหน้าเว็บเท่านั้น ไม่ส่งผ่านแชต ไม่ hardcode ลง Source
- Token อยู่เฉพาะหน่วยความจำ JavaScript ในแท็บ ไม่บันทึกใน Local Storage หรือ Repository
- เบราว์เซอร์ส่ง Token ไปที่ `api.github.com` ผ่าน HTTPS เท่านั้น
- ควรเลือกเฉพาะ Repository ที่จะจัดการและสิทธิ์ขั้นต่ำสำหรับแต่ละงาน
- การใช้ PAT ที่มี Administration: write มีความเสี่ยงสูงกว่า Read-only; ใช้เมื่อจำเป็นและจำกัดวันหมดอายุ
- `project-control.json` และรายชื่อ Private 10 รายการที่ระบุในหน้าเว็บเป็น **ข้อมูลสาธารณะ** ไม่ใส่รายละเอียดส่วนบุคคล ข้อมูลภายในหน่วยงานหรือ URL ที่มีโทเคน
- GitHub Pages เป็นเว็บ static: ไม่มีเซิร์ฟเวอร์ API ที่เก็บ Token ลับ; จึงไม่ได้ทำให้เจ้าของเข้าใช้งานผ่าน ChatGPT/GitHub OAuth โดยอัตโนมัติ

### ซิงค์อัตโนมัติ

**Public:** GitHub Actions ตรวจรายชื่อ/metadata Public ทุก 30 นาที; หน้าเว็บดึง GitHub ทุกครั้งที่เปิดและทุก 5 นาทีที่แท็บเปิด, การเปลี่ยนสถานะ/ลิงก์ใน GitHub จะ Trigger การ Deploy.

**Private:** ข้อมูล Private แบบสดต้องเชื่อม Token ที่มีสิทธิ์อ่านบนแท็บ (ข้อมูลจริงไม่ Export สู่ Pages), หรือเพิ่ม backend พร้อม authentication เป็นงานขั้นถัดไป

**ย้ายชื่อหรือ Owner:** Repository ID ใช้ตรวจว่ากำลังตาม Repository เดิม ไม่ใช่เดาจากชื่อ หากไม่มีสิทธิ์อ่านหลังย้าย หน้าเว็บจะแสดงรายการเดิมเป็น Catalog จนกว่าจะเชื่อมสิทธิ์ใหม่

## ตรวจสอบ

- [Workflow: Deploy Project Atlas Pages](https://github.com/rat12-web/project-portfolio/actions/workflows/deploy-pages.yml)
- [Workflow: Sync public project catalog](https://github.com/rat12-web/project-portfolio/actions/workflows/sync-public.yml)
- [GitHub Actions Runs](https://github.com/rat12-web/project-portfolio/actions)

