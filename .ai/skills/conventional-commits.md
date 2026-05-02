---
name: conventional-commits
description: Use when creating, amending, or suggesting Git commit messages so repository history follows Conventional Commits.
---

# Conventional Commits

Use this when preparing, creating, amending, or suggesting Git commits.

## Commit Message Format

Use Conventional Commits:

```text
<type>(optional-scope): <description>
```

Examples:

```text
feat: add manual check-in flow
fix(scanner): disable camera mode after startup failure
refactor(types): derive enum types from constants
ci: add pull request verification
docs: clarify offline behavior
```

## Type Selection

- `feat`: user-facing capability or behavior.
- `fix`: bug fix or regression correction.
- `refactor`: internal code change without behavior change.
- `test`: test-only change.
- `docs`: documentation-only change.
- `ci`: GitHub Actions, Vercel, or pipeline config.
- `build`: build tooling, package scripts, dependency setup, generated build-support scripts.
- `chore`: maintenance that does not fit the above.
- `style`: formatting-only change with no code behavior impact.
- `perf`: performance improvement.

## Workflow

1. Inspect `git status --short` and the staged diff before committing.
2. Choose the narrowest accurate type and optional scope.
3. Keep the subject lowercase after the colon unless a proper noun or code token requires casing.
4. Keep the subject imperative and concise, usually under 72 characters.
5. Do not use emoji prefixes in commit messages.
6. When amending a commit that has already been pushed, mention that the branch will need `git push --force-with-lease`.
