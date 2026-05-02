# AI Coding Guidelines

## Project Memory

Before changing the project, review [`.ai/project-memory.md`](.ai/project-memory.md). Assistant-specific entrypoints such as `AGENTS.md` should stay thin pointers to this shared guidance.

When a task touches shared UI primitives, Storybook coverage, or reusable frontend conventions, read [`.ai/skills/ui-engineer.md`](.ai/skills/ui-engineer.md). When generating QR image assets from JSON, read [`.ai/skills/qr-generator.md`](.ai/skills/qr-generator.md). When creating, amending, or suggesting Git commit messages, read [`.ai/skills/conventional-commits.md`](.ai/skills/conventional-commits.md).

## TypeScript And Structure

- Prefer inferred return types unless an explicit annotation materially improves safety.
- Use named exports except for Next.js-required default exports.
- Next.js-required default exports must still export arrow-function components.
- Use arrow functions for functions and components.
- Do not use `React.FC` or default `React` imports.
- Prefer exported uppercase `as const` objects plus derived type aliases for enum-like string sets. Use uppercase object names and keys, for example `MEMBERSHIP_STATUS.ACTIVE`, and derive types from object values instead of hand-written string unions.
- Keep route `page.tsx` files thin; render a named page component.
- Put domain logic in `src/lib`, hooks in `src/hooks` or a domain folder, shared UI in `src/components/ui`, and feature UI in `src/components/checkIn`.
- Shared domain type files should use a `.type.ts` suffix.
- Tests must be colocated with the file under test.

## Frontend Standards

- This is a static-only Next.js App Router PWA. Do not add API routes, server actions, databases, auth services, tRPC, AWS, DynamoDB, mobile shell, Capacitor, OTA, or infra unless the project scope changes explicitly.
- Tailwind CSS is the primary styling layer.
- Keep global CSS limited to tokens, base styles, and app-wide PWA polish.
- Use semantic UI primitive props such as `tone`, `variant`, `size`, and `surface` before caller-side class bundles.
- Treat shared component `className` as root-only.
- Avoid nested cards; prefer one primary surface plus dividers or lightweight rows.
- Support light and dark themes for shared UI treatments.

## Tooling

- Use Bun as the package manager.
- Run the app with `bun run dev`.
- Use `bun run dev:https` when testing camera access in a secure local context.
- Static deployment is produced by `bun run build`, which uses `next.config.ts` with `output: 'export'`.

## Testing

- Use Vitest with globals, React Testing Library, and `happy-dom`.
- Do not import `describe`, `it`, `expect`, or `vi` in tests.
- Prefer behavior, state, validation, and accessibility tests over static class assertions.
- Mock camera scanner boundaries rather than brittle browser camera APIs.
- Run `bun run lint`, `bun run test`, and `bun run build` before handing off substantial changes.

## PWA And Offline

- Keep required check-in data bundled locally so manual check-in can work offline after the app loads.
- The service worker should cache the app shell and same-origin static assets for repeat offline visits.
- Camera scanning depends on browser/device support, HTTPS, and user permission; always keep manual entry visible as the recovery path.
