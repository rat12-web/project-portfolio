# Project Explorer · Information Architecture v2

Updated 2026-10-15. See [live dashboard](https://rat12-web.github.io/project-portfolio/).

## Primary views

| View | Purpose | Visibility / behavior |
| --- | --- | --- |
| ภาพรวมโครงการ | Seven production/workflow families with collapsible subprojects; ROM translation expands **console → game** | Atlas and GitHub Pages deployment mirrors excluded |
| เว็บไซต์ GitHub Pages | Published websites only: ROM2THAI Status, ThaiPatch Catalog, Atlas Dashboard | Explicitly separates website deployment from canonical source |
| Repository ทั้งหมด | Raw repository list and GitHub actions | Archived repos **hidden by default**, manual opt-in toggle |
| งานค้าง | Blocked/paused queue | Archived repos excluded |
| Project Atlas · Control Center | Repo management, GitHub Actions, issues and configuration | Administrative tool, not counted as a development project |

## Naming and ownership contract

- **ROM2THAI · พัฒนาแพตช์ภาษาไทย**: translation engineering, Thai font, insertion, ROM patch builds, emulator evidence. Canonical/private GitHub repository: \`rat12-web/thai-rom-cloud\`.
- **ThaiPatch · สารบัญเกมแปลไทย**: read-only catalog of community patches with source citations and original translation-team credits. Source/public site: \`rat12-web/thaipatch\`.
- \`rom2thai-hub-web\`: public status mirror **only**, not canonical translation source.
- \`plaethai-bokduay-content-hub\`: private editorial, content reference and agent instructions. **Not** the ThaiPatch website.
- \`project-portfolio\`: GitHub Pages source for Project Atlas administrative overview.

## UX behavior

- Clicking production and catalog pathways jumps to the corresponding expanded family / live catalog.
- Main families expose nested modules; retro ROM tasks expose console → games with live sanitized status and fallback snapshot.
- Archived repository \`lufia2-thai\` remains preserved on GitHub but hidden in default views; it can be revealed from Repository Explorer.
- Legacy upstream is behind an extra expansion layer inside ROM2THAI rather than a main navigation card.
- The main cards never report unsupported percent completion.

## Implementation

- \`index.html\` — view skeleton with sidebar navigation and distinct pathways.
- \`assets/style.css\` — prior baseline component library.
- \`assets/atlas-v2.css\` — responsive typography, spacing, cards, navigation and role-based colors.
- \`assets/app.js\` — authenticated GitHub interactions and repository archive filter.
- \`assets/hierarchy.js\` — render families, nested game consoles, Pages directory and live status.
- \`config/workspaces.json\` — information architecture, family/project relationships and explicit Pages metadata.
- \`config/project-control.json\` — public-safe labels, status and role metadata.

## Security and deployment

The site is public. Never put credentials, sensitive office HR data or private source code in the sanitized Pages artifacts. Admin operations require user-supplied fine-grained GitHub PAT in the browser and confirmation. GitHub Pages deployment copies \`assets/atlas-v2.css\` explicitly.

Do not rename, move, archive or change visibility of physical GitHub repositories just because UI aliases change. The archived repository remains archived and can be recovered from GitHub.
