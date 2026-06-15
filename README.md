# Production Architecture (Expo / React Native)

A reference **React Native + Expo** app that demonstrates how I structure a
production-grade mobile codebase: clean layering, typed data flow, real
loading/empty/error states, an auth gate, and unit-tested business logic. The
feature itself (a small team task manager) is deliberately simple, the point is
the **architecture around it**.

Stack: **Expo Router** (typed file-based routes) · **TypeScript** (strict) ·
**Zustand** (client state) · **React Query** (server state) · a typed
`ApiClient` with retry/timeout/error mapping · **Jest** unit tests.

## Demo

![Demo](screenshots/demo.gif)

A walkthrough of every screen - sign in, task list with summary stats, task
detail, the create-task modal, profile, and the shared error state.

## Screenshots

| Sign in | Tasks list | Task detail |
| --- | --- | --- |
| ![Sign in](screenshots/01-sign-in.png) | ![Tasks](screenshots/02-tasks.png) | ![Detail](screenshots/03-task-detail.png) |

| New task (modal) | Profile | Error state |
| --- | --- | --- |
| ![New task](screenshots/04-new-task.png) | ![Profile](screenshots/05-profile.png) | ![Error](screenshots/06-error-state.png) |

Real captures from the iOS Simulator.

## What it shows

- **Feature-based structure** - each feature owns its model, API, store and
  hooks. No god `utils/` or `screens/` dumping ground.
- **Server state vs client state** - React Query owns fetched data (caching,
  refetch, invalidation); Zustand owns session/UI state. They are not mixed.
- **A typed data layer** - one `ApiClient` centralises base URL, auth header,
  timeout and bounded retry with backoff. Feature API modules map server DTOs
  into domain models, so `snake_case`/nullable wire shapes never reach the UI.
- **Errors as data** - the API layer returns a `Result<T, AppError>` instead of
  throwing across boundaries. One `AppError` shape, one place that turns an
  error into user copy.
- **Every list has three states** - loading, empty and error are rendered by a
  single shared `StateView`, driven by React Query status.
- **An auth gate in one place** - the root layout redirects based on session +
  route group. Screens never check auth themselves.
- **Design tokens** - color/spacing/radius/type live in one file, so a design
  system change from Figma is a single edit.
- **Tested business logic** - DTO mappers, sorting and the client retry policy
  are unit-tested without a UI or a network.

## Architecture

```
app/                         Expo Router routes (the UI shell)
  _layout.tsx                providers (React Query) + AUTH GATE
  index.tsx                  splash -> redirect by session
  sign-in.tsx                public route
  (tabs)/                    authenticated area
    index.tsx                tasks list (loading/empty/error/data)
    profile.tsx              user + sign out
  task/[id].tsx              typed dynamic route
  new-task.tsx               create form (modal)

src/
  lib/result.ts              Result<T> + AppError + user-facing messages
  theme/tokens.ts            design tokens (single source of truth)
  api/
    client.ts                typed HTTP client: auth, timeout, retry, mapping
    mockBackend.ts           fetch-compatible in-memory server (DTOs + latency)
    services.ts              composition root - wires everything once
  components/                Screen, Button, TextField, TaskCard, StateView
  features/
    auth/                    model · authStore (persisted) · api · hooks
    tasks/                   model + mapper · api · React Query hooks

__tests__/                   mapper + client policy unit tests
```

Data flow for one screen:

```
Screen -> useTasks() (React Query) -> TasksApi -> ApiClient -> fetch
   ^                                     |
   |          domain Task  <-- toTask() (DTO mapper)
   render loading/empty/error/data
```

### Why this scales

- A new feature is a new folder under `features/` + a route file. Nothing
  existing changes.
- Swapping the mock backend for the real API is **one line** in `services.ts`
  (drop `createMockFetch()`, point `baseUrl` at the server). No screen edits.
- Cross-cutting concerns (auth header, retry, error copy) each live in exactly
  one file, so they are changed once, not hunted across screens.

## Run

```bash
npm install
npx expo start        # press i for iOS, a for Android
```

Demo credentials are pre-filled on the sign-in screen - tap **Sign in**. The app
runs fully on the mock backend, no server or API keys required.

```bash
npm test              # unit tests (mappers, sort, client retry)
npm run typecheck     # tsc --noEmit, strict
```
