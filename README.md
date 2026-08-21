# Together Strong v0.4.8

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

## v0.4.3 cache + demo fix
- Visible v0.4.3 EXACT DEMO BUILD banner at the top.
- Day 1 curated exercises use YouTube thumbnails on the workout cards.
- Day 1 #2 thumbnail is explicitly the kettlebell glute bridge video thumbnail.
- Exact video opens first in How To.
- Old service workers and caches are removed automatically during beta testing.
- Service worker is temporarily disabled from caching so GitHub updates cannot be hidden by an old PWA cache.


## v0.4.3 hotfix
- Fixed JavaScript syntax errors that prevented the app from initializing.
- Buttons, scrolling, workout rendering, and demo loading can initialize again.
- Retains curated exact-video thumbnails and embedded YouTube demo behavior.


## v0.4.4 audited build
- Removed a duplicate YouTube-player HTML ID found during testing.
- Made local storage fail-safe so a storage error cannot freeze the app.
- Replaced all six Day 1 curated video IDs with verified exact exercise videos.
- Confirmed Day 1 #2 is an actual kettlebell glute bridge.
- Confirmed Day 1 #3 is a bench-supported one-arm kettlebell row.
- Confirmed Day 1 #4 is a kettlebell floor press.
- Confirmed Day 1 #5 is a kettlebell pullover performed on a bench.
- Confirmed Day 1 #6 is a one-sided kettlebell suitcase carry.
- Disabled normal PWA caching during beta testing to make GitHub updates visible immediately.


## v0.4.7 demo priority rule
- Exact exercise-library demonstrations now take priority over YouTube when both the movement and equipment match.
- Kettlebell Goblet Squat therefore uses the matching kettlebell library thumbnail/animation instead of the previous long YouTube video.
- YouTube is fallback-only when no accurate library demo exists.
- New YouTube fallbacks must be short and direct, with a target maximum length of 30 seconds, and should avoid long intros or ad-heavy demonstrations.
- The How-To panel opens the library demo first whenever the library match is exact.


## v0.4.7 demo behavior
Each exercise now shows two visual choices: a Quick Demo using the closest exercise-library animation (equipment does not need to be exact), and a YouTube Detail option. Curated YouTube videos are used where available; otherwise the YouTube option opens an exact exercise search.


## v0.4.7 quick-demo correction

- Quick Demo matching is now movement-first; equipment is only a tie-breaker.
- Kettlebell Glute Bridge explicitly accepts a correct glute-bridge animation even if the library demo uses a barbell, dumbbell, or bodyweight.
- Glute-bridge written instructions are fixed and no longer inherit instructions from an unrelated library animation.
- Regression test added so a kettlebell side bend/windmill cannot outrank a real glute bridge.


## v0.4.8 full demo audit
- Quick Demo is movement-guarded for all 24 programmed exercises. Different equipment is allowed; a different movement is not.
- Unrelated library animations are rejected instead of being shown as a refresher.
- All 24 programmed exercises now have exercise-specific written form steps so instructions never inherit from a mismatched library variation.
- Glute bridge regression remains protected.
