# SkillLink frontend — architecture & onboarding guide

This guide is written for developers who are **new to Vue** or new to this
project. Read it once and you'll know where everything lives and how a screen
talks to the backend.

---

## 1. The stack in one minute

- **Vue 3** with the **Options API** (the `data() {}` / `methods: {}` style). A
  few new files use the **Composition API** (`setup()`); both work together.
- **Vue Router** for navigation between pages.
- **Vite** as the dev server and bundler.
- **Tailwind CSS** for utility classes, plus per-component `<style scoped>`.
- **axios** for HTTP requests.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

---

## 2. Folder map

```
src/
├─ main.js              # app entry: creates the Vue app, installs the router
├─ App.vue              # root component: <router-view> + global Chatbot + ToastHost
├─ router/index.js      # all routes + the auth guard (who can open what)
├─ api/                 # backend calls, one file per resource (see §3)
│  ├─ apiClient.js        # the shared axios instance (base URL, token, errors)
│  ├─ auth.js / user.js / client.js / common.js  # endpoints per resource
│  └─ index.js            # barrel: import { userAPI } from '@/api'
├─ composables/         # reusable logic shared across components (see §5)
│  ├─ useAuth.js          # login / register / logout + session state
│  ├─ useAsync.js         # removes loading/try-catch boilerplate around API calls
│  ├─ useToast.js         # app-wide pop-up messages (use instead of alert())
│  └─ useNotifications.js # shared state for the navbar notification bell
├─ components/          # reusable UI: Navbar, ClientNavbar, Chatbot, ToastHost
└─ views/              # one component per routed page (the actual screens)
public/assets/          # images, served at /assets/...
docs/                   # this guide, the API snapshot, and gap/missing notes
```

**Rule of thumb:** a *view* is a page you can navigate to; a *component* is a
reusable piece used inside views; a *composable* is reusable JavaScript logic
(no template) shared across many components.

---

## 3. How a screen talks to the backend

Never call axios or write a URL inside a view. Instead:

1. Open the matching file in `src/api/` and find (or add) the method you need.
   Each resource has its own file — `auth.js`, `user.js` (freelancer),
   `client.js`, `common.js` (shared chat + notifications) — and they all share
   the single axios instance in `apiClient.js`. Import the group you need from
   the `@/api` barrel:
2. Import the group and call it:

```js
import { userAPI } from '@/api'

export default {
  data() {
    return { jobs: [], loading: true }
  },
  async mounted() {
    try {
      const { data } = await userAPI.getSavedJobs()
      this.jobs = data.data          // backend wraps payloads as { success, data }
    } catch (err) {
      // show an empty state instead of crashing
    } finally {
      this.loading = false
    }
  }
}
```

> **Backend response shape:** almost every endpoint returns
> `{ "success": true, "data": ... }`. So you usually want `response.data.data`.

### Switching backends
`api/apiClient.js` reads `VITE_API_BASE_URL` from your `.env` (copy `.env.example`). Leave
it unset to use the deployed server, or point it at your local API:
```ini
VITE_API_BASE_URL=http://localhost:3003
```

---

## 4. Auth & route protection

- **`composables/useAuth.js`** holds the session: the JWT token and the logged-in
  user, both mirrored into `localStorage` so a refresh keeps you logged in. It
  exposes `login()`, `register()`, `logout()`, `isAuthenticated`, and `userType`.
- **`router/index.js`** guards every route using a `meta.audience` field:
  - `'public'` — auth screens (login/signup); logged-in users get redirected to
    their dashboard.
  - `'student'` / `'client'` — only that account type may open the route.
  - `'any'` — any logged-in user.
- The backend calls freelancers/students `type: "user"` and employers
  `type: "client"`. Keep that mapping in mind when reading the code.

---

## 5. The shared composables (use these!)

These exist so you don't copy-paste the same logic into every screen.

### `useToast()` — pop-up messages
```js
import { useToast } from '@/composables/useToast'
const toast = useToast()
toast.success('Saved!')
toast.error('Something went wrong.')
```
Prefer this over `alert(...)`. The messages render via `<ToastHost />` in
`App.vue`, so they work on every page automatically.

### `useAsync(fn)` — loading/error without boilerplate
```js
import { useAsync } from '@/composables/useAsync'
const { data, loading, error, run } = useAsync(() => userAPI.getMyProfile())
run()  // loading flips to true, then data/error fill in
```

### `useNotifications()` — the navbar bell
Shared state for the notification dropdown. Call `load()` on mount, `markRead(id)`
when a notification is opened. The badge count and list stay in sync across the
freelancer and client navbars.

> **Why singletons?** `useToast` and `useNotifications` keep their state in a
> single module-level object, so every component that imports them sees the same
> data. `useAuth` works the same way for the session.

---

## 6. Styling conventions

- Brand colour is teal **`#0C9892`** (set as Tailwind `primary` in
  `tailwind.config.js`).
- Shared button/input/card classes live in `src/styles/index.css`.
- Page-specific layout stays in each component's `<style scoped>` block so it
  can't leak into other screens.

---

## 7. What isn't wired yet

Some screens still render hardcoded sample data, and a few features depend on
backend endpoints that don't exist yet. Before a demo, read
[`DEMO_GAPS.md`](DEMO_GAPS.md) — it lists exactly what works end-to-end, what is
still mock, and what to avoid clicking on stage.
