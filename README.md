# Together Strong v0.4.2

A partner-first PWA workout tracker for Eli and Rochelle.

## Deploy to GitHub Pages

1. Create a new GitHub repository, for example `together-strong`.
2. Upload every file in this folder to the repository root:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
3. In GitHub: Settings → Pages.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then Save.
6. After GitHub publishes the site, open the Pages URL in Safari on iPhone.
7. Share → **Add to Home Screen**.

## What works in v0.1

- Week 1 / four workout days
- Eli + Rochelle / one-person / missed-workout attendance
- Separate weights, reps, and Easy/Good/Hard/Pain feedback
- Exercise demonstrations and instructions from the external exercise dataset
- Exercise substitution suggestions
- Local saving on the device
- Installable PWA shell
- Basic offline caching after resources have been viewed

## Important
The workout app does not diagnose or treat injuries. If an exercise causes sharp, increasing, or joint pain, stop it and substitute a comfortable movement. Persistent shoulder, knee, back, or SI-joint symptoms should be discussed with a qualified clinician.

## New in v0.2 — Custom Routine Builder
- Tap **Build My Routine**
- Search/filter the full exercise library
- Tap an exercise image to preview its demonstration
- Add any exercise to your own routine
- Set your own sets and reps
- Save multiple custom routines locally
- Start a saved routine with the same Eli/Rochelle tracking
- Delete routines you no longer want


## v0.3 changes
- Corrected Day 1 demo matching to prioritize exact equipment.
- Day 1 #2 now requires a kettlebell glute-bridge match.
- Day 1 #5 changed to a kettlebell pullover from bench.
- Day 1 #6 no longer falls back to a two-weight farmer carry.
- Substitute now searches across all equipment, not just the original equipment type.
- Equipment filters inside Substitute.
- Search inside Substitute.
- Up to 60 alternatives instead of six.
- Every substitute has Preview Demo before selection.
- Supported/seated variations are labeled when detected.


## v0.4 Hybrid Demo System
- Hand-checked exact YouTube demonstrations can be embedded inside the app when the GIF library is not exact enough.
- Day 1 overrides: Goblet Squat, Kettlebell Glute Bridge, Kettlebell Floor Press, Kettlebell Pullover, Kettlebell Suitcase Carry.
- When both sources exist, switch between Exact Video and Library Animation.
- Substitute exercises use each library exercise's own animation and can be previewed before selection.


## v0.4.1 fixes

- Day 1 cards now show the curated exact-video thumbnail when an exact YouTube demo is available.
- The How-To screen opens the exact embedded YouTube video first.
- Library animation is secondary/optional and accessible through a separate tab.
- Exact-video badge appears on the workout card.
- Closing the How-To panel stops the YouTube player.
- Beta cache changed to network-first so GitHub updates appear much more reliably.

## v0.4.2 cache + demo fix
- Visible v0.4.2 EXACT DEMO BUILD banner at the top.
- Day 1 curated exercises use YouTube thumbnails on the workout cards.
- Day 1 #2 thumbnail is explicitly the kettlebell glute bridge video thumbnail.
- Exact video opens first in How To.
- Old service workers and caches are removed automatically during beta testing.
- Service worker is temporarily disabled from caching so GitHub updates cannot be hidden by an old PWA cache.
