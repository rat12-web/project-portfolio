# Project Explorer · Atlas Control Center

**เว็บไซต์หลัก:** https://rat12-web.github.io/project-portfolio/

## 🆕 Explorer v2 — 15 ตุลาคม 2569

- **ภาพรวมโครงการ**: 8 กลุ่มงานหลัก; ROM2THAI แยก **เครื่องเกม → เกม → ขั้นตอนต่อไป**; Atlas ไม่แสดงปะปนกับโครงการผลิตงาน
- **GitHub Pages**: แยกเว็บไซต์ที่ใช้งานจริง 3 รายการออกจาก Source Repository: ROM2THAI Status, ThaiPatch Catalog และ Atlas Dashboard
- **Repository Explorer**: ซ่อน Archived เป็นค่าเริ่มต้น แต่เปิดกลับมาดูได้ด้วย Checkbox; ไม่ลบหรือเปลี่ยนสถานะ GitHub จริง
- **Project Atlas · Control Center**: เมนูบริหารเฉพาะ ไม่ใช่โครงการสร้างเกม/แพตช์
- **ROM2THAI** = ทีมงานสร้างแพตช์แปลไทยจริง (canonical source `thai-rom-cloud`)
- **ThaiPatch** = สารบัญเกมแปลไทยจากทีมต่าง ๆ พร้อมเครดิตแหล่งที่มา (`thaipatch`)
- **Responsive UI v2**: `assets/atlas-v2.css`, accessible navigation, cards แยกบทบาท, legacy details ยุบได้

อ่านโครงสร้างและข้อกำหนดฉบับละเอียดใน [docs/ATLAS_EXPLORER_V2.md](docs/ATLAS_EXPLORER_V2.md). ทดสอบเบราว์เซอร์บนเว็บที่ Deploy แล้วว่าครบ 8 กลุ่ม, 10 รายการเกม, หน้า Pages, ซ่อน/แสดง Archived และหน้า Atlas แยกสำเร็จ



ศูนย์ควบคุมโครงการทั้งหมดใน `rat12-web` พร้อมปุ่มไปยังเว็บที่ใช้งานจริง (หากมี), GitHub, Issues, Pull Requests, Actions, และ Workspace รายโครงการ


## 🆕 15 ตุลาคม 2569 — RetroThaiCraft / ThaiPatch Catalog

