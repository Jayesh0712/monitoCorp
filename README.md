# MonitoCorp – SRE Monitoring Dashboard

A real-time dashboard for Site-Reliability Engineers to observe the health of micro-services, inspect live logs/events and react quickly to incidents.

The project is built with **Next.js 15 App-Router + TypeScript** and embraces modern, type-safe patterns throughout the stack.  
Below you will find everything reviewers need to understand the architecture, run the code locally and evaluate the solution against the rubric.

## Architecture Overview

### 1. State-Management Strategy

| Concern | Library / Technique | Notes |
|---------|--------------------|-------|
| **Server State** – data that originates from the backend (services, events, auth) | [`@tanstack/react-query` v5](https://tanstack.com/query/latest) | Handles fetching, caching, background re-validation and optimistic updates. Query keys are scoped (`['services']`, `['events', page]`, …) for granular invalidation. |
| **Client/UI State** – ephemeral UI concerns (drawer open, form inputs, selected row) | Local `useState` / `useReducer` inside components | Keeps the bundle slim; nothing is global that doesn’t have to be. |
| **Global, Cross-Cutting State** (only *user* object after login) | React Context (`<QueryClientProvider>` doubles as auth provider) | Persisted to `localStorage` for session restore. |

#### Live data requirements
* `EventsSidebar` polls `/api/events` every **5s** (`refetchInterval`) and displays new items instantly.
* `CrashReportGraph` re-uses the same cache slice; React-Query’s **staleTime** prevents double requests while guaranteeing freshness.
* Mutations (`create / update / delete service`) optimistically update the cache → UI feels instantaneous; rollback on error is automatic.
* Network failure, loading and empty states are surfaced with Ant-Design components (`Spin`, `Alert`).

> In production the polling would be swapped for Server-Sent Events or WebSockets; the abstraction lives behind *React-Query* so the rest of the app would remain unchanged.

### 2. Data-Fetching Flow
```
Component  ──▶ useQuery / useMutation ──▶ lib/api.ts (fetch wrapper) ──▶ /api/* route (MSW in dev, real API in prod)
```
*API layer is purposely thin – just enough to keep fetch logic independent from UI.*

### 3. Application Workflow & Internal Mechanics

```
┌───────────────┐     login()            ┌───────────────┐
│ LoginForm.tsx ├──────────────►        │  /api/login   │
└───────┬───────┘                       └───────────────┘
        │  ⬇ stores user token                        ▲
        │                                              │ MSW mocks request
┌───────▼────────┐  useQuery(['services'])             │ with seed data
│ DashboardPage  ├─────────────────────────────────────┘
└─────┬──────────┘
      │  ⬇ optimistic update               periodic poll (5s)
┌─────▼──────────┐  useMutation(update)    ┌────────────────┐
│ ServiceTable   ├────────────────────────►│  /api/services │
└────────┬───────┘                         └────────┬───────┘
         │  ⬇ push notif                               │ MSW mutates in-memory
┌────────▼────────┐  useQuery(['events'])              │ arrays + localStorage
│ EventsSidebar   ├────────────────────────────────────┘
└─────────────────┘
```

* **Login Flow** – credentials hit `/api/login`; on success the user object is cached locally & in React Query's cache. All protected routes (everything except `/login`) are rendered inside `MainLayout` which checks for `user` in `localStorage`.
* **Service Lifecycle** – create/update/delete operations mutate React Query cache first (optimistic) then await server confirmation. MSW handler mimics latency (300-500 ms) and persists extra services to `localStorage` so refreshes keep state.
* **Event Simulation** – `startEventSimulation()` in `mocks/data.ts` emits pseudo-random crash events every 2-4 s per service. These are stored in `localStorage.events`; the `/api/events` handler slices & paginates them. This gives a believable "live log" experience without a backend.

### 4. Component Hierarchy (excerpt)
```
MainLayout
 ├─ SideNav            (navigation & branding)
 ├─ TopNav             (search, profile)
 ├─ <Outlet>           (Next.js route content)
 │   ├─ DashboardPage
 │   │   ├─ ServiceTable (table + filters + actions)
 │   │   └─ CrashReportGraph (Recharts line graph)
 │   └─ ServiceDetailPage
 │       ├─ HealthCards   (latency, uptime...)
 │       └─ IncidentTimeline
 └─ EventsSidebar      (live logs & mini-chart)
```
Each atomic component is fully presentational; data arrives via props or hooks residing one layer above.

### 5. Error Handling & Resilience
* **Global Error Boundary** in `layout.tsx` captures rendering errors and shows a fallback UI.
* API errors are surfaced inline (`Alert`), while stale cached data remains visible to avoid layout shift.
* All fetches have timeouts (via AbortController) to prevent hung requests.

---

---

## 🎨 UI / UX Design
1. **Atomic Design** folder structure (`Atomic ▸ Molecular ▸ Organisms ▸ Layout`)
2. **Ant-Design 5** provides accessible components & consistent design language.
3. **TailwindCSS 4** handles micro-layout and spacing → pixel-perfect control without bespoke CSS files.
4. Clean typography, generous white-space and subtle gradients/shadows create a professional feel.
5. Responsive – flexbox/grid ensure the dashboard works from 1280 px down to tablets.
6. **Micro-interactions**:   
   • Hover & active states on sidebar items  
   • Smooth skeletons/spinners while data loads  
   • Toasts on mutations (notifs handled by AntD message)

---

## 🧑‍💻 Code Quality & Organisation
* **Type-Safety**: the entire codebase is TypeScript; strict mode enabled in `tsconfig.json`.
* **File Structure** (top-level):
```
src/
  app/            Next.js 15 App-Router routes (server & client components)
  components/
    Atomic/       Stateless UI primitives (ButtonIcon, Card, …)
    Molecular/    Composed widgets (ServiceTable, ServiceForm, …)
    Organisms/    Feature-rich units (CrashReportGraph, LiveEvents, …)
    Layout/       SideNav, TopNav, MainLayout
  lib/            api.ts fetch helpers, query client
  mocks/          MSW handlers + seed data (dev-only)
  types/          Shared TypeScript types
```
* **ESLint 9 + Next.js config** – commits cannot introduce lint errors.
* **React-19 features**:   
  • `use` hook + async Server Components where appropriate  
  • `useEffect` kept to a minimum.
* **Separation of Concerns**: business logic lives beside UI but in isolated hooks; layouts never fetch data directly.

---

## 📝 Getting Started Locally

### Prerequisites
* Node ≥ 20 (LTS)
* pnpm / npm / yarn (any works)

### Install & Run
```bash
# 1. Install deps
yarn install          # or pnpm install / npm ci

# 2. Start the dev server (with Turbopack + MSW)
yarn dev              # http://localhost:3000

# 3. Build for production
yarn build            # output in .next/
# Serve the build
yarn start
```
During *development* Mock-Service-Worker intercepts `/api/*` allowing you to test without a backend. In *production* simply remove MSW and point the fetch URLs to your real API.


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

> The dashboard boots at [http://localhost:3000](http://localhost:3000).  
> Default credentials (dev-only): **Admin / Admin123**


### Environment Variables
```
# .env (example)
NODE_ENV='development'
```
Only one public variable is required because MSW overrides it locally.


### Available Scripts
| Script | Description |
|--------|-------------|
| `dev`   | Run Next.js with Turbopack + MSW |
| `build` | Production build |
| `start` | Run the compiled app |
| `lint`  | ESLint in strict-mode |

---

## 🛠️ Tooling & Libraries – Why These?
* **Next.js 15** – SSR/ISR, file-based routing, Edge runtime ready.
* **React Query v5** – battle-tested server-state solution, zero-config caching, mutation handling.
* **Ant Design 5** – mature component library with theme tokens and accessibility.
* **TailwindCSS 4** – utility-first styling; pairs well with AntD when using the new CSS variables API.
* **MSW** – realistic API mocking that works in the browser & Jest.
* **Recharts 3** – composable charts for the crash graph.
* **Lucide Icons / Ant Icons** – crisp SVG icons.

---

## ✅ Future Improvements
1. Replace polling with WebSocket channel for events.
2. Role-based auth guard & JWT refresh flow.
3. E2E tests with Playwright; unit tests with Vitest + React Testing Library.
4. Dark-mode design tokens.

---


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
