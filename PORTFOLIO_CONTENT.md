# Portfolio Content Plan for Ullas

Based on your projects, here's a detailed content structure.

---

## Hero / About Section

```
Ullas
Full-Stack Developer

Building modern web and mobile applications — from real-time dashboards
and project management tools to cross-platform mobile apps.

Available for work · GitHub · LinkedIn · Email
```

---

## Projects (Public)

### 1. Future Steel Dashboard (`ftrsteel_admin`)

**Title:** Enterprise Admin Dashboard
**Tagline:** Real-time workforce & operations management for a steel manufacturing company

**Description:**
> A full-featured internal admin dashboard built for a steel company to manage employee attendance, overtime, payroll reporting, and daily operations. Features real-time data updates, Excel export, and role-based access control.

**Features to highlight:**
- Attendance tracking: NR / OT / Sunday hours, medical leave, vacation
- Payroll-ready Excel export with complex business logic
- Employee management with status tracking (Present/Absent/Medical/Vacation)
- JWT auth with HttpOnly cookies
- Automated cron-based data refresh (node-cron)
- Image/document upload via Multer

**Tech Stack:**
`React` `Vite` `TypeScript` `Ant Design` `TanStack Query` `TanStack Router` `Tailwind CSS` `Zustand` `Zod` `React Hook Form` `Node.js` `Express` `TypeORM` `MySQL` `Redis` `ExcelJS` `JWT` `Bun`

---

### 2. Teeme (`teeme-original`)

**Title:** Project Management Platform — Jira Alternative
**Tagline:** A full-stack Jira-inspired project management system with a companion mobile app

**Description:**
> Teeme is a modern project management system featuring Kanban boards, team collaboration, email notifications, analytics, and an Expo mobile app — built with Next.js and Express.

**Features to highlight:**
- Kanban board with drag-and-drop (dnd-kit)
- OAuth authentication + multi-step onboarding
- Organization → Team → Project access hierarchy with role-based permissions
- Real-time global search scoped to active organization
- Portfolio analytics dashboard with Recharts (completion %, resource allocation, overloaded members)
- Issue update email notifications (Handlebars templates)
- Mobile swipe gestures for sidebar & tab navigation
- Cross-platform mobile app (Expo / React Native) — iOS & Android
- Timeline, List, Board, Planning, Settings views per project

**Tech Stack:**
`Next.js 16` `React` `TypeScript` `Tailwind CSS 4` `shadcn/ui` `Radix UI` `dnd-kit` `Recharts` `Phosphor Icons` `Expo` `React Native` `Bun` `Express.js` `Prisma` `PostgreSQL` `JWT`

---

## Skills Section

> Non-public projects are used as evidence for skills only — not mentioned by name publicly.

### Frontend

| Skill | Evidence (internal) |
|---|---|
| React / Next.js | teeme, ftrsteel, expense-tracker, pakyard |
| React Native / Expo | expense-tracker, teeme mobile |
| TypeScript | All projects |
| Tailwind CSS | teeme, ftrsteel, pakyard |
| TanStack Query / Router | ftrsteel, expense-tracker |
| Zustand | ftrsteel |
| Ant Design / shadcn/ui / Radix UI | ftrsteel, teeme, pakyard |
| Recharts | teeme analytics |
| Drag & Drop (dnd-kit) | teeme |

### Backend

| Skill | Evidence (internal) |
|---|---|
| Node.js / Express | teeme, ftrsteel, surewerx |
| Bun runtime | teeme, dock_management |
| TypeORM / Prisma | ftrsteel (TypeORM), teeme (Prisma) |
| MySQL / PostgreSQL | ftrsteel (MySQL), teeme (PostgreSQL) |
| Redis (ioredis) | ftrsteel |
| REST API design | All backend projects |
| JWT Authentication | teeme, ftrsteel |
| File uploads (Multer) | ftrsteel |
| Excel generation (ExcelJS) | ftrsteel |
| Email (Handlebars templates) | teeme |
| Cron jobs (node-cron) | ftrsteel |

### Other

| Skill | Evidence |
|---|---|
| Supabase | expense-tracker (Supabase Auth + DB) |
| Docker | dock_management (pakyard) |
| Godot (Game Dev) | flappy-bird |
| Git / GitHub | All projects |

---

## Skills Display (for the portfolio page)

**Languages:** JavaScript, TypeScript

**Frontend:** React, Next.js, React Native, Expo, Tailwind CSS, shadcn/ui, Ant Design, Radix UI, TanStack Query, TanStack Router, Zustand, Recharts, dnd-kit

**Backend:** Node.js, Bun, Express.js, Prisma, TypeORM, REST APIs

**Databases:** PostgreSQL, MySQL, Redis, Supabase

**Tools & Platforms:** Git, Docker, GitHub, Expo EAS, Supabase

**Bonus:** Godot (game dev, hobby)

---

## Note on Resume

`pdftotext` is not installed — run the following to extract your details (name, contact, experience, education) for the bio and about section:

```
brew install poppler
```

---

## Suggested Portfolio Sections Order

1. **Hero** — Name, title, brief bio, CTA buttons (GitHub, contact)
2. **Projects** — ftrsteel_admin + teeme-original (detailed cards)
3. **Skills** — Grouped tech badges
4. **About / Experience** — From resume (needs poppler)
5. **Contact** — Email / social links