**ชื่อแสดงผลใน Portfolio เท่านั้น:** \`ROM2THAI\` → **RetroThaiCraft** (ผลิตแพตช์แปลไทย), \`ThaiPatch\` → **ThaiPatch Catalog** (รวบรวมแพตช์และเครดิตทีมแปล). Repository จริงยังเป็น \`thai-rom-cloud\` และ \`thaipatch\`; URL และชื่อ internal family ID ไม่เปลี่ยน เพื่อหลีกเลี่ยงการกระทบระบบเก่า

**ตรวจพบ Repository ใหม่ 2 รายการจากบัญชี rat12-web:** \`digimon-world-android\` (Private, Android ARM64 Alpha 5 ต้อง QA บนเครื่องจริง) และ \`exam-path-tracker\` (Public, GitHub Pages \`https://rat12-web.github.io/exam-path-tracker/\`). เพิ่ม Digimon เป็นโครงการหลักลำดับที่ 8 และเพิ่ม Exam Path Tracker ในกลุ่มงานสอบราชการเป็นงานย่อยของ Gov Exam

ปัจจุบันพบ Repository **15 รายการ** (Public 4 / Private 11), เก็บถาวร \`lufia2-thai\` แล้ว 1 รายการจึงซ่อนไว้จากค่าเริ่มต้น เหลือแสดง 14 ในรายการ Active หากดึงข้อมูลครบทุกตัว ดูบันทึกใน \`docs/PROJECT_DISCOVERY_2026-10-15.md\`.

## สถานะล่าสุด

- GitHub: 15 Repository ที่ตรวจพบ (4 Public / 11 Private), ตามรายการ Repository ID ที่ใช้ติดตามแม้มีการย้ายชื่อหรือย้าย Owner
- เว็บไซต์หลักที่เชื่อมจากหน้าการ์ด: [ROM2THAI Hub](https://rat12-web.github.io/rom2thai-hub-web/), [ThaiPatch](https://rat12-web.github.io/thaipatch/), [Project Atlas](https://rat12-web.github.io/project-portfolio/)
- เว็บไซต์ที่มีสิทธิ์เจ้าของ: TYPEBEATS M3 และ ThaiROM Studio Cloud (ตาม README ของแต่ละโปรเจกต์)
- โปรเจกต์ที่ไม่มีเว็บเปิดแยกจะมี Workspace บน Atlas เอง ไม่ได้ทำเว็บปลอมหรือเปิดเนื้อหาของ Private Repository สู่สาธารณะ
- ผลทดสอบผ่านเว็บเบราว์เซอร์ 2026-10-15: การ์ดครบทั้ง 13 ณ เวลาทดสอบเดิม (ปัจจุบันเพิ่มอีก 2), ปุ่มเว็บไซต์จริงของ ROM2THAI/ThaiPatch/TYPEBEATS ถูกต้อง, เปิด drawer, ลิงก์ Issues/PRs/Actions และฟอร์มยืนยันพักงานสำเร็จ **โดยไม่ได้กดบันทึกหรือเปลี่ยน Repository ใด**

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


## Project-family hierarchy (2026-10-15)

**Verified in the deployed browser:** 8 expandable project families / 15 GitHub repositories. The ROM2THAI family expands into console → game with 10 public-safe game status records: GBA 5, SNES 2, GB/GBC 1, PS1 1, and Homebrew 1. Project status loads from the [public sanitized ROM2THAI status mirror](https://github.com/rat12-web/rom2thai-hub-web/blob/main/site/status.json), with a dated static fallback in `config/workspaces.json`. Repo/project labels are friendly display aliases, **not physical GitHub repository renames**.

### Project families and role separation

| Main family | Canonical source | Related repositories / role |
| --- | --- | --- |
| ROM2THAI | `thai-rom-cloud` (private) | `rom2thai-hub-web` = public display-only mirror; `ThaiROM-Studio-Cloud` and `RetroThaiWorkbench` = legacy upstream requiring PR reconciliation; `lufia2-thai` = archived legacy |
| ThaiPatch · แปลไทยบอกด้วย | `thaipatch` (currently public app/source) | `plaethai-bokduay-content-hub` = private editorial and agent workspace |
| TYPEBEATS | `TYPEBEATS` (private) | Godot M3 game and owner-restricted demo |
| Gecko Offline | `Gecko-Offline` (private) | M0 / Android / offline sync work |
| Government Exam Monitor | `gov-exam-monitor` (private) | Announcement checking and alerting |
| Land Office Queue | `phangnga-live-queue` (private) | Queue/Admin, planned Live |
| Land Office HR | `phangnga-hr` (private) | HR app and protected data |
| Project Atlas | `project-portfolio` (currently public) | Control UI and synced public metadata |

### Archive completed

`rat12-web/lufia2-thai` was archived through GitHub Settings and independently verified as `archived=true`, `visibility=private` on 2026-10-15. Its README now redirects to `thai-rom-cloud/games/sfc/lufia2`. No game files were removed.

### Private-only migration limitation (not yet done)

GitHub's account billing UI was checked and shows **GitHub Free**. As of this audit, 10 repositories are Private and 3 sites/repositories stay Public: `thaipatch`, `rom2thai-hub-web`, `project-portfolio`. GitHub Free does **not** publish GitHub Pages from private repositories. Making those three private now would unpublish the live sites. They have deliberately **not** been converted yet; do not mark the request “all private” as complete.

To move *every source project* to Private without interrupting the live web experiences, either upgrade to GitHub Pro for private-source Pages (site contents may remain publicly accessible) or set up an authenticated independent host with a private GitHub connection and migrate the sites first. A separate public static deployment-only mirror is an alternative only if the owner accepts a public mirror. Truly restricted Pages site visibility requires eligible GitHub Enterprise arrangements, not just Pro.
