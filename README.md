# Facility Check-In PWA

A static-only Next.js app for checking a gym member into a facility by scanning a QR code or manually entering a facility ID.

## Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:3000`. Manual entry works without a camera; use `facility-001` to check in successfully.

## Camera And HTTPS

Browser camera APIs require a secure context. `localhost` is usually treated as secure on desktop browsers, but real mobile-device testing commonly needs HTTPS and a certificate the device trusts.

Simple local HTTPS for desktop testing:

```bash
bun run dev:https
```

Open `https://localhost:3000` and accept the browser certificate warning if prompted.

For phone testing on the same network, install and trust a local mkcert authority once:

```bash
brew install mkcert
mkcert -install
```

Then run the live Next dev server with a certificate that includes your Mac LAN IP:

```bash
bun run dev:phone
```

The script detects your Mac LAN IP, regenerates `.certificates/local.pem` with that IP, copies `.certificates/mkcert-rootCA.cer` for phone installation, and starts Next with `NEXT_ALLOWED_DEV_ORIGINS` set. Then open the printed `https://<your-mac-lan-ip>:3000` URL from the phone. The browser still controls camera permission; allow camera access when prompted. If the camera is unavailable or permission is denied, the manual facility-code form remains available.

The easier phone path is the static preview, because it avoids Next dev HMR and dev-origin checks:

```bash
bun run build
bun run serve:phone
```

Open the printed `https://<your-mac-lan-ip>:4173` URL on the phone. This is the recommended local phone test for the check-in flow.

## QR Codes

QR content can be plain facility ID text:

```text
facility-001
```

Generate static test QR images from the bundled facility data:

```bash
bun run qr:generate -- --input src/data/facilities.json --output public/qr/facilities
```

That writes one QR image per facility plus `public/qr/facilities/manifest.json`. The project-local QR generation workflow is documented in `.ai/skills/qr-generator.md`.

## Verification

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

`bun run build` uses `next.config.ts` with `output: 'export'` and writes the static site to `out/`.

## Offline Behavior

- The app registers `public/sw.js` on HTTPS, localhost, or `127.0.0.1`.
- `bun run build` injects a versioned precache list into `out/sw.js` from the static export output, including the app shell, Next static assets, manifest, icons, and generated QR assets.
- After one successful production load with the service worker active, reloads can fall back to the cached app shell and bundled data so manual check-in continues offline.
- Camera scanning may still depend on browser permission, secure context, and device support. Offline manual entry is the reliable recovery path.

## Architecture

- `src/app/(checkin)/page.tsx` is thin and renders `FacilityCheckInPage`.
- `src/lib/checkIn` owns domain types, local data wrappers, check-in validation, reducer state, and the flow hook.
- `src/components/checkIn` owns feature UI for scanner, manual entry, member summary, recovery messages, loading, and confirmation.
- `src/components/ui` contains adapted shared primitives with Storybook coverage.
- `public/manifest.webmanifest`, `public/icons`, and `public/sw.js` provide installable PWA basics for a static export. Regenerate PNG icons with `bun run icons:generate`.

## Assistant Documentation

Assistant-facing guidance starts at `AI_GUIDELINES.md`. `AGENTS.md` is kept as a thin compatibility entrypoint for coding agents and should point back to that file.

Durable project memory lives in `.ai/project-memory.md`, and task-specific assistant workflows live under `.ai/skills/`. Keep detailed assistant instructions out of the README so this file stays focused on running, testing, and understanding the app.

## Scope Notes

- The app is static-only and uses bundled member and facility data. Check-in confirmation is browser-local and does not persist to a backend.
- Manual entry is the reliable fallback when camera permission, HTTPS, or device support blocks QR scanning.
- The service worker is intentionally lightweight and static-export friendly. Offline reload works after one successful production load with the service worker active.
- Generated QR images are test/demo assets; runtime validation uses bundled facility IDs.
