# Project Atlas — GitHub Portfolio

**Live dashboard:** https://rat12-web.github.io/project-portfolio/

ศูนย์รวม GitHub Projects ของ `rat12-web` รวม 13 Repository ที่ตรวจพบ ณ 15 ตุลาคม 2569:
- **3 Public:** `thaipatch`, `rom2thai-hub-web`, `project-portfolio`
- **10 Private:** `RetroThaiWorkbench`, `phangnga-live-queue`, `gov-exam-monitor`, `ThaiROM-Studio-Cloud`, `lufia2-thai`, `thai-rom-cloud`, `TYPEBEATS`, `phangnga-hr`, `Gecko-Offline`, `plaethai-bokduay-content-hub`

## การซิงค์ที่ใช้งานจริง

1. **ข้อมูล Public (GitHub Actions):** [workflow](.github/workflows/sync-public.yml) ดึง Repository ของบัญชีใน [config/owners.json](config/owners.json) ทุก **30 นาที** (นาทีที่ 17 และ 47 UTC) และเมื่อตั้งค่าถูกแก้ไข ถ้าสำเร็จจะอัปเดต [data/public_snapshot.json](data/public_snapshot.json). ใช้แค่ GitHub Actions และ Public REST API ไม่มี PAT และไม่ต้องเปิดคอมพิวเตอร์ค้างไว้
2. **เปิด Dashboard:** โปรแกรมดึงข้อมูล Public ล่าสุดจาก GitHub REST API ทุกครั้งที่เปิดเว็บ, ทุก **5 นาที** เมื่อแท็บยังเปิด และเมื่อกลับมาเปิดแท็บอีกครั้ง หาก API ไม่พร้อมจะใช้ข้อมูล Public Cache หรือรายการเริ่มต้นโดยระบุว่าไม่ใช่ Live
3. **Private Repository:** หน้าเว็บมีรายชื่อจากรายการตั้งต้น แต่ไม่ดึง Issue, PR, รายละเอียด, หรือข้อมูลการแก้ไข Private จนกว่าจะเชื่อม Fine-grained Personal Access Token (PAT) ด้วยสิทธิ์ **Read-only** และการเลือก Repository ที่อนุญาต ขณะเปิดโหมดนี้ เว็บตรวจ Repository ที่มีสิทธิ์ รวมถึง Repo ใหม่และการย้ายโดย GitHub repository ID ทุก 5 นาทีเมื่อแท็บเปิด **Token ถูกเก็บในหน่วยความจำแท็บเท่านั้น** ไม่ส่งเข้าฐานข้อมูลและไม่ commit
4. **บัญชีอื่น:** กด “เพิ่มบัญชี” ในหน้าเว็บ (จำ username ใน localStorage เฉพาะเบราว์เซอร์) หรือแก้ไฟล์ `config/owners.json` เพื่อให้ GitHub Actions จัดเก็บ Public Cache ของบัญชีเพิ่มเติมโดยอัตโนมัติ

**ข้อจำกัดที่ต้องทราบ:** GitHub Actions ของ public repository ไม่ได้มีสิทธิ์อ่าน private repository อื่นโดยอัตโนมัติ การติดตาม **Private ทั้งหมดแบบไม่มีผู้ใช้เปิดหน้าเว็บหรือให้ Token** ยังไม่ได้ตั้งค่า และไม่ควรเผยข้อมูลนั้นบน Pages สาธารณะ สถานะขั้นตอนพัฒนา/งานถัดไปใน Dashboard เป็นการคัดข้อมูลจาก README หรือเอกสารที่เคยตรวจเมื่อ 15 ตุลาคม 2569 ไม่ได้สรุปอัตโนมัติจากทุก commit; สิ่งที่ซิงค์จาก GitHub จริงคือชื่อ repo, owner, visibility, branch, activity และ Issue/PR (เมื่อมีสิทธิ์) เปอร์เซ็นต์ไม่ถูกคำนวณจากจำนวน Issues

> **ความเป็นส่วนตัว:** เพราะเว็บนี้เป็น GitHub Pages แบบ Public รายชื่อและคำอธิบายทั่วไปในไฟล์ `index.html` ย่อมเผยแพร่สู่ผู้เข้าชมได้ อย่าใส่ API key, ข้อมูลบุคลากร, รหัสผ่าน, ROM ต้นฉบับ หรือข้อมูลลับลงในไฟล์ Public รายละเอียดที่เป็น Private จะอ่านโดยตรงจาก GitHub ไปยังเบราว์เซอร์ที่ได้รับอนุญาตเท่านั้น

## ลิงก์ตรวจสอบระบบ

- [GitHub Actions: Sync public project catalog](https://github.com/rat12-web/project-portfolio/actions/workflows/sync-public.yml)
- [Public metadata cache](data/public_snapshot.json)
- [Script ที่ใช้ซิงค์](scripts/sync_public.py)
- [การตั้งค่า GitHub Pages](https://github.com/rat12-web/project-portfolio/settings/pages)

## ถ้าต้องการย้ายไป GitHub owner ใหม่

1. ย้าย Repository จากเมนู GitHub Settings ตามปกติ (GitHub repo ID เดิมจะคงอยู่เมื่อ transfer)
2. เพิ่ม owner ใหม่ใน Dashboard หรือไฟล์ config/owners.json
3. ระบบจะรวมรายการตาม **repo ID** เพื่อไม่แสดงซ้ำ
4. หาก repo ส่วนตัวถูกย้ายและไม่ได้ให้สิทธิ์ GitHub ระบบจะคงรายการเดิมพร้อมสถานะ “ยังไม่ยืนยัน Live” แทนการเดาข้อมูลใหม่

## สถานะการยืนยัน

- [x] ตรวจพบ 13 Repository ผ่าน GitHub connector
- [x] เพิ่มรายการครบ 13 ใน Dashboard รวม Project Atlas
- [x] เขียน workflow public-only / privacy assertions
- [x] เปิดการดึงข้อมูลซ้ำทุก 5 นาทีใน Dashboard
- [ ] ตรวจให้แน่ใจว่า workflow ตั้งเวลารันสำเร็จและ push snapshot ได้ (ดู Runs)
- [ ] เพิ่มวิธี private cloud sync สำหรับข้ามเบราว์เซอร์โดยไม่มี Token ในหน้าเว็บ (ต้องใช้สถาปัตยกรรมที่มี authentication)
