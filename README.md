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

## อัปเดต 15 ตุลาคม 2569 — ThaiROM Studio Online / Workbench Archive

- **ThaiROM Studio Online**: GitHub Repository เปลี่ยนชื่อจริงจาก `rat12-web/ThaiROM-Studio-Cloud` เป็น [`rat12-web/ThaiROM-Studio-Online`](https://github.com/rat12-web/ThaiROM-Studio-Online) (Private; repository ID `1413883614` คงเดิม) และยังเปิดให้พัฒนาต่อ ไม่ใช่ Archive
- **RetroThaiWorkbench**: Archive จริงบน GitHub แล้ว (Private, read-only, ID `1391725161`) โดย README ชี้ไปยัง `thai-rom-cloud` สำหรับการพัฒนางานแปล ROM ใหม่ และ PR #1 ยังไม่ได้ถูกรวม/ปิด
- Atlas เปลี่ยนชื่อและลิงก์ของทั้งสอง Repository ใน `config/project-control.json`, `config/workspaces.json`, `assets/app.js`, `assets/hierarchy.js` แล้ว
- ลิงก์หน้าเว็บทดสอบแบบ owner-private ของ Studio ที่เคยใช้อยู่ยังใช้ URL เดิม (`thairom-studio-cloud.rat-creative1.chatgpt.site`) เพราะการ Rename GitHub Repository ไม่ได้เปลี่ยนชื่อโฮสต์อื่นโดยอัตโนมัติ

## UI navigation update — 2026-10-15

Project Atlas now separates visible work by **delivery surface**, not by the type of product being built:

- **Home**: Two large selectable cards for **Web Apps** and **Development**.
- **Web Apps**: 4 published/public URLs (ROM translation status mirror, ThaiPatch catalog, Atlas dashboard, Exam Path Tracker), plus 2 clearly marked restricted/alpha preview URLs (ThaiROM Studio Online, TYPEBEATS). Links open the deployed experience first. A preview is *not* a production-ready application.
- **Development**: 7 project workspaces **without a verified published web app** — RetroThaiCraft ROM patch development, Digimon World Android, Gecko Offline, Gov Exam Monitor, Phangnga Live Queue, Land Office HR and ThaiPatch editorial/agent workspace. ROM work still expands **console → game → status/next task**.
- **Repository Explorer**: Source/deployment mirrors, private repositories and Archived items stay available for administration; Archived remains hidden by default.
- **Atlas Control**: Administrative tools remain separate.

The previous dedicated comparison banner `งานแปลเกม ≠ สารบัญเกมแปลไทย` has been removed from the user interface. The two projects and their legitimate code/status data remain unchanged.

Counts come from `config/workspaces.json`: `pages`, `web_apps` and `development`. New web app links should be added there with correct accessibility/preview labels; a URL is not proof that all features have completed QA. Changes were verified by an actual read-only browser test and GitHub Pages workflow [run 38694985243](https://github.com/rat12-web/project-portfolio/actions/runs/38694985243) succeeded.

## Status & ChatGPT Sites audit — 15 October 2026

The published Project Atlas now includes **ChatGPT Sites** in its Web Apps tab and a separate **สถานะงานค้าง** section.

### Web App sources and readiness

- **4 GitHub Pages URLs** remain published: ROM2THAI status mirror, ThaiPatch, Atlas, Exam Path Tracker.
- **1 additional ChatGPT Sites public URL** is verified: [Phangnga Job Profiles](https://phangnga-job-profiles.rat-creative1.chatgpt.site). Its public data was last updated August 2026 on the site: **marked as needing freshness review**. No linked GitHub repository has been verified.
- **2 restricted ChatGPT Sites preview URLs** remain: ThaiROM Studio Online and TYPEBEATS M3. Unauthenticated URL checks returned HTTP 401, **not** proof of a service outage or production readiness.
- **1 HR ChatGPT Sites owner-private record** has evidence in `phangnga-hr/README.md`, but **no currently verified URL**. The card deliberately has no invented opening link.

Web App records are in `config/workspaces.json`. Their `hosting`, `source_status`, `operational_status`, `access`, `audit_ref` and URLs are distinct; a Public URL is not the same as a production-complete product.

### Work status audit and evidence

- Source: `config/status-audit.json`. Published on Pages as `data/status-audit.json`; UI: `assets/audit.js`.
- Latest manual audit: **2026-10-15**, **22 records**: **5 blocked**, **7 pending**, **6 need evidence review**, **4 confirmed completed**. The unresolved total is **18**, not 22.
- Every record provides project, cause, next action, verification source/evidence URL, and date. Filters allow blockers, pending, review and verified-complete independently.
- A separate **actual GitHub name vs Atlas-only display name** view explicitly states that `ThaiROM-Studio-Online` was a **real repo rename**, `RetroThaiCraft` is a **display alias** over `thai-rom-cloud`, while `RetroThaiWorkbench` and `lufia2-thai` were **actually archived**.
- Examples of remaining blockers: GitHub Free private-source Pages; owner-private background sync needs secured authentication; Atlas destructive REST controls not yet owner-token E2E tested; old ChatGPT Sites subdomain remains; seven open ThaiROM Studio Draft PRs; six Gecko M0 open issues; game patch errors.
- The audit is a **curated evidence snapshot, not automatically confirmed fresh status**. GitHub REST Public repository sync and live game status are separate mechanisms; a successful GitHub Actions run does not automatically mean app/game QA passed.
- Never include personal employee data, secrets, private code, access tokens or private ROMs in this Public Pages audit.

Read-only live browser QA verified navigation, all ChatGPT Sites card labels, missing HR link, audited Web App notes and status/alias identity views on 2026-10-15. No GitHub repository mutations were performed during QA.

## Rename verified — RE2play Content Agent (15 Oct 2026)

- **Project display name:** แปลไทยบอกด้วย RE2Play
- **English project name:** RE2play Content Agent
- **Actual GitHub repository:** [rat12-web/RE2play-Content-Agent](https://github.com/rat12-web/RE2play-Content-Agent), changed from `rat12-web/plaethai-bokduay-content-hub` on 2026-10-15.
- **Verified** `repository_id = 1420142917`, `visibility = private`, `archived = false`, so this is a real GitHub rename, not merely an Atlas display alias.
- Updated `config/project-control.json`, `config/workspaces.json`, `config/status-audit.json`, `assets/app.js`, `assets/hierarchy.js`, and the source README.
- The separate ThaiPatch catalog (`rat12-web/thaipatch`) has **not** been renamed; no change to any Facebook/social page is implied or claimed.

## Homepage Auto Priority Board — 15 October 2026

The homepage contains an editable project board implemented in `assets/home.js`. It collects the project catalog from `config/project-control.json`, Web Apps and development groupings from `config/workspaces.json`, and GitHub repository metadata already retrieved by the existing authenticated/public API flow.

**Sorting:** pinned first within its status tier; high priority (1→5); optionally latest Push, status or alphabetical. **Paused always moves below other active work**, and Archived is hidden by default. Users can search, filter, view compact cards and reveal archived/paused items. The board does **not** claim recent GitHub commits mean a project is complete or code has passed QA.

**Automatic status precedence:** GitHub Archived / confirmed archived → browser manual override → saved workflow status → curated project status (live/blocked/paused/active/planning) → recent verified GitHub Push when project was only "planning" and "use activity signal" is turned on (14-day threshold). Inaccessible Private repository metadata never becomes guessed Push activity; missing recent commits never auto-pauses a project. Each card describes the source and reason for its status.

**Quick actions:** `Ⅱ พักงาน` / `▶ เริ่มต่อ`, pin/unpin. These default to **browser-local** state via localStorage and do NOT stop GitHub Actions, agents, Live, deployments or remote services. Users can edit display title, workflow status, priority (1-5), category, next task and pin. The inline modal gives two separate save options:
- **บันทึกในเบราว์เซอร์** — persists in this browser only, no login, no server mutation.
- **บันทึกบน GitHub** — an explicit owner-authorized REST PUT to `config/project-control.json` on `rat12-web/project-portfolio` after connecting a Fine-grained GitHub PAT with `Contents: write` for the Atlas repository. It updates data shared across devices after Pages Deploy, but **the edited fields are public**. Cloud-write success still requires a proper owner PAT and has not been end-to-end tested in the browser with owner's token.

There are also **Export settings** / **Import settings** buttons for browser-local preferences and a reset button. The import parser only accepts whitelisted project fields. No access token is stored in an exported JSON or localStorage. If a project is a ChatGPT Site not linked to a GitHub Repository, it can be customized locally but cannot be cloud-saved via this particular GitHub config.

**Verification:** JavaScript syntax checks passed. A read-only live browser test confirmed the homepage project board, searching/sorting controls, navigation isolation from Web Apps, and private/local controls. Pure status logic regression checks confirmed planning → local pause → resume, resume over a cloud pause, and archived precedence. The workflow also validates JavaScript syntax and expected UI markers before future deploys. Backend GitHub write commands remain opt-in and are not triggered by local actions.
