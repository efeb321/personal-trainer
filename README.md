# Together Strong — v0.7

Partner-first garage gym PWA for Eli & Rochelle. Static site, installable to phone home screen.

## What's in this version

- **875-exercise library**, sourced and cross-verified against a real structured exercise dataset
  (equipment, primary/secondary muscles) — includes your Olympic barbell as equipment distinct
  from the Smith machine's fixed rail.
- **Balanced full-body program design**: all 9 muscle groups get genuinely even weekly coverage
  (no group weighted above another), 4 days/week, verified across a 16-week simulation.
- **Anti-repetition**: the app now remembers what you actually did in recent weeks and steers
  the generator away from repeating it, so the depth of the library gets used over time.
- **Day 5 — Recovery/Stretch**: 28 real stretches, rotates to a fresh 8 daily.
- **Day 6 — Glutes/Back/Legs/Core**: usable any time, picks a fresh 8 exercises every calendar day.
- **Blacklist**: permanently exclude an exercise from auto-selection ("Not for me").
- **Personal records**: flags a new max weight/reps automatically when logged.
- **Deload weeks**: every 6th week is flagged as a planned lighter week.
- **Time-crunch mode**: trim today's workout on demand, restore any time before it's logged.
- **Progress chart**: simple weight-over-time view per person/exercise (My Data tab).
- **Backup/restore**: download your full history as a file, restore it on another device or after
  a cleared cache.

## Files
- `index.html` — app shell, UI, all interactive logic
- `exercise-library.js` — 875 tagged exercises
- `generator.js` — weekly program builder, substitute engine, Day 5/6 builders
- `progression.js` — per-person weight/reps progression tracker
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`

## Data source note
The exercise library's names, equipment, and muscle tags are cross-checked against a public-domain
structured exercise dataset. The Quick Demo images/animations come from a separate exercise
database at runtime — most exercises will have a demo; a small number may show "No verified
demo — use YouTube" if there's no confident match, by design (better to show nothing than the
wrong movement).
