# Workout Log Notes

This mini-app is intentionally static and local-only.

## Files

- `public/workout-log.html`: main logging page.
- `public/workout-stats.html`: current-state summary page.
- `public/workout-log/data.js`: shared workout plan, storage key, normalization, and summary helpers.
- `public/workout-log/app.js`: main log UI behavior.
- `public/workout-log/stats.js`: stats page behavior.
- `public/workout-log/quotes.js`: editable quote deck.

## Storage

- `localStorage` key: `workout-log-state-v2`
- State is browser-local. Nothing syncs anywhere.
- The stats page reads the same local state as the log page.

## Behavior

- Lifting days and conditioning are separate views.
- Weekly stats are only a summary of the current browser state.
- Quotes are plain objects with `text` and `author`.
- Reset only clears the currently active lifting day.

## Editing Guardrails

- Keep this app framework-free and easy to inspect in the browser.
- Prefer small static JS files over adding React or a build step.
- If storage shape changes, keep a migration path in `normalizeState()`.
