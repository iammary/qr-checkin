# Project Memory

This document captures durable lessons for the Facility Check-In PWA. Keep personal machine paths, credentials, and one-off scratch notes out of this file.

## Project Snapshot

- This is a single static-only Next.js App Router app at the repository root.
- Core stack: Next.js, React, TypeScript strict mode, Bun, Tailwind CSS, Vitest, React Testing Library, Storybook, and a hand-rolled static service worker.
- The app validates facility IDs against bundled JSON facility data in `src/data`.
- There is no backend, API route layer, auth service, database, cloud infra, mobile shell, or seed machinery.
- Static export is required through `next.config.ts` with `output: 'export'`.

## Frontend Lessons

- Keep scanner/camera behavior isolated behind a QR scanner component. Check-in validation and result creation belong in pure domain helpers.
- For enum-like domain strings, use exported uppercase `as const` objects with derived value-union type aliases instead of hand-written string unions.
- Manual facility-code entry is the reliability path and must stay visible even when camera permission, secure context, or device support fails.
- Offline UI should be explicit: bundled manual validation can work after the app is loaded; camera access still depends on browser/device behavior.
- Keep front-facing app copy free of local development details such as HTTPS, localhost, secure contexts, or dev commands; reserve that guidance for README and developer docs.
- Shared UI components live under `src/components/ui/<ComponentName>/` with colocated stories and tests where useful.
- Use semantic tones for check-in states: `success` for confirmed entry, `warning` for offline or permission recovery, `danger` for invalid codes, and `info` for scanner guidance.
- Keep page files as orchestration. Feature presentation belongs under `src/components/checkIn`, and domain state belongs under `src/lib/checkIn`.

## Verification

- Local quality gate: `bun run lint`, `bun run test`, and `bun run build`.
- Camera testing needs HTTPS. `bun run dev:https` covers local desktop secure context; real-device testing may require a trusted local certificate and a host reachable from the device.
