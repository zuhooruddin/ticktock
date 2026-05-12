# Ticktock — Timesheet Management App

A SaaS-style Timesheet Management application built for the Tentwenty Frontend Developer Technical Assessment.



### 1. Clone and install

```bash
git clone https://github.com/zuhooruddin/ticktock.git
cd ticktock
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=K9#mP2$vX7@nQ4&wR8!jL5*hT3^cY6+dF1
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Login credentials (demo)

| Field    | Value                  |
|----------|------------------------|
| Email    | john@tentwenty.com      |
| Password | tentwenty@2026               |

---

## Frameworks & Libraries

| Tool              | Purpose                              |
|-------------------|--------------------------------------|
| **Next.js 15**    | React framework, App Router          |
| **TypeScript**    | Type safety throughout               |
| **Tailwind CSS**  | Utility-first styling                |
| **NextAuth.js v4**| Authentication (JWT + Credentials)   |
| **Jest**          | Unit testing                         |
| **Testing Library**| Component tests                     |

---

## Project Structure

```
ticktock/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── timesheets/           # GET paginated list
│   │   │   └── [id]/entries/     # POST create entry
│   │   └── entries/[id]/         # PUT update, DELETE remove
│   ├── (auth)/login/             # Login page (public)
│   └── (dashboard)/
│       ├── layout.tsx            # Auth-protected layout + Navbar
│       └── timesheets/
│           ├── page.tsx          # Timesheets list
│           └── [id]/page.tsx     # Week detail view
├── components/
│   ├── layout/Navbar.tsx
│   ├── timesheets/
│   │   ├── TimesheetTable.tsx
│   │   ├── TimesheetFilters.tsx
│   │   ├── WeekDetail.tsx        # Client component; manages entry state
│   │   └── EntryModal.tsx        # Add / Edit modal with validation
│   └── ui/
│       ├── Badge.tsx             # Status badge
│       ├── Modal.tsx             # Generic modal shell
│       └── Spinner.tsx
├── lib/
│   ├── auth.ts                   # NextAuth config (CredentialsProvider)
│   ├── mock-data.ts              # In-memory mock data for 99 weeks
│   └── api-client.ts             # Client-side fetch helpers (→ /api/*)
└── types/
    ├── index.ts                  # Domain types
    └── next-auth.d.ts            # Session type extensions
```

---

## Architecture & Key Decisions

### All API calls go through internal routes
Client components never import from `lib/mock-data` directly. They call
`/api/timesheets`, `/api/timesheets/[id]`, etc. via the helpers in
`lib/api-client.ts`. This tests the full API integration path and
keeps concerns separated.

### Auth
NextAuth `CredentialsProvider` validates against the mock user list and
issues a JWT stored in a secure HTTP-only cookie. The `middleware.ts`
protects all `/timesheets/*` routes automatically.

### Server vs Client components
- **Pages** (`/timesheets`, `/timesheets/[id]`) are server components — they
  fetch data on the server and pass it down as props.
- **Interactive pieces** (WeekDetail, EntryModal, TimesheetFilters, Navbar)
  are client components (`'use client'`).

### State management
Local React state via `useState` / `useCallback`. No external state library
is needed given the scope — any dev can read and follow the data flow immediately.

---

## Running Tests

```bash
npm run test        # interactive watch mode
npm run test:ci     # single run (CI)
```

Tests cover:
- `TimesheetTable` — renders rows, badges, action labels, click callback
- `Badge` — all three statuses render correct text and Tailwind classes

---


---

## Time Spent

| Task                               | Time     |
|------------------------------------|----------|
| Project setup & config             | 20 min   |
| Auth (NextAuth + middleware)       | 30 min   |
| Mock data & API routes             | 30 min   |
| Login screen                       | 25 min   |
| Timesheets list + pagination       | 45 min   |
| Week detail + entry CRUD           | 50 min   |
| Add/Edit modal + validation        | 30 min   |
| Tests                              | 20 min   |
| README + polish                    | 20 min   |
| **Total**                          | **~4 hrs** |

---

## Assumptions & Notes

- Mock data is kept **server-side only** (in `lib/mock-data.ts`) and served
  via API routes — per the assessment spec.
- Entry mutations (add / edit / delete) are **optimistic UI** — the local
  state updates immediately while the API request runs in the background.
  A real backend would replace the mock with a database.
- The **Date Range filter** UI is present but not wired to real filtering,
  as no date-range data structure was specified in the assessment.


