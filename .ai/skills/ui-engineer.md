# UI Engineer Skill

Use this when editing shared UI components, Storybook stories, visual states, or reusable frontend conventions in this static PWA.

## Workflow

1. Read `AI_GUIDELINES.md` and `.ai/project-memory.md`.
2. Inspect the existing component folder before changing a shared component API.
3. Prefer existing primitives and semantic props before adding bespoke markup.
4. Keep `className` root-only on shared components.
5. Keep pages focused on hooks, state, handlers, and composition.
6. Move design-heavy JSX into named presentational components under `src/components/checkIn` or `src/components/ui`.
7. Update stories and tests when a shared component prop, visual state, or theme behavior changes.
8. Do a second pass for anonymous wrappers, hardcoded reusable styling, nested cards, and light/dark regressions.

## Shared UI Rules

- Shared UI components live in `src/components/ui/<ComponentName>/` with implementation, story, test, and `index.ts` when practical.
- Use `Typography` for repeated text scale/tone decisions.
- Align status surfaces across `Alert`, `Badge`, `Button`, and `Card`: `info`, `success`, `warning`, and `danger`.
- Avoid card-on-card composition. Use dividers, gaps, and lightweight bordered rows inside a surface.
- Prefer icons from `lucide-react` for visible actions and status affordances.
- New shared UI treatments should work in light and dark themes unless intentionally documented otherwise.

## Storybook Expectations

- Stories should show supported tones, sizes, variants, important states, and light/dark behavior.
- Foundation-style stories should be documentation galleries rather than elaborate demos.
- Stories must render the real component contract, not hide it behind story-only wrappers.
