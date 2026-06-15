# Screenshot regeneration flow

The images in `screenshots/` are real captures from the iOS Simulator. The app
is pure JS on a mock backend, so it runs in **Expo Go** - no native build.

## Steps

1. Boot a simulator and open it:

   ```bash
   xcrun simctl boot "iPhone 17 Pro"
   open -a Simulator
   ```

2. Install deps and start Metro, then open in Expo Go on the booted simulator:

   ```bash
   npm install
   npx expo start --ios
   ```

   (Or run `npx expo start` and press `i`.)

3. Capture each screen with the simulator UDID-agnostic helper:

   ```bash
   xcrun simctl io booted screenshot screenshots/01-sign-in.png
   # tap Sign in, then:
   xcrun simctl io booted screenshot screenshots/02-tasks.png
   # tap a task:
   xcrun simctl io booted screenshot screenshots/03-task-detail.png
   # back, tap "+ New":
   xcrun simctl io booted screenshot screenshots/04-new-task.png
   # Profile tab:
   xcrun simctl io booted screenshot screenshots/05-profile.png
   ```

4. The error state is captured by forcing the first task read to fail. In
   `src/api/services.ts` set `createMockFetch({ failNextReads: 1 })`, reload,
   then:

   ```bash
   xcrun simctl io booted screenshot screenshots/06-error-state.png
   ```

   Revert the change afterwards.

## How it works

- `src/api/mockBackend.ts` is a `fetch`-compatible in-memory server seeded with
  demo tasks, so every screen is populated on a fresh install - the same data
  shown in the screenshots.
- Sign-in credentials are pre-filled, so the whole flow is tap-through on a
  simulator with no backend.
