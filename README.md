# SkillLink

Frontend for SkillLink, a freelancing marketplace that connects clients with
freelancers/students. Built with Vue 3, Vue Router, Vite, and Tailwind CSS.

> **New to the codebase?** Start with
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — a junior-friendly tour of the
> folder layout, how screens talk to the backend, auth, and the shared helpers.

## Getting started

```bash
npm install
cp .env.example .env   # optional: point the app at a local backend
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├─ main.js              # app entry (router + Tailwind)
├─ App.vue              # root component + global chatbot + toast host
├─ router/index.js      # routes + auth guards
├─ composables/         # reusable logic shared across components
│  ├─ useAuth.js          # session state: login / register / logout
│  ├─ useAsync.js         # loading/error wrapper for API calls
│  ├─ useToast.js         # app-wide pop-up messages (use instead of alert())
│  └─ useNotifications.js # shared state for the navbar notification bell
├─ services/api.js       # axios instance + grouped API calls (one place for URLs)
├─ styles/index.css      # Tailwind layers + shared component classes
├─ components/           # reusable UI (Navbar, ClientNavbar, Chatbot, ToastHost)
└─ views/                # routed pages (student, client, and auth screens)
public/assets/           # images, served at /assets/...
docs/                    # ARCHITECTURE.md, DEMO_GAPS.md, openapi.json snapshot
```

## Backend

By default the app talks to the deployed server `https://skilllinkapi.ddns.net`.
To run against a local API, set `VITE_API_BASE_URL` in a `.env` file (see
`.env.example`):

```ini
VITE_API_BASE_URL=http://localhost:3003
```

Account `type` is `user` for freelancers/students and `client` for clients; the
JWT is stored in `localStorage` and sent as a bearer token on every request.

The endpoints that were previously missing (single job details, saved jobs,
reports, notifications, chat messages) now exist on the backend and are wired up.
Anything still rendering sample data is tracked in
[`docs/DEMO_GAPS.md`](docs/DEMO_GAPS.md).

## Styling

Tailwind CSS with the brand palette defined in `tailwind.config.js`
(`primary` = `#0C9892`). Shared button/input/card styles live in
`src/styles/index.css`; page-specific layout stays in each component's scoped
`<style>`.
