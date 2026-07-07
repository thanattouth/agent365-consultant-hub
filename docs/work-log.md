# Work Log

## 2026-07-07

### Changed

- Replaced the larger consultant mode card panel with a compact segmented mode switcher.
- Kept production mode guidance available through button titles and the current focus summary instead of dense selector content.
- Updated the active mode summary to show the expected production outcome for the selected path.

### Why

Mode choice affects answer scope, auditability, evaluation, and safety, but the selector should stay lightweight enough for frequent chat use.

### Verified

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser desktop check confirmed the compact switcher renders 4 consultant mode buttons, shows the active Architect mode, and includes production outcome text in the current focus summary.
- Browser interaction check confirmed selecting Security updates the active mode and current focus summary.
- Mobile viewport check at 390x844 confirmed sidebar is hidden, mobile navigation is visible, the compact mode switcher remains usable, and the composer remains present.

### Risks And Follow-Up

- The current mode guidance is static and should later connect to policy, evaluation, and routing metadata.

### Changed

- Added `SKILL.md` as the project working skill and delivery charter.
- Started the modern application scaffold with Next.js, TypeScript, React, and a neumorphic Agent365 chat shell based on the provided design reference.
- Added a mock `/api/chat` endpoint with request validation and citation-shaped responses.
- Added Phase 0 product definition and architecture notes.

### Why

The project needs a stable product and engineering foundation before connecting Microsoft cloud services. The first slice keeps UI, domain contracts, and API boundaries maintainable while preserving the production-grade roadmap.

### Verified

- `npm install` completed and generated `package-lock.json`.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed with Next.js 15.5.20.
- Local dev server started at `http://localhost:3000`.
- Browser check confirmed the desktop UI renders key Agent365 content, the composer exists, and a mock chat request adds an assistant response with citations.
- Mobile viewport check at 390x844 confirmed the sidebar is hidden, mobile navigation is visible, and the composer is present.

### Risks And Follow-Up

- `npm audit --omit=dev` reports 2 moderate production dependency findings through `next -> postcss`. `npm audit fix --force` currently recommends a breaking downgrade path, so it was not applied.
- The mock chat endpoint must be replaced with a real orchestrator path in a later phase.
- Evaluation datasets and automated tests are not implemented yet.
